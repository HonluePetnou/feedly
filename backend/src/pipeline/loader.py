import pandas as pd
import os
from datetime import datetime
from sqlalchemy.orm import Session
from src.database.models import Application, Review
from src.database.db_manager import get_db

# Chemins de secours
BACKUP_DIR = "data/processed"

def save_backup_csv(df: pd.DataFrame, package_name: str):
    """
    Sauvegarde le DataFrame en CSV local si la DB plante.
    """
    # Créer le dossier s'il n'existe pas
    os.makedirs(BACKUP_DIR, exist_ok=True)
    
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = f"{BACKUP_DIR}/{package_name}_BACKUP_{timestamp}.csv"
    
    try:
        df.to_csv(filename, index=False)
        print(f"⚠️ [Loader] SAUVEGARDE D'URGENCE effectuée : {filename}")
    except Exception as e:
        print(f"❌ [Loader] Echec critique : Impossible de sauvegarder le backup local : {e}")

# ... (Garder la fonction get_or_create_app telle quelle) ...
def get_or_create_app(session: Session, package_name: str, app_name: str = None) -> Application:
    # (Copie le code précédent de cette fonction ici, rien ne change)
    app = session.query(Application).filter_by(package_name=package_name).first()
    if not app:
        print(f"🆕 Nouvelle application détectée : {package_name}")
        app = Application(package_name=package_name, name=app_name, last_scraped_at=datetime.utcnow())
        session.add(app)
        session.commit()
        session.refresh(app)
    else:
        app.last_scraped_at = datetime.utcnow()
        if app_name: app.name = app_name
        session.commit()
    return app

def load_reviews_to_db(df: pd.DataFrame, package_name: str):
    """
    Tente d'insérer en base. Si ça échoue, sauvegarde en CSV local.
    """
    if df.empty:
        return

    # On utilise next(get_db()) pour avoir la session
    db: Session = next(get_db())
    
    try:
        # 1. Logique d'insertion standard
        app = get_or_create_app(db, package_name, app_name=package_name)
        
        new_count = 0
        for _, row in df.iterrows():
            exists = db.query(Review.review_id).filter_by(review_id=row['review_id']).first()
            if not exists:
                review = Review(
                    app_id=app.id,
                    review_id=row['review_id'],
                    user_name=row['user_name'],
                    rating=row['rating'],
                    content=row['review_text'],
                    posted_at=row['date_posted'],
                    # Si le DataFrame a déjà les colonnes IA, on les prend, sinon None
                    sentiment_score=row.get('sentiment_score'),
                    category=row.get('category'),
                    is_processed=row.get('is_processed', False)
                )
                db.add(review)
                new_count += 1
        
        db.commit()
        print(f"✅ [DB] {new_count} nouveaux avis insérés.")

    except Exception as e:
        db.rollback()
        print(f"❌ [DB Error] Impossible d'écrire en base : {e}")
        
        # C'est ICI que le dossier data/processed intervient !
        print("🚑 Tentative de sauvegarde locale (Backup)...")
        save_backup_csv(df, package_name)
        
    finally:
        db.close()