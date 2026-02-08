# Panduan Belajar: Pembuatan Halaman Login React & Tailwind CSS

Dokumen ini menjelaskan langkah-langkah teknis yang dilakukan untuk mengubah desain HTML statis menjadi komponen Login yang fungsional di React.

## 1. Persiapan Lingkungan (Setup)
Langkah pertama adalah memastikan Tailwind CSS terpasang dengan benar karena desain ini sangat bergantung pada utilitas Tailwind.

### Instalasi Dependensi:
```bash
npm install -D tailwindcss postcss autoprefixer @tailwindcss/forms @tailwindcss/container-queries
```
*   **@tailwindcss/forms**: Digunakan untuk mereset gaya default input agar mudah dikustomisasi.
*   **@tailwindcss/container-queries**: Memungkinkan styling berdasarkan ukuran container (bukan hanya viewport).

## 2. Konfigurasi Tailwind (`tailwind.config.js`)
Penting untuk mendaftarkan warna dan font kustom agar kita bisa menggunakan class seperti `bg-primary` atau `font-display`.

```javascript
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class", // Mengaktifkan dark mode berbasis class
  theme: {
    extend: {
      colors: {
        "primary": "#135bec",
        "background-light": "#f6f6f8",
        "background-dark": "#101622",
      },
      fontFamily: {
        "display": ["Inter", "sans-serif"]
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/container-queries'),
  ],
}
```

## 3. Integrasi Font & Ikon (`index.html`)
Agar ikon dan font muncul, kita perlu menambahkan link dari Google Fonts:
*   **Inter**: Untuk tipografi teks yang modern.
*   **Material Symbols Outlined**: Untuk ikon seperti email (mail), gembok (lock), dan centang (verified).

## 4. Struktur Komponen React (`src/pages/Login.jsx`)
Dalam React, kita membagi kode menjadi bagian-bagian kecil (mobile-first approach).

### Konsep Utama:
1.  **Layout Split-Screen**: Menggunakan `flex` dengan `lg:w-1/2`. Di mobile (`hidden lg:flex`), bagian gambar disembunyikan.
2.  **Formulir Interaktif**:
    *   Menggunakan `group` dan `group-focus-within` pada icon agar ikon berubah warna menjadi biru saat input sedang diketik.
    *   `onSubmit={(e) => e.preventDefault()}` digunakan agar halaman tidak *refresh* saat tombol login ditekan.
3.  **Glassmorphism**: Digunakan pada logo overlay (`backdrop-blur-md`) untuk memberikan kesan transparan yang mewah.

## 5. Routing (`src/App.jsx`)
Agar halaman bisa diakses, kita menggunakan `react-router-dom`:
```jsx
<Routes>
  <Route path="/" element={<Login />} />
  <Route path="/login" element={<Login />} />
</Routes>
```

## Tips untuk Belajar:
*   **Dark Mode**: Coba tambahkan class `dark` pada tag `<html>` di browser inspector untuk melihat bagaimana desain berubah secara otomatis.
*   **Responsive**: Gunakan mode "Inspect" di browser dan ganti ke tampilan Mobile (HP) untuk melihat bagaimana bagian kiri menghilang.
*   **Tailwind Utilities**: Perhatikan penggunaan `gap-5`, `rounded-lg`, dan `shadow-lg` yang mempermudah pengaturan layout tanpa menulis CSS manual.

## 6. Konfigurasi Firebase (`src/firebase/config.jsx`)
Untuk menghubungkan aplikasi dengan database dan sistem login:
1.  **Ekspor Layanan**: Selain `initializeApp`, kita juga mengekspor `auth` (untuk login), `db` (untuk database Firestore), dan `rtdb` (untuk Realtime Database).
2.  **Pemakaian**: Anda bisa mengimpor layanan ini di komponen manapun dengan cara `import { auth } from '../firebase/config'`.

## 7. Struktur Dashboard Admin (`src/pages/Home.jsx`)
Untuk menjaga kode tetap bersih (*clean code*), halaman dashboard dibagi menjadi beberapa komponen kecil:
*   **Sidebar.jsx**: Navigasi utama di bagian kiri.
*   **TopHeader.jsx**: Bagian atas yang berisi judul modul dan tombol aksi cepat.
*   **SearchFilters.jsx**: Area pencarian dan filter dokumen.
*   **DocumentTable.jsx**: Tabel utama untuk menampilkan daftar arsip.

Pemisahan ini memudahkan Anda jika ingin mengubah satu bagian tanpa mengganggu bagian lainnya. Semua komponen ini disimpan di dalam folder `src/components/dashboard/`.

---
*Dibuat untuk proyek: Arsip Digital Hotel*
