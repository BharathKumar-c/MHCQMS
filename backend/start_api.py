#!/usr/bin/env python3
"""
Startup script for MHCQMS API
This script starts the FastAPI server with proper configuration
"""

import uvicorn
import os
from pathlib import Path

def main():
    """Start the MHCQMS API server"""
    
    # Get the directory of this script
    script_dir = Path(__file__).parent.absolute()
    
    # Change to the script directory
    os.chdir(script_dir)
    
    print("🚀 Starting MHCQMS API Server...")
    print("=" * 50)
    print(f"📁 Working directory: {script_dir}")
    print(f"🌐 Server will be available at: http://localhost:8000")
    print(f"📚 Swagger UI: http://localhost:8000/docs")
    print(f"📖 ReDoc: http://localhost:8000/redoc")
    print(f"🔧 OpenAPI Schema: http://localhost:8000/openapi.json")
    print("=" * 50)
    print("Press Ctrl+C to stop the server")
    print()
    
    # Start the server
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )

if __name__ == "__main__":
    main()
