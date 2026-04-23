import pandas as pd
from io import BytesIO
from fastapi import APIRouter, Depends, Response
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.api import deps
from app.models.models import AlumniBase, User

router = APIRouter()

@router.get("/excel")
def export_to_excel(
    db: Session = Depends(get_db),
    current_user: User = Depends(deps.get_current_user)
):
    alumni_list = db.query(AlumniBase).all()
    
    data = []
    for a in alumni_list:
        row = {
            "Nama": a.nama,
            "NIM": a.nim,
            "Tahun Masuk": a.tahun_masuk,
            "Tanggal Lulus": a.tgl_lulus,
            "Fakultas": a.fakultas,
            "Program Studi": a.prodi,
            "Email": a.contact.email if a.contact else "",
            "No HP": a.contact.no_hp if a.contact else "",
            "Tempat Kerja": a.career.tempat_kerja if a.career else "",
            "Posisi": a.career.posisi if a.career else "",
            "Status Kerja": a.career.status_kerja.value if a.career and a.career.status_kerja else ""
        }
        data.append(row)
    
    df = pd.DataFrame(data)
    
    output = BytesIO()
    with pd.ExcelWriter(output, engine='openpyxl') as writer:
        df.to_excel(writer, index=False, sheet_name='Alumni')
    
    output.seek(0)
    
    headers = {
        'Content-Disposition': 'attachment; filename="data_alumni_lengkap.xlsx"'
    }
    return Response(content=output.getvalue(), media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", headers=headers)
