// ============================================
// FILE: NavigasiSamping.jsx (Sidebar Navigation)
// FUNGSI: Menu samping kiri buat navigasi antar halaman
// FITUR: Role-based menu filtering (Admin vs Staf)
// ============================================

import React, { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { useUserProfile } from '../../../contexts/UserProfileContext';

const NavigasiSamping = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { logout } = useAuth();
    const { isAdmin } = useUserProfile();

    // State buat kontrol dropdown Arsip (buka/tutup)
    const [isArsipOpen, setIsArsipOpen] = useState(false);

    // ============================================
    // FUNGSI LOGOUT
    // ============================================
    const handleLogout = async () => {
        if (window.confirm('Yakin mau keluar dari sistem?')) {
            const result = await logout();
            if (result.success) {
                navigate('/login');
            }
        }
    };

    // ============================================
    // DATA MENU NAVIGASI (DENGAN SECTION)
    // ============================================
    const menuSections = [
        {
            title: 'MAIN NAVIGATION',
            items: [
                { icon: 'dashboard', label: 'Dashboard', path: '/home' },
                {
                    icon: 'folder_open',
                    label: 'Arsip',
                    path: '#',
                    isDropdown: true,
                    subMenu: [
                        { icon: 'inventory_2', label: 'Daftar Arsip', path: '/daftar-arsip' },
                        { icon: 'upload_file', label: 'Upload Baru', path: '/upload' },
                        { icon: 'delete', label: 'Tempat Sampah', path: '/trash' }
                    ]
                },
                // Laporan bisa diakses oleh semua role
                { icon: 'history', label: 'Laporan', path: '/reports' }
            ]
        },
        {
            title: 'ADMINISTRATOR',
            adminOnly: true, // Section ini cuma buat Admin
            items: [
                { icon: 'category', label: 'Kelola Kategori', path: '/kategori' },
                { icon: 'corporate_fare', label: 'Manajemen Divisi', path: '/divisi' },
                { icon: 'group', label: 'Manajemen User', path: '/users' }
            ]
        },

    ];

    // Cek apakah salah satu submenu Arsip sedang aktif
    const isArsipActive = ['/daftar-arsip', '/upload', '/trash'].includes(location.pathname);

    return (
        <aside className="w-full h-full bg-[#0f172a] text-slate-300 flex flex-col overflow-hidden">

            {/* ========== LOGO & NAMA APLIKASI ========== */}
            <div className="p-6 flex items-center gap-3 shrink-0">
                <div className="size-10 flex items-center justify-center rounded-xl text-white shadow-lg bg-[#0f172a]">
                    <img className="w-10 h-10" src="/logo_512.png" alt="logo" />
                </div>
                <h2 className="text-white text-lg font-bold leading-tight tracking-tight uppercase">
                    Arsip Hotel
                </h2>
            </div>

            {/* ========== LIST MENU NAVIGASI ========== */}
            <nav className="flex-1 px-4 space-y-6 mt-4 overflow-y-auto custom-scrollbar pb-10">
                {menuSections.map((section) => {
                    // Skip section ADMINISTRATOR jika user bukan Admin
                    if (section.adminOnly && !isAdmin()) {
                        return null;
                    }

                    return (
                        <div key={section.title} className="space-y-2">
                            {/* Judul Section */}
                            <p className="px-4 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
                                {section.title}
                            </p>

                            {/* Item dalam section */}
                            <div className="space-y-1">
                                {section.items.map((item) => (
                                    <div key={item.label}>
                                        {item.isDropdown ? (
                                            <div>
                                                <button
                                                    onClick={() => setIsArsipOpen(!isArsipOpen)}
                                                    className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl transition-all group ${isArsipActive
                                                        ? 'bg-primary text-white font-semibold shadow-md shadow-primary/10'
                                                        : 'hover:bg-white/5 hover:text-white'
                                                        }`}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <span className="material-symbols-outlined text-[20px]">
                                                            {item.icon}
                                                        </span>
                                                        <span className="text-sm font-medium">{item.label}</span>
                                                    </div>
                                                    <span className={`material-symbols-outlined text-sm transition-transform ${isArsipOpen ? 'rotate-180' : ''
                                                        }`}>
                                                        expand_more
                                                    </span>
                                                </button>

                                                {isArsipOpen && (
                                                    <div className="ml-4 mt-1 space-y-1 border-l border-slate-700/50 pl-2 animate-in slide-in-from-top-2 duration-200">
                                                        {item.subMenu.map((subItem) => (
                                                            <NavLink
                                                                key={subItem.label}
                                                                to={subItem.path}
                                                                className={({ isActive }) =>
                                                                    `flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all text-xs ${isActive
                                                                        ? 'bg-primary/20 text-white font-bold'
                                                                        : 'hover:bg-white/5 hover:text-white text-slate-400'
                                                                    }`
                                                                }
                                                            >
                                                                <span className="material-symbols-outlined text-[18px]">
                                                                    {subItem.icon}
                                                                </span>
                                                                <span>{subItem.label}</span>
                                                            </NavLink>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <NavLink
                                                to={item.path}
                                                className={({ isActive }) =>
                                                    `flex items-center gap-3 px-4 py-3 rounded-xl transition-all group ${isActive && item.path !== '#'
                                                        ? 'bg-primary text-white font-semibold shadow-md shadow-primary/10 text-sm'
                                                        : 'hover:bg-white/5 hover:text-white text-sm'
                                                    }`
                                                }
                                            >
                                                <span className={`material-symbols-outlined text-[20px] ${item.path === '#' ? 'text-slate-400 group-hover:text-white' : ''
                                                    }`}>
                                                    {item.icon}
                                                </span>
                                                <span className="font-medium">{item.label}</span>
                                            </NavLink>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </nav>

            {/* ========== FOOTER SIDEBAR ========== */}
            <div className="mt-auto p-4 border-t border-slate-800/50 bg-black/20 shrink-0">
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-500/10 hover:text-red-400 transition-all group w-full text-left"
                >
                    <span className="material-symbols-outlined text-slate-400 group-hover:text-red-400">
                        logout
                    </span>
                    <span className="font-bold text-sm">Keluar Aplikasi</span>
                </button>
            </div>
        </aside>
    );
};

export default NavigasiSamping;
