📱 Plateforme de Surveillance Google Play (Backend)
Ce projet est le moteur backend d'une plateforme d'aide à la décision basée sur les avis utilisateurs. Il permet de collecter, nettoyer et stocker les données du Google Play Store via une architecture hybride (Temps réel + Arrière-plan).

🚀 Fonctionnalités Clés
Entrée Intelligente : Accepte une URL Google Play ou un ID d'application (ex: com.whatsapp).

On-Boarding Temps Réel : Scrape un échantillon immédiat pour valider l'ajout et répondre à l'interface en < 3 secondes.

Surveillance Arrière-plan : Utilise Celery & Redis pour scraper l'historique massif (milliers d'avis) sans bloquer l'utilisateur.

Pipeline ETL :

Extract : google-play-scraper

Transform : Module de nettoyage automatique (suppression tags traduction, espaces, avis vides).

Load : Stockage structuré dans PostgreSQL.

API REST : Exposée via FastAPI pour la communication avec le Frontend (React).

📂 Architecture du Projet
Plaintext

google-play-scraper-pipeline/
├── config/               # Fichiers de configuration
├── src/
│   ├── api.py            # POINT D'ENTRÉE : API FastAPI
│   ├── tasks.py          # WORKER : Tâches d'arrière-plan (Celery)
│   ├── main_pipeline.py  # Script de test manuel
│   ├── database/
│   │   ├── models.py     # Schéma de la BDD (Applications, Reviews)
│   │   └── db_manager.py # Connexion PostgreSQL
│   ├── pipeline/
│   │   ├── cleaner.py    # Logique de Nettoyage des données
│   │   └── loader.py     # Logique d'Insertion en BDD
│   └── scraper/
│       └── scraper_module.py # Moteur de scraping
├── .env                  # Variables d'environnement (Secrets)
├── requirements.txt      # Liste des dépendances
└── README.md             # Documentation
🛠️ Installation & Configuration
1. Prérequis
Python 3.9+

PostgreSQL

Redis (Requis pour les tâches d'arrière-plan)

2. Installation
Bash

# 1. Créer et activer l'environnement virtuel
python -m venv venv
source venv/bin/activate  # Windows: .\venv\Scripts\Activate.ps1

# 2. Installer les dépendances
pip install -r requirements.txt
3. Configuration Base de Données
Créez un fichier .env à la racine :

Ini, TOML

DB_HOST=localhost
DB_NAME=reviews_db
DB_USER=postgres
DB_PASSWORD=votre_mot_de_passe
CELERY_BROKER_URL=redis://localhost:6379/0
Initialisez les tables :

Bash

python -m src.database.db_manager
🏃‍♂️ Démarrage du Système
Le système nécessite deux terminaux ouverts simultanément.

Terminal 1 : Lancer l'API (Serveur Web)
C'est le point d'entrée pour le Frontend.

Bash

uvicorn src.api:app --reload
L'API sera accessible sur : http://127.0.0.1:8000

Terminal 2 : Lancer le Worker (Arrière-plan)
C'est lui qui traite l'historique et les tâches lourdes.

Bash

# Sur Windows (Important : --pool=solo)
celery -A src.tasks worker --loglevel=info --pool=solo

# Sur Linux/Mac
celery -A src.tasks worker --loglevel=info
🔌 Documentation de l'API
1. Ajouter une Application (Point d'Entrée Principal)
Utilisé par le bouton "Chercher" de l'interface utilisateur.

URL : POST /add-app

Description : Lance le scraping immédiat + planifie le scraping complet.

Format JSON :

JSON

{
  "query": "https://play.google.com/store/apps/details?id=com.whatsapp"
}
(Le champ query accepte aussi directement l'ID : com.whatsapp)

2. Lire les Avis (Dashboard)
Utilisé pour afficher les données.

URL : GET /get-reviews/{app_id}

Exemple : /get-reviews/com.whatsapp?limit=100

🧪 Tests
Vous pouvez tester l'API directement via l'interface Swagger générée automatiquement : 👉 http://127.0.0.1:8000/docs