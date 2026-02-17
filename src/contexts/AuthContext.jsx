// ============================================
// FILE: AuthContext.jsx
// FUNGSI: Context untuk kelola autentikasi user
// FITUR: Login, Logout, Register, Forgot Password, Current User
// ============================================

import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../firebase/config';
import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    sendPasswordResetEmail,
    updateProfile,
    updatePassword,
    onAuthStateChanged
} from 'firebase/auth';

// ============================================
// BUAT CONTEXT
// ============================================
// Context = Wadah global buat nyimpen data user
// Bisa diakses dari komponen mana aja tanpa props drilling
const AuthContext = createContext();

// ============================================
// CUSTOM HOOK - useAuth
// ============================================
// Hook ini buat akses AuthContext dengan mudah
// Tinggal panggil: const { user, login, logout } = useAuth();
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth harus dipanggil di dalam AuthProvider');
    }
    return context;
};

// ============================================
// AUTH PROVIDER COMPONENT
// ============================================
export const AuthProvider = ({ children }) => {
    // State buat nyimpen data user yang lagi login
    // null = belum login, object = udah login
    const [currentUser, setCurrentUser] = useState(null);

    // State buat status loading (pas cek user pertama kali)
    const [loading, setLoading] = useState(true);

    // ============================================
    // FUNGSI LOGIN
    // ============================================
    const login = async (email, password) => {
        try {
            // Panggil Firebase Auth buat login
            const result = await signInWithEmailAndPassword(auth, email, password);
            return { success: true, user: result.user };
        } catch (error) {
            // Tangkap error dan kasih pesan yang jelas
            let message = 'Terjadi kesalahan saat login';

            if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
                message = 'Email atau password salah';
            } else if (error.code === 'auth/too-many-requests') {
                message = 'Terlalu banyak percobaan. Coba lagi nanti.';
            }

            return { success: false, error: message };
        }
    };

    // ============================================
    // FUNGSI REGISTER
    // ============================================
    const register = async (email, password, displayName) => {
        try {
            // 1. Buat akun di Firebase Auth
            const result = await createUserWithEmailAndPassword(auth, email, password);

            // 2. Update display name
            await updateProfile(result.user, { displayName });

            return { success: true, user: result.user };
        } catch (error) {
            let message = 'Terjadi kesalahan saat mendaftar';

            if (error.code === 'auth/email-already-in-use') {
                message = 'Email sudah terdaftar';
            } else if (error.code === 'auth/weak-password') {
                message = 'Password terlalu lemah (minimal 6 karakter)';
            }

            return { success: false, error: message };
        }
    };

    // ============================================
    // FUNGSI LOGOUT
    // ============================================
    const logout = async () => {
        try {
            await signOut(auth);
            return { success: true };
        } catch {
            return { success: false, error: 'Gagal logout' };
        }
    };

    // ============================================
    // FUNGSI RESET PASSWORD
    // ============================================
    const resetPassword = async (email) => {
        try {
            await sendPasswordResetEmail(auth, email);
            return { success: true, message: 'Email reset password telah dikirim' };
        } catch (error) {
            let message = 'Gagal mengirim email reset';

            if (error.code === 'auth/user-not-found') {
                message = 'Email tidak terdaftar';
            }

            return { success: false, error: message };
        }
    };

    // ============================================
    // FUNGSI GANTI PASSWORD (LOGGED IN)
    // ============================================
    const changePassword = async (newPassword) => {
        try {
            if (!currentUser) throw new Error('User tidak ditemukan');
            await updatePassword(currentUser, newPassword);
            return { success: true, message: 'Password berhasil diubah' };
        } catch (error) {
            let message = 'Gagal mengubah password';
            if (error.code === 'auth/requires-recent-login') {
                message = 'Keamanan: Harap login ulang sebelum mengganti password';
            } else if (error.code === 'auth/weak-password') {
                message = 'Password terlalu lemah';
            }
            return { success: false, error: message };
        }
    };

    // ============================================
    // FUNGSI ADMIN: BUAT AKUN TANPA LOGOUT
    // ============================================
    const signUpByAdmin = async (email, password, displayName) => {
        // Kita butuh import initializeApp & getAuth secara dinamis atau pastikan sudah diimport di atas
        // Tapi karena kita sudah punya config, kita bisa pakai itu.
        const { initializeApp, deleteApp } = await import('firebase/app');
        const { getAuth, createUserWithEmailAndPassword, updateProfile: updateAuthProfile } = await import('firebase/auth');
        const { default: app } = await import('../firebase/config');

        // Buat instance app sementara (pake nama unik biar gak bentrok)
        const tempAppName = `temp-app-${Date.now()}`;
        const tempApp = initializeApp(app.options, tempAppName);
        const tempAuth = getAuth(tempApp);

        try {
            // 1. Buat user di instance sementara (tidak ganggu login Admin)
            const result = await createUserWithEmailAndPassword(tempAuth, email, password);

            // 2. Set display name
            await updateAuthProfile(result.user, { displayName });

            // 3. Hapus app sementara
            await deleteApp(tempApp);

            return { success: true, uid: result.user.uid };
        } catch (error) {
            await deleteApp(tempApp);
            let message = 'Gagal mendaftarkan akun auth';
            if (error.code === 'auth/email-already-in-use') message = 'Email sudah digunakan';
            return { success: false, error: message };
        }
    };

    // ============================================
    // LISTENER AUTH STATE
    // ============================================
    // useEffect ini jalan pas component pertama kali mount
    // Fungsinya: Dengerin perubahan status login user
    useEffect(() => {
        // onAuthStateChanged = Listener bawaan Firebase
        // Jalan otomatis pas user login/logout
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user); // Update state user
            setLoading(false);    // Matiin loading
        });

        // Cleanup: Matiin listener pas component unmount
        return unsubscribe;
    }, []);

    // ============================================
    // VALUE YANG DIBAGIKAN KE SELURUH APP
    // ============================================
    const value = {
        currentUser,      // Data user yang lagi login
        loading,          // Status loading
        login,            // Fungsi login
        register,         // Fungsi register
        logout,           // Fungsi logout
        resetPassword,    // Fungsi reset password
        changePassword,   // Fungsi ganti password
        signUpByAdmin,    // Fungsi admin daftarin user baru
    };

    // ============================================
    // RENDER PROVIDER
    // ============================================
    return (
        <AuthContext.Provider value={value}>
            {/* Kalau masih loading, tampilkan spinner */}
            {/* Kalau udah selesai, tampilkan children (komponen app) */}
            {!loading && children}
        </AuthContext.Provider>
    );
};

