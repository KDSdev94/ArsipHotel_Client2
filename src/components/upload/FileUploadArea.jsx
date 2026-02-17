import React from 'react';

const FileUploadArea = ({ onFileSelect, selectedFile }) => {
    const fileInputRef = React.useRef(null);
    const [isDragging, setIsDragging] = React.useState(false);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            onFileSelect(file);
        }
    };

    // Handler Drag & Drop
    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        const files = e.dataTransfer.files;
        if (files && files.length > 0) {
            onFileSelect(files[0]);
        }
    };

    return (
        // Area drop file dengan border putus-putus (border-dashed) biar user tau ini tempat upload
        <div
            onClick={() => fileInputRef.current.click()}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`bg-white dark:bg-gray-800 rounded-xl border-2 border-dashed ${isDragging ? 'border-primary bg-primary/10 scale-102' : selectedFile ? 'border-primary bg-primary/5' : 'border-primary/30'} p-12 mb-8 flex flex-col items-center justify-center text-center hover:border-primary transition-all cursor-pointer group`}
        >
            {/* Icon awan - dikasih efek scale-110 (agak membesar) pas di-hover biar interaktif */}
            <div className={`size-16 ${selectedFile ? 'bg-primary text-white' : 'bg-blue-50 dark:bg-primary/10 text-primary'} rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform ${isDragging ? 'scale-125' : ''}`}>
                <span className="material-symbols-outlined text-4xl">
                    {selectedFile ? 'check_circle' : isDragging ? 'upload_file' : 'cloud_upload'}
                </span>
            </div>

            <h3 className="text-lg font-bold text-[#111318] dark:text-white mb-2">
                {isDragging ? 'Lepaskan file untuk mengunggah' : selectedFile ? selectedFile.name : 'Seret dan Lepas file di sini'}
            </h3>
            <p className="text-[#616f89] dark:text-gray-400 text-sm mb-4">
                {selectedFile && !isDragging ? `${(selectedFile.size / 1024 / 1024).toFixed(2)} MB` : 'Format yang didukung: PDF, DOCX, XLSX, JPG (Maks 50MB)'}
            </p>

            {/* Tombol buat buka file picker manual */}
            {!isDragging && (
                <button className="px-6 py-2 bg-primary text-white rounded-lg font-bold text-sm shadow-md hover:bg-blue-700 transition-colors">
                    {selectedFile ? 'Ganti File' : 'Cari File'}
                </button>
            )}

            {/* Input file yang sebenarnya, tapi disembunyiin (hidden) karena tampilannya kita custom pakai div di atas */}
            <input
                type="file"
                className="hidden"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".pdf,.docx,.xlsx,.jpg,.jpeg,.png"
            />
        </div>
    );
};

export default FileUploadArea;

