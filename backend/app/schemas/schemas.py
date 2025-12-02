from pydantic import BaseModel
from datetime import datetime
from typing import List, Optional

# Token Schemas
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

# User Schemas
class UserBase(BaseModel):
    email: str
    is_active: Optional[bool] = True
    is_superuser: Optional[bool] = False

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    
    class Config:
        from_attributes = True

# App Schemas
class AppBase(BaseModel):
    package_name: str
    name: Optional[str] = None
    url: Optional[str] = None

class AppCreate(AppBase):
    pass

class App(AppBase):
    id: int
    
    class Config:
        from_attributes = True

# Review Schemas
class ReviewBase(BaseModel):
    review_id: str
    content: str
    score: int
    thumbs_up_count: int = 0
    review_created_version: Optional[str] = None
    at: datetime
    reply_content: Optional[str] = None
    replied_at: Optional[datetime] = None

class ReviewCreate(ReviewBase):
    pass

class Review(ReviewBase):
    id: int
    app_id: int
    
    class Config:
        from_attributes = True

# Analysis Schemas
class AnalysisBase(BaseModel):
    sentiment_polarity: float
    sentiment_subjectivity: float
    category: Optional[str] = None

class AnalysisCreate(AnalysisBase):
    review_id: int

class Analysis(AnalysisBase):
    id: int
    
    class Config:
        from_attributes = True

# Composite Schemas
class ReviewWithAnalysis(Review):
    analysis: Optional[Analysis] = None

# Stats Schemas
class SentimentDistribution(BaseModel):
    positive: int
    neutral: int
    negative: int

class AppStats(BaseModel):
    total_reviews: int
    average_score: float
    sentiment_distribution: SentimentDistribution
