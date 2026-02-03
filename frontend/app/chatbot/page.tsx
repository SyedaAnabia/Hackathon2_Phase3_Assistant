'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  TypingIndicator
} from '@chatscope/chat-ui-kit-react';
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import { useAuth } from '@/contexts/AuthContext';

// Define TypeScript interfaces
interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant' | 'tool';
  timestamp: Date;
}

interface ToolCall {
  name: string;
  arguments: Record<string, any>;
  result: any;
}

const ChatbotPage = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messageListRef = useRef<HTMLDivElement>(null);

  // Initialize with a welcome message
  useEffect(() => {
    setMessages([
      {
        id: '1',
        content: 'Hello! I\'m your AI assistant. How can I help you today?',
        role: 'assistant',
        timestamp: new Date(),
      }
    ]);
  }, []);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  };

  // Get user ID from authentication context
  const getUserId = (): string => {
    // Get user ID from auth context
    if (user && user.id) {
      return user.id;
    }
    return 'default_user';
  };

  // Function to send message to backend API
  const sendMessageToBackend = async (userMessage: string, userId: string): Promise<{response: string, conversationId: string, toolCalls: ToolCall[]}> => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Get the conversation ID from localStorage or use a default
      let conversationId = localStorage.getItem('conversationId');
      
      const response = await fetch(`http://localhost:8000/api/chat/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          conversation_id: conversationId || undefined
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to send message');
      }
      
      const data = await response.json();
      
      // Store the conversation ID for continuity
      localStorage.setItem('conversationId', data.conversation_id);
      
      return { 
        response: data.response, 
        conversationId: data.conversation_id,
        toolCalls: data.tool_calls || [] 
      };
    } catch (err) {
      console.error('Error sending message:', err);
      setError(err instanceof Error ? err.message : 'Failed to send message. Please try again.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Handle sending a message
  const handleSend = async (text: string) => {
    if (!text.trim()) return;

    const userId = getUserId();
    
    // Add user message to the chat
    const userMessage: Message = {
      id: Date.now().toString(),
      content: text,
      role: 'user',
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    
    try {
      // Send message to backend and get response
      const { response, toolCalls } = await sendMessageToBackend(text, userId);
      
      // Add tool calls to the chat if any
      const newMessages: Message[] = [];
      
      if (toolCalls.length > 0) {
        toolCalls.forEach((toolCall, index) => {
          newMessages.push({
            id: `tool-${Date.now()}-${index}`,
            content: `Used tool: ${toolCall.name} with args: ${JSON.stringify(toolCall.arguments)}`,
            role: 'tool',
            timestamp: new Date(),
          });
        });
      }
      
      // Add assistant response to the chat
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response,
        role: 'assistant',
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, ...newMessages, assistantMessage]);
    } catch (err) {
      // Error is already handled in sendMessageToBackend
    }
  };

  // Format timestamp for display
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Function to clear the conversation
  const clearConversation = () => {
    setMessages([{
      id: '1',
      content: 'Hello! I\'m your AI assistant. How can I help you today?',
      role: 'assistant',
      timestamp: new Date(),
    }]);
    localStorage.removeItem('conversationId');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#000000] to-[#000000] py-12 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="bg-black shadow-sm py-4 px-6 flex justify-between items-center border-b border-[#3c3c3c] mb-6 rounded-xl">
        <div className="flex items-center space-x-2 cursor-pointer">
          <div className="w-8 h-8 rounded-lg bg-transparent flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14,2 14,8 20,8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <polyline points="10,9 9,9 8,9"></polyline>
            </svg>
          </div>
          <span className="text-xl font-bold text-white">AI Chat Assistant</span>
        </div>
        <button
          onClick={clearConversation}
          className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white transition-colors border border-white text-sm"
        >
          Clear Chat
        </button>
      </div>

      {/* Chat Container */}
      <div className="flex flex-col container mx-auto max-w-4xl">
        <div className="bg-black rounded-2xl shadow-xl overflow-hidden flex flex-col flex-grow h-[calc(100vh-200px)] border border-[#3c3c3c]">
          <MainContainer className="border-0 flex-grow">
            <ChatContainer style={{ flexDirection: 'column' }}>
              <MessageList
                ref={messageListRef}
                className="p-4 bg-black flex-grow"
              >
                {messages.map((msg) => {
                  // Different styling for different message types
                  let sender = '';
                  let direction: 'incoming' | 'outgoing' = 'incoming';
                  let avatarPosition: 'tl' | 'tr' | 'bl' | 'br' = 'tl';

                  if (msg.role === 'user') {
                    sender = 'You';
                    direction = 'outgoing';
                    avatarPosition = 'tr';
                  } else if (msg.role === 'assistant') {
                    sender = 'Assistant';
                    direction = 'incoming';
                    avatarPosition = 'tl';
                  } else if (msg.role === 'tool') {
                    sender = 'System Tool';
                    direction = 'incoming';
                    avatarPosition = 'tl';
                  }

                  // Special styling for tool messages
                  const isToolMessage = msg.role === 'tool';

                  return (
                    <Message
                      key={msg.id}
                      model={{
                        message: msg.content,
                        sender,
                        direction,
                        position: 'normal'
                      }}
                      avatarPosition={avatarPosition}
                      style={isToolMessage ? { backgroundColor: '#1a1a2e', border: '1px solid #16213e', borderRadius: '8px' } : {}}
                    >
                      <Message.Footer sentTime={formatTime(msg.timestamp)} />
                    </Message>
                  );
                })}

                {isLoading && (
                  <Message
                    model={{
                      message: '',
                      sender: 'Assistant',
                      direction: 'incoming',
                      position: 'normal'
                    }}
                    avatarPosition="tl"
                  >
                    <TypingIndicator content="AI is thinking..." />
                  </Message>
                )}
              </MessageList>

              {/* Fixed Input Area at Bottom */}
              <div className="border-t border-[#3c3c3c] p-3 bg-black" style={{ marginTop: 'auto' }}>
                <div className="flex items-center">
                  <input
                    type="text"
                    placeholder="Type your message here..."
                    className="flex-grow rounded-xl border border-[#3c3c3c] bg-black text-white placeholder-white py-3 px-4 focus:outline-none focus:ring-2 focus:ring-[#BB86FC]"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                        handleSend(e.currentTarget.value);
                        e.currentTarget.value = ''; // Clear input after sending
                      }
                    }}
                    id="message-input"
                  />
                  <button
                    onClick={() => {
                      const inputElement = document.getElementById('message-input') as HTMLInputElement;
                      if (inputElement && inputElement.value.trim()) {
                        handleSend(inputElement.value);
                        inputElement.value = ''; // Clear input after sending
                      }
                    }}
                    className="ml-2 px-4 py-3 bg-[#BB86FC] hover:bg-[#a770e0] text-white rounded-xl transition-colors shadow-lg shadow-[#BB86FC]/20 border border-white"
                  >
                    Send
                  </button>
                </div>
              </div>
            </ChatContainer>
          </MainContainer>

          {error && (
            <div className="bg-red-900/30 border-l-4 border-red-500 text-white p-3 m-3 rounded" role="alert">
              <p>{error}</p>
            </div>
          )}
        </div>

        {/* Additional Info */}
        <div className="mt-4 text-center text-sm text-gray-500">
          <p>Your conversations are private and secure. Messages are not stored on our servers.</p>
        </div>
      </div>
    </div>
  );
};

export default ChatbotPage;