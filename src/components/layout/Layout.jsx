import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavigasiSamping from '../dashboard/sidebar/NavigasiSamping';
import HeaderAtas from '../dashboard/header/HeaderAtas';
import Footer from '../dashboard/umum/Footer';

const Layout = ({ children, title, showBack, hideFAB = false }) => {
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <div className="flex h-screen overflow-hidden bg-white dark:bg-background-dark text-[#111318] dark:text-gray-100 font-display">
            {/* Sidebar Desktop & Mobile */}
            <div className={`
                fixed inset-0 z-100 lg:relative lg:z-0 lg:flex
                ${isSidebarOpen ? 'flex' : 'hidden lg:flex'}
            `}>
                {/* Overlay for mobile */}
                <div
                    className="fixed inset-0 bg-black/50 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                ></div>

                {/* Sidebar Content */}
                <div className="relative z-110 w-72 h-full bg-[#0f172a]">
                    <NavigasiSamping />
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col overflow-hidden min-w-0">
                <HeaderAtas
                    title={title}
                    showBack={showBack}
                    onMenuClick={toggleSidebar}
                />

                <main className="flex-1 overflow-y-auto p-4 md:p-8">
                    {children}
                </main>

                <Footer />
            </div>

            {/* Mobile FAB - Quick Upload (Only visible on mobile and dashboard pages) */}
            {!showBack && !hideFAB && (
                <button
                    onClick={() => navigate('/upload')}
                    className="md:hidden fixed bottom-8 right-6 z-50 size-14 bg-primary text-white rounded-full shadow-2xl flex items-center justify-center active:scale-90 transition-transform hover:bg-blue-700"
                >
                    <span className="material-symbols-outlined text-2xl">cloud_upload</span>
                </button>
            )}
        </div>
    );
};

export default Layout;
