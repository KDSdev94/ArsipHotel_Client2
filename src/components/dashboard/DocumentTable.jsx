import React from 'react';

const DocumentTable = () => {
    const documents = [
        {
            id: 1,
            name: 'Laporan_Pemeliharaan_Q3.pdf',
            size: '4.2 MB',
            category: 'Pemeliharaan',
            date: '24 Okt, 2023',
            type: 'pdf'
        },
        {
            id: 2,
            name: 'Gaji_Staf_Sept.xlsx',
            size: '1.8 MB',
            category: 'Sumber Daya Manusia',
            date: '30 Sept, 2023',
            type: 'excel'
        }
    ];

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
                            <th className="px-6 py-4 text-xs font-bold text-[#616f89] dark:text-gray-400 uppercase tracking-wider">Nama File</th>
                            <th className="px-6 py-4 text-xs font-bold text-[#616f89] dark:text-gray-400 uppercase tracking-wider">Kategori</th>
                            <th className="px-6 py-4 text-xs font-bold text-[#616f89] dark:text-gray-400 uppercase tracking-wider">Tanggal Unggah</th>
                            <th className="px-6 py-4 text-xs font-bold text-[#616f89] dark:text-gray-400 uppercase tracking-wider text-right">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                        {documents.map((doc) => (
                            <tr key={doc.id} className="hover:bg-gray-50/80 dark:hover:bg-gray-700/30 transition-colors group">
                                <td className="px-6 py-5">
                                    <div className="flex items-center gap-3">
                                        <div className={`size-10 flex items-center justify-center rounded-lg ${doc.type === 'pdf' ? 'bg-red-50 dark:bg-red-900/20 text-red-600' : 'bg-green-50 dark:bg-green-900/20 text-green-600'}`}>
                                            <span className="material-symbols-outlined text-2xl">
                                                {doc.type === 'pdf' ? 'picture_as_pdf' : 'description'}
                                            </span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-sm font-semibold text-[#111318] dark:text-white">{doc.name}</span>
                                            <span className="text-xs text-gray-400">{doc.size}</span>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-5">
                                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border ${doc.category === 'Pemeliharaan'
                                            ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-blue-100 dark:border-blue-800'
                                            : 'bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 border-purple-100 dark:border-purple-800'
                                        }`}>
                                        {doc.category}
                                    </span>
                                </td>
                                <td className="px-6 py-5 text-sm text-[#616f89] dark:text-gray-400">{doc.date}</td>
                                <td className="px-6 py-5 text-right">
                                    <div className="flex justify-end gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                                        <button className="p-2 hover:bg-primary/10 hover:text-primary rounded-lg transition-colors text-gray-500" title="Lihat">
                                            <span className="material-symbols-outlined">visibility</span>
                                        </button>
                                        <button className="p-2 hover:bg-primary/10 hover:text-primary rounded-lg transition-colors text-gray-500" title="Unduh">
                                            <span className="material-symbols-outlined">download</span>
                                        </button>
                                        <button className="p-2 hover:bg-red-100 hover:text-red-600 rounded-lg transition-colors text-gray-500" title="Hapus">
                                            <span className="material-symbols-outlined">delete</span>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="px-6 py-4 flex items-center justify-between border-t border-gray-100 dark:border-gray-700 bg-gray-50/30 dark:bg-gray-900/20">
                <span className="text-sm text-[#616f89] dark:text-gray-400 font-medium">Halaman 1 dari 15</span>
                <div className="flex gap-2">
                    <button className="flex items-center justify-center size-8 rounded border border-gray-200 dark:border-gray-700 text-gray-400 cursor-not-allowed">
                        <span className="material-symbols-outlined text-base">chevron_left</span>
                    </button>
                    <button className="flex items-center justify-center size-8 rounded border border-primary bg-primary text-white text-sm font-bold">1</button>
                    <button className="flex items-center justify-center size-8 rounded border border-gray-200 dark:border-gray-700 text-sm font-medium hover:border-primary hover:text-primary transition-colors">2</button>
                    <button className="flex items-center justify-center size-8 rounded border border-gray-200 dark:border-gray-700 text-sm font-medium hover:border-primary hover:text-primary transition-colors">3</button>
                    <button className="flex items-center justify-center size-8 rounded border border-gray-200 dark:border-gray-700 text-primary transition-colors hover:bg-primary/10">
                        <span className="material-symbols-outlined text-base">chevron_right</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DocumentTable;
