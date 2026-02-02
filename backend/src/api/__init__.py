from .auth import router as auth_router
from .todos import router as todos_router
from .chatbot import router as chatbot_router
from .chat import router as chat_router

__all__ = [
    "auth_router",
    "todos_router",
    "chatbot_router",
    "chat_router"
]