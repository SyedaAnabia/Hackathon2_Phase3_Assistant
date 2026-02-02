import os
import google.generativeai as genai
from typing import List, Dict, Any
from pydantic import BaseModel
from google.generativeai.types import GenerationConfig


class ChatMessage(BaseModel):
    role: str  # "user" or "assistant"
    content: str


class ChatResponse(BaseModel):
    response: str
    suggestions: List[str] = []


class ChatbotService:
    def __init__(self):
        # Initialize the Gemini API with the API key
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            raise ValueError("GEMINI_API_KEY environment variable is not set")

        genai.configure(api_key=api_key)

        # Set up the model
        generation_config = {
            "temperature": 0.7,
            "top_p": 0.95,
            "top_k": 64,
            "max_output_tokens": 8192,
        }

        self.model = genai.GenerativeModel(
            model_name="gemini-pro",
            generation_config=generation_config,
        )

    def generate_response(self,
                         messages: List[ChatMessage],
                         user_context: Dict[str, Any] = {}) -> Dict[str, Any]:
        """
        Generate a response from the Gemini model based on the conversation history
        and user context (like their todos).
        """
        try:
            # Format the conversation history for the model
            formatted_history = []
            for msg in messages:
                formatted_history.append({
                    "role": "model" if msg.role == "assistant" else "user",
                    "parts": [msg.content]
                })

            # Create a prompt that includes user context
            context_info = ""
            if "todos" in user_context:
                todos = user_context["todos"]
                if todos:
                    context_info += "\nHere are the user's current tasks:\n"
                    for i, todo in enumerate(todos):
                        status = "✓ Completed" if todo.is_completed else "○ Pending"
                        context_info += f"- [{status}] {todo.title}"
                        if todo.description:
                            context_info += f": {todo.description}"
                        context_info += f" (ID: {todo.id})\n"

            # Create the prompt with context
            if context_info:
                system_prompt = f"""You are an AI assistant for a Todo application.
                You can help users manage their tasks.
                {context_info}

                Respond to the user's request appropriately, using their task information when relevant.
                If the user wants to add, update, or delete tasks, guide them on how to do it through the app.
                If they ask about specific tasks, refer to the ones listed above.
                Keep your responses helpful and concise."""
            else:
                system_prompt = """You are an AI assistant for a Todo application.
                You can help users manage their tasks.
                Respond to the user's request appropriately.
                Keep your responses helpful and concise."""

            # Start the chat with history
            chat = self.model.start_chat(history=formatted_history[:-1])  # Exclude the last message since we'll send it separately

            # Send the latest message and get response
            last_user_message = messages[-1].content if messages else "Hello"
            response = chat.send_message(last_user_message)

            # Generate suggestions based on the conversation
            suggestions = self._generate_suggestions(messages, user_context)

            return {
                "response": response.text,
                "suggestions": suggestions
            }
        except Exception as e:
            # Return a helpful error message
            return {
                "response": f"Sorry, I encountered an issue processing your request: {str(e)}",
                "suggestions": ["Try rephrasing your request", "Ask about your tasks", "Get help with the app"]
            }

    def _generate_suggestions(self, messages: List[ChatMessage], user_context: Dict[str, Any]) -> List[str]:
        """
        Generate contextual suggestions based on the conversation and user's tasks.
        """
        suggestions = []

        # If user has todos, suggest relevant actions
        if "todos" in user_context and user_context["todos"]:
            incomplete_todos = [t for t in user_context["todos"] if not t.is_completed]
            if incomplete_todos:
                suggestions.extend([
                    "Review your pending tasks",
                    "Mark a task as complete",
                    "Set priority for tasks"
                ])
            else:
                suggestions.extend([
                    "Add a new task",
                    "Review completed tasks",
                    "Plan your next tasks"
                ])
        else:
            suggestions.extend([
                "Add your first task",
                "Learn how to use the app",
                "Organize your tasks"
            ])

        # Add general suggestions
        suggestions.extend([
            "Get tips on productivity",
            "Ask for help with the app"
        ])

        # Limit to 4 suggestions
        return suggestions[:4]


# Global instance of the chatbot service
chatbot_service = ChatbotService()