from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import datetime, timedelta

from src.database.db_manager import get_db
from src.database.models import User
from src.auth_utils import get_password_hash, verify_password, create_access_token, generate_otp, get_current_user, oauth2_scheme
from src.schemas import UserRegister, UserLogin, VerifyOTPRequest, UserUpdateProfile, UserUpdatePassword, ForgotPasswordRequest, ResetPasswordRequest
from src.email_service import send_otp_email

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)

@router.post("/register")
def register(user: UserRegister, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.email == user.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT, 
            detail="Un compte avec cet email existe déjà"
        )
    
    # 2. Hash password
    hashed_pwd = get_password_hash(user.password)
    
    # 3. Create user (with OTP)
    initial_otp = generate_otp()
    otp_expires = datetime.utcnow() + timedelta(minutes=10)
    
    new_user = User(
        fullname=user.fullname,
        email=user.email,
        hashed_password=hashed_pwd,
        otp_code=initial_otp,
        otp_expires_at=otp_expires,
        is_active=False
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    # Envoi email OTP via Resend
    send_otp_email(to_email=user.email, otp_code=initial_otp, user_name=user.fullname)
    
    return {"message": "Compte créé avec succès. Vérifiez votre email pour le code OTP.", "user_id": new_user.id}

@router.post("/login")
def login(user: UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user.email).first()
    if not db_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="Compte introuvable"
        )
    
    if not verify_password(user.password, db_user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, 
            detail="Email ou mot de passe incorrect"
        )
    
    # Check if account is active
    if not db_user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, 
            detail="Compte non activé. Veuillez vérifier votre email pour le code OTP."
        )
    
    access_token = create_access_token(data={"sub": db_user.email})
    
    return {
        "access_token": access_token, 
        "token_type": "bearer",
        "user": {
            "id": db_user.id,
            "fullname": db_user.fullname,
            "email": db_user.email
        }
    }

@router.post("/verify-otp")
def verify_otp(request: VerifyOTPRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == request.email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    if user.otp_code != request.otp:
        raise HTTPException(status_code=400, detail="Invalid OTP")
    
    if user.otp_expires_at and user.otp_expires_at < datetime.utcnow():
        raise HTTPException(status_code=400, detail="OTP Expired")
    
    user.is_active = True
    user.otp_code = None
    db.commit()
    
    return {"message": "Account activated successfully"}

@router.post("/resend-otp")
def resend_otp(request: UserLogin, db: Session = Depends(get_db)): 
    # Note: Using UserLogin here just for email field as per previous implementation logic
    user = db.query(User).filter(User.email == request.email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    new_otp = generate_otp()
    user.otp_code = new_otp
    user.otp_expires_at = datetime.utcnow() + timedelta(minutes=10)
    db.commit()
    
    # Envoi email OTP via Resend
    send_otp_email(to_email=user.email, otp_code=new_otp, user_name=user.fullname)
    
    return {"message": "Nouveau code OTP envoyé par email"}

@router.get("/me")
def get_me(current_user: User = Depends(get_current_user)):
    return {
        "id": current_user.id,
        "fullname": current_user.fullname,
        "email": current_user.email,
        "is_active": current_user.is_active,
        "created_at": current_user.created_at
    }

@router.put("/profile")
def update_profile(data: UserUpdateProfile, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    current_user.fullname = data.fullname
    current_user.email = data.email 
    db.commit()
    return {"message": "Profile updated", "user": data}

@router.put("/password")
def update_password(data: UserUpdatePassword, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if not verify_password(data.current_password, current_user.hashed_password):
        raise HTTPException(status_code=400, detail="Incorrect current password")
    
    current_user.hashed_password = get_password_hash(data.new_password)
    db.commit()
    return {"message": "Password updated successfully"}

@router.post("/logout")
def logout(token: str = Depends(oauth2_scheme)):
    from src.auth_utils import add_to_blacklist
    add_to_blacklist(token)
    return {"message": "Déconnexion réussie"}

@router.delete("/account")
def delete_account(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    db.delete(current_user)
    db.commit()
    return {"message": "Account deleted successfully"}

@router.post("/forgot-password")
def forgot_password(data: ForgotPasswordRequest, db: Session = Depends(get_db)):
    """
    Demande de réinitialisation de mot de passe.
    Envoie un code OTP par email.
    """
    user = db.query(User).filter(User.email == data.email).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Aucun compte avec cet email"
        )
    
    # Générer et sauvegarder l'OTP
    otp = generate_otp()
    user.otp_code = otp
    user.otp_expires_at = datetime.utcnow() + timedelta(minutes=10)
    db.commit()
    
    # Envoyer l'email
    send_otp_email(to_email=user.email, otp_code=otp, user_name=user.fullname)
    
    return {"message": "Code de réinitialisation envoyé par email"}

@router.post("/reset-password")
def reset_password(data: ResetPasswordRequest, db: Session = Depends(get_db)):
    """
    Réinitialise le mot de passe avec le code OTP.
    """
    user = db.query(User).filter(User.email == data.email).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Aucun compte avec cet email"
        )
    
    # Vérifier l'OTP
    if user.otp_code != data.otp:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Code OTP invalide"
        )
    
    if user.otp_expires_at and user.otp_expires_at < datetime.utcnow():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Code OTP expiré"
        )
    
    # Mettre à jour le mot de passe
    user.hashed_password = get_password_hash(data.new_password)
    user.otp_code = None
    user.otp_expires_at = None
    db.commit()
    
    return {"message": "Mot de passe mis à jour avec succès"}
