import React from 'react';

// Grafik khusus untuk statistik per Divisi
const GrafikDivisi = () => {
    // Data dummy untuk contoh tampilan grafik
    const data = [
        { label: 'BO', height: '85%', full: 'Back Office' },
        { label: 'HK', height: '65%', full: 'Housekeeping' },
        { label: 'S&M', height: '45%', full: 'Sales & Marketing' },
        { label: 'HR', height: '95%', full: 'Human Resources' },
        { label: 'FIN', height: '75%', full: 'Finance' },
        { label: 'ENG', height: '30%', full: 'Engineering' },
        { label: 'IT', height: '55%', full: 'Information Tech' },
    ];

    return (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm h-full">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h3 className="font-bold text-lg">Statistik Divisi</h3>
                    <p className="text-xs text-slate-500">Distribusi beban kerja berdasarkan divisi hotel</p>
                </div>
                <button className="text-slate-400 hover:text-slate-600 transition-colors">
                    <span className="material-symbols-outlined">more_horiz</span>
                </button>
            </div>
            {/* Area bar chart sederhana pakai CSS saja */}
            <div className="h-64 flex items-end justify-around gap-2 pb-6 pt-4 px-2">
                {data.map((item, idx) => (
                    <div key={idx} className="flex flex-col items-center gap-3 w-full max-w-[40px] group">
                        <div
                            className="w-full bg-primary/20 border-t-4 border-primary rounded-t-lg transition-all hover:bg-primary/30 relative"
                            style={{ height: item.height }}
                        >
                            {/* Tooltip pas di-hover */}
                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20">
                                {item.full}: {item.height}
                            </div>
                        </div>
                        <span className="text-[10px] font-bold text-slate-500 uppercase">{item.label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default GrafikDivisi;
