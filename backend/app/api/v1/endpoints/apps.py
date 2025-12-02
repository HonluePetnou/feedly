from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List

from app.api import deps
from app.db.session import SessionLocal
from app.models import models
from app.schemas import schemas
from app.services.scraper import scraper_service
from app.services.analyzer import analyzer_service

router = APIRouter()

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/", response_model=schemas.App, summary="Enregistrer une nouvelle application")
def create_app(
    app: schemas.AppCreate, 
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user)
):
    """
    Enregistre une nouvelle application à surveiller.
    
    - **package_name**: L'identifiant unique de l'application sur le Play Store (ex: com.whatsapp).
    - **name**: Le nom lisible de l'application (optionnel).
    
    Nécessite d'être authentifié.
    """
    db_app = db.query(models.App).filter(models.App.package_name == app.package_name).first()
    if db_app:
        raise HTTPException(status_code=400, detail="App already registered")
    db_app = models.App(package_name=app.package_name, name=app.name)
    db.add(db_app)
    db.commit()
    db.refresh(db_app)
    return db_app

@router.get("/", response_model=List[schemas.App], summary="Lister les applications suivies")
def read_apps(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """
    Récupère la liste des applications enregistrées.
    
    - **skip**: Nombre d'éléments à sauter (pagination).
    - **limit**: Nombre maximum d'éléments à retourner.
    """
    apps = db.query(models.App).offset(skip).limit(limit).all()
    return apps

@router.get("/{app_id}/reviews", response_model=List[schemas.ReviewWithAnalysis], summary="Lire les avis d'une application")
def read_app_reviews(
    app_id: int, 
    skip: int = 0, 
    limit: int = 100, 
    score: int = None,
    category: str = None,
    db: Session = Depends(get_db)
):
    """
    Récupère les avis pour une application spécifique avec filtres optionnels.
    
    - **app_id**: ID interne de l'application.
    - **score**: Filtrer par note (1-5).
    - **category**: Filtrer par catégorie de sentiment (Positif, Négatif, Neutre).
    """
    query = db.query(models.Review).filter(models.Review.app_id == app_id)
    
    if score:
        query = query.filter(models.Review.score == score)
    
    if category:
        # On joint avec la table Analysis pour filtrer par catégorie
        query = query.join(models.Analysis).filter(models.Analysis.category == category)
    
    reviews = query.order_by(models.Review.at.desc()).offset(skip).limit(limit).all()
    return reviews

@router.get("/{app_id}/stats", response_model=schemas.AppStats, summary="Obtenir les statistiques d'une application")
def read_app_stats(app_id: int, db: Session = Depends(get_db)):
    """
    Récupère les statistiques agrégées pour une application.
    
    Retourne :
    - **total_reviews**: Nombre total d'avis enregistrés.
    - **average_score**: Note moyenne calculée.
    - **sentiment_distribution**: Répartition des avis par sentiment.
    """
    # Vérifier si l'app existe
    db_app = db.query(models.App).filter(models.App.id == app_id).first()
    if not db_app:
        raise HTTPException(status_code=404, detail="App not found")

    # 1. Total reviews
    total_reviews = db.query(models.Review).filter(models.Review.app_id == app_id).count()
    
    # 2. Average Score
    avg_score = db.query(func.avg(models.Review.score)).filter(models.Review.app_id == app_id).scalar() or 0.0
    
    # 3. Sentiment Distribution
    # On compte les occurrences de chaque catégorie dans la table Analysis liée aux reviews de cette app
    sentiment_counts = db.query(
        models.Analysis.category, func.count(models.Analysis.category)
    ).join(models.Review).filter(models.Review.app_id == app_id).group_by(models.Analysis.category).all()
    
    # On transforme le résultat en dictionnaire
    distribution = {"Positif": 0, "Neutre": 0, "Négatif": 0}
    for category, count in sentiment_counts:
        if category in distribution:
            distribution[category] = count
            
    return {
        "total_reviews": total_reviews,
        "average_score": round(avg_score, 2),
        "sentiment_distribution": {
            "positive": distribution["Positif"],
            "neutral": distribution["Neutre"],
            "negative": distribution["Négatif"]
        }
    }

def sync_reviews_task(app_id: int, package_name: str, db: Session):
    # 1. Scrape
    print(f"Starting sync for {package_name}...")
    reviews_data = scraper_service.fetch_reviews(package_name)
    print(f"Fetched {len(reviews_data)} reviews.")
    
    new_count = 0
    for r_data in reviews_data:
        # Check if exists
        exists = db.query(models.Review).filter(models.Review.review_id == r_data['review_id']).first()
        if not exists:
            # Create Review
            review = models.Review(**r_data, app_id=app_id)
            db.add(review)
            db.commit() # Commit to get ID
            db.refresh(review)
            
            # 2. Analyze
            analysis_data = analyzer_service.analyze(review.content)
            analysis = models.Analysis(**analysis_data, review_id=review.id)
            db.add(analysis)
            new_count += 1
    
    db.commit()
    print(f"Sync finished. {new_count} new reviews added.")

@router.post("/{app_id}/sync", summary="Lancer la synchronisation des avis")
def sync_app(
    app_id: int, 
    background_tasks: BackgroundTasks, 
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user)
):
    """
    Déclenche une tâche d'arrière-plan pour récupérer les nouveaux avis depuis le Play Store.
    
    - **app_id**: ID interne de l'application.
    
    Nécessite d'être authentifié.
    """
    db_app = db.query(models.App).filter(models.App.id == app_id).first()
    if not db_app:
        raise HTTPException(status_code=404, detail="App not found")
    
    # On lance la tâche en arrière-plan
    background_tasks.add_task(sync_reviews_task, app_id, db_app.package_name, db)
    return {"message": "Sync started in background"}
