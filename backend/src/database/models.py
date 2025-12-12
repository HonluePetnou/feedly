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


# 4. Table pour les Utilisateurs (Auth)
class User(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True, autoincrement=True)
    fullname = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, nullable=False, index=True)
    hashed_password = Column(String(255), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # OTP & Status
    is_active = Column(Boolean, default=False)
    otp_code = Column(String(6), nullable=True)
    otp_expires_at = Column(DateTime, nullable=True)
    
    # Relations
    conversations = relationship("Conversation", back_populates="user", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<User(email='{self.email}')>"


# 5. Table pour les Conversations (Chat sessions)
class Conversation(Base):
    __tablename__ = 'conversations'

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False, index=True)
    app_id = Column(Integer, ForeignKey('applications.id'), nullable=False, index=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relations
    user = relationship("User", back_populates="conversations")
    application = relationship("Application")
    messages = relationship("ChatMessage", back_populates="conversation", cascade="all, delete-orphan", order_by="ChatMessage.created_at")

    def __repr__(self):
        return f"<Conversation(id={self.id}, user_id={self.user_id}, app_id={self.app_id})>"


# 6. Table pour les Messages de Chat
class ChatMessage(Base):
    __tablename__ = 'chat_messages'

    id = Column(Integer, primary_key=True, autoincrement=True)
    conversation_id = Column(Integer, ForeignKey('conversations.id'), nullable=False, index=True)
    role = Column(String(10), nullable=False)  # 'user' or 'bot'
    content = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relation
    conversation = relationship("Conversation", back_populates="messages")

    def __repr__(self):
        return f"<ChatMessage(id={self.id}, role='{self.role}')>"