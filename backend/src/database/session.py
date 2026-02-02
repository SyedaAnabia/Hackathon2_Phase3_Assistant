from sqlalchemy import create_engine
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.pool import QueuePool
from sqlmodel import Session, SQLModel
from sqlmodel.ext.asyncio.session import AsyncSession as SQLModelAsyncSession
from typing import Generator, AsyncGenerator
import os
from contextlib import contextmanager
from contextlib import asynccontextmanager


# Get database URL from environment, with a default for development
DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "sqlite:///./todo_app.db"  # Using SQLite for local development
)

# Create sync and async engines with connection pooling (skip for SQLite)
if DATABASE_URL.startswith("sqlite"):
    engine = create_engine(DATABASE_URL)
    async_engine = create_async_engine("sqlite+aiosqlite:///./todo_app.db")
else:
    engine = create_engine(
        DATABASE_URL,
        poolclass=QueuePool,
        pool_size=5,
        max_overflow=10,
        pool_pre_ping=True,
        pool_recycle=300,
    )
    # For async operations, we need to create an async engine
    # Extract the database URL and convert it to async format
    async_db_url = DATABASE_URL.replace("postgresql://", "postgresql+asyncpg://")
    async_engine = create_async_engine(async_db_url)


def create_db_and_tables():
    """Create database tables"""
    SQLModel.metadata.create_all(bind=engine)


@contextmanager
def get_session() -> Generator[Session, None, None]:
    """Provide a transactional scope around a series of operations."""
    with Session(engine) as session:
        yield session


@asynccontextmanager
async def get_session_context() -> AsyncGenerator[SQLModelAsyncSession, None]:
    """Provide an async transactional scope around a series of operations."""
    async with SQLModelAsyncSession(async_engine) as session:
        yield session