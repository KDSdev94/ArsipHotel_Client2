import React from 'react';

const FileUploadArea = () => {
    return (
        // Area drop file dengan border putus-putus (border-dashed) biar user tau ini tempat upload
        <div className="bg-white dark:bg-gray-800 rounded-xl border-2 border-dashed border-primary/30 p-12 mb-8 flex flex-col items-center justify-center text-center hover:border-primary transition-colors cursor-pointer group">
            {/* Icon awan - dikasih efek scale-110 (agak membesar) pas di-hover biar interaktif */}
            <div className="size-16 bg-blue-50 dark:bg-primary/10 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-primary text-4xl">cloud_upload</span>
            </div>

            <h3 className="text-lg font-bold text-[#111318] dark:text-white mb-2">Seret dan Lepas file di sini</h3>
            <p className="text-[#616f89] dark:text-gray-400 text-sm mb-4">Format yang didukung: PDF, DOCX, XLSX, JPG (Maks 50MB)</p>

            {/* Tombol buat buka file picker manual */}
            <button className="px-6 py-2 bg-primary text-white rounded-lg font-bold text-sm shadow-md hover:bg-blue-700 transition-colors">
                Cari File
            </button>

            {/* Input file yang sebenarnya, tapi disembunyiin (hidden) karena tampilannya kita custom pakai div di atas */}
            <input type="file" className="hidden" />
        </div>
    );
};

export default FileUploadArea;

