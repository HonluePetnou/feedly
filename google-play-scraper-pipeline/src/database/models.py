from sqlalchemy import Column, String, Integer, DateTime, Text, ForeignKey, Float, Boolean
from sqlalchemy.orm import declarative_base, relationship
from datetime import datetime

# 1. Création de la classe de base SQLAlchemy
Base = declarative_base()

# 2. Table pour les Applications (Ce qu'on surveille)
class Application(Base):
    __tablename__ = 'applications'

    id = Column(Integer, primary_key=True, autoincrement=True)
    
    # Identifiant unique du store (ex: 'com.whatsapp')
    package_name = Column(String(255), unique=True, nullable=False, index=True)
    
    # Nom lisible (ex: 'WhatsApp Messenger')
    name = Column(String(255), nullable=True)
    
    # URL de l'image (pour faire joli sur le Dashboard)
    icon_url = Column(String(500), nullable=True)
    
    # Date d'ajout à la surveillance
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Crucial : date du dernier scraping (pour ne scraper que les nouveaux avis ensuite)
    last_scraped_at = Column(DateTime, nullable=True)
    
    # Relation : Une app a plusieurs avis
    reviews = relationship("Review", back_populates="application", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<Application(name='{self.name}', package='{self.package_name}')>"


# 3. Table pour les Avis (Les données brutes + IA)
class Review(Base):
    __tablename__ = 'reviews'

    id = Column(Integer, primary_key=True, autoincrement=True)
    
    # Lien vers l'application
    app_id = Column(Integer, ForeignKey('applications.id'), nullable=False, index=True)
    
    # ID unique Google (ex: 'gp:AOqpTOHg...') pour éviter les doublons
    review_id = Column(String(255), unique=True, nullable=False)
    
    user_name = Column(String(255), nullable=True)
    rating = Column(Integer, nullable=False) # Note de 1 à 5
    content = Column(Text, nullable=True)    # Le commentaire
    
    # Dates
    posted_at = Column(DateTime, nullable=False, index=True) # Date écrite par l'utilisateur
    collected_at = Column(DateTime, default=datetime.utcnow) # Date où on l'a récupéré

    # --- Colonnes pour l'IA (Aide à la décision) ---
    # Score de sentiment (-1.0 à +1.0)
    sentiment_score = Column(Float, nullable=True) 
    
    # Catégorie (ex: 'BUG', 'FEATURE', 'SPAM')
    category = Column(String(50), nullable=True)
    
    # Est-ce que l'IA a déjà analysé cet avis ?
    is_processed = Column(Boolean, default=False)

    # Relation inverse
    application = relationship("Application", back_populates="reviews")

    def __repr__(self):
        return f"<Review(id='{self.review_id}', rating={self.rating})>"