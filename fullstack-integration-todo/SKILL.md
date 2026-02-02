---
name: fullstack-integration-todo
description: Handle complete integration between Next.js frontend and FastAPI backend for the Todo application, including API client setup, JWT token management, error handling, CORS configuration, and state synchronization. Use when setting up API communication, authentication flow, and data synchronization between frontend and backend.
---

# Full-Stack Integration for Todo Application

## Capabilities
- Configure API client to connect Next.js frontend with FastAPI backend
- Manage JWT tokens for authentication and authorization
- Handle request/response interception and error handling
- Configure CORS settings for secure cross-origin communication
- Implement loading states and user experience patterns
- Set up environment configurations for both frontend and backend
- Create integration patterns for optimal data flow

## API Client Configuration
- Setup fetch/axios client in Next.js with proper configuration
- Configure base URL from environment variables (NEXT_PUBLIC_API_URL)
- Create reusable API service functions for all required endpoints
- Implement request/response interceptors for consistent handling

## JWT Token Management
- Attach JWT tokens to all API requests using Authorization: Bearer header
- Handle token expiration with refresh token logic
- Store tokens securely using httpOnly cookies or secure local storage
- Implement token refresh mechanisms to maintain user sessions

## Request/Response Handling
- Implement request interceptors to add auth headers automatically
- Create response interceptors for consistent error handling
- Parse backend responses and transform data as needed
- Handle different response formats between frontend and backend

## Error Handling
- Handle 401 Unauthorized responses by redirecting to login
- Manage 403 Forbidden responses with appropriate user feedback
- Display user-friendly error messages for different error types
- Implement network error handling and timeout management
- Create centralized error handling patterns

## CORS Configuration
- Configure CORS in FastAPI to allow Next.js origin
- Handle preflight requests properly
- Set allowed methods (GET, POST, PUT, PATCH, DELETE) and headers
- Configure credentials to allow cookie transmission

## Loading States
- Show loading indicators during API calls
- Disable buttons during requests to prevent duplicate submissions
- Implement skeleton loaders for better user experience
- Manage loading states at component and global levels

## Environment Configuration
- Set NEXT_PUBLIC_API_URL for frontend API communication
- Configure backend API port and host settings
- Share BETTER_AUTH_SECRET between frontend and backend
- Manage different configurations for development, staging, and production

## Integration Patterns
- Implement server-side data fetching in Next.js for initial loads
- Create client-side mutations for interactive updates
- Use optimistic updates for better user experience
- Implement cache invalidation strategies after mutations
- Design patterns for real-time updates if needed

## File Structure Convention
- `/lib/api-client.ts` - API client configuration
- `/lib/api/tasks.ts` - Task-related API functions
- `/hooks/useTasks.ts` - Custom hooks for task operations
- `/middleware.ts` - Auth middleware for protected routes
- `/components/TaskList.tsx` - Component with integrated API calls
- `/types/api.ts` - TypeScript types for API responses

## Best Practices
- Implement type-safe API calls with TypeScript interfaces
- Use centralized error handling to maintain consistency
- Add retry logic for failed requests with exponential backoff
- Implement request deduplication to prevent multiple identical requests
- Use loading and error boundaries for graceful error handling
- Follow security best practices for token storage and transmission
- Implement proper logging for debugging and monitoring

## Security Considerations
- Never expose sensitive backend secrets in frontend code
- Use HTTPS in production for all API communications
- Implement proper input validation on both frontend and backend
- Sanitize all data passed between frontend and backend
- Use secure methods for storing authentication tokens