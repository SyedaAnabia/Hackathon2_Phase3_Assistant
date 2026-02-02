import asyncio
import logging
from typing import Any, Dict, List, Optional
from uuid import UUID
from mcp.server import Server
from mcp.types import Tool, Argument, Result, Notification
from ..models.todo import Todo, TodoCreate, TodoUpdate
from ..database.session import get_session_context
from ..services.todo_service_async import (
    create_todo_async,
    get_todos_by_user_async,
    get_todo_by_id_and_user_async,
    update_todo_by_id_and_user_async,
    delete_todo_by_id_and_user_async,
    toggle_todo_completion_async
)

logger = logging.getLogger(__name__)

# Initialize the MCP server
todo_mcp_server = Server("todo-assistant")


@todo_mcp_server.tool(
    "add_task",
    description="Add a new task to the user's todo list",
    arguments=[
        Argument(name="user_id", type="string", description="The UUID of the user"),
        Argument(name="title", type="string", description="The title of the task"),
        Argument(name="description", type="string", description="Optional description of the task", required=False),
    ],
)
async def add_task_handler(arguments: Dict[str, Any]) -> Result:
    """
    Add a new task to the user's todo list.
    """
    try:
        user_id = UUID(arguments["user_id"])
        title = arguments["title"]
        description = arguments.get("description", "")

        # Create a new todo object
        todo_create = TodoCreate(
            title=title,
            description=description
        )

        # Use the async service to create the todo
        async with get_session_context() as session:
            new_todo = await create_todo_async(session, todo_create, user_id)

        return Result(
            content=f"Successfully added task: {new_todo.title}",
            metadata={"task_id": str(new_todo.id)}
        )
    except Exception as e:
        logger.error(f"Error adding task: {str(e)}")
        return Result(
            content=f"Error adding task: {str(e)}",
            isError=True
        )


@todo_mcp_server.tool(
    "list_tasks",
    description="List all tasks for a user",
    arguments=[
        Argument(name="user_id", type="string", description="The UUID of the user"),
        Argument(name="completed", type="boolean", description="Filter by completion status (true for completed, false for pending, null for all)", required=False),
    ],
)
async def list_tasks_handler(arguments: Dict[str, Any]) -> Result:
    """
    List all tasks for a user.
    """
    try:
        user_id = UUID(arguments["user_id"])
        completed = arguments.get("completed", None)

        # Use the async service to get todos
        async with get_session_context() as session:
            todos = await get_todos_by_user_async(session, user_id, completed, skip=0, limit=100)

        if not todos:
            return Result(content="No tasks found for this user.")

        # Format the tasks for display
        task_list = []
        for todo in todos:
            status = "✓" if todo.is_completed else "○"
            task_str = f"{status} [{todo.id}] {todo.title}"
            if todo.description:
                task_str += f" - {todo.description}"
            task_list.append(task_str)

        content = "Your tasks:\n" + "\n".join([f"- {task}" for task in task_list])

        return Result(
            content=content,
            metadata={"task_count": len(todos)}
        )
    except Exception as e:
        logger.error(f"Error listing tasks: {str(e)}")
        return Result(
            content=f"Error listing tasks: {str(e)}",
            isError=True
        )


@todo_mcp_server.tool(
    "complete_task",
    description="Mark a task as complete",
    arguments=[
        Argument(name="user_id", type="string", description="The UUID of the user"),
        Argument(name="task_id", type="string", description="The UUID of the task to complete"),
    ],
)
async def complete_task_handler(arguments: Dict[str, Any]) -> Result:
    """
    Mark a task as complete.
    """
    try:
        user_id = UUID(arguments["user_id"])
        task_id = UUID(arguments["task_id"])

        # Use the async service to toggle completion
        async with get_session_context() as session:
            updated_todo = await toggle_todo_completion_async(session, task_id, user_id)

        if not updated_todo:
            return Result(
                content="Task not found or you don't have permission to update it.",
                isError=True
            )

        return Result(
            content=f"Successfully marked task as complete: {updated_todo.title}",
            metadata={"task_id": str(updated_todo.id), "is_completed": updated_todo.is_completed}
        )
    except Exception as e:
        logger.error(f"Error completing task: {str(e)}")
        return Result(
            content=f"Error completing task: {str(e)}",
            isError=True
        )


@todo_mcp_server.tool(
    "delete_task",
    description="Delete a task from the user's todo list",
    arguments=[
        Argument(name="user_id", type="string", description="The UUID of the user"),
        Argument(name="task_id", type="string", description="The UUID of the task to delete"),
    ],
)
async def delete_task_handler(arguments: Dict[str, Any]) -> Result:
    """
    Delete a task from the user's todo list.
    """
    try:
        user_id = UUID(arguments["user_id"])
        task_id = UUID(arguments["task_id"])

        # Use the async service to delete the todo
        async with get_session_context() as session:
            success = await delete_todo_by_id_and_user_async(session, task_id, user_id)

        if not success:
            return Result(
                content="Task not found or you don't have permission to delete it.",
                isError=True
            )

        return Result(content="Successfully deleted the task.")
    except Exception as e:
        logger.error(f"Error deleting task: {str(e)}")
        return Result(
            content=f"Error deleting task: {str(e)}",
            isError=True
        )


@todo_mcp_server.tool(
    "update_task",
    description="Update an existing task",
    arguments=[
        Argument(name="user_id", type="string", description="The UUID of the user"),
        Argument(name="task_id", type="string", description="The UUID of the task to update"),
        Argument(name="title", type="string", description="New title for the task (optional)", required=False),
        Argument(name="description", type="string", description="New description for the task (optional)", required=False),
        Argument(name="is_completed", type="boolean", description="New completion status (optional)", required=False),
    ],
)
async def update_task_handler(arguments: Dict[str, Any]) -> Result:
    """
    Update an existing task.
    """
    try:
        user_id = UUID(arguments["user_id"])
        task_id = UUID(arguments["task_id"])

        # Prepare the update object with provided values
        update_data = {}
        if "title" in arguments:
            update_data["title"] = arguments["title"]
        if "description" in arguments:
            update_data["description"] = arguments["description"]
        if "is_completed" in arguments:
            update_data["is_completed"] = arguments["is_completed"]

        if not update_data:
            return Result(
                content="No fields to update were provided.",
                isError=True
            )

        # Create the update object
        todo_update = TodoUpdate(**update_data)

        # Use the async service to update the todo
        async with get_session_context() as session:
            updated_todo = await update_todo_by_id_and_user_async(session, task_id, user_id, todo_update)

        if not updated_todo:
            return Result(
                content="Task not found or you don't have permission to update it.",
                isError=True
            )

        return Result(
            content=f"Successfully updated task: {updated_todo.title}",
            metadata={"task_id": str(updated_todo.id)}
        )
    except Exception as e:
        logger.error(f"Error updating task: {str(e)}")
        return Result(
            content=f"Error updating task: {str(e)}",
            isError=True
        )


# Health check endpoint
@todo_mcp_server.list_prompts()
async def list_prompts_handler() -> List[str]:
    """Return a list of available prompts."""
    return ["help", "status"]


@todo_mcp_server.get_prompt()
async def get_prompt_handler(name: str) -> Optional[str]:
    """Return the content of a specific prompt."""
    prompts = {
        "help": "I'm your AI assistant for managing tasks. You can ask me to add, list, update, complete, or delete tasks.",
        "status": "The task management system is operational."
    }
    return prompts.get(name)