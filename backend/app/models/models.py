import enum
from sqlalchemy import Column, Integer, String, Date, Enum, ForeignKey, DateTime, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.base_class import Base

class UserRole(str, enum.Enum):
    ADMIN = "admin"
    VIEWER = "viewer"

class WorkingStatus(str, enum.Enum):
    PNS = "PNS"
    SWASTA = "Swasta"
    WIRAUSAHA = "Wirausaha"

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    role = Column(Enum(UserRole), default=UserRole.VIEWER)

class AlumniBase(Base):
    __tablename__ = "alumni_base"
    id = Column(Integer, primary_key=True, index=True)
    nama = Column(String, index=True, nullable=False)
    nim = Column(String, unique=True, index=True, nullable=False)
    tahun_masuk = Column(Integer, nullable=False)
    tgl_lulus = Column(Date, nullable=False)
    fakultas = Column(String, index=True, nullable=False)
    prodi = Column(String, index=True, nullable=False)
    
    contact = relationship("AlumniContact", back_populates="alumni", uselist=False)
    career = relationship("AlumniCareer", back_populates="alumni", uselist=False)

class AlumniContact(Base):
    __tablename__ = "alumni_contact"
    id = Column(Integer, primary_key=True, index=True)
    alumni_id = Column(Integer, ForeignKey("alumni_base.id"))
    linkedin = Column(String, nullable=True)
    instagram = Column(String, nullable=True)
    facebook = Column(String, nullable=True)
    tiktok = Column(String, nullable=True)
    email = Column(String, nullable=True)
    no_hp = Column(String, nullable=True)
    
    alumni = relationship("AlumniBase", back_populates="contact")

class AlumniCareer(Base):
    __tablename__ = "alumni_career"
    id = Column(Integer, primary_key=True, index=True)
    alumni_id = Column(Integer, ForeignKey("alumni_base.id"))
    tempat_kerja = Column(String, nullable=True)
    alamat_kerja = Column(Text, nullable=True)
    posisi = Column(String, nullable=True)
    status_kerja = Column(Enum(WorkingStatus), nullable=True)
    sosmed_instansi = Column(String, nullable=True)
    
    alumni = relationship("AlumniBase", back_populates="career")

class AuditLog(Base):
    __tablename__ = "audit_log"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    action = Column(String, nullable=False)
    target = Column(String, nullable=False)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
    details = Column(Text, nullable=True)
    
    user = relationship("User")
