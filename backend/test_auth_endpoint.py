#!/usr/bin/env python3
"""
Test script to test the auth endpoint and identify errors
"""

import asyncio
from fastapi.testclient import TestClient
from app.main import app
from app.core.database import engine
from app.models.user import User
from app.services.auth import AuthService
from sqlalchemy.orm import sessionmaker

def test_auth_endpoint():
    """Test the auth endpoint directly"""
    client = TestClient(app)
    
    try:
        # Test login endpoint
        response = client.post(
            "/api/v1/auth/login",
            data={"username": "admin", "password": "password123"}
        )
        
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
        
        if response.status_code == 200:
            print("✅ Login successful!")
            data = response.json()
            print(f"Token: {data.get('token', 'N/A')[:20]}...")
            print(f"User: {data.get('user', {}).get('username', 'N/A')}")
        else:
            print("❌ Login failed")
            
    except Exception as e:
        print(f"❌ Error testing endpoint: {e}")
        import traceback
        traceback.print_exc()

def test_auth_service():
    """Test the auth service directly"""
    try:
        Session = sessionmaker(bind=engine)
        session = Session()
        
        auth_service = AuthService(session)
        user = auth_service.authenticate_user('admin', 'password123')
        
        if user:
            print("✅ Auth service working")
            print(f"User: {user.username}")
            
            # Test creating UserResponse
            from app.schemas.user import UserResponse
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
            print("✅ UserResponse created successfully")
            print(f"Response: {user_response}")
        else:
            print("❌ Auth service failed")
            
        session.close()
        
    except Exception as e:
        print(f"❌ Error testing auth service: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    print("Testing Auth Service...")
    test_auth_service()
    
    print("\nTesting Auth Endpoint...")
    test_auth_endpoint()
