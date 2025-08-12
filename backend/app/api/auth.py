"""
Authentication API endpoints
"""

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.user import UserLogin, Token, UserCreate, UserResponse, LoginResponse
from app.models.user import User
from app.services.auth import AuthService
from app.services.user import UserService

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"],
    responses={
        404: {"description": "Not found"},
        401: {"description": "Unauthorized"},
        422: {"description": "Validation error"}
    }
)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")


@router.post("/register", 
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Register a new user",
    description="Create a new user account with username, email, password, and full name",
    responses={
        201: {
            "description": "User created successfully",
            "content": {
                "application/json": {
                    "example": {
                        "id": 1,
                        "username": "john_doe",
                        "email": "john@example.com",
                        "full_name": "John Doe",
                        "is_active": True,
                        "is_superuser": False,
                        "created_at": "2024-01-01T10:00:00Z",
                        "updated_at": None
                    }
                }
            }
        },
        400: {"description": "Username or email already exists"},
        422: {"description": "Validation error"}
    }
)
async def register(user_data: UserCreate, db: Session = Depends(get_db)):
    """
    Register a new user account.
    
    - **username**: Unique username (3-50 characters)
    - **email**: Valid email address
    - **password**: Password (minimum 8 characters)
    - **full_name**: User's full name (2-100 characters)
    """
    try:
        user_service = UserService(db)
        user = user_service.create_user(user_data)
        return user
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )


@router.post("/login",
    response_model=LoginResponse,
    summary="User login",
    description="Authenticate user and return JWT access token with user information",
    responses={
        200: {
            "description": "Login successful",
            "content": {
                "application/json": {
                    "example": {
                        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                        "token_type": "bearer",
                        "expires_in": 3600,
                        "user": {
                            "id": 1,
                            "username": "admin",
                            "email": "admin@mhcqms.com",
                            "full_name": "Administrator",
                            "is_active": True,
                            "is_superuser": True,
                            "created_at": "2024-01-01T10:00:00Z",
                            "updated_at": None
                        }
                    }
                }
            }
        },
        401: {"description": "Invalid credentials"}
    }
)
async def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    """
    Authenticate user and return JWT access token with user information.
    
    - **username**: User's username
    - **password**: User's password
    """
    auth_service = AuthService(db)
    user = auth_service.authenticate_user(form_data.username, form_data.password)
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token = auth_service.create_access_token(data={"sub": user.username})
    
    # Convert user model to response schema
    user_response = UserResponse(
        id=user.id,
        username=user.username,
        email=user.email,
        full_name=user.full_name,
        is_active=user.is_active,
        is_superuser=user.is_superuser,
        created_at=user.created_at,
        updated_at=user.updated_at
    )
    
    return LoginResponse(
        token=access_token,
        token_type="bearer",
        expires_in=3600,
        user=user_response
    )


@router.get("/me",
    response_model=UserResponse,
    summary="Get current user info",
    description="Retrieve information about the currently authenticated user",
    responses={
        200: {
            "description": "Current user information",
            "content": {
                "application/json": {
                    "example": {
                        "id": 1,
                        "username": "john_doe",
                        "email": "john@example.com",
                        "full_name": "John Doe",
                        "is_active": True,
                        "is_superuser": False,
                        "created_at": "2024-01-01T10:00:00Z",
                        "updated_at": None
                    }
                }
            }
        },
        401: {"description": "Not authenticated"}
    }
)
async def get_current_user(
    current_user: User = Depends(AuthService.get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get information about the currently authenticated user.
    
    Requires valid JWT token in Authorization header.
    """
    return current_user
