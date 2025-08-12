#!/usr/bin/env python3
"""
Test script to verify password authentication
"""

from app.core.database import engine
from app.models.user import User
from app.services.auth import AuthService
from sqlalchemy.orm import sessionmaker

def test_auth():
    Session = sessionmaker(bind=engine)
    session = Session()
    
    try:
        # Test authentication
        auth_service = AuthService(session)
        
        # Test with admin user
        user = auth_service.authenticate_user('admin', 'password123')
        if user:
            print(f"✅ Authentication successful for admin")
            print(f"   User ID: {user.id}")
            print(f"   Username: {user.username}")
            print(f"   Email: {user.email}")
            print(f"   Full Name: {user.full_name}")
        else:
            print("❌ Authentication failed for admin")
            
        # Test with wrong password
        user = auth_service.authenticate_user('admin', 'wrongpassword')
        if user:
            print("❌ Authentication should have failed with wrong password")
        else:
            print("✅ Correctly rejected wrong password")
            
    except Exception as e:
        print(f"❌ Error: {e}")
    finally:
        session.close()

if __name__ == "__main__":
    test_auth()
