// ============================================
// FILE: Users.jsx
// FUNGSI: Halaman Manajemen Pengguna/Karyawan
// FITUR: Lihat daftar karyawan, filter by role, search
// ============================================

import React, { useState, useEffect } from 'react';
import Layout from '../components/layout/Layout';
import StatistikPengguna from '../components/dashboard/pengguna/StatistikPengguna';
import TabelPengguna from '../components/dashboard/pengguna/TabelPengguna';
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
        <Layout title="Manajemen Pengguna" hideFAB={true}>
            <div className="flex flex-col gap-6">
                {/* Header Section for Users Page */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Manajemen Pengguna</h2>
                        <p className="text-slate-500 dark:text-slate-400 text-sm md:text-base">Monitoring dan kelola akses karyawan hotel.</p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl w-full sm:w-auto overflow-x-auto">
                            {['Semua', 'Admin', 'Staf'].map((role) => (
                                <button
                                    key={role}
                                    onClick={() => setRoleFilter(role)}
                                    className={`flex-1 sm:flex-none px-4 py-1.5 rounded-lg text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${roleFilter === role
                                        ? 'bg-white dark:bg-slate-700 text-primary shadow-sm'
                                        : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                                        }`}
                                >
                                    {role}
                                </button>
                            ))}
                        </div>

                        <div className="relative w-full sm:w-64">
                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-bold">search</span>
                            <input
                                className="w-full pl-9 pr-4 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary outline-none transition-all placeholder:text-slate-400 font-medium"
                                placeholder="Cari nama, email..."
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="size-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                    </div>
                ) : (
                    <div className="space-y-6">
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
                className="fixed bottom-8 right-8 flex items-center gap-2 px-6 py-4 bg-primary text-white rounded-full font-bold shadow-2xl shadow-primary/40 hover:scale-105 active:scale-95 transition-all z-40"
            >
                <span className="material-symbols-outlined font-bold">person_add</span>
                <span className="text-sm tracking-wide hidden sm:inline">Tambah Karyawan</span>
            </button>

            {/* ========== MODAL FORM ========== */}
            {showModal && (
                <div className="fixed inset-0 z-110 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                    <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                            <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase">
                                {isEditing ? 'Perbarui Profil Karyawan' : 'Daftarkan Karyawan Baru'}
                            </h3>
                            <button onClick={handleCloseModal} className="text-slate-400 hover:text-red-500 transition-colors">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-5">
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
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
        </Layout>
    );
};

export default Users;
