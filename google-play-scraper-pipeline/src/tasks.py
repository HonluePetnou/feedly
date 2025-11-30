import os
from celery import Celery
from src.scraper.scraper_module import collect_reviews
from src.pipeline.loader import load_reviews_to_db
from src.pipeline.cleaner import process_dataframe # <--- Module de nettoyage

# Configuration Redis
CELERY_BROKER_URL = os.getenv('CELERY_BROKER_URL', 'redis://localhost:6379/0')

celery_app = Celery(
    'monitoring_tasks',
    broker=CELERY_BROKER_URL,
    backend=CELERY_BROKER_URL
)

celery_app.conf.update(
    task_serializer='json',
    accept_content=['json'],
    result_serializer='json',
    timezone='Africa/Douala',
    enable_utc=True,
)

@celery_app.task(name="scrape_full_history")
def task_scrape_full_history(app_id: str):
    """
    Worker : Récupère l'historique lourd, NETTOIE, et sauvegarde.
    """
    print(f"👷 [Worker] Scraping complet démarré pour {app_id}...")
    
    try:
        # On peut augmenter le nombre ici pour la production
        df = collect_reviews(app_id, count=20000)
        
        if not df.empty:
            # 1. NETTOYAGE
            df = process_dataframe(df)

            # 2. INSERTION
            load_reviews_to_db(df, package_name=app_id)
            return f"Succès : {len(df)} avis nettoyés et insérés pour {app_id}"
        
        return f"Aucun avis trouvé pour {app_id}"

    except Exception as e:
        print(f"❌ Erreur Worker : {e}")
        return f"Erreur : {str(e)}"