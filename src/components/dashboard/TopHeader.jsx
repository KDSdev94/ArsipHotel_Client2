import React from 'react';

const TopHeader = () => {
    return (
        <header className="flex items-center justify-between sticky top-0 z-10 border-b border-gray-200 dark:border-gray-800 bg-white/80 backdrop-blur-md dark:bg-background-dark/80 px-8 py-4">
            <div className="flex items-center gap-4">
                <h2 className="text-[#111318] dark:text-white text-lg font-bold">Pustaka Dokumen</h2>
            </div>
            <div className="flex justify-end gap-6 items-center">
                <div className="flex gap-3">
                    <button className="flex min-w-[140px] cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold shadow-sm hover:bg-blue-700 transition-colors">
                        <span className="material-symbols-outlined text-sm">cloud_upload</span>
                        <span>Unggah Cepat</span>
                    </button>
                </div>
                <div className="h-6 w-px bg-gray-200 dark:bg-gray-700"></div>
                <button className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
                    <span className="material-symbols-outlined">settings</span>
                </button>
            </div>
        </header>
    );
};

export default TopHeader;
