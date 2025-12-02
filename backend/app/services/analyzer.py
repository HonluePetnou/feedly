from textblob import TextBlob

class SentimentAnalyzer:
    def analyze(self, text: str) -> dict:
        """
        Analyse le sentiment d'un texte.
        Retourne la polarité (-1 à 1) et la subjectivité (0 à 1).
        """
        blob = TextBlob(text)
        # Note: TextBlob fonctionne mieux en anglais par défaut. 
        # Pour le français, on pourrait utiliser blob.translate(to='en') mais cela nécessite une connexion internet et peut être lent/limité.
        # Pour ce prototype, on assume que TextBlob gère "correctement" ou on accepte l'approximation, 
        # ou on pourrait utiliser une librairie spécifique FR comme 'vaderSentiment-fr' si demandé.
        # Ici on reste simple.
        
        return {
            "sentiment_polarity": blob.sentiment.polarity,
            "sentiment_subjectivity": blob.sentiment.subjectivity,
            "category": self._categorize(blob.sentiment.polarity)
        }

    def _categorize(self, polarity: float) -> str:
        if polarity > 0.3:
            return "Positif"
        elif polarity < -0.1:
            return "Négatif"
        else:
            return "Neutre"

analyzer_service = SentimentAnalyzer()
