// src/lib/chatApi.ts

// TypeScript interfaces
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface ToolCall {
  tool_name: string;
  parameters: Record<string, any>;
  result?: any;
}

export interface ChatRequest {
  conversation_id?: string; // UUID as string
  message: string;
}

export interface ChatResponse {
  conversation_id: string; // UUID as string
  response: string;
  tool_calls?: ToolCall[];
}

// LocalStorage helper functions
const CONVERSATION_ID_KEY = 'todo_assistant_conversation_id';

export const getConversationId = (): string | null => {
  if (typeof window === 'undefined') return null; // Check if running in browser

  try {
    const storedId = localStorage.getItem(CONVERSATION_ID_KEY);
    return storedId || null;
  } catch (error) {
    console.error('Error retrieving conversation ID from localStorage:', error);
    return null;
  }
};

export const setConversationId = (id: string): void => {
  if (typeof window === 'undefined') return; // Check if running in browser

  try {
    localStorage.setItem(CONVERSATION_ID_KEY, id);
  } catch (error) {
    console.error('Error storing conversation ID in localStorage:', error);
  }
};

export const clearConversationId = (): void => {
  if (typeof window === 'undefined') return; // Check if running in browser

  try {
    localStorage.removeItem(CONVERSATION_ID_KEY);
  } catch (error) {
    console.error('Error clearing conversation ID from localStorage:', error);
  }
};

// Main API function to send messages
export const sendMessage = async (
  message: string,
  userId: string,
  conversationId?: string
): Promise<ChatResponse> => {
  try {
    // Validate userId
    if (!userId) {
      throw new Error('User ID is required to send a message');
    }

    // Get the API base URL from environment variables
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    if (!apiUrl) {
      throw new Error('NEXT_PUBLIC_API_URL environment variable is not set');
    }

    // Prepare the request body
    const chatRequest: ChatRequest = {
      message,
      ...(conversationId && { conversation_id: conversationId }),
    };

    // Make the API call - wrap the request in the expected format
    const response = await fetch(`${apiUrl}/api/users/${userId}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ chat_request: chatRequest }), // Wrap in chat_request as expected by backend
    });

    // Check if the response is OK
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `HTTP error! Status: ${response.status}`
      );
    }

    // Parse the response
    const data: ChatResponse = await response.json();

    // Store the conversation ID for future use
    if (data.conversation_id) {
      setConversationId(data.conversation_id);
    }

    return data;
  } catch (error) {
    console.error('Error sending message:', error);

    // Re-throw the error with additional context
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Network error: Unable to connect to the chat service. Please check your connection.');
    }

    throw error;
  }
};

// Function to initialize a new conversation
export const startNewConversation = async (
  userId: string,
  initialMessage?: string
): Promise<ChatResponse> => {
  // Clear any existing conversation ID
  clearConversationId();

  // Send the initial message (or a default greeting)
  const message = initialMessage || 'Hello, I would like to start a new conversation.';

  return sendMessage(message, userId);
};

// Function to continue an existing conversation
export const continueConversation = async (
  message: string,
  userId: string
): Promise<ChatResponse> => {
  // Get the existing conversation ID from localStorage
  const conversationId = getConversationId();

  // Send the message with the conversation ID if it exists
  return sendMessage(message, userId, conversationId || undefined);
};