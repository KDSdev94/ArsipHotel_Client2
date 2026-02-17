import React, { useMemo } from 'react';

const StatistikLaporan = ({ archives = [] }) => {
    // Hitung statistik dari data real
    const stats = useMemo(() => {
        const totalDokumen = archives.length;

        // Hitung dokumen bulan ini
        const now = new Date();
        const thisMonth = now.getMonth();
        const thisYear = now.getFullYear();

        const dokumenBulanIni = archives.filter(arsip => {
            const createdDate = new Date(arsip.created_at);
            return createdDate.getMonth() === thisMonth && createdDate.getFullYear() === thisYear;
        }).length;

        // Hitung dokumen bulan lalu untuk perbandingan
        const lastMonth = thisMonth === 0 ? 11 : thisMonth - 1;
        const lastMonthYear = thisMonth === 0 ? thisYear - 1 : thisYear;

        const dokumenBulanLalu = archives.filter(arsip => {
            const createdDate = new Date(arsip.created_at);
            return createdDate.getMonth() === lastMonth && createdDate.getFullYear() === lastMonthYear;
        }).length;

        // Hitung persentase perubahan
        const changePercent = dokumenBulanLalu > 0
            ? ((dokumenBulanIni - dokumenBulanLalu) / dokumenBulanLalu * 100).toFixed(1)
            : 0;

        // Hitung total ukuran file (Supabase Free Tier tracking)
        const totalSizeBytes = archives.reduce((sum, arsip) => sum + (arsip.fileSize || 0), 0);
        const totalSizeMB = (totalSizeBytes / (1024 * 1024)); // Ukuran dalam MB
        const maxStorageMB = 1024; // Limit Supabase Free Tier (1 GB = 1024 MB)

        const storagePercent = Math.min(((totalSizeMB / maxStorageMB) * 100), 100).toFixed(1);
        const sisaMB = (maxStorageMB - totalSizeMB);

        // Format Tampilan (Ganti ke GB kalau udah gede)
        const displayUsage = totalSizeMB > 500
            ? `${(totalSizeMB / 1024).toFixed(2)} GB`
            : `${totalSizeMB.toFixed(1)} MB`;

        const displayLimit = maxStorageMB >= 1024 ? '1 GB' : `${maxStorageMB} MB`;
        const displaySisa = sisaMB > 500
            ? `${(sisaMB / 1024).toFixed(2)} GB`
            : `${sisaMB.toFixed(1)} MB`;

        return [
            {
                label: 'Total Dokumen',
                value: totalDokumen.toLocaleString('id-ID'),
                change: `${totalDokumen} arsip`,
                isPositive: null,
                icon: 'folder_open',
                color: 'blue',
                progress: Math.min((totalDokumen / 100) * 100, 100)
            },
            {
                label: 'Dokumen Baru (Bulan Ini)',
                value: dokumenBulanIni.toLocaleString('id-ID'),
                change: `${changePercent >= 0 ? '+' : ''}${changePercent}%`,
                isPositive: changePercent >= 0,
                icon: 'new_releases',
                color: 'emerald',
                subtext: 'Dibandingkan bulan sebelumnya'
            },
            {
                label: 'Kapasitas Penyimpanan',
                value: displayUsage,
                totalValue: `/ ${displayLimit}`,
                change: `Sisa ${displaySisa}`,
                isPositive: null,
                icon: 'storage',
                color: 'amber',
                progress: parseFloat(storagePercent)
            }
        ];
    }, [archives]);

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {stats.map((stat, idx) => (
                <div key={idx} className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm transition-all hover:shadow-md">
                    <div className="flex justify-between items-start mb-4">
                        <div className={`p-2 rounded-lg ${stat.color === 'blue' ? 'bg-blue-50 dark:bg-blue-900/20 text-primary' :
                            stat.color === 'emerald' ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600' :
                                'bg-amber-50 dark:bg-amber-900/20 text-amber-600'
                            }`}>
                            <span className="material-symbols-outlined">{stat.icon}</span>
                        </div>
                        {stat.isPositive !== null ? (
                            <span className={`text-xs font-bold flex items-center px-2 py-1 rounded-full ${stat.isPositive ? 'text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20' : 'text-red-500 bg-red-50 dark:bg-red-900/20'
                                }`}>
                                <span className="material-symbols-outlined text-sm mr-1">
                                    {stat.isPositive ? 'trending_up' : 'trending_down'}
                                </span>
                                {stat.change}
                            </span>
                        ) : (
                            <span className="text-slate-500 text-xs font-medium">{stat.change}</span>
                        )}
                    </div>
                    <p className="text-slate-500 text-sm font-medium">{stat.label}</p>
                    <h2 className="text-3xl font-black mt-1">
                        {stat.value} {stat.totalValue && <span className="text-lg font-bold text-slate-400">{stat.totalValue}</span>}
                    </h2>
                    {stat.progress !== undefined ? (
                        <div className="mt-4 w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                            <div
                                className={`h-full rounded-full transition-all duration-500 ${stat.color === 'blue' ? 'bg-primary' : 'bg-amber-500'}`}
                                style={{ width: `${stat.progress}%` }}
                            ></div>
                        </div>
                    ) : (
                        <p className="text-xs text-slate-400 mt-2 italic">{stat.subtext}</p>
                    )}
                </div>
            ))}
        </div>
    );
};

export default StatistikLaporan;
