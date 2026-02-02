---
name: better-auth-todo
description: Implement authentication and authorization for a Todo application using Better Auth with JWT tokens, including user management, secure API access, and user isolation. Use when setting up user authentication, token verification, and protected endpoints for the Todo app.
---

# Better Auth Integration for Todo Application

## Capabilities
- Integrate Better Auth for user authentication in the Todo app
- Generate and verify JWT tokens for API access
- Implement protected API endpoints for todo operations
- Handle user registration and login for the Todo app
- Manage user sessions securely
- Verify tokens on backend requests
- Implement user isolation to ensure users only access their own todos
- Handle token refresh mechanisms

## Best Practices
- Store sensitive data securely
- Use HTTPS in production
- Implement proper token expiration
- Sanitize user inputs
- Follow OWASP security guidelines
- Use environment variables for secrets
- Implement proper error handling for auth failures
- Secure cookies appropriately

## Todo-Specific Authentication Requirements
- Ensure users can only create/read/update/delete their own todos
- Verify user identity on all API requests
- Implement proper user context in API endpoints
- Handle authentication errors gracefully
- Secure all API endpoints that access todo data

## Integration Patterns
- Middleware for token verification
- Dependency injection for current user
- Header-based authentication
- Session management
- Token refresh strategies

## File Structure Convention
- Auth configuration in `/auth` directory
- Middleware in `/middleware/auth.py`
- User models in `/models/user.py`
- Auth utilities in `/utils/auth.py`

## Common Patterns
- CurrentUser dependency in FastAPI
- Protected route decorators
- Token verification utilities
- User context propagation
- Secure password hashing

## Integration Points
- FastAPI dependencies
- Database user models
- API endpoint protection
- Frontend token handling
- Environment variables for secrets