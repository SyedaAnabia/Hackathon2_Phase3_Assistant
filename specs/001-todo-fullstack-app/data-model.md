# Data Model: Todo Full-Stack Web Application

## Overview
This document defines the data models for the secure, multi-user Todo web application. It outlines the entities, their attributes, relationships, and validation rules based on the feature specification.

## Entity: User

### Attributes
- **id** (UUID/string): Unique identifier for the user (primary key)
- **email** (string): User's email address (unique, required)
- **hashed_password** (string): Hashed password for authentication (required)
- **created_at** (datetime): Timestamp when the user account was created (required)
- **updated_at** (datetime): Timestamp when the user account was last updated (required)
- **is_active** (boolean): Flag indicating if the user account is active (default: true)

### Relationships
- **todos**: One-to-many relationship with Todo entity (one user can have many todos)

### Validation Rules
- Email must be a valid email format
- Email must be unique across all users
- Password must meet minimum security requirements (length, complexity)
- Email cannot be changed once set (for security reasons)

## Entity: Todo

### Attributes
- **id** (UUID/string): Unique identifier for the todo item (primary key)
- **title** (string): Title of the todo item (required, max length: 200 characters)
- **description** (string): Optional description of the todo item (max length: 1000 characters)
- **is_completed** (boolean): Flag indicating if the todo is completed (default: false)
- **user_id** (UUID/string): Foreign key linking to the User who owns this todo (required)
- **created_at** (datetime): Timestamp when the todo was created (required)
- **updated_at** (datetime): Timestamp when the todo was last updated (required)

### Relationships
- **user**: Many-to-one relationship with User entity (many todos belong to one user)

### Validation Rules
- Title must not be empty
- Title must be less than 200 characters
- Description, if provided, must be less than 1000 characters
- user_id must reference an existing user
- Only the owner of the todo can modify or delete it

## State Transitions

### Todo State Transitions
- **Active** → **Completed**: When user marks todo as complete
- **Completed** → **Active**: When user marks todo as incomplete

## Data Integrity Constraints

### Referential Integrity
- All foreign key relationships must reference existing records
- Deleting a user should cascade delete their associated todos (optional depending on business requirements)

### Business Logic Constraints
- A todo can only be accessed/modified by its owner
- Users cannot access todos owned by other users
- All operations must be authenticated and authorized

## Indexes

### Required Indexes
- Index on User.email for fast lookup during authentication
- Index on Todo.user_id for efficient retrieval of user-specific todos
- Index on Todo.is_completed for potential filtering operations
- Composite index on (Todo.user_id, Todo.created_at) for efficient chronological retrieval of user's todos

## Security Considerations

### Data Access
- All queries must filter by user_id to enforce data isolation
- Direct access to another user's todos must be prevented at the application layer
- Authentication and authorization must be validated before any data access

### Privacy
- User emails should be treated as sensitive information
- No personally identifiable information should be exposed unnecessarily