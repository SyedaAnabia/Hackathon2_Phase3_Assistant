from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from typing import List, Dict, Any
from uuid import UUID
from sqlmodel import Session
from ..database.session import get_session
from ..api.auth import get_current_user
from ..services.chatbot_service import chatbot_service, ChatMessage, ChatResponse
from ..services.todo_service import get_todos_by_user
from ..models.user import User


router = APIRouter(tags=["chatbot"])


class ChatRequest(BaseModel):
    messages: List[ChatMessage]
    user_context: Dict[str, Any] = {}  # Additional context like user's todos, preferences, etc.


@router.post("/chat", response_model=ChatResponse)
def chat_with_bot(
    chat_request: ChatRequest,
    current_user: dict = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """
    Chat with the AI assistant. The assistant can help with:
    - Managing todos
    - Providing suggestions
    - Answering questions about the application
    """
    try:
        # Get the current user's todos to provide context to the AI
        user_id = UUID(current_user["user_id"])

        # Fetch user's todos to provide context
        user_todos = get_todos_by_user(session, user_id, completed=None, skip=0, limit=100)

        # Prepare user context with todos
        user_context = {
            "todos": user_todos,
            **chat_request.user_context  # Include any additional context from the request
        }

        # Generate response using the Gemini-powered chatbot service
        result = chatbot_service.generate_response(
            messages=chat_request.messages,
            user_context=user_context
        )

        return ChatResponse(
            response=result["response"],
            suggestions=result["suggestions"]
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error processing chat request: {str(e)}"
        )