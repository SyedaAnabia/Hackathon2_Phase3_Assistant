# Quickstart Guide: Todo Full-Stack Web Application

## Overview
This guide provides instructions for setting up and running the secure, multi-user Todo web application locally. The application consists of a Next.js frontend and a FastAPI backend with JWT-based authentication.

## Prerequisites
- Node.js 18+ (for frontend development)
- Python 3.11+ (for backend development)
- PostgreSQL (or access to Neon Serverless PostgreSQL)
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
DATABASE_URL="postgresql://username:password@localhost:5432/tododb"
BETTER_AUTH_SECRET="your-super-secret-jwt-key-here"
NEON_DATABASE_URL="your-neon-db-url-if-using-neon"
```

#### Database Setup
Run the following commands to initialize the database:
```bash
# Create database tables
alembic upgrade head
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

## API Endpoints

Once both servers are running:

- Backend API: `http://localhost:8000/api`
- Frontend: `http://localhost:3000`
- API Documentation (Swagger): `http://localhost:8000/docs`

## Authentication Flow

1. Visit the signup page at `http://localhost:3000/auth/signup` to create an account
2. Log in at `http://localhost:3000/auth/login` with your credentials
3. The JWT token will be stored in browser cookies
4. The token will be automatically attached to all authenticated API requests

## Testing the Application

### Manual Testing
1. Register a new user account
2. Log in with the new account
3. Create a new todo item
4. View, update, and delete the todo item
5. Verify that you cannot access other users' todo items

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

## Troubleshooting

### Common Issues

1. **Database Connection Errors**: Ensure PostgreSQL is running and the DATABASE_URL is correctly configured
2. **JWT Authentication Issues**: Verify that BETTER_AUTH_SECRET is the same in both frontend and backend
3. **CORS Errors**: Check that the frontend URL is properly configured in the backend CORS settings
4. **Environment Variables**: Ensure all required environment variables are set in both frontend and backend

### Resetting the Database
To reset the database to a clean state:
```bash
# From backend directory
alembic downgrade base
alembic upgrade head
```

## Production Deployment

For production deployment:

1. Use environment-specific configuration
2. Ensure HTTPS is enabled
3. Use a production-grade database (Neon Serverless PostgreSQL recommended)
4. Implement proper logging and monitoring
5. Set up CI/CD pipelines for automated testing and deployment

## Next Steps

- Explore the API documentation at `/docs`
- Review the data models in the `src/models` directory
- Customize the UI components in the `src/components` directory
- Add additional features following the established patterns