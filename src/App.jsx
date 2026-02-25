// ============================================
// FILE: App.jsx
// FUNGSI: Otak routing aplikasi - Atur jalan-jalan antar halaman
// ============================================

// Import library routing dari React Router
// Router = Mobil yang bawa kita pindah-pindah halaman
// Routes = Daftar jalan yang bisa dilalui
// Route = Satu jalan spesifik (misal: /login ke halaman Login)
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import semua halaman yang kita punya
import Login from './pages/Login'; // Halaman buat masuk ke sistem
import Register from './pages/Register'; // Halaman daftar akun baru
import ForgotPassword from './pages/ForgotPassword'; // Halaman lupa password
import Home from './pages/Home'; // Dashboard utama setelah login
import DaftarArsip from './pages/DaftarArsip'; // Halaman daftar arsip/dokumen
import UploadDocument from './pages/UploadDocument'; // Halaman upload dokumen
import Divisi from './pages/Divisi'; // Halaman kelola divisi hotel
import Kategori from './pages/Kategori'; // Halaman kelola kategori arsip
import Users from './pages/Users'; // Halaman kelola karyawan
import GantiPassword from './pages/GantiPassword'; // Halaman ganti password
import Reports from './pages/Reports'; // Halaman lihat laporan
import Profile from './pages/Profile'; // Halaman profil pengguna
import PreviewArsip from './pages/PreviewArsip'; // Halaman pratinjau dokumen
import Trash from './pages/Trash'; // Halaman tempat sampah

import './App.css'; // File CSS khusus buat styling App

// ============================================
// KOMPONEN UTAMA APP
// ============================================
function App() {
  return (
    // Router = Wrapper utama yang bikin aplikasi bisa pindah halaman tanpa reload
    // Konsep: Single Page Application (SPA) - cuma 1 halaman HTML, tapi kontennya ganti-ganti
    <Router>
      {/* Routes = Wadah yang nampung semua jalur/rute */}
      <Routes>

        {/* ========== ROUTE AUTENTIKASI ========== */}

        {/* Route Login - Kalau user buka /login, tampilkan komponen Login */}
        <Route path="/login" element={<Login />} />

        {/* Route Register - Buat daftar akun baru */}
        <Route path="/register" element={<Register />} />

        {/* Route Lupa Password - Buat reset password lewat email */}
        <Route path="/forgot-password" element={<ForgotPassword />} />


        {/* ========== ROUTE DASHBOARD ========== */}

        {/* Route Home - Dashboard utama setelah login */}
        <Route path="/home" element={<Home />} />

        {/* Route Daftar Arsip - Halaman lihat semua arsip/dokumen */}
        <Route path="/daftar-arsip" element={<DaftarArsip />} />

        {/* Route Upload - Halaman buat upload dokumen hotel */}
        <Route path="/upload" element={<UploadDocument />} />

        {/* Route Divisi - Kelola divisi hotel (Back Office, Housekeeping, dll) */}
        <Route path="/divisi" element={<Divisi />} />

        {/* Route Kategori - Kelola kategori arsip */}
        <Route path="/kategori" element={<Kategori />} />

        {/* Route Users - Kelola data karyawan */}
        <Route path="/users" element={<Users />} />

        {/* Route Ganti Password - Ubah kredensial user */}
        <Route path="/ganti-password" element={<GantiPassword />} />

        {/* Route Reports - Lihat laporan dan statistik */}
        <Route path="/reports" element={<Reports />} />

        {/* Route Profile - Lihat dan edit profil user */}
        <Route path="/profile" element={<Profile />} />

        {/* Route Preview - Lihat detail dan pratinjau arsip */}
        <Route path="/preview/:id" element={<PreviewArsip />} />

        {/* Route Trash - Lihat arsip yang dihapus */}
        <Route path="/trash" element={<Trash />} />


        {/* ========== DEFAULT ROUTE ========== */}

        {/* 
          Route default - Kalau user buka website pertama kali (/)
          Langsung arahkan ke halaman Login
          Contoh: localhost:5173/ → otomatis ke localhost:5173/login
        */}
        <Route path="/" element={<Login />} />

      </Routes>
    </Router>
  );
}

// Export App biar bisa dipanggil di main.jsx
// Tanpa ini, main.jsx gak bisa render App
export default App;

/*
  ============================================
  CARA KERJA ROUTING:
  ============================================
  
  1. User ketik URL di browser: localhost:5173/divisi
  2. Router cek: "Ada gak Route dengan path="/divisi"?"
  3. Ketemu! Tampilkan komponen <Divisi />
  4. Halaman ganti TANPA reload (cepat!)
  
  ============================================
  PERBEDAAN DENGAN WEBSITE BIASA:
  ============================================
  
  Website Biasa (Multi-Page):
  - Klik link → Browser muat halaman baru → Lambat
  - Setiap halaman = file HTML terpisah
  
  React SPA (Single-Page):
  - Klik link → Ganti komponen aja → Cepat!
  - Cuma 1 file HTML, konten diganti pakai JavaScript
  
  ============================================
  TIPS BELAJAR:
  ============================================
  
  1. Coba tambah route baru:
     <Route path="/profile" element={<Profile />} />
  
  2. Coba bikin halaman 404 (Not Found):
     <Route path="*" element={<NotFound />} />
  
  3. Coba route dengan parameter:
     <Route path="/divisi/:id" element={<DetailDivisi />} />
     Nanti bisa ambil ID-nya pakai useParams()
*/
