# 📚 DOKUMENTASI PEMBELAJARAN - SISTEM ARSIP DIGITAL HOTEL

**Tanggal**: 14 Februari 2026  
**Proyek**: Arsip Digital Hotel - Sistem Manajemen Dokumen & Karyawan  
**Tech Stack**: React + Firebase + Tailwind CSS

---

## 🎯 RINGKASAN PROYEK

Aplikasi web untuk mengelola arsip dokumen hotel secara digital dengan fitur manajemen karyawan, divisi, dan autentikasi pengguna yang aman.

---

## 📂 STRUKTUR FOLDER UTAMA

```
arsip-hotel/
├── src/
│   ├── firebase/
│   │   └── config.jsx          # Konfigurasi Firebase (Auth, Firestore, Storage)
│   ├── pages/
│   │   ├── Login.jsx           # Halaman Login
│   │   ├── Register.jsx        # Halaman Pendaftaran
│   │   ├── ForgotPassword.jsx  # Halaman Lupa Password
│   │   ├── Home.jsx            # Dashboard Utama
│   │   ├── Divisi.jsx          # Manajemen Divisi
│   │   ├── Users.jsx           # Manajemen Pengguna
│   │   ├── Reports.jsx         # Halaman Laporan
│   │   └── UploadDocument.jsx  # Upload Dokumen
│   ├── components/
│   │   └── dashboard/
│   │       ├── sidebar/
│   │       │   └── NavigasiSamping.jsx    # Sidebar Navigasi
│   │       ├── divisi/
│   │       │   ├── KartuDivisi.jsx        # Card Divisi
│   │       │   └── GrafikDivisi.jsx       # Grafik Statistik Divisi
│   │       ├── pengguna/
│   │       │   ├── StatistikPengguna.jsx  # Statistik Karyawan
│   │       │   └── TabelPengguna.jsx      # Tabel Data Karyawan
│   │       ├── dokumen/
│   │       ├── laporan/
│   │       └── umum/
│   └── App.jsx                 # Router Utama
└── index.html                  # Entry Point HTML
```

---

## 🔥 FITUR YANG SUDAH DIBANGUN

### 1. **AUTENTIKASI (Authentication)**

#### A. Login (`src/pages/Login.jsx`)
**Fungsi Utama:**
- Login menggunakan email & password
- Validasi kredensial dengan Firebase Auth
- Redirect ke dashboard setelah berhasil login
- Error handling untuk kredensial salah

**Kode Penting:**
```javascript
import { signInWithEmailAndPassword } from 'firebase/auth';

const handleLogin = async (e) => {
    e.preventDefault();
    await signInWithEmailAndPassword(auth, email, password);
    navigate('/home');
};
```

**Konsep Pembelajaran:**
- `signInWithEmailAndPassword()` = Fungsi Firebase untuk login
- `e.preventDefault()` = Mencegah halaman refresh saat submit form
- `navigate()` = Pindah halaman tanpa reload (React Router)

---

#### B. Register (`src/pages/Register.jsx`)
**Fungsi Utama:**
- Pendaftaran user baru
- Simpan data ke Firebase Auth + Firestore
- Dropdown divisi dinamis dari database
- Validasi password match

**Kode Penting:**
```javascript
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { setDoc, doc } from 'firebase/firestore';

// 1. Buat akun di Firebase Auth
const userCredential = await createUserWithEmailAndPassword(auth, email, password);
const user = userCredential.user;

// 2. Update nama di profil
await updateProfile(user, { displayName: formData.name });

// 3. Simpan data tambahan ke Firestore
await setDoc(doc(db, 'users', user.uid), {
    uid: user.uid,
    name: formData.name,
    email: formData.email,
    division: formData.division,
    role: 'Staf',
    createdAt: new Date().toISOString()
});
```

**Konsep Pembelajaran:**
- `createUserWithEmailAndPassword()` = Buat akun baru
- `updateProfile()` = Update data profil user
- `setDoc()` = Simpan dokumen baru ke Firestore
- `doc(db, 'collection', 'id')` = Referensi ke dokumen tertentu

---

