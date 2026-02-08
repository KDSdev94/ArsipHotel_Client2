import React from 'react';

const SearchFilters = () => {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 mb-6">
            <div className="flex flex-col gap-6">
                <div className="flex w-full items-stretch rounded-lg h-12 border border-gray-200 dark:border-gray-700 focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all overflow-hidden">
                    <div className="text-[#616f89] dark:text-gray-400 flex items-center justify-center px-4 bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700">
                        <span className="material-symbols-outlined">search</span>
                    </div>
                    <input
                        className="flex w-full min-w-0 flex-1 border-none bg-transparent px-4 text-base font-normal text-[#111318] dark:text-white placeholder:text-[#616f89] dark:placeholder:text-gray-500 focus:ring-0"
                        placeholder="Cari dokumen..."
                    />
                </div>

                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex gap-3 flex-wrap">
                        <button className="flex h-10 items-center justify-center gap-2 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 px-4 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                            <span className="material-symbols-outlined text-gray-500 text-lg">calendar_today</span>
                            <span className="text-[#111318] dark:text-white text-sm font-medium">Semua Tanggal</span>
                            <span className="material-symbols-outlined text-gray-400">expand_more</span>
                        </button>
                        <button className="flex h-10 items-center justify-center gap-2 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 px-4 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                            <span className="material-symbols-outlined text-gray-500 text-lg">corporate_fare</span>
                            <span className="text-[#111318] dark:text-white text-sm font-medium">Departemen</span>
                            <span className="material-symbols-outlined text-gray-400">expand_more</span>
                        </button>
                        <button className="flex h-10 items-center justify-center gap-2 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 px-4 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                            <span className="material-symbols-outlined text-gray-500 text-lg">description</span>
                            <span className="text-[#111318] dark:text-white text-sm font-medium">Tipe File</span>
                            <span className="material-symbols-outlined text-gray-400">expand_more</span>
                        </button>
                    </div>
                    <p className="text-sm text-[#616f89] dark:text-gray-400 font-medium">Menampilkan 142 dokumen</p>
                </div>
            </div>
        </div>
    );
};

export default SearchFilters;
