import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const { resetPassword } = useAuth();

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });
        setLoading(true);

        const result = await resetPassword(email);

        if (result.success) {
            setMessage({
                type: 'success',
                text: result.message + ' Silakan cek kotak masuk (atau folder spam) email Anda.'
            });
        } else {
            setMessage({ type: 'error', text: result.error });
        }

        setLoading(false);
    };

    return (
        <div className="bg-background-light dark:bg-background-dark h-screen flex items-center justify-center overflow-hidden">
            <div className="flex h-full w-full overflow-hidden">

                {/* Bagian Kiri (Visual) - Sama dengan Login/Register */}
                <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center p-12 overflow-hidden bg-slate-900">
                    <div className="absolute inset-0 z-0">
                        <div className="absolute inset-0 bg-black/40 z-10"></div>
                        <div
                            className="w-full h-full bg-cover bg-center transition-transform duration-[10s] hover:scale-110"
                            style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuB-uDJB2hql2DqYZlF8U4jlh-LiogNukQMrx9JrBvYNAijrDDinnlVw6sKP_8b91rrOJS0AHl6M6m2HZO0ccQqtgJPqIU5iyt3g88O0tMVSZIw7o6ZMiMNwrnYuHSv5JI5uLfhv6OSnigwiFIgxiN31luiYBttIuYnk7gLVirYwT-4vFW0NXpGIro9t7Gf1ZfuIu10jkxr5g0WkDSMVk-23EWQpEBb02bKuxHUc_jcUi9a6ko_39wYUVhZlrs2XfiI-vHgwXbLX-GuS")' }}
                        ></div>
                    </div>

                    <div className="relative z-10 text-white max-w-lg">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="bg-black/10 backdrop-blur-md p-2 rounded-lg border border-white/20">
                                <img className="w-16 h-16" src="logo_512.png" alt="logo" />
                            </div>
                            <h2 className="text-2xl font-bold tracking-tight">Arsip Digital Hotel</h2>
                        </div>

                        <h1 className="text-5xl font-extrabold leading-tight mb-6">Pemulihan Akses Akun Anda</h1>
                        <p className="text-lg text-blue-50/80 leading-relaxed mb-10">
                            Kami di sini untuk membantu Anda kembali masuk. Kebijakan keamanan kami memastikan data Anda tetap terlindungi selama proses pemulihan.
                        </p>
                    </div>
                </div>

                {/* Bagian Kanan (Form) */}
                <div className="w-full lg:w-1/2 bg-white dark:bg-background-dark flex flex-col justify-center px-6 sm:px-12 lg:px-24 py-12 relative overflow-y-auto">
                    <div className="max-w-[420px] w-full mx-auto">

                        {/* Logo Mobile */}
                        <div className="lg:hidden flex items-center gap-3 mb-12">
                            <div className="bg-primary p-2 rounded-lg shadow-lg shadow-primary/20">
                                <img className="w-10 h-10" src="logo_512.png" alt="logo" />
                            </div>
                            <h2 className="text-xl font-bold dark:text-white">Arsip Digital Hotel</h2>
                        </div>

                        <header className="mb-10">
                            <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-3 tracking-tight">Lupa Kata Sandi?</h2>
                            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                                Masukkan alamat email yang terdaftar. Kami akan mengirimkan tautan untuk mengatur ulang kata sandi Anda.
                            </p>
                        </header>

                        <form onSubmit={handleResetPassword} className="space-y-6">
                            {/* Pesan Alert */}
                            {message.text && (
                                <div className={`p-4 rounded-xl flex items-start gap-3 border ${message.type === 'success'
                                    ? 'bg-emerald-50 border-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:border-emerald-800 dark:text-emerald-400'
                                    : 'bg-red-50 border-red-100 text-red-700 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400'
                                    }`}>
                                    <span className="material-symbols-outlined text-[20px] mt-0.5">
                                        {message.type === 'success' ? 'check_circle' : 'error'}
                                    </span>
                                    <p className="text-sm font-medium leading-normal">{message.text}</p>
                                </div>
                            )}

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700 dark:text-slate-200" htmlFor="email">Alamat Email</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <span className="material-symbols-outlined text-slate-400 group-focus-within:text-primary transition-colors">mail</span>
                                    </div>
                                    <input
                                        required
                                        className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-slate-400"
                                        id="email"
                                        placeholder="nama@hotel.com"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                            </div>

                            <button
                                disabled={loading}
                                className="w-full bg-primary hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50"
                                type="submit"
                            >
                                {loading ? "Mengirim..." : "Kirim Tautan Atur Ulang"}
                                {!loading && <span className="material-symbols-outlined text-[20px]">send</span>}
                            </button>
                        </form>

                        <div className="mt-8 text-center pt-8 border-t border-slate-100 dark:border-slate-800/50">
                            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
                                Ingat kata sandi Anda?
                                <Link to="/login" className="text-primary font-bold hover:underline ml-1.5 transition-all inline-flex items-center gap-1">
                                    Kembali ke Login
                                </Link>
                            </p>
                        </div>
                    </div>

                    <div className="absolute bottom-6 left-0 right-0 text-center">
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">© 2026 Arsip Digital Hotel</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
