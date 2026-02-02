'use client';

import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import {
  sendMessage,
  continueConversation,
  getConversationId,
  clearConversationId,
  ChatMessage as ApiChatMessage,
  ToolCall
} from '@/lib/chatApi';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  toolCalls?: ToolCall[];
}

const ChatBot = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I\'m your Todo Assistant. How can I help you with your tasks today?',
      timestamp: new Date(),
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);


  // Auto-scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleSendMessage = async () => {
    if (input.trim() === '' || !user || !(user.email && user.email.replace(/\s+/g, '').trim())) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      // Use the email as the user identifier since that's what's available
      // In a real implementation, you'd want to use a proper user ID
      // Sanitize the email to remove any spaces or invalid characters for URL
      const userId = user.id || user.email.replace(/\s+/g, '').trim();

      // Call the API to get the assistant's response
      const response = await continueConversation(input, userId);

      // Add assistant message
      const assistantMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: response.response,
        timestamp: new Date(),
        toolCalls: response.tool_calls,
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (err) {
      console.error('Error sending message:', err);
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');

      // Add error message to the chat
      const errorMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: `Sorry, I encountered an error: ${err instanceof Error ? err.message : 'An unexpected error occurred'}`,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleClearChat = () => {
    // Reset messages to initial state
    setMessages([
      {
        id: '1',
        role: 'assistant',
        content: 'Hello! I\'m your Todo Assistant. How can I help you with your tasks today?',
        timestamp: new Date(),
      }
    ]);
    // Clear conversation ID from localStorage
    clearConversationId();
  };

  return (
    <>
      {/* Floating Chat Button */}
      {!isOpen && (
        <button
          onClick={toggleChat}
          className="chatbot-btn bg-[#BB86FC] text-white w-16 h-16 rounded-full shadow-2xl hover:bg-[#a770e0] focus:outline-none focus:ring-4 focus:ring-[#BB86FC]/50 transition-all duration-300 flex items-center justify-center hover:scale-110"
          aria-label="Open chat"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-7 w-7"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
            />
          </svg>
        </button>
      )}

      {/* Chat Window Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-[60] pointer-events-none">
          <div
            className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
            onClick={handleClose}
          ></div>

          <div
            className={`${isOpen ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'} bg-black border border-[#3c3c3c] chatbot-container rounded-xl shadow-2xl flex flex-col pointer-events-auto transform transition-all duration-300 ease-in-out`}
            style={{
              position: 'fixed',
              width: '400px',
              height: '500px',
              bottom: '90px',
              right: '20px',
              left: 'auto',
              maxWidth: 'calc(100vw - 40px)',
              borderRadius: '12px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
              zIndex: 60
            }}
          >
            {/* Chat Header */}
            <div className="flex items-center justify-between p-4 border-b border-[#3c3c3c] bg-black rounded-t-2xl">
              <h2 className="text-lg font-semibold text-white">Todo Assistant</h2>
              <div className="flex space-x-2">
                <button
                  onClick={handleClearChat}
                  className="text-gray-400 hover:text-white focus:outline-none"
                  aria-label="Clear chat"
                  title="Clear chat"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
                <button
                  onClick={handleClose}
                  className="text-gray-400 hover:text-white focus:outline-none"
                  aria-label="Close chat"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 bg-[#0a0a0a]">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs md:max-w-md px-4 py-2 rounded-2xl ${
                        message.role === 'user'
                          ? 'bg-[#BB86FC] text-white rounded-tr-none'
                          : 'bg-[#1f1b24] text-white rounded-tl-none'
                      }`}
                    >
                      <p>{message.content}</p>

                      {/* Display tool calls if present */}
                      {message.toolCalls && message.toolCalls.length > 0 && (
                        <div className="mt-2 pt-2 border-t border-gray-600">
                          <p className="text-xs text-gray-400">Used tools:</p>
                          <ul className="text-xs text-gray-300">
                            {message.toolCalls.map((toolCall, index) => (
                              <li key={index} className="truncate">
                                • {toolCall.tool_name}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      <p className={`text-xs mt-1 ${message.role === 'user' ? 'text-white/70' : 'text-gray-400'}`}>
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ))}

                {isLoading && (
                  <div className="flex justify-start">
                    <div className="max-w-xs md:max-w-md px-4 py-2 rounded-2xl bg-[#1f1b24] text-white rounded-tl-none">
                      <div className="flex space-x-2">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                      </div>
                    </div>
                  </div>
                )}

                {error && (
                  <div className="flex justify-start">
                    <div className="max-w-xs md:max-w-md px-4 py-2 rounded-2xl bg-red-900/30 text-white rounded-tl-none">
                      <p>Error: {error}</p>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-[#3c3c3c] bg-black rounded-b-2xl">
              {!user ? (
                <div className="text-center py-2 text-yellow-300 text-sm">
                  Please log in to use the chat assistant
                </div>
              ) : (
                <div className="flex items-center">
                  <input
                    type="text"
                    value={input}
                    onChange={handleInputChange}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message..."
                    disabled={isLoading}
                    className="flex-1 text-base rounded-l-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#BB86FC] border border-[#3c3c3c]"
                    style={{ color: 'black', background: 'white', fontSize: '16px' }}
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={isLoading || input.trim() === '' || !user || !(user.email && user.email.replace(/\s+/g, '').trim())}
                    className={`bg-[#BB86FC] text-white px-4 py-3 rounded-r-2xl hover:bg-[#a770e0] focus:outline-none focus:ring-2 focus:ring-[#BB86FC] transition-colors ${
                      (isLoading || input.trim() === '' || !user || !(user.email && user.email.replace(/\s+/g, '').trim())) ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBot;