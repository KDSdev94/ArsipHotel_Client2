import React, { useState, useMemo } from 'react';
import { useFirestore } from '../../../contexts/FirestoreContext';

const TabelAktivitasBaru = ({ activities: logs = [], onReload }) => {
    const { deleteDocument } = useFirestore();
    const [selectedIds, setSelectedIds] = useState([]);
    const [isDeleting, setIsDeleting] = useState(false);

    const activities = useMemo(() => {
        if (logs && logs.length > 0) {
            return logs.map(log => {
                const dateObj = log.timestamp?.toDate ? log.timestamp.toDate() : (log.timestamp ? new Date(log.timestamp) : new Date());
                const timeStr = dateObj.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
                const dateStr = dateObj.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });

                const uploaderName = log.user || 'Unknown';
                const initials = uploaderName
                    .split(' ')
                    .map(name => name[0])
                    .join('')
                    .toUpperCase()
                    .substring(0, 2);

                return {
                    id: log.id,
                    time: timeStr,
                    date: dateStr,
                    user: uploaderName,
                    initials: initials,
                    email: log.email || '',
                    action: log.action || 'Aktivitas',
                    document: log.documentName || '-',
                    status: log.status || 'Berhasil',
                    statusType: log.type === 'delete' ? 'danger' : 'success'
                };
            });
        }
        return [];
    }, [logs]);

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedIds(activities.map(a => a.id));
        } else {
            setSelectedIds([]);
        }
    };

    const handleSelectOne = (id) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const handleDeleteSelected = async () => {
        if (!selectedIds.length) return;
        if (window.confirm(`Hapus ${selectedIds.length} data laporan terpilih?`)) {
            setIsDeleting(true);
            try {
                for (const id of selectedIds) {
                    await deleteDocument('activities', id);
                }
                setSelectedIds([]);
                if (onReload) onReload();
                alert('Data berhasil dihapus');
            } catch {
                alert('Gagal menghapus beberapa data');
            } finally {
                setIsDeleting(false);
            }
        }
    };

    const handleDeleteAll = async () => {
        if (window.confirm('Hapus SEMUA data laporan aktivitas?')) {
            setIsDeleting(true);
            try {
                for (const act of activities) {
                    await deleteDocument('activities', act.id);
                }
                setSelectedIds([]);
                if (onReload) onReload();
                alert('Semua data berhasil dibersihkan');
            } catch {
                alert('Gagal membersihkan data');
            } finally {
                setIsDeleting(false);
            }
        }
    };

    const handleDeleteOne = async (id) => {
        if (window.confirm('Hapus data laporan ini?')) {
            const res = await deleteDocument('activities', id);
            if (res.success) {
                if (onReload) onReload();
            } else {
                alert('Gagal menghapus');
            }
        }
    };

    return (
        <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="p-6 md:p-8 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h3 className="font-black text-xl text-slate-900 dark:text-white uppercase tracking-tight">Riwayat Aktivitas & Laporan</h3>
                    <p className="text-xs text-slate-500 font-medium mt-1">Daftar log aktivitas sistem dan riwayat pengelolaan arsip.</p>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                    {selectedIds.length > 0 && (
                        <button
                            disabled={isDeleting}
                            onClick={handleDeleteSelected}
                            className="flex-1 sm:flex-none px-4 py-2 bg-red-50 text-red-600 rounded-lg text-xs font-bold hover:bg-red-100 transition-all flex items-center justify-center gap-2 border border-red-100"
                        >
                            <span className="material-symbols-outlined text-sm">delete_sweep</span>
                            Hapus ({selectedIds.length})
                        </button>
                    )}
                    <button
                        disabled={isDeleting || activities.length === 0}
                        onClick={handleDeleteAll}
                        title="Bersihkan Semua Laporan"
                        className="size-9 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-lg font-bold hover:bg-red-500 hover:text-white transition-all flex items-center justify-center border border-transparent shadow-sm"
                    >
                        <span className="material-symbols-outlined text-[20px]">auto_delete</span>
                    </button>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[800px]">
                    <thead className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                        <tr>
                            <th className="px-6 py-4 w-12">
                                <input
                                    type="checkbox"
                                    className="rounded border-slate-300 text-primary focus:ring-primary h-4 w-4"
                                    onChange={handleSelectAll}
                                    checked={selectedIds.length === activities.length && activities.length > 0}
                                />
                            </th>
                            <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Waktu</th>
                            <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Pengguna</th>
                            <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Aktivitas</th>
                            <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Dokumen / Ref</th>
                            <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                            <th className="px-6 py-4 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {activities.length === 0 ? (
                            <tr>
                                <td colSpan="7" className="px-6 py-20 text-center text-slate-400 font-medium italic">
                                    Belum ada data laporan aktivitas yang terekam.
                                </td>
                            </tr>
                        ) : (
                            activities.map((act) => (
                                <tr key={act.id} className={`hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors group ${selectedIds.includes(act.id) ? 'bg-primary/5 dark:bg-primary/10' : ''}`}>
                                    <td className="px-6 py-4">
                                        <input
                                            type="checkbox"
                                            className="rounded border-slate-300 text-primary focus:ring-primary h-4 w-4"
                                            checked={selectedIds.includes(act.id)}
                                            onChange={() => handleSelectOne(act.id)}
                                        />
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-bold text-slate-900 dark:text-white">{act.time}</span>
                                            <span className="text-[10px] text-slate-400 font-medium">{act.date}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-3">
                                            <div className="size-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-black text-xs border border-primary/10">
                                                {act.initials}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold text-slate-700 dark:text-slate-200">{act.user}</span>
                                                <span className="text-[10px] text-slate-400 truncate max-w-[120px]">{act.email}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-tighter">
                                            {act.action}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-600 dark:text-slate-400 max-w-[200px] truncate" title={act.document}>
                                        {act.document}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest w-fit ${act.statusType === 'success'
                                            ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 border border-emerald-100 dark:border-emerald-800/50'
                                            : 'bg-red-50 dark:bg-red-900/20 text-red-600 border border-red-100 dark:border-red-800/50'
                                            }`}>
                                            <div className={`size-1.5 rounded-full ${act.statusType === 'success' ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
                                            {act.status}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <button
                                            onClick={() => handleDeleteOne(act.id)}
                                            className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                                        >
                                            <span className="material-symbols-outlined text-sm">delete</span>
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <div className="px-8 py-5 bg-slate-50/50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                    Total <span className="font-bold text-slate-900 dark:text-white">{activities.length}</span> log aktivitas terekam
                </p>
                <div className="flex items-center gap-2">
                    <button className="flex items-center gap-1 px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 opacity-30 cursor-not-allowed">
                        <span className="material-symbols-outlined text-[18px]">chevron_left</span>
                        Sebelumnya
                    </button>
                    <button className="size-9 flex items-center justify-center bg-primary text-white rounded-xl text-xs font-bold shadow-lg shadow-primary/20">1</button>
                    <button className="flex items-center gap-1 px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 opacity-30 cursor-not-allowed">
                        Selanjutnya
                        <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                    </button>
                </div>
            </div>
        </section>
    );
};

export default TabelAktivitasBaru;