#### C. Forgot Password (`src/pages/ForgotPassword.jsx`)
**Fungsi Utama:**
- Kirim email reset password
- Feedback sukses/error ke user

**Kode Penting:**
```javascript
import { sendPasswordResetEmail } from 'firebase/auth';

await sendPasswordResetEmail(auth, email);
```

**Konsep Pembelajaran:**
- Firebase otomatis kirim email dengan link reset password
- User klik link → bisa set password baru

---

#### D. Logout (`src/components/dashboard/sidebar/NavigasiSamping.jsx`)
**Fungsi Utama:**
- Logout dari sistem
- Redirect ke halaman login

**Kode Penting:**
```javascript
import { signOut } from 'firebase/auth';

const handleLogout = async () => {
    if (window.confirm('Yakin mau keluar?')) {
        await signOut(auth);
        navigate('/login');
    }
};
```

---

### 2. **MANAJEMEN DIVISI** (`src/pages/Divisi.jsx`)

**Fungsi Utama:**
- CRUD (Create, Read, Update, Delete) divisi hotel
- Real-time data dari Firestore
- Modal untuk tambah/edit divisi

**Struktur Data Firestore:**
```javascript
// Collection: divisions
{
    name: "Back Office",
    description: "Urusan administrasi dan keuangan",
    userCount: 12,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
}
```

**Kode Penting:**

**A. Ambil Data Real-time:**
```javascript
import { collection, onSnapshot } from 'firebase/firestore';

useEffect(() => {
    const colRef = collection(db, 'divisions');
    
    // onSnapshot = Listener real-time, otomatis update kalau data berubah
    const unsubscribe = onSnapshot(colRef, (snapshot) => {
        const results = [];
        snapshot.docs.forEach((doc) => {
            results.push({ ...doc.data(), id: doc.id });
        });
        setDivisions(results);
    });
    
    return () => unsubscribe(); // Cleanup saat component unmount
}, []);
```

**B. Tambah Data:**
```javascript
import { addDoc, serverTimestamp } from 'firebase/firestore';

await addDoc(collection(db, 'divisions'), {
    name: formData.name,
    description: formData.description,
    userCount: 0,
    createdAt: serverTimestamp()
});
```

**C. Update Data:**
```javascript
import { updateDoc, doc } from 'firebase/firestore';

const docRef = doc(db, 'divisions', divisionId);
await updateDoc(docRef, {
    name: newName,
    description: newDescription,
    updatedAt: serverTimestamp()
});
```

**D. Hapus Data:**
```javascript
import { deleteDoc, doc } from 'firebase/firestore';

await deleteDoc(doc(db, 'divisions', divisionId));
```

**Konsep Pembelajaran:**
- `collection()` = Referensi ke koleksi (seperti tabel di SQL)
- `onSnapshot()` = Real-time listener (auto-update)
- `addDoc()` = Tambah dokumen baru (ID otomatis)
- `setDoc()` = Set dokumen dengan ID custom
- `updateDoc()` = Update field tertentu saja
- `deleteDoc()` = Hapus dokumen
- `serverTimestamp()` = Timestamp dari server Firebase (konsisten)

---

### 3. **MANAJEMEN PENGGUNA** (`src/pages/Users.jsx`)

**Fungsi Utama:**
- Tampilkan daftar karyawan dari Firestore
- Filter berdasarkan Role (Admin/Staf)
- Search berdasarkan nama, email, divisi
- Statistik otomatis (Total User, Admin, Staf)

**Struktur Data Firestore:**
```javascript
// Collection: users
{
    uid: "firebase-user-id",
    name: "Budi Santoso",
    email: "budi@hotel.com",
    division: "Front Office",
    role: "Admin", // atau "Staf"
    createdAt: "2026-02-14T12:00:00.000Z"
}
```

**Kode Penting:**

**A. Filter Gabungan (Search + Role):**
```javascript
const [searchTerm, setSearchTerm] = useState('');
const [roleFilter, setRoleFilter] = useState('Semua');

const filteredUsers = users.filter(user => {
    // Filter 1: Cari di nama, email, atau divisi
    const matchesSearch = 
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.division?.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filter 2: Filter berdasarkan role
    const matchesRole = roleFilter === 'Semua' || user.role === roleFilter;
    
    // Harus lolos kedua filter
    return matchesSearch && matchesRole;
});
```

