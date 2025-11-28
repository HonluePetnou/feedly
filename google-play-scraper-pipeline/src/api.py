from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from src.scraper.scraper_module import collect_reviews
from src.pipeline.loader import load_reviews_to_db

# Initialisation de l'API
app = FastAPI(
    title="Google Play Monitoring API",
    description="API pour l'ajout dynamique et la surveillance d'applications."
)

# Modèle de données : Ce qu'on attend du Frontend
class AppRequest(BaseModel):
    app_id: str  # ex: com.tiktok.android

@app.get("/")
def read_root():
    return {"status": "online", "message": "API de Surveillance prête à l'emploi 🚀"}

@app.post("/add-app")
def add_application(request: AppRequest):
    """
    Endpoint d'On-Boarding (Temps Réel) :
    1. Reçoit un ID d'application.
    2. Scrape les 50 derniers avis (rapide).
    3. Initialise l'application en BDD.
    4. Renvoie un aperçu immédiat.
    """
    app_id = request.app_id.strip() # Nettoyage de l'entrée
    print(f"🌍 Requête API reçue : On-boarding de {app_id}")

    try:
        # --- ÉTAPE 1 : SCRAPING TEMPS RÉEL (Echantillon) ---
        # On limite à 50 pour que l'utilisateur n'attende pas plus de 2-3 secondes
        df = collect_reviews(app_id, count=50)

        if df.empty:
            raise HTTPException(status_code=404, detail=f"Impossible de trouver ou scraper {app_id}")

        # --- ÉTAPE 2 : SAUVEGARDE (Persistance) ---
        # C'est ici que la mémoire se crée pour le Dashboard
        load_reviews_to_db(df, package_name=app_id)

        # --- ÉTAPE 3 : RÉPONSE (Feedback Utilisateur) ---
        return {
            "status": "success",
            "message": f"Application {app_id} ajoutée au monitoring.",
            "data": {
                "reviews_collected": len(df),
                "latest_reviews": df[['user_name', 'rating', 'review_text']].head(3).to_dict(orient='records')
            },
            "next_step": "L'analyse complète de l'historique continuera en arrière-plan."
        }

    except Exception as e:
        print(f"❌ Erreur API: {e}")
        raise HTTPException(status_code=500, detail=str(e))