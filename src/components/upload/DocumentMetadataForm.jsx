// ============================================
// FILE: DocumentMetadataForm.jsx
// FUNGSI: Form input metadata lengkap untuk arsip baru
// ============================================

import React, { useState, useEffect } from 'react';
import { useFirestore } from '../../contexts/FirestoreContext';

const DocumentMetadataForm = () => {
    const { getDocuments } = useFirestore();

    // ============================================
    // STATE DATA DROPDOWN (DARI FIREBASE)
    // ============================================
    const [divisions, setDivisions] = useState([]);
    const [categories, setCategories] = useState([]);

    // ============================================
    // STATE FORM INPUT
    // ============================================
    const [formData, setFormData] = useState({
        divisi: '',
        kategori: '',
        judul: '',
        tglDokumen: new Date().toISOString().split('T')[0], // Default hari ini
        codeArsip: '', // Auto-generated
        nomorArsip: '', // Manual
        retensiAktif: '10',
        retensiInaktif: '5',
        keterangan: ''
    });

    // ============================================
    // AMBIL DATA AWAL (DIVISI & KATEGORI)
    // ============================================
    useEffect(() => {
        const fetchData = async () => {
            // Ambil Divisi
            const divRes = await getDocuments('divisions');
            if (divRes.success) setDivisions(divRes.data);

            // Ambil Kategori
            const catRes = await getDocuments('categories');
            if (catRes.success) setCategories(catRes.data);
        };
        fetchData();

        // Generate Code Arsip saat pertama kali load
        generateAutoCode();
    }, []);

    // ============================================
    // FUNGSI AUTO-GENERATE CODE ARSIP
    // ============================================
    const generateAutoCode = () => {
        const year = new Date().getFullYear();
        const random = Math.floor(1000 + Math.random() * 9000); // 4 digit random
        const code = `ARS-${year}-${random}`;
        setFormData(prev => ({ ...prev, codeArsip: code }));
    };

    // Handle perubahan input
    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    // Handle Submit
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Data siap diupload:", formData);
        alert("Metadata tersimpan! (Logika upload file akan menyusul)");
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm border border-gray-200 dark:border-gray-700 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center gap-3 mb-8 border-b border-gray-100 dark:border-gray-700 pb-4">
                <span className="material-symbols-outlined text-primary">description</span>
                <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Metadata Dokumen</h2>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>

                {/* BARIS 1: DIVISI & KATEGORI */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="block text-[11px] font-black uppercase text-slate-500 tracking-widest" htmlFor="divisi">Divisi</label>
                        <select
                            required
                            className="w-full rounded-xl border-slate-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white focus:ring-primary focus:border-primary shadow-sm text-sm font-bold py-3"
                            id="divisi"
                            value={formData.divisi}
                            onChange={handleChange}
                        >
                            <option value="">Pilih Divisi</option>
                            {divisions.map(div => (
                                <option key={div.id} value={div.name}>{div.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="block text-[11px] font-black uppercase text-slate-500 tracking-widest" htmlFor="kategori">Kategori Arsip</label>
                        <select
                            required
                            className="w-full rounded-xl border-slate-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white focus:ring-primary focus:border-primary shadow-sm text-sm font-bold py-3"
                            id="kategori"
                            value={formData.kategori}
                            onChange={handleChange}
                        >
                            <option value="">Pilih Kategori</option>
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.name}>{cat.name}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* BARIS 2: JUDUL / NAMA ARSIP */}
                <div className="space-y-2">
                    <label className="block text-[11px] font-black uppercase text-slate-500 tracking-widest" htmlFor="judul">Nama Arsip / Judul</label>
                    <input
                        required
                        className="w-full rounded-xl border-slate-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white focus:ring-primary focus:border-primary shadow-sm text-sm font-bold py-3 px-4"
                        id="judul"
                        placeholder="Masukkan judul dokumen..."
                        type="text"
                        value={formData.judul}
                        onChange={handleChange}
                    />
                </div>

                {/* BARIS 3: TANGGAL & NOMOR ARSIP */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="block text-[11px] font-black uppercase text-slate-500 tracking-widest" htmlFor="tglDokumen">Tanggal Dokumen</label>
                        <input
                            required
                            className="w-full rounded-xl border-slate-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white focus:ring-primary focus:border-primary shadow-sm text-sm font-bold py-3 px-4"
                            id="tglDokumen"
                            type="date"
                            value={formData.tglDokumen}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="block text-[11px] font-black uppercase text-slate-500 tracking-widest" htmlFor="nomorArsip">Nomor Arsip (Manual)</label>
                        <input
                            required
                            className="w-full rounded-xl border-slate-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white focus:ring-primary focus:border-primary shadow-sm text-sm font-bold py-3 px-4"
                            id="nomorArsip"
                            placeholder="Contoh: 001/HRD/2026"
                            type="text"
                            value={formData.nomorArsip}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                {/* BARIS 4: AUTO CODE (DISABLED) */}
                <div className="space-y-2">
                    <label className="block text-[11px] font-black uppercase text-slate-500 tracking-widest" htmlFor="codeArsip">System Code Arsip (Auto)</label>
                    <div className="relative">
                        <input
                            disabled
                            className="w-full rounded-xl border-slate-200 dark:border-gray-700 bg-slate-50 dark:bg-slate-800 dark:text-slate-400 text-slate-500 focus:ring-0 shadow-sm text-sm font-black py-3 px-4 italic"
                            id="codeArsip"
                            type="text"
                            value={formData.codeArsip}
                        />
                        <span className="absolute right-4 top-3 material-symbols-outlined text-slate-300 text-sm">lock</span>
                    </div>
                </div>

                {/* BARIS 5: MASA RETENSI */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                    <div className="space-y-2">
                        <label className="block text-[11px] font-black uppercase text-emerald-600 dark:text-emerald-400 tracking-widest">Masa Retensi Aktif</label>
                        <div className="flex gap-2">
                            <input
                                className="flex-1 rounded-xl border-slate-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:ring-primary py-2.5 px-4 text-sm font-bold"
                                id="retensiAktif"
                                type="number"
                                min="1"
                                value={formData.retensiAktif}
                                onChange={handleChange}
                            />
                            <select className="bg-white dark:bg-gray-800 border-slate-200 dark:border-gray-700 rounded-xl text-xs font-bold px-3">
                                <option>Tahun</option>
                            </select>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="block text-[11px] font-black uppercase text-amber-600 dark:text-amber-400 tracking-widest">Masa Retensi Inaktif</label>
                        <div className="flex gap-2">
                            <input
                                className="flex-1 rounded-xl border-slate-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:ring-primary py-2.5 px-4 text-sm font-bold"
                                id="retensiInaktif"
                                type="number"
                                min="1"
                                value={formData.retensiInaktif}
                                onChange={handleChange}
                            />
                            <select className="bg-white dark:bg-gray-800 border-slate-200 dark:border-gray-700 rounded-xl text-xs font-bold px-3">
                                <option>Tahun</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* BARIS 6: KETERANGAN */}
                <div className="space-y-2">
                    <label className="block text-[11px] font-black uppercase text-slate-500 tracking-widest" htmlFor="keterangan">Keterangan</label>
                    <textarea
                        className="w-full rounded-xl border-slate-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white focus:ring-primary focus:border-primary shadow-sm text-sm font-medium p-4 resize-none"
                        id="keterangan"
                        placeholder="Tambahkan catatan atau ringkasan isi arsip..."
                        rows="4"
                        value={formData.keterangan}
                        onChange={handleChange}
                    ></textarea>
                </div>

                {/* TOMBOL AKSI */}
                <div className="flex justify-end gap-3 pt-6 border-t border-gray-100 dark:border-gray-700">
                    <button
                        className="px-6 py-3 rounded-xl border border-slate-200 dark:border-gray-700 text-slate-600 dark:text-gray-300 font-bold text-sm hover:bg-slate-50 dark:hover:bg-gray-700 transition-all active:scale-95"
                        type="button"
                    >
                        Batal
                    </button>
                    <button
                        className="px-10 py-3 rounded-xl bg-primary text-white font-black text-sm shadow-lg shadow-primary/20 hover:bg-blue-700 hover:shadow-primary/40 transition-all active:scale-95 flex items-center gap-2"
                        type="submit"
                    >
                        <span className="material-symbols-outlined text-[20px]">cloud_upload</span>
                        Simpan Arsip
                    </button>
                </div>
            </form>
        </div>
    );
};

export default DocumentMetadataForm;
