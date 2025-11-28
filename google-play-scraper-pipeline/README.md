# Google Play Surveillance Platform (Backend)

Ce module est le cœur de la plateforme de surveillance d'applications. Il gère la collecte de données (Scraping), le stockage structuré (PostgreSQL) et l'exposition des données via une API (FastAPI).

## 🏗️ Architecture "Monitoring Hybride"

Le système fonctionne en deux temps pour garantir réactivité et exhaustivité :

1.  **On-Boarding (Temps Réel) :** Via l'API, l'utilisateur ajoute une app. Le système scrape immédiatement un échantillon (50 avis) pour confirmer l'ajout.
2.  **Surveillance (Arrière-plan) :** Des tâches planifiées (Celery - *en cours d'implémentation*) scannent périodiquement les nouvelles données pour l'historique complet.

## 📂 Structure du Projet

```text
google-play-scraper-pipeline/
├── config/               # Configuration globale
├── data/                 # Données locales (logs, temp)
├── src/
│   ├── api.py            # API FastAPI (Point d'entrée Web)
│   ├── main_pipeline.py  # Script d'exécution manuelle
│   ├── database/
│   │   ├── models.py     # Schéma de la BDD (Applications, Reviews)
│   │   └── db_manager.py # Connexion PostgreSQL
│   ├── pipeline/
│   │   └── loader.py     # Logique d'insertion (Load) & Anti-doublons
│   └── scraper/
│       └── scraper_module.py # Moteur de scraping (Google Play)
├── .env                  # Secrets (DB_PASSWORD, etc.)
└── requirements.txt      # Dépendances
🚀 Installation
Prérequis : Python 3.9+, PostgreSQL installé.

Installation :

Bash

# Créer et activer l'environnement virtuel
python -m venv venv
source venv/bin/activate  # Windows: .\venv\Scripts\Activate.ps1

# Installer les dépendances
pip install -r requirements.txt
Base de Données :

Créer une base vide nommée reviews_db dans PostgreSQL.

Configurer le fichier .env à la racine :

Ini, TOML

DB_HOST=localhost
DB_NAME=reviews_db
DB_USER=postgres
DB_PASSWORD=votre_mot_de_passe
Initialiser les tables :

Bash

python -m src.database.db_manager
🔌 Utilisation de l'API
Lancer le serveur de développement :

Bash

uvicorn src.api:app --reload
Documentation Swagger UI : http://127.0.0.1:8000/docs

Endpoint Principal : POST /add-app

Body : {"app_id": "com.exemple.app"}

Effet : Scrape l'app, l'ajoute en BDD et renvoie un aperçu JSON.

🛠️ Stack Technique
Framework API : FastAPI + Uvicorn

Scraping : google-play-scraper

Database : PostgreSQL + SQLAlchemy

Data Processing : Pandas

Dernière mise à jour : Novembre 2025