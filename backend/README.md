# Alumni Tracking System Backend (FastAPI)

Sistem backend untuk pengumpulan data alumni menggunakan FastAPI dan PostgreSQL.

## Fitur
- Autentikasi JWT (8 jam expiry)
- Role-Based Access Control (Admin & Viewer)
- Manajemen Data Alumni (CRUD)
- Impor Data dari Excel
- Ekspor Data ke Excel
- Audit Logging (Admin only)
- Rate Limiting

## Prasyarat
- Python 3.9+
- PostgreSQL

## Cara Setup

1. **Clone & Masuk ke Folder Backend:**
   ```bash
   cd backend
   ```

2. **Buat Virtual Environment (Opsional tapi disarankan):**
   ```bash
   python -m venv venv
   source venv/bin/activate  # Linux/Mac
   venv\Scripts\activate     # Windows
   ```

3. **Instal Dependensi:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Konfigurasi Environment:**
   - Salin `.env.example` menjadi `.env`
   - Sesuaikan `DATABASE_URL` dengan kredensial PostgreSQL Anda.
   - Ubah `SECRET_KEY` dengan string acak yang aman.

5. **Jalankan Migrasi Database:**
   ```bash
   alembic revision --autogenerate -m "Initial migration"
   alembic upgrade head
   ```

6. **Jalankan Server:**
   ```bash
   uvicorn app.main:app --reload
   ```
   Akses dokumentasi API di: `http://localhost:8000/docs`

## Cara Impor Data Alumni
Siapkan file Excel dengan kolom: `Nama Lulusan`, `NIM`, `Tahun Masuk`, `Tanggal Lulus`, `Fakultas`, `Program Studi`.
Jalankan skrip:
```bash
python scripts/import_excel.py path/to/your/alumni_data.xlsx
```

## Struktur API
- `POST /auth/login` - Login untuk mendapatkan token.
- `GET /alumni` - List alumni dengan filter & search.
- `GET /alumni/{nim}` - Detail alumni.
- `PUT /alumni/{nim}/contact` - Update data kontak.
- `PUT /alumni/{nim}/career` - Update data karier.
- `GET /export/excel` - Download data alumni lengkap.
- `GET /admin/logs` - Cek log aktivitas (Admin only).
