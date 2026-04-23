from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.api import deps
from app.models.models import User, AuditLog
from app.schemas import schemas

router = APIRouter()

@router.get("/logs", response_model=List[schemas.AuditLog])
def read_audit_logs(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    current_admin: User = Depends(deps.get_current_admin)
):
    logs = db.query(AuditLog).order_by(AuditLog.timestamp.desc()).offset(skip).limit(limit).all()
    return logs
