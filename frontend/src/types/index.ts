// frontend/src/types/index.ts

export interface User {
  id: string;
  email: string;
  created_at: string;
  updated_at: string;
  is_active: boolean;
}

export interface Todo {
  id: string;
  title: string;
  description?: string;
  is_completed: boolean;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface TodoCreate {
  title: string;
  description?: string;
}

export interface TodoUpdate {
  title?: string;
  description?: string;
  is_completed?: boolean;
}