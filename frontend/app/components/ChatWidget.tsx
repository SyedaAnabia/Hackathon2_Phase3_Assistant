import React, { useState, useRef, useEffect } from 'react';
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

interface ChatWidgetProps {
  isOpen: boolean;
  onClose: () => void;
}

// Backend API configuration
const BACKEND_URL = 'http://localhost:8000';

// SVG Icons Components
const MicrophoneIcon = ({ isActive }: { isActive: boolean }) => (
  <svg 
    width="20" 
    height="20" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
    <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
    <line x1="12" y1="19" x2="12" y2="23"></line>
    <line x1="8" y1="23" x2="16" y2="23"></line>
  </svg>
);

const TrashIcon = () => (
  <svg 
    width="20" 
    height="20" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <polyline points="3 6 5 6 21 6"></polyline>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
    <line x1="10" y1="11" x2="10" y2="17"></line>
    <line x1="14" y1="11" x2="14" y2="17"></line>
  </svg>
);

const SendIcon = () => (
  <svg 
    width="18" 
    height="18" 
    viewBox="0 0 24 24" 
    fill="currentColor"
  >
    <path d="M12 2L12 22M12 2L6 8M12 2L18 8"></path>
  </svg>
);

const ChatWidget: React.FC<ChatWidgetProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Hello! I\'m your AI assistant for the Todo App. How can I help you manage your tasks today?',
      role: 'assistant',
      timestamp: new Date(),
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);
  const [isMinimized, setIsMinimized] = useState(false);
  const messageListRef = useRef<HTMLDivElement>(null);

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
    if (user && user.email) {
      return '123e4567-e89b-12d3-a456-426614174000';
    }

    const token = localStorage.getItem('access_token');
    if (token) {
      try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
          atob(base64)
            .split('')
            .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
            .join('')
        );

        const decodedToken = JSON.parse(jsonPayload);
        if (decodedToken.sub) {
          return decodedToken.sub;
        }
      } catch (error) {
        console.error('Error decoding token for user ID:', error);
      }
    }

    return 'unauthenticated';
  };

  // Function to send message to backend API
  const sendMessageToBackend = async (userMessage: string, userId: string): Promise<{response: string, conversationId: string, toolCalls: ToolCall[]}> => {
    try {
      setIsLoading(true);
      setError(null);

      if (userId === 'unauthenticated') {
        throw new Error('Please log in to use the chat feature');
      }

      let conversationId = localStorage.getItem('conversationId');

      const response = await fetch(`${BACKEND_URL}/api/chat/${userId}`, {
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
        let errorDetails = `HTTP Error: ${response.status}`;

        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          try {
            const errorData = await response.json();
            errorDetails = errorData.detail || errorData.message || errorDetails;
          } catch (parseErr) {
            console.error('Could not parse error response as JSON:', parseErr);
            errorDetails = `HTTP Error: ${response.status} - ${response.statusText}`;
          }
        } else {
          try {
            const errorText = await response.text();
            console.error('Non-JSON response received:', errorText);
            errorDetails = `Server Error: ${response.status}. Check console for details.`;
          } catch (textErr) {
            console.error('Could not read error response text:', textErr);
            errorDetails = `Network Error: ${response.status}`;
          }
        }

        throw new Error(errorDetails);
      }

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const responseText = await response.text();
        console.error('Received non-JSON response:', responseText);
        throw new Error('Server returned unexpected response format. Please try again later.');
      }

      const data = await response.json();

      localStorage.setItem('conversationId', data.conversation_id);

      return {
        response: data.response,
        conversationId: data.conversation_id,
        toolCalls: data.tool_calls || []
      };
    } catch (err) {
      console.error('Error sending message:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to send message. Please try again.';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Handle sending a message
  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userId = getUserId();

    if (userId === 'unauthenticated') {
      setError('Please log in to use the chat feature');
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      role: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');

    try {
      const { response, toolCalls } = await sendMessageToBackend(inputValue, userId);

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

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response,
        role: 'assistant',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, ...newMessages, assistantMessage]);
    } catch (err) {
      console.error('Message sending failed:', err);
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
      content: 'Hello! I\'m your AI assistant for the Todo App. How can I help you manage your tasks today?',
      role: 'assistant',
      timestamp: new Date(),
    }]);
    localStorage.removeItem('conversationId');
  };

  // Toggle voice recognition
  const toggleVoiceRecognition = () => {
    if (!recognition) {
      alert('Speech recognition is not supported in your browser');
      return;
    }

    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      recognition.start();
      setIsListening(true);
    }
  };

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognitionInstance = new SpeechRecognition();
        recognitionInstance.continuous = false;
        recognitionInstance.interimResults = true;
        recognitionInstance.lang = 'en-US';

        recognitionInstance.onresult = (event) => {
          let finalTranscript = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              finalTranscript += transcript + ' ';
            }
          }

          setInputValue(finalTranscript);
        };

        recognitionInstance.onerror = (event) => {
          console.error('Speech recognition error', event.error);
          setIsListening(false);
        };

        recognitionInstance.onend = () => {
          setIsListening(false);
        };

        setRecognition(recognitionInstance);
      }
    }
  }, []);

  if (!isOpen) return null;

  // If minimized, show only a small header
  if (isMinimized) {
    return (
      <div
        style={{
          position: 'fixed',
          bottom: '96px',
          right: '24px',
          width: '200px',
          height: '40px',
          backgroundColor: '#000000',
          borderRadius: '20px',
          border: '1px solid #3c3c3c',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer'
        }}
        onClick={() => setIsMinimized(false)}
      >
        <span style={{ color: '#ffffff', fontSize: '14px' }}>Todo Assistant ▲</span>
      </div>
    );
  }

  return (
    <div style={{
      position: 'fixed',
      bottom: '100px',
      right: isOpen && !isMinimized ? '24px' : '-420px',
      width: '400px',
      height: '550px',
      maxHeight: 'calc(100vh - 120px)',
      backgroundColor: '#000000',
      borderRadius: '16px',
      border: '1px solid #3c3c3c',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      zIndex: 9999,
      transition: 'right 0.3s ease-in-out',
    }}>
      {/* HEADER SECTION */}
      <div style={{
        height: '60px',
        background: 'linear-gradient(135deg, #1a1a1a, #0f0f0f)', // Dark gradient background
        borderBottom: '1px solid #3c3c3c',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 20px',
        position: 'sticky',
        top: 0,
        zIndex: 10,
      }}>
        <h2 style={{
          color: '#ffffff',
          margin: 0,
          fontSize: '18px',
          fontWeight: '600',
          letterSpacing: '0.3px'
        }}>
          Todo Assistant
        </h2>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          {/* Delete/Trash button with SVG icon */}
          <button
            onClick={clearConversation}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#ffffff',
              cursor: 'pointer',
              padding: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '8px',
              transition: 'background 0.2s',
              opacity: 0.8
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#2a2a2a';
              e.currentTarget.style.opacity = '1';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.opacity = '0.8';
            }}
            title="Clear conversation"
          >
            <TrashIcon />
          </button>

          {/* Close button */}
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#ffffff',
              fontSize: '24px',
              cursor: 'pointer',
              padding: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              lineHeight: '1',
              borderRadius: '8px',
              transition: 'background 0.2s',
              opacity: 0.8
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#2a2a2a';
              e.currentTarget.style.opacity = '1';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.opacity = '0.8';
            }}
            title="Close chat"
          >
            ✕
          </button>
        </div>
      </div>

      {/* MESSAGES AREA */}
      <div
        ref={messageListRef}
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '20px',
          backgroundColor: '#000000',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {messages.map((msg) => {
          let messageStyle = {};
          if (msg.role === 'user') {
            messageStyle = {
              background: 'linear-gradient(135deg, #9333ea, #db2777)',
              color: '#fff',
              borderRadius: '18px',
              padding: '12px 16px',
              maxWidth: '75%',
              marginLeft: 'auto',
              marginRight: '5px',
              fontSize: '0.9rem'
            };
          } else if (msg.role === 'tool') {
            messageStyle = {
              backgroundColor: '#1a1a2e',
              border: '1px solid #2a2a2a',
              borderRadius: '8px',
              padding: '8px 12px',
              maxWidth: '85%',
              fontSize: '0.85rem',
              color: '#999'
            };
          } else {
            messageStyle = {
              backgroundColor: '#1a1a1a',
              color: '#fff',
              borderRadius: '18px',
              padding: '12px 16px',
              maxWidth: '75%',
              marginLeft: '5px',
              marginRight: 'auto',
              fontSize: '0.9rem'
            };
          }

          return (
            <div
              key={msg.id}
              style={{
                display: 'flex',
                justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                marginBottom: '12px',
                width: '100%'
              }}
            >
              <div style={messageStyle}>
                {msg.content}
                <div style={{
                  fontSize: '0.7rem',
                  opacity: 0.6,
                  marginTop: '4px',
                  textAlign: msg.role === 'user' ? 'right' : 'left'
                }}>
                  {formatTime(msg.timestamp)}
                </div>
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div style={{
            display: 'flex',
            justifyContent: 'flex-start',
            marginBottom: '12px'
          }}>
            <div style={{
              backgroundColor: '#1a1a1a',
              color: '#fff',
              borderRadius: '18px',
              padding: '12px 16px',
              maxWidth: '75%',
              marginLeft: '5px'
            }}>
              Thinking...
            </div>
          </div>
        )}
      </div>

      {/* INPUT AREA */}
      <div style={{
        padding: '16px 20px',
        borderTop: '1px solid #2a2a2a',
        backgroundColor: '#000000',
        display: 'flex',
        gap: '10px',
        alignItems: 'center'
      }}>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSendMessage();
            }
          }}
          placeholder="Type your message or speak..."
          style={{
            flex: 1,
            background: '#1a1a1a',
            border: '1px solid #2a2a2a',
            borderRadius: '10px',
            padding: '12px 16px',
            color: '#ffffff',
            fontSize: '14px',
            outline: 'none'
          }}
        />
        
        {/* Voice button with Microphone SVG icon */}
        <button
          onClick={toggleVoiceRecognition}
          style={{
            background: isListening ? 'linear-gradient(135deg, #7c3aed, #9333ea)' : '#1a1a1a',
            border: '1px solid #2a2a2a',
            borderRadius: '10px',
            width: '46px',
            height: '46px',
            color: '#ffffff',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            if (!isListening) e.currentTarget.style.background = '#2a2a2a';
          }}
          onMouseLeave={(e) => {
            if (!isListening) e.currentTarget.style.background = '#1a1a1a';
          }}
        >
          <MicrophoneIcon isActive={isListening} />
        </button>
        
        {/* Send button with arrow */}
        <button
          onClick={handleSendMessage}
          disabled={isLoading || !inputValue.trim()}
          style={{
            background: isLoading || !inputValue.trim()
              ? '#2a2a2a'
              : 'linear-gradient(135deg, #7c3aed 0%, #9333ea 100%)',
            border: 'none',
            borderRadius: '10px',
            width: '46px',
            height: '46px',
            color: '#ffffff',
            cursor: isLoading || !inputValue.trim() ? 'not-allowed' : 'pointer',
            fontSize: '18px',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: isLoading || !inputValue.trim() ? 0.5 : 1,
            transition: 'all 0.2s',
            boxShadow: isLoading || !inputValue.trim() ? 'none' : '0 2px 8px rgba(124, 58, 237, 0.3)'
          }}
        >
          ▲
        </button>
      </div>

      {error && (
        <div style={{
          backgroundColor: '#7c2d12',
          color: '#fed7aa',
          padding: '8px 16px',
          fontSize: '14px'
        }}>
          {error}
        </div>
      )}
    </div>
  );
};

export default ChatWidget;