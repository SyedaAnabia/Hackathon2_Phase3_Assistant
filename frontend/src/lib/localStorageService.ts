// frontend/src/lib/localStorageService.ts

import { Todo } from '@/types';

const TODO_STORAGE_KEY = 'todos';
const CHAT_HISTORY_KEY = 'chatHistory';

// Todo storage functions
export const loadTodos = (): Todo[] => {
  if (typeof window === 'undefined') return [];

  try {
    const serializedTodos = localStorage.getItem(TODO_STORAGE_KEY);
    if (serializedTodos === null) {
      return [];
    }
    return JSON.parse(serializedTodos);
  } catch (error) {
    console.error('Error loading todos from localStorage:', error);
    return [];
  }
};

export const saveTodos = (todos: Todo[]): void => {
  if (typeof window === 'undefined') return;

  try {
    const serializedTodos = JSON.stringify(todos);
    localStorage.setItem(TODO_STORAGE_KEY, serializedTodos);
  } catch (error) {
    console.error('Error saving todos to localStorage:', error);
  }
};

// Chat history storage functions
export const loadChatHistory = (): any[] => {
  if (typeof window === 'undefined') return [];

  try {
    const serializedHistory = localStorage.getItem(CHAT_HISTORY_KEY);
    if (serializedHistory === null) {
      return [];
    }
    return JSON.parse(serializedHistory);
  } catch (error) {
    console.error('Error loading chat history from localStorage:', error);
    return [];
  }
};

export const saveChatHistory = (history: any[]): void => {
  if (typeof window === 'undefined') return;

  try {
    const serializedHistory = JSON.stringify(history);
    localStorage.setItem(CHAT_HISTORY_KEY, serializedHistory);
  } catch (error) {
    console.error('Error saving chat history to localStorage:', error);
  }
};

// Clear all stored data
export const clearAllStoredData = (): void => {
  if (typeof window === 'undefined') return;

  try {
    localStorage.removeItem(TODO_STORAGE_KEY);
    localStorage.removeItem(CHAT_HISTORY_KEY);
  } catch (error) {
    console.error('Error clearing stored data:', error);
  }
};