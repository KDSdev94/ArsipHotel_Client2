// ============================================
// FILE: Kategori.jsx
// FUNGSI: Halaman Manajemen Kategori Arsip
// FITUR: CRUD (Tambah, Edit, Hapus) kategori arsip
// ============================================

import React, { useState, useEffect, useMemo } from 'react';
import Layout from '../components/layout/Layout';
import { useFirestore } from '../contexts/FirestoreContext';
import { useSupabase } from '../contexts/SupabaseContext';

const Kategori = () => {
    // ============================================
    // STATE MANAGEMENT
    // ============================================
    const { subscribeToCollection, addDocument, updateDocument, deleteDocument } = useFirestore();
    const { getArchives } = useSupabase();

    const [categories, setCategories] = useState([]);
    const [archives, setArchives] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentId, setCurrentId] = useState(null);

    // Initial state untuk form
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        count: 0
    });

    const fetchData = React.useCallback(async () => {
        // Ambil data arsip buat ngitung jumlah rill per kategori
        const arcResult = await getArchives();
        if (arcResult.success) {
            setArchives(arcResult.data);
        }
    }, [getArchives]);

    useEffect(() => {
        const initFetch = async () => {
            await Promise.resolve();
            fetchData();
        };
        initFetch();

        // Ambil data kategori secara real-time dari koleksi 'categories'
        const unsubscribe = subscribeToCollection('categories', (data) => {
            setCategories(data);
            setLoading(false);
        });

        // Auto Refresh
        window.addEventListener('focus', fetchData);

        // Cleanup: Berhenti dengerin data pas pindah halaman
        return () => {
            if (unsubscribe) unsubscribe();
            window.removeEventListener('focus', fetchData);
        };
    }, [fetchData, subscribeToCollection]);

    // Gabungkan data kategori dengan hitungan rill dari archives
    const categoriesWithCount = useMemo(() => {
        return categories.map(cat => {
            const realCount = archives.filter(arc => arc.kategori === cat.name).length;
            return { ...cat, realCount };
        });
    }, [categories, archives]);

    // ============================================
    // FUNGSI MODAL
    // ============================================
    const handleOpenModal = (cat = null) => {
        if (cat) {
            // Kalau ada data, berarti mau EDIT
            setIsEditing(true);
            setCurrentId(cat.id);
            setFormData({
                name: cat.name,
                description: cat.description || '',
                count: cat.count || 0
            });
        } else {
            // Kalau kosong, berarti mau TAMBAH BARU
            setIsEditing(false);
            setFormData({ name: '', description: '', count: 0 });
        }
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setFormData({ name: '', description: '', count: 0 });
    };

    // ============================================
    // FUNGSI SIMPAN (TAMBAH / EDIT)
    // ============================================
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (isEditing) {
            // Proses Update ke Firebase
            const result = await updateDocument('categories', currentId, formData);
            if (result.success) {
                alert('Kategori berhasil diperbarui!');
            } else {
                alert('Gagal memperbarui: ' + result.error);
            }
        } else {
            // Proses Tambah Baru ke Firebase
            const result = await addDocument('categories', formData);
            if (result.success) {
                alert('Kategori baru berhasil ditambahkan!');
            } else {
                alert('Gagal menambah: ' + result.error);
            }
        }
        handleCloseModal();
    };

    // ============================================
    // FUNGSI HAPUS
    // ============================================
    const handleDelete = async (id) => {
        if (window.confirm('Hapus kategori ini? Tindakan ini tidak dapat dibatalkan.')) {
            const result = await deleteDocument('categories', id);
            if (result.success) {
                alert('Kategori dihapus!');
            } else {
                alert('Gagal menghapus: ' + result.error);
            }
        }
    };

    return (
        <Layout title="Manajemen Kategori">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-slate-900 dark:text-white text-2xl font-bold mb-1">Manajemen Kategori Arsip</h1>
                    <p className="text-slate-500 text-sm font-medium">Kelola label kategori untuk mempermudah pengarsipan dokumen.</p>
                </div>
                {/* Tombol Tambah */}
                <button
                    onClick={() => handleOpenModal()}
                    className="flex items-center justify-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-sm transition-all shadow-md shadow-emerald-200 dark:shadow-none"
                >
                    <span className="material-symbols-outlined text-[18px]">add_circle</span>
                    Tambah Kategori
                </button>
            </div>

            {/* ========== TABEL KATEGORI ========== */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 md:p-8 shadow-sm border border-gray-200 dark:border-gray-700 overflow-x-auto -mx-4 md:mx-0">
                <table className="w-full text-left min-w-[600px]">
                    <thead>
                        <tr className="border-b-2 border-slate-100 dark:border-slate-700/50">
                            <th className="py-4 px-4 text-xs font-black uppercase text-slate-400 tracking-wider w-16 text-center">No</th>
                            <th className="py-4 px-4 text-xs font-black uppercase text-slate-400 tracking-wider">Nama Kategori</th>
                            <th className="py-4 px-4 text-xs font-black uppercase text-slate-400 tracking-wider">Deskripsi</th>
                            <th className="py-4 px-4 text-xs font-black uppercase text-slate-400 tracking-wider">Jumlah Arsip</th>
                            <th className="py-4 px-4 text-xs font-black uppercase text-slate-400 tracking-wider text-center">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 dark:divide-slate-700/50">
                        {loading ? (
                            <tr>
                                <td colSpan="5" className="py-20 text-center">
                                    <div className="size-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto"></div>
                                </td>
                            </tr>
                        ) : categoriesWithCount.length > 0 ? (
                            categoriesWithCount.map((cat, index) => (
                                <tr key={cat.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-700/30 transition-all">
                                    <td className="py-5 px-4 text-sm font-bold text-slate-400 text-center">{index + 1}</td>
                                    <td className="py-5 px-4">
                                        <span className="text-slate-800 dark:text-white font-black text-sm uppercase tracking-tight">{cat.name}</span>
                                    </td>
                                    <td className="py-5 px-4">
                                        <p className="text-slate-500 dark:text-slate-400 text-sm max-w-xs truncate">{cat.description || '-'}</p>
                                    </td>
                                    <td className="py-5 px-4">
                                        <button className="text-primary hover:underline text-sm font-bold">
                                            {cat.realCount || 0} Dokumen
                                        </button>
                                    </td>
                                    <td className="py-5 px-4">
                                        <div className="flex justify-center gap-3">
                                            <button
                                                onClick={() => handleOpenModal(cat)}
                                                className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-all"
                                            >
                                                <span className="material-symbols-outlined text-[20px]">edit_square</span>
                                            </button>
                                            <button
                                                onClick={() => handleDelete(cat.id)}
                                                className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                            >
                                                <span className="material-symbols-outlined text-[20px]">delete</span>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="py-20 text-center text-slate-400 italic">Belum ada kategori ditambahkan.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* ========== MODAL FORM ========== */}
            {showModal && (
                <div className="fixed inset-0 z-110 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                    <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                        {/* Modal Header */}
                        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                            <h3 className="text-xl font-black text-slate-900 dark:text-white">
                                {isEditing ? 'Perbarui Kategori' : 'Kategori Baru'}
                            </h3>
                            <button onClick={handleCloseModal} className="text-slate-400 hover:text-red-500 transition-colors">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>

                        {/* Modal Body / Form */}
                        <form onSubmit={handleSubmit} className="p-6 space-y-5">
                            <div>
                                <label className="block text-[11px] font-black uppercase text-slate-400 mb-2 tracking-widest">Nama Kategori</label>
                                <input
                                    required
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-primary outline-none transition-all text-sm font-bold placeholder:text-slate-400"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="Contoh: KTGR SURAT MASUK"
                                />
                            </div>

                            <div>
                                <label className="block text-[11px] font-black uppercase text-slate-400 mb-2 tracking-widest">Deskripsi</label>
                                <textarea
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-primary outline-none transition-all text-sm font-medium placeholder:text-slate-400 resize-none"
                                    rows="4"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Jelaskan isi dari kategori ini..."
                                />
                            </div>

                            <button type="submit" className="w-full py-4 bg-primary text-white font-black rounded-xl shadow-lg shadow-primary/20 hover:bg-blue-700 transition-all flex items-center justify-center gap-2">
                                <span className="material-symbols-outlined text-[20px]">save</span>
                                {isEditing ? 'Simpan Perubahan' : 'Buat Kategori'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </Layout>
    );
};

export default Kategori;
