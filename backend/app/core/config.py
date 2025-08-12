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
    debug: bool = False
    environment: str = "development"
    
    # Server
    host: str = "0.0.0.0"
    port: int = 8000
    
    # Database
    database_url: str
    
    # JWT
    jwt_secret_key: str
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = 30
    
    # CORS - Use simple string parsing
    allowed_origins: str = "http://localhost:3000,http://localhost:5173"
    
    class Config:
        env_file = ".env"
        case_sensitive = False

    @property
    def allowed_origins_list(self) -> List[str]:
        """Convert allowed_origins string to list"""
        return [origin.strip() for origin in self.allowed_origins.split(",")]

# Create settings instance
settings = Settings()

# Validate required settings
if not settings.database_url:
    raise ValueError("DATABASE_URL environment variable is required")

if not settings.jwt_secret_key:
    raise ValueError("JWT_SECRET_KEY environment variable is required")
