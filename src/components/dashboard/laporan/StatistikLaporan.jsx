import React from 'react';

const StatistikLaporan = () => {
    const stats = [
        {
            label: 'Total Dokumen',
            value: '12,450',
            change: '+5.2%',
            isPositive: true,
            icon: 'folder_open',
            color: 'blue',
            progress: 75
        },
        {
            label: 'Dokumen Baru (Bulan Ini)',
            value: '842',
            change: '+12.4%',
            isPositive: true,
            icon: 'new_releases',
            color: 'emerald',
            subtext: 'Dibandingkan bulan sebelumnya'
        },
        {
            label: 'Kapasitas Penyimpanan',
            value: '15.4',
            totalValue: '/ 50 GB',
            change: 'Sisa 34.6 GB',
            isPositive: null,
            icon: 'storage',
            color: 'amber',
            progress: 31
        }
    ];

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
                    {stat.progress ? (
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
