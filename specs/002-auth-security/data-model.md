# Data Model: Authentication & API Security (Better Auth + JWT)

## Overview
This document defines the data models related to authentication and security for the secure, stateless authentication system using JWT tokens with Better Auth integration. Since this feature focuses on authentication mechanisms rather than new data entities, it primarily describes the JWT token structure and authentication-related data flows.

## JWT Token Structure

### Payload Claims
- **sub** (Subject): User's unique identifier (UUID)
- **email** (Email): User's email address
- **exp** (Expiration Time): Unix timestamp when the token expires
- **iat** (Issued At): Unix timestamp when the token was issued
- **jti** (JWT ID): Unique identifier for the token (optional, for advanced scenarios)

### Token Metadata
- **Algorithm**: HS256 (HMAC with SHA-256)
- **Secret**: Stored in environment variable (BETTER_AUTH_SECRET)
- **Expiration**: Configurable duration (e.g., 7 days)

## Authentication Data Flows

### User Registration Flow
1. User submits registration request with email and password
2. System validates credentials
3. System creates user record in database
4. System generates JWT token with user claims
5. System returns token to frontend

### User Login Flow
1. User submits login request with email and password
2. System verifies credentials against stored hash
3. System generates JWT token with user claims
4. System returns token to frontend

### API Request Flow
1. Frontend includes JWT in Authorization header
2. Backend verifies JWT signature and expiration
3. Backend extracts user identity from token
4. Backend validates user permissions for requested resource
5. Backend processes request and returns response

## Security Validation Rules

### Token Validation
- Token signature must match using the shared secret
- Token must not be expired (exp claim must be in the future)
- Token must have been issued in the past (iat claim validation)
- Subject (sub) claim must correspond to a valid user

### User Identity Validation
- Extracted user ID must exist in the user database
- User account must be active (not suspended/disabled)
- User must have permissions for requested operation

## Session Management

### Stateless Design
- No server-side session storage required
- All necessary information stored in JWT payload
- Scalability achieved through stateless design

### Token Renewal
- Mechanism for refreshing tokens before expiration
- Consideration for refresh tokens in future enhancements

## Integration Points

### Frontend Integration
- Secure storage of JWT tokens
- Automatic inclusion in API request headers
- Handling of token expiration and renewal

### Backend Integration
- JWT verification middleware/dependency
- Extraction of user identity from tokens
- Enforcement of user-based data access controls