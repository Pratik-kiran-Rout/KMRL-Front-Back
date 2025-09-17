from app.core.database import SessionLocal
from app.models.user import User
from app.core.security import get_password_hash

# Create session
db = SessionLocal()

# Find user and update password
user = db.query(User).filter(User.email == "admin@kmrl.co.in").first()

if user:
    user.hashed_password = get_password_hash("admin123")
    db.commit()
    print("Password updated to: admin123")
else:
    print("User not found")

db.close()