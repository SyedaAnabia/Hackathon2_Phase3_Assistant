# Quickstart Guide: Authentication & API Security (Better Auth + JWT)

## Overview
This guide provides instructions for implementing secure, stateless authentication using JWT tokens with Better Auth integration. The system will verify JWT signatures and expiry on the FastAPI backend, extract authenticated user identity from JWT claims, and enforce strict user-based data access control.

## Prerequisites
- Node.js 18+ (for frontend development)
- Python 3.11+ (for backend development)
- Git

## Setup Instructions

### 1. Clone the Repository
```bash
git clone <repository-url>
cd <repository-directory>
```

### 2. Backend Setup (FastAPI)

#### Navigate to Backend Directory
```bash
cd backend
```

#### Create Virtual Environment
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

#### Install Dependencies
```bash
pip install -r requirements.txt
```

#### Environment Configuration
Create a `.env` file in the backend directory with the following variables:
```env
BETTER_AUTH_SECRET="your-super-secret-jwt-key-here-changed-in-production"
DATABASE_URL="postgresql://username:password@localhost:5432/tododb"
```

#### Run the Backend Server
```bash
uvicorn src.main:app --reload --port 8000
```

The backend API will be available at `http://localhost:8000`.

### 3. Frontend Setup (Next.js)

#### Navigate to Frontend Directory
```bash
cd ../frontend  # From backend directory
```

#### Install Dependencies
```bash
npm install
```

#### Environment Configuration
Create a `.env.local` file in the frontend directory with the following variables:
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
NEXTAUTH_SECRET="your-nextauth-secret"
NEXTAUTH_URL=http://localhost:3000
```

#### Run the Frontend Development Server
```bash
npm run dev
```

The frontend will be available at `http://localhost:3000`.

## Authentication Flow Implementation

### 1. Better Auth Configuration (Frontend)
1. Install Better Auth in the Next.js project
2. Configure the authentication provider with JWT settings
3. Set token expiration time (e.g., 7 days)
4. Implement secure token storage

### 2. JWT Verification (Backend)
1. Implement JWT verification middleware in FastAPI
2. Extract Authorization: Bearer <token> header
3. Verify JWT signature using BETTER_AUTH_SECRET
4. Validate token expiry and structure
5. Decode JWT payload to extract user_id and email

### 3. Authorization Enforcement
1. Remove trust in URL-based user_id
2. Match authenticated user from JWT to request context
3. Filter all database queries by authenticated user ID
4. Reject mismatched or forged user IDs

## Testing the Authentication System

### Manual Testing
1. Register a new user account
2. Log in with the new account
3. Verify that a JWT token is issued
4. Make API requests with the JWT token in the Authorization header
5. Verify that the backend validates the JWT token
6. Test that users can only access their own data
7. Test that requests without valid JWT return 401 Unauthorized

### Testing Invalid Scenarios
1. Attempt API requests without JWT token (should return 401)
2. Attempt API requests with expired JWT token (should return 401)
3. Attempt to access another user's data with valid JWT (should return 403)
4. Attempt to forge user ID in URL with valid JWT (should be blocked)

### Running Backend Tests
From the backend directory:
```bash
pytest
```

### Running Frontend Tests
From the frontend directory:
```bash
npm run test
```

## API Endpoints

Once both servers are running:

- Backend API: `http://localhost:8000/api`
- Frontend: `http://localhost:3000`
- API Documentation (Swagger): `http://localhost:8000/docs`

## Security Best Practices

### Token Security
- Store JWT secret in environment variables only
- Use strong, randomly generated secrets
- Implement reasonable token expiration times
- Consider refresh token mechanisms for enhanced security

### Data Access Control
- Always validate authenticated user against requested resources
- Never trust client-provided user IDs
- Implement server-side checks for all sensitive operations
- Log authentication and authorization events

### Error Handling
- Don't expose sensitive information in error messages
- Use consistent error response formats
- Implement rate limiting for authentication endpoints

## Troubleshooting

### Common Issues

1. **JWT Signature Verification Failures**: Ensure the same secret is used in both frontend and backend
2. **Token Expiration Issues**: Check system clocks are synchronized
3. **Cross-Origin Problems**: Verify CORS settings between frontend and backend
4. **Environment Variables**: Ensure all required environment variables are set in both frontend and backend

### Debugging Authentication
1. Check that JWT tokens are properly formatted
2. Verify that Authorization headers are correctly set
3. Confirm that the JWT secret matches between frontend and backend
4. Validate that token expiration is handled correctly

## Production Deployment

For production deployment:

1. Use strong, randomly generated JWT secrets
2. Ensure HTTPS is enabled for all communications
3. Implement proper logging and monitoring for authentication events
4. Set up automated testing for authentication flows
5. Implement token refresh mechanisms if needed
6. Set up proper error monitoring and alerting

## Next Steps

- Review the API documentation at `/docs`
- Test the authentication flow with multiple user accounts
- Implement additional security measures as needed
- Add monitoring and alerting for authentication events
- Consider implementing refresh token mechanisms