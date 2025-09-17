import requests
import os

BASE_URL = "http://localhost:8000/api/v1"

def test_document_functionality():
    print("=== Document Management Tests ===")
    
    # 1. Login first to get token
    print("1. Logging in...")
    login_data = {"email": "test@example.com", "password": "testpass123"}
    response = requests.post(f"{BASE_URL}/auth/login", json=login_data)
    
    if response.status_code != 200:
        print("[FAIL] Login failed")
        return
    
    token = response.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    print("[PASS] Login successful")
    
    # 2. Create a test text file
    print("2. Creating test file...")
    test_content = """
    KMRL Safety Report
    Date: 2024-01-15
    Department: Operations
    
    This is a test safety document for the Kochi Metro Rail Limited.
    The document contains important safety protocols and procedures.
    All staff must follow these guidelines for safe operations.
    """
    
    test_file_path = "test_document.txt"
    with open(test_file_path, "w") as f:
        f.write(test_content)
    print("[PASS] Test file created")
    
    # 3. Test document upload
    print("3. Testing document upload...")
    with open(test_file_path, "rb") as f:
        files = {"file": ("test_document.txt", f, "text/plain")}
        data = {
            "title": "Test Safety Document",
            "document_type": "safety",
            "department": "Operations"
        }
        
        upload_response = requests.post(
            f"{BASE_URL}/documents/upload",
            files=files,
            data=data,
            headers=headers
        )
    
    if upload_response.status_code == 200:
        document = upload_response.json()
        document_id = document["id"]
        print(f"[PASS] Document uploaded successfully (ID: {document_id})")
        print(f"       Processing status: {document['processing_status']}")
        
        # 4. Test document retrieval
        print("4. Testing document retrieval...")
        get_response = requests.get(f"{BASE_URL}/documents/{document_id}", headers=headers)
        
        if get_response.status_code == 200:
            print("[PASS] Document retrieved successfully")
            doc_data = get_response.json()
            print(f"       Title: {doc_data['title']}")
            print(f"       Type: {doc_data['document_type']}")
            print(f"       Text extracted: {bool(doc_data['extracted_text'])}")
        else:
            print("[FAIL] Document retrieval failed")
        
        # 5. Test document listing
        print("5. Testing document listing...")
        list_response = requests.get(f"{BASE_URL}/documents/", headers=headers)
        
        if list_response.status_code == 200:
            documents = list_response.json()
            print(f"[PASS] Document listing successful ({len(documents)} documents)")
        else:
            print("[FAIL] Document listing failed")
        
        # 6. Test document summarization
        print("6. Testing document summarization...")
        summary_response = requests.post(f"{BASE_URL}/documents/{document_id}/summarize", headers=headers)
        
        if summary_response.status_code == 200:
            summary = summary_response.json()
            print("[PASS] Document summarization successful")
            print(f"       Summary: {summary['summary_text'][:100]}...")
        else:
            print(f"[FAIL] Document summarization failed: {summary_response.text}")
        
        # 7. Test document search
        print("7. Testing document search...")
        search_data = {"query": "safety", "limit": 5}
        search_response = requests.post(f"{BASE_URL}/documents/search", json=search_data, headers=headers)
        
        if search_response.status_code == 200:
            search_results = search_response.json()
            print(f"[PASS] Document search successful ({search_results['total']} results)")
        else:
            print("[FAIL] Document search failed")
    
    else:
        print(f"[FAIL] Document upload failed: {upload_response.text}")
    
    # Cleanup
    if os.path.exists(test_file_path):
        os.remove(test_file_path)
    
    print("\n=== AI Service Tests ===")
    
    # 8. Test AI chat
    print("8. Testing AI chat...")
    chat_data = {"message": "Hello, can you help me with document management?"}
    chat_response = requests.post(f"{BASE_URL}/ai/chat", json=chat_data, headers=headers)
    
    if chat_response.status_code == 200:
        chat_result = chat_response.json()
        print("[PASS] AI chat successful")
        print(f"       Response: {chat_result['response']}")
    else:
        print(f"[FAIL] AI chat failed: {chat_response.text}")

if __name__ == "__main__":
    test_document_functionality()