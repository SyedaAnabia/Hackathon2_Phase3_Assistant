from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .api import auth_router, todos_router
# Temporarily exclude chat routers to troubleshoot
# from .api import chatbot_router, chat_router
from .database import create_db_and_tables
import os

# Load environment variables from .env file
from dotenv import load_dotenv
load_dotenv()


def create_app():
    app = FastAPI(title="Todo API", version="1.0.0")

    # CORS middleware
    app.add_middleware(
        CORSMiddleware,
        allow_origins=os.getenv("ALLOWED_ORIGINS", "http://localhost:3000,http://localhost:3001").split(","),
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Include routers
    app.include_router(auth_router, prefix="/api")
    app.include_router(todos_router, prefix="/api")
    # Temporarily exclude chat routers to troubleshoot
    # app.include_router(chatbot_router, prefix="/api")
    # app.include_router(chat_router, prefix="/api")

    @app.on_event("startup")
    def on_startup():
        try:
            # Temporarily disable database initialization to troubleshoot
            print("Database initialization skipped for troubleshooting")
            # create_db_and_tables()
        except Exception as e:
            print(f"Warning: Could not initialize database: {e}")
            print("App will run without database functionality")

    @app.get("/")
    def read_root():
        return {"message": "Welcome to the Todo API"}

    return app


app = create_app()