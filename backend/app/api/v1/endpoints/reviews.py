from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from app.db.session import SessionLocal
from app.models import models
from app.schemas import schemas

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/", response_model=List[schemas.ReviewWithAnalysis])
def read_reviews(skip: int = 0, limit: int = 100, app_id: int = None, db: Session = Depends(get_db)):
    query = db.query(models.Review)
    if app_id:
        query = query.filter(models.Review.app_id == app_id)
    reviews = query.offset(skip).limit(limit).all()
    return reviews
