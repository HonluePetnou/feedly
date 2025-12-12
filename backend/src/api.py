from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import configparser

# Import routers
from src.routers import auth, apps, chat, dashboard
from src.database.db_manager import init_db

# Load Config
config = configparser.ConfigParser()
config.read('config/settings.ini')

# Initialiser les tables au démarrage
init_db()

app = FastAPI(
    title="Google Play Monitoring API",
    description="API Hybride avec résolution intelligente des noms d'apps. Modules : Auth, Apps, Chat."
)

# --- CORS ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Include Routers ---
app.include_router(auth.router)
app.include_router(apps.router)
app.include_router(chat.router)
app.include_router(dashboard.router)

@app.get("/")
def read_root():
    return {"status": "online", "message": "API prête 🚀"}
