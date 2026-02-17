import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext'; // Pakai Context, bukan import Firebase langsung!

const Login = () => {
    // State untuk form
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const { login } = useAuth(); // Ambil fungsi login dari Context

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        // Panggil fungsi login dari Context
        const result = await login(email, password);

        if (result.success) {
            // Berhasil login, pindah ke home
            navigate('/home');
        } else {
            // Gagal login, tampilkan error
            setError(result.error);
        }

        setLoading(false);
    };

    return (
        // Wrapper utama: tinggi satu layar penuh (min-h-screen)
        <div className="flex min-h-screen bg-background-light dark:bg-background-dark font-display text-[#111318] dark:text-white transition-colors duration-200">
            <div className="flex w-full">

                {/* SISI KIRI: Gambar & Branding (Cuma muncul di layar gede) */}
                <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-slate-900">
                    <div className="absolute inset-0">
                        <img
                            src="/background.jpeg"
                            alt="Hotel Background"
                            className="w-full h-full object-cover opacity-60"
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-[#0f172a] to-transparent opacity-60"></div>
                    </div>
                    <div className="relative z-20 flex flex-col justify-between h-full p-16 text-white">
                        <div className="flex items-center gap-3">
                            <div className="bg-white/10 backdrop-blur-md p-2 rounded-lg border border-white/20">
                                <img className="w-16 h-16" src="/logo_512.png" alt="logo" />
                            </div>
                            <h2 className="text-2xl font-bold tracking-tight">Arsip Hotel
                            </h2>
                        </div>
                        <div className="max-w-md">
                            <h3 className="text-4xl font-bold mb-6 leading-tight">Menjaga keunggulan layanan untuk generasi mendatang.</h3>
                            <p className="text-lg text-white/80 leading-relaxed">
                                Akses repositori komprehensif catatan sejarah, denah lantai, dan warisan arsitektur kami melalui gerbang perusahaan yang aman.
                            </p>
                        </div>
                        {/* Info tambahan (Secure Encryption & Cloud) */}
                        <div className="flex gap-6 items-center text-sm text-white/60">
                            <span className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-[18px]">verified_user</span>
                                Enkripsi Aman
                            </span>
                            <span className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-[18px]">cloud_done</span>
                                Penyimpanan Cloud
                            </span>
                        </div>
                    </div>
                </div>

                {/* SISI KANAN: Form Login-nya */}
                <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white dark:bg-background-dark">
                    <div className="w-full max-w-105 flex flex-col">
                        {/* Logo buat versi Mobile (karena sisi kiri ilang kalo di hp) */}
                        <div className="lg:hidden flex items-center gap-3 mb-12">
                            <div className="bg-primary p-2 rounded-lg shadow-lg shadow-primary/20">
                                <svg className="size-6 text-white" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <rect height="18" rx="2" ry="2" width="18" x="3" y="3"></rect>
                                    <line x1="7" x2="17" y1="8" y2="8"></line>
                                    <line x1="7" x2="17" y1="12" y2="12"></line>
                                    <line x1="7" x2="13" y1="16" y2="16"></line>
                                </svg>
                            </div>
                            <h2 className="text-xl font-bold dark:text-white">Arsip Digital Hotel</h2>
                        </div>

                        <header className="mb-10">
                            <h1 className="text-[#111318] dark:text-white text-3xl font-black leading-tight tracking-tight mb-3">
                                Selamat Datang Kembali
                            </h1>
                            <p className="text-[#616f89] dark:text-gray-400 text-base font-normal">
                                Silakan masukkan kredensial Anda untuk mengakses arsip digital.
                            </p>
                        </header>

                        <form className="flex flex-col gap-5" onSubmit={handleLogin}>
                            {/* Kotak Error: Muncul cuma kalo ada masalah */}
                            {error && (
                                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4 rounded-lg flex items-center gap-3">
                                    <span className="material-symbols-outlined text-red-600 dark:text-red-400 text-[20px]">error</span>
                                    <p className="text-sm font-medium text-red-600 dark:text-red-400">{error}</p>
                                </div>
                            )}

                            {/* Input Email */}
                            <div className="flex flex-col gap-2">
                                <label className="text-[#111318] dark:text-gray-200 text-sm font-semibold leading-normal">
                                    Alamat Email
                                </label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <span className="material-symbols-outlined text-[#616f89] group-focus-within:text-primary transition-colors text-[20px]">mail</span>
                                    </div>
                                    <input
                                        className="flex w-full pl-11 rounded-lg text-[#111318] dark:text-white dark:bg-gray-800/50 border border-[#dbdfe6] dark:border-gray-700 focus:outline-0 focus:ring-2 focus:ring-primary/20 focus:border-primary h-12 placeholder:text-[#616f89] text-base font-normal leading-normal transition-all"
                                        placeholder="nama@hotel.com"
                                        required
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)} // Update state tiap ngetik
                                    />
                                </div>
                            </div>

                            {/* Input Password */}
                            <div className="flex flex-col gap-2">
                                <div className="flex justify-between items-center">
                                    <label className="text-[#111318] dark:text-gray-200 text-sm font-semibold leading-normal">
                                        Kata Sandi
                                    </label>
                                    <Link className="text-primary hover:text-primary/80 text-sm font-semibold leading-normal underline transition-colors" to="/forgot-password">
                                        Lupa Kata Sandi?
                                    </Link>
                                </div>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <span className="material-symbols-outlined text-[#616f89] group-focus-within:text-primary transition-colors text-[20px]"></span>
                                    </div>
                                    <input
                                        className="flex w-full pl-11 rounded-lg text-[#111318] dark:text-white dark:bg-gray-800/50 border border-[#dbdfe6] dark:border-gray-700 focus:outline-0 focus:ring-2 focus:ring-primary/20 focus:border-primary h-12 placeholder:text-[#616f89] text-base font-normal leading-normal transition-all"
                                        placeholder="••••••••••••"
                                        required
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)} // Update state tiap ngetik
                                    />
                                </div>
                            </div>

                            <div className="flex items-center gap-2 mt-1">
                                <input
                                    className="w-4 h-4 rounded text-primary focus:ring-primary dark:bg-gray-800 border-gray-300 dark:border-gray-700"
                                    id="remember"
                                    type="checkbox"
                                />
                                <label className="text-[#616f89] dark:text-gray-400 text-sm" htmlFor="remember">Ingat perangkat ini selama 30 hari</label>
                            </div>

                            {/* Tombol Login: Bisa nyesuaiin status loading */}
                            <button
                                className={`mt-4 flex min-w-21 items-center justify-center overflow-hidden rounded-lg h-12 px-5 bg-primary hover:bg-primary/90 text-white text-base font-bold leading-normal tracking-[0.015em] transition-all shadow-lg shadow-primary/20 ${loading ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'}`}
                                type="submit"
                                disabled={loading}
                            >
                                {loading ? (
                                    <div className="flex items-center gap-2">
                                        {/* Animasi muter (spinner) pas lagi loading */}
                                        <div className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        <span>Memproses...</span>
                                    </div>
                                ) : (
                                    <span className="truncate">Masuk</span>
                                )}
                            </button>
                        </form>

                        {/* Footer (Dukungan & Bahasa) */}
                        <footer className="mt-12 pt-8 border-t border-[#f0f2f4] dark:border-gray-800 text-center">
                            <p className="text-[#616f89] dark:text-gray-400 text-sm">
                                Belum punya akun?
                                <Link className="text-primary font-bold hover:underline ml-1" to="/register">Daftar</Link>
                            </p>
                            <div className="mt-8 flex justify-center gap-6">

                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">© 2026 Arsip Digital Hotel</p>

                            </div>
                        </footer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;

