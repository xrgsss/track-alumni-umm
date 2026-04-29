# UMM Alumni Tracker - Official Alumni Tracking System

Platform cerdas untuk memantau, mengelola, dan menjalin koneksi berkelanjutan dengan para lulusan terbaik Universitas Muhammadiyah Malang.

## Overview

**UMM Alumni Tracker** dirancang untuk memudahkan institusi dalam melacak keberhasilan alumni secara global. Dengan antarmuka yang modern dan responsif, sistem ini memberikan pengalaman pengguna yang premium dan efisien.

## Teknologi yang Digunakan

- **Frontend:** HTML5, Tailwind CSS, Lucide Icons
- **Backend:** Node.js, Express.js
- **Framework UI:** React (Vite) - *Modern version*
- **Database:** JSON / PostgreSQL (Production)
- **Deployment:** Vercel

## Akses Website

Kunjungi aplikasi secara langsung di:
[https://track-alumni-umm.vercel.app](https://track-alumni-umm.vercel.app)

## Fitur Utama

- **Premium Landing Page:** Desain modern dengan *glassmorphism* dan animasi yang halus.
- **Pencarian Cerdas:** Cari alumni berdasarkan Nama, NIM, atau Program Studi secara instan.
- **Admin Dashboard:** Kelola seluruh database alumni dengan hak akses terproteksi.
- **CRUD Operations:** Tambah, edit, dan hapus data alumni dengan validasi data yang ketat.
- **Sistem Keamanan:** Login multi-role (Admin/User) dilengkapi dengan verifikasi CAPTCHA.
- **Export Data:** Kemudahan mengekspor data alumni untuk kebutuhan administrasi.

## Pengujian Sistem (UAT)

| No | Fitur yang Diuji | Skenario Pengujian | Hasil yang Diharapkan | Status |
|----|------------------|--------------------|----------------------|--------|
| 1 | Pencarian Tanpa Login | Pengunjung mencari data melalui kolom pencarian di landing page | Data alumni tampil sesuai kata kunci |  Berhasil |
| 2 | Login Admin | Memasukkan kredensial admin yang valid | Akses penuh ke fitur CRUD Dashboard |  Berhasil |
| 3 | Tambah Alumni | Admin mengisi form data alumni baru | Data tersimpan permanen di database |  Berhasil |
| 4 | Edit Data | Admin mengubah informasi alumni yang sudah ada | Perubahan langsung terrefleksi di tabel |  Berhasil |
| 5 | Hapus Data | Admin menghapus entri data alumni | Data terhapus dari sistem secara aman |  Berhasil |
| 6 | Keamanan Captcha | Melakukan login tanpa verifikasi robot | Sistem menolak akses hingga verifikasi selesai |  Berhasil |

## Kredensial Akses

| Role | Username | Password | Hak Akses |
|------|----------|----------|-----------|
| **Admin** | `admin` | `admin123` | Full Access (CRUD + Export) |
| **User** | `user` | `user123` | Read-only Access |

---
&copy; 2026 Universitas Muhammadiyah Malang. *Unggul, Global, Inovatif, Sinergi.*
