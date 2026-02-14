import React from 'react';
import { useNavigate } from 'react-router-dom';

// Komponen buat header di atas. Nerima 'title' (judul) dan 'showBack' (tampilkan tombol kembali)
const HeaderAtas = ({ title, showBack = false }) => {
    const navigate = useNavigate(); // Fungsi buat pindah-pindah halaman secara manual

    return (
        // Header ini "sticky" (nempel di atas pas di-scroll) dan punya efek glassmorphism (blur)
        <header className="flex items-center justify-between sticky top-0 z-10 border-b border-gray-200 dark:border-gray-800 bg-white/80 backdrop-blur-md dark:bg-background-dark/80 px-8 py-4">
            <div className="flex items-center gap-4">
                {/* Judul halamannya, kalo gak dikirim, defaultnya 'Arsip Digital' */}
                <h2 className="text-[#111318] dark:text-white text-lg font-bold">{title || 'Arsip Digital'}</h2>
            </div>

            <div className="flex justify-end gap-6 items-center">
                <div className="flex gap-3">
                    {/* Logika: Kalo showBack itu 'true', tampilkan tombol Kembali. Kalo 'false', tampilkan tombol Unggah Cepat. */}
                    {showBack ? (
                        <button
                            onClick={() => navigate(-1)} // navigate(-1) itu artinya "mundur 1 langkah" ke halaman sebelumnya
                            className="flex min-w-[120px] cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-lg h-10 px-4 bg-white border border-gray-200 dark:bg-gray-800 dark:border-gray-700 text-[#111318] dark:text-white text-sm font-bold shadow-sm hover:bg-gray-50 transition-colors"
                        >
                            <span className="material-symbols-outlined text-sm">arrow_back</span>
                            <span>Kembali</span>
                        </button>
                    ) : (
                        <button
                            onClick={() => navigate('/upload')} // Kalo diklik, langsung pindah ke halaman upload
                            className="flex min-w-[140px] cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold shadow-sm hover:bg-blue-700 transition-colors"
                        >
                            <span className="material-symbols-outlined text-sm">cloud_upload</span>
                            <span>Unggah Cepat</span>
                        </button>
                    )}
                </div>

                {/* Garis pembatas tipis vertical */}
                <div className="h-6 w-px bg-gray-200 dark:bg-gray-700"></div>

                {/* Tombol Settings */}
                <button className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
                    <span className="material-symbols-outlined">settings</span>
                </button>
            </div>
        </header>
    );
};

export default HeaderAtas;

