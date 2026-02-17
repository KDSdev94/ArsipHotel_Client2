import React from 'react';
import NavigasiSamping from '../components/dashboard/sidebar/NavigasiSamping';
import HeaderAtas from '../components/dashboard/header/HeaderAtas';
import Footer from '../components/dashboard/umum/Footer';
import FileUploadArea from '../components/upload/FileUploadArea';
import UploadProgress from '../components/upload/UploadProgress';
import DocumentMetadataForm from '../components/upload/DocumentMetadataForm';

const UploadDocument = () => {
    const [selectedFile, setSelectedFile] = React.useState(null);
    const [uploadProgress, setUploadProgress] = React.useState(0);

    const handleFileSelect = (file) => {
        setSelectedFile(file);
        setUploadProgress(0); // Reset progress tiap milih file baru
    };

    return (
        <div className="flex h-screen overflow-hidden bg-white dark:bg-background-dark text-[#111318] dark:text-gray-100 font-display">
            {/* Navigasi Samping */}
            <NavigasiSamping />

            <div className="flex-1 flex flex-col overflow-y-auto">
                {/* Header dengan tombol 'Back' (showBack={true}) karena ini halaman detail */}
                <HeaderAtas title="Unggah Dokumen Baru" showBack={true} />

                {/* Konten Utama: max-w-4xl biar form-nya gak terlalu lebar melar di layar gede */}
                <main className="flex-1 p-8 max-w-4xl mx-auto w-full">
                    <div className="mb-8 text-center sm:text-left">
                        <h1 className="text-[#111318] dark:text-white text-3xl font-black leading-tight tracking-tight mb-2">
                            Unggah Dokumen Baru
                        </h1>
                        <p className="text-[#616f89] dark:text-gray-400 text-base font-normal">
                            Tambahkan file baru ke arsip digital hotel dengan metadata yang sesuai.
                        </p>
                    </div>

                    {/* Kotak tempat narik (drag) atau milih file */}
                    <FileUploadArea onFileSelect={handleFileSelect} selectedFile={selectedFile} />

                    {/* Progress Bar muncul otomatis pas upload */}
                    {selectedFile && uploadProgress > 0 && (
                        <UploadProgress
                            fileName={selectedFile.name}
                            progress={uploadProgress}
                        />
                    )}

                    {/* Form buat isi nama dokumen, kategori, tanggal, dll */}
                    <DocumentMetadataForm
                        file={selectedFile}
                        onProgress={setUploadProgress}
                    />
                </main>

                <Footer />
            </div>
        </div>
    );
};

export default UploadDocument;

