from sqlalchemy.orm import Session
from app.models.models import User, AuditLog
from app.core.security import get_password_hash
from app.schemas.schemas import UserCreate

def get_user_by_username(db: Session, username: str):
    return db.query(User).filter(User.username == username).first()

def create_user(db: Session, user: UserCreate):
    db_user = User(
        username=user.username,
        password_hash=get_password_hash(user.password),
        role=user.role
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def create_audit_log(db: Session, user_id: int, action: str, target: str, details: str = None):
    log = AuditLog(user_id=user_id, action=action, target=target, details=details)
    db.add(log)
    db.commit()
