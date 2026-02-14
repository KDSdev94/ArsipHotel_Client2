import React from 'react';
import NavigasiSamping from '../components/dashboard/sidebar/NavigasiSamping';
import StatistikLaporan from '../components/dashboard/laporan/StatistikLaporan';
import GrafikDivisi from '../components/dashboard/divisi/GrafikDivisi';
import GrafikTrenUnggahan from '../components/dashboard/dokumen/GrafikTrenUnggahan';
import TabelAktivitasBaru from '../components/dashboard/laporan/TabelAktivitasBaru';

const Reports = () => {
    return (
        <div className="flex h-screen overflow-hidden bg-white dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display">
            <NavigasiSamping />
            <main className="flex-1 overflow-y-auto custom-scrollbar bg-white dark:bg-background-dark">
                <div className="max-w-[1200px] mx-auto p-8">
                    <header className="flex flex-wrap items-center justify-between gap-6 mb-8">
                        <div>
                            <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Laporan & Statistik</h1>
                            <p className="text-slate-500 mt-1">Analisis data penggunaan arsip digital</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="hidden md:flex items-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 shadow-sm">
                                <span className="material-symbols-outlined text-slate-400 text-xl mr-2">calendar_today</span>
                                <span className="text-sm font-medium text-slate-600">Jan 2024 - Jun 2024</span>
                            </div>
                            <button className="bg-primary hover:bg-blue-700 text-white flex items-center gap-2 px-5 py-2.5 rounded-lg font-bold text-sm transition-all shadow-lg shadow-primary/20">
                                <span className="material-symbols-outlined text-xl">download</span>
                                Ekspor Laporan
                            </button>
                        </div>
                    </header>

                    {/* Top Stats */}
                    <StatistikLaporan />

                    {/* Charts Row */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                        <GrafikDivisi />
                        <GrafikTrenUnggahan />
                    </div>

                    {/* Activity Table */}
                    <TabelAktivitasBaru />
                </div>
            </main>
        </div>
    );
};

export default Reports;
