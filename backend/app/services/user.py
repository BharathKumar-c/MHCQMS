"""
User service for user management operations
"""

from sqlalchemy.orm import Session
from typing import List, Optional
from app.models.user import User
from app.schemas.user import UserCreate, UserUpdate
from app.services.auth import AuthService

class UserService:
    def __init__(self, db: Session):
        self.db = db
        self.auth_service = AuthService(db)

    def create_user(self, user_data: UserCreate) -> User:
        """Create a new user"""
        # Check if username already exists
        existing_user = self.db.query(User).filter(User.username == user_data.username).first()
        if existing_user:
            raise ValueError("Username already registered")
        
        # Check if email already exists
        existing_email = self.db.query(User).filter(User.email == user_data.email).first()
        if existing_email:
            raise ValueError("Email already registered")
        
        # Hash the password
        hashed_password = self.auth_service.get_password_hash(user_data.password)
        
        # Create user object
        db_user = User(
            username=user_data.username,
            email=user_data.email,
            hashed_password=hashed_password,
            full_name=user_data.full_name,
            is_active=user_data.is_active,
            is_superuser=user_data.is_superuser
        )
        
        self.db.add(db_user)
        self.db.commit()
        self.db.refresh(db_user)
        return db_user

    def get_user(self, user_id: int) -> Optional[User]:
        """Get a user by ID"""
        return self.db.query(User).filter(User.id == user_id).first()

    def get_user_by_username(self, username: str) -> Optional[User]:
        """Get a user by username"""
        return self.db.query(User).filter(User.username == username).first()

    def get_user_by_email(self, email: str) -> Optional[User]:
        """Get a user by email"""
        return self.db.query(User).filter(User.email == email).first()

    def get_users(self, skip: int = 0, limit: int = 100) -> List[User]:
        """Get a list of users with pagination"""
        return self.db.query(User).offset(skip).limit(limit).all()

    def update_user(self, user_id: int, user_update: UserUpdate) -> Optional[User]:
        """Update a user"""
        db_user = self.get_user(user_id)
        if not db_user:
            return None
        
        # Update only provided fields
        update_data = user_update.dict(exclude_unset=True)
        
        # Check for unique constraints if updating username or email
        if "username" in update_data:
            existing_user = self.db.query(User).filter(
                User.username == update_data["username"],
                User.id != user_id
            ).first()
            if existing_user:
                raise ValueError("Username already taken")
        
        if "email" in update_data:
            existing_email = self.db.query(User).filter(
                User.email == update_data["email"],
                User.id != user_id
            ).first()
            if existing_email:
                raise ValueError("Email already taken")
        
        # Update the user
        for field, value in update_data.items():
            setattr(db_user, field, value)
        
        self.db.commit()
        self.db.refresh(db_user)
        return db_user

    def delete_user(self, user_id: int) -> bool:
        """Delete a user"""
        db_user = self.get_user(user_id)
        if not db_user:
            return False
        
        self.db.delete(db_user)
        self.db.commit()
        return True

    def activate_user(self, user_id: int) -> Optional[User]:
        """Activate a user account"""
        db_user = self.get_user(user_id)
        if not db_user:
            return None
        
        db_user.is_active = True
        self.db.commit()
        self.db.refresh(db_user)
        return db_user

    def deactivate_user(self, user_id: int) -> Optional[User]:
        """Deactivate a user account"""
        db_user = self.get_user(user_id)
        if not db_user:
            return None
        
        db_user.is_active = False
        self.db.commit()
        self.db.refresh(db_user)
        return db_user
