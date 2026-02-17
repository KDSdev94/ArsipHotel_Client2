// ============================================
// FILE: Users.jsx
// FUNGSI: Halaman Manajemen Pengguna/Karyawan
// FITUR: Lihat daftar karyawan, filter by role, search
// ============================================

import React, { useState, useEffect } from 'react';
import NavigasiSamping from '../components/dashboard/sidebar/NavigasiSamping';
import StatistikPengguna from '../components/dashboard/pengguna/StatistikPengguna';
import TabelPengguna from '../components/dashboard/pengguna/TabelPengguna';
import Footer from '../components/dashboard/umum/Footer';

import { useFirestore } from '../contexts/FirestoreContext';
import { useAuth } from '../contexts/AuthContext';

const Users = () => {
    // ============================================
    // STATE MANAGEMENT
    // ============================================
    const { subscribeToCollection, addDocument, updateDocument, deleteDocument, getDocuments, setDocument } = useFirestore();
    const { signUpByAdmin } = useAuth();

    const [users, setUsers] = useState([]);
    const [divisions, setDivisions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('Semua');

    // State untuk Modal & Form
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentId, setCurrentId] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        division: '',
        role: 'Staf'
    });

    // ============================================
    // DATA FETCHING (REAL-TIME & ONE-TIME)
    // ============================================
    useEffect(() => {
        // Subscribe data user secara real-time
        const unsubscribe = subscribeToCollection('users', (data) => {
            setUsers(data);
            setLoading(false);
        });

        // Ambil data divisi untuk dropdown di modal
        const fetchDivisions = async () => {
            const result = await getDocuments('divisions');
            if (result.success) setDivisions(result.data);
        };
        fetchDivisions();

        return () => {
            if (unsubscribe) unsubscribe();
        };
    }, []);

    // ============================================
    // FUNGSI AKSI (CRUD)
    // ============================================
    const handleOpenModal = (user = null) => {
        if (user) {
            setIsEditing(true);
            setCurrentId(user.id);
            setFormData({
                name: user.name || '',
                email: user.email || '',
                password: '', // Password tidak diedit di sini
                division: user.division || '',
                role: user.role || 'Staf'
            });
        } else {
            setIsEditing(false);
            setFormData({ name: '', email: '', password: '', division: '', role: 'Staf' });
        }
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setFormData({ name: '', email: '', password: '', division: '', role: 'Staf' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (isEditing) {
            // Update cuma dokumen di Firestore
            const { password, ...updateData } = formData;
            const result = await updateDocument('users', currentId, updateData);
            if (result.success) alert('Data pengguna berhasil diperbarui!');
            else alert('Gagal memperbarui: ' + result.error);
        } else {
            // 1. Cek password
            if (formData.password.length < 6) {
                alert('Password minimal 6 karakter');
                return;
            }

            // 2. Buat akun di Auth (Security: tidak login sebagai user baru)
            const authRes = await signUpByAdmin(formData.email, formData.password, formData.name);

            if (!authRes.success) {
                alert('Gagal buat akun: ' + authRes.error);
                return;
            }

            // 3. Simpan profil lengkap ke Firestore pake UID dari Auth
            const { password, ...firestoreData } = formData;
            const result = await setDocument('users', authRes.uid, {
                ...firestoreData,
                uid: authRes.uid,
                createdAt: new Date().toISOString()
            });

            if (result.success) {
                alert('Pengguna & Akun berhasil dibuat!');
            } else {
                alert('Akun terdaftar tapi profil gagal disimpan: ' + result.error);
            }
        }
        handleCloseModal();
    };

    const handleDelete = async (id) => {
        if (window.confirm('Hapus pengguna ini dari database?')) {
            const result = await deleteDocument('users', id);
            if (result.success) alert('Pengguna berhasil dihapus!');
            else alert('Gagal menghapus: ' + result.error);
        }
    };

    // ============================================
    // FILTER DATA (SEARCH + ROLE)
    // ============================================
    const filteredUsers = users.filter(user => {
        const matchesSearch =
            user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.division?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesRole = roleFilter === 'Semua' || user.role === roleFilter;
        return matchesSearch && matchesRole;
    });

    return (
        <div className="flex h-screen overflow-hidden bg-white dark:bg-background-dark font-display text-slate-800 dark:text-slate-200">
            <NavigasiSamping />

            <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
                {/* ========== HEADER ========== */}
                <header className="h-20 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-8 shrink-0">
                    <div className="flex flex-col">
                        <h2 className="text-slate-800 dark:text-white text-xl font-bold uppercase tracking-tight">Manajemen Pengguna</h2>
                        <p className="text-slate-500 text-xs mt-0.5 font-medium">Monitoring dan kelola akses karyawan hotel</p>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                            {['Semua', 'Admin', 'Staf'].map((role) => (
                                <button
                                    key={role}
                                    onClick={() => setRoleFilter(role)}
                                    className={`px-4 py-1.5 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${roleFilter === role
                                        ? 'bg-white dark:bg-slate-700 text-primary shadow-sm'
                                        : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                                        }`}
                                >
                                    {role}
                                </button>
                            ))}
                        </div>

                        <div className="relative">
                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-bold">search</span>
                            <input
                                className="pl-9 pr-4 py-2.5 bg-slate-100 dark:bg-slate-800 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary w-64 outline-none transition-all placeholder:text-slate-400 font-medium"
                                placeholder="Cari nama, email..."
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </header>

                {/* ========== CONTENT AREA ========== */}
                <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                    {loading ? (
                        <div className="flex justify-center py-20">
                            <div className="size-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                        </div>
                    ) : (
                        <div className="max-w-7xl mx-auto space-y-6">
                            <StatistikPengguna users={users} />
                            <TabelPengguna
                                users={filteredUsers}
                                totalCount={users.length}
                                onEdit={handleOpenModal}
                                onDelete={handleDelete}
                            />
                        </div>
                    )}
                </div>

                {/* ========== FLOATING BUTTON ========== */}
                <button
                    onClick={() => handleOpenModal()}
                    className="absolute bottom-8 right-8 flex items-center gap-2 px-6 py-4 bg-primary text-white rounded-full font-bold shadow-2xl shadow-primary/40 hover:scale-105 active:scale-95 transition-all z-10"
                >
                    <span className="material-symbols-outlined font-bold">person_add</span>
                    <span className="text-sm tracking-wide">Tambah Karyawan</span>
                </button>

                {/* ========== MODAL FORM ========== */}
                {showModal && (
                    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                        <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                                <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase">
                                    {isEditing ? 'Perbarui Profil Karyawan' : 'Daftarkan Karyawan Baru'}
                                </h3>
                                <button onClick={handleCloseModal} className="text-slate-400 hover:text-red-500 transition-colors">
                                    <span className="material-symbols-outlined">close</span>
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="p-8 space-y-5">
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-[11px] font-black uppercase text-slate-400 mb-2 tracking-widest">Nama Lengkap</label>
                                        <input
                                            required
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-primary outline-none transition-all text-sm font-bold"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            placeholder="Masukkan nama lengkap..."
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-black uppercase text-slate-400 mb-2 tracking-widest">Alamat Email</label>
                                        <input
                                            required
                                            type="email"
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-primary outline-none transition-all text-sm font-bold"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            placeholder="email@hotel.com"
                                        />
                                    </div>

                                    {!isEditing && (
                                        <div>
                                            <label className="block text-[11px] font-black uppercase text-slate-400 mb-2 tracking-widest">Kata Sandi Awal</label>
                                            <input
                                                required
                                                type="password"
                                                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-primary outline-none transition-all text-sm font-bold"
                                                value={formData.password}
                                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                                placeholder="Minimal 6 karakter..."
                                            />
                                            <p className="text-[10px] text-slate-400 mt-1 font-medium italic">*Berikan password ini kepada karyawan terkait</p>
                                        </div>
                                    )}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-[11px] font-black uppercase text-slate-400 mb-2 tracking-widest">Divisi</label>
                                            <select
                                                required
                                                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-primary outline-none transition-all text-sm font-bold"
                                                value={formData.division}
                                                onChange={(e) => setFormData({ ...formData, division: e.target.value })}
                                            >
                                                <option value="">Pilih Divisi</option>
                                                {divisions.map(div => (
                                                    <option key={div.id} value={div.name}>{div.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-[11px] font-black uppercase text-slate-400 mb-2 tracking-widest">Peran / Role</label>
                                            <select
                                                required
                                                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-primary outline-none transition-all text-sm font-bold"
                                                value={formData.role}
                                                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                            >
                                                <option value="Staf">Staf</option>
                                                <option value="Admin">Admin</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-6">
                                    <button type="submit" className="w-full py-4 bg-primary text-white font-black rounded-xl shadow-lg shadow-primary/20 hover:bg-blue-700 transition-all flex items-center justify-center gap-2">
                                        <span className="material-symbols-outlined text-[20px] font-bold">{isEditing ? 'save_as' : 'person_add'}</span>
                                        {isEditing ? 'Simpan Perubahan' : 'Daftarkan Profil'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
                <Footer />
            </main>
        </div>
    );
};

export default Users;

/*
  ============================================
  KONSEP PENTING: REAL-TIME LISTENER
  ============================================
  
  onSnapshot vs getDocs:
  
  getDocs (One-time read):
  - Ambil data sekali aja
  - Kalau data berubah di Firebase, gak auto-update
  - Lebih hemat resource
  
  onSnapshot (Real-time):
  - Dengerin perubahan data terus-menerus
  - Kalau ada yang tambah/edit/hapus user, otomatis update
  - Cocok buat dashboard yang butuh data fresh
  
  ============================================
  KONSEP: FILTER GABUNGAN
  ============================================
  
  Filter bertingkat:
  1. Filter by search (nama/email/divisi)
  2. Filter by role (Admin/Staf)
  
  Contoh:
  - User pilih "Admin" + ketik "budi"
  - Hasil: Cuma admin yang namanya ada "budi"
  
  ============================================
  KONSEP: PROPS DRILLING
  ============================================
  
  Data mengalir dari parent ke child:
  
  Users.jsx (parent)
    ↓ pass users={users}
  StatistikPengguna.jsx (child)
    ↓ hitung total, admin, staf
  Tampilkan di UI
  
  ============================================
  TIPS OPTIMASI:
  ============================================
  
  1. Pakai useMemo buat filter yang berat:
     const filteredUsers = useMemo(() => {
       return users.filter(...)
     }, [users, searchTerm, roleFilter]);
  
  2. Debounce search input (delay 300ms):
     Biar gak filter setiap ketik huruf
  
  3. Pagination: Kalau user banyak (1000+)
     Jangan load semua sekaligus
  
  ============================================
  LATIHAN:
  ============================================
  
  1. Tambah filter berdasarkan divisi
  2. Tambah sort (A-Z, Z-A, Terbaru)
  3. Tambah export ke Excel
  4. Implementasi pagination (10 user per halaman)
*/
