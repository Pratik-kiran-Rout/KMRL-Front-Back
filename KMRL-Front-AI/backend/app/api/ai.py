from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ..core.database import get_db
from ..models.user import User
from ..api.schemas import ChatMessage, ChatResponse
from ..api.auth import get_current_user
from ..services.ai_service import AIService

router = APIRouter()

@router.post("/chat", response_model=ChatResponse)
async def chat_with_ai(
    message: ChatMessage,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    try:
        ai_service = AIService()
        response, confidence = ai_service.chat_response(message.message, message.context)
        
        return ChatResponse(
            response=response,
            confidence=confidence
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI service error: {str(e)}")

@router.post("/analyze-document")
async def analyze_document(
    document_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Placeholder for document analysis
    return {
        "document_id": document_id,
        "analysis": "Document analysis feature coming soon",
        "entities": [],
        "sentiment": "neutral",
        "topics": []
    }