// frontend/lib/todoService.ts

import apiClient, { todoAPI } from './api';
import { Todo, TodoCreate, TodoUpdate } from '@/types';

// Service functions for todo operations
export const todoService = {
  // Get all todos for the authenticated user
  getTodos: async (): Promise<Todo[]> => {
    try {
      const response = await todoAPI.getTodos();
      return response.data;
    } catch (error) {
      console.error('Error fetching todos:', error);
      throw error;
    }
  },

  // Create a new todo
  createTodo: async (todoData: TodoCreate): Promise<Todo> => {
    try {
      const response = await todoAPI.createTodo(todoData);
      return response.data;
    } catch (error) {
      console.error('Error creating todo:', error);
      throw error;
    }
  },

  // Get a specific todo
  getTodo: async (todoId: string): Promise<Todo> => {
    try {
      const response = await todoAPI.getTodo(todoId);
      return response.data;
    } catch (error) {
      console.error(`Error fetching todo with id ${todoId}:`, error);
      throw error;
    }
  },

  // Update a specific todo
  updateTodo: async (todoId: string, todoData: TodoUpdate): Promise<Todo> => {
    try {
      const response = await todoAPI.updateTodo(todoId, todoData);
      return response.data;
    } catch (error) {
      console.error(`Error updating todo with id ${todoId}:`, error);
      throw error;
    }
  },

  // Toggle completion status of a todo
  toggleTodoComplete: async (todoId: string): Promise<Todo> => {
    try {
      const response = await todoAPI.toggleTodoComplete(todoId);
      return response.data;
    } catch (error) {
      console.error(`Error toggling todo completion with id ${todoId}:`, error);
      throw error;
    }
  },

  // Delete a specific todo
  deleteTodo: async (todoId: string): Promise<void> => {
    try {
      await todoAPI.deleteTodo(todoId);
    } catch (error) {
      console.error(`Error deleting todo with id ${todoId}:`, error);
      throw error;
    }
  },
};