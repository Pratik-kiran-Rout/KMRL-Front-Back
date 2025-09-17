from app.core.database import SessionLocal
from app.models.user import User
from app.core.security import get_password_hash

# Create session
db = SessionLocal()

# Delete existing user
db.query(User).filter(User.email == "admin@kmrl.co.in").delete()

# Create new user with correct password
user = User(
    email="admin@kmrl.co.in",
    name="Rajesh Kumar",
    hashed_password=get_password_hash("admin123"),
    role="Chief Safety Officer",
    department="Operations & Safety"
)

db.add(user)
db.commit()
print("User reset with password: admin123")

db.close()