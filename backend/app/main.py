"""
MHCQMS Backend - FastAPI Application
Main entry point for the API server
"""

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.openapi.utils import get_openapi

# Import models to ensure they are available for migrations
from app.models import User, Patient, Queue
from app.core.config import settings
from app.core.database import create_tables

# Import API routers
from app.api import auth_router, users_router, patients_router, queue_router

# Create FastAPI app instance
app = FastAPI(
    title="MHCQMS API",
    description="""
    # Master Health Checkup Queue Management System API
    
    ## Overview
    This API provides comprehensive management for health checkup queues, patient registration, and user authentication.
    
    ## Features
    - **Authentication**: JWT-based user authentication and authorization
    - **User Management**: Create, update, and manage user accounts
    - **Patient Management**: Register and manage patient information
    - **Queue Management**: Add patients to queue, track status, and manage priorities
    
    ## Authentication
    Most endpoints require authentication. Use the `/auth/login` endpoint to get a JWT token,
    then include it in the Authorization header as `Bearer <token>`.
    
    ## Rate Limiting
    API requests are limited to 100 requests per minute per user.
    
    ## Support
    For support or questions, please contact the development team.
    """,
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
    contact={
        "name": "MHCQMS Development Team",
        "email": "dev@mhcqms.com",
    },
    license_info={
        "name": "MIT",
        "url": "https://opensource.org/licenses/MIT",
    },
    servers=[
        {
            "url": "http://localhost:8000",
            "description": "Development server"
        },
        {
            "url": "https://api.mhcqms.com",
            "description": "Production server"
        }
    ]
)

@app.on_event("startup")
async def startup_event():
    """Create database tables on startup"""
    try:
        create_tables()
        print("✅ Database tables created successfully")
    except Exception as e:
        print(f"⚠️  Warning: Could not create database tables: {e}")

# Configure CORS with more permissive settings for development
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
)

# Include API routers
app.include_router(auth_router, prefix="/api/v1")
app.include_router(users_router, prefix="/api/v1")
app.include_router(patients_router, prefix="/api/v1")
app.include_router(queue_router, prefix="/api/v1")

# Custom OpenAPI schema
def custom_openapi():
    if app.openapi_schema:
        return app.openapi_schema
    
    openapi_schema = get_openapi(
        title=app.title,
        version=app.version,
        description=app.description,
        routes=app.routes,
    )
    
    # Add custom tags descriptions
    openapi_schema["tags"] = [
        {
            "name": "Authentication",
            "description": "User authentication and registration endpoints"
        },
        {
            "name": "Users",
            "description": "User management operations (create, read, update, delete)"
        },
        {
            "name": "Patients",
            "description": "Patient registration and management operations"
        },
        {
            "name": "Queue Management",
            "description": "Health checkup queue management and status tracking"
        }
    ]
    
    # Add security schemes
    openapi_schema["components"]["securitySchemes"] = {
        "BearerAuth": {
            "type": "http",
            "scheme": "bearer",
            "bearerFormat": "JWT",
            "description": "JWT token obtained from /auth/login endpoint"
        }
    }
    
    app.openapi_schema = openapi_schema
    return app.openapi_schema

app.openapi = custom_openapi

@app.get("/")
async def root():
    """Root endpoint with API information"""
    return JSONResponse(
        content={
            "message": "Welcome to MHCQMS API",
            "version": "1.0.0",
            "docs": "/docs",
            "redoc": "/redoc",
            "openapi": "/openapi.json",
            "endpoints": {
                "authentication": "/api/v1/auth",
                "users": "/api/v1/users",
                "patients": "/api/v1/patients",
                "queue": "/api/v1/queue"
            }
        }
    )

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return JSONResponse(
        content={
            "status": "healthy",
            "service": "MHCQMS Backend",
            "version": "1.0.0",
            "timestamp": "2024-01-01T10:00:00Z"
        }
    )

@app.get("/cors-test")
async def cors_test():
    """CORS test endpoint to verify CORS configuration"""
    return JSONResponse(
        content={
            "message": "CORS test successful",
            "cors_enabled": True,
            "allowed_origins": settings.allowed_origins_list,
            "environment": settings.environment,
            "timestamp": "2024-01-01T10:00:00Z"
        }
    )

@app.get("/api/v1")
async def api_info():
    """API information and available endpoints"""
    return JSONResponse(
        content={
            "api_name": "MHCQMS API",
            "version": "1.0.0",
            "description": "Master Health Checkup Queue Management System API",
            "endpoints": {
                "authentication": {
                    "base_url": "/api/v1/auth",
                    "endpoints": [
                        "POST /register - Register new user",
                        "POST /login - User login",
                        "GET /me - Get current user info"
                    ]
                },
                "users": {
                    "base_url": "/api/v1/users",
                    "endpoints": [
                        "GET / - Get all users",
                        "GET /{user_id} - Get user by ID",
                        "PUT /{user_id} - Update user",
                        "DELETE /{user_id} - Delete user"
                    ]
                },
                "patients": {
                    "base_url": "/api/v1/patients",
                    "endpoints": [
                        "POST / - Create new patient",
                        "GET / - Get all patients",
                        "GET /{patient_id} - Get patient by ID",
                        "PUT /{patient_id} - Update patient",
                        "DELETE /{patient_id} - Delete patient"
                    ]
                },
                "queue": {
                    "base_url": "/api/v1/queue",
                    "endpoints": [
                        "POST / - Add patient to queue",
                        "GET / - Get queue status",
                        "GET /{queue_id} - Get queue entry by ID",
                        "PUT /{queue_id} - Update queue entry",
                        "PATCH /{queue_id}/status - Update queue status",
                        "DELETE /{queue_id} - Remove from queue",
                        "GET /stats/summary - Get queue statistics"
                    ]
                }
            },
            "documentation": {
                "swagger_ui": "/docs",
                "redoc": "/redoc",
                "openapi_schema": "/openapi.json"
            }
        }
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
