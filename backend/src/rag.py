import os
import google.generativeai as genai
from dotenv import load_dotenv

# Charger les variables d'environnement
load_dotenv()

# Configuration de Gemini
api_key = os.getenv("GEMINI_API_KEY")
if not api_key:
    raise ValueError("❌ Clé GEMINI_API_KEY manquante dans le fichier .env")

genai.configure(api_key=api_key)

def ask_gemini_about_reviews(app_name: str, question: str, reviews_context: list):
    """
    Envoie les avis pertinents + la question de l'utilisateur à Gemini.
    """
    # 1. Préparer le contexte (transformer la liste d'avis en un gros texte)
    # On prend les 50 premiers avis max pour ne pas dépasser la limite de contexte
    context_text = "\n".join([f"- {r}" for r in reviews_context[:50]])
    
    # 2. Créer le Prompt (L'instruction pour l'IA)
    prompt = f"""
    Tu es un expert en analyse de produits mobiles. Voici des avis utilisateurs récents pour l'application "{app_name}" :
    
    --- DÉBUT DES AVIS ---
    {context_text}
    --- FIN DES AVIS ---
    
    Question de l'utilisateur : "{question}"
    
    Consigne : Réponds de manière synthétique et professionnelle en te basant UNIQUEMENT sur les avis ci-dessus. 
    Cite des exemples concrets si possible. Si l'information n'est pas dans les avis, dis-le.
    """
    
    try:
        # 3. Interroger le modèle (Gemini Pro)
        model = genai.GenerativeModel('gemini-2.5-flash')
        response = model.generate_content(prompt)
        return response.text
    except Exception as e:
        return f"Désolé, je n'ai pas pu analyser les avis pour le moment. Erreur : {e}"