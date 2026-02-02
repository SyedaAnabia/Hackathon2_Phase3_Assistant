# Todo Full-Stack Application Skills

This repository contains a collection of skills for developing a full-stack Todo application using Next.js, FastAPI, SQLModel, and Better Auth.

## Available Skills

### 1. Next.js Frontend Development (`nextjs-frontend-todo`)
- Create and manage Next.js frontend components for the Todo application
- Implement responsive UI patterns and API integrations
- Handle authentication and user interfaces

### 2. FastAPI Backend Development (`fastapi-backend-todo`)
- Develop backend services with REST API endpoints for todo operations
- Handle request validation and authentication integration
- Implement proper error handling and documentation

### 3. SQLModel Database Operations (`sqlmodel-database-todo`)
- Define database models and implement CRUD operations for todos
- Manage database sessions and relationships
- Handle migrations and optimization

### 4. Better Auth Integration (`better-auth-todo`)
- Implement authentication and authorization for the Todo app
- Handle JWT tokens and user isolation
- Secure API endpoints and manage user sessions

## Technology Stack
- Frontend: Next.js 16+ (App Router)
- Backend: Python FastAPI
- ORM: SQLModel
- Database: Neon Serverless PostgreSQL
- Authentication: Better Auth with JWT tokens
- Architecture: Monorepo structure

## Required API Endpoints
- GET /api/{user_id}/tasks - List all tasks
- POST /api/{user_id}/tasks - Create a new task
- GET /api/{user_id}/tasks/{id} - Get task details
- PUT /api/{user_id}/tasks/{id} - Update a task
- DELETE /api/{user_id}/tasks/{id} - Delete a task
- PATCH /api/{user_id}/tasks/{id}/complete - Toggle completion