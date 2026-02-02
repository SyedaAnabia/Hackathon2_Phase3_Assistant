# API Contract: Todo Full-Stack Web Application

## Overview
This document defines the API contracts for the secure, multi-user Todo web application. It specifies the endpoints, request/response formats, authentication requirements, and error handling patterns.

## Base URL
```
https://api.yourdomain.com/api
```

## Authentication
All endpoints except authentication endpoints require a valid JWT token in the Authorization header:
```
Authorization: Bearer <jwt_token>
```

## Common Headers
- `Content-Type: application/json`
- `Accept: application/json`

## Common Error Response Format
```json
{
  "detail": "Error message",
  "error_code": "ERROR_CODE"
}
```

## Endpoints

### Authentication Endpoints

#### POST /auth/signup
Register a new user account.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response (201 Created):**
```json
{
  "id": "uuid-string",
  "email": "user@example.com",
  "created_at": "2023-01-01T00:00:00Z"
}
```

**Response (400 Bad Request):**
- Email already exists
- Invalid email format
- Password does not meet requirements

#### POST /auth/login
Authenticate a user and return JWT token.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response (200 OK):**
```json
{
  "access_token": "jwt-token-string",
  "token_type": "bearer"
}
```

**Response (401 Unauthorized):**
- Invalid credentials

### Todo Management Endpoints

For all the following endpoints, the `{user_id}` parameter must match the authenticated user's ID extracted from the JWT token.

#### GET /users/{user_id}/todos
Retrieve all todos for the authenticated user.

**Path Parameters:**
- `user_id`: The ID of the user whose todos to retrieve (must match JWT user ID)

**Query Parameters:**
- `completed` (optional): Filter by completion status (true/false)
- `limit` (optional): Maximum number of results to return (default: 50, max: 100)
- `offset` (optional): Number of results to skip (for pagination)

**Response (200 OK):**
```json
{
  "todos": [
    {
      "id": "uuid-string",
      "title": "Sample Todo",
      "description": "Optional description",
      "is_completed": false,
      "user_id": "uuid-string",
      "created_at": "2023-01-01T00:00:00Z",
      "updated_at": "2023-01-01T00:00:00Z"
    }
  ],
  "total_count": 1
}
```

**Response (401 Unauthorized):**
- Invalid or missing JWT token

**Response (403 Forbidden):**
- User ID in path does not match authenticated user ID

#### POST /users/{user_id}/todos
Create a new todo for the authenticated user.

**Path Parameters:**
- `user_id`: The ID of the user creating the todo (must match JWT user ID)

**Request:**
```json
{
  "title": "New Todo",
  "description": "Optional description"
}
```

**Response (201 Created):**
```json
{
  "id": "uuid-string",
  "title": "New Todo",
  "description": "Optional description",
  "is_completed": false,
  "user_id": "uuid-string",
  "created_at": "2023-01-01T00:00:00Z",
  "updated_at": "2023-01-01T00:00:00Z"
}
```

**Response (400 Bad Request):**
- Missing required fields
- Title exceeds maximum length

**Response (401 Unauthorized):**
- Invalid or missing JWT token

**Response (403 Forbidden):**
- User ID in path does not match authenticated user ID

#### GET /users/{user_id}/todos/{todo_id}
Get a specific todo by ID for the authenticated user.

**Path Parameters:**
- `user_id`: The ID of the user (must match JWT user ID)
- `todo_id`: The ID of the todo to retrieve

**Response (200 OK):**
```json
{
  "id": "uuid-string",
  "title": "Sample Todo",
  "description": "Optional description",
  "is_completed": false,
  "user_id": "uuid-string",
  "created_at": "2023-01-01T00:00:00Z",
  "updated_at": "2023-01-01T00:00:00Z"
}
```

**Response (401 Unauthorized):**
- Invalid or missing JWT token

**Response (403 Forbidden):**
- User ID in path does not match authenticated user ID

**Response (404 Not Found):**
- Todo with the specified ID does not exist for this user

#### PUT /users/{user_id}/todos/{todo_id}
Update a specific todo for the authenticated user.

**Path Parameters:**
- `user_id`: The ID of the user (must match JWT user ID)
- `todo_id`: The ID of the todo to update

**Request:**
```json
{
  "title": "Updated Todo",
  "description": "Updated description",
  "is_completed": true
}
```

**Response (200 OK):**
```json
{
  "id": "uuid-string",
  "title": "Updated Todo",
  "description": "Updated description",
  "is_completed": true,
  "user_id": "uuid-string",
  "created_at": "2023-01-01T00:00:00Z",
  "updated_at": "2023-01-02T00:00:00Z"
}
```

**Response (400 Bad Request):**
- Invalid field values

**Response (401 Unauthorized):**
- Invalid or missing JWT token

**Response (403 Forbidden):**
- User ID in path does not match authenticated user ID

**Response (404 Not Found):**
- Todo with the specified ID does not exist for this user

#### PATCH /users/{user_id}/todos/{todo_id}/complete
Toggle the completion status of a specific todo for the authenticated user.

**Path Parameters:**
- `user_id`: The ID of the user (must match JWT user ID)
- `todo_id`: The ID of the todo to update

**Request:**
```json
{
  "is_completed": true
}
```

**Response (200 OK):**
```json
{
  "id": "uuid-string",
  "title": "Sample Todo",
  "description": "Optional description",
  "is_completed": true,
  "user_id": "uuid-string",
  "created_at": "2023-01-01T00:00:00Z",
  "updated_at": "2023-01-02T00:00:00Z"
}
```

**Response (400 Bad Request):**
- Invalid field values

**Response (401 Unauthorized):**
- Invalid or missing JWT token

**Response (403 Forbidden):**
- User ID in path does not match authenticated user ID

**Response (404 Not Found):**
- Todo with the specified ID does not exist for this user

#### DELETE /users/{user_id}/todos/{todo_id}
Delete a specific todo for the authenticated user.

**Path Parameters:**
- `user_id`: The ID of the user (must match JWT user ID)
- `todo_id`: The ID of the todo to delete

**Response (204 No Content):**
- Todo successfully deleted

**Response (401 Unauthorized):**
- Invalid or missing JWT token

**Response (403 Forbidden):**
- User ID in path does not match authenticated user ID

**Response (404 Not Found):**
- Todo with the specified ID does not exist for this user

## Error Codes

| Code | Description |
|------|-------------|
| AUTH_001 | Invalid credentials |
| AUTH_002 | Token expired |
| AUTH_003 | Invalid token |
| AUTH_004 | Insufficient permissions |
| VALIDATION_001 | Validation error |
| RESOURCE_001 | Resource not found |
| SERVER_001 | Internal server error |

## Security Requirements

1. All endpoints except authentication endpoints require a valid JWT token
2. User ID in the URL must match the authenticated user ID from the JWT
3. Users can only access their own resources
4. All sensitive data must be transmitted over HTTPS
5. Passwords must be hashed and never stored in plain text