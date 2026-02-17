import React from 'react';

const FilterPencarian = ({
    searchTerm,
    setSearchTerm,
    selectedDivisi,
    setSelectedDivisi,
    selectedType,
    setSelectedType,
    divisions = [],
    totalResults
}) => {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 mb-6 font-sans">
            <div className="flex flex-col gap-6">

                {/* Bar Pencarian Utama */}
                <div className="flex w-full items-stretch rounded-xl h-12 border border-gray-200 dark:border-gray-700 focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all overflow-hidden bg-slate-50 dark:bg-slate-900 border-none">
                    <div className="text-[#616f89] dark:text-gray-400 flex items-center justify-center px-4">
                        <span className="material-symbols-outlined">search</span>
                    </div>
                    <input
                        className="flex w-full min-w-0 flex-1 border-none bg-transparent px-2 text-base font-bold text-[#111318] dark:text-white placeholder:text-[#616f89] dark:placeholder:text-gray-500 focus:ring-0"
                        placeholder="Cari Judul atau Nomor Arsip..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {/* Deretan filter-filter di bawahnya */}
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex gap-3 flex-wrap">
                        {/* Selector Divisi */}
                        <div className="relative">
                            <select
                                value={selectedDivisi}
                                onChange={(e) => setSelectedDivisi(e.target.value)}
                                className="appearance-none h-10 pl-10 pr-10 rounded-xl bg-slate-50 dark:bg-slate-900 border-none text-slate-900 dark:text-white text-sm font-bold focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer"
                            >
                                <option value="">Semua Divisi</option>
                                {divisions.map(div => (
                                    <option key={div.id} value={div.name}>{div.name}</option>
                                ))}
                            </select>
                            <span className="material-symbols-outlined absolute left-3 top-2.5 text-slate-400 text-[20px]">corporate_fare</span>
                            <span className="material-symbols-outlined absolute right-2 top-2.5 text-slate-400">expand_more</span>
                        </div>

                        {/* Selector Tipe File */}
                        <div className="relative">
                            <select
                                value={selectedType}
                                onChange={(e) => setSelectedType(e.target.value)}
                                className="appearance-none h-10 pl-10 pr-10 rounded-xl bg-slate-50 dark:bg-slate-900 border-none text-slate-900 dark:text-white text-sm font-bold focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer"
                            >
                                <option value="">Semua Tipe</option>
                                <option value="application/pdf">PDF</option>
                                <option value="image">Gambar (JPG/PNG)</option>
                                <option value="sheet">Excel / Spreadsheet</option>
                                <option value="word">Word / Document</option>
                            </select>
                            <span className="material-symbols-outlined absolute left-3 top-2.5 text-slate-400 text-[20px]">description</span>
                            <span className="material-symbols-outlined absolute right-2 top-2.5 text-slate-400">expand_more</span>
                        </div>

                        {/* Button Reset */}
                        {(searchTerm || selectedDivisi || selectedType) && (
                            <button
                                onClick={() => {
                                    setSearchTerm('');
                                    setSelectedDivisi('');
                                    setSelectedType('');
                                }}
                                className="h-10 px-4 rounded-xl text-red-500 font-bold text-sm hover:bg-red-50 transition-all flex items-center gap-2"
                            >
                                <span className="material-symbols-outlined text-[18px]">restart_alt</span>
                                Reset Filter
                            </button>
                        )}
                    </div>
                    {/* Hasil Pencarian */}
                    <p className="text-sm text-[#616f89] dark:text-gray-400 font-bold uppercase tracking-wider">
                        Hasil: <span className="text-primary">{totalResults}</span> Arsip
                    </p>
                </div>
            </div>
        </div>
    );
};

export default FilterPencarian;

