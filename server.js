const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 8000;

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// In-memory storage for conversations (in production, use a database)
const conversations = new Map();

// Helper function to generate AI responses
const generateAIResponse = (message) => {
  const lowerCaseMsg = message.toLowerCase();
  
  // Simple rule-based responses
  if (lowerCaseMsg.includes('hello') || lowerCaseMsg.includes('hi') || lowerCaseMsg.includes('hey')) {
    return "Hello! How can I help you?";
  }
  
  if (lowerCaseMsg.includes('todo') || lowerCaseMsg.includes('task')) {
    if (lowerCaseMsg.includes('add') || lowerCaseMsg.includes('create') || lowerCaseMsg.includes('new')) {
      return "Sure, I can help you add a task. What would you like to add?";
    }
    if (lowerCaseMsg.includes('complete') || lowerCaseMsg.includes('done') || lowerCaseMsg.includes('finish')) {
      return "Which task would you like to mark as complete?";
    }
    if (lowerCaseMsg.includes('list') || lowerCaseMsg.includes('show')) {
      return "Here are your tasks: Buy groceries, Finish report, Call mom";
    }
  }
  
  if (lowerCaseMsg.includes('help')) {
    return "I can help you manage your tasks. You can ask me to add, complete, or list your tasks.";
  }
  
  if (lowerCaseMsg.includes('thank')) {
    return "You're welcome! Is there anything else I can help you with?";
  }
  
  // Default response
  return `I received your message: "${message}". How can I assist you with your tasks?`;
};

// POST endpoint for chat
app.post('/api/chat/:conversationId', (req, res) => {
  try {
    const { conversationId } = req.params;
    const { message } = req.body;

    console.log(`Received message for conversation ${conversationId}: ${message}`);

    // Validate input
    if (!message) {
      return res.status(400).json({
        error: 'Message is required in request body'
      });
    }

    // Get or initialize conversation
    if (!conversations.has(conversationId)) {
      conversations.set(conversationId, {
        id: conversationId,
        createdAt: new Date(),
        messages: []
      });
    }

    const conversation = conversations.get(conversationId);

    // Add user message to conversation
    conversation.messages.push({
      role: 'user',
      content: message,
      timestamp: new Date()
    });

    // Generate AI response
    const response = generateAIResponse(message);

    // Add AI response to conversation
    conversation.messages.push({
      role: 'assistant',
      content: response,
      timestamp: new Date()
    });

    // Return response
    res.json({
      response: response,
      conversation_id: conversationId,
      tool_calls: [] // Empty array as the frontend expects this field
    });

  } catch (error) {
    console.error('Error processing chat request:', error);
    res.status(500).json({
      error: 'Internal server error'
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date() });
});

// Catch-all handler for undefined routes
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: `Cannot ${req.method} ${req.originalUrl}` 
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ 
    error: 'Internal server error' 
  });
});

app.listen(PORT, 'localhost', () => {
  console.log(`Chat API server is running on http://localhost:${PORT}`);
  console.log(`Endpoint: POST /api/chat/:conversationId`);
  console.log(`CORS enabled for: http://localhost:3000`);
});