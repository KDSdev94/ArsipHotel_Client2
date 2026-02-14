// ============================================
// FILE: DaftarArsip.jsx
// FUNGSI: Halaman untuk melihat daftar semua arsip/dokumen
// FITUR: Filter (Search, Divisi, Tanggal), Tabel lengkap, Pagination
// ============================================

import React, { useState } from 'react';
import NavigasiSamping from '../components/dashboard/sidebar/NavigasiSamping';

const DaftarArsip = () => {
    // ============================================
    // STATE MANAGEMENT
    // ============================================

    // State untuk filter
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedDivisi, setSelectedDivisi] = useState('');
    const [selectedDate, setSelectedDate] = useState('');

    // Data dummy arsip (nanti diganti dengan data dari Firebase)
    const dummyArsip = [
        {
            id: 1,
            nomorArsip: 'ARS-2023-0881',
            divisi: 'Finance',
            judul: 'Laporan Audit Tahunan 2023',
            kategori: 'Laporan',
            tglUpload: '12 Jan 2024',
            tglDokumen: '31 Des 2023',
            tglBerakhir: '31 Des 2033',
            status: 'AKTIF',
            statusColor: 'green'
        },
        {
            id: 2,
            nomorArsip: 'ARS-2018-0242',
            divisi: 'Maintenance',
            judul: 'Kontrak Vendor Lift Phase 1',
            kategori: 'Kontrak',
            tglUpload: '05 Feb 2018',
            tglDokumen: '01 Feb 2018',
            tglBerakhir: '01 Feb 2023',
            status: 'BERAKHIR',
            statusColor: 'red'
        },
        {
            id: 3,
            nomorArsip: 'ARS-2024-0015',
            divisi: 'IT & Security',
            judul: 'Draft Kebijakan Password 2024',
            kategori: 'Internal',
            tglUpload: '15 Mar 2024',
            tglDokumen: '10 Mar 2024',
            tglBerakhir: '10 Mar 2029',
            status: 'INAKTIF',
            statusColor: 'orange'
        }
    ];

    // Fungsi reset filter
    const handleReset = () => {
        setSearchTerm('');
        setSelectedDivisi('');
        setSelectedDate('');
    };

    return (
        <div className="flex h-screen overflow-hidden bg-background-light dark:bg-background-dark font-display text-slate-800 dark:text-slate-200">
            {/* Sidebar navigasi */}
            <NavigasiSamping />

            {/* Main content area */}
            <div className="flex-1 flex flex-col overflow-y-auto">

                {/* ========== HEADER ========== */}
                <header className="flex items-center justify-between sticky top-0 z-10 border-b border-slate-200 dark:border-gray-800 bg-white/80 backdrop-blur-md dark:bg-background-dark/80 px-8 py-4">
                    <div className="flex items-center gap-4">
                        <h2 className="text-slate-900 dark:text-white text-lg font-bold">Manajemen Arsip</h2>
                    </div>
                    <div className="flex justify-end gap-6 items-center">
                        <div className="flex items-center gap-3">
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Admin Pusat</span>
                            <div
                                className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-9 border border-gray-200 dark:border-gray-700"
                                style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAI9KmT-mGBsXfTuk9OAjga3QOW9bEi__D5IJ5cxtyHAzh9aTSTRnJvziaA3KOz_u0HzXwtwHxjL_I4RoHA71ZGV1-R8EAAHT2CuNzomabLdgDJxxuK-WV9uHTMM3AVIPt6kjwkDzyVXTy0ltcBnaF_bniIp4fgkSSKhmTzHHRWDH_pB-p7T58ttawc9Nn8OUkRB3h1wUb0SmZ37FlBw7oRk_dzleYEQ861SZMb6Mjx57ANm4HNaHac5SSLrWn-nJ9sgWGsqlecdh1p")' }}
                            ></div>
                        </div>
                    </div>
                </header>

                {/* ========== MAIN CONTENT ========== */}
                <main className="flex-1 p-8 w-full max-w-[1440px] mx-auto">

                    {/* Judul Halaman */}
                    <div className="mb-8">
                        <h1 className="text-slate-900 dark:text-white text-3xl font-black leading-tight tracking-tight mb-2">
                            Daftar Arsip
                        </h1>
                        <p className="text-slate-600 dark:text-gray-400 text-base font-normal">
                            Berikut adalah daftar dokumen yang telah diunggah ke sistem e-Arsip.
                        </p>
                    </div>

                    {/* ========== FILTER SECTION ========== */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 mb-8">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">

                            {/* Filter Search */}
                            <div className="space-y-2">
                                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider" htmlFor="search">
                                    Cari Nama / Code
                                </label>
                                <input
                                    className="w-full rounded-lg border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white focus:ring-primary focus:border-primary text-sm px-3 py-2 outline-none"
                                    id="search"
                                    placeholder="Contoh: ARS-2023-001"
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>

                            {/* Filter Divisi */}
                            <div className="space-y-2">
                                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider" htmlFor="divisi">
                                    Divisi
                                </label>
                                <select
                                    className="w-full rounded-lg border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white focus:ring-primary focus:border-primary text-sm px-3 py-2 outline-none"
                                    id="divisi"
                                    value={selectedDivisi}
                                    onChange={(e) => setSelectedDivisi(e.target.value)}
                                >
                                    <option value="">Semua Divisi</option>
                                    <option value="fin">Finance</option>
                                    <option value="hrd">Human Resource</option>
                                    <option value="ops">Operations</option>
                                    <option value="it">IT & Security</option>
                                </select>
                            </div>

                            {/* Filter Tanggal */}
                            <div className="space-y-2">
                                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider" htmlFor="tanggal">
                                    Tanggal Dokumen
                                </label>
                                <input
                                    className="w-full rounded-lg border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white focus:ring-primary focus:border-primary text-sm px-3 py-2 outline-none"
                                    id="tanggal"
                                    type="date"
                                    value={selectedDate}
                                    onChange={(e) => setSelectedDate(e.target.value)}
                                />
                            </div>

                            {/* Tombol Aksi */}
                            <div className="flex gap-2">
                                <button className="flex-1 px-4 py-2 bg-primary text-white rounded-lg font-bold text-sm shadow-md hover:bg-blue-700 transition-colors">
                                    Cari
                                </button>
                                <button
                                    onClick={handleReset}
                                    className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg font-bold text-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                                >
                                    Reset
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* ========== TABEL ARSIP ========== */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">

                                {/* Table Header */}
                                <thead>
                                    <tr className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
                                        <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Nomor Arsip</th>
                                        <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Divisi</th>
                                        <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Judul</th>
                                        <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Kategori</th>
                                        <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Tgl Upload</th>
                                        <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Tgl Dokumen</th>
                                        <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Tgl Berakhir</th>
                                        <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status Retensi</th>
                                        <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-center">Aksi</th>
                                    </tr>
                                </thead>

                                {/* Table Body */}
                                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                    {dummyArsip.map((arsip) => (
                                        <tr key={arsip.id} className="hover:bg-primary/5 transition-colors">
                                            <td className="px-6 py-4 text-sm font-medium text-primary">{arsip.nomorArsip}</td>
                                            <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{arsip.divisi}</td>
                                            <td className="px-6 py-4 text-sm font-semibold text-gray-900 dark:text-white">{arsip.judul}</td>
                                            <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{arsip.kategori}</td>
                                            <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{arsip.tglUpload}</td>
                                            <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{arsip.tglDokumen}</td>
                                            <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{arsip.tglBerakhir}</td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${arsip.statusColor === 'green' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                                                        arsip.statusColor === 'red' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' :
                                                            'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400'
                                                    }`}>
                                                    {arsip.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex justify-center gap-2">
                                                    {/* Tombol View */}
                                                    <button
                                                        className="p-1.5 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-600 rounded transition-colors"
                                                        title="View"
                                                    >
                                                        <span className="material-symbols-outlined text-xl">visibility</span>
                                                    </button>
                                                    {/* Tombol Download */}
                                                    <button
                                                        className="p-1.5 hover:bg-green-50 dark:hover:bg-green-900/20 text-green-600 rounded transition-colors"
                                                        title="Download"
                                                    >
                                                        <span className="material-symbols-outlined text-xl">download</span>
                                                    </button>
                                                    {/* Tombol Delete */}
                                                    <button
                                                        className="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 rounded transition-colors"
                                                        title="Delete"
                                                    >
                                                        <span className="material-symbols-outlined text-xl">delete</span>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* ========== PAGINATION ========== */}
                        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                                Menampilkan 1-3 dari 150 arsip
                            </span>
                            <div className="flex gap-2">
                                <button
                                    className="px-3 py-1 rounded border border-gray-300 dark:border-gray-600 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
                                    disabled
                                >
                                    Sebelumnya
                                </button>
                                <button className="px-3 py-1 rounded bg-primary text-white text-sm font-bold">1</button>
                                <button className="px-3 py-1 rounded border border-gray-300 dark:border-gray-600 text-sm hover:bg-gray-100 dark:hover:bg-gray-700">2</button>
                                <button className="px-3 py-1 rounded border border-gray-300 dark:border-gray-600 text-sm hover:bg-gray-100 dark:hover:bg-gray-700">3</button>
                                <button className="px-3 py-1 rounded border border-gray-300 dark:border-gray-600 text-sm hover:bg-gray-100 dark:hover:bg-gray-700">
                                    Selanjutnya
                                </button>
                            </div>
                        </div>
                    </div>
                </main>

                {/* ========== FOOTER ========== */}
                <footer className="mt-auto py-6 px-10 border-t border-gray-200 dark:border-gray-800 text-center">
                    <p className="text-xs text-slate-600 dark:text-gray-500">
                        © 2026 e-Arsip Digital System. Semua hak cipta dilindungi.
                    </p>
                </footer>
            </div>
        </div>
    );
};

export default DaftarArsip;

/*
  ============================================
  PENJELASAN FITUR:
  ============================================
  
  1. FILTER SECTION:
     - Search: Cari berdasarkan nomor/nama arsip
     - Divisi: Filter berdasarkan divisi
     - Tanggal: Filter berdasarkan tanggal dokumen
     - Reset: Bersihkan semua filter
  
  2. TABEL ARSIP:
     - 9 kolom informasi lengkap
     - Status badge dengan warna dinamis
     - Hover effect pada row
     - Action buttons (View, Download, Delete)
  
  3. PAGINATION:
     - Navigasi halaman
     - Info jumlah data yang ditampilkan
  
  ============================================
  NEXT STEPS (Integrasi Firebase):
  ============================================
  
  1. Ganti dummyArsip dengan data dari Firestore:
     - Collection: 'documents' atau 'arsip'
     - Real-time listener dengan onSnapshot
  
  2. Implementasi filter yang berfungsi:
     - Filter search dengan includes()
     - Filter divisi dengan ===
     - Filter tanggal dengan Date comparison
  
  3. Implementasi pagination:
     - Limit data per halaman (10-20 item)
     - Next/Previous button logic
  
  4. Implementasi action buttons:
     - View: Modal preview dokumen
     - Download: Download file dari Storage
     - Delete: Hapus dokumen (dengan konfirmasi)
*/
