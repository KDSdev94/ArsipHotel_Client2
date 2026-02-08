import React from 'react';
import Sidebar from '../components/dashboard/Sidebar';
import TopHeader from '../components/dashboard/TopHeader';
import SearchFilters from '../components/dashboard/SearchFilters';
import DocumentTable from '../components/dashboard/DocumentTable';

const Home = () => {
    return (
        <div className="flex h-screen overflow-hidden bg-background-light dark:bg-background-dark text-[#111318] dark:text-gray-100 font-sans">
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col overflow-y-auto">
                {/* Header */}
                <TopHeader />

                {/* Content */}
                <main className="flex-1 p-8">
                    <div className="flex flex-wrap justify-between items-end gap-4 mb-8">
                        <div className="flex flex-col gap-1">
                            <h1 className="text-[#111318] dark:text-white text-3xl font-bold font-sans leading-tight tracking-tight">
                                Beranda Arsip Digital
                            </h1>
                            <p className="text-[#616f89] dark:text-gray-400 text-base font-normal">
                                Kelola, cari, dan atur semua aset arsip hotel dengan efisien.
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <button className="flex items-center justify-center rounded-lg h-10 px-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-[#111318] dark:text-white text-sm font-bold shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                <span className="material-symbols-outlined mr-2">download_for_offline</span>
                                Ekspor Data
                            </button>
                        </div>
                    </div>

                    {/* Search and Filters */}
                    <SearchFilters />

                    {/* Main Table */}
                    <DocumentTable />
                </main>

                {/* Footer */}
                <footer className="mt-auto py-6 px-10 border-t border-gray-200 dark:border-gray-800 text-center">
                    <p className="text-xs text-[#616f89] dark:text-gray-500">
                        © 2026 Sistem Manajemen Arsip Digital Hotel. Semua dokumen dienkripsi dan diamankan.
                    </p>
                </footer>
            </div>
        </div>
    );
};

export default Home;
