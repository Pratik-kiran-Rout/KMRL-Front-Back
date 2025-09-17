from app.core.database import SessionLocal
from app.models.user import User

# Create session
db = SessionLocal()

# List all users
users = db.query(User).all()

print(f"Found {len(users)} users:")
for user in users:
    print(f"ID: {user.id}, Email: {user.email}, Name: {user.name}, Role: {user.role}")

db.close()