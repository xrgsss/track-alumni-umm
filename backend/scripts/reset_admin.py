import os
import sys
from sqlalchemy.orm import Session

# Add app directory to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.db.session import SessionLocal, engine
from app.models.models import User, UserRole, Base
from app.core.security import get_password_hash

def reset_admin():
    # Ensure tables are created
    Base.metadata.create_all(bind=engine)
    
    db: Session = SessionLocal()
    try:
        admin_user = db.query(User).filter(User.username == "admin").first()
        if not admin_user:
            admin_user = User(
                username="admin",
                password_hash=get_password_hash("admin123"),
                role=UserRole.ADMIN
            )
            db.add(admin_user)
            print("✅ User 'admin' created with password 'admin123'")
        else:
            admin_user.password_hash = get_password_hash("admin123")
            print("✅ Password for 'admin' reset to 'admin123'")
        
        db.commit()
    except Exception as e:
        print(f"❌ Error: {str(e)}")
    finally:
        db.close()

if __name__ == "__main__":
    reset_admin()
