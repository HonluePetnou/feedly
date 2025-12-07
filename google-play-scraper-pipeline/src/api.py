import re
from fastapi import FastAPI, HTTPException, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
from google_play_scraper import search
import configparser


# Modules internes
from src.scraper.scraper_module import collect_reviews
from src.pipeline.loader import load_reviews_to_db
from src.pipeline.cleaner import process_dataframe
from src.database.db_manager import get_db
from src.database.models import Application, Review
from src.tasks import task_scrape_full_history
from src.rag import ask_gemini_about_reviews        # Pour appeler l'IA




# --- CHARGEMENT CONFIGURATION ---
config = configparser.ConfigParser()
config.read('config/settings.ini')
ONBOARDING_LIMIT = int(config['LIMITS']['onboarding_count'])

app = FastAPI(
    title="Google Play Monitoring API",
    description="API Hybride avec résolution intelligente des noms d'apps."
)

class ChatRequest(BaseModel):
    app_id: str      # ex: com.whatsapp
    question: str    # ex: "Quels sont les problèmes principaux ?"

class AppRequest(BaseModel):
    query: str  # On renomme 'app_id' en 'query' car ça peut être un nom ou une URL

def resolve_app_id(user_input: str) -> str:
    """
    Transforme n'importe quelle entrée (Nom, URL, ID) en un App ID valide.
    Version corrigée et robuste.
    """
    user_input = user_input.strip()

    # CAS 1 : C'est une URL Google Play
    if "play.google.com" in user_input:
        match = re.search(r'id=([a-zA-Z0-9_.]+)', user_input)
        if match:
            print(f"🔍 [Resolver] URL détectée. ID extrait : {match.group(1)}")
            return match.group(1)
        # Si on a une URL mais pas d'ID, on continue au cas où...

    # CAS 2 : Recherche par NOM (ou tentative de correction)
    # Si ça contient des espaces OU n'a pas de point (ex: "Clash of Clans", "Tiktok")
    if " " in user_input or "." not in user_input:
        print(f"🔍 [Resolver] Recherche du nom '{user_input}' sur le Store...")
        
        try:
            # On met un try/except car la librairie search peut planter en interne
            results = search(user_input, lang='fr', country='fr', n_hits=1)
            
            # DEBUG : On affiche ce que Google nous a renvoyé pour comprendre
            print(f"👀 [Debug] Résultat recherche : {type(results)}")

            # Vérification stricte : est-ce une liste ? est-elle non vide ?
            if results is None or not isinstance(results, list) or len(results) == 0:
                print(f"⚠️ Aucun résultat trouvé pour '{user_input}'")
                raise HTTPException(status_code=404, detail=f"Application '{user_input}' introuvable sur le store.")
            
            # Si on est ici, on est sûr que results[0] existe
            found_id = results[0]['appId']
            print(f"✅ [Resolver] Trouvé : {results[0]['title']} -> ID: {found_id}")
            return found_id

        except HTTPException as he:
            raise he
        except Exception as e:
            print(f"❌ [Resolver] Erreur interne lors de la recherche : {e}")
            # En cas de crash de la recherche, on suppose que l'utilisateur a peut-être donné un ID valide
            # et on tente le coup (failover)
            return user_input

    # CAS 3 : C'est probablement déjà un ID (ex: com.whatsapp)
    return user_input
@app.get("/")
def read_root():
    return {"status": "online", "message": "API prête 🚀"}


#voici le endpoint add-app pour lancer le scraping rapide
@app.post("/add-app")
def add_application(request: AppRequest):
    """
    Endpoint intelligent : Accepte Nom, URL ou ID.
    """
    raw_input = request.query
    print(f"🌍 [API] Entrée utilisateur reçue : {raw_input}")

    try:
        # 1. RÉSOLUTION DE L'ID
        app_id = resolve_app_id(raw_input)

        # 2. Scraping Rapide
        print(f"⏳ [API] Scraping rapide pour l'ID : {app_id}")
        df = collect_reviews(app_id, count=200) # On récupère 200 avis, on peut modifier au besoin

        if df.empty:
            raise HTTPException(status_code=404, detail=f"Impossible de scraper l'application {app_id}.")

        # 3. Nettoyage & Sauvegarde
        df = process_dataframe(df)
        load_reviews_to_db(df, package_name=app_id)

        # 4. Tâche de fond
        task_scrape_full_history.delay(app_id)

        return {
            "status": "success",
            "message": f"Application ajoutée. ID résolu : {app_id}",
            "resolved_id": app_id, # Utile pour le frontend pour savoir quel ID a été trouvé
            "preview": {
                "reviews_count": len(df),
                "latest": df.iloc[0]['review_text'] if not df.empty else ""
            }
        }

    except HTTPException as e:
        raise e
    except Exception as e:
        print(f"❌ Erreur Serveur : {e}")
        raise HTTPException(status_code=500, detail=str(e))

# ... (Laissez le endpoint get-reviews tel quel) ...
@app.get("/get-reviews/{app_id}")
def get_reviews(app_id: str, limit: int = 100, db: Session = Depends(get_db)):
    app = db.query(Application).filter(Application.package_name == app_id).first()
    if not app:
        raise HTTPException(status_code=404, detail="App inconnue.")

    reviews = db.query(Review).filter(Review.app_id == app.id)\
              .order_by(Review.posted_at.desc()).limit(limit).all()
    
    return {
        "app_name": app.name,
        "reviews": [{"date": r.posted_at, "rating": r.rating, "content": r.content} for r in reviews]
    }

@app.post("/chat")
def chat_with_data(request: ChatRequest, db: Session = Depends(get_db)):
    """
    Pose une question à l'IA basée sur les avis réels stockés en base.
    """
    print(f"🤖 [Chatbot] Question reçue pour {request.app_id} : {request.question}")

    # 1. Récupérer l'ID interne de l'application
    app = db.query(Application).filter(Application.package_name == request.app_id).first()
    if not app:
        return {"error": "Application non trouvée. Veuillez d'abord l'ajouter via /add-app."}

    # 2. Récupérer les 50 derniers avis pertinents (nettoyés et récents)
    # On prend ceux qui ont un contenu textuel utile
    reviews = db.query(Review.content)\
        .filter(Review.app_id == app.id)\
        .filter(Review.content != None)\
        .order_by(Review.posted_at.desc())\
        .limit(50)\
        .all()
    
    if not reviews:
        return {"response": "Je n'ai pas trouvé assez d'avis pour analyser cette application."}

    # Convertir la liste d'objets en liste de textes simples
    reviews_text_list = [r.content for r in reviews]

    # 3. Envoyer à Gemini
    try:
        ai_response = ask_gemini_about_reviews(
            app_name=request.app_id,
            question=request.question,
            reviews_context=reviews_text_list
        )
        
        return {
            "app": request.app_id,
            "question": request.question,
            "response": ai_response,
            "analyzed_reviews_count": len(reviews_text_list)
        }

    except Exception as e:
        print(f"❌ Erreur Gemini : {e}")
        return {"error": "Le chatbot a rencontré un problème technique."}