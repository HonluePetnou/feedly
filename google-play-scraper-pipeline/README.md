# 📱 Feedly - Backend API & Scraper Pipeline

Ce projet constitue le cœur du backend de la plateforme Feedly. Il gère l'ingestion des avis Google Play Store, le stockage en base de données, et l'interface d'intelligence artificielle générative (RAG).

---

## 🚀 Fonctionnalités Clés

* **Scraping Hybride :**
    * **Synchrone :** Récupération immédiate des 50 premiers avis pour un affichage rapide.
    * **Asynchrone (Background) :** Utilisation de **Celery + Redis** pour scraper l'historique complet (20k+ avis) sans bloquer l'API.

* **Base de Données :**
    * Gestion des doublons.
    * Nettoyage automatique des données via PostgreSQL.

* **Chatbot RAG (Retrieval-Augmented Generation) :**
    * Intégration de **Google Gemini**.
    * Réponse aux questions en langage naturel basées sur les avis stockés.

* **API RESTful :**
    * Exposée via **FastAPI** pour la communication avec le Frontend.

---

## 🛠️ Stack Technique

| Composant | Technologie |
| :--- | :--- |
| **Langage** | Python 3.10+ |
| **API Framework** | FastAPI + Uvicorn |
| **Queue & Broker** | Celery + Redis |
| **Database ORM** | SQLAlchemy (PostgreSQL) |
| **AI Provider** | Google Generative AI (Gemini) |

---

## ⚙️ Installation & Configuration

### 1. Prérequis
* PostgreSQL installé et fonctionnel.
* Redis installé et fonctionnel (Service Windows ou Docker).
* Une clé API Google Gemini (AI Studio).

### 2. Installation des dépendances

```bash
cd google-play-scraper-pipeline
python -m venv venv

# Windows :
.\venv\Scripts\Activate.ps1

pip install -r requirements.txt
3. Configuration (.env)
Créez un fichier .env à la racine du dossier avec les variables suivantes :

Ini, TOML

# Base de données
DB_HOST=localhost
DB_NAME=reviews_db
DB_USER=postgres
DB_PASSWORD=votre_mot_de_passe

# Redis (Broker pour Celery)
CELERY_BROKER_URL=redis://localhost:6379/0

# Intelligence Artificielle (Gemini)
GEMINI_API_KEY=AIzaSyDxxxxxxxxxxxxxxxxxxxxxxxxxx
🏃‍♂️ Démarrage des Services
Pour que le backend soit 100% fonctionnel, deux terminaux doivent tourner en parallèle.

Terminal 1 : L'API (Serveur Web)
C'est le point d'entrée pour le Frontend.

Bash

uvicorn src.api:app --reload
Accessible sur : http://localhost:8000

Documentation Swagger : http://localhost:8000/docs

Terminal 2 : Le Worker (Tâches de fond)
C'est lui qui effectue le scraping de masse en arrière-plan.

Bash

celery -A src.tasks worker --loglevel=info --pool=solo
🔌 Documentation API (Endpoints Principaux)
Voici les endpoints clés à intégrer dans l'interface utilisateur.

1. Ajouter une Application (POST /add-app)
Lance le scraping. Répond immédiatement "Accepted" et délègue le travail à Celery.

Payload :

JSON

{
  "app_id": "com.instagram.android",
  "country": "fr",
  "count": 2000
}
Réponse : 200 OK avec un task_id pour le suivi.

2. Discuter avec les Données (POST /chat)
Endpoint pour le Chatbot Intelligent. Il analyse les 50 derniers avis pertinents pour répondre.

Payload :

JSON

{
  "app_id": "com.instagram.android",
  "question": "Quels sont les bugs signalés cette semaine ?"
}
Réponse :

JSON

{
  "app": "com.instagram.android",
  "response": "Les utilisateurs signalent principalement des crashs au démarrage...",
  "analyzed_reviews_count": 50
}


Backend Feedly - 2025