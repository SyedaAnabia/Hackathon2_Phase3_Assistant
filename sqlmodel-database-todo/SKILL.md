---
name: sqlmodel-database-todo
description: Implement database operations for a Todo application using SQLModel with Neon Serverless PostgreSQL, including todo models, CRUD operations, and relationship management. Use when defining database schemas, implementing data access logic, and managing todo data for the application.
---

# SQLModel Database Operations for Todo Application

## Capabilities
- Define SQLModel table models for todo items with proper relationships
- Implement CRUD operations (Create, Read, Update, Delete) for todos
- Handle database migrations for todo schema
- Manage async database sessions
- Implement proper indexing strategies for todo queries
- Handle transactions and connection pooling
- Perform complex queries with filters for todo operations

## Required Database Models
- Todo: Represents a single todo task with fields:
  - id: Primary key
  - title: Task title
  - description: Task description (optional)
  - completed: Boolean indicating completion status
  - user_id: Foreign key linking to user
  - created_at: Timestamp for creation
  - updated_at: Timestamp for last update

## Best Practices
- Use TypedDict for complex query results
- Implement proper foreign key relationships
- Use async session management
- Apply proper indexing for performance
- Handle database connection errors gracefully
- Use transactions for multi-step operations
- Implement proper validation at the model level
- Follow naming conventions for tables and columns

## Model Conventions
- Use PascalCase for model names
- Use snake_case for column names
- Include proper type hints
- Define indexes where appropriate
- Use nullable=False unless explicitly needed
- Implement proper relationship configurations

## File Structure Convention
- Models in `/models` directory
- Database session management in `/database` directory
- Migration scripts in `/migrations` directory
- Seed data in `/seed` directory

## Todo-Specific CRUD Operations
- Create todo: Insert new todo item into database
- Read todos: Fetch all todos for a specific user
- Read todo: Fetch a specific todo by ID
- Update todo: Modify existing todo properties
- Delete todo: Remove todo from database
- Toggle completion: Update completion status

## Common Patterns
- Session dependency injection in FastAPI
- Base model inheritance for common fields
- Relationship definitions with proper back_populates
- Custom methods on models for business logic
- Async context managers for session handling

## Integration Points
- FastAPI dependency system
- Neon PostgreSQL serverless features
- Environment variables for database URLs
- Alembic for migrations