import React from 'react';

// Komponen Kartu Divisi (sebelumnya Departemen)
// Kita buang icon dan manager, tambahin deskripsi dan userCount
const KartuDivisi = ({ name, description, userCount, onEdit, onDelete }) => {
    return (
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm hover:shadow-md transition-all group relative flex flex-col h-full">

            {/* Tombol Aksi di pojok kanan atas */}
            <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                <button
                    onClick={onEdit}
                    className="size-8 flex items-center justify-center bg-white/90 dark:bg-slate-700/90 text-blue-600 rounded-lg shadow-sm hover:bg-blue-600 hover:text-white transition-all"
                    title="Edit Divisi"
                >
                    <span className="material-symbols-outlined text-[18px]">edit</span>
                </button>
                <button
                    onClick={onDelete}
                    className="size-8 flex items-center justify-center bg-white/90 dark:bg-slate-700/90 text-red-600 rounded-lg shadow-sm hover:bg-red-600 hover:text-white transition-all"
                    title="Hapus Divisi"
                >
                    <span className="material-symbols-outlined text-[18px]">delete</span>
                </button>
            </div>

            <div className="p-6 flex-1 flex flex-col">
                {/* Penanda warna di atas biar gak polosan banget */}
                <div className="w-12 h-1.5 bg-primary rounded-full mb-4"></div>

                {/* Nama Divisi */}
                <h3 className="text-xl font-bold mb-2 text-slate-800 dark:text-white group-hover:text-primary transition-colors">
                    {name}
                </h3>

                {/* Deskripsi Divisi */}
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-6 line-clamp-3">
                    {description || 'Belum ada deskripsi untuk divisi ini.'}
                </p>

                <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
                    {/* Statistik Jumlah User (Karyawan) */}
                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                        <span className="material-symbols-outlined text-lg">group</span>
                        <span className="text-sm font-bold">{userCount || 0} <span className="font-medium text-xs">Anggota</span></span>
                    </div>

                    {/* Tombol Lebih Lanjut */}
                    <button className="text-primary hover:text-blue-700 text-xs font-bold flex items-center gap-1 group/btn">
                        Detail Divisi
                        <span className="material-symbols-outlined text-sm group-hover/btn:translate-x-1 transition-transform">arrow_forward</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default KartuDivisi;
