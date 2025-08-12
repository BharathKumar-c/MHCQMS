"""
Users API endpoints
"""

from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.core.database import get_db
from app.schemas.user import UserCreate, UserUpdate, UserResponse
from app.models.user import User
from app.services.user import UserService
from app.services.auth import AuthService

router = APIRouter(
    prefix="/users",
    tags=["Users"],
    responses={
        404: {"description": "User not found"},
        401: {"description": "Unauthorized"},
        403: {"description": "Forbidden - Requires superuser privileges"},
        422: {"description": "Validation error"}
    }
)


@router.get("/",
    response_model=List[UserResponse],
    summary="Get all users",
    description="Retrieve a list of all users (requires superuser privileges)",
    responses={
        200: {
            "description": "List of users retrieved successfully",
            "content": {
                "application/json": {
                    "example": [
                        {
                            "id": 1,
                            "username": "admin",
                            "email": "admin@example.com",
                            "full_name": "Administrator",
                            "is_active": True,
                            "is_superuser": True,
                            "created_at": "2024-01-01T10:00:00Z",
                            "updated_at": None
                        }
                    ]
                }
            }
        }
    }
)
async def get_users(
    skip: int = Query(0, ge=0, description="Number of users to skip"),
    limit: int = Query(100, ge=1, le=1000, description="Maximum number of users to return"),
    current_user: User = Depends(AuthService.get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get a list of all users.
    
    - **skip**: Number of users to skip (for pagination)
    - **limit**: Maximum number of users to return (max 1000)
    - **Requires**: Superuser privileges
    """
    if not current_user.is_superuser:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough privileges"
        )
    
    user_service = UserService(db)
    users = user_service.get_users(skip=skip, limit=limit)
    return users


@router.get("/{user_id}",
    response_model=UserResponse,
    summary="Get user by ID",
    description="Retrieve a specific user by their ID",
    responses={
        200: {
            "description": "User found successfully",
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
        404: {"description": "User not found"}
    }
)
async def get_user(
    user_id: int,
    current_user: User = Depends(AuthService.get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get a specific user by ID.
    
    - **user_id**: The ID of the user to retrieve
    - **Requires**: Authentication (users can only view their own profile unless superuser)
    """
    if current_user.id != user_id and not current_user.is_superuser:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough privileges"
        )
    
    user_service = UserService(db)
    user = user_service.get_user(user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    return user


@router.put("/{user_id}",
    response_model=UserResponse,
    summary="Update user",
    description="Update user information (users can only update their own profile unless superuser)",
    responses={
        200: {
            "description": "User updated successfully",
            "content": {
                "application/json": {
                    "example": {
                        "id": 1,
                        "username": "john_doe",
                        "email": "john.updated@example.com",
                        "full_name": "John Doe Updated",
                        "is_active": True,
                        "is_superuser": False,
                        "created_at": "2024-01-01T10:00:00Z",
                        "updated_at": "2024-01-01T11:00:00Z"
                    }
                }
            }
        },
        404: {"description": "User not found"},
        403: {"description": "Not enough privileges"}
    }
)
async def update_user(
    user_id: int,
    user_update: UserUpdate,
    current_user: User = Depends(AuthService.get_current_user),
    db: Session = Depends(get_db)
):
    """
    Update user information.
    
    - **user_id**: The ID of the user to update
    - **user_update**: Updated user data
    - **Requires**: Authentication (users can only update their own profile unless superuser)
    """
    if current_user.id != user_id and not current_user.is_superuser:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough privileges"
        )
    
    user_service = UserService(db)
    user = user_service.update_user(user_id, user_update)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    return user


@router.delete("/{user_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete user",
    description="Delete a user account (requires superuser privileges)",
    responses={
        204: {"description": "User deleted successfully"},
        404: {"description": "User not found"},
        403: {"description": "Not enough privileges"}
    }
)
async def delete_user(
    user_id: int,
    current_user: User = Depends(AuthService.get_current_user),
    db: Session = Depends(get_db)
):
    """
    Delete a user account.
    
    - **user_id**: The ID of the user to delete
    - **Requires**: Superuser privileges
    """
    if not current_user.is_superuser:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough privileges"
        )
    
    user_service = UserService(db)
    success = user_service.delete_user(user_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    return {"message": "User deleted successfully"}
