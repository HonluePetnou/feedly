import re
from transformers import pipeline

print("🧠 [AI Loading] Chargement du modèle neuronal (BERT)...")

# Modèle multilingue spécialisé dans les avis (1-5 étoiles)
# Il comprend le Français, l'Anglais, l'Espagnol, l'Allemand, etc.
sentiment_pipeline = pipeline("sentiment-analysis", model="nlptown/bert-base-multilingual-uncased-sentiment")

print("✅ [AI Ready] Modèle chargé.")

def clean_text(text: str) -> str:
    """
    Nettoie le texte pour l'optimiser pour le modèle BERT.
    """
    if not isinstance(text, str): return ""
    
    # Tout en minuscules
    text = text.lower()
    
    # Supprime les URLs (http...)
    text = re.sub(r'https?://\S+|www\.\S+', '', text)
    
    # Supprime les balises HTML éventuelles
    text = re.sub(r'<.*?>', '', text)
    
    # Supprime la ponctuation excessive (garde juste les mots)
    text = re.sub(r'[^\w\s]', '', text)
    
    return text.strip()

def predict_sentiment(text: str) -> float:
    """
    Analyse le sentiment et retourne un score normalisé (-1.0 à +1.0).
    """
    if not text or len(text) < 2: return 0.0
    
    # 1. Nettoyage
    cleaned_text = clean_text(text)
    
    try:
        # 2. Inférence (Limite technique BERT : 512 tokens)
        short_text = cleaned_text[:512]
        
        result = sentiment_pipeline(short_text)[0]
        # Le résultat ressemble à : {'label': '4 stars', 'score': 0.85}
        
        stars = int(result['label'].split(' ')[0])
        
        # 3. Normalisation
        # 1 star -> -1.0
        # 3 stars -> 0.0
        # 5 stars -> +1.0
        return (stars - 3) / 2.0
        
    except Exception as e:
        # En cas d'erreur (texte vide après nettoyage, etc.), on retourne Neutre
        return 0.0

def predict_category(text: str) -> str:
    """
    Catégorisation par mots-clés (Support Bilingue FR + EN).
    """
    if not text: return "AUTRE"
    
    # On travaille sur le texte brut (juste en minuscule) pour garder le contexte
    t = text.lower()
    
    # 1. Problèmes Techniques / Technical Issues
    tech_keywords = [
        # FR
        'bug', 'crash', 'écran noir', 'ferme', 'connexion', 'marche pas', 
        'erreur', 'impossible', 'lent', 'plantage', 'ouvrir',
        # EN
        'fix', 'slow', 'lag', 'freeze', 'close', 'open', 'error', 
        'working', 'glitch', 'connect', 'broken'
    ]
    if any(w in t for w in tech_keywords): return "BUG_TECHNIQUE"
    
    # 2. Monétisation & Pubs / Pricing & Ads
    money_keywords = [
        # FR
        'pub', 'publicité', 'payant', 'cher', 'argent', 'abonnement', 
        'remboursement', 'arnaque', 'premium',
        # EN
        'ads', 'ad', 'money', 'pay', 'expensive', 'subscription', 
        'refund', 'scam', 'cost', 'buy'
    ]
    if any(w in t for w in money_keywords): return "PRICING_ADS"
    
    # 3. Fonctionnalités / Features
    feature_keywords = [
        # FR
        'ajouter', 'manque', 'faudrait', 'option', 'mise à jour', 'système',
        # EN
        'add', 'missing', 'need', 'should', 'feature', 'update', 'option'
    ]
    if any(w in t for w in feature_keywords): return "FEATURE_REQUEST"
    
    # 4. Satisfaction
    satisfaction_keywords = [
        # FR
        'bravo', 'merci', 'top', 'super', 'génial', 'parfait', 'utile', 'cool',
        # EN
        'great', 'good', 'love', 'amazing', 'best', 'perfect', 'thanks', 'useful', 'nice'
    ]
    if any(w in t for w in satisfaction_keywords): return "SATISFACTION"
    
    return "AUTRE"