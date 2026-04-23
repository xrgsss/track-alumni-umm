import pandas as pd
import os
import sys
from sqlalchemy.orm import Session
from datetime import datetime

# Add app directory to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.db.session import SessionLocal
from app.models.models import AlumniBase

def import_alumni_from_excel(file_path: str):
    if not os.path.exists(file_path):
        print(f"File {file_path} tidak ditemukan.")
        return

    try:
        df = pd.read_excel(file_path)
        
        # Mapping kolom sesuai permintaan: Nama Lulusan, NIM, Tahun Masuk, Tanggal Lulus, Fakultas, Program Studi
        required_columns = ['Nama Lulusan', 'NIM', 'Tahun Masuk', 'Tanggal Lulus', 'Fakultas', 'Program Studi']
        for col in required_columns:
            if col not in df.columns:
                print(f"Kolom '{col}' tidak ditemukan dalam file Excel.")
                return

        db: Session = SessionLocal()
        
        count = 0
        for _, row in df.iterrows():
            # Cek apakah NIM sudah ada
            existing = db.query(AlumniBase).filter(AlumniBase.nim == str(row['NIM'])).first()
            if existing:
                continue
            
            # Konversi tanggal lulus
            tgl_lulus = row['Tanggal Lulus']
            if isinstance(tgl_lulus, str):
                tgl_lulus = datetime.strptime(tgl_lulus, '%Y-%m-%d').date()
            
            alumni = AlumniBase(
                nama=row['Nama Lulusan'],
                nim=str(row['NIM']),
                tahun_masuk=int(row['Tahun Masuk']),
                tgl_lulus=tgl_lulus,
                fakultas=row['Fakultas'],
                prodi=row['Program Studi']
            )
            db.add(alumni)
            count += 1
        
        db.commit()
        db.close()
        print(f"Berhasil mengimpor {count} data alumni.")
        
    except Exception as e:
        print(f"Terjadi kesalahan: {str(e)}")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python import_excel.py <path_to_excel_file>")
    else:
        import_alumni_from_excel(sys.argv[1])
