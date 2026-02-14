import React from 'react'; // Mengimpor library React untuk membuat komponen

const GrafikTrenUnggahan = () => {
    // Komponen ini menampilkan grafik tren unggahan menggunakan SVG (Scalable Vector Graphics)
    return (
        // Container utama kartu (card) dengan styling Tailwind:
        // bg-white (putih), dark:bg-slate-900 (gelap untuk dark mode), p-6 (padding), rounded-xl (sudut melingkar)
        // shadow-sm (bayangan halus), h-full (tinggi penuh mengikuti container-nya)
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm h-full">

            {/* Bagian Header Grafik: Judul dan Legenda */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h3 className="font-bold text-lg">Tren Unggahan (6 Bulan)</h3>
                    <p className="text-xs text-slate-500">Pertumbuhan volume arsip digital</p>
                </div>
                {/* Legenda warna untuk grafik */}
                <div className="flex gap-2">
                    <div className="flex items-center gap-1">
                        <span className="size-2 rounded-full bg-primary"></span> {/* Titik warna biru (primary) */}
                        <span className="text-[10px] font-bold text-slate-500 uppercase">2024</span>
                    </div>
                </div>
            </div>

            {/* Area Grafik Utama */}
            <div className="h-64 relative flex flex-col justify-between">
                {/* SVG digunakan karena ringan dan tidak pecah saat di-zoom (vektor) */}
                <svg className="w-full h-48 mt-4" preserveAspectRatio="none" viewBox="0 0 500 150">
                    <defs>
                        {/* Membuat gradasi warna biru transparan di bawah garis grafik */}
                        <linearGradient id="chartGradient" x1="0%" x2="0%" y1="0%" y2="100%">
                            <stop offset="0%" style={{ stopColor: 'rgba(19, 91, 236, 0.2)', stopOpacity: 1 }}></stop>
                            <stop offset="100%" style={{ stopColor: 'rgba(19, 91, 236, 0)', stopOpacity: 0 }}></stop>
                        </linearGradient>
                    </defs>

                    {/* Path pertama: Area gradasi (fill) menggunakan path yang sama dengan garis tapi ditutup ke bawah */}
                    <path d="M0,120 Q50,40 100,100 T200,80 T300,40 T400,90 T500,20 V150 H0 Z" fill="url(#chartGradient)"></path>

                    {/* Path kedua: Garis grafik utama (stroke) dengan efek smooth (kurva Bezier) */}
                    <path d="M0,120 Q50,40 100,100 T200,80 T300,40 T400,90 T500,20" fill="none" stroke="#135bec" strokeLinecap="round" strokeWidth="3"></path>

                    {/* Titik indikator terakhir (current status) */}
                    <circle cx="500" cy="20" fill="#135bec" r="4"></circle>
                </svg>

                {/* Label sumbu X (Bulan) yang ditata secara horizontal */}
                <div className="flex justify-between px-2 mt-4">
                    <span className="text-[10px] font-bold text-slate-500">JAN</span>
                    <span className="text-[10px] font-bold text-slate-500">FEB</span>
                    <span className="text-[10px] font-bold text-slate-500">MAR</span>
                    <span className="text-[10px] font-bold text-slate-500">APR</span>
                    <span className="text-[10px] font-bold text-slate-500">MEI</span>
                    <span className="text-[10px] font-bold text-slate-500">JUN</span>
                </div>
            </div>
        </div>
    );
};

export default GrafikTrenUnggahan;

