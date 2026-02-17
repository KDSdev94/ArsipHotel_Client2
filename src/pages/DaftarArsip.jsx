// ============================================
// FILE: DaftarArsip.jsx
// FUNGSI: Halaman untuk melihat daftar semua arsip/dokumen
// FITUR: Filter (Search, Divisi, Tanggal), Tabel lengkap, Pagination
// ============================================

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSupabase } from '../contexts/SupabaseContext';
import { useUserProfile } from '../contexts/UserProfileContext';
import { useFirestore } from '../contexts/FirestoreContext';
import { useAuth } from '../contexts/AuthContext';
import Layout from '../components/layout/Layout';

const DaftarArsip = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { currentUser } = useAuth();
    const { getArchives, getArchivesByDivision, deleteArchive } = useSupabase();
    const { isAdmin, getUserDivision } = useUserProfile();
    const { deleteDocumentBySupabaseId, logActivity, getDocument } = useFirestore();
    const [archives, setArchives] = useState([]);
    const [loading, setLoading] = useState(true);

    // ... (rest of states)
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedDivisi, setSelectedDivisi] = useState('');
    const [selectedDate, setSelectedDate] = useState('');

    // Fetch data from Supabase with role-based filtering
    const fetchArchives = async () => {
        setLoading(true);

        let result;
        if (isAdmin()) {
            // Admin bisa lihat semua arsip
            result = await getArchives();
        } else {
            // Staf cuma bisa lihat arsip dari divisinya
            const userDivision = getUserDivision();
            if (userDivision) {
                result = await getArchivesByDivision(userDivision);
            } else {
                result = { success: true, data: [] };
            }
        }

        if (result.success) {
            setArchives(result.data);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchArchives();

        // Auto reload
        window.addEventListener('focus', fetchArchives);
        return () => window.removeEventListener('focus', fetchArchives);
    }, [location.pathname]);

    // Handle Delete (Synced with Firestore)
    const handleDelete = async (id, filePath) => {
        // Cari data arsip sebelum dihapus buat logging
        const archiveToDelete = archives.find(a => a.id === id);

        if (window.confirm("Apakah Anda yakin ingin menghapus arsip ini?")) {
            // 1. Hapus dari Supabase
            const result = await deleteArchive(id, filePath);
            if (result.success) {
                // 2. Hapus juga dari Firestore secara background (sync)
                await deleteDocumentBySupabaseId('archives', id);

                // 3. Catat Laporan Aktivitas Hapus ke Firestore
                let finalName = currentUser?.displayName || 'Admin';

                // Jika nama di Auth kosong, ambil dari koleksi 'users' di Firestore
                if (!currentUser?.displayName || currentUser?.displayName === 'Unknown') {
                    const userProfile = await getDocument('users', currentUser?.uid);
                    if (userProfile.success && userProfile.data.name) {
                        finalName = userProfile.data.name;
                    }
                }

                await logActivity({
                    user: finalName,
                    email: currentUser?.email || 'Unknown',
                    action: 'Menghapus',
                    documentName: archiveToDelete?.judul || 'Dokumen',
                    status: 'Berhasil',
                    type: 'delete'
                });

                alert("Arsip berhasil dihapus!");
                setArchives(prev => prev.filter(item => item.id !== id));
            } else {
                alert("Gagal menghapus: " + result.error);
            }
        }
    };

    // Filter logic
    const filteredArchives = archives.filter(item => {
        const matchesSearch = item.judul?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.nomorArsip?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesDivisi = selectedDivisi === '' || item.divisi === selectedDivisi;
        const matchesDate = selectedDate === '' || item.tglDokumen === selectedDate;

        return matchesSearch && matchesDivisi && matchesDate;
    });

    // Fungsi reset filter
    const handleReset = () => {
        setSearchTerm('');
        setSelectedDivisi('');
        setSelectedDate('');
    };

    return (
        <Layout title="Manajemen Arsip">
            {/* Judul Halaman */}
            <div className="mb-8">
                <h1 className="text-slate-900 dark:text-white text-2xl md:text-3xl font-black leading-tight tracking-tight mb-2">
                    Daftar Arsip
                </h1>
                <p className="text-slate-600 dark:text-gray-400 text-sm md:text-base font-normal">
                    Berikut adalah daftar dokumen yang telah diunggah ke sistem e-Arsip.
                </p>
            </div>

            {/* ========== FILTER SECTION ========== */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 md:p-6 shadow-sm border border-gray-200 dark:border-gray-700 mb-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">

                    {/* Filter Search */}
                    <div className="space-y-2">
                        <label className="block text-[10px] md:text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider" htmlFor="search">
                            CARI JUDUL / NOMOR
                        </label>
                        <input
                            className="w-full rounded-lg border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white focus:ring-primary focus:border-primary text-sm px-3 py-2 outline-none"
                            id="search"
                            placeholder="Cari kata kunci..."
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    {/* Filter Divisi */}
                    <div className="space-y-2">
                        <label className="block text-[10px] md:text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider" htmlFor="divisi">
                            Divisi
                        </label>
                        <select
                            className="w-full rounded-lg border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white focus:ring-primary focus:border-primary text-sm px-3 py-2 outline-none"
                            id="divisi"
                            value={selectedDivisi}
                            onChange={(e) => setSelectedDivisi(e.target.value)}
                        >
                            <option value="">Semua Divisi</option>
                            <option value="Finance">Finance</option>
                            <option value="HRD">Human Resource</option>
                            <option value="Operations">Operations</option>
                            <option value="IT">IT & Security</option>
                        </select>
                    </div>

                    {/* Filter Tanggal */}
                    <div className="space-y-2">
                        <label className="block text-[10px] md:text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider" htmlFor="tanggal">
                            Tanggal Dokumen
                        </label>
                        <input
                            className="w-full rounded-lg border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white focus:ring-primary focus:border-primary text-sm px-3 py-2 outline-none"
                            id="tanggal"
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                        />
                    </div>

                    {/* Tombol Aksi */}
                    <div className="flex gap-2">
                        <button className="flex-1 px-4 py-2 bg-primary text-white rounded-lg font-bold text-sm shadow-md hover:bg-blue-700 transition-colors">
                            Filter
                        </button>
                        <button
                            onClick={handleReset}
                            className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg font-bold text-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                        >
                            Reset
                        </button>
                    </div>
                </div>
            </div>

            {/* ========== TABEL ARSIP ========== */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-250">

                        {/* Table Header */}
                        <thead>
                            <tr className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Nomor Arsip</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Judul</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Divisi</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Kategori</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Pengunggah</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Tgl Upload</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Tgl Dokumen</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-center">Aksi</th>
                            </tr>
                        </thead>

                        {/* Table Body */}
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                            {loading ? (
                                <tr>
                                    <td colSpan="8" className="text-center py-10">
                                        <div className="flex flex-col items-center gap-2">
                                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                                            <p className="text-sm text-gray-500">Memuat data...</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredArchives.length === 0 ? (
                                <tr>
                                    <td colSpan="8" className="text-center py-10 text-gray-500">
                                        Tidak ada data arsip ditemukan.
                                    </td>
                                </tr>
                            ) : filteredArchives.map((arsip) => (
                                <tr key={arsip.id} className="hover:bg-primary/5 transition-colors group">
                                    <td className="px-6 py-4 text-sm font-black text-primary">
                                        {arsip.nomorArsip || '-'}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-bold text-gray-900 dark:text-white">{arsip.judul}</span>
                                            <span className="text-[10px] text-gray-400 font-medium truncate max-w-50">{arsip.fileName}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-xs font-bold text-gray-600 dark:text-gray-300 uppercase">{arsip.divisi}</td>
                                    <td className="px-6 py-4">
                                        <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-[10px] font-bold text-slate-600 dark:text-slate-300 uppercase">
                                            {arsip.kategori}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="text-xs font-bold text-slate-700 dark:text-slate-200">{arsip.uploaderName || 'Admin'}</span>
                                            <span className="text-[9px] text-slate-400 font-medium">{arsip.uploaderEmail || ''}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-xs font-bold text-gray-600 dark:text-gray-300">
                                        {new Date(arsip.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                                    </td>
                                    <td className="px-6 py-4 text-xs font-medium text-gray-500 dark:text-gray-400">{arsip.tglDokumen}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex justify-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => navigate(`/preview/${arsip.id}`)}
                                                className="p-1.5 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-600 rounded transition-colors"
                                                title="View"
                                            >
                                                <span className="material-symbols-outlined text-[20px]">visibility</span>
                                            </button>
                                            <button
                                                onClick={() => handleDelete(arsip.id, arsip.filePath)}
                                                className="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 rounded transition-colors"
                                                title="Delete"
                                            >
                                                <span className="material-symbols-outlined text-[20px]">delete</span>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* ========== PAGINATION ========== */}
                <div className="px-6 py-4 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                        Menampilkan {filteredArchives.length} dari {archives.length} arsip
                    </span>
                    <div className="flex gap-2">
                        <button
                            className="px-3 py-1 rounded border border-gray-300 dark:border-gray-600 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
                            disabled
                        >
                            Sebelumnya
                        </button>
                        <button className="px-3 py-1 rounded bg-primary text-white text-sm font-bold">1</button>
                        {/* More buttons hidden on small screens? No, just keep simple for now */}
                        <button className="px-3 py-1 rounded border border-gray-300 dark:border-gray-600 text-sm hover:bg-gray-100 dark:hover:bg-gray-700">
                            Selanjutnya
                        </button>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default DaftarArsip;