**B. Hitung Statistik:**
```javascript
// Di StatistikPengguna.jsx
const adminCount = users.filter(u => u.role === 'Admin').length;
const stafCount = users.filter(u => u.role === 'Staf').length;
const totalUser = users.length;
```

**Konsep Pembelajaran:**
- `filter()` = Array method untuk menyaring data
- `includes()` = Cek apakah string mengandung substring
- `toLowerCase()` = Ubah ke huruf kecil (case-insensitive search)
- `?.` (Optional Chaining) = Cek null/undefined sebelum akses property

---

## 🎨 KOMPONEN REUSABLE

### 1. **NavigasiSamping** (Sidebar)
**File:** `src/components/dashboard/sidebar/NavigasiSamping.jsx`

**Fungsi:**
- Menu navigasi aplikasi
- Highlight menu aktif
- Logout button

**Kode Penting:**
```javascript
import { NavLink } from 'react-router-dom';

// NavLink otomatis kasih class 'active' ke menu yang sedang dibuka
<NavLink 
    to="/divisi"
    className={({ isActive }) => 
        isActive ? 'bg-primary text-white' : 'hover:bg-white/5'
    }
>
    <span className="material-symbols-outlined">corporate_fare</span>
    <span>Divisi</span>
</NavLink>
```

---

### 2. **KartuDivisi** (Division Card)
**File:** `src/components/dashboard/divisi/KartuDivisi.jsx`

**Fungsi:**
- Tampilkan info divisi dalam bentuk card
- Button Edit & Delete (muncul saat hover)

**Props:**
```javascript
<KartuDivisi 
    name="Back Office"
    description="Administrasi hotel"
    userCount={12}
    onEdit={() => handleEdit(divisi)}
    onDelete={() => handleDelete(divisi.id)}
/>
```

---

### 3. **TabelPengguna** (User Table)
**File:** `src/components/dashboard/pengguna/TabelPengguna.jsx`

**Fungsi:**
- Tampilkan data karyawan dalam tabel
- Badge warna berbeda untuk Admin vs Staf
- Inisial nama jika tidak ada foto

**Kode Penting:**
```javascript
// Ambil huruf pertama nama untuk avatar
const initial = user.name?.charAt(0).toUpperCase() || 'U';

// Conditional styling berdasarkan role
<span className={
    user.role === 'Admin' 
    ? 'bg-purple-100 text-purple-600' 
    : 'bg-blue-100 text-blue-600'
}>
    {user.role}
</span>
```

---

## 🔑 KONSEP FIREBASE PENTING

### 1. **Firestore Database**

**Struktur:**
```
Firestore (NoSQL Database)
├── divisions (Collection)
│   ├── doc1 (Document)
│   ├── doc2
│   └── doc3
├── users (Collection)
│   ├── user1
│   └── user2
└── documents (Collection)
```

**Perbedaan Collection vs Document:**
- **Collection** = Folder/Grup (seperti tabel di SQL)
- **Document** = File individual (seperti row di SQL)

---

### 2. **Real-time vs One-time Read**

**Real-time (onSnapshot):**
```javascript
// Auto-update saat data berubah
onSnapshot(collection(db, 'users'), (snapshot) => {
    // Kode ini jalan otomatis setiap ada perubahan
});
```

**One-time (getDocs):**
```javascript
// Ambil data sekali saja
const snapshot = await getDocs(collection(db, 'users'));
```

**Kapan pakai mana?**
- Real-time: Dashboard, chat, notifikasi
- One-time: Dropdown, data statis

---

### 3. **Security Rules (Penting!)**

Di Firebase Console, set rules:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Hanya user yang login bisa akses
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
    
    // Admin bisa edit semua, user cuma bisa edit data sendiri
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth.uid == userId || 
                      get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'Admin';
    }
  }
}
```

---

## 🎯 REACT HOOKS YANG DIGUNAKAN

### 1. **useState**
**Fungsi:** Simpan data yang bisa berubah

```javascript
const [users, setUsers] = useState([]);
const [loading, setLoading] = useState(true);

