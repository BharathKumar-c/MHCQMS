#!/usr/bin/env python3
"""
Test script to check if all imports work correctly
"""

def test_imports():
    """Test importing all modules"""
    try:
        print("Testing imports...")
        
        # Test basic imports
        print("✓ Testing basic imports...")
        from app.core.config import settings
        print("  ✓ Config imported successfully")
        
        from app.core.database import get_db
        print("  ✓ Database imported successfully")
        
        # Test models
        print("✓ Testing models...")
        from app.models.user import User
        print("  ✓ User model imported successfully")
        
        from app.models.patient import Patient
        print("  ✓ Patient model imported successfully")
        
        from app.models.queue import Queue, QueueStatus
        print("  ✓ Queue model imported successfully")
        
        # Test schemas
        print("✓ Testing schemas...")
        from app.schemas.user import UserCreate, UserResponse
        print("  ✓ User schemas imported successfully")
        
        from app.schemas.patient import PatientCreate, PatientResponse
        print("  ✓ Patient schemas imported successfully")
        
        from app.schemas.queue import QueueCreate, QueueResponse
        print("  ✓ Queue schemas imported successfully")
        
        # Test services
        print("✓ Testing services...")
        from app.services.auth import AuthService
        print("  ✓ Auth service imported successfully")
        
        from app.services.user import UserService
        print("  ✓ User service imported successfully")
        
        from app.services.patient import PatientService
        print("  ✓ Patient service imported successfully")
        
        from app.services.queue import QueueService
        print("  ✓ Queue service imported successfully")
        
        # Test API
        print("✓ Testing API...")
        from app.api.auth import router as auth_router
        print("  ✓ Auth router imported successfully")
        
        from app.api.users import router as users_router
        print("  ✓ Users router imported successfully")
        
        from app.api.patients import router as patients_router
        print("  ✓ Patients router imported successfully")
        
        from app.api.queue import router as queue_router
        print("  ✓ Queue router imported successfully")
        
        print("\n🎉 All imports successful! The API should work correctly.")
        return True
        
    except Exception as e:
        print(f"\n❌ Import failed: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    test_imports()
