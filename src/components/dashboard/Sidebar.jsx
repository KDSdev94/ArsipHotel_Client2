import React from 'react';

const Sidebar = () => {
    return (
        <aside className="w-72 bg-[#0f172a] text-slate-300 flex flex-col flex-shrink-0">
            <div className="p-6 flex items-center gap-3">
                <div className="size-10 flex items-center justify-center bg-primary rounded-xl text-white shadow-lg shadow-primary/20">
                    <span className="material-symbols-outlined text-2xl text-white">folder_managed</span>
                </div>
                <h2 className="text-white text-lg font-bold leading-tight tracking-tight">Arsip Digital Hotel</h2>
            </div>
            <nav className="flex-1 px-4 space-y-1 mt-4">
                <a className="flex items-center gap-3 px-4 py-3 rounded-xl bg-primary text-white font-semibold transition-all shadow-md shadow-primary/10 group" href="#">
                    <span className="material-symbols-outlined">dashboard</span>
                    <span>Beranda</span>
                </a>
                <a className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 hover:text-white transition-all group" href="#">
                    <span className="material-symbols-outlined text-slate-400 group-hover:text-white">description</span>
                    <span>Dokumen</span>
                </a>
                <a className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 hover:text-white transition-all group" href="#">
                    <span className="material-symbols-outlined text-slate-400 group-hover:text-white">corporate_fare</span>
                    <span>Departemen</span>
                </a>
                <a className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 hover:text-white transition-all group" href="#">
                    <span className="material-symbols-outlined text-slate-400 group-hover:text-white">group</span>
                    <span>Pengguna</span>
                </a>
                <a className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 hover:text-white transition-all group" href="#">
                    <span className="material-symbols-outlined text-slate-400 group-hover:text-white">assessment</span>
                    <span>Laporan</span>
                </a>
            </nav>
            <div className="mt-auto p-4 border-t border-white/10 bg-black/20">
                <div className="flex items-center gap-3 px-2 mb-4">
                    <div
                        className="size-10 rounded-full border-2 border-primary/30 bg-center bg-cover flex-shrink-0"
                        style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAxgXbF2jDB5zXQ6557TlA5tWuMt6UWrfbKaPlCl4_XYKIC69ItOjm2Mwpe7MzPiv2f-zYGTD83_sm2Uqi_vims-CFoNRI3OOmHbajbblnult80-V7jW5FXe5ul3Sz_dGJVzuZPn9C_Y4xETi4lUTcAL4XHIYcYqiJsHFcLjfiK3yMikBLDqGmIfDM3qwipo2M6n6_Hm1ff4SBNARPlqkITKHqh3g_smd45zVgY8sSfRbGTmFyynY1253WIIT2mzemvcPUhgPMMEh2b")' }}
                    ></div>
                    <div className="flex flex-col min-w-0">
                        <span className="text-white text-sm font-bold truncate">Nama Pengguna</span>
                        <span className="text-xs text-slate-400 font-medium">Admin / HR</span>
                    </div>
                </div>
                <button className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-500/10 hover:text-red-400 transition-all group w-full text-left" href="#">
                    <span className="material-symbols-outlined text-slate-400 group-hover:text-red-400">logout</span>
                    <span className="font-semibold text-sm">Keluar</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
