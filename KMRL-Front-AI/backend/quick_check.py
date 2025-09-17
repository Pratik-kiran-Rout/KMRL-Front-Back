import sqlite3

# Check if user exists
conn = sqlite3.connect('app.db')
cursor = conn.cursor()

cursor.execute("SELECT email, name, hashed_password FROM users WHERE email = ?", ("admin@kmrl.co.in",))
user = cursor.fetchone()

if user:
    print(f"User found: {user[1]} ({user[0]})")
    print(f"Password hash: {user[2][:50]}...")
else:
    print("User not found in database")

conn.close()