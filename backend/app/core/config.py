"""
Configuration settings for MHCQMS Backend
Uses Pydantic Settings for environment variable management
"""

from pydantic_settings import BaseSettings
from typing import List
import os

class Settings(BaseSettings):
    """Application settings"""
    
    # Application
    app_name: str = "MHCQMS Backend"
    debug: bool = True  # Default to True for development
    environment: str = "development"
    
    # Server
    host: str = "0.0.0.0"
    port: int = 8000
    
    # Database - Default to SQLite for development
    database_url: str = "sqlite:///./test.db"
    
    # JWT - Default key for development (change in production!)
    jwt_secret_key: str = "your-super-secret-jwt-key-change-this-in-production"
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = 30
    
    # CORS - Allow multiple frontend ports for development and production
    allowed_origins: str = "http://localhost:3000,http://localhost:5173,http://localhost:4173,http://127.0.0.1:5173,http://127.0.0.1:4173,http://localhost:8080,https://*.onrender.com"
    
    class Config:
        env_file = ".env"
        case_sensitive = False

    @property
    def allowed_origins_list(self) -> List[str]:
        """Convert allowed_origins string to list"""
        origins = [origin.strip() for origin in self.allowed_origins.split(",")]
        
        # Add additional development origins
        if self.environment == "development":
            origins.extend([
                "http://localhost:*",
                "http://127.0.0.1:*",
                "http://0.0.0.0:*"
            ])
        
        # Add production origins for Render deployment
        if self.environment == "production":
            origins.extend([
                "https://*.onrender.com",
                "https://mhcqms-frontend.onrender.com"
            ])
        
        return origins

# Create settings instance
settings = Settings()

# Only validate in production
if settings.environment == "production":
    if not settings.database_url or settings.database_url == "sqlite:///./test.db":
        raise ValueError("DATABASE_URL environment variable is required in production")
    
    if not settings.jwt_secret_key or settings.jwt_secret_key == "your-super-secret-jwt-key-change-this-in-production":
        raise ValueError("JWT_SECRET_KEY environment variable is required in production")
