from sqlmodel import select, func
from sqlmodel.ext.asyncio.session import AsyncSession
from uuid import UUID
from typing import List, Optional
from ..models.todo import Todo, TodoCreate, TodoUpdate


async def create_todo_async(session: AsyncSession, todo: TodoCreate, user_id: UUID) -> Todo:
    """
    Create a new todo asynchronously.
    """
    # Create a new Todo instance with the provided data
    db_todo = Todo.model_validate(todo)
    db_todo.user_id = user_id
    session.add(db_todo)
    await session.commit()
    await session.refresh(db_todo)
    return db_todo


async def get_todos_by_user_async(session: AsyncSession, user_id: UUID, completed: Optional[bool] = None, skip: int = 0, limit: int = 100) -> List[Todo]:
    """
    Retrieve all todos for a specific user asynchronously.
    Optionally filter by completion status.
    """
    query = select(Todo).where(Todo.user_id == user_id)

    if completed is not None:
        query = query.where(Todo.is_completed == completed)

    query = query.offset(skip).limit(limit)

    result = await session.exec(query)
    return result.all()


async def get_todo_by_id_and_user_async(session: AsyncSession, todo_id: UUID, user_id: UUID) -> Optional[Todo]:
    """
    Retrieve a specific todo by ID and user ID asynchronously.
    """
    query = select(Todo).where(Todo.id == todo_id, Todo.user_id == user_id)
    result = await session.exec(query)
    return result.first()


async def update_todo_by_id_and_user_async(session: AsyncSession, todo_id: UUID, user_id: UUID, todo_update: TodoUpdate) -> Optional[Todo]:
    """
    Update a specific todo by ID and user ID asynchronously.
    """
    db_todo = await get_todo_by_id_and_user_async(session, todo_id, user_id)
    if not db_todo:
        return None

    # Update the todo with the provided values
    update_data = todo_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_todo, field, value)

    db_todo.updated_at = func.now()

    session.add(db_todo)
    await session.commit()
    await session.refresh(db_todo)
    return db_todo


async def delete_todo_by_id_and_user_async(session: AsyncSession, todo_id: UUID, user_id: UUID) -> bool:
    """
    Delete a specific todo by ID and user ID asynchronously.
    Returns True if deletion was successful, False otherwise.
    """
    db_todo = await get_todo_by_id_and_user_async(session, todo_id, user_id)
    if not db_todo:
        return False

    await session.delete(db_todo)
    await session.commit()
    return True


async def toggle_todo_completion_async(session: AsyncSession, todo_id: UUID, user_id: UUID) -> Optional[Todo]:
    """
    Toggle the completion status of a specific todo asynchronously.
    """
    db_todo = await get_todo_by_id_and_user_async(session, todo_id, user_id)
    if not db_todo:
        return None

    db_todo.is_completed = not db_todo.is_completed
    db_todo.updated_at = func.now()

    session.add(db_todo)
    await session.commit()
    await session.refresh(db_todo)
    return db_todo