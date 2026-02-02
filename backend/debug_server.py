import sys
import traceback
from src.main import app
import uvicorn

def custom_exception_handler(request, exc_info):
    print("Unhandled exception:")
    print(''.join(traceback.format_exception(*exc_info)))

if __name__ == "__main__":
    # Enable detailed error reporting
    import logging
    logging.basicConfig(level=logging.DEBUG)
    
    print("Starting server...")
    try:
        uvicorn.run(app, host='0.0.0.0', port=8000, log_level="debug")
    except Exception as e:
        print(f"Error starting server: {e}")
        traceback.print_exc()