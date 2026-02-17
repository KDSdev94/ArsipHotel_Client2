import React, { useMemo } from 'react';

const TabelAktivitasBaru = ({ archives = [], activities: logs = [] }) => {
    const activities = useMemo(() => {
        // Jika ada logs dari Firestore (Real Logs), pakai itu
        if (logs && logs.length > 0) {
            return logs.map(log => {
                const dateObj = log.timestamp?.toDate ? log.timestamp.toDate() : new Date();
                const timeStr = dateObj.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
                const dateStr = dateObj.toLocaleDateString('id-ID', { day: '2-digit', month: 'short' });

                const uploaderName = log.user || 'Unknown';
                const initials = uploaderName
                    .split(' ')
                    .map(name => name[0])
                    .join('')
                    .toUpperCase()
                    .substring(0, 2);

                return {
                    time: timeStr,
                    date: dateStr,
                    user: uploaderName,
                    initials: initials,
                    action: log.action || 'Aktivitas',
                    document: log.documentName || '-',
                    status: log.status || 'Berhasil',
                    statusType: log.type === 'delete' ? 'danger' : 'success'
                };
            });
        }

        // Kalau ga ada logs, fallback ke data archives (logic lama)
        return [...archives]
            .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
            .slice(0, 10)
            .map(arsip => {
                const dateObj = new Date(arsip.created_at);
                const timeStr = dateObj.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
                const dateStr = dateObj.toLocaleDateString('id-ID', { day: '2-digit', month: 'short' });

                const uploaderName = arsip.uploaderName || 'Unknown';
                const initials = uploaderName
                    .split(' ')
                    .map(name => name[0])
                    .join('')
                    .toUpperCase()
                    .substring(0, 2);

                return {
                    time: timeStr,
                    date: dateStr,
                    user: uploaderName,
                    initials: initials,
                    action: 'Mengunggah',
                    document: arsip.judul || arsip.fileName,
                    status: 'Berhasil',
                    statusType: 'success'
                };
            });
    }, [archives, logs]);

    return (
        <section className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden mb-12">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                <h3 className="font-bold text-lg">Aktivitas Baru</h3>
                <div className="text-xs text-slate-500 font-medium italic">* Menampilkan 10 unggahan terakhir</div>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 dark:bg-slate-800/50">
                        <tr>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Waktu</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Pengguna</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Aktivitas</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Nama Dokumen</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {activities.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="px-6 py-8 text-center text-slate-400">
                                    Belum ada aktivitas terekam
                                </td>
                            </tr>
                        ) : (
                            activities.map((act, idx) => (
                                <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{act.time} - {act.date}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-3">
                                            <div className="size-7 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 flex items-center justify-center font-bold text-[10px]">
                                                {act.initials}
                                            </div>
                                            <span className="text-sm font-medium">{act.user}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="text-sm text-slate-900 dark:text-slate-200 font-medium italic">{act.action}</span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold max-w-[200px] truncate" title={act.document}>
                                        {act.document}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 py-1 text-[10px] font-black rounded uppercase ${act.statusType === 'success' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400' :
                                            act.statusType === 'danger' ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400' :
                                                'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                                            }`}>
                                            {act.status}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </section>
    );
};

export default TabelAktivitasBaru;
