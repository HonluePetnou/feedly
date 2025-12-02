# Plateforme de Surveillance et d'Aide à la Décision

Backend de l'application de surveillance des avis Google Play Store. Ce projet permet de récupérer, stocker et analyser les avis d'applications mobiles pour en extraire des tendances et aider à la décision.

## Fonctionnalités

*   **Ingestion de données** : Scraping automatique des avis via `google-play-scraper`.
*   **Analyse** : Analyse de sentiment (Positif, Neutre, Négatif) et calcul de scores.
*   **API REST** : Interface complète pour gérer les applications et consulter les données.
*   **Sécurité** : Authentification JWT complète (Inscription, Connexion, Protection des routes).

## Prérequis

*   Python 3.8+
*   Pip

## Installation

1.  **Cloner le projet** (ou extraire l'archive)
2.  **Créer un environnement virtuel** :
    ```bash
    python -m venv .venv
    # Windows
    .venv\Scripts\activate
    # Linux/Mac
    source .venv/bin/activate
    ```
3.  **Installer les dépendances** :
    ```bash
    pip install -r requirements.txt
    ```

## Configuration

Le projet utilise une base de données SQLite par défaut (`sql_app.db`).
La configuration se trouve dans `app/core/config.py`.

> **Note** : Pour la production, pensez à changer la `SECRET_KEY` dans `app/core/config.py`.

## Lancement

Pour démarrer le serveur de développement :

```bash
uvicorn app.main:app --reload
```

L'API sera accessible à l'adresse : `http://127.0.0.1:8000`

## Documentation de l'API

Une fois le serveur lancé, la documentation interactive est disponible automatiquement :

*   **Swagger UI** : [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs) - Pour tester les endpoints directement.
*   **ReDoc** : [http://127.0.0.1:8000/redoc](http://127.0.0.1:8000/redoc) - Pour une lecture plus agréable.

## Utilisation Rapide

1.  Allez sur `/docs`.
2.  Créez un compte via `POST /api/v1/auth/signup`.
3.  Connectez-vous via `POST /api/v1/auth/token` (cliquez sur le bouton "Authorize" en haut à droite).
4.  Ajoutez une app via `POST /api/v1/apps/` (ex: `{"package_name": "com.whatsapp"}`).
5.  Lancez une synchro via `POST /api/v1/apps/{id}/sync`.
6.  Consultez les stats via `GET /api/v1/apps/{id}/stats`.
