import pandas as pd
from sqlalchemy.orm import Session
from src.database.models import Application, Review
from src.database.db_manager import get_db
from datetime import datetime

def get_or_create_app(session: Session, package_name: str, app_name: str = None) -> Application:
    """
    Récupère l'application en base ou la crée si elle n'existe pas encore.
    """
    app = session.query(Application).filter_by(package_name=package_name).first()
    
    if not app:
        print(f"🆕 Nouvelle application détectée : {package_name}")
        app = Application(
            package_name=package_name,
            name=app_name,
            last_scraped_at=datetime.utcnow()
        )
        session.add(app)
        session.commit()
        session.refresh(app)
    else:
        app.last_scraped_at = datetime.utcnow()
        if app_name:
            app.name = app_name
        session.commit()
        
    return app

def load_reviews_to_db(df: pd.DataFrame, package_name: str):
    """
    Insère les avis d'un DataFrame dans la base de données.
    """
    if df.empty:
        print("⚠️ Aucun avis à sauvegarder.")
        return

    # On récupère une session
    db: Session = next(get_db())
    
    try:
        # 1. Gestion de l'application
        app = get_or_create_app(db, package_name, app_name=package_name)
        
        print(f"💾 Sauvegarde de {len(df)} avis pour {package_name}...")
        
        new_reviews_count = 0
        
        # 2. Insertion des avis
        for _, row in df.iterrows():
            # Vérif anti-doublon
            exists = db.query(Review.review_id).filter_by(review_id=row['review_id']).first()
            
            if not exists:
                review = Review(
                    app_id=app.id,
                    review_id=row['review_id'],
                    user_name=row['user_name'],
                    rating=row['rating'],
                    content=row['review_text'],
                    posted_at=row['date_posted']
                )
                db.add(review)
                new_reviews_count += 1
        
        db.commit()
        print(f"✅ Terminé : {new_reviews_count} nouveaux avis insérés.")

    except Exception as e:
        db.rollback()
        print(f"❌ Erreur lors de l'insertion en base : {e}")
    finally:
        db.close()