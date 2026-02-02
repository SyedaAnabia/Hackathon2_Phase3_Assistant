from sqlmodel import SQLModel, Field, Relationship
from typing import Optional, List
from datetime import datetime
import uuid


class ConversationBase(SQLModel):
    user_id: uuid.UUID = Field(foreign_key="user.id")


class Conversation(ConversationBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    user_id: uuid.UUID = Field(foreign_key="user.id")
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    # Relationship to user
    user: Optional["User"] = Relationship(back_populates="conversations")

    # Relationship to messages
    messages: List["Message"] = Relationship(back_populates="conversation", sa_relationship_kwargs={"cascade": "all, delete-orphan"})


class ConversationCreate(ConversationBase):
    pass


class ConversationRead(ConversationBase):
    id: uuid.UUID
    created_at: datetime
    updated_at: datetime


class MessageBase(SQLModel):
    role: str = Field(regex="^(user|assistant)$")  # Either "user" or "assistant"
    content: str = Field(min_length=1, max_length=5000)
    conversation_id: uuid.UUID = Field(foreign_key="conversation.id")
    todo_id: Optional[uuid.UUID] = Field(default=None, foreign_key="todo.id")  # Optional link to a specific todo


class Message(MessageBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    role: str = Field(regex="^(user|assistant)$")  # Either "user" or "assistant"
    content: str = Field(min_length=1, max_length=5000)
    conversation_id: uuid.UUID = Field(foreign_key="conversation.id")
    todo_id: Optional[uuid.UUID] = Field(default=None, foreign_key="todo.id")  # Optional link to a specific todo
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    # Relationship to conversation
    conversation: Optional["Conversation"] = Relationship(back_populates="messages")

    # Optional relationship to a specific todo
    todo: Optional["Todo"] = Relationship(back_populates="messages")


class MessageCreate(MessageBase):
    pass


class MessageRead(MessageBase):
    id: uuid.UUID
    created_at: datetime
    updated_at: datetime


class MessageUpdate(SQLModel):
    content: Optional[str] = Field(default=None, min_length=1, max_length=5000)