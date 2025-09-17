import requests
import time
from datetime import datetime

BASE_URL = "http://localhost:8000/api/v1"

def test_security():
    print("=== Security Tests ===")
    
    # 1. Register test user first
    print("1. Registering test user...")
    register_data = {
        "email": "test@example.com",
        "name": "Test User",
        "password": "testpass123",
        "role": "employee",
        "department": "IT"
    }
    
    # Try to register (might already exist)
    requests.post(f"{BASE_URL}/auth/register", json=register_data)
    
    # 2. Test login and token
    print("2. Testing login...")
    login_data = {"email": "test@example.com", "password": "testpass123"}
    response = requests.post(f"{BASE_URL}/auth/login", json=login_data)
    
    if response.status_code == 200:
        token = response.json()["access_token"]
        print("[PASS] Login successful")
        
        # 3. Test protected endpoint
        print("3. Testing protected endpoint...")
        headers = {"Authorization": f"Bearer {token}"}
        profile_response = requests.get(f"{BASE_URL}/auth/profile", headers=headers)
        
        if profile_response.status_code == 200:
            print("[PASS] Protected endpoint accessible with valid token")
        else:
            print("[FAIL] Protected endpoint failed")
        
        # 4. Test invalid token
        print("4. Testing invalid token...")
        invalid_headers = {"Authorization": "Bearer invalid_token"}
        invalid_response = requests.get(f"{BASE_URL}/auth/profile", headers=invalid_headers)
        
        if invalid_response.status_code == 401:
            print("[PASS] Invalid token properly rejected")
        else:
            print("[FAIL] Invalid token not properly handled")
    
    print("\n=== Performance Tests ===")
    
    # 5. Response time test
    print("5. Testing response times...")
    start_time = time.time()
    response = requests.get("http://localhost:8000/health")
    end_time = time.time()
    
    response_time = (end_time - start_time) * 1000
    print(f"Health endpoint response time: {response_time:.2f}ms")
    
    if response_time < 100:
        print("[PASS] Good response time")
    elif response_time < 500:
        print("[WARN] Acceptable response time")
    else:
        print("[FAIL] Slow response time")

if __name__ == "__main__":
    test_security()