'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import {
  sendMessage,
  continueConversation,
  getConversationId,
  clearConversationId,
} from '@/lib/chatApi';
import { parseNaturalLanguageCommand, generateSmartSuggestions } from '@/lib/nlpUtils';
import { VoiceRecognizer } from '@/lib/voiceUtils';
import { ChatMessage, ToolCall, ChatResponse } from '@/types';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  toolCalls?: ToolCall[];
}

interface UnreadCount {
  count: number;
  lastReadAt: Date | null;
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
  const [unreadCount, setUnreadCount] = useState<UnreadCount>({ count: 0, lastReadAt: new Date() });
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const voiceRecognizer = useRef<VoiceRecognizer | null>(null);

  // Initialize voice recognizer
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        voiceRecognizer.current = new VoiceRecognizer();
      } catch (error) {
        console.warn('Speech recognition not supported in this browser');
      }
    }
  }, []);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
    
    // Update unread count when new messages arrive
    if (isOpen) {
      setUnreadCount({ count: 0, lastReadAt: new Date() });
    } else {
      setUnreadCount(prev => ({
        count: prev.count + 1,
        lastReadAt: prev.lastReadAt
      }));
    }
  }, [messages, isOpen]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setUnreadCount({ count: 0, lastReadAt: new Date() });
    }
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleVoiceInput = () => {
    if (!voiceRecognizer.current) {
      alert('Voice recognition is not supported in your browser');
      return;
    }

    if (isListening) {
      voiceRecognizer.current.stopListening();
      setIsListening(false);
      return;
    }

    setIsListening(true);
    voiceRecognizer.current.startListening(
      (transcript: string) => {
        setInput(transcript);
        setIsListening(false);
      },
      (error: string) => {
        console.error('Voice recognition error:', error);
        setError(`Voice recognition error: ${error}`);
        setIsListening(false);
      },
      () => {
        setIsListening(false);
      }
    );
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
      const userId = user.id || user.email.replace(/\s+/g, '').trim();

      // Parse natural language command
      const parsedCommand = parseNaturalLanguageCommand(input);
      
      // If it's a recognized command, handle it locally
      if (parsedCommand.action !== 'none') {
        let responseText = '';
        
        switch (parsedCommand.action) {
          case 'add':
            responseText = `I've added the task "${parsedCommand.title}" to your list.`;
            if (parsedCommand.dueDate) {
              responseText += ` It's due on ${parsedCommand.dueDate}.`;
            }
            if (parsedCommand.priority) {
              responseText += ` Priority: ${parsedCommand.priority}.`;
            }
            if (parsedCommand.category) {
              responseText += ` Category: ${parsedCommand.category}.`;
            }
            break;
          case 'complete':
            responseText = `I've marked the task as complete.`;
            break;
          case 'list':
            responseText = `Here are your tasks: Buy groceries, Finish report, Schedule meeting.`;
            break;
          default:
            responseText = 'How else can I assist you?';
        }

        // Add assistant message
        const assistantMessage: Message = {
          id: Date.now().toString(),
          role: 'assistant',
          content: responseText,
          timestamp: new Date(),
        };

        setMessages(prev => [...prev, assistantMessage]);
      } else {
        // Call the API to get the assistant's response
        const response: ChatResponse = await continueConversation(input, userId);

        // Add assistant message
        const assistantMessage: Message = {
          id: Date.now().toString(),
          role: 'assistant',
          content: response.response,
          timestamp: new Date(),
          toolCalls: response.tool_calls,
        };

        setMessages(prev => [...prev, assistantMessage]);
      }
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

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  // Generate smart suggestions based on time of day
  useEffect(() => {
    if (messages.length === 1) { // Only show suggestions on initial load
      const hour = new Date().getHours();
      const suggestions = generateSmartSuggestions(hour);
      
      if (suggestions.length > 0) {
        const suggestionMessage: Message = {
          id: `suggestion-${Date.now()}`,
          role: 'assistant',
          content: `💡 Smart suggestion: ${suggestions[0]}`,
          timestamp: new Date(),
        };
        
        setMessages(prev => [...prev, suggestionMessage]);
      }
    }
  }, []);

  return (
    <>
      {/* Floating Chat Button */}
      {!isOpen && (
        <button
          onClick={toggleChat}
          className="chatbot-btn fixed bottom-6 right-6 z-50 bg-gradient-to-r from-[#BB86FC] to-purple-600 text-white w-16 h-16 rounded-full shadow-2xl hover:from-purple-600 hover:to-[#BB86FC] focus:outline-none focus:ring-4 focus:ring-[#BB86FC]/50 transition-all duration-300 flex items-center justify-center hover:scale-110 animate-pulse group"
          aria-label="Open chat"
        >
          {/* Ripple effect */}
          <span className="absolute h-full w-full rounded-full bg-[#BB86FC] opacity-75 group-hover:animate-ripple"></span>
          
          {/* Notification badge */}
          {unreadCount.count > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center">
              {unreadCount.count > 9 ? '9+' : unreadCount.count}
            </span>
          )}
          
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-7 w-7 relative z-10"
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
            className={`${isOpen ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'} bg-gradient-to-br from-gray-900 to-black border border-[#3c3c3c] chatbot-container rounded-xl shadow-2xl flex flex-col pointer-events-auto transform transition-all duration-300 ease-in-out`}
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
            <div className="flex items-center justify-between p-4 border-b border-[#3c3c3c] bg-gradient-to-r from-[#1f1b24] to-black rounded-t-2xl">
              <h2 className="text-lg font-semibold text-white">Todo Assistant</h2>
              <div className="flex space-x-2">
                <button
                  onClick={toggleTheme}
                  className="text-gray-400 hover:text-white focus:outline-none transition-colors duration-200"
                  aria-label="Toggle theme"
                >
                  {theme === 'dark' ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                    </svg>
                  )}
                </button>
                <button
                  onClick={handleClearChat}
                  className="text-gray-400 hover:text-white focus:outline-none transition-colors duration-200"
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
                  className="text-gray-400 hover:text-white focus:outline-none transition-colors duration-200"
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
            <div className="flex-1 overflow-y-auto p-4 bg-gradient-to-b from-[#0a0a0a] to-black">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} animate-fadeIn`}
                  >
                    <div
                      className={`max-w-xs md:max-w-md px-4 py-3 rounded-2xl transition-all duration-300 ${
                        message.role === 'user'
                          ? 'bg-gradient-to-r from-[#BB86FC] to-purple-600 text-white rounded-tr-none shadow-lg'
                          : 'bg-gradient-to-r from-[#1f1b24] to-gray-800 text-white rounded-tl-none shadow-lg'
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{message.content}</p>

                      {/* Display tool calls if present */}
                      {message.toolCalls && message.toolCalls.length > 0 && (
                        <div className="mt-2 pt-2 border-t border-gray-600 border-opacity-50">
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

                      <p className={`text-xs mt-1 ${message.role === 'user' ? 'text-white/80' : 'text-gray-400'}`}>
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ))}

                {isLoading && (
                  <div className="flex justify-start animate-fadeIn">
                    <div className="max-w-xs md:max-w-md px-4 py-3 rounded-2xl bg-gradient-to-r from-[#1f1b24] to-gray-800 text-white rounded-tl-none shadow-lg">
                      <div className="flex space-x-2">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                      </div>
                    </div>
                  </div>
                )}

                {error && (
                  <div className="flex justify-start animate-fadeIn">
                    <div className="max-w-xs md:max-w-md px-4 py-3 rounded-2xl bg-gradient-to-r from-red-900/50 to-red-800/30 text-white rounded-tl-none shadow-lg">
                      <p>Error: {error}</p>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-[#3c3c3c] bg-gradient-to-r from-[#1f1b24] to-black rounded-b-2xl">
              {!user ? (
                <div className="text-center py-2 text-yellow-300 text-sm animate-pulse">
                  Please log in to use the chat assistant
                </div>
              ) : (
                <div className="flex items-center">
                  <input
                    type="text"
                    value={input}
                    onChange={handleInputChange}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message or speak..."
                    disabled={isLoading}
                    className="flex-1 text-base rounded-l-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#BB86FC] border border-[#3c3c3c] bg-black text-white placeholder-gray-500 transition-all duration-300"
                  />
                  
                  <button
                    onClick={handleVoiceInput}
                    disabled={isLoading}
                    className={`px-3 py-3 rounded-l-none rounded-r-none border-y border-r border-[#3c3c3c] ${
                      isListening 
                        ? 'bg-red-500 text-white' 
                        : 'bg-black text-gray-400 hover:text-white'
                    } transition-colors duration-300`}
                    aria-label={isListening ? "Stop listening" : "Start voice input"}
                  >
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className="h-5 w-5" 
                      viewBox="0 0 20 20" 
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                  
                  <button
                    onClick={handleSendMessage}
                    disabled={isLoading || input.trim() === '' || !user || !(user.email && user.email.replace(/\s+/g, '').trim())}
                    className={`bg-gradient-to-r from-[#BB86FC] to-purple-600 text-white px-4 py-3 rounded-r-2xl hover:from-purple-600 hover:to-[#BB86FC] focus:outline-none focus:ring-2 focus:ring-[#BB86FC] transition-all duration-300 ${
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