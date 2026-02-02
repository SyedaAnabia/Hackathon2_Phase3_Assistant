from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os

# Load environment variables from .env file
from dotenv import load_dotenv
load_dotenv()

app = FastAPI(title="Test API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=os.getenv("ALLOWED_ORIGINS", "http://localhost:3000").split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Test API is running!"}

# Simple chat endpoint for testing
@app.post("/api/users/{user_id}/chat")
async def test_chat_endpoint(user_id: str):
    return {"response": f"Hello from test endpoint! User ID: {user_id}"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)