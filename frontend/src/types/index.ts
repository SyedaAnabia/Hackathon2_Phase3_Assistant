// frontend/src/types/index.ts

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

export interface ChatRequest {
  message: string;
  userId?: string;
  conversationId?: string;
}

export interface ToolCall {
  tool_name: string;
  parameters: Record<string, any>;
  result?: any;
}

export interface ChatResponse {
  response: string;
  conversation_id: string;
  timestamp?: Date;
  toolsUsed?: string[];
  tool_calls?: ToolCall[];
}

export interface Todo {
  id: string;
  title: string;
  description?: string;
  is_completed: boolean;
  user_id: string;
  created_at: string;
  updated_at: string;
  priority?: 'high' | 'medium' | 'low';
  due_date?: string;
  category?: string;
  reminder?: string;
  position?: number;
}

export interface TodoCreate {
  title: string;
  description?: string;
  priority?: 'high' | 'medium' | 'low';
  due_date?: string;
  category?: string;
  reminder?: string;
  position?: number;
}

export interface TodoUpdate {
  title?: string;
  description?: string;
  is_completed?: boolean;
  priority?: 'high' | 'medium' | 'low';
  due_date?: string;
  category?: string;
  reminder?: string;
  position?: number;
}