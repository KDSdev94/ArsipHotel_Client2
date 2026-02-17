import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSupabase } from '../../../contexts/SupabaseContext';
import { useFirestore } from '../../../contexts/FirestoreContext';
import { useAuth } from '../../../contexts/AuthContext';

const TabelDokumen = ({ data, loading: externalLoading, onDeleteSuccess }) => {
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    const { getArchives, deleteArchive } = useSupabase();
    const { deleteDocumentBySupabaseId, logActivity, getDocument } = useFirestore();
    const [internalArchives, setInternalArchives] = useState([]);
    const [internalLoading, setInternalLoading] = useState(true);

    const fetchArchives = React.useCallback(async () => {
        setInternalLoading(true);
        const result = await getArchives();
        if (result.success) {
            setInternalArchives(result.data.slice(0, 5));
        }
        setInternalLoading(false);
    }, [getArchives]);

    useEffect(() => {
        if (!data) {
            // Defer execution to avoid synchronous setState in effect warning
            const initFetch = async () => {
                await Promise.resolve();
                fetchArchives();
            };
            initFetch();
        }
    }, [data, fetchArchives]);

    const handleDelete = async (id, filePath) => {
        const archives = data || internalArchives;
        const archiveToDelete = archives.find(a => a.id === id);

        if (window.confirm("Apakah Anda yakin ingin menghapus arsip ini?")) {
            // 1. Hapus dari Supabase
            const result = await deleteArchive(id, filePath);
            if (result.success) {
                // 2. Hapus dari Firestore (Sync)
                await deleteDocumentBySupabaseId('archives', id);

                // 3. Catat Laporan Aktivitas Hapus ke Firestore
                let finalName = currentUser?.displayName || 'Admin';
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
                if (onDeleteSuccess) onDeleteSuccess(id);
                else fetchArchives();
            } else {
                alert("Gagal menghapus: " + result.error);
            }
        }
    };

    const archives = data || internalArchives;
    const loading = data ? externalLoading : internalLoading;

    return (
        // Container tabel dengan overflow-hidden biar border-radius (sudut melingkar) tetap keliatan
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        {/* Baris Judul Kolom (Header) */}
                        <tr className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
                            <th className="px-6 py-4 text-xs font-bold text-[#616f89] dark:text-gray-400 uppercase tracking-wider">Nomor Arsip</th>
                            <th className="px-6 py-4 text-xs font-bold text-[#616f89] dark:text-gray-400 uppercase tracking-wider">Judul / Nama File</th>
                            <th className="px-6 py-4 text-xs font-bold text-[#616f89] dark:text-gray-400 uppercase tracking-wider">Divisi</th>
                            <th className="px-6 py-4 text-xs font-bold text-[#616f89] dark:text-gray-400 uppercase tracking-wider">Kategori</th>
                            <th className="px-6 py-4 text-xs font-bold text-[#616f89] dark:text-gray-400 uppercase tracking-wider text-center">Nama</th>
                            <th className="px-6 py-4 text-xs font-bold text-[#616f89] dark:text-gray-400 uppercase tracking-wider">Tgl Unggah</th>
                            <th className="px-6 py-4 text-xs font-bold text-[#616f89] dark:text-gray-400 uppercase tracking-wider text-right">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                        {loading ? (
                            <tr>
                                <td colSpan="7" className="text-center py-10">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                                </td>
                            </tr>
                        ) : archives.length === 0 ? (
                            <tr>
                                <td colSpan="7" className="text-center py-10 text-gray-500">Belum ada dokumen.</td>
                            </tr>
                        ) : archives.map((doc) => (
                            <tr key={doc.id} className="hover:bg-gray-50/80 dark:hover:bg-gray-700/30 transition-colors group">
                                <td className="px-6 py-5">
                                    <span className="text-xs font-black text-primary dark:text-blue-400 bg-primary/5 dark:bg-primary/10 px-2 py-1 rounded">
                                        {doc.nomorArsip || '-'}
                                    </span>
                                </td>
                                <td className="px-6 py-5">
                                    <div className="flex items-center gap-3">
                                        <div className="size-8 flex items-center justify-center rounded bg-slate-100 dark:bg-slate-800 text-slate-500">
                                            <span className="material-symbols-outlined text-[20px]">description</span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-sm font-bold text-gray-900 dark:text-white line-clamp-1">{doc.judul}</span>
                                            <span className="text-[10px] text-gray-400 font-medium truncate max-w-[150px]">{doc.fileName}</span>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-5">
                                    <span className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase letter tracking-tight">{doc.divisi}</span>
                                </td>
                                <td className="px-6 py-5">
                                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold border bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-blue-100 dark:border-blue-800`}>
                                        {doc.kategori}
                                    </span>
                                </td>
                                <td className="px-6 py-5">
                                    <div className="flex flex-col items-center">
                                        <span className="text-xs font-bold text-slate-700 dark:text-slate-200">{doc.uploaderName || 'Admin'}</span>
                                        <span className="text-[9px] text-slate-400 font-medium">{doc.uploaderEmail || ''}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-5 text-[11px] font-bold text-[#616f89] dark:text-gray-400 uppercase">
                                    {new Date(doc.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                                </td>
                                <td className="px-6 py-5 text-right">
                                    <div className="flex justify-end gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => navigate(`/preview/${doc.id}`)}
                                            className="p-1.5 hover:bg-primary/10 hover:text-primary rounded text-gray-500" title="Lihat"
                                        >
                                            <span className="material-symbols-outlined text-[20px]">visibility</span>
                                        </button>
                                        <button
                                            onClick={() => handleDelete(doc.id, doc.filePath)}
                                            className="p-1.5 hover:bg-red-100 hover:text-red-600 rounded text-gray-500" title="Hapus"
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

            {/* Pagination (Pengatur Halaman) */}
            <div className="px-6 py-4 flex items-center justify-between border-t border-gray-100 dark:border-gray-700 bg-gray-50/30 dark:bg-gray-900/20">
                <span className="text-sm text-[#616f89] dark:text-gray-400 font-medium font-bold uppercase tracking-wider">
                    Total: <span className="text-primary">{archives.length}</span> Arsip
                </span>
                {archives.length > 5 && (
                    <div className="flex gap-2">
                        <button className="flex items-center justify-center size-8 rounded border border-gray-200 dark:border-gray-700 text-gray-400 cursor-not-allowed">
                            <span className="material-symbols-outlined text-base">chevron_left</span>
                        </button>
                        <button className="flex items-center justify-center size-8 rounded border border-primary bg-primary text-white text-sm font-bold">1</button>
                        <button className="flex items-center justify-center size-8 rounded border border-gray-200 dark:border-gray-700 text-sm font-medium hover:border-primary hover:text-primary transition-colors">
                            <span className="material-symbols-outlined text-base">chevron_right</span>
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TabelDokumen;

