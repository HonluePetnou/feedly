from datetime import timedelta
from typing import Any
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app.api import deps
from app.core import security
from app.models import models
from app.schemas import schemas
from app.core.config import settings

router = APIRouter()

@router.post("/token", response_model=schemas.Token, summary="Se connecter (Obtenir un token)")
def login_access_token(
    db: Session = Depends(deps.get_db), form_data: OAuth2PasswordRequestForm = Depends()
) -> Any:
    """
    Authentification OAuth2 compatible.
    
    Retourne un token d'accès (JWT) valide pour les futures requêtes.
    - **username**: Email de l'utilisateur.
    - **password**: Mot de passe.
    """
    user = db.query(models.User).filter(models.User.email == form_data.username).first()
    if not user or not security.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    elif not user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")
    
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = security.create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/signup", response_model=schemas.User, summary="Créer un compte utilisateur")
def create_user(
    *,
    db: Session = Depends(deps.get_db),
    user_in: schemas.UserCreate,#donnees sur l'utilisateur à créer
) -> Any:
    """
    Crée un nouvel utilisateur dans le système.
    
    L'utilisateur sera actif par défaut mais sans droits d'administration.
    """
    user = db.query(models.User).filter(models.User.email == user_in.email).first()
    if user:
        raise HTTPException(
            status_code=400,
            detail="The user with this username already exists in the system.",
        )
    
    user = models.User(
        email=user_in.email,
        hashed_password=security.get_password_hash(user_in.password),
        is_active=True,
        is_superuser=False,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user
