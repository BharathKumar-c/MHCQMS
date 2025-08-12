#!/usr/bin/env python3
"""
Simple test script to verify MHCQMS API endpoints
Run this after starting the server to test basic functionality
"""

import requests
import json
from datetime import datetime

# Configuration
BASE_URL = "http://localhost:8000"
API_BASE = f"{BASE_URL}/api/v1"

def test_root_endpoint():
    """Test the root endpoint"""
    print("Testing root endpoint...")
    response = requests.get(BASE_URL)
    if response.status_code == 200:
        data = response.json()
        print(f"✅ Root endpoint working: {data['message']}")
        return True
    else:
        print(f"❌ Root endpoint failed: {response.status_code}")
        return False

def test_health_check():
    """Test the health check endpoint"""
    print("Testing health check...")
    response = requests.get(f"{BASE_URL}/health")
    if response.status_code == 200:
        data = response.json()
        print(f"✅ Health check working: {data['status']}")
        return True
    else:
        print(f"❌ Health check failed: {response.status_code}")
        return False

def test_api_info():
    """Test the API info endpoint"""
    print("Testing API info...")
    response = requests.get(f"{API_BASE}")
    if response.status_code == 200:
        data = response.json()
        print(f"✅ API info working: {data['api_name']} v{data['version']}")
        return True
    else:
        print(f"❌ API info failed: {response.status_code}")
        return False

def test_documentation_endpoints():
    """Test documentation endpoints"""
    print("Testing documentation endpoints...")
    
    # Test Swagger UI
    response = requests.get(f"{BASE_URL}/docs")
    if response.status_code == 200:
        print("✅ Swagger UI accessible")
    else:
        print(f"❌ Swagger UI failed: {response.status_code}")
    
    # Test ReDoc
    response = requests.get(f"{BASE_URL}/redoc")
    if response.status_code == 200:
        print("✅ ReDoc accessible")
    else:
        print(f"❌ ReDoc failed: {response.status_code}")
    
    # Test OpenAPI schema
    response = requests.get(f"{BASE_URL}/openapi.json")
    if response.status_code == 200:
        print("✅ OpenAPI schema accessible")
    else:
        print(f"❌ OpenAPI schema failed: {response.status_code}")

def test_authentication_endpoints():
    """Test authentication endpoints (without auth)"""
    print("Testing authentication endpoints...")
    
    # Test registration endpoint structure
    response = requests.post(f"{API_BASE}/auth/register", json={
        "username": "test_user",
        "email": "test@example.com",
        "password": "testpassword123",
        "full_name": "Test User"
    })
    
    if response.status_code in [201, 400, 422]:  # 400/422 are expected without proper setup
        print("✅ Registration endpoint responding")
    else:
        print(f"❌ Registration endpoint failed: {response.status_code}")

def main():
    """Run all tests"""
    print("🚀 Testing MHCQMS API...")
    print("=" * 50)
    
    tests = [
        test_root_endpoint,
        test_health_check,
        test_api_info,
        test_documentation_endpoints,
        test_authentication_endpoints
    ]
    
    passed = 0
    total = len(tests)
    
    for test in tests:
        try:
            if test():
                passed += 1
        except Exception as e:
            print(f"❌ Test failed with error: {e}")
        print()
    
    print("=" * 50)
    print(f"📊 Test Results: {passed}/{total} tests passed")
    
    if passed == total:
        print("🎉 All tests passed! API is working correctly.")
        print(f"\n📚 Access your API documentation at:")
        print(f"   Swagger UI: {BASE_URL}/docs")
        print(f"   ReDoc: {BASE_URL}/redoc")
        print(f"   OpenAPI Schema: {BASE_URL}/openapi.json")
    else:
        print("⚠️  Some tests failed. Check the server logs for more details.")

if __name__ == "__main__":
    main()
