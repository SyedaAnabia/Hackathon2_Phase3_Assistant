# API Contract: Authentication & API Security (Better Auth + JWT)

## Overview
This document defines the API contracts for implementing secure, stateless authentication using JWT tokens with Better Auth integration. It specifies the authentication endpoints, JWT handling, and authorization requirements for protected endpoints.

## Authentication Endpoints

### POST /auth/signup
Register a new user account with Better Auth.

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

### POST /auth/login
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

## Protected Endpoints (JWT Required)

For all the following endpoints, a valid JWT token must be included in the Authorization header:

```
Authorization: Bearer <jwt_token>
```

### JWT Validation Requirements
All protected endpoints must:
1. Extract the JWT token from the Authorization header
2. Verify the token signature using BETTER_AUTH_SECRET
3. Validate that the token has not expired
4. Decode the user identity (user ID and email) from the token
5. Ensure the authenticated user has permission to access the requested resource

### Example Protected Endpoint: GET /users/{user_id}/todos
Retrieve all todos for the authenticated user.

**Path Parameters:**
- `user_id`: The ID of the user whose todos to retrieve (must match JWT user ID)

**Headers:**
- `Authorization: Bearer <valid_jwt_token>`

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

## JWT Token Format

### JWT Header
```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```

### JWT Payload Claims
```json
{
  "sub": "user-uuid-string",
  "email": "user@example.com",
  "exp": 1678886400,
  "iat": 1678800000
}
```

**Claims:**
- `sub`: Subject (user ID)
- `email`: User's email address
- `exp`: Expiration time (Unix timestamp)
- `iat`: Issued at time (Unix timestamp)

## Error Responses

### 401 Unauthorized
Returned when:
- No Authorization header is provided
- JWT token is invalid
- JWT token is malformed
- JWT signature verification fails
- JWT token has expired

```json
{
  "detail": "Not authenticated",
  "error_code": "AUTH_001"
}
```

### 403 Forbidden
Returned when:
- User ID in URL path doesn't match authenticated user ID
- User doesn't have permission to access the resource

```json
{
  "detail": "Access denied",
  "error_code": "AUTH_002"
}
```

## Security Requirements

1. All protected endpoints require a valid JWT token in the Authorization header
2. User ID in the URL must match the authenticated user ID from the JWT
3. Users can only access their own resources
4. All sensitive data must be transmitted over HTTPS
5. JWT tokens must be verified for signature and expiration before processing requests
6. No server-side session storage - completely stateless authentication

## Frontend Integration Requirements

1. Store JWT token securely after login
2. Include JWT token in Authorization header for all protected API requests
3. Handle 401 responses by redirecting to login
4. Implement token refresh mechanism if needed