from typing import Optional, List
from datetime import date, datetime
from pydantic import BaseModel, EmailStr, ConfigDict
from app.models.models import UserRole, WorkingStatus

# Token Schemas
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None
    role: Optional[str] = None

# User Schemas
class UserBase(BaseModel):
    username: str
    role: UserRole

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    model_config = ConfigDict(from_attributes=True)

# Alumni Contact Schemas
class AlumniContactBase(BaseModel):
    linkedin: Optional[str] = None
    instagram: Optional[str] = None
    facebook: Optional[str] = None
    tiktok: Optional[str] = None
    email: Optional[EmailStr] = None
    no_hp: Optional[str] = None

class AlumniContactUpdate(AlumniContactBase):
    pass

class AlumniContact(AlumniContactBase):
    id: int
    alumni_id: int
    model_config = ConfigDict(from_attributes=True)

# Alumni Career Schemas
class AlumniCareerBase(BaseModel):
    tempat_kerja: Optional[str] = None
    alamat_kerja: Optional[str] = None
    posisi: Optional[str] = None
    status_kerja: Optional[WorkingStatus] = None
    sosmed_instansi: Optional[str] = None

class AlumniCareerUpdate(AlumniCareerBase):
    pass

class AlumniCareer(AlumniCareerBase):
    id: int
    alumni_id: int
    model_config = ConfigDict(from_attributes=True)

# Alumni Base Schemas
class AlumniBaseSchema(BaseModel):
    nama: str
    nim: str
    tahun_masuk: int
    tgl_lulus: date
    fakultas: str
    prodi: str

class AlumniDetail(AlumniBaseSchema):
    id: int
    contact: Optional[AlumniContact] = None
    career: Optional[AlumniCareer] = None
    model_config = ConfigDict(from_attributes=True)

# Audit Log Schemas
class AuditLog(BaseModel):
    id: int
    user_id: int
    action: str
    target: str
    timestamp: datetime
    details: Optional[str] = None
    model_config = ConfigDict(from_attributes=True)
