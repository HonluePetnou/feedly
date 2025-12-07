## 2. Documentation du Moteur IA (`ai-engine/README.md`)

Ce fichier explique au reste de l'équipe comment les données sont "enrichies" (Sentiment + Catégorie). C'est crucial pour que le développeur Frontend sache comment afficher les couleurs (Vert/Rouge) et les filtres.

**Copiez ceci dans `ai-engine/README.md` :**

```markdown
# 🧠 Feedly AI Engine (Microservice)

Ce module est le service d'analyse autonome de la plateforme. Il fonctionne comme un "Watcher" : il surveille la base de données en permanence, détecte les nouveaux avis bruts insérés par le Scraper, et les enrichit.

## ⚡ Rôle dans l'Architecture

Ce service est totalement découplé de l'API. Il ne communique que via la base de données.
Son rôle est de transformer la donnée brute en donnée exploitable pour le Dashboard.

1.  **Analyse de Sentiment (BERT) :** Attribue un score de positivité.
2.  **Catégorisation (Keyword Extraction) :** Classe l'avis (Bug, Feature, etc.).
3.  **Support Bilingue :** Gère nativement le Français et l'Anglais.

---

## 📊 Données pour le Frontend

Le moteur IA met à jour deux colonnes dans la table `reviews`. Voici comment les interpréter pour l'interface graphique.

### 1. Le Score de Sentiment (`sentiment_score`)
C'est un nombre flottant normalisé entre `-1.0` et `+1.0`.

| Score | Signification | Couleur suggérée (UI) |
| :--- | :--- | :--- |
| **-1.0 à -0.3** | Négatif / Colère | 🔴 Rouge |
| **-0.3 à +0.3** | Neutre / Mitigé | ⚪ Gris / Jaune |
| **+0.3 à +1.0** | Positif / Satisfait | 🟢 Vert |

### 2. La Catégorie (`category`)
Utilisée pour les filtres et les diagrammes circulaires (Pie Charts).

| Code Catégorie | Description |
| :--- | :--- |
| `BUG_TECHNIQUE` | Crashs, erreurs, écrans noirs, lenteurs. |
| `PRICING_ADS` | Plaintes sur le prix, les abonnements ou la publicité excessive. |
| `FEATURE_REQUEST` | Demandes de nouvelles fonctionnalités. |
| `SATISFACTION` | Avis purement élogieux sans détails techniques. |
| `AUTRE` | Tout ce qui ne rentre pas dans les cases ci-dessus. |

---

## 🛠️ Installation & Lancement

⚠️ **Attention :** Ce module utilise un environnement virtuel dédié (`venv`) à cause de la taille des librairies PyTorch/Transformers. Ne pas utiliser le venv du scraper.

### 1. Installation

```bash```
cd ai-engine
python -m venv venv
# Windows :
.\venv\Scripts\Activate.ps1

pip install -r requirements.txt
2. Configuration (.env)
Copier le fichier .env du scraper ici (mêmes accès BDD).

3. Lancer le Watcher
Bash

python -m src.main
Le script doit tourner en permanence en arrière-plan pour traiter les nouveaux avis au fil de l'eau.

Feedly AI Module - 2025