"""
Simple test script to verify the chatbot API endpoint works correctly.
"""
import os
import sys
import asyncio
import httpx
from uuid import uuid4

# Add the src directory to the path so we can import modules
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'src'))

# Mock data for testing
MOCK_USER_ID = str(uuid4())
MOCK_JWT_TOKEN = "mock_jwt_token_for_testing"

async def test_chatbot_api():
    """
    Test the chatbot API endpoint to ensure it works correctly.
    """
    base_url = "http://localhost:8000"
    
    # Sample chat messages
    sample_messages = [
        {
            "role": "user",
            "content": "Hello, can you help me with my tasks?"
        }
    ]
    
    # Sample user context with mock todos
    user_context = {
        "todos": [
            {
                "id": str(uuid4()),
                "title": "Sample task",
                "description": "This is a sample task for testing",
                "is_completed": False,
                "user_id": MOCK_USER_ID,
                "created_at": "2023-01-01T00:00:00",
                "updated_at": "2023-01-01T00:00:00"
            }
        ]
    }
    
    # Headers with mock JWT token
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {MOCK_JWT_TOKEN}"
    }
    
    # Request payload
    payload = {
        "messages": sample_messages,
        "user_context": user_context
    }
    
    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(
                f"{base_url}/api/chat",
                json=payload,
                headers=headers
            )
            
            print(f"Status Code: {response.status_code}")
            print(f"Response: {response.text}")
            
            if response.status_code == 200:
                print("\n✅ Chatbot API test passed!")
                data = response.json()
                print(f"Response: {data.get('response', 'No response field')}")
                print(f"Suggestions: {data.get('suggestions', [])}")
            else:
                print(f"\n❌ Chatbot API test failed with status {response.status_code}")
                
    except Exception as e:
        print(f"\n❌ Error during API test: {str(e)}")
        print("Make sure the backend server is running on http://localhost:8000")


if __name__ == "__main__":
    print("Testing Chatbot API Endpoint...")
    asyncio.run(test_chatbot_api())