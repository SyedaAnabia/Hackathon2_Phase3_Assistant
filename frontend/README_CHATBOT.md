# AI Chatbot Setup Guide

This document provides instructions for setting up and running the AI Chatbot feature in the Todo application.

## 1. AI Chatbot Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- Python (v3.9 or higher)
- PostgreSQL (for database storage)
- Google Gemini API Key (get yours from [Google AI Studio](https://aistudio.google.com/))

### Backend Setup Steps
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```
   
   If requirements.txt doesn't exist, install the required packages:
   ```bash
   pip install fastapi uvicorn sqlmodel python-multipart python-jose[cryptography] passlib[bcrypt] google-generativeai python-dotenv
   ```

3. Set up the database:
   ```bash
   # Create the database tables
   python -c "from backend.src.database.init_db import init_db; init_db()"
   ```

### Frontend Setup Steps
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install JavaScript dependencies:
   ```bash
   npm install
   ```

3. Install the chatbot-specific packages (already done in previous steps):
   ```bash
   npm install @chatscope/chat-ui-kit-react @chatscope/chat-ui-kit-styles
   ```

### Environment Variables Configuration
Create a `.env` file in the root directory with the following variables:

```env
# Database Configuration
DATABASE_URL='postgresql://username:password@localhost/dbname'

# Gemini API Key
GEMINI_API_KEY='your_gemini_api_key_here'

# Authentication Secret
BETTER_AUTH_SECRET='your-super-secret-jwt-key-change-in-production'
```

Make sure to add `.env` to your `.gitignore` file to keep your API keys secure.

## 2. How to Run

### Start the Backend Server
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Start the FastAPI server:
   ```bash
   uvicorn src.main:app --reload
   ```
   
   The backend server will be available at `http://localhost:8000`

### Start the Frontend Development Server
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Start the Next.js development server:
   ```bash
   npm run dev
   ```
   
   The frontend will be available at `http://localhost:3000`

### Access the Application URLs
- Frontend: [http://localhost:3000](http://localhost:3000)
- Backend API: [http://localhost:8000](http://localhost:8000)
- API Documentation: [http://localhost:8000/docs](http://localhost:8000/docs)
- Chatbot Interface: [http://localhost:3000/chatbot](http://localhost:3000/chatbot)

## 3. Testing the Chatbot

### How to Navigate to the Chatbot Page
1. Sign in to the application
2. Click on the "AI Chat" link in the navigation bar
3. The chatbot interface will appear with a welcome message

### Example Commands to Try
Once the chatbot is running, you can try the following commands:

- **"Add a task to buy groceries"** - Creates a new task titled "buy groceries"
- **"Show me all my tasks"** - Lists all your tasks regardless of status
- **"Show me pending tasks"** - Lists only tasks that are not yet completed
- **"Show me completed tasks"** - Lists only tasks that are marked as completed
- **"Mark task as complete"** - Prompts for the specific task ID to mark as complete
- **"Complete task 1"** - Marks the task with ID 1 as complete
- **"Delete a task"** - Prompts for the specific task ID to delete
- **"Delete task 1"** - Deletes the task with ID 1
- **"Update my first task to 'Buy milk'"** - Updates the title of the first task to "Buy milk"

### Expected Behavior
- The chatbot will respond to your commands by interacting with your todo list
- When using MCP tools (like adding, listing, completing, or deleting tasks), you'll see a subtle indication of the tool call in the conversation
- The conversation maintains context and continuity across messages

## 4. Troubleshooting

### Common Issues and Solutions

#### API Key Configuration
- **Issue**: "Invalid Gemini API key" error
- **Solution**: Verify your Gemini API key in the `.env` file and ensure there are no extra spaces or characters

#### Database Connection Errors
- **Issue**: "Could not connect to database" error
- **Solution**: 
  1. Verify your PostgreSQL server is running
  2. Check that the DATABASE_URL in your `.env` file is correct
  3. Ensure the database exists and the credentials are accurate

#### CORS Issues
- **Issue**: "CORS policy: Request blocked" errors
- **Solution**: Check that the backend is configured to allow requests from your frontend origin (usually `http://localhost:3000`)

#### Port Already in Use
- **Issue**: "Port already in use" error
- **Solution**: Kill the process using the port or change the port number:
  ```bash
  # For Windows
  netstat -ano | findstr :8000
  taskkill /PID <PID> /F
  
  # For Unix/Linux/Mac
  lsof -ti:8000 | xargs kill
  ```

#### Package Installation Issues
- **Issue**: npm install fails with dependency conflicts
- **Solution**: Clear the cache and reinstall:
  ```bash
  rm -rf node_modules package-lock.json
  npm install
  ```

### Additional Debugging Tips
- Check the browser console for JavaScript errors
- Check the terminal where you ran `uvicorn` for backend errors
- Verify that all environment variables are properly set
- Ensure your Google AI Studio account has sufficient quota

## 5. Architecture Overview

### Tech Stack
- **Frontend**: Next.js 14 with TypeScript and Tailwind CSS
- **UI Components**: @chatscope/chat-ui-kit-react for chat interface
- **Backend**: FastAPI with Python
- **Database**: PostgreSQL with SQLModel ORM
- **Authentication**: JWT-based authentication
- **AI Integration**: Google Gemini API with Gemini Pro model
- **MCP Tools**: Custom tools for interacting with the todo system

### How the Chatbot Works with MCP Tools
The chatbot leverages Model Context Protocol (MCP) tools to interact with your todo list:

1. **Natural Language Processing**: When you type a command, the Google Gemini model processes your request
2. **Tool Selection**: The model determines if an MCP tool is needed (like adding or listing tasks)
3. **Function Calling**: The model calls the appropriate function with parameters
4. **Action Execution**: The backend executes the requested action (creating, updating, or deleting tasks)
5. **Response Generation**: The model generates a natural language response based on the action results
6. **Display**: The frontend displays both the tool call and the model's response in the chat interface

This architecture allows the AI to perform complex actions on your behalf while maintaining a natural conversation flow. The tool calls are displayed subtly in the chat to show what actions were taken.