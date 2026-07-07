"""
Run this script to create your admin account.
Usage: python create_admin.py
"""
import os
import sys
from dotenv import load_dotenv

if os.path.exists('secret.env'):
    load_dotenv('secret.env')

from app import app
from models import db, User
from werkzeug.security import generate_password_hash

def create_admin():
    with app.app_context():
        # Add is_admin column if not exists
        try:
            db.session.execute(db.text(
                "ALTER TABLE users ADD COLUMN is_admin BOOLEAN DEFAULT FALSE"
            ))
            db.session.commit()
            print("✅ Added is_admin column")
        except Exception:
            print("ℹ️  is_admin column already exists")

        email = input("Admin email [admin@technozone.com]: ").strip() or "admin@technozone.com"
        name = input("Admin name [Ahmed Dahy Shaban]: ").strip() or "Ahmed Dahy Shaban"
        password = input("Admin password [Admin@123456]: ").strip() or "Admin@123456"

        existing = User.query.filter_by(email=email).first()
        if existing:
            existing.is_admin = True
            existing.password_hash = generate_password_hash(password)
            db.session.commit()
            print(f"✅ Updated existing user {email} to admin")
        else:
            admin = User(
                name=name,
                email=email,
                password_hash=generate_password_hash(password),
                is_admin=True
            )
            db.session.add(admin)
            db.session.commit()
            print(f"✅ Admin account created: {email}")

        print("\n🎉 Admin setup complete!")
        print(f"   URL: http://your-alb-url/admin/login")
        print(f"   Email: {email}")
        print(f"   Password: {password}")

if __name__ == '__main__':
    create_admin()
