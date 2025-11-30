Markdown

# 📱 Plateforme de Surveillance Google Play (Backend)

Ce projet est le moteur backend d'une plateforme d'aide à la décision. Il permet de **collecter**, **nettoyer** et **stocker** les avis d'applications Google Play via une architecture hybride (Temps réel + Arrière-plan).

## 🚀 Fonctionnalités Clés

* **Entrée Flexible :** Accepte une URL du Store (`https://play.google.com/...`) ou un ID (`com.whatsapp`).
* **On-Boarding Temps Réel :** L'API répond en < 3 secondes avec un aperçu des données.
* **Background Workers :** Utilise **Celery & Redis** pour scraper des milliers d'avis en arrière-plan sans ralentir l'interface.
* **Pipeline ETL Automatisé :**
    * **E**xtract : Scraping via `google-play-scraper`.
    * **T**ransform : Nettoyage (suppression des tags de traduction, emojis conservés, filtrage vide).
    * **L**oad : Stockage structuré dans **PostgreSQL**.

---

## 🛠️ Installation Pas-à-Pas

### 1. Prérequis

Assurez-vous d'avoir installé :
* **Python 3.9+**
* **PostgreSQL** (Serveur de base de données)
* **Redis** (Message Broker pour les tâches d'arrière-plan)

### 2. Configuration du Projet

Clonez le projet et installez les dépendances :

```bash
# 1. Création de l'environnement virtuel (à la racine)
python -m venv venv

# 2. Activation
# Windows (PowerShell) :
.\venv\Scripts\Activate.ps1
# Mac/Linux :
source venv/bin/activate

# 3. Installation des librairies
pip install -r requirements.txt
3. Configuration de la Base de Données
Ouvrez votre terminal SQL (ou pgAdmin) et créez la base :

SQL

CREATE DATABASE reviews_db;
Créez un fichier .env à la racine du projet avec vos accès :

Ini, TOML

DB_HOST=localhost
DB_NAME=reviews_db
DB_USER=postgres
DB_PASSWORD=votre_mot_de_passe
CELERY_BROKER_URL=redis://localhost:6379/0
Initialisez les tables :

Bash

python -m src.database.db_manager
(Vous devez voir : "✅ Tables créées avec succès !")

4. Vérification Redis
Dans un terminal séparé :

Bash

redis-cli ping
# Réponse attendue : PONG
🏃‍♂️ Démarrage du Système (2 Terminaux Requis)
Le système nécessite deux processus qui tournent en parallèle.

Terminal 1 : L'API (Serveur Web)
C'est le point d'entrée qui reçoit les demandes du Frontend (React).

Bash

uvicorn src.api:app --reload
Statut : Accessible sur http://127.0.0.1:8000

Documentation Swagger : http://127.0.0.1:8000/docs

Terminal 2 : Le Worker (Arrière-plan)
C'est lui qui traite l'historique complet et les tâches longues.

Bash

# Sur Windows (Important : l'option --pool=solo est obligatoire)
celery -A src.tasks worker --loglevel=info --pool=solo

# Sur Mac/Linux
celery -A src.tasks worker --loglevel=info
🔌 Guide d'Utilisation de l'API
1. Ajouter une Application (Bouton "Chercher")
Utilisez ce point d'entrée pour démarrer le monitoring d'une nouvelle app.

Endpoint : POST /add-app

Body (JSON) :

JSON

{
  "query": "[https://play.google.com/store/apps/details?id=com.whatsapp](https://play.google.com/store/apps/details?id=com.whatsapp)"
}
Note : Vous pouvez aussi envoyer juste le nom ou l'ID dans le champ query.

2. Récupérer les Avis (Tableau de Bord)
Utilisez ce point d'entrée pour afficher les données stockées.

Endpoint : GET /get-reviews/{app_id}

Paramètres : limit (optionnel, défaut 100).

Exemple : /get-reviews/com.whatsapp?limit=500

🖥️ Guide d'Intégration Frontend (Flux de Données)
Pour une expérience utilisateur fluide, le Dashboard doit consommer les données de deux manières différentes selon le contexte :

Cas 1 : L'Utilisateur ajoute une Application (Temps Réel)
Quand l'utilisateur clique sur "Analyser" ou "Ajouter".

Action Frontend : Envoyer une requête POST /add-app.

Réponse API : L'API renvoie immédiatement un JSON avec un champ preview (contenant 50 avis).

Affichage : Le Frontend doit afficher directement les données contenues dans response.preview.

⚠️ Ne pas rappeler la base de données tout de suite (l'historique complet est encore en cours de chargement par Celery en arrière-plan).

Cas 2 : L'Utilisateur consulte le Dashboard (Historique)
Quand l'utilisateur charge la page, rafraîchit, ou revient plus tard.

Action Frontend : Envoyer une requête GET /get-reviews/{app_id}.

Réponse API : L'API interroge la base de données PostgreSQL.

Affichage : Le Frontend utilise le tableau reviews complet pour générer les graphiques et l'historique.

📂 Structure des Dossiers
Plaintext

google-play-scraper-pipeline/
├── src/
│   ├── api.py            # Point d'entrée API (FastAPI)
│   ├── tasks.py          # Worker pour tâches de fond (Celery)
│   ├── scraper/          # Module d'extraction (Google Play)
│   ├── pipeline/         # Modules de Nettoyage et Chargement BDD
│   └── database/         # Modèles SQLAlchemy et connexion
├── config/               # Configuration
├── requirements.txt      # Dépendances Python
└── README.md             # Ce fichier de documentation
Projet de Conception - Novembre 2025