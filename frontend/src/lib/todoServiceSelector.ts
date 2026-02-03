// frontend/src/lib/todoServiceSelector.ts

import { mockTodoService } from './mockTodoService';

// Extend the mock service to include reorderTodos
export const todoServiceToUse = {
  ...mockTodoService,
  reorderTodos: mockTodoService.reorderTodos
};