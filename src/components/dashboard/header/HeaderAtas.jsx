import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { useUserProfile } from '../../../contexts/UserProfileContext';

// Komponen buat header di atas. Nerima 'title' (judul) dan 'showBack' (tampilkan tombol kembali)
const HeaderAtas = ({ title, showBack = false }) => {
    const navigate = useNavigate(); // Fungsi buat pindah-pindah halaman secara manual
    const { currentUser, logout } = useAuth();
    const { userProfile } = useUserProfile();
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const dropdownRef = useRef(null);

    const userName = userProfile?.name || currentUser?.displayName || 'User';
    const userRole = userProfile?.role || 'User';

    // Menutup dropdown saat klik di luar
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsProfileOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = async () => {
        if (window.confirm('Keluar dari sistem?')) {
            const result = await logout();
            if (result.success) navigate('/login');
        }
    };

    return (
        // Header ini "sticky" (nempel di atas pas di-scroll) dan punya efek glassmorphism (blur)
        <header className="flex items-center justify-between sticky top-0 z-50 border-b border-gray-200 dark:border-gray-800 bg-white/80 backdrop-blur-md dark:bg-background-dark/80 px-8 py-4">
            <div className="flex items-center gap-4">
                {/* Judul halamannya, kalo gak dikirim, defaultnya 'Arsip Digital' */}
                <h2 className="text-[#111318] dark:text-white text-lg font-bold uppercase tracking-tight">{title || 'Arsip Digital'}</h2>
            </div>

            <div className="flex justify-end gap-6 items-center">
                <div className="flex gap-3">
                    {/* Logika: Kalo showBack itu 'true', tampilkan tombol Kembali. Kalo 'false', tampilkan tombol Unggah Cepat. */}
                    {showBack ? (
                        <button
                            onClick={() => navigate(-1)} // navigate(-1) itu artinya "mundur 1 langkah" ke halaman sebelumnya
                            className="flex min-w-30 cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-lg h-10 px-4 bg-white border border-gray-200 dark:bg-gray-800 dark:border-gray-700 text-[#111318] dark:text-white text-sm font-bold shadow-sm hover:bg-gray-50 transition-colors"
                        >
                            <span className="material-symbols-outlined text-sm">arrow_back</span>
                            <span>Kembali</span>
                        </button>
                    ) : (
                        <button
                            onClick={() => navigate('/upload')} // Kalo diklik, langsung pindah ke halaman upload
                            className="flex min-w-35 cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold shadow-sm hover:bg-blue-700 transition-colors"
                        >
                            <span className="material-symbols-outlined text-sm">cloud_upload</span>
                            <span>Unggah Cepat</span>
                        </button>
                    )}
                </div>

                {/* Garis pembatas tipis vertical */}
                <div className="h-6 w-px bg-gray-200 dark:bg-gray-700"></div>

                {/* Tombol Profil & Dropdown */}
                <div className="relative" ref={dropdownRef}>
                    <button
                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                        className="flex items-center gap-2 p-1 pl-3 bg-slate-50 dark:bg-slate-800 rounded-full border border-slate-200 dark:border-gray-700 hover:border-primary transition-all group"
                    >
                        <div className="flex flex-col items-end hidden md:flex">
                            <span className="text-[11px] font-black text-slate-900 dark:text-white leading-none uppercase">{userName}</span>
                            <span className="text-[9px] text-slate-400 font-bold uppercase">{currentUser?.email?.split('@')[0]}</span>
                        </div>
                        <div className="size-8 rounded-full bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/20">
                            <span className="material-symbols-outlined text-[20px]">person</span>
                        </div>
                    </button>

                    {/* Dropdown Menu */}
                    {isProfileOpen && (
                        <div className="absolute right-0 mt-3 w-56 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 py-2 animate-in fade-in zoom-in-95 duration-200 z-100">
                            <div className="px-4 py-3 border-b border-gray-50 dark:border-gray-700 mb-1">
                                <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Akun Saya</p>
                                <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{currentUser?.email}</p>
                            </div>

                            <Link
                                to="/profile"
                                className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 dark:text-slate-300 hover:bg-primary/5 hover:text-primary transition-colors"
                                onClick={() => setIsProfileOpen(false)}
                            >
                                <span className="material-symbols-outlined text-[20px]">account_circle</span>
                                <span className="font-bold">Profil Lengkap</span>
                            </Link>

                            <Link
                                to="/ganti-password"
                                className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 dark:text-slate-300 hover:bg-primary/5 hover:text-primary transition-colors"
                                onClick={() => setIsProfileOpen(false)}
                            >
                                <span className="material-symbols-outlined text-[20px]">lock_reset</span>
                                <span className="font-bold">Ganti Password</span>
                            </Link>

                            <div className="h-px bg-gray-50 dark:bg-gray-700 my-1"></div>

                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
                            >
                                <span className="material-symbols-outlined text-[20px]">logout</span>
                                <span className="font-bold">Log Out</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default HeaderAtas;

