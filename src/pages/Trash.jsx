// ============================================
// FILE: Trash.jsx
// FUNGSI: Halaman untuk melihat arsip yang telah dihapus (Soft Delete)
// FITUR: Restore, Delete Permanently
// ============================================

import React, { useState, useEffect } from 'react';
import { useSupabase } from '../contexts/SupabaseContext';
import { useUserProfile } from '../contexts/UserProfileContext';
import { useFirestore } from '../contexts/FirestoreContext';
import { useAuth } from '../contexts/AuthContext';
import Layout from '../components/layout/Layout';
import { resolveActivityDivisionScope } from '../utils/accessControl';

const Trash = () => {
    const { currentUser } = useAuth();
    const { getDeletedArchives, restoreArchive, deleteArchive } = useSupabase();
    const { isAdmin, getUserDivision, userProfile } = useUserProfile();
    const { logActivity, deleteDocumentBySupabaseId } = useFirestore();
    const [archives, setArchives] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchDeletedArchives = React.useCallback(async () => {
        setLoading(true);
        let result;
        if (isAdmin()) {
            result = await getDeletedArchives();
        } else {
            const userDivision = getUserDivision();
            result = await getDeletedArchives(userDivision);
        }

        if (result.success) {
            setArchives(result.data);
        }
        setLoading(false);
    }, [getDeletedArchives, getUserDivision, isAdmin]);

    useEffect(() => {
        const initFetch = async () => {
            await Promise.resolve();
            fetchDeletedArchives();
        };

        initFetch();
    }, [fetchDeletedArchives]);

    const handleRestore = async (id) => {
        const archive = archives.find(a => a.id === id);
        if (window.confirm(`Pulihkan arsip "${archive?.judul}"?`)) {
            const result = await restoreArchive(id);
            if (result.success) {
                // Log activity
                await logActivity({
                    user: currentUser?.displayName || 'Admin',
                    email: currentUser?.email || 'Unknown',
                    action: 'Memulihkan Arsip',
                    documentName: archive?.judul || 'Dokumen',
                    status: 'Berhasil',
                    type: 'restore',
                    actorDivision: getUserDivision(),
                    divisionScope: resolveActivityDivisionScope({
                        archiveDivision: archive?.divisi,
                        profile: userProfile
                    })
                });

                alert("Arsip berhasil dipulihkan!");
                setArchives(prev => prev.filter(item => item.id !== id));
            } else {
                alert("Gagal memulihkan: " + result.error);
            }
        }
    };

    const handlePermanentDelete = async (id, filePath) => {
        const archive = archives.find(a => a.id === id);
        if (window.confirm(`HAPUS PERMANEN arsip "${archive?.judul}"? Tindakan ini tidak bisa dibatalkan.`)) {
            const result = await deleteArchive(id, filePath);
            if (result.success) {
                // Remove from Firestore too
                await deleteDocumentBySupabaseId('archives', id);

                // Log activity
                await logActivity({
                    user: currentUser?.displayName || 'Admin',
                    email: currentUser?.email || 'Unknown',
                    action: 'Menghapus Permanen',
                    documentName: archive?.judul || 'Dokumen',
                    status: 'Berhasil',
                    type: 'permanent_delete',
                    actorDivision: getUserDivision(),
                    divisionScope: resolveActivityDivisionScope({
                        archiveDivision: archive?.divisi,
                        profile: userProfile
                    })
                });

                alert("Arsip dihapus secara permanen!");
                setArchives(prev => prev.filter(item => item.id !== id));
            } else {
                alert("Gagal menghapus permanen: " + result.error);
            }
        }
    };

    return (
        <Layout title="Tempat Sampah">
            <div className="mb-8">
                <h1 className="text-slate-900 dark:text-white text-2xl md:text-3xl font-black leading-tight tracking-tight mb-2">
                    Tempat Sampah
                </h1>
                <p className="text-slate-600 dark:text-gray-400 text-sm md:text-base font-normal">
                    Daftar dokumen yang telah dihapus. Anda dapat memulihkan atau menghapusnya secara permanen.
                </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-250">
                        <thead>
                            <tr className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Judul</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Divisi</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Dihapus Pada</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-center">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                            {loading ? (
                                <tr>
                                    <td colSpan="4" className="text-center py-10">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                                    </td>
                                </tr>
                            ) : archives.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="text-center py-10 text-gray-500">
                                        Tempat sampah kosong.
                                    </td>
                                </tr>
                            ) : archives.map((arsip) => (
                                <tr key={arsip.id} className="hover:bg-red-50/30 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-bold text-gray-900 dark:text-white">{arsip.judul}</span>
                                            <span className="text-[10px] text-gray-400 font-medium">{arsip.nomorArsip}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-xs font-bold text-gray-600 dark:text-gray-300 uppercase">{arsip.divisi}</td>
                                    <td className="px-6 py-4 text-xs text-gray-500">
                                        {arsip.deleted_at ? new Date(arsip.deleted_at).toLocaleString('id-ID') : '-'}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex justify-center gap-2">
                                            <button
                                                onClick={() => handleRestore(arsip.id)}
                                                className="flex items-center gap-1 px-3 py-1.5 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors text-xs font-bold"
                                                title="Restore"
                                            >
                                                <span className="material-symbols-outlined text-[18px]">restore</span>
                                                Pulihkan
                                            </button>
                                            <button
                                                onClick={() => handlePermanentDelete(arsip.id, arsip.filePath)}
                                                className="flex items-center gap-1 px-3 py-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-xs font-bold"
                                                title="Delete Permanently"
                                            >
                                                <span className="material-symbols-outlined text-[18px]">delete_forever</span>
                                                Hapus Permanen
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </Layout>
    );
};

export default Trash;
