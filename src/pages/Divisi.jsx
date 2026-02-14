import React, { useState, useEffect } from 'react';
import NavigasiSamping from '../components/dashboard/sidebar/NavigasiSamping';
import KartuDivisi from '../components/dashboard/divisi/KartuDivisi';
import { useFirestore } from '../contexts/FirestoreContext';

const Divisi = () => {
    // ---- STATE ----
    const { subscribeToCollection, addDocument, updateDocument, deleteDocument } = useFirestore();

    const [divisions, setDivisions] = useState([]); // List divisi dari Firebase
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentId, setCurrentId] = useState(null);

    // Form data baru sesuai permintaan user (Nama, Deskripsi)
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        userCount: 0 // Default 0 anggota
    });

    // ---- AMBIL DATA REAL-TIME ----
    useEffect(() => {
        // Nama koleksi diganti jadi 'divisions'
        const unsubscribe = subscribeToCollection('divisions', (data) => {
            setDivisions(data);
            setLoading(false);
        });

        return () => {
            if (unsubscribe) unsubscribe();
        };
    }, []);

    // ---- FUNGSI SIMPAN (TAMBAH/EDIT) ----
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (isEditing) {
            const result = await updateDocument('divisions', currentId, formData);
            if (result.success) {
                alert('Divisi berhasil diperbarui!');
            } else {
                alert('Gagal memperbarui: ' + result.error);
            }
        } else {
            const result = await addDocument('divisions', formData);
            if (result.success) {
                alert('Divisi baru berhasil ditambah!');
            } else {
                alert('Gagal menambah: ' + result.error);
            }
        }
        handleCloseModal();
    };

    // ---- FUNGSI HAPUS ----
    const handleDelete = async (id) => {
        if (window.confirm('Hapus divisi ini? Semua data terkait akan ikut terpengaruh.')) {
            const result = await deleteDocument('divisions', id);
            if (result.success) {
                alert('Divisi dihapus!');
            } else {
                alert('Gagal menghapus: ' + result.error);
            }
        }
    };

    // ---- MODAL HANDLERS ----
    const handleOpenModal = (div = null) => {
        if (div) {
            setIsEditing(true);
            setCurrentId(div.id);
            setFormData({
                name: div.name,
                description: div.description || '',
                userCount: div.userCount || 0
            });
        } else {
            setIsEditing(false);
            setFormData({ name: '', description: '', userCount: 0 });
        }
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setFormData({ name: '', description: '', userCount: 0 });
    };

    return (
        <div className="flex h-screen overflow-hidden bg-white dark:bg-background-dark text-[#111318] dark:text-gray-100 font-sans">
            <NavigasiSamping />

            <div className="flex-1 flex flex-col overflow-y-auto">
                {/* Header */}
                <header className="bg-white dark:bg-background-dark border-b border-slate-200 dark:border-slate-800 p-6 flex items-center justify-between sticky top-0 z-10">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">Manajemen Divisi</h2>
                        <p className="text-slate-500 dark:text-slate-400 text-sm">Kelola struktur organisasi dan pembagian tugas hotel.</p>
                    </div>
                    <button
                        onClick={() => handleOpenModal()}
                        className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-lg font-semibold text-sm hover:bg-primary/90 transition-all shadow-md shadow-primary/20"
                    >
                        <span className="material-symbols-outlined text-sm">add</span>
                        Tambah Divisi Baru
                    </button>
                </header>

                <main className="p-6">
                    {loading ? (
                        <div className="flex justify-center py-20">
                            <div className="size-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {divisions.map((div) => (
                                <KartuDivisi
                                    key={div.id}
                                    {...div}
                                    onEdit={() => handleOpenModal(div)}
                                    onDelete={() => handleDelete(div.id)}
                                />
                            ))}
                        </div>
                    )}
                </main>

                <footer className="mt-auto p-6 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
                    <p className="text-xs text-slate-500 font-medium">{divisions.length} Divisi Aktif</p>
                </footer>
            </div>

            {/* MODAL FORM */}
            {showModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
                    <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
                        <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50/50 dark:bg-slate-800/50">
                            <h3 className="text-xl font-bold">{isEditing ? 'Perbarui Divisi' : 'Buat Divisi Baru'}</h3>
                            <button onClick={handleCloseModal} className="text-slate-400 hover:text-red-500 transition-colors">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-5">
                            <div>
                                <label className="block text-xs font-black uppercase text-slate-400 mb-2">Nama Divisi</label>
                                <input
                                    required
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-primary outline-none transition-all"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="Contoh: Back Office"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-black uppercase text-slate-400 mb-2">Deskripsi</label>
                                <textarea
                                    rows="4"
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-primary outline-none transition-all resize-none"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Jelaskan tugas atau lingkup kerja divisi ini..."
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-black uppercase text-slate-400 mb-2">Jumlah Anggota (Awal)</label>
                                <input
                                    type="number"
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-primary outline-none transition-all"
                                    value={formData.userCount}
                                    onChange={(e) => setFormData({ ...formData, userCount: parseInt(e.target.value) || 0 })}
                                />
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button type="submit" className="flex-1 py-4 bg-primary text-white font-black rounded-xl shadow-lg shadow-primary/20 hover:bg-blue-700 transition-all">
                                    {isEditing ? 'Simpan Perubahan' : 'Buat Divisi'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Divisi;
