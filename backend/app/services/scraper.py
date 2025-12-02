from google_play_scraper import reviews, Sort
from datetime import datetime
from typing import List, Dict, Any

class GooglePlayScraper:
    def fetch_reviews(self, package_name: str, count: int = 100) -> List[Dict[str, Any]]:
        """
        Récupère les avis pour une application donnée.
        """
        try:
            result, _ = reviews(
                package_name,
                lang='fr', # On cible les avis en français pour l'instant
                country='fr',
                sort=Sort.NEWEST,
                count=count
            )
            
            cleaned_reviews = []
            for r in result:
                cleaned_reviews.append({
                    "review_id": r['reviewId'],
                    "content": r['content'],
                    "score": r['score'],
                    "thumbs_up_count": r['thumbsUpCount'],
                    "review_created_version": r.get('reviewCreatedVersion'),
                    "at": r['at'],
                    "reply_content": r.get('replyContent'),
                    "replied_at": r.get('repliedAt')
                })
            return cleaned_reviews
        except Exception as e:
            print(f"Erreur lors du scraping de {package_name}: {e}")
            return []

scraper_service = GooglePlayScraper()
