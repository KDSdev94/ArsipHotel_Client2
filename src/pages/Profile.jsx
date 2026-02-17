import React from 'react';
import NavigasiSamping from '../components/dashboard/sidebar/NavigasiSamping';
import HeaderAtas from '../components/dashboard/header/HeaderAtas';
import Footer from '../components/dashboard/umum/Footer';
import { useAuth } from '../contexts/AuthContext';
import { useUserProfile } from '../contexts/UserProfileContext';

const Profile = () => {
    const { currentUser } = useAuth();
    const { userProfile } = useUserProfile();

    return (
        <div className="flex h-screen overflow-hidden bg-white dark:bg-background-dark text-[#111318] dark:text-gray-100 font-display">
            <NavigasiSamping />
            <div className="flex-1 flex flex-col overflow-y-auto">
                <HeaderAtas title="Profil Pengguna" showBack={true} />
                <main className="flex-1 p-8 max-w-4xl mx-auto w-full">
                    <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
                        <div className="h-48 bg-linear-to-r from-primary to-blue-400 relative">
                            <div className="absolute -bottom-16 left-8 p-1 bg-white dark:bg-gray-800 rounded-full shadow-lg">
                                <div className="size-32 rounded-full bg-blue-50 flex items-center justify-center text-primary border-4 border-white dark:border-gray-800 overflow-hidden">
                                    {userProfile?.photoURL ? (
                                        <img src={userProfile.photoURL} alt="Profile" className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="material-symbols-outlined text-6xl">account_circle</span>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="pt-20 px-8 pb-8">
                            <div className="flex justify-between items-start mb-8">
                                <div>
                                    <h1 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                                        {userProfile?.name || currentUser?.displayName || 'User'}
                                    </h1>
                                    <p className="text-primary font-bold">{currentUser?.email}</p>
                                </div>
                                <button className="px-6 py-2 border-2 border-primary text-primary hover:bg-primary hover:text-white rounded-xl font-bold transition-all text-sm">
                                    Edit Profil
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-6">
                                    <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest border-b pb-2">Informasi Akun</h3>
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-4">
                                            <div className="size-10 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 flex items-center justify-center">
                                                <span className="material-symbols-outlined">badge</span>
                                            </div>
                                            <div>
                                                <p className="text-xs text-slate-400 font-bold uppercase">Role</p>
                                                <p className="font-bold text-slate-700 dark:text-slate-200">
                                                    {userProfile?.role || 'User'}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="size-10 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 flex items-center justify-center">
                                                <span className="material-symbols-outlined">corporate_fare</span>
                                            </div>
                                            <div>
                                                <p className="text-xs text-slate-400 font-bold uppercase">Divisi</p>
                                                <p className="font-bold text-slate-700 dark:text-slate-200">
                                                    {userProfile?.division || 'Umum'}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="size-10 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 flex items-center justify-center">
                                                <span className="material-symbols-outlined">alternate_email</span>
                                            </div>
                                            <div>
                                                <p className="text-xs text-slate-400 font-bold uppercase">Email Utama</p>
                                                <p className="font-bold text-slate-700 dark:text-slate-200">{currentUser?.email}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest border-b pb-2">Keamanan</h3>
                                    <button
                                        onClick={() => window.location.href = '/ganti-password'}
                                        className="w-full flex items-center justify-between p-4 rounded-xl border border-dashed border-slate-200 dark:border-gray-700 hover:border-primary hover:bg-primary/5 transition-all group"
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className="material-symbols-outlined text-slate-400 group-hover:text-primary">lock_reset</span>
                                            <span className="font-bold text-slate-600 dark:text-slate-300">Ganti Password</span>
                                        </div>
                                        <span className="material-symbols-outlined text-slate-300">chevron_right</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
                <Footer />
            </div>
        </div>
    );
};

export default Profile;
