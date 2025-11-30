import pandas as pd
import re

def clean_text(text: str) -> str:
    """
    Nettoie un texte individuel :
    - Supprime les espaces multiples.
    - Supprime les mentions automatiques de traduction.
    """
    if not isinstance(text, str):
        return ""

    # 1. Suppression des espaces invisibles (sauts de ligne, tabulations)
    # "  Bonjour   \n " devient "Bonjour"
    cleaned = " ".join(text.split())

    # 2. Suppression des artefacts Google Play (si présents)
    # Les avis traduits contiennent souvent ce texte
    cleaned = cleaned.replace("(Translated by Google)", "").replace("(Original)", "")

    return cleaned.strip()

def process_dataframe(df: pd.DataFrame) -> pd.DataFrame:
    """
    Fonction principale de Transformation (ETL).
    Prend un DataFrame brut et renvoie un DataFrame propre.
    """
    if df.empty:
        return df

    print(f"🧹 [Cleaner] Nettoyage de {len(df)} avis...")

    # 1. Appliquer le nettoyage de texte
    df['review_text'] = df['review_text'].apply(clean_text)

    # 2. Filtrer les avis vides (si on ne veut pas stocker juste des étoiles)
    # On garde seulement si le commentaire a au moins 2 caractères
    initial_count = len(df)
    df = df[df['review_text'].str.len() > 1]
    final_count = len(df)

    if initial_count != final_count:
        print(f"   🗑️ {initial_count - final_count} avis vides supprimés.")

    return df