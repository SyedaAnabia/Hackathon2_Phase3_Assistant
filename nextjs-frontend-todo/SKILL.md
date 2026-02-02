---
name: nextjs-frontend-todo
description: Create and manage Next.js frontend components for a Todo application using App Router, TypeScript, and responsive UI patterns. Use when building frontend pages, components, API integrations, and user interfaces for the Todo app.
---

# Next.js Frontend Development for Todo Application

## Capabilities
- Create responsive UI components using React and TypeScript
- Implement Next.js App Router patterns for the Todo app
- Handle API calls and state management for todo operations
- Integrate with Better Auth authentication system
- Create reusable UI components for task management
- Implement form handling and validation for todo creation/editing
- Manage client-side routing for different todo views

## Best Practices
- Use TypeScript interfaces for strong typing of todo data structures
- Follow React hooks best practices
- Implement proper error boundaries
- Use CSS Modules or Tailwind for styling
- Follow accessibility guidelines
- Optimize component rendering
- Implement proper loading and error states

## File Structure Convention
- Components in `/components`
- Pages in `/app` (Next.js App Router)
- Shared utilities in `/lib`
- Public assets in `/public`

## Required Components for Todo App
- Todo list component to display all tasks
- Todo item component with completion toggle
- Add/edit todo form component
- Filter controls (all/active/completed)
- User authentication components
- Loading and error state components

## API Integration Patterns
- GET /api/{user_id}/tasks - Fetch and display todos
- POST /api/{user_id}/tasks - Create new todo
- GET /api/{user_id}/tasks/{id} - Fetch specific todo
- PUT /api/{user_id}/tasks/{id} - Update todo
- DELETE /api/{user_id}/tasks/{id} - Delete todo
- PATCH /api/{user_id}/tasks/{id}/complete - Toggle completion

## Authentication Integration
- Include JWT tokens in API request headers
- Redirect unauthenticated users to login
- Handle authentication errors gracefully
- Display user-specific todo lists

## Common Patterns
- Client components using 'use client'
- Server components using Next.js App Router for initial data fetch
- Data fetching with async/await
- Component composition over inheritance
- Context providers for global state
- Custom hooks for reusable logic