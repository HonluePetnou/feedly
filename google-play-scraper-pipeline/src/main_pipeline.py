import time
from src.scraper.scraper_module import collect_reviews
from src.pipeline.loader import load_reviews_to_db

# Liste temporaire des applications à surveiller
# Plus tard, on lira ça depuis la base de données ou un fichier config
TARGET_APPS = [
    "com.whatsapp",            # WhatsApp
    "com.instagram.android",   # Instagram
    "com.linkedin.android"     # LinkedIn
]

def run_pipeline():
    """
    Fonction principale qui orchestre le flux ETL :
    1. EXTRACT (Scraper)
    2. LOAD (Database)
    """
    print("🚀 Démarrage du Pipeline de Données...")
    
    total_start_time = time.time()

    for app_id in TARGET_APPS:
        print(f"\n---------------------------------------------")
        print(f"🔹 Traitement de l'application : {app_id}")
        
        # 1. ÉTAPE EXTRACTION
        # On récupère 50 avis pour tester (mettez 1000+ pour la prod)
        df_reviews = collect_reviews(app_id, count=50)
        
        if df_reviews.empty:
            print(f"⚠️ Pas de données récupérées pour {app_id}. Passage au suivant.")
            continue
            
        # 2. ÉTAPE TRANSFORMATION (Optionnelle ici)
        # Si vous aviez un cleaner.py, il passerait ici.
        # ex: df_clean = clean_text(df_reviews)
        
        # 3. ÉTAPE CHARGEMENT
        try:
            load_reviews_to_db(df_reviews, package_name=app_id)
        except Exception as e:
            print(f"❌ Erreur critique lors de la sauvegarde de {app_id}: {e}")

    total_duration = time.time() - total_start_time
    print(f"\n✨ Pipeline terminé en {total_duration:.2f} secondes.")

if __name__ == "__main__":
    run_pipeline()