// ============================================
// FILE: DocumentMetadataForm.jsx
// FUNGSI: Form input metadata lengkap untuk arsip baru
// ============================================

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFirestore } from '../../contexts/FirestoreContext';
import { useSupabase } from '../../contexts/SupabaseContext';
import { useAuth } from '../../contexts/AuthContext';
import { useUserProfile } from '../../contexts/UserProfileContext';
import { resolveActivityDivisionScope } from '../../utils/accessControl';

const DocumentMetadataForm = ({ file, onProgress }) => {
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    const { isAdmin, getUserDivision, userProfile } = useUserProfile();
    const { getDocuments, addDocument, getDocument, logActivity } = useFirestore();
    const { uploadFile, addArchive } = useSupabase();
    const [isSubmitting, setIsSubmitting] = useState(false);

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
        nomorArsip: '', // Manual
        retensiAktif: '',
        retensiAktifUnit: 'Tahun',
        retensiInaktif: '',
        retensiInaktifUnit: 'Tahun',
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

            // Auto-fill divisi untuk Staf
            if (!isAdmin()) {
                const userDivision = getUserDivision();
                if (userDivision) {
                    setFormData(prev => ({ ...prev, divisi: userDivision }));
                }
            }
        };
        fetchData();
    }, [getDocuments, isAdmin, getUserDivision]);

    // Handle perubahan input
    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    // Handle Submit Dual Save
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!file) {
            alert("Silakan pilih file terlebih dahulu!");
            return;
        }

        try {
            setIsSubmitting(true);
            if (onProgress) onProgress(0); // Reset progress ke 0

            // 1. Upload File ke Supabase Storage
            const uploadRes = await uploadFile(file, onProgress);
            if (!uploadRes.success) throw new Error(uploadRes.error);

            // 2. Ambil Nama Lengkap dari Firestore (karena Auth displayName sering kosong pas login)
            let finalName = currentUser?.displayName || 'Admin';

            // Jika nama di Auth kosong, coba ambil dari koleksi 'users' di Firestore
            if (!currentUser?.displayName || currentUser?.displayName === 'Unknown') {
                const userProfile = await getDocument('users', currentUser.uid);
                if (userProfile.success && userProfile.data.name) {
                    finalName = userProfile.data.name;
                }
            }

            const completeData = {
                ...formData,
                fileUrl: uploadRes.url,
                filePath: uploadRes.path,
                fileName: file.name,
                fileSize: file.size,
                fileType: file.type,
                uploaderName: finalName,
                uploaderEmail: currentUser?.email || 'Unknown'
            };

            // 3. Simpan Record ke Supabase DB
            const supabaseRes = await addArchive(completeData);
            if (!supabaseRes.success) throw new Error(supabaseRes.error);

            // 4. Simpan Metadata & Relasi ke Firestore (Firebase)
            const firestoreRes = await addDocument('archives', {
                ...completeData,
                supabaseId: supabaseRes.data.id, // Simpan ID relasi
                source: 'SUPABASE_STORAGE'
            });

            // 5. Catat Laporan Aktivitas ke Firestore
            await logActivity({
                user: finalName,
                email: currentUser?.email || 'Unknown',
                action: 'Mengunggah',
                documentName: formData.judul,
                status: 'Berhasil',
                type: 'upload',
                actorDivision: getUserDivision(),
                divisionScope: resolveActivityDivisionScope({
                    archiveDivision: formData.divisi,
                    profile: userProfile
                })
            });

            if (firestoreRes.success) {
                alert("Arsip Berhasil Disimpan!");
                navigate('/daftar-arsip');
            } else {
                throw new Error(firestoreRes.error);
            }

        } catch (error) {
            alert("Terjadi kesalahan: " + error.message);
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-200 dark:border-gray-700 animate-in fade-in slide-in-from-bottom-4 duration-500">
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
                            disabled={!isAdmin()} // Staf tidak bisa ubah divisi
                            className={`w-full rounded-xl border-slate-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white focus:ring-primary focus:border-primary shadow-sm text-sm font-bold py-3 ${!isAdmin() ? 'opacity-60 cursor-not-allowed' : ''}`}
                            id="divisi"
                            value={formData.divisi}
                            onChange={handleChange}
                        >
                            <option value="">Pilih Divisi</option>
                            {divisions.map(div => (
                                <option key={div.id} value={div.name}>{div.name}</option>
                            ))}
                        </select>
                        {!isAdmin() && (
                            <p className="text-[10px] text-slate-400 italic">* Divisi otomatis terisi sesuai profil Anda</p>
                        )}
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



                {/* BARIS 5: MASA RETENSI */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="block text-[11px] font-black uppercase text-slate-500 tracking-widest" htmlFor="retensiAktif">Masa Retensi (Aktif)</label>
                        <div className="grid grid-cols-3 gap-2">
                            <input
                                className="col-span-2 rounded-xl border-slate-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white focus:ring-primary focus:border-primary shadow-sm text-sm font-bold py-3 px-4"
                                id="retensiAktif"
                                placeholder="Durasi"
                                type="number"
                                value={formData.retensiAktif}
                                onChange={handleChange}
                            />
                            <select
                                className="col-span-1 rounded-xl border-slate-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white focus:ring-primary focus:border-primary shadow-sm text-sm font-bold py-3 px-2"
                                id="retensiAktifUnit"
                                value={formData.retensiAktifUnit}
                                onChange={handleChange}
                            >
                                <option value="Tahun">Tahun</option>
                                <option value="Bulan">Bulan</option>
                                <option value="Hari">Hari</option>
                            </select>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="block text-[11px] font-black uppercase text-slate-500 tracking-widest" htmlFor="retensiInaktif">Masa Retensi (Inaktif)</label>
                        <div className="grid grid-cols-3 gap-2">
                            <input
                                className="col-span-2 rounded-xl border-slate-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white focus:ring-primary focus:border-primary shadow-sm text-sm font-bold py-3 px-4"
                                id="retensiInaktif"
                                placeholder="Durasi"
                                type="number"
                                value={formData.retensiInaktif}
                                onChange={handleChange}
                            />
                            <select
                                className="col-span-1 rounded-xl border-slate-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white focus:ring-primary focus:border-primary shadow-sm text-sm font-bold py-3 px-2"
                                id="retensiInaktifUnit"
                                value={formData.retensiInaktifUnit}
                                onChange={handleChange}
                            >
                                <option value="Tahun">Tahun</option>
                                <option value="Bulan">Bulan</option>
                                <option value="Hari">Hari</option>
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
                        className={`px-10 py-3 rounded-xl bg-primary text-white font-black text-sm shadow-lg shadow-primary/20 hover:bg-blue-700 hover:shadow-primary/40 transition-all active:scale-95 flex items-center gap-2 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                        type="submit"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                Menyimpan...
                            </>
                        ) : (
                            <>
                                <span className="material-symbols-outlined text-[20px]">cloud_upload</span>
                                Simpan Arsip
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default DocumentMetadataForm;