// Update state
setUsers(newData);
setLoading(false);
```

---

### 2. **useEffect**
**Fungsi:** Jalankan kode saat component pertama kali muncul

```javascript
useEffect(() => {
    // Kode ini jalan sekali saat component mount
    fetchData();
    
    return () => {
        // Cleanup saat component unmount
        unsubscribe();
    };
}, []); // [] = dependency array (kosong = cuma jalan sekali)
```

---

### 3. **useNavigate**
**Fungsi:** Pindah halaman

```javascript
import { useNavigate } from 'react-router-dom';

const navigate = useNavigate();
navigate('/home'); // Pindah ke /home
```

---

## 🎨 TAILWIND CSS PATTERNS

### 1. **Responsive Design**
```javascript
className="
    grid 
    grid-cols-1          // 1 kolom di mobile
    md:grid-cols-2       // 2 kolom di tablet
    lg:grid-cols-3       // 3 kolom di desktop
    xl:grid-cols-4       // 4 kolom di layar besar
"
```

### 2. **Dark Mode**
```javascript
className="
    bg-white             // Background putih di light mode
    dark:bg-slate-900    // Background gelap di dark mode
    text-slate-900       // Text hitam di light mode
    dark:text-white      // Text putih di dark mode
"
```

### 3. **Hover Effects**
```javascript
className="
    hover:bg-blue-600    // Warna berubah saat hover
    hover:scale-105      // Membesar sedikit saat hover
    transition-all       // Animasi smooth
"
```

---

## 📝 BEST PRACTICES

### 1. **Error Handling**
```javascript
try {
    await someFirebaseFunction();
    alert('Berhasil!');
} catch (err) {
    console.error(err);
    alert('Gagal: ' + err.message);
}
```

### 2. **Loading States**
```javascript
const [loading, setLoading] = useState(true);

{loading ? (
    <div>Loading...</div>
) : (
    <div>Data sudah muncul</div>
)}
```

### 3. **Conditional Rendering**
```javascript
{users.length > 0 ? (
    <TabelPengguna users={users} />
) : (
    <p>Tidak ada data</p>
)}
```

---

## 🚀 CARA MENJALANKAN APLIKASI

### Development Mode:
```bash
npm run dev
```

### Build Production:
```bash
npm run build
```

### Preview Production Build:
```bash
npm run preview
```

---

## 📚 RESOURCES PEMBELAJARAN

### Firebase:
- [Firebase Docs](https://firebase.google.com/docs)
- [Firestore Guide](https://firebase.google.com/docs/firestore)
- [Firebase Auth](https://firebase.google.com/docs/auth)

### React:
- [React Docs](https://react.dev)
- [React Router](https://reactrouter.com)
- [React Hooks](https://react.dev/reference/react)

### Tailwind CSS:
- [Tailwind Docs](https://tailwindcss.com/docs)
- [Tailwind Cheatsheet](https://nerdcave.com/tailwind-cheat-sheet)


## 🐛 TROUBLESHOOTING UMUM

### 1. "Firebase not initialized"
**Solusi:** Pastikan `import { db } from '../firebase/config'` sudah benar

### 2. "Cannot read property of undefined"
**Solusi:** Gunakan optional chaining `user?.name` atau cek null dulu

### 3. "Permission denied"
**Solusi:** Cek Firebase Rules, pastikan user sudah login

### 4. Data tidak muncul
**Solusi:** 
- Cek console browser (F12)
- Pastikan collection name benar
- Cek apakah ada data di Firebase Console

---

## ✅ CHECKLIST FITUR

- [x] Login
- [x] Register
- [x] Forgot Password
- [x] Logout
- [x] Manajemen Divisi (CRUD)
- [x] Manajemen Pengguna (Read + Filter)
- [ ] Manajemen Dokumen (Upload/Download)
- [ ] Edit Profile
- [ ] Upload Foto Profil
- [ ] Notifikasi
- [ ] Export Data
- [ ] Dashboard Analytics

---

**Dibuat dengan ❤️ untuk pembelajaran**  
**Terus belajar dan jangan takut error!** 🚀
