// ============================================
// FILE: GantiPassword.jsx
// FUNGSI: Halaman ganti password untuk user yang sedang login
// ============================================

import React, { useState } from 'react';
import NavigasiSamping from '../components/dashboard/sidebar/NavigasiSamping';
import { useAuth } from '../contexts/AuthContext';

const GantiPassword = () => {
    const { changePassword } = useAuth();

    const [formData, setFormData] = useState({
        newPassword: '',
        confirmPassword: ''
    });

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });

        // 1. Validasi kesamaan password
        if (formData.newPassword !== formData.confirmPassword) {
            setMessage({ type: 'error', text: 'Konfirmasi password tidak cocok!' });
            return;
        }

        // 2. Minimal 6 karakter
        if (formData.newPassword.length < 6) {
            setMessage({ type: 'error', text: 'Password minimal 6 karakter!' });
            return;
        }

        setLoading(true);
        const result = await changePassword(formData.newPassword);

        if (result.success) {
            setMessage({ type: 'success', text: 'Sip! Password kamu berhasil diubah.' });
            setFormData({ newPassword: '', confirmPassword: '' });
        } else {
            setMessage({ type: 'error', text: result.error });
        }
        setLoading(false);
    };

    return (
        <div className="flex h-screen overflow-hidden bg-background-light dark:bg-background-dark font-display text-slate-800 dark:text-slate-200">
            {/* Sidebar navigasi */}
            <NavigasiSamping />

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col overflow-y-auto">
                <header className="flex items-center justify-between sticky top-0 z-10 border-b border-slate-200 dark:border-gray-800 bg-white/80 backdrop-blur-md dark:bg-background-dark/80 px-8 py-4 shrink-0">
                    <h2 className="text-slate-800 dark:text-white text-lg font-bold">Keamanan Akun</h2>
                </header>

                <main className="flex-1 p-8 w-full max-w-[800px] mx-auto">
                    <div className="mb-8">
                        <h1 className="text-slate-900 dark:text-white text-3xl font-black leading-tight tracking-tight mb-2 uppercase">
                            Ganti Password
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400 text-base font-normal">
                            Amankan akun Anda dengan mengganti kata sandi secara berkala.
                        </p>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm border border-gray-200 dark:border-gray-700">
                        <form onSubmit={handleSubmit} className="space-y-6">

                            {/* Alert Message */}
                            {message.text && (
                                <div className={`p-4 rounded-xl flex items-start gap-3 border animate-in fade-in slide-in-from-top-2 duration-300 ${message.type === 'success'
                                        ? 'bg-emerald-50 border-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:border-emerald-800 dark:text-emerald-400'
                                        : 'bg-red-50 border-red-100 text-red-700 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400'
                                    }`}>
                                    <span className="material-symbols-outlined text-[20px] mt-0.5">
                                        {message.type === 'success' ? 'check_circle' : 'error'}
                                    </span>
                                    <p className="text-sm font-bold tracking-tight">{message.text}</p>
                                </div>
                            )}

                            <div className="space-y-4">
                                {/* New Password */}
                                <div className="space-y-2">
                                    <label className="block text-[11px] font-black uppercase text-slate-400 tracking-widest" htmlFor="newPassword">
                                        Password Baru
                                    </label>
                                    <div className="relative group">
                                        <span className="absolute left-4 top-3.5 material-symbols-outlined text-slate-400 group-focus-within:text-primary transition-colors">
                                            lock_open
                                        </span>
                                        <input
                                            required
                                            className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm font-bold placeholder:text-slate-400"
                                            id="newPassword"
                                            placeholder="Minimal 6 karakter"
                                            type="password"
                                            value={formData.newPassword}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>

                                {/* Confirm Password */}
                                <div className="space-y-2">
                                    <label className="block text-[11px] font-black uppercase text-slate-400 tracking-widest" htmlFor="confirmPassword">
                                        Konfirmasi Password Baru
                                    </label>
                                    <div className="relative group">
                                        <span className="absolute left-4 top-3.5 material-symbols-outlined text-slate-400 group-focus-within:text-primary transition-colors">
                                            verified_user
                                        </span>
                                        <input
                                            required
                                            className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm font-bold placeholder:text-slate-400"
                                            id="confirmPassword"
                                            placeholder="Ulangi password baru"
                                            type="password"
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-slate-50 dark:border-slate-700">
                                <button
                                    disabled={loading}
                                    className="w-full bg-primary hover:bg-blue-700 text-white font-black py-4 rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
                                    type="submit"
                                >
                                    {loading ? 'Sedang Memproses...' : 'Update Password Sekarang'}
                                    {!loading && <span className="material-symbols-outlined text-[20px]">security</span>}
                                </button>

                                <div className="mt-6 flex items-start gap-3 p-4 bg-blue-50/50 dark:bg-blue-900/10 rounded-xl border border-blue-100/50 dark:border-blue-800/20">
                                    <span className="material-symbols-outlined text-blue-500 text-[20px]">info</span>
                                    <p className="text-[11px] text-blue-600 dark:text-blue-400 font-medium leading-relaxed">
                                        Catatan Keamanan: Untuk alasan keamanan, sistem mungkin akan meminta Anda untuk login ulang jika ingin mengubah kata sandi setelah sesi yang cukup lama.
                                    </p>
                                </div>
                            </div>
                        </form>
                    </div>
                </main>

                <footer className="mt-auto py-6 px-10 border-t border-gray-100 dark:border-gray-800 flex flex-col items-center">
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">
                        © 2026 E-Arsip System Security
                    </p>
                </footer>
            </div>
        </div>
    );
};

export default GantiPassword;
