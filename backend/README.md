# 📱 Feedly - Main Backend API

Ce projet est le backend principal de la plateforme Feedly. Il centralise l'ingestion des avis (Scraping), le pipeline RAG (IA), et fournit l'API REST consommée par le Frontend.

---

## 🚀 Fonctionnalités Clés

- **Scraping Hybride & Performant :**

  - **Synchrone :** Récupération immédiate des 50 premiers avis pour un affichage instantané.
  - **Asynchrone (Background) :** Utilisation de **Celery + Redis** pour scraper l'historique complet (20k+ avis) sans bloquer l'interface utilisateur.

- **Base de Données Robuste :**

  - Gestion automatique des doublons (Upsert).
  - Nettoyage et normalisation des données via PostgreSQL.

- **Chatbot RAG (Retrieval-Augmented Generation) :**

  - Intégration de **Google Gemini**.
  - Analyse sémantique des avis stockés pour répondre aux questions en langage naturel.

- **API RESTful :**
  - Exposée via **FastAPI** pour une communication fluide avec le Frontend.

---

## 🛠️ Stack Technique

| Composant          | Technologie       | Description                                             |
| :----------------- | :---------------- | :------------------------------------------------------ |
| **Langage**        | Python 3.10+      | Langage principal du backend.                           |
| **API Framework**  | FastAPI + Uvicorn | Serveur web haute performance.                          |
| **Queue & Broker** | Celery + Redis    | Gestion des tâches longues (Scraping de masse).         |
| **Database ORM**   | SQLAlchemy        | Interaction avec PostgreSQL.                            |
| **AI Provider**    | Google Gemini     | Modèle LLM pour le Chatbot (via `google-generativeai`). |

---

## ⚙️ Installation & Configuration

### 1. Prérequis

- **PostgreSQL** installé et un serveur local actif.
- **Redis** installé et fonctionnel (Service Windows ou Docker).
- Une **Clé API Google Gemini** (Google AI Studio).

### 2. Installation des dépendances

`bash`
cd backend
python -m venv venv

# Activation (Windows) :

.\venv\Scripts\Activate.ps1

# Activation (Mac/Linux) :

source venv/bin/activate

pip install -r requirements.txt 3. Configuration des variables d'environnement (.env)
Créez un fichier .env à la racine du dossier google-play-scraper-pipeline :

Ini, TOML

# Base de données PostgreSQL

DB_HOST=localhost
DB_NAME=reviews_db
DB_USER=postgres
DB_PASSWORD=votre_mot_de_passe

# Redis (Broker pour Celery)

# Si installé nativement sur Windows :

CELERY_BROKER_URL=redis://localhost:6379/0

# Intelligence Artificielle (Gemini)

GEMINI_API_KEY=AIzaSyDxxxxxxxxxxxxxxxxxxxxxxxxxx
🏃‍♂️ Démarrage des Services
Pour que le backend soit 100% fonctionnel, deux terminaux distincts doivent tourner en parallèle.

Terminal 1 : L'API (Serveur Web)
C'est le point d'entrée pour le Frontend (Reçoit les requêtes HTTP).

Bash

# Assurez-vous que le venv est activé

uvicorn src.api:app --reload
URL de base : http://localhost:8000

Documentation Swagger : http://localhost:8000/docs

Terminal 2 : Le Worker (Tâches de fond)
C'est lui qui effectue le travail lourd (Scraping de masse) sans ralentir l'API.

Bash

# Assurez-vous que le venv est activé

celery -A src.tasks worker --loglevel=info --pool=solo
(Note : L'option --pool=solo est recommandée pour Celery sous Windows).

🔌 Documentation API (Endpoints & Intégration Frontend)
Voici les endpoints clés à intégrer dans l'interface utilisateur React/Vue.

1. Ajouter une Application (POST /add-app)
   Lance le scraping. L'API répond immédiatement "Accepted" et délègue le travail à Celery. Une fois le scraping terminé, l'application est disponible dans la base de données.

Payload (JSON) :

JSON

{
"app_id": "com.instagram.android",
"country": "fr",
"count": 2000
}
Réponse : 200 OK avec un task_id pour le suivi éventuel.

2. Lire les avis (GET /get-reviews/{app_id})
   Récupère les derniers avis stockés pour une application.

URL : /get-reviews/com.example.app?limit=100

3. Discuter avec les Données (POST /chat)
   Endpoint pour le Chatbot Intelligent (RAG).

⚠️ NOTE IMPORTANTE POUR LE FRONTEND (UX/UI) : Le Chatbot doit être contextuel.

L'utilisateur ne doit pas avoir à saisir l'ID de l'application dans la conversation.

Le Frontend doit récupérer l'ID de l'application depuis la page en cours (URL ou State interne) et l'injecter silencieusement dans la requête API.

L'utilisateur ne tape que sa question.

Exemple de Flux Frontend :

L'utilisateur visite la page dashboard de Instagram.

Il demande : "Quels sont les bugs ?"

Le Frontend construit la requête en background : app_id: "com.instagram.android" + question: "Quels sont les bugs ?"

Payload de la requête :

JSON

{
"app_id": "com.instagram.android",
"question": "Quels sont les bugs signalés cette semaine ?"
}
Réponse de l'API :

JSON

{
"app": "com.instagram.android",
"question": "Quels sont les bugs signalés cette semaine ?",
"response": "Les utilisateurs signalent principalement des crashs au démarrage et des problèmes de connexion...",
"analyzed_reviews_count": 50
}
Le Frontend doit afficher le contenu du champ response.
