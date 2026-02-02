# Todo Backend API

This is the backend API for the Todo application.

## Setup

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Run the application:
```bash
uvicorn src.main:app --reload --port 8000
```

## MCP (Model Context Protocol) Support

This application includes support for MCP (Model Context Protocol) which allows AI assistants to interact with the todo management system.
The MCP dependencies are in a separate requirements file due to potential conflicts with other dependencies:

```bash
pip install -r requirements-mcp.txt
```

Note: You may want to install MCP dependencies in a separate virtual environment to avoid conflicts.