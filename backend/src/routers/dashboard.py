from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from src.database.db_manager import get_db
from src.database.models import Application, Review

router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"]
)

@router.get("/stats")
def get_dashboard_stats(db: Session = Depends(get_db)):
    """
    Récupère les statistiques globales pour le dashboard principal.
    """
    # 1. Total Apps
    total_apps = db.query(Application).count()

    # 2. Total Reviews
    total_reviews = db.query(Review).count()

    # 3. Average Rating (Global)
    avg_rating = db.query(func.avg(Review.rating)).scalar() or 0.0

    # 4. Sentiment Distribution (Global)
    positive = db.query(Review).filter(Review.sentiment_score > 0.3).count()
    negative = db.query(Review).filter(Review.sentiment_score < -0.3).count()
    neutral = db.query(Review).filter(Review.sentiment_score >= -0.3, Review.sentiment_score <= 0.3).count()
    
    total_sentiment = positive + negative + neutral or 1 # Avoid division by zero
    
    sentiment_dist = {
        "positive_pct": round((positive / total_sentiment) * 100, 1),
        "negative_pct": round((negative / total_sentiment) * 100, 1),
        "neutral_pct": round((neutral / total_sentiment) * 100, 1),
        "positive_count": positive,
        "negative_count": negative,
        "neutral_count": neutral
    }

    # 5. Recent Activity (Latest 5 reviews)
    recent_reviews = db.query(Review).order_by(Review.posted_at.desc()).limit(5).all()
    
    activity = []
    for r in recent_reviews:
        activity.append({
            "id": r.id,
            "app_name": r.application.name if r.application else "Unknown App",
            "app_icon": r.application.icon_url if r.application else None,
            "rating": r.rating,
            "content": r.content,
            "date": r.posted_at,
            "sentiment": r.sentiment_score
        })

    return {
        "total_apps": total_apps,
        "total_reviews": total_reviews,
        "average_rating": round(avg_rating, 1),
        "sentiment_distribution": sentiment_dist,
        "recent_activity": activity
    }
