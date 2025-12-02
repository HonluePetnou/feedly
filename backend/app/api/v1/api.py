from fastapi import APIRouter
from app.api.v1.endpoints import apps, auth

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(apps.router, prefix="/apps", tags=["apps"])
