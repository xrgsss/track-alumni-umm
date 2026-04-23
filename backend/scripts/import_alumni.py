import pandas as pd
import os
import sys
import secrets
import string
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from datetime import datetime

# Add app directory to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.db.session import SessionLocal
from app.models.models import AlumniBase, User, UserRole
from app.core.security import get_password_hash

def generate_password(length=12):
    alphabet = string.ascii_letters + string.digits
    return ''.join(secrets.choice(alphabet) for _ in range(length))

def create_default_users(db: Session):
    print("\n--- Menyiapkan Akun Default ---")
    
    # Create Admin
    admin_pass = generate_password()
    admin_user = db.query(User).filter(User.username == "admin").first()
    if not admin_user:
        admin_user = User(
            username="admin",
            password_hash=get_password_hash(admin_pass),
            role=UserRole.ADMIN
        )
        db.add(admin_user)
        print(f"✅ User ADMIN dibuat!")
        print(f"   Username: admin")
        print(f"   Password: {admin_pass}  <-- SIMPAN INI!")
    else:
        print("ℹ️ User admin sudah ada.")

    # Create Viewer
    viewer_pass = generate_password()
    viewer_user = db.query(User).filter(User.username == "viewer").first()
    if not viewer_user:
        viewer_user = User(
            username="viewer",
            password_hash=get_password_hash(viewer_pass),
            role=UserRole.VIEWER
        )
        db.add(viewer_user)
        print(f"✅ User VIEWER dibuat!")
        print(f"   Username: viewer")
        print(f"   Password: {viewer_pass}")
    else:
        print("ℹ️ User viewer sudah ada.")
    
    db.commit()

def import_alumni_from_excel(file_path: str):
    if not os.path.exists(file_path):
        print(f"❌ Error: File {file_path} tidak ditemukan.")
        return

    print(f"\n--- Mengimpor Data dari {file_path} ---")
    
    try:
        # Load Excel
        df = pd.read_excel(file_path, sheet_name='Sheet1')
        
        # Required columns
        required_columns = ['Nama Lulusan', 'NIM', 'Tahun Masuk', 'Tanggal Lulus', 'Fakultas', 'Program Studi']
        for col in required_columns:
            if col not in df.columns:
                print(f"❌ Error: Kolom '{col}' tidak ditemukan.")
                return

        db: Session = SessionLocal()
        
        stats = {
            "total": len(df),
            "success": 0,
            "duplicate": 0,
            "error": 0
        }

        for index, row in df.iterrows():
            try:
                # Clean and Normalize data
                nama = str(row['Nama Lulusan']).strip().title()
                nim = str(row['NIM']).strip()
                tahun_masuk = int(row['Tahun Masuk'])
                
                # Handle Date
                tgl_lulus = row['Tanggal Lulus']
                if isinstance(tgl_lulus, str):
                    tgl_lulus = datetime.strptime(tgl_lulus, '%Y-%m-%d').date()
                elif isinstance(tgl_lulus, datetime):
                    tgl_lulus = tgl_lulus.date()
                
                fakultas = str(row['Fakultas']).strip()
                prodi = str(row['Program Studi']).strip()

                # Check Duplicate NIM
                existing = db.query(AlumniBase).filter(AlumniBase.nim == nim).first()
                if existing:
                    stats["duplicate"] += 1
                    continue
                
                alumni = AlumniBase(
                    nama=nama,
                    nim=nim,
                    tahun_masuk=tahun_masuk,
                    tgl_lulus=tgl_lulus,
                    fakultas=fakultas,
                    prodi=prodi
                )
                db.add(alumni)
                stats["success"] += 1
                
                # Commit every 100 rows to avoid huge transactions but maintain efficiency
                if stats["success"] % 100 == 0:
                    db.commit()

            except Exception as e:
                print(f"⚠️ Error pada baris {index + 2}: {str(e)}")
                stats["error"] += 1

        db.commit()
        
        print("\n--- Ringkasan Import ---")
        print(f"Total Baris      : {stats['total']}")
        print(f"Berhasil Import  : {stats['success']}")
        print(f"Duplikat (NIM)   : {stats['duplicate']}")
        print(f"Error            : {stats['error']}")
        
        # Finally, create default users
        create_default_users(db)
        
        db.close()
        
    except Exception as e:
        print(f"❌ Fatal Error: {str(e)}")

if __name__ == "__main__":
    file_name = "Alumni_2000-2025.xlsx"
    if len(sys.argv) > 1:
        file_name = sys.argv[1]
    
    import_alumni_from_excel(file_name)
