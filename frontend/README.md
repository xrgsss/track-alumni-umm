# UMM Alumni Tracker Frontend (React)

Antarmuka web untuk Sistem Manajemen Data Alumni UMM.

## Fitur Utama
- **Dashboard Interaktif**: Visualisasi data alumni per tahun dan fakultas.
- **Manajemen Data**: Tabel alumni dengan filter dan pencarian canggih.
- **Edit Data Terpadu**: Modal dengan sistem tab untuk memperbarui info kontak dan karier.
- **Ekspor Laporan**: Fitur unduh database lengkap ke Excel (khusus Admin).
- **Keamanan**: Proteksi rute berbasis JWT dan Role-Based Access Control.

## Cara Menjalankan

1. **Masuk ke folder frontend:**
   ```bash
   cd frontend
   ```

2. **Instal dependensi:**
   ```bash
   npm install
   ```

3. **Jalankan aplikasi (Mode Pengembangan):**
   ```bash
   npm run dev
   ```
   Aplikasi akan berjalan di `http://localhost:3000`.

## Catatan Penting
- Pastikan backend FastAPI sudah berjalan di port 8000 agar API dapat terhubung.
- Konfigurasi proxy sudah diatur di `vite.config.js` untuk mengarahkan request `/api` ke backend.
- Gunakan akun Admin untuk mengakses fitur Ekspor Data.
