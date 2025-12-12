from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

# --- AUTH SCHEMAS ---
class UserRegister(BaseModel):
    fullname: str
    email: str
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

class VerifyOTPRequest(BaseModel):
    email: str
    otp: str

class UserUpdateProfile(BaseModel):
    fullname: str
    email: str

class UserUpdatePassword(BaseModel):
    current_password: str
    new_password: str

# --- APP SCHEMAS ---
class AppRequest(BaseModel):
    app_id: str
    country: str = "fr"
    count: int = 200

class ChatRequest(BaseModel):
    app_id: str
    question: str

class AppUpdate(BaseModel):
    name: Optional[str] = None
    icon_url: Optional[str] = None

# --- FORGOT PASSWORD SCHEMAS ---
class ForgotPasswordRequest(BaseModel):
    email: str

class ResetPasswordRequest(BaseModel):
    email: str
    otp: str
    new_password: str

# --- CHAT SCHEMAS ---
class ConversationCreate(BaseModel):
    app_id: int

class MessageCreate(BaseModel):
    content: str

class MessageResponse(BaseModel):
    id: int
    role: str
    content: str
    created_at: datetime
    
    class Config:
        from_attributes = True

class ConversationResponse(BaseModel):
    id: int
    app_id: int
    app_name: Optional[str] = None
    app_icon: Optional[str] = None
    last_message: Optional[str] = None
    updated_at: datetime
    
    class Config:
        from_attributes = True

class ConversationDetailResponse(BaseModel):
    id: int
    app_id: int
    app_name: Optional[str] = None
    app_icon: Optional[str] = None
    messages: List[MessageResponse] = []
    
    class Config:
        from_attributes = True
