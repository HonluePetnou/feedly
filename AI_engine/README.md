# 🧠 Moteur d'Analyse IA (AI Engine)

Ce microservice est le "Cerveau" de la plateforme. Il surveille en permanence la base de données pour détecter les nouveaux avis récupérés par le scraper et les enrichir grâce à l'Intelligence Artificielle.

Il fonctionne de manière **asynchrone** et **autonome**.

## ⚡ Fonctionnalités

* **Analyse de Sentiment (Deep Learning) :** Utilise un modèle **BERT Multilingue** (Hugging Face) pour attribuer un score émotionnel de `-1.0` (Très Négatif) à `+1.0` (Très Positif).
* **Catégorisation Automatique :** Détecte le sujet de l'avis (Bug Technique, Prix, Fonctionnalité, Satisfaction) via une analyse sémantique par mots-clés.
* **Mode "Watcher" :** Un script tourne en boucle, récupère les avis par lots (batchs) de 50, les traite, et met à jour la base de données en temps réel.

---

## 🏗️ Architecture Technique

Ce service est totalement découplé du Scraper. Il ne communique avec lui que via la **Base de Données Partagée**.

1.  **Input :** Lit les lignes de la table `reviews` où `is_processed = FALSE`.
2.  **Process :**
    * Nettoyage du texte (Regex).
    * Inférence IA (CPU).
3.  **Output :** Met à jour `sentiment_score`, `category` et passe `is_processed = TRUE`.

### Stack Technique

* **Langage :** Python 3.9+
* **Moteur IA :** `PyTorch` + `Transformers` (Hugging Face)
* **Modèle :** `nlptown/bert-base-multilingual-uncased-sentiment`
* **Database :** SQLAlchemy (PostgreSQL)

---

## 🛠️ Installation

⚠️ **Important :** Ce service nécessite son propre environnement virtuel, séparé du Scraper, car les librairies IA sont lourdes (~1 Go).

### 1. Configuration de l'environnement

```bash
cd ai-engine

# Créer l'environnement virtuel
python -m venv venv

# Activer l'environnement
# Windows :
.\venv\Scripts\Activate.ps1
# Mac/Linux :
source venv/bin/activate
2. Installation des dépendancesBashpip install -r requirements.txt
(Le téléchargement de PyTorch peut prendre plusieurs minutes selon votre connexion).3. ConfigurationCréez un fichier .env dans le dossier ai-engine/ avec vos accès BDD :Ini, TOMLDB_HOST=localhost
DB_NAME=reviews_db
DB_USER=postgres
DB_PASSWORD=votre_mot_de_passe
🚀 UtilisationPour lancer le moteur, exécutez simplement le script principal. Il téléchargera le modèle automatiquement lors du premier lancement.Bashpython -m src.main
Comportement du scriptDémarrage : Charge le modèle en mémoire RAM.Boucle Infinie :Cherche 50 avis non traités.Si trouvés : Affiche ⚙️ Analyse... et traite le lot.Si vide : Affiche 💤 Pas de nouveaux avis et se met en pause 5 secondes.📊 Interprétation des ScoresLe modèle BERT prédit une note de 1 à 5 étoiles, que nous normalisons pour le Dashboard :Prédiction IAScore StockéSignification1 étoile-1.0Colère, Critique sévère 😡2 étoiles-0.5Mécontentement 🙁3 étoiles0.0Neutre / Mitigé 😐4 étoiles+0.5Satisfait 🙂5 étoiles+1.0Enthousiaste, Fan 
🤩Projet Fendly - Module IA - Décembre 2025