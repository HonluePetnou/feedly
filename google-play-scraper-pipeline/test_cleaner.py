import pandas as pd
from src.pipeline.cleaner import process_dataframe

def run_test():
    print("🧪 Démarrage du test du module de nettoyage...")

    # 1. Création de données "Sales" simulées
    # On simule les cas classiques d'avis mal formatés
    fake_data = {
        'user_name': ['Alice', 'Bob', 'Charlie', 'David', 'Eve'],
        'rating': [5, 1, 3, 2, 4],
        'review_text': [
            "   Super application !   \n",                  # Cas 1 : Espaces avant/après/sauts de ligne
            "C'est nul. (Translated by Google)",            # Cas 2 : Tag de traduction automatique
            "",                                             # Cas 3 : Avis totalement vide
            "A",                                            # Cas 4 : Avis trop court (1 lettre)
            "(Original) Tres bien (Translated by Google)"   # Cas 5 : Double tag
        ]
    }
    
    df_dirty = pd.DataFrame(fake_data)

    print("\n--- 🔴 DONNÉES SALES (AVANT) ---")
    # On affiche le texte brut avec des guillemets pour bien voir les espaces
    for text in df_dirty['review_text']:
        print(f"'{text}'")

    # 2. Passage dans le nettoyeur
    df_clean = process_dataframe(df_dirty)

    print("\n--- 🟢 DONNÉES PROPRES (APRÈS) ---")
    # On vérifie ce qu'il reste
    if df_clean.empty:
        print("Erreur : Le DataFrame est vide !")
    else:
        for text in df_clean['review_text']:
            print(f"'{text}'")

    print("\n--------------------------------")
    print(f"📊 Bilan : {len(df_dirty)} avis au départ -> {len(df_clean)} avis à la fin.")
    
    # Vérifications automatiques
    assert len(df_clean) == 2, "❌ ÉCHEC : On devrait avoir gardé seulement 2 avis (Alice et Bob/Eve nettoyé)"
    assert "Super application !" in df_clean['review_text'].values, "❌ ÉCHEC : Le texte d'Alice n'est pas nettoyé correctement"
    print("✅ TEST RÉUSSI : La logique de nettoyage fonctionne !")

if __name__ == "__main__":
    run_test()