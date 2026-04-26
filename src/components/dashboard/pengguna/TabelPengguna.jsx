import React from 'react';
import { isSuperAdminProfile, USER_ACCOUNT_STATUS } from '../../../utils/accessControl';

const TabelPengguna = ({ users = [], totalCount = 0, onEdit, onDelete, canManageUser = () => true }) => {
    return (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[800px]">
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
                                                <div className="flex items-center gap-2 min-w-0">
                                                    <span className="inline-flex items-center rounded-md bg-slate-100 dark:bg-slate-800 px-2 py-1 text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-300 shrink-0">
                                                        {user.employeeId || '-'}
                                                    </span>
                                                    <p className="text-xs font-medium text-slate-400 truncate">{user.email}</p>
                                                </div>
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
                                            {isSuperAdminProfile(user) && (
                                                <span className="inline-flex px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest w-fit bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300">
                                                    Super Admin
                                                </span>
                                            )}
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
                                            {user.accountStatus === USER_ACCOUNT_STATUS.SUSPENDED ? (
                                                <div className="flex items-center gap-2 px-3 py-1 bg-amber-50 dark:bg-amber-900/20 text-amber-600 rounded-full border border-amber-100 dark:border-amber-800/50">
                                                    <div className="size-1.5 bg-amber-500 rounded-full"></div>
                                                    <span className="text-[10px] font-black uppercase tracking-widest">Nonaktif</span>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-2 px-3 py-1 bg-green-50 dark:bg-green-900/20 text-green-600 rounded-full border border-green-100 dark:border-green-800/50">
                                                    <div className="size-1.5 bg-green-500 rounded-full animate-pulse"></div>
                                                    <span className="text-[10px] font-black uppercase tracking-widest">Aktif</span>
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-8 py-4 text-center">
                                        <div className="flex items-center justify-center gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => onEdit(user)}
                                                disabled={!canManageUser(user)}
                                                className="size-9 rounded-lg flex items-center justify-center text-slate-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-primary transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                                                title={canManageUser(user) ? 'Edit' : 'Hanya Super Admin yang bisa mengelola admin'}
                                            >
                                                <span className="material-symbols-outlined text-[18px]">edit_square</span>
                                            </button>
                                            <button
                                                onClick={() => onDelete(user)}
                                                disabled={!canManageUser(user)}
                                                className="size-9 rounded-lg flex items-center justify-center text-slate-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                                                title={canManageUser(user) ? 'Delete' : 'Hanya Super Admin yang bisa mengelola admin'}
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

            {/* Footer Tabel - Dinamis & Responsif */}
            <div className="px-8 py-5 bg-slate-50/50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                    Menampilkan <span className="font-bold text-slate-900 dark:text-white">{users.length}</span> dari <span className="font-bold text-slate-900 dark:text-white">{totalCount}</span> karyawan
                </p>
                <div className="flex items-center gap-2">
                    <button className="flex items-center gap-1 px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800 transition-all disabled:opacity-30" disabled>
                        <span className="material-symbols-outlined text-[18px]">chevron_left</span>
                        Sebelumnya
                    </button>
                    <button className="size-9 flex items-center justify-center bg-primary text-white rounded-xl text-xs font-bold shadow-lg shadow-primary/20">1</button>
                    <button className="flex items-center gap-1 px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800 transition-all disabled:opacity-30" disabled>
                        Selanjutnya
                        <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TabelPengguna;
