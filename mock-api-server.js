const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 8000;

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'], // Adjust if needed
  credentials: true
}));
app.use(express.json());

// In-memory storage for conversations (in production, use a database)
const conversations = new Map();

// Helper function to simulate AI response
const generateAIResponse = (userMessage, conversationHistory) => {
  const lowerCaseMsg = userMessage.toLowerCase();

  // Simple rule-based responses
  if (lowerCaseMsg.includes('hello') || lowerCaseMsg.includes('hi') || lowerCaseMsg.includes('hey')) {
    return "Hello there! How can I help you with your tasks today?";
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
  return "I understand you're saying: '" + userMessage + "'. How can I assist you with your tasks?";
};

// POST endpoint for chat
app.post('/api/chat/:userId', (req, res) => {
  try {
    const { userId } = req.params;
    const { message, conversation_id } = req.body;

    // Validate input
    if (!message) {
      return res.status(400).json({
        error: 'Message is required in request body'
      });
    }

    // Generate a conversation ID if not provided
    const convId = conversation_id || `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Get or initialize conversation
    if (!conversations.has(convId)) {
      conversations.set(convId, {
        userId,
        createdAt: new Date(),
        messages: []
      });
    }

    const conversation = conversations.get(convId);

    // Add user message to conversation
    conversation.messages.push({
      role: 'user',
      content: message,
      timestamp: new Date()
    });

    // Generate AI response
    const aiResponse = generateAIResponse(message, conversation.messages);

    // Add AI response to conversation
    conversation.messages.push({
      role: 'assistant',
      content: aiResponse,
      timestamp: new Date()
    });

    // Simulate tool calls based on message content
    const toolCalls = [];
    if (message.toLowerCase().includes('add') && message.toLowerCase().includes('task')) {
      toolCalls.push({
        name: 'add_task',
        arguments: { title: message.replace(/add task/i, '').trim() },
        result: { success: true, taskId: Math.floor(Math.random() * 1000) }
      });
    }

    // Return response
    res.json({
      response: aiResponse,
      conversation_id: convId,
      tool_calls: toolCalls
    });

  } catch (error) {
    console.error('Error processing chat request:', error);
    res.status(500).json({
      error: 'Internal server error'
    });
  }
});

// GET endpoint to retrieve conversation history (optional)
app.get('/api/conversation/:conversationId', (req, res) => {
  try {
    const { conversationId } = req.params;

    if (!conversations.has(conversationId)) {
      return res.status(404).json({
        error: 'Conversation not found'
      });
    }

    const conversation = conversations.get(conversationId);
    res.json({
      conversation_id: conversationId,
      messages: conversation.messages
    });
  } catch (error) {
    console.error('Error retrieving conversation:', error);
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
app.use((req, res) => {
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
  console.log(`Mock API server is running on http://localhost:${PORT}`);
  console.log(`Endpoints:`);
  console.log(`  POST /api/chat/:userId`);
  console.log(`  GET  /api/conversation/:conversationId`);
  console.log(`  GET  /health`);
});