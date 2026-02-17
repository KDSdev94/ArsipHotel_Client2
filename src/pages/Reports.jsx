import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import StatistikLaporan from '../components/dashboard/laporan/StatistikLaporan';
import GrafikDivisi from '../components/dashboard/divisi/GrafikDivisi';
import GrafikTrenUnggahan from '../components/dashboard/dokumen/GrafikTrenUnggahan';
import TabelAktivitasBaru from '../components/dashboard/laporan/TabelAktivitasBaru';
import { useUserProfile } from '../contexts/UserProfileContext';
import { useSupabase } from '../contexts/SupabaseContext';
import { useFirestore } from '../contexts/FirestoreContext';
import { useAuth } from '../contexts/AuthContext';
import { exportToCSV } from '../utils/exportUtils';

const Reports = () => {
    const location = useLocation();
    const { isAdmin, getUserDivision } = useUserProfile();
    const { currentUser } = useAuth();
    const { getArchives, getArchivesByDivision } = useSupabase();
    const { getDocuments, orderByQuery, limitQuery, getDocument, logActivity } = useFirestore();
    const [archives, setArchives] = useState([]);
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);

    const handleExport = async () => {
        const columns = [
            { key: 'nomorArsip', label: 'Nomor Arsip' },
            { key: 'judul', label: 'Judul' },
            { key: 'divisi', label: 'Divisi' },
            { key: 'kategori', label: 'Kategori' },
            { key: 'uploaderName', label: 'Pengunggah' },
            { key: 'tglDokumen', label: 'Tanggal Dokumen' },
            { key: 'created_at', label: 'Tanggal Unggah' },
            { key: 'fileSize', label: 'Ukuran (Bytes)' }
        ];

        const fileName = isAdmin() ? 'Laporan_Arsip_Semua' : `Laporan_Arsip_${getUserDivision()}`;
        exportToCSV(archives, fileName, columns);

        // Ambil Nama Lengkap Terkini
        let finalName = currentUser?.displayName || 'Unknown';
        if (!currentUser?.displayName || currentUser?.displayName === 'Unknown') {
            const userProfile = await getDocument('users', currentUser?.uid);
            if (userProfile.success && userProfile.data.name) {
                finalName = userProfile.data.name;
            }
        }

        // Catat ekspor ke Firestore
        await logActivity({
            user: finalName,
            email: currentUser?.email || 'Unknown',
            action: 'Ekspor CSV',
            documentName: fileName,
            status: 'Berhasil',
            type: 'export'
        });
    };

    const fetchData = React.useCallback(async () => {
        setLoading(true);

        // 1. Ambil Data Arsip
        let arcResult;
        if (isAdmin()) {
            arcResult = await getArchives();
        } else {
            const userDivision = getUserDivision();
            if (userDivision) {
                arcResult = await getArchivesByDivision(userDivision);
            } else {
                arcResult = { success: true, data: [] };
            }
        }

        if (arcResult.success) {
            setArchives(arcResult.data);
        }

        // 2. Ambil Data Aktivitas dari Firestore (Real Logs)
        const actResult = await getDocuments('activities', [
            orderByQuery('timestamp', 'desc'),
            limitQuery(10)
        ]);

        if (actResult.success) {
            setActivities(actResult.data);
        }

        setLoading(false);
    }, [getArchives, getArchivesByDivision, getDocuments, getUserDivision, isAdmin, limitQuery, orderByQuery]);

    // Fetch archives based on role
    useEffect(() => {
        const initFetch = async () => {
            await Promise.resolve();
            fetchData();
        };
        initFetch();

        // Auto reload
        window.addEventListener('focus', fetchData);
        return () => window.removeEventListener('focus', fetchData);
    }, [location.pathname, fetchData]);

    return (
        <Layout title="Laporan & Statistik">
            <header className="flex flex-col sm:flex-row flex-wrap items-start sm:items-center justify-between gap-6 mb-8">
                <div>
                    <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                        Laporan & Statistik
                    </h1>
                    <p className="text-slate-500 text-sm md:text-base mt-1">
                        {isAdmin()
                            ? 'Analisis data penggunaan arsip digital (Semua Divisi)'
                            : `Analisis data penggunaan arsip digital (Divisi: ${getUserDivision() || 'N/A'})`
                        }
                    </p>
                </div>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <button
                        onClick={handleExport}
                        className="w-full sm:w-auto bg-primary hover:bg-blue-700 text-white flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg font-bold text-sm transition-all shadow-lg shadow-primary/20"
                    >
                        <span className="material-symbols-outlined text-xl">download</span>
                        Ekspor Laporan
                    </button>
                </div>
            </header>

            {loading ? (
                <div className="flex justify-center items-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
            ) : (
                <div className="space-y-8">
                    {/* Top Stats - Pass filtered archives */}
                    <StatistikLaporan archives={archives} />

                    {/* Charts Row - Pass filtered archives */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <GrafikDivisi archives={archives} />
                        <GrafikTrenUnggahan archives={archives} />
                    </div>

                    {/* Activity Table - Pass real logs */}
                    <TabelAktivitasBaru activities={activities} onReload={fetchData} />
                </div>
            )}
        </Layout>
    );
};

export default Reports;
