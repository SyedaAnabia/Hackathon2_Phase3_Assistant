from sqlmodel import Session, select, update
from typing import List, Optional
from ..models.todo import Todo, TodoCreate, TodoUpdate
from ..models.user import User
from datetime import datetime
import uuid


def create_todo(session: Session, todo: TodoCreate, user_id: uuid.UUID) -> Todo:
    """Create a new todo for a user."""
    db_todo = Todo.model_validate(todo)
    db_todo.user_id = user_id
    session.add(db_todo)
    session.commit()
    session.refresh(db_todo)
    return db_todo


def get_todos_by_user(
    session: Session,
    user_id: uuid.UUID,
    completed: Optional[bool] = None,
    offset: int = 0,
    limit: int = 100
) -> List[Todo]:
    """Get all todos for a specific user, with optional filtering."""
    query = select(Todo).where(Todo.user_id == user_id)

    if completed is not None:
        query = query.where(Todo.is_completed == completed)

    query = query.offset(offset).limit(limit)

    return session.exec(query).all()


def get_todo_by_id_and_user(session: Session, todo_id: uuid.UUID, user_id: uuid.UUID) -> Optional[Todo]:
    """Get a specific todo by ID for a specific user."""
    query = select(Todo).where(Todo.id == todo_id, Todo.user_id == user_id)
    return session.exec(query).first()


def update_todo_by_id_and_user(
    session: Session,
    todo_id: uuid.UUID,
    user_id: uuid.UUID,
    todo_update: TodoUpdate
) -> Optional[Todo]:
    """Update a specific todo by ID for a specific user."""
    db_todo = get_todo_by_id_and_user(session, todo_id, user_id)
    if not db_todo:
        return None

    # Prepare update data
    update_data = todo_update.model_dump(exclude_unset=True)

    # Update the todo
    for field, value in update_data.items():
        setattr(db_todo, field, value)

    db_todo.updated_at = datetime.utcnow()

    session.add(db_todo)
    session.commit()
    session.refresh(db_todo)

    return db_todo


def delete_todo_by_id_and_user(session: Session, todo_id: uuid.UUID, user_id: uuid.UUID) -> bool:
    """Delete a specific todo by ID for a specific user."""
    db_todo = get_todo_by_id_and_user(session, todo_id, user_id)
    if not db_todo:
        return False

    session.delete(db_todo)
    session.commit()
    return True


def toggle_todo_completion(session: Session, todo_id: uuid.UUID, user_id: uuid.UUID) -> Optional[Todo]:
    """Toggle the completion status of a specific todo."""
    db_todo = get_todo_by_id_and_user(session, todo_id, user_id)
    if not db_todo:
        return None

    db_todo.is_completed = not db_todo.is_completed
    db_todo.updated_at = datetime.utcnow()

    session.add(db_todo)
    session.commit()
    session.refresh(db_todo)

    return db_todo


def validate_user_owns_resource(session: Session, user_id: uuid.UUID, resource_user_id: uuid.UUID) -> bool:
    """Validate that the authenticated user owns the requested resource."""
    return str(user_id) == str(resource_user_id)