// frontend/lib/api.ts

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { mockAuthAPI, mockTodoAPI } from './mockApi';

// Base API URL from environment
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api';

// Determine if we're running on GitHub Pages (static export)
const isStaticExport = typeof window !== 'undefined' && window.location.hostname.includes('github.io');

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: isStaticExport ? '' : API_BASE_URL, // Use empty string for static export to prevent CORS issues
  timeout: 10000, // 10 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('access_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle 401 Unauthorized globally
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Remove invalid token
      localStorage.removeItem('access_token');
      localStorage.removeItem('user_email');

      // Redirect to login page
      if (typeof window !== 'undefined') {
        window.location.href = '/auth/login';
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;

// Export individual API functions for convenience
export const authAPI = isStaticExport ? mockAuthAPI : {
  login: (email: string, password: string) =>
    apiClient.post('/auth/login', null, {
      params: {
        email,
        password
      }
    }),

  signup: (email: string, password: string) =>
    apiClient.post('/auth/signup', { email, password }),
};

export const todoAPI = isStaticExport ? mockTodoAPI : {
  // Get all todos for the authenticated user
  getTodos: () =>
    apiClient.get('/todos'),

  // Create a new todo
  createTodo: (todoData: { title: string; description?: string }) =>
    apiClient.post('/todos', todoData),

  // Get a specific todo
  getTodo: (todoId: string) =>
    apiClient.get(`/todos/${todoId}`),

  // Update a specific todo
  updateTodo: (todoId: string, todoData: Partial<{ title: string; description?: string; is_completed: boolean }>) =>
    apiClient.put(`/todos/${todoId}`, todoData),

  // Toggle completion status of a todo
  toggleTodoComplete: (todoId: string) =>
    apiClient.patch(`/todos/${todoId}/complete`, {}),

  // Delete a specific todo
  deleteTodo: (todoId: string) =>
    apiClient.delete(`/todos/${todoId}`),
};