from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Float, Text, Boolean
from sqlalchemy.orm import relationship
from datetime import datetime
from app.db.base import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)
    is_superuser = Column(Boolean, default=False)

class App(Base):
    __tablename__ = "apps"

    id = Column(Integer, primary_key=True, index=True)
    package_name = Column(String, unique=True, index=True, nullable=False)
    name = Column(String, nullable=True)
    url = Column(String, nullable=True)
    
    reviews = relationship("Review", back_populates="app")

class Review(Base):
    __tablename__ = "reviews"

    id = Column(Integer, primary_key=True, index=True)
    review_id = Column(String, unique=True, index=True) # ID unique venant de Google Play
    app_id = Column(Integer, ForeignKey("apps.id"))
    content = Column(Text)
    score = Column(Integer)
    thumbs_up_count = Column(Integer, default=0)
    review_created_version = Column(String, nullable=True)
    at = Column(DateTime) # Date de l'avis
    reply_content = Column(Text, nullable=True)
    replied_at = Column(DateTime, nullable=True)

    app = relationship("App", back_populates="reviews")
    analysis = relationship("Analysis", back_populates="review", uselist=False)

class Analysis(Base):
    __tablename__ = "analyses"

    id = Column(Integer, primary_key=True, index=True)
    review_id = Column(Integer, ForeignKey("reviews.id"))
    sentiment_polarity = Column(Float) # -1.0 à 1.0
    sentiment_subjectivity = Column(Float) # 0.0 à 1.0
    category = Column(String, nullable=True) # ex: "Bug", "Feature Request", "Praise"
    
    review = relationship("Review", back_populates="analysis")
