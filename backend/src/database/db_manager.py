import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, scoped_session
from dotenv import load_dotenv
from src.database.models import Base

# Charger les variables du fichier .env
load_dotenv()

# Récupération des secrets
DB_USER = os.getenv("DB_USER", "postgres")
DB_PASSWORD = os.getenv("DB_PASSWORD", "password")
DB_HOST = os.getenv("DB_HOST", "localhost")
DB_PORT = os.getenv("DB_PORT", "5432")
DB_NAME = os.getenv("DB_NAME", "reviews_db")

# URL de connexion PostgreSQL
DATABASE_URL = f"postgresql+psycopg2://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"

# Création du moteur de base de données
engine = create_engine(DATABASE_URL, pool_pre_ping=True)

# Factory de sessions (pour interagir avec la DB)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def init_db():
    """
    Crée les tables dans la base de données si elles n'existent pas.
    """
    try:
        print(f"🔄 Tentative de connexion à {DB_NAME} sur {DB_HOST}...")
        Base.metadata.create_all(bind=engine)
        print("✅ Tables créées avec succès !")
    except Exception as e:
        print(f"❌ Erreur lors de l'initialisation de la DB : {e}")

def get_db():
    """
    Fonction utilitaire pour récupérer une session et la fermer proprement.
    À utiliser avec 'with' ou dans des dépendances.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

if __name__ == "__main__":
    # Si on lance ce fichier directement, on crée les tables
    init_db()