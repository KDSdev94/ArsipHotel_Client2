import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSupabase } from '../contexts/SupabaseContext';
import Layout from '../components/layout/Layout';
import { useAuth } from '../contexts/AuthContext';
import { useFirestore } from '../contexts/FirestoreContext';

const PreviewArsip = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { getArchives, deleteArchive } = useSupabase();
    const { currentUser } = useAuth();
    const { deleteDocumentBySupabaseId, logActivity, getDocument } = useFirestore(); // Tambah Firestore context
    const [arsip, setArsip] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showDetails, setShowDetails] = useState(false);

    useEffect(() => {
        const fetchArsip = async () => {
            setLoading(true);
            const result = await getArchives();
            if (result.success) {
                const found = result.data.find(item => item.id == id);
                setArsip(found);
            }
            setLoading(false);
        };
        fetchArsip();
    }, [id]);

    const handleDelete = async () => {
        if (window.confirm("Apakah Anda yakin ingin menghapus arsip ini?")) {
            // 1. Hapus dari Supabase
            const result = await deleteArchive(id, arsip.filePath);
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
                    documentName: arsip.judul || 'Dokumen',
                    status: 'Berhasil',
                    type: 'delete'
                });

                alert("Arsip berhasil dihapus!");
                navigate('/daftar-arsip');
            } else {
                alert("Gagal menghapus: " + result.error);
            }
        }
    };

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-background-light dark:bg-background-dark">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!arsip) {
        return (
            <div className="flex h-screen items-center justify-center bg-background-light dark:bg-background-dark text-slate-800 dark:text-white">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-4">Arsip tidak ditemukan</h1>
                    <button onClick={() => navigate(-1)} className="text-primary hover:underline font-bold">Kembali</button>
                </div>
            </div>
        );
    }

    // Helper to determine file type category
    const getFileType = () => {
        const type = arsip.fileType?.toLowerCase() || '';
        const name = arsip.fileName?.toLowerCase() || '';
        if (type.includes('pdf')) return 'pdf';
        if (type.includes('image') || name.endsWith('.jpg') || name.endsWith('.jpeg') || name.endsWith('.png')) return 'image';
        if (type.includes('word') || type.includes('officedocument.word') || name.endsWith('.doc') || name.endsWith('.docx')) return 'word';
        if (type.includes('sheet') || type.includes('excel') || name.endsWith('.xls') || name.endsWith('.xlsx') || name.endsWith('.csv')) return 'excel';
        return 'other';
    };

    const fileType = getFileType();

    return (
        <Layout title={arsip.judul} showBack={true}>
            <div className="flex flex-col h-full -m-4 md:-m-8">
                {/* Secondary Header for Preview Info & Actions */}
                <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 py-2 shrink-0 z-10">
                    <div className="flex items-center gap-3 min-w-0">
                        <div className="size-8 md:size-10 bg-slate-50 dark:bg-slate-800 rounded-lg flex items-center justify-center shrink-0">
                            <span className="material-symbols-outlined text-primary">
                                {fileType === 'pdf' ? 'picture_as_pdf' : fileType === 'image' ? 'image' : fileType === 'excel' ? 'table_view' : 'description'}
                            </span>
                        </div>
                        <div className="min-w-0">
                            <h2 className="text-slate-800 dark:text-white text-sm md:text-base font-bold truncate">
                                {arsip.judul}
                            </h2>
                            <p className="text-[10px] text-slate-400 font-semibold truncate uppercase tracking-wider hidden sm:block">
                                {arsip.divisi} • {arsip.kategori}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => window.open(arsip.fileUrl, '_blank')}
                            className="flex items-center gap-2 px-3 py-1.5 bg-primary text-white rounded-lg text-xs font-bold shadow-sm shadow-primary/20 hover:bg-primary/90 transition-colors"
                        >
                            <span className="material-symbols-outlined text-base">download</span>
                            <span className="hidden sm:inline">Unduh</span>
                        </button>
                        <button
                            onClick={() => setShowDetails(!showDetails)}
                            className={`lg:hidden p-1.5 rounded-lg transition-colors ${showDetails ? 'bg-primary text-white' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                        >
                            <span className="material-symbols-outlined">info</span>
                        </button>
                        <button
                            onClick={handleDelete}
                            className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        >
                            <span className="material-symbols-outlined">delete</span>
                        </button>
                    </div>
                </div>

                <div className="flex-1 flex overflow-hidden relative">
                    {/* Main Preview Canvas */}
                    <div className="flex-1 bg-slate-100 dark:bg-slate-950 relative flex items-center justify-center overflow-hidden">
                        {fileType === 'pdf' ? (
                            <iframe
                                src={`${arsip.fileUrl}#toolbar=1&navpanes=0&scrollbar=1`}
                                className="w-full h-full border-none"
                                title="PDF Viewer"
                            />
                        ) : fileType === 'image' ? (
                            <div className="w-full h-full overflow-auto p-4 md:p-8 flex items-center justify-center custom-scrollbar">
                                <img
                                    src={arsip.fileUrl}
                                    alt={arsip.judul}
                                    className="rounded-xl shadow-2xl border border-white/20 object-contain max-h-full"
                                />
                            </div>
                        ) : (fileType === 'word' || fileType === 'excel') ? (
                            <div className="w-full h-full bg-white relative flex flex-col">
                                <iframe
                                    src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(arsip.fileUrl)}`}
                                    className="w-full h-full border-none"
                                    title="Office Online Viewer"
                                />
                                <div className="absolute top-4 right-4 bg-primary text-white text-[10px] px-2 py-1 rounded font-bold uppercase tracking-widest shadow-lg z-20">
                                    Konten Asli Dokumen
                                </div>
                            </div>
                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-500">
                                <span className="material-symbols-outlined text-6xl text-slate-300 mb-4">description</span>
                                <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Pratinjau tidak tersedia</h3>
                                <p className="mb-6 text-sm">Tipe file ini tidak didukung untuk pratinjau langsung.</p>
                                <button
                                    onClick={() => window.open(arsip.fileUrl, '_blank')}
                                    className="px-6 py-2 bg-primary text-white rounded-lg font-bold transition-all hover:scale-105 active:scale-95 shadow-lg shadow-primary/20"
                                >
                                    Buka File di Tab Baru
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Metadata Sidebar */}
                    <aside className={`
                        absolute inset-y-0 right-0 w-72 md:w-80 border-l border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col shrink-0 z-20 transition-transform duration-300
                        lg:relative lg:translate-x-0
                        ${showDetails ? 'translate-x-0' : 'translate-x-full'}
                    `}>
                        <div className="p-6 border-b border-slate-200 dark:border-slate-800 text-center relative">
                            <button
                                onClick={() => setShowDetails(false)}
                                className="lg:hidden absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                            >
                                <span className="material-symbols-outlined">chevron_right</span>
                            </button>
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Detail Dokumen</h3>
                        </div>

                        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8">
                            <div>
                                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Informasi File</h4>
                                <div className="space-y-4">
                                    <div className="flex flex-col gap-1">
                                        <span className="text-[10px] font-bold text-slate-400 uppercase">Nama File</span>
                                        <span className="text-sm font-bold text-slate-900 dark:text-white break-all">{arsip.fileName}</span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="flex flex-col gap-1">
                                            <span className="text-[10px] font-bold text-slate-400 uppercase">Tipe</span>
                                            <span className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase">{arsip.fileName?.split('.').pop()}</span>
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <span className="text-[10px] font-bold text-slate-400 uppercase">Ukuran</span>
                                            <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{(arsip.fileSize / 1024 / 1024).toFixed(2)} MB</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Kepemilikan</h4>
                                <div className="space-y-4">
                                    <div className="flex items-start gap-3">
                                        <span className="material-symbols-outlined text-slate-400 text-[20px]">corporate_fare</span>
                                        <div>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase">Departemen</p>
                                            <p className="text-sm font-bold text-slate-700 dark:text-slate-300">{arsip.divisi}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <span className="material-symbols-outlined text-slate-400 text-[20px]">person</span>
                                        <div>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase">Diunggah Oleh</p>
                                            <p className="text-sm font-bold text-slate-700 dark:text-slate-300">{arsip.uploaderName || 'Administrator'}</p>
                                            <p className="text-[10px] text-slate-500 mt-0.5 break-all">{arsip.uploaderEmail || ''}</p>
                                            <p className="text-[10px] text-slate-500 mt-0.5">{new Date(arsip.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })} at {new Date(arsip.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {arsip.keterangan && (
                                <div>
                                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Keterangan</h4>
                                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed italic bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg border border-slate-100 dark:border-slate-800">
                                        {arsip.keterangan}
                                    </p>
                                </div>
                            )}
                        </div>
                    </aside>
                </div>
            </div>
        </Layout>
    );
};

export default PreviewArsip;
