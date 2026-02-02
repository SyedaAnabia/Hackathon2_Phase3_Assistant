# API Contract: Frontend Application (Next.js App Router)

## Overview
This document defines the frontend's perspective on API contracts for the Todo web application. It specifies how the frontend will interact with the backend API, request/response formats, authentication requirements, and error handling patterns from the client-side perspective.

## Authentication API Calls

### POST /api/auth/signup
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

### POST /api/auth/login
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

## Todo Management API Calls

For all the following endpoints, the frontend must include the JWT token in the Authorization header:

```
Authorization: Bearer <jwt_token>
```

### GET /api/todos
Retrieve all todos for the authenticated user.

**Headers:**
- `Authorization: Bearer <valid_jwt_token>`

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

### POST /api/todos
Create a new todo for the authenticated user.

**Headers:**
- `Authorization: Bearer <valid_jwt_token>`

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

### GET /api/todos/{todo_id}
Get a specific todo by ID for the authenticated user.

**Path Parameters:**
- `todo_id`: The ID of the todo to retrieve

**Headers:**
- `Authorization: Bearer <valid_jwt_token>`

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

**Response (404 Not Found):**
- Todo with the specified ID does not exist for this user

### PUT /api/todos/{todo_id}
Update a specific todo for the authenticated user.

**Path Parameters:**
- `todo_id`: The ID of the todo to update

**Headers:**
- `Authorization: Bearer <valid_jwt_token>`

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

**Response (404 Not Found):**
- Todo with the specified ID does not exist for this user

### PATCH /api/todos/{todo_id}/complete
Toggle the completion status of a specific todo for the authenticated user.

**Path Parameters:**
- `todo_id`: The ID of the todo to update

**Headers:**
- `Authorization: Bearer <valid_jwt_token>`

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

**Response (404 Not Found):**
- Todo with the specified ID does not exist for this user

### DELETE /api/todos/{todo_id}
Delete a specific todo for the authenticated user.

**Path Parameters:**
- `todo_id`: The ID of the todo to delete

**Headers:**
- `Authorization: Bearer <valid_jwt_token>`

**Response (204 No Content):**
- Todo successfully deleted

**Response (401 Unauthorized):**
- Invalid or missing JWT token

**Response (404 Not Found):**
- Todo with the specified ID does not exist for this user

## Error Handling

### Common Error Responses

**401 Unauthorized**
```json
{
  "detail": "Not authenticated"
}
```

**403 Forbidden**
```json
{
  "detail": "Access denied"
}
```

**404 Not Found**
```json
{
  "detail": "Resource not found"
}
```

**422 Validation Error**
```json
{
  "detail": [
    {
      "loc": ["body", "title"],
      "msg": "Field required",
      "type": "value_error.missing"
    }
  ]
}
```

**500 Server Error**
```json
{
  "detail": "Internal server error"
}
```

## Frontend Implementation Requirements

### Authentication Flow
1. Store JWT token in localStorage upon successful login
2. Include Authorization header with every API request
3. Handle 401 responses by redirecting to login page
4. Implement token refresh mechanism if needed

### Todo Operations
1. Fetch todos on dashboard load
2. Show loading states during API operations
3. Update UI optimistically or after successful API response
4. Handle errors gracefully with user-friendly messages

### Error Handling
1. Display user-friendly error messages for API failures
2. Implement retry mechanisms for transient failures
3. Log errors for debugging purposes
4. Handle network connectivity issues gracefully

## Security Requirements

1. JWT tokens must be stored securely in browser storage
2. All API requests must include valid JWT token in Authorization header
3. Frontend must validate that retrieved todos belong to authenticated user
4. Sensitive data must not be logged or exposed in client-side code
5. Token expiration must be handled appropriately