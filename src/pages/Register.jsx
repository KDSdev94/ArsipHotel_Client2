import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useFirestore } from '../contexts/FirestoreContext';

const Register = () => {
    const navigate = useNavigate();
    const { register } = useAuth();
    const { getDocuments, setDocument } = useFirestore();

    // State untuk form input
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        division: '',
        password: '',
        confirmPassword: '',
    });

    // State untuk list divisi
    const [divisions, setDivisions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    // Ambil data divisi dari Firestore
    useEffect(() => {
        const fetchDivisions = async () => {
            const result = await getDocuments('divisions');
            if (result.success) {
                setDivisions(result.data);
            }
        };
        fetchDivisions();
    }, []);

    // Handle perubahan input
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    // Submit form registrasi
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validasi password match
        if (formData.password !== formData.confirmPassword) {
            alert("Password dan konfirmasi password tidak cocok!");
            return;
        }

        setLoading(true);

        // 1. Register user di Firebase Auth
        const authResult = await register(formData.email, formData.password, formData.name);

        if (authResult.success) {
            // 2. Simpan data tambahan ke Firestore
            const firestoreResult = await setDocument('users', authResult.user.uid, {
                name: formData.name,
                email: formData.email,
                division: formData.division,
                role: 'Staf'
            });

            if (firestoreResult.success) {
                alert("Pendaftaran berhasil! Silakan login.");
                navigate('/login');
            } else {
                alert("Gagal menyimpan data: " + firestoreResult.error);
            }
        } else {
            alert(authResult.error);
        }

        setLoading(false);
    };

    return (
        <div className="bg-background-light dark:bg-background-dark h-screen flex items-center justify-center overflow-hidden">
            <div className="flex h-full w-full overflow-hidden">

                {/* Bagian Kiri (Visual) - Fixed h-full, no scroll */}
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
                            <h2 className="text-2xl font-bold tracking-tight">E-Arsip System</h2>
                        </div>

                        <h1 className="text-5xl font-extrabold leading-tight mb-6">Kelola Dokumen Hotel Secara Digital</h1>
                        <p className="text-lg text-blue-50/80 leading-relaxed mb-10">
                            Sistem arsip terintegrasi untuk meningkatkan efisiensi operasional hotel Anda. Simpan dan kelola dokumen dalam satu platform aman.
                        </p>

                        <div className="flex gap-8">
                            <div className="flex flex-col">
                                <span className="text-3xl font-bold">100%</span>
                                <span className="text-xs text-blue-100 uppercase tracking-widest font-bold opacity-70">Aman</span>
                            </div>
                            <div className="w-px h-10 bg-white/20"></div>
                            <div className="flex flex-col">
                                <span className="text-3xl font-bold">Cloud</span>
                                <span className="text-xs text-blue-100 uppercase tracking-widest font-bold opacity-70">Real-time</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bagian Kanan (Form) - Fixed h-full, content centered */}
                <div className="w-full lg:w-1/2 bg-white dark:bg-background-dark flex flex-col justify-center px-6 sm:px-12 lg:px-20 py-8 relative overflow-y-auto">
                    <div className="max-w-[420px] w-full mx-auto">

                        {/* Logo Mobile (Sama dengan Login) */}
                        <div className="lg:hidden flex items-center gap-3 mb-10">
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

                        <header className="mb-8">
                            <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">Pendaftaran Akun</h2>
                            <p className="text-slate-500 dark:text-slate-400 text-sm">Lengkapi data untuk akses sistem arsip hotel.</p>
                        </header>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider" htmlFor="name">Nama Lengkap</label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <span className="material-symbols-outlined text-slate-400 group-focus-within:text-primary transition-colors text-[20px]">person</span>
                                        </div>
                                        <input required className="w-full pl-10 pr-3 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" id="name" placeholder="Nama Anda" type="text" value={formData.name} onChange={handleChange} />
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider" htmlFor="email">Email</label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <span className="material-symbols-outlined text-slate-400 group-focus-within:text-primary transition-colors text-[20px]">mail</span>
                                        </div>
                                        <input required className="w-full pl-10 pr-3 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" id="email" placeholder="nama@hotel.com" type="email" value={formData.email} onChange={handleChange} />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider" htmlFor="division">Divisi</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <span className="material-symbols-outlined text-slate-400 group-focus-within:text-primary transition-colors text-[20px]">corporate_fare</span>
                                    </div>
                                    <select
                                        required
                                        className={`w-full pl-10 pr-10 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none appearance-none transition-all ${formData.division === "" ? "text-slate-400 dark:text-slate-500" : "text-slate-900 dark:text-white"}`}
                                        id="division"
                                        value={formData.division}
                                        onChange={handleChange}
                                    >
                                        <option value="" disabled className="text-slate-400">Pilih Divisi</option>
                                        {divisions.map(div => (
                                            <option key={div.id} value={div.name} className="text-slate-900 dark:text-slate-900">
                                                {div.name}
                                            </option>
                                        ))}
                                    </select>
                                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                        <span className="material-symbols-outlined text-slate-400 text-[20px]">expand_more</span>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider" htmlFor="password">Kata Sandi</label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <span className="material-symbols-outlined text-slate-400 group-focus-within:text-primary transition-colors text-[20px]">lock</span>
                                        </div>
                                        <input required className="w-full pl-10 pr-10 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" id="password" placeholder="••••••••" type={showPassword ? "text" : "password"} value={formData.password} onChange={handleChange} />
                                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-primary transition-colors">
                                            <span className="material-symbols-outlined text-[18px]">{showPassword ? "visibility_off" : "visibility"}</span>
                                        </button>
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider" htmlFor="confirmPassword">Konfirmasi</label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <span className="material-symbols-outlined text-slate-400 group-focus-within:text-primary transition-colors text-[20px]">lock_reset</span>
                                        </div>
                                        <input required className="w-full pl-10 pr-3 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" id="confirmPassword" placeholder="••••••••" type="password" value={formData.confirmPassword} onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })} />
                                    </div>
                                </div>
                            </div>

                            <button disabled={loading} className="w-full bg-primary hover:bg-blue-700 text-white font-bold py-3.5 rounded-lg shadow-lg shadow-primary/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2 mt-4 disabled:opacity-50" type="submit">
                                {loading ? "Memproses..." : "Daftar Sekarang"}
                                {!loading && <span className="material-symbols-outlined text-[20px]">arrow_forward</span>}
                            </button>
                        </form>

                        <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 text-center">
                            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
                                Sudah punya akun?
                                <Link to="/login" className="text-primary font-bold hover:underline ml-1.5 transition-all">Masuk</Link>
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

export default Register;
