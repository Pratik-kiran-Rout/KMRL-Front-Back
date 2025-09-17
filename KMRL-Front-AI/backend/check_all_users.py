from app.core.database import SessionLocal
from app.models.user import User
from app.core.security import verify_password

# Create session
db = SessionLocal()

# List all users with password check
users = db.query(User).all()

print(f"Found {len(users)} users:")
for user in users:
    print(f"\nID: {user.id}")
    print(f"Email: {user.email}")
    print(f"Name: {user.name}")
    print(f"Role: {user.role}")
    print(f"Department: {user.department}")
    
    # Test both passwords
    if verify_password("admin123", user.hashed_password):
        print("Password 'admin123' works for this user")
    if verify_password("password123", user.hashed_password):
        print("Password 'password123' works for this user")

db.close()