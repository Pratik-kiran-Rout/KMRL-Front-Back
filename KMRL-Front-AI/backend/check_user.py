from app.core.database import SessionLocal
from app.models.user import User
from app.core.security import verify_password

# Create session
db = SessionLocal()

# Find user
user = db.query(User).filter(User.email == "admin@kmrl.co.in").first()

if user:
    print(f"User found: {user.email}")
    print(f"Name: {user.name}")
    print(f"Role: {user.role}")
    print(f"Department: {user.department}")
    print(f"Active: {user.is_active}")
    
    # Test password
    test_passwords = ["admin123", "password123"]
    for pwd in test_passwords:
        if verify_password(pwd, user.hashed_password):
            print(f"Password '{pwd}' works!")
        else:
            print(f"Password '{pwd}' failed")
else:
    print("User not found!")

db.close()