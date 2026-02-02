---
name: fastapi-backend-todo
description: Develop robust backend services for a Todo application using Python FastAPI, including REST API endpoints for task management, authentication integration, and database operations. Use when implementing API routes, request handling, and backend logic for the Todo app.
---

# FastAPI Backend Development for Todo Application

## Capabilities
- Design and implement RESTful API endpoints for todo operations
- Handle HTTP requests (GET, POST, PUT, PATCH, DELETE) for task management
- Validate request/response data with Pydantic models for todo items
- Implement middleware for authentication and authorization
- Handle async operations efficiently
- Create API documentation with automatic OpenAPI generation
- Implement error handling and custom exceptions for todo operations
- Connect to databases using async sessions

## Required API Endpoints
- GET /api/{user_id}/tasks - List all tasks for a user
- POST /api/{user_id}/tasks - Create a new task
- GET /api/{user_id}/tasks/{id} - Get task details
- PUT /api/{user_id}/tasks/{id} - Update a task
- DELETE /api/{user_id}/tasks/{id} - Delete a task
- PATCH /api/{user_id}/tasks/{id}/complete - Toggle completion

## Best Practices
- Use Pydantic models for request/response validation
- Implement proper HTTP status codes
- Follow REST API design principles
- Use dependency injection for shared resources
- Implement rate limiting where appropriate
- Log requests and errors appropriately
- Use async/await for I/O bound operations
- Use transactions for multi-step operations

## File Structure Convention
- Main application in `main.py`
- API routes in `/api` directory
- Database models in `/models` directory
- Schemas in `/schemas` directory
- Database operations in `/crud` directory
- Configuration in `/config` directory
- Middleware in `/middleware` directory

## Todo-Specific Models
- TodoItem: Represents a single todo task
- TodoCreate: Schema for creating new todos
- TodoUpdate: Schema for updating existing todos
- TodoResponse: Schema for API responses

## Authentication Integration
- Verify JWT tokens from Better Auth
- Extract user ID from tokens
- Ensure users can only access their own todos
- Return appropriate errors for unauthorized access

## Common Patterns
- Dependency injection for database sessions
- Router modules for organizing todo endpoints
- Exception handlers for consistent error responses
- Background tasks for async processing
- CORS middleware for cross-origin requests
- Request/response logging