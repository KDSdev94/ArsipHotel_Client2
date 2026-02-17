import React, { useMemo } from 'react';

// Grafik khusus untuk statistik per Divisi
const GrafikDivisi = ({ archives = [] }) => {
    // Hitung data real dari archives
    const data = useMemo(() => {
        // Hitung jumlah arsip per divisi
        const divisionCount = {};

        archives.forEach(arsip => {
            const divisi = arsip.divisi || 'Lainnya';
            divisionCount[divisi] = (divisionCount[divisi] || 0) + 1;
        });

        // Cari nilai maksimum untuk normalisasi tinggi bar
        const maxCount = Math.max(...Object.values(divisionCount), 1);

        // Convert ke array dan hitung persentase tinggi
        const chartData = Object.entries(divisionCount).map(([divisi, count]) => {
            const heightPercent = Math.max((count / maxCount) * 100, 10); // Min 10% biar keliatan

            // Singkatan divisi
            let label = divisi;
            if (divisi.length > 10) {
                const words = divisi.split(' ');
                label = words.map(w => w[0]).join('').toUpperCase();
            }

            return {
                label: label.length > 4 ? label.substring(0, 4) : label,
                height: `${heightPercent}%`,
                full: divisi,
                count: count
            };
        });

        // Sort by count descending
        return chartData.sort((a, b) => b.count - a.count).slice(0, 7); // Max 7 divisi
    }, [archives]);

    if (data.length === 0) {
        return (
            <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm h-full flex items-center justify-center">
                <div className="text-center text-slate-400">
                    <span className="material-symbols-outlined text-5xl mb-2">folder_off</span>
                    <p className="text-sm">Belum ada data arsip</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm h-full">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h3 className="font-bold text-lg">Statistik Divisi</h3>
                    <p className="text-xs text-slate-500">Distribusi arsip berdasarkan divisi</p>
                </div>
                <div className="text-xs text-slate-400 font-medium">
                    Total: {archives.length} arsip
                </div>
            </div>
            {/* Area bar chart sederhana pakai CSS saja */}
            <div className="h-64 flex items-end justify-around gap-2 pb-6 pt-4 px-2">
                {data.map((item, idx) => (
                    <div key={idx} className="flex flex-col items-center gap-3 w-full max-w-[60px] group">
                        <div
                            className="w-full bg-primary/20 border-t-4 border-primary rounded-t-lg transition-all hover:bg-primary/30 relative"
                            style={{ height: item.height }}
                        >
                            {/* Tooltip pas di-hover */}
                            <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20 pointer-events-none">
                                {item.full}: {item.count} arsip
                            </div>
                        </div>
                        <div className="text-center">
                            <span className="text-[10px] font-bold text-slate-500 uppercase block">{item.label}</span>
                            <span className="text-[9px] text-slate-400 font-medium">{item.count}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default GrafikDivisi;
