#!/usr/bin/env python3
"""Test script to check if there are import issues with the API modules"""

print("Testing imports...")

try:
    print("Importing FastAPI...")
    from fastapi import FastAPI
    print("+ FastAPI imported successfully")
except Exception as e:
    print(f"- Error importing FastAPI: {e}")

try:
    print("Importing main app...")
    from src.main import app
    print("+ Main app imported successfully")
except Exception as e:
    print(f"- Error importing main app: {e}")
    import traceback
    traceback.print_exc()

try:
    print("Importing chat router...")
    from src.api.chat import router as chat_router
    print("+ Chat router imported successfully")
except Exception as e:
    print(f"- Error importing chat router: {e}")
    import traceback
    traceback.print_exc()

try:
    print("Importing chatbot router...")
    from src.api.chatbot import router as chatbot_router
    print("+ Chatbot router imported successfully")
except Exception as e:
    print(f"- Error importing chatbot router: {e}")
    import traceback
    traceback.print_exc()

print("Import test completed.")