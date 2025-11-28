# Google Play Reviews Scraper & ETL Pipeline (Phase 3)

Ce projet constitue la **Phase 3** du développement global. Il s'agit d'un module Python autonome conçu pour **scraper**, **nettoyer** et **stocker** les avis d'applications depuis le Google Play Store.

L'objectif final est de fournir des données structurées et propres pour alimenter les modèles d'Intelligence Artificielle.

## 📋 Fonctionnalités Clés

* **Extraction (Scraping) :** Collecte automatisée des avis via `google-play-scraper`.
* **Support Multi-Apps :** Gestion dynamique d'une liste d'applications à surveiller.
* **Architecture Modulaire :** Séparation claire entre Scraping, Nettoyage et Base de Données.
* **ORM Database :** Utilisation de SQLAlchemy pour interagir proprement avec la BDD.
* **Automatisation :** Prêt pour l'intégration de tâches planifiées (Celery/Redis).

---

## 📂 Structure du Projet

L'architecture sépare les responsabilités pour faciliter la maintenance :

```text
google-play-scraper-pipeline/
├── config/
│   └── settings.ini          # Configuration (Liste des Apps, paramètres généraux)
├── data/                     # Stockage temporaire (utile pour le debug)
│   ├── raw/                  # Données brutes (JSON/CSV avant nettoyage)
│   └── processed/            # Données nettoyées (prêtes pour l'insertion)
├── src/
│   ├── scraper/
│   │   └── scraper_module.py # LOGIQUE D'EXTRACTION (Google Play)
│   ├── pipeline/
│   │   └── cleaner.py        # LOGIQUE DE TRANSFORMATION (Pandas)
│   ├── database/
│   │   ├── db_manager.py     # Gestion de la connexion BDD (SQLAlchemy)
│   │   └── models.py         # Définition des tables (Schémas)
│   ├── tasks.py              # Tâches Celery pour l'automatisation
│   └── main_pipeline.py      # ORCHESTRATEUR (Point d'entrée du script)
├── .env                      # Secrets (Mots de passe DB, API Keys)
├── .gitignore                # Fichiers à ignorer par Git
├── README.md                 # Documentation
└── requirements.txt          # Dépendances Python
Détails des Modules
src/scraper/ : Interagit avec l'extérieur (le Store). Si l'API change, on modifie ici.

src/pipeline/ : Contient la logique de nettoyage des données (suppression emojis, formatage dates).

src/database/ : Gère tout ce qui touche au stockage. models.py définit à quoi ressemble une ligne de donnée, et db_manager.py gère l'insertion.

🚀 Installation & Configuration
1. Prérequis
Python 3.9+

Une base de données (PostgreSQL recommandé ou MySQL)

Redis (optionnel, uniquement pour le mode planifié)

2. Installation
Bash

# Créer et activer l'environnement virtuel
python -m venv venv
source venv/bin/activate  # Windows: .\venv\Scripts\Activate.ps1 (powershell) || venv\Scripts\activate (cmd || git bash)

# Installer les dépendances
pip install -r requirements.txt
3. Configuration
Créez un fichier .env à la racine :

Ini, TOML

DB_HOST=localhost
DB_NAME=reviews_db
DB_USER=postgres
DB_PASSWORD=secret
Configurez les cibles dans config/settings.ini :

Ini, TOML

[SCRAPING]
target_apps = com.whatsapp, com.instagram.android
🏃‍♂️ Lancement
Pour lancer le pipeline complet manuellement :

Bash

python src/main_pipeline.py




Dernière mise à jour : Novembre 2025