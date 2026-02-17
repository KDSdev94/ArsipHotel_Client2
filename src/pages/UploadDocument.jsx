import React from 'react';
import Layout from '../components/layout/Layout';
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
        <Layout title="Unggah Dokumen Baru" showBack={true}>
            <div className="max-w-4xl mx-auto w-full">
                <div className="mb-8 text-center sm:text-left">
                    <h1 className="text-[#111318] dark:text-white text-2xl md:text-3xl font-black leading-tight tracking-tight mb-2">
                        Unggah Dokumen Baru
                    </h1>
                    <p className="text-[#616f89] dark:text-gray-400 text-sm md:text-base font-normal">
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
            </div>
        </Layout>
    );
};

export default UploadDocument;

