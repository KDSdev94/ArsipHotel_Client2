import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext"; // Pakai Context, bukan import Firebase langsung!

const Login = () => {
  // State untuk form
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth(); // Ambil fungsi login dari Context

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Panggil fungsi login dari Context
    const result = await login(email, password);

    if (result.success) {
      // Berhasil login, pindah ke home
      navigate("/home");
    } else {
      // Gagal login, tampilkan error
      setError(result.error);
    }

    setLoading(false);
  };

  return (
    // Wrapper utama: tinggi satu layar penuh (min-h-screen)
    <div className="flex min-h-screen bg-background-light dark:bg-background-dark font-display text-[#111318] dark:text-white transition-colors duration-200">
      <div className="flex flex-col lg:flex-row w-full">
        {/* SISI KIRI (Desktop) / SISI ATAS (Mobile): Gambar & Branding */}
        <div className="flex lg:w-1/2 relative overflow-hidden bg-slate-900 min-h-75 lg:min-h-screen">
          <div className="absolute inset-0">
            <img
              src="/background.jpeg"
              alt="Hotel Background"
              className="w-full h-full object-cover opacity-60"
            />
            <div className="absolute inset-0 bg-linear-to-t from-[#0f172a] to-transparent opacity-60"></div>
          </div>
          <div className="relative z-20 flex flex-col justify-between h-full p-8 lg:p-16 text-white w-full">
            <div className="flex items-center justify-between lg:justify-start gap-3 w-full">
              <div className="flex items-center gap-3">
                <div className="bg-white/10 backdrop-blur-md p-1.5 lg:p-2 rounded-lg border border-white/20">
                  <img
                    className="w-10 h-10 lg:w-16 lg:h-16"
                    src="/logo_512.png"
                    alt="logo"
                  />
                </div>
                <h2 className="text-xl lg:text-2xl font-bold tracking-tight">
                  Arsip Hotel
                </h2>
              </div>

              {/* Tombol Masuk tambahan buat mobile biar mirip screenshot */}
              <div className="lg:hidden">
                <Link
                  to="/register"
                  className="px-4 py-1.5 bg-black rounded-full text-xs font-bold"
                >
                  Masuk
                </Link>
              </div>
            </div>

            <div className="max-w-md mt-auto lg:mt-0">
              <div className="inline-block px-3 py-1 bg-white/10 backdrop-blur-md rounded-lg border border-white/10 mb-4 lg:hidden">
                <p className="text-xs font-bold">Arsip Digital</p>
              </div>
              <h3 className="text-2xl lg:text-4xl font-bold mb-3 lg:mb-6 leading-tight">
                Menjaga keunggulan layanan untuk generasi mendatang.
              </h3>
              <p className="hidden lg:block text-lg text-white/80 leading-relaxed">
                Akses repositori komprehensif catatan sejarah, denah lantai, dan
                warisan arsitektur kami melalui gerbang perusahaan yang aman.
              </p>
            </div>

            {/* Info tambahan (Secure Encryption & Cloud) - Cuma di Desktop */}
            <div className="hidden lg:flex gap-6 items-center text-sm text-white/60">
              <span className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">
                  verified_user
                </span>
                Enkripsi Aman
              </span>
              <span className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">
                  cloud_done
                </span>
                Penyimpanan Cloud
              </span>
            </div>
          </div>
        </div>

        {/* SISI KANAN: Form Login-nya */}
        <div className="w-full lg:w-1/2 flex items-start lg:items-center justify-center p-8 bg-white dark:bg-background-dark">
          <div className="w-full max-w-105 flex flex-col pt-4 lg:pt-0">
            {/* Logo buat versi Mobile (Dihapus karena udah ada di atas) */}

            <header className="mb-10">
              <h1 className="text-[#111318] dark:text-white text-3xl font-black leading-tight tracking-tight mb-3">
                Selamat Datang Kembali!
              </h1>
              <p className="text-[#616f89] dark:text-gray-400 text-base font-normal">
                Silakan masukkan kredensial Anda untuk mengakses arsip digital.
              </p>
            </header>

            <form className="flex flex-col gap-5" onSubmit={handleLogin}>
              {/* Kotak Error: Muncul cuma kalo ada masalah */}
              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4 rounded-lg flex items-center gap-3">
                  <span className="material-symbols-outlined text-red-600 dark:text-red-400 text-[20px]">
                    error
                  </span>
                  <p className="text-sm font-medium text-red-600 dark:text-red-400">
                    {error}
                  </p>
                </div>
              )}

              {/* Input Email */}
              <div className="flex flex-col gap-2">
                <label className="text-[#111318] dark:text-gray-200 text-sm font-semibold leading-normal">
                  Email
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <span className="material-symbols-outlined text-[#616f89] group-focus-within:text-primary transition-colors text-[20px]">
                      mail
                    </span>
                  </div>
                  <input
                    className="flex w-full pl-11 rounded-lg text-[#111318] dark:text-white dark:bg-gray-800/50 border border-[#dbdfe6] dark:border-gray-700 focus:outline-0 focus:ring-2 focus:ring-primary/20 focus:border-primary h-12 placeholder:text-[#616f89] text-base font-normal leading-normal transition-all"
                    placeholder="Masukkan email"
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              {/* Input Password */}
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <label className="text-[#111318] dark:text-gray-200 text-sm font-semibold leading-normal">
                    Kata Sandi
                  </label>
                </div>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <span className="material-symbols-outlined text-[#616f89] group-focus-within:text-primary transition-colors text-[20px]">
                      lock
                    </span>
                  </div>
                  <input
                    className="flex w-full pl-11 pr-12 rounded-lg text-[#111318] dark:text-white dark:bg-gray-800/50 border border-[#dbdfe6] dark:border-gray-700 focus:outline-0 focus:ring-2 focus:ring-primary/20 focus:border-primary h-12 placeholder:text-[#616f89] text-base font-normal leading-normal transition-all"
                    placeholder="Masukkan kata sandi"
                    required
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-[#616f89] hover:text-primary transition-colors"
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      {showPassword ? "visibility_off" : "visibility"}
                    </span>
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between mt-1">
                <div className="flex items-center gap-2">
                  <input
                    className="w-4 h-4 rounded text-primary focus:ring-primary dark:bg-gray-800 border-gray-300 dark:border-gray-700"
                    id="remember"
                    type="checkbox"
                  />
                  <label
                    className="text-[#616f89] dark:text-gray-400 text-sm"
                    htmlFor="remember"
                  >
                    Ingat Saya
                  </label>
                </div>
                <Link
                  className="text-primary hover:text-primary/80 text-sm font-semibold transition-colors"
                  to="/forgot-password"
                >
                  Lupa Kata Sandi?
                </Link>
              </div>

              {/* Tombol Login */}
              <button
                className={`mt-4 flex min-w-21 items-center justify-center overflow-hidden rounded-lg h-12 px-5 bg-primary hover:bg-primary/90 text-white text-base font-bold leading-normal tracking-[0.015em] transition-all shadow-lg shadow-primary/20 ${loading ? "opacity-70 cursor-not-allowed" : "cursor-pointer"}`}
                type="submit"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Memproses...</span>
                  </div>
                ) : (
                  <span className="truncate">Masuk</span>
                )}
              </button>

              <div className="text-center mt-2">
                <p className="text-sm text-[#616f89] dark:text-gray-400">
                  Login Instan
                </p>
              </div>
            </form>

            <footer className="mt-8 pt-6 border-t border-[#f0f2f4] dark:border-gray-800 text-center">
              <p className="text-[#616f89] dark:text-gray-400 text-sm">
                Belum punya akun?
                <Link
                  className="text-primary font-bold hover:underline ml-1"
                  to="/register"
                >
                  Daftar
                </Link>
              </p>
            </footer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
