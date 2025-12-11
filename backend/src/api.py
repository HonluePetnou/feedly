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

# ------------------- Models -------------------
class ChatRequest(BaseModel):
    app_id: str      # ex: com.whatsapp
    question: str    # ex: "Quels sont les problèmes principaux ?"

class AppRequest(BaseModel):
    app_id: str
    country: str = "fr"
    count: int = 200  # Valeur par défaut

# ------------------- Helpers -------------------
def resolve_app_id(user_input: str) -> str:
    user_input = user_input.strip()
    # CAS 1 : URL
    if "play.google.com" in user_input:
        match = re.search(r'id=([a-zA-Z0-9_.]+)', user_input)
        if match:
            return match.group(1)
    # CAS 2 : Nom ou correction
    if " " in user_input or "." not in user_input:
        try:
            results = search(user_input, lang='fr', country='fr', n_hits=1)
            if not results or len(results) == 0:
                raise HTTPException(status_code=404, detail=f"Application '{user_input}' introuvable.")
            return results[0]['appId']
        except Exception:
            return user_input
    # CAS 3 : Probablement déjà un ID
    return user_input

# ------------------- Endpoints -------------------
@app.get("/")
def read_root():
    return {"status": "online", "message": "API prête 🚀"}

@app.post("/add-app")
def add_application(request: AppRequest):
    """
    Endpoint intelligent : Accepte Nom, URL ou ID.
    """
    raw_input = request.app_id
    country = request.country
    count = request.count

    print(f"🌍 [API] Entrée reçue : {raw_input} (Pays: {country}, Count: {count})")

    try:
        # 1. Résolution de l'ID
        app_id = resolve_app_id(raw_input)

        # 2. Scraping Rapide
        print(f"⏳ [API] Scraping rapide pour l'ID : {app_id}")
        df = collect_reviews(app_id, count=count, country=country)

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
            "resolved_id": app_id,
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
    app = db.query(Application).filter(Application.package_name == request.app_id).first()
    if not app:
        return {"error": "Application non trouvée. Veuillez d'abord l'ajouter via /add-app."}

    reviews = db.query(Review.content)\
        .filter(Review.app_id == app.id)\
        .filter(Review.content != None)\
        .order_by(Review.posted_at.desc())\
        .limit(50)\
        .all()

    if not reviews:
        return {"response": "Je n'ai pas trouvé assez d'avis pour analyser cette application."}

    reviews_text_list = [r.content for r in reviews]

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
