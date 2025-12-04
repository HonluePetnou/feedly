import time
from src.db import SessionLocal, Review
from src.analyzer import predict_sentiment, predict_category

def process_reviews():
    db = SessionLocal()
    
    # On cherche 50 avis qui n'ont PAS encore été traités (is_processed = False ou Null)
    reviews = db.query(Review).filter(
        (Review.is_processed == False) | (Review.is_processed == None)
    ).limit(50).all()
    
    if not reviews:
        print("💤 Pas de nouveaux avis. En attente...")
        return False

    print(f"⚙️ Analyse de {len(reviews)} avis...")
    
    for rev in reviews:
        # L'IA travaille
        score = predict_sentiment(rev.review_text)
        cat = predict_category(rev.review_text)
        
        # On met à jour la DB
        rev.sentiment_score = score
        rev.category = cat
        rev.is_processed = True
        
        icon = "🟢" if score > 0 else "🔴" if score < 0 else "⚪"
        print(f"   {icon} {cat}: {rev.review_text[:40]}...")

    db.commit()
    db.close()
    return True

if __name__ == "__main__":
    print("🚀 Moteur IA démarré !")
    while True:
        worked = process_reviews()
        if not worked:
            time.sleep(5) # Pause de 5 secondes si rien à faire