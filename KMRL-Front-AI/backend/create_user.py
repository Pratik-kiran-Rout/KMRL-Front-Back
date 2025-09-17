from app.core.database import SessionLocal, init_db
from app.models.user import User
from app.core.security import get_password_hash

# Initialize database
init_db()

# Create session
db = SessionLocal()

# Check if user exists
existing_user = db.query(User).filter(User.email == "admin@kmrl.co.in").first()

if not existing_user:
    # Create default user
    user = User(
        email="admin@kmrl.co.in",
        name="Rajesh Kumar",
        hashed_password=get_password_hash("admin123"),
        role="Chief Safety Officer",
        department="Operations & Safety"
    )
    
    db.add(user)
    db.commit()
    print("Default user created: admin@kmrl.co.in / admin123")
else:
    print("User already exists: admin@kmrl.co.in")

db.close()