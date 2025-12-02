from fastapi import FastAPI
from app.core.config import settings
from app.db.base import Base
from app.db.session import engine
from app.models import models # Import nécessaire pour que Base connaisse les modèles

# Création des tables
Base.metadata.create_all(bind=engine)

from app.api.v1.api import api_router

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="""
    API backend pour la Plateforme de Surveillance et d'Aide à la Décision.
    
    Fonctionnalités principales :
    * **Apps** : Gestion des applications suivies.
    * **Reviews** : Récupération et lecture des avis Google Play.
    * **Stats** : Statistiques agrégées et analyse de sentiment.
    * **Auth** : Authentification JWT sécurisée.
    """,
    version="1.0.0",
    contact={
        "name": "Support Technique",
        "email": "support@example.com",
    },
)

app.include_router(api_router, prefix=settings.API_V1_STR)

@app.get("/")
def read_root():
    return {"message": "Bienvenue sur la Plateforme de Surveillance et d'Aide à la Décision"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
