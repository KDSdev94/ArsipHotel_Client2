import React from 'react';
import NavigasiSamping from '../components/dashboard/sidebar/NavigasiSamping'; // Komponen navigasi samping
import HeaderAtas from '../components/dashboard/header/HeaderAtas'; // Komponen header atas
import FilterPencarian from '../components/dashboard/umum/FilterPencarian'; // Komponen untuk pencarian dan filter
import TabelDokumen from '../components/dashboard/dokumen/TabelDokumen'; // Komponen tabel daftar dokumen

const Home = () => {
    return (
        // Wrapper utama: 
        // flex (menggunakan Flexbox), h-screen (tinggi layar penuh), overflow-hidden (mencegah scroll di level body)
        // bg-white / dark:bg-background-dark (warna background dinamis tergantung mode)
        <div className="flex h-screen overflow-hidden bg-white dark:bg-background-dark text-[#111318] dark:text-gray-100 font-sans">

            {/* Sidebar: Terletak di kiri karena flex-direction default adalah row */}
            <NavigasiSamping />

            {/* Area Konten Utama: 
                flex-1 (mengambil sisa space yang ada), flex flex-col (konten di dalamnya disusun vertikal)
                overflow-y-auto (scroll hanya ada di area ini jika konten panjang)
            */}
            <div className="flex-1 flex flex-col overflow-y-auto">

                {/* Header: Menampilkan judul halaman */}
                <HeaderAtas title="Pustaka Dokumen" />

                {/* Main Content: Area tempat komponen dashboard diletakkan */}
                <main className="flex-1 p-8">
                    {/* Bagian Judul dan Tombol Aksi */}
                    <div className="flex flex-wrap justify-between items-end gap-4 mb-8">
                        <div className="flex flex-col gap-1">
                            <h1 className="text-[#111318] dark:text-white text-3xl font-bold font-sans leading-tight tracking-tight">
                                Beranda Arsip Digital
                            </h1>
                            <p className="text-[#616f89] dark:text-gray-400 text-base font-normal">
                                Kelola, cari, dan atur semua aset arsip hotel dengan efisien.
                            </p>
                        </div>
                        <div className="flex gap-3">
                            {/* Tombol Ekspor: Menggunakan hover dan transition untuk efek UI yang premium */}
                            <button className="flex items-center justify-center rounded-lg h-10 px-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-[#111318] dark:text-white text-sm font-bold shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                <span className="material-symbols-outlined mr-2">download_for_offline</span>
                                Ekspor Data
                            </button>
                        </div>
                    </div>

                    {/* Memanggil Komponen Search and Filters */}
                    <FilterPencarian />
                    <TabelDokumen />
                </main>

                {/* Footer: Informasi hak cipta */}
                <footer className="mt-auto py-6 px-10 border-t border-gray-200 dark:border-gray-800 text-center">
                    <p className="text-xs text-[#616f89] dark:text-gray-500">
                        © 2026 Sistem Manajemen Arsip Digital Hotel. Semua dokumen dienkripsi dan diamankan.
                    </p>
                </footer>
            </div>
        </div>
    );
};

export default Home;

