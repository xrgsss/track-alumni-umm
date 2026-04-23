from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.api import deps
from app.crud import crud_alumni, crud_user
from app.schemas import schemas
from app.models.models import User

router = APIRouter()

@router.get("/", response_model=List[schemas.AlumniDetail])
def read_alumni(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    search: Optional[str] = None,
    fakultas: Optional[str] = None,
    prodi: Optional[str] = None,
    tahun: Optional[int] = None,
    current_user: User = Depends(deps.get_current_user)
):
    alumni = crud_alumni.get_alumni(db, skip=skip, limit=limit, search=search, fakultas=fakultas, prodi=prodi, tahun=tahun)
    return alumni

@router.get("/{nim}", response_model=schemas.AlumniDetail)
def read_alumni_by_nim(
    nim: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(deps.get_current_user)
):
    alumni = crud_alumni.get_alumni_by_nim(db, nim=nim)
    if not alumni:
        raise HTTPException(status_code=404, detail="Alumni not found")
    return alumni

@router.put("/{nim}/contact", response_model=schemas.AlumniContact)
def update_contact(
    nim: str,
    contact_in: schemas.AlumniContactUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(deps.get_current_user)
):
    contact = crud_alumni.update_alumni_contact(db, nim=nim, contact_in=contact_in)
    if not contact:
        raise HTTPException(status_code=404, detail="Alumni not found")
    
    crud_user.create_audit_log(db, user_id=current_user.id, action="UPDATE_CONTACT", target=nim)
    return contact

@router.put("/{nim}/career", response_model=schemas.AlumniCareer)
def update_career(
    nim: str,
    career_in: schemas.AlumniCareerUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(deps.get_current_user)
):
    career = crud_alumni.update_alumni_career(db, nim=nim, career_in=career_in)
    if not career:
        raise HTTPException(status_code=404, detail="Alumni not found")
    
    crud_user.create_audit_log(db, user_id=current_user.id, action="UPDATE_CAREER", target=nim)
    return career
