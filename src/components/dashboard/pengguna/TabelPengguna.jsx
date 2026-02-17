import React from 'react';

const TabelPengguna = ({ users = [], totalCount = 0, onEdit, onDelete }) => {
    return (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                            <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Nama</th>
                            <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Peran & Akses</th>
                            <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Divisi</th>
                            <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">Status</th>
                            <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">Kelola</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {users.length > 0 ? (
                            users.map((user) => (
                                <tr key={user.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-all group">
                                    <td className="px-8 py-4">
                                        <div className="flex items-center gap-4">
                                            {/* Inisial nama kalau gak ada foto */}
                                            <div className="size-10 rounded-xl bg-primary/10 dark:bg-primary/20 flex items-center justify-center text-primary font-black border border-primary/20 shrink-0">
                                                {user.name?.charAt(0).toUpperCase() || 'U'}
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-sm font-black text-slate-800 dark:text-white truncate uppercase tracking-tight">{user.name}</p>
                                                <p className="text-xs font-medium text-slate-400 truncate">{user.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-4">
                                        <div className="flex flex-col gap-1">
                                            <span className={`inline-flex px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest w-fit ${user.role === 'Admin'
                                                ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400'
                                                : 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                                                }`}>
                                                {user.role || 'Staf'}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-4">
                                        <div className="flex items-center gap-2">
                                            <span className="material-symbols-outlined text-slate-400 text-[18px]">corporate_fare</span>
                                            <p className="text-sm font-bold text-slate-600 dark:text-slate-400">{user.division || 'Umum'}</p>
                                        </div>
                                    </td>
                                    <td className="px-8 py-4">
                                        <div className="flex justify-center">
                                            <div className="flex items-center gap-2 px-3 py-1 bg-green-50 dark:bg-green-900/20 text-green-600 rounded-full border border-green-100 dark:border-green-800/50">
                                                <div className="size-1.5 bg-green-500 rounded-full animate-pulse"></div>
                                                <span className="text-[10px] font-black uppercase tracking-widest">Aktif</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-4 text-center">
                                        <div className="flex items-center justify-center gap-2">
                                            <button
                                                onClick={() => onEdit(user)}
                                                className="size-9 rounded-lg flex items-center justify-center text-slate-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-primary transition-all border border-transparent hover:border-blue-100 dark:hover:border-blue-800"
                                            >
                                                <span className="material-symbols-outlined text-[18px]">edit_square</span>
                                            </button>
                                            <button
                                                onClick={() => onDelete(user.id)}
                                                className="size-9 rounded-lg flex items-center justify-center text-slate-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500 transition-all border border-transparent hover:border-red-100 dark:hover:border-red-800"
                                            >
                                                <span className="material-symbols-outlined text-[18px]">delete</span>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="px-8 py-20 text-center">
                                    <div className="flex flex-col items-center gap-3">
                                        <span className="material-symbols-outlined text-4xl text-slate-200">person_search</span>
                                        <p className="text-slate-400 font-bold text-sm">Tidak ada karyawan yang ditemukan.</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Footer Tabel - Dinamis */}
            <div className="px-8 py-5 bg-slate-50/30 dark:bg-slate-800/20 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest">
                    Menampilkan <span className="text-slate-900 dark:text-white">{users.length}</span> dari <span className="text-slate-900 dark:text-white">{totalCount}</span> karyawan
                </p>
                <div className="flex gap-2">
                    <button className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-slate-700 transition-all shadow-sm">Sebelumnya</button>
                    <button className="px-4 py-2 bg-primary text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/20">1</button>
                    <button className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-slate-700 transition-all shadow-sm">Berikutnya</button>
                </div>
            </div>
        </div>
    );
};

export default TabelPengguna;
