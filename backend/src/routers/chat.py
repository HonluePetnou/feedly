from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime

from src.database.db_manager import get_db
from src.database.models import Application, Review, Conversation, ChatMessage, User
from src.schemas import ChatRequest, ConversationCreate, MessageCreate, ConversationResponse, ConversationDetailResponse, MessageResponse
from src.rag import ask_gemini_about_reviews
from src.auth_utils import get_current_user

router = APIRouter(
    prefix="/chat",
    tags=["Chatbot"]
)


# --- LIST CONVERSATIONS ---
@router.get("/conversations", response_model=List[ConversationResponse])
def list_conversations(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Get all conversations for the current user."""
    conversations = db.query(Conversation)\
        .filter(Conversation.user_id == current_user.id)\
        .order_by(Conversation.updated_at.desc())\
        .all()
    
    result = []
    for conv in conversations:
        # Get last message
        last_msg = db.query(ChatMessage)\
            .filter(ChatMessage.conversation_id == conv.id)\
            .order_by(ChatMessage.created_at.desc())\
            .first()
        
        result.append(ConversationResponse(
            id=conv.id,
            app_id=conv.app_id,
            app_name=conv.application.name if conv.application else None,
            app_icon=conv.application.icon_url if conv.application else None,
            last_message=last_msg.content[:50] + "..." if last_msg and len(last_msg.content) > 50 else (last_msg.content if last_msg else None),
            updated_at=conv.updated_at
        ))
    
    return result


# --- GET CONVERSATION MESSAGES ---
@router.get("/conversations/{conversation_id}", response_model=ConversationDetailResponse)
def get_conversation(conversation_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Get a conversation with all its messages."""
    conv = db.query(Conversation)\
        .filter(Conversation.id == conversation_id, Conversation.user_id == current_user.id)\
        .first()
    
    if not conv:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Conversation non trouvée")
    
    messages = [MessageResponse(
        id=msg.id,
        role=msg.role,
        content=msg.content,
        created_at=msg.created_at
    ) for msg in conv.messages]
    
    return ConversationDetailResponse(
        id=conv.id,
        app_id=conv.app_id,
        app_name=conv.application.name if conv.application else None,
        app_icon=conv.application.icon_url if conv.application else None,
        messages=messages
    )


# --- CREATE CONVERSATION ---
@router.post("/conversations", response_model=ConversationResponse)
def create_conversation(data: ConversationCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Start a new conversation with an app."""
    # Check if app exists
    app = db.query(Application).filter(Application.id == data.app_id).first()
    if not app:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Application non trouvée")
    
    # Check if conversation already exists
    existing = db.query(Conversation)\
        .filter(Conversation.user_id == current_user.id, Conversation.app_id == data.app_id)\
        .first()
    
    if existing:
        return ConversationResponse(
            id=existing.id,
            app_id=existing.app_id,
            app_name=app.name,
            app_icon=app.icon_url,
            last_message=None,
            updated_at=existing.updated_at
        )
    
    # Create new conversation
    conv = Conversation(user_id=current_user.id, app_id=data.app_id)
    db.add(conv)
    db.commit()
    db.refresh(conv)
    
    # Add welcome message
    welcome = ChatMessage(
        conversation_id=conv.id,
        role="bot",
        content=f"Bonjour ! Je suis prêt à analyser les avis de {app.name}. Posez-moi vos questions !"
    )
    db.add(welcome)
    db.commit()
    
    return ConversationResponse(
        id=conv.id,
        app_id=conv.app_id,
        app_name=app.name,
        app_icon=app.icon_url,
        last_message=welcome.content,
        updated_at=conv.updated_at
    )


# --- SEND MESSAGE ---
@router.post("/conversations/{conversation_id}/message", response_model=MessageResponse)
def send_message(conversation_id: int, data: MessageCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Send a message and get AI response."""
    # Get conversation
    conv = db.query(Conversation)\
        .filter(Conversation.id == conversation_id, Conversation.user_id == current_user.id)\
        .first()
    
    if not conv:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Conversation non trouvée")
    
    # Save user message
    user_msg = ChatMessage(conversation_id=conv.id, role="user", content=data.content)
    db.add(user_msg)
    
    # Update conversation timestamp
    conv.updated_at = datetime.utcnow()
    db.commit()
    
    # Get reviews for context
    reviews = db.query(Review.content)\
        .filter(Review.app_id == conv.app_id)\
        .filter(Review.content != None)\
        .order_by(Review.posted_at.desc())\
        .limit(50)\
        .all()
    
    reviews_text = [r.content for r in reviews]
    
    # Get AI response
    try:
        if reviews_text:
            ai_response = ask_gemini_about_reviews(
                app_name=conv.application.name or conv.application.package_name,
                question=data.content,
                reviews_context=reviews_text
            )
        else:
            ai_response = "Je n'ai pas trouvé d'avis pour cette application. Veuillez d'abord synchroniser les avis via la page Applications."
    except Exception as e:
        print(f"❌ Erreur Gemini : {e}")
        ai_response = "Désolé, j'ai rencontré un problème technique. Réessayez plus tard."
    
    # Save bot response
    bot_msg = ChatMessage(conversation_id=conv.id, role="bot", content=ai_response)
    db.add(bot_msg)
    db.commit()
    db.refresh(bot_msg)
    
    return MessageResponse(
        id=bot_msg.id,
        role=bot_msg.role,
        content=bot_msg.content,
        created_at=bot_msg.created_at
    )


# --- DELETE CONVERSATION ---
@router.delete("/conversations/{conversation_id}")
def delete_conversation(conversation_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Delete a conversation and all its messages."""
    conv = db.query(Conversation)\
        .filter(Conversation.id == conversation_id, Conversation.user_id == current_user.id)\
        .first()
    
    if not conv:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Conversation non trouvée")
    
    db.delete(conv)
    db.commit()
    
    return {"message": "Conversation supprimée"}


# --- LEGACY ENDPOINT (for backward compatibility) ---
@router.post("/")
def chat_with_data(request: ChatRequest, db: Session = Depends(get_db)):
    """Legacy chat endpoint without persistence."""
    app = db.query(Application).filter(Application.package_name == request.app_id).first()
    if not app:
        return {"error": "Application non trouvée. Veuillez d'abord l'ajouter via /add-app."}

    reviews = db.query(Review.content)\
        .filter(Review.app_id == app.id)\
        .filter(Review.content != None)\
        .order_by(Review.posted_at.desc())\
        .limit(50)\
        .all()

    if not reviews:
        return {"response": "Je n'ai pas trouvé assez d'avis pour analyser cette application."}

    reviews_text_list = [r.content for r in reviews]

    try:
        ai_response = ask_gemini_about_reviews(
            app_name=request.app_id,
            question=request.question,
            reviews_context=reviews_text_list
        )
        return {
            "app": request.app_id,
            "question": request.question,
            "response": ai_response,
            "analyzed_reviews_count": len(reviews_text_list)
        }
    except Exception as e:
        print(f"❌ Erreur Gemini : {e}")
        return {"error": "Le chatbot a rencontré un problème technique."}
