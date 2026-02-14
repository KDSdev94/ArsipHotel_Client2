import React from 'react';

const StatistikPengguna = ({ users = [] }) => {
    // ---- LOGIKA HITUNG STATISTIK REAL ----

    // 1. Hitung Admin (Role: Admin)
    const adminCount = users.filter(u => u.role === 'Admin').length;

    // 2. Hitung Staf (Role: Staf)
    const stafCount = users.filter(u => u.role === 'Staf').length;

    // 3. User yang baru gabung (misal: dalam 7 hari terakhir - dummy logic for now as we use ISO string)
    const totalUser = users.length;

    const stats = [
        { label: 'Total Pengguna', value: totalUser, icon: 'group', color: 'blue' },
        { label: 'Administrator', value: adminCount, icon: 'shield_person', color: 'purple' },
        { label: 'Staf / Staff', value: stafCount, icon: 'badge', color: 'orange' },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {stats.map((stat, idx) => (
                <div key={idx} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm transition-all hover:shadow-md hover:-translate-y-1">
                    <div className="flex justify-between items-start mb-4">
                        <div className={`p-3 rounded-xl bg-${stat.color}-50 dark:bg-${stat.color}-900/20 text-${stat.color}-600 dark:text-${stat.color}-400 flex items-center justify-center font-bold`}>
                            <span className="material-symbols-outlined text-[24px]">{stat.icon}</span>
                        </div>
                        <div className="flex flex-col items-end">
                            <span className="text-[10px] font-black tracking-widest uppercase text-slate-400">Status</span>
                            <span className="text-[11px] font-bold text-green-500 bg-green-50 dark:bg-green-900/20 px-2 py-0.5 rounded-full mt-1">Aktif</span>
                        </div>
                    </div>
                    <div>
                        <p className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">{stat.label}</p>
                        <div className="flex items-baseline gap-1">
                            <h4 className="text-3xl font-black text-slate-900 dark:text-white leading-none">{stat.value}</h4>
                            <span className="text-xs font-bold text-slate-400">Orang</span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default StatistikPengguna;
