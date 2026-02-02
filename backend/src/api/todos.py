from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session
from typing import Optional
from uuid import UUID
from ..database.session import get_session
from ..models.todo import Todo, TodoCreate, TodoRead, TodoUpdate
from ..api.auth import get_current_user
from ..services.todo_service import (
    create_todo,
    get_todos_by_user,
    get_todo_by_id_and_user,
    update_todo_by_id_and_user,
    delete_todo_by_id_and_user,
    toggle_todo_completion
)


router = APIRouter(tags=["todos"])


@router.get("/todos", response_model=list[TodoRead])
def read_todos(
    completed: Optional[bool] = None,
    skip: int = 0,
    limit: int = 100,
    current_user: dict = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """Retrieve all todos for the authenticated user."""
    user_id = UUID(current_user["user_id"])
    todos = get_todos_by_user(session, user_id, completed, skip, limit)
    return todos


@router.post("/todos", response_model=TodoRead, status_code=status.HTTP_201_CREATED)
def create_todo_endpoint(
    todo: TodoCreate,
    current_user: dict = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """Create a new todo for the authenticated user."""
    user_id = UUID(current_user["user_id"])
    return create_todo(session, todo, user_id)


@router.get("/todos/{todo_id}", response_model=TodoRead)
def read_todo(
    todo_id: UUID,
    current_user: dict = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """Retrieve a specific todo by ID for the authenticated user."""
    user_id = UUID(current_user["user_id"])
    db_todo = get_todo_by_id_and_user(session, todo_id, user_id)
    if not db_todo:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Todo not found"
        )

    return db_todo


@router.put("/todos/{todo_id}", response_model=TodoRead)
def update_todo(
    todo_id: UUID,
    todo_update: TodoUpdate,
    current_user: dict = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """Update a specific todo by ID for the authenticated user."""
    user_id = UUID(current_user["user_id"])
    updated_todo = update_todo_by_id_and_user(session, todo_id, user_id, todo_update)
    if not updated_todo:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Todo not found"
        )

    return updated_todo


@router.patch("/todos/{todo_id}/complete", response_model=TodoRead)
def toggle_todo_complete(
    todo_id: UUID,
    current_user: dict = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """Toggle the completion status of a specific todo."""
    user_id = UUID(current_user["user_id"])
    toggled_todo = toggle_todo_completion(session, todo_id, user_id)
    if not toggled_todo:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Todo not found"
        )

    return toggled_todo


@router.delete("/todos/{todo_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_todo(
    todo_id: UUID,
    current_user: dict = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """Delete a specific todo by ID for the authenticated user."""
    user_id = UUID(current_user["user_id"])
    success = delete_todo_by_id_and_user(session, todo_id, user_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Todo not found"
        )

    return