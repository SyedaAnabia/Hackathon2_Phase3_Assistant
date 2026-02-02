# Data Model: Frontend Application (Next.js App Router)

## Overview
This document defines the frontend data models and state structures for the Todo web application. It outlines the entities, their attributes, relationships, and validation rules from the frontend perspective, focusing on how data will be represented and managed in the client-side application.

## Entity: User

### Frontend Representation
- **id** (string): Unique identifier for the user
- **email** (string): User's email address
- **isLoggedIn** (boolean): Flag indicating if the user is currently authenticated
- **isLoading** (boolean): Flag indicating if authentication state is being loaded

### Frontend State Management
- **Authentication state**: Managed through React context or state management solution
- **Session persistence**: Maintained via JWT token in browser storage
- **Validation**: Email format validation on input

### Relationships
- **Todos**: One-to-many relationship (one user can have many todos)

## Entity: Todo

### Attributes
- **id** (string): Unique identifier for the todo item
- **title** (string): Title of the todo item (required, max length: 200 characters)
- **description** (string): Optional description of the todo item (max length: 1000 characters)
- **isCompleted** (boolean): Flag indicating if the todo is completed (default: false)
- **userId** (string): Reference to the User who owns this todo (for frontend filtering)
- **createdAt** (Date): Timestamp when the todo was created
- **updatedAt** (Date): Timestamp when the todo was last updated

### Frontend State Management
- **Local state**: Individual todo items may be managed in component state
- **Global state**: Todo list may be managed in context or state management solution
- **API synchronization**: Changes to todos will be synchronized with backend API

### Validation Rules (Frontend)
- Title must not be empty
- Title must be less than 200 characters
- Description, if provided, must be less than 1000 characters
- Only the owner of the todo can modify or delete it (enforced by backend)

## Entity: Authentication State

### Attributes
- **user** (User | null): Current authenticated user object or null if not authenticated
- **token** (string | null): JWT token for authenticated API requests
- **isLoading** (boolean): Flag indicating if authentication state is being determined
- **error** (string | null): Error message if authentication failed

### Frontend State Management
- **Context**: Managed through React Context API
- **Persistence**: Token stored in localStorage/sessionStorage
- **Updates**: State updated on login/logout/auth status changes

## State Management Patterns

### Global State Structure
```
{
  auth: {
    user: User | null,
    token: string | null,
    isLoading: boolean,
    error: string | null
  },
  todos: {
    items: Todo[],
    loading: boolean,
    error: string | null,
    filters: {
      completed: boolean | null
    }
  }
}
```

### Hooks for State Management
- **useAuth**: Provides access to authentication state and actions
- **useTodos**: Provides access to todo state and actions
- **useProtectedRoute**: Handles authentication checks for protected routes

## API Response Structures

### Authentication Responses
- **Login response**: `{ access_token: string, token_type: string }`
- **Signup response**: `{ id: string, email: string, created_at: string }`
- **Error response**: `{ detail: string }`

### Todo API Responses
- **Todo list response**: `{ todos: Todo[], total_count: number }`
- **Single todo response**: `{ id: string, title: string, description: string, is_completed: boolean, user_id: string, created_at: string, updated_at: string }`
- **Error response**: `{ detail: string }`

## Validation and Error Handling

### Input Validation
- **Email format**: Validated using regex pattern
- **Password strength**: Minimum length and character requirements
- **Todo title**: Required field with length limits
- **Todo description**: Optional field with length limits

### Error States
- **Authentication errors**: Invalid credentials, network issues
- **API errors**: Network timeouts, server errors, validation errors
- **Permission errors**: Unauthorized access attempts

## Security Considerations

### Token Management
- **Storage**: JWT tokens stored securely in browser (localStorage with XSS precautions)
- **Transmission**: Tokens sent in Authorization header for API requests
- **Expiration**: Token expiration handled with refresh or re-authentication
- **Cleanup**: Tokens removed on logout

### Data Isolation
- **Frontend filtering**: Todos displayed only for authenticated user
- **URL validation**: Route parameters validated against authenticated user
- **UI controls**: Access controls applied based on authentication state