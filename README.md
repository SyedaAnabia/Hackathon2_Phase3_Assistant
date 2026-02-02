# Todo Full-Stack Web Application

This is a secure, multi-user Todo web application built with Next.js frontend and FastAPI backend. The application enforces strict user-based data isolation through JWT authentication with Better Auth, ensuring users can only access their own todo items.

## Features

- User registration and authentication
- Secure JWT-based authentication
- Create, read, update, and delete todo items
- Mark todos as complete/incomplete
- Strict user data isolation
- Responsive web interface
- AI-powered chatbot assistant for task management

## Tech Stack

- **Frontend**: Next.js 16+ with App Router
- **Backend**: Python FastAPI
- **ORM**: SQLModel
- **Database**: Neon Serverless PostgreSQL
- **Authentication**: Better Auth with JWT

## Getting Started

### Prerequisites

- Node.js 18+
- Python 3.11+
- PostgreSQL (or access to Neon Serverless PostgreSQL)

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Set up environment variables by creating a `.env` file:
   ```
   DATABASE_URL=postgresql://user:password@localhost/todo_db
   BETTER_AUTH_SECRET=your-super-secret-jwt-key-change-in-production
   ```

5. Run the backend server:
   ```bash
   uvicorn src.main:app --reload --port 8000
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables by creating a `.env.local` file:
   ```
   NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api
   ```

4. Run the frontend development server:
   ```bash
   npm run dev
   ```

The frontend will be available at `http://localhost:3000`.

## Deployment to GitHub Pages

To deploy the application to GitHub Pages:

1. **Navigate to the frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Build the application**:
   ```bash
   npm run build
   ```

4. **Export for static hosting**:
   ```bash
   npm run export
   ```

5. **Deploy the `out` directory** to GitHub Pages

The application is configured to work with the base path `/Hackthon2-phase2` for GitHub Pages deployment.

**Note**: The main application is in the `frontend` directory. The root `app` directory is a duplicate and should not be used for deployment.

## API Documentation

API documentation is available at `http://localhost:8000/docs` when the backend is running.

## Security Features

- JWT-based authentication
- User data isolation at the database query level
- Password hashing using bcrypt
- Input validation and sanitization
- Protection against common vulnerabilities

## Architecture

The application follows a clean architecture with clear separation of concerns:

- **Models**: Define data structures using SQLModel
- **Services**: Contain business logic
- **API**: Handle HTTP requests and responses
- **Database**: Manage database connections and sessions

## AI Chatbot Integration

The application includes an AI-powered chatbot assistant that helps users manage their tasks. Key features include:

- **Gemini API Integration**: Uses Google's Gemini model for natural language processing
- **Context Awareness**: The bot understands user's current tasks and provides relevant suggestions
- **Task Management**: Helps users add, update, and manage their todo items
- **Smart Suggestions**: Provides contextual suggestions based on user's tasks and conversation history

### Setting up the AI Chatbot

1. **Get a Gemini API Key**:
   - Visit [Google AI Studio](https://aistudio.google.com/) to get your API key
   - Save the API key in your `.env` file as `GEMINI_API_KEY=your_api_key_here`

2. **Backend Configuration**:
   - The chatbot endpoint is available at `/api/chat`
   - Authentication is required (JWT token must be provided in Authorization header)

3. **Frontend Component**:
   - The chatbot appears as a floating button on the Todo page
   - Click the button to open the chat interface
   - The chatbot receives context about the user's current tasks

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.