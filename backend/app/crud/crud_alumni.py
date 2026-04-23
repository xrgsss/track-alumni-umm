from sqlalchemy.orm import Session
from sqlalchemy import or_
from app.models.models import AlumniBase, AlumniContact, AlumniCareer
from app.schemas.schemas import AlumniContactUpdate, AlumniCareerUpdate

def get_alumni(db: Session, skip: int = 0, limit: int = 100, search: str = None, fakultas: str = None, prodi: str = None, tahun: int = None):
    query = db.query(AlumniBase)
    if search:
        query = query.filter(or_(
            AlumniBase.nama.ilike(f"%{search}%"),
            AlumniBase.nim.ilike(f"%{search}%")
        ))
    if fakultas:
        query = query.filter(AlumniBase.fakultas == fakultas)
    if prodi:
        query = query.filter(AlumniBase.prodi == prodi)
    if tahun:
        query = query.filter(AlumniBase.tahun_masuk == tahun)
    
    return query.offset(skip).limit(limit).all()

def get_alumni_by_nim(db: Session, nim: str):
    return db.query(AlumniBase).filter(AlumniBase.nim == nim).first()

def update_alumni_contact(db: Session, nim: str, contact_in: AlumniContactUpdate):
    alumni = get_alumni_by_nim(db, nim)
    if not alumni:
        return None
    
    contact = alumni.contact
    if not contact:
        contact = AlumniContact(alumni_id=alumni.id)
        db.add(contact)
    
    update_data = contact_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(contact, field, value)
    
    db.commit()
    db.refresh(contact)
    return contact

def update_alumni_career(db: Session, nim: str, career_in: AlumniCareerUpdate):
    alumni = get_alumni_by_nim(db, nim)
    if not alumni:
        return None
    
    career = alumni.career
    if not career:
        career = AlumniCareer(alumni_id=alumni.id)
        db.add(career)
    
    update_data = career_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(career, field, value)
    
    db.commit()
    db.refresh(career)
    return career
