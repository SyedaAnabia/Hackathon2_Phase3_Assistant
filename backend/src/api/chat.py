from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
from uuid import UUID


router = APIRouter(tags=["chat"])


class ChatRequest(BaseModel):
    conversation_id: Optional[UUID] = None
    message: str
    user_context: Dict[str, Any] = {}


class ToolCallInfo(BaseModel):
    name: str
    arguments: Dict[str, Any]
    result: Optional[str] = None


class ChatResponse(BaseModel):
    response: str
    tool_calls: List[ToolCallInfo] = []


@router.post("/users/{user_id}/chat", response_model=ChatResponse)
async def chat_with_ai(
    user_id: str,
    chat_request: ChatRequest
):
    """
    Chat endpoint that returns a simple response for testing.
    """
    # For now, return a simple mock response to avoid database and API issues
    print(f"Received chat request from user {user_id}: {chat_request.message}")

    # Mock response for testing
    mock_response = f"I received your message: '{chat_request.message}'. This is a mock response for testing purposes."

    return ChatResponse(
        response=mock_response,
        tool_calls=[]
    )


# Remove the GET endpoint for now to minimize complexity