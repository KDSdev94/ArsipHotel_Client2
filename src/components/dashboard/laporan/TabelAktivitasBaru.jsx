import React from 'react';

const TabelAktivitasBaru = () => {
    const activities = [
        {
            time: '12:45',
            date: '24 Jun',
            user: 'Andi Saputra',
            initials: 'AS',
            action: 'Mengunggah',
            document: 'Invoice_HK_Jun24.pdf',
            status: 'Berhasil',
            statusType: 'success'
        },
        {
            time: '10:20',
            date: '24 Jun',
            user: 'Maya Larasati',
            initials: 'ML',
            action: 'Menghapus',
            document: 'Draft_Report_v1.docx',
            status: 'Berhasil',
            statusType: 'danger'
        },
        {
            time: '09:15',
            date: '24 Jun',
            user: 'Raka Budi',
            initials: 'RB',
            action: 'Mengunduh',
            document: 'Contract_Vendor_IT.pdf',
            status: 'Sedang Proses',
            statusType: 'processing'
        }
    ];

    return (
        <section className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden mb-12">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                <h3 className="font-bold text-lg">Aktivitas Terbaru</h3>
                <button className="text-sm text-primary font-bold hover:underline transition-all">Lihat Semua</button>
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
                        {activities.map((act, idx) => (
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
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold">{act.document}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 py-1 text-[10px] font-black rounded uppercase ${act.statusType === 'success' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400' :
                                        act.statusType === 'danger' ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400' :
                                            'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                                        }`}>
                                        {act.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    );
};

export default TabelAktivitasBaru;