/*
  ============================================
  CARA PAKAI AuthContext:
  ============================================
  
  1. WRAP APP DI main.jsx:
     
     import { AuthProvider } from './contexts/AuthContext';
     
     <AuthProvider>
       <App />
     </AuthProvider>
  
  2. PAKAI DI KOMPONEN:
     
     import { useAuth } from '../contexts/AuthContext';
     
     const Login = () => {
       const { login, currentUser } = useAuth();
       
       const handleLogin = async () => {
         const result = await login(email, password);
         if (result.success) {
           navigate('/home');
         } else {
           alert(result.error);
         }
       };
     };
  
  ============================================
  KEUNTUNGAN PAKAI CONTEXT:
  ============================================
  
  1. Gak perlu import auth di setiap file
  2. Gak perlu props drilling (kirim data lewat banyak komponen)
  3. Centralized logic - semua fungsi auth di 1 tempat
  4. Mudah maintain - mau ubah logic tinggal edit di sini
  5. Bisa akses currentUser dari mana aja
  
  ============================================
  CONTOH PENGGUNAAN:
  ============================================
  
  // Cek apakah user sudah login
  const { currentUser } = useAuth();
  if (!currentUser) {
    return <Navigate to="/login" />;
  }
  
  // Tampilkan nama user
  <p>Halo, {currentUser.displayName}</p>
  
  // Logout
  const { logout } = useAuth();
  await logout();
*/
