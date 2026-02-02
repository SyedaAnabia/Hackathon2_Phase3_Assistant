# Quickstart Guide: Frontend Application (Next.js App Router)

## Overview
This guide provides instructions for setting up and running the frontend application locally. The application is built with Next.js 16+ using App Router and integrates with a JWT-protected FastAPI backend for authentication and data management.

## Prerequisites
- Node.js 18+ (for Next.js development)
- npm or yarn package manager
- Access to the backend API (FastAPI server running)
- Git

## Setup Instructions

### 1. Clone the Repository
```bash
git clone <repository-url>
cd <repository-directory>
```

### 2. Frontend Setup

#### Navigate to Frontend Directory
```bash
cd frontend  # From repository root
```

#### Install Dependencies
```bash
npm install
```

#### Environment Configuration
Create a `.env.local` file in the frontend directory with the following variables:
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api
NEXTAUTH_SECRET="your-nextauth-secret"
NEXTAUTH_URL=http://localhost:3000
```

### 3. Run the Frontend Development Server
```bash
npm run dev
```

The frontend will be available at `http://localhost:3000`.

## API Integration

### Backend API Endpoint
The frontend expects the backend API to be available at the URL specified in `NEXT_PUBLIC_API_BASE_URL`. By default, this is set to `http://localhost:8000/api`.

### Authentication Flow
1. Visit the signup page at `http://localhost:3000/auth/signup` to create an account
2. Log in at `http://localhost:3000/auth/login` with your credentials
3. The JWT token will be stored in browser storage
4. The token will be automatically attached to all authenticated API requests

## Key Features

### Authentication
- User signup and login via Better Auth
- Protected routes that redirect unauthenticated users to login
- Session management with JWT tokens
- Secure token storage and transmission

### Todo Management
- Create, read, update, and delete todo items
- Mark todos as complete/incomplete
- View all todos for the authenticated user
- Responsive UI that works on desktop and mobile

### Responsive Design
- Mobile-first responsive layout
- Adapts to different screen sizes
- Touch-friendly interface elements

## Testing the Application

### Manual Testing
1. Register a new user account
2. Log in with the new account
3. Navigate to the dashboard
4. Create a new todo item
5. Update the status of a todo item
6. Delete a todo item
7. Verify that only the authenticated user's todos are displayed
8. Test the responsive design on different screen sizes

### Running Frontend Tests
From the frontend directory:
```bash
npm run test
```

## Troubleshooting

### Common Issues

1. **API Connection Errors**: Ensure the backend server is running and the API_BASE_URL is correctly configured
2. **Authentication Issues**: Verify that JWT tokens are being stored and transmitted correctly
3. **CORS Errors**: Check that the backend allows requests from the frontend origin
4. **Environment Variables**: Ensure all required environment variables are set in the frontend

### Resetting Authentication
To clear authentication state:
1. Clear browser storage (localStorage and sessionStorage)
2. Or navigate to the logout endpoint if available

### Development Mode
During development, the application will hot-reload changes automatically. For persistent issues, try:
1. Clearing the browser cache
2. Restarting the development server
3. Verifying all dependencies are installed correctly

## Production Deployment

For production deployment:

1. Use environment-specific configuration
2. Ensure HTTPS is enabled for security
3. Implement proper error logging and monitoring
4. Set up CI/CD pipelines for automated testing and deployment
5. Optimize bundle sizes for faster loading

## Next Steps

- Explore the API documentation at `/api/docs` (if available)
- Review the component structure in the `src/components` directory
- Customize the UI components in the `src/components` directory
- Add additional features following the established patterns
- Implement additional error handling and validation as needed