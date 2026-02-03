# Todo Assistant - Frontend

This is the frontend for the Todo Assistant application. It connects to a backend API to handle chat functionality.

## Setup Instructions

1. Install dependencies:
```bash
npm install
```

2. Create a `.env.local` file in the `frontend` directory with the following content:
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
NEXT_PUBLIC_USE_MOCK_AUTH=true
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_OPENAI_API_KEY=
```

3. To run the application with the mock API server:
   - Terminal 1: Start the mock API server
   ```bash
   npm run mock-server
   ```
   
   - Terminal 2: Start the Next.js development server
   ```bash
   npm run dev
   ```

## Troubleshooting

If you encounter the error `ERR_CONNECTION_REFUSED` when trying to connect to the API:
- Make sure the mock API server is running on port 8000
- Check that the environment variables are properly set in `.env.local`
- The chat API has been updated to provide mock responses when the real API is not available

## Files Updated

- `frontend/src/lib/chatApi.ts` - Updated to handle network errors gracefully and provide mock responses
- `mock-api-server.js` - A mock API server implementation
- `package.json` - Added script to run the mock server
- `.env.local` - Configuration to use the mock server