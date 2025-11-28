import pandas as pd
from google_play_scraper import Sort, reviews
from datetime import datetime

# LE NOM DE LA FONCTION DOIT ÊTRE EXACTEMENT CELUI-CI :
def collect_reviews(app_id: str, lang: str = 'fr', country: str = 'fr', count: int = 1000) -> pd.DataFrame:
    print(f"--- 📥 Démarrage du scraping pour : {app_id} ---")
    
    try:
        result, _ = reviews(
            app_id,
            lang=lang,
            country=country,
            sort=Sort.NEWEST,
            count=count
        )

        if not result:
            print(f"⚠️ Aucun avis trouvé pour {app_id}.")
            return pd.DataFrame()

        df = pd.DataFrame(result)

        # Sélection et renommage
        cols_to_keep = ['reviewId', 'userName', 'content', 'score', 'at', 'replyContent', 'repliedAt']
        existing_cols = [c for c in cols_to_keep if c in df.columns]
        df = df[existing_cols]

        df = df.rename(columns={
            'reviewId': 'review_id',
            'userName': 'user_name',
            'content': 'review_text',
            'score': 'rating',
            'at': 'date_posted',
            'replyContent': 'developer_reply',
            'repliedAt': 'date_reply'
        })

        df['date_posted'] = pd.to_datetime(df['date_posted'])
        
        print(f"✅ Succès : {len(df)} avis récupérés pour {app_id}.")
        return df

    except Exception as e:
        print(f"❌ Erreur critique lors du scraping de {app_id} : {e}")
        return pd.DataFrame()