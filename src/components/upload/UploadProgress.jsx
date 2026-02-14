import React from 'react';

const UploadProgress = ({ fileName, progress }) => {
    if (progress === 0) return null;

    return (
        <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-semibold text-[#111318] dark:text-white">
                    {progress < 100 ? 'Mengunggah...' : 'Selesai'}: {fileName}
                </span>
                <span className="text-sm font-bold text-primary">{progress}%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                <div
                    className="bg-primary h-2.5 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                ></div>
            </div>
        </div>
    );
};

export default UploadProgress;
