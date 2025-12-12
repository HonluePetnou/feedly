import os
import resend
from dotenv import load_dotenv

load_dotenv()

# Configuration Resend
resend.api_key = os.getenv("RESEND_API_KEY")
FROM_EMAIL = os.getenv("FROM_EMAIL", "onboarding@resend.dev")

def send_otp_email(to_email: str, otp_code: str, user_name: str = "Utilisateur"):
    """
    Envoie un email OTP via Resend.
    """
    try:
        params = {
            "from": FROM_EMAIL,
            "to": [to_email],
            "subject": "🔐 Votre code de vérification Feedly",
            "html": f"""
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <h1 style="color: #2563eb;">Bienvenue sur Feedly, {user_name} !</h1>
                <p style="font-size: 16px; color: #333;">
                    Utilisez le code ci-dessous pour activer votre compte :
                </p>
                <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
                    <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #1f2937;">
                        {otp_code}
                    </span>
                </div>
                <p style="font-size: 14px; color: #666;">
                    Ce code expire dans <strong>10 minutes</strong>.
                </p>
                <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
                <p style="font-size: 12px; color: #999;">
                    Si vous n'avez pas demandé ce code, ignorez cet email.
                </p>
            </div>
            """
        }
        
        email = resend.Emails.send(params)
        print(f"✅ Email envoyé à {to_email} (ID: {email.get('id', 'N/A')})")
        return True
    except Exception as e:
        print(f"❌ Erreur Resend : {e}")
        return False

def send_password_reset_email(to_email: str, reset_link: str):
    """
    Envoie un email de réinitialisation de mot de passe.
    """
    try:
        params = {
            "from": FROM_EMAIL,
            "to": [to_email],
            "subject": "🔑 Réinitialisation de votre mot de passe Feedly",
            "html": f"""
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <h1 style="color: #2563eb;">Réinitialisation de mot de passe</h1>
                <p>Cliquez sur le bouton ci-dessous pour réinitialiser votre mot de passe :</p>
                <a href="{reset_link}" style="display: inline-block; background: #2563eb; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; margin: 20px 0;">
                    Réinitialiser mon mot de passe
                </a>
                <p style="font-size: 12px; color: #999;">Ce lien expire dans 1 heure.</p>
            </div>
            """
        }
        
        resend.Emails.send(params)
        return True
    except Exception as e:
        print(f"❌ Erreur Resend : {e}")
        return False
