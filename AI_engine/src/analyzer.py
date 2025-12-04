from transformers import pipeline

print("🧠 [AI Loading] Chargement du modèle neuronal (BERT)...")

# Modèle multilingue (1 à 5 étoiles)
sentiment_pipeline = pipeline("sentiment-analysis", model="nlptown/bert-base-multilingual-uncased-sentiment")

print("✅ [AI Ready] Modèle chargé.")

def predict_sentiment(text: str) -> float:
    """Retourne un score entre -1.0 (Négatif) et +1.0 (Positif)"""
    if not text or len(text) < 2: return 0.0
    
    try:
        short_text = text[:512] # Limite de taille BERT
        result = sentiment_pipeline(short_text)[0]
        # result ressemble à {'label': '1 star', 'score': 0.95}
        stars = int(result['label'].split(' ')[0])
        
        # 1 star -> -1.0, 3 stars -> 0.0, 5 stars -> 1.0
        return (stars - 3) / 2.0
    except Exception:
        return 0.0

def predict_category(text: str) -> str:
    """Classification par mots-clés"""
    t = text.lower()
    if any(w in t for w in ['bug', 'crash', 'écran noir', 'ferme', 'connexion']): return "BUG_TECHNIQUE"
    if any(w in t for w in ['pub', 'payant', 'cher', 'argent', 'abonnement']): return "PRICING_ADS"
    if any(w in t for w in ['ajouter', 'manque', 'faudrait', 'option']): return "FEATURE_REQUEST"
    if any(w in t for w in ['bravo', 'merci', 'top', 'super', 'génial']): return "SATISFACTION"
    return "AUTRE"