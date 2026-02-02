#!/usr/bin/env python3
"""
Main entry point for the Todo MCP Server.
This server implements the Model Context Protocol to allow AI assistants
to interact with the todo management system.
"""

import asyncio
import logging
import os
import sys
from mcp.server import Server
from .server import todo_mcp_server

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


async def serve():
    """Start the MCP server."""
    logger.info("Starting Todo MCP Server...")
    
    # Run the server
    async with todo_mcp_server:
        logger.info("Todo MCP Server is running...")
        await todo_mcp_server.run()


def main():
    """Main entry point."""
    try:
        asyncio.run(serve())
    except KeyboardInterrupt:
        logger.info("Server stopped by user")
        sys.exit(0)
    except Exception as e:
        logger.error(f"Server error: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()