// ============================================
// FILE: main.jsx
// FUNGSI: Pintu masuk utama aplikasi React
// ============================================

// Import StrictMode dari React
// StrictMode = Mode ketat yang bantu kita deteksi error/bug saat development
// Kayak guru yang galak tapi baik - kasih warning kalau ada yang salah
import { StrictMode } from 'react';

// Import createRoot - Fungsi buat "nancapin" React ke HTML
// Bayangin kayak nancapin poster ke dinding
import { createRoot } from 'react-dom/client';

// Import CSS utama - Ini yang bikin tampilan aplikasi keren
// File ini berisi konfigurasi Tailwind CSS
import './index.css';

// Import komponen App - Otak utama aplikasi kita
import App from './App.jsx';

// ============================================
// IMPORT CONTEXT PROVIDERS
// ============================================
// Context = Wadah global buat nyimpen data yang bisa diakses dari mana aja
import { AuthProvider } from './contexts/AuthContext';
import { FirestoreProvider } from './contexts/FirestoreContext';

// ============================================
// RENDER APLIKASI KE BROWSER
// ============================================

// Langkah 1: Cari elemen HTML dengan id="root" di index.html
// Langkah 2: Bikin "root" React di situ
// Langkah 3: Render (tampilkan) komponen App
createRoot(document.getElementById('root')).render(
  // StrictMode = Wrapper yang aktifkan mode development ketat
  // Cuma jalan di development, gak ngaruh di production
  <StrictMode>
    {/* AuthProvider = Bungkus app dengan context autentikasi */}
    {/* Sekarang semua komponen bisa akses user login/logout */}
    <AuthProvider>
      {/* FirestoreProvider = Bungkus app dengan context database */}
      {/* Sekarang semua komponen bisa CRUD ke Firestore */}
      <FirestoreProvider>
        {/* Komponen App = Isi utama aplikasi kita */}
        <App />
      </FirestoreProvider>
    </AuthProvider>
  </StrictMode>
);

/*
  ============================================
  CARA KERJA (Step by Step):
  ============================================
  
  1. Browser buka index.html
  2. index.html punya <div id="root"></div> (kosong)
  3. File main.jsx ini jalan
  4. createRoot() cari div dengan id="root"
  5. Render komponen <App /> ke dalam div itu
  6. App dibungkus dengan Context Providers
  7. Aplikasi React muncul di browser!
  
  ============================================
  STRUKTUR WRAPPING:
  ============================================
  
  StrictMode (Mode development ketat)
    ↓
  AuthProvider (Context autentikasi)
    ↓
  FirestoreProvider (Context database)
    ↓
  App (Aplikasi utama)
    ↓
  Routes (Routing halaman)
    ↓
  Pages (Halaman-halaman)
  
  ============================================
  KENAPA PAKAI CONTEXT?
  ============================================
  
  Tanpa Context:
  - Harus import auth di setiap file
  - Harus import firestore functions di setiap file
  - Props drilling (kirim data lewat banyak komponen)
  
  Dengan Context:
  - Tinggal pakai useAuth() atau useFirestore()
  - Gak perlu props drilling
  - Centralized logic
  - Mudah maintain
  
  ============================================
  FILE YANG TERHUBUNG:
  ============================================
  
  index.html (root)
     ↓
  main.jsx (entry point) ← KITA DI SINI
     ↓
  contexts/AuthContext.jsx (auth logic)
  contexts/FirestoreContext.jsx (database logic)
     ↓
  App.jsx (routing)
     ↓
  pages/*.jsx (halaman-halaman)
*/

