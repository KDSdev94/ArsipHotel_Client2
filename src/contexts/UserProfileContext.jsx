// ============================================
// FILE: UserProfileContext.jsx
// FUNGSI: Context untuk kelola profil user lengkap (role, division, dll)
// FITUR: Auto-fetch user profile dari Firestore berdasarkan Auth
// ============================================

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useFirestore } from './FirestoreContext';
import { canAccessDivision, getAccessibleDivisions, getUserDivisionScope, isSuperAdminProfile } from '../utils/accessControl';

const UserProfileContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useUserProfile = () => {
    const context = useContext(UserProfileContext);
    if (!context) {
        throw new Error('useUserProfile harus dipanggil di dalam UserProfileProvider');
    }
    return context;
};

export const UserProfileProvider = ({ children }) => {
    const { currentUser } = useAuth();
    const { getDocument } = useFirestore();

    const [userProfile, setUserProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    // ============================================
    // FETCH USER PROFILE DARI FIRESTORE
    // ============================================
    useEffect(() => {
        const fetchUserProfile = async () => {
            if (!currentUser) {
                setUserProfile(null);
                setLoading(false);
                return;
            }

            try {
                // Ambil data user dari Firestore berdasarkan UID
                const result = await getDocument('users', currentUser.uid);

                if (result.success) {
                    setUserProfile(result.data);
                } else {
                    console.warn('User profile not found in Firestore');
                    setUserProfile(null);
                }
            } catch (error) {
                console.error('Error fetching user profile:', error);
                setUserProfile(null);
            } finally {
                setLoading(false);
            }
        };

        fetchUserProfile();
    }, [currentUser, getDocument]);

    // ============================================
    // HELPER FUNCTIONS
    // ============================================

    // Cek apakah user adalah Admin
    const isAdmin = () => {
        return userProfile?.role === 'Admin';
    };

    const isSuperAdmin = () => {
        return isSuperAdminProfile(userProfile);
    };

    // Cek apakah user adalah Staf
    const isStaf = () => {
        return userProfile?.role === 'Staf';
    };

    // Get division user
    const getUserDivision = () => {
        return getUserDivisionScope(userProfile) || 'Umum';
    };

    const canAccessUserDivision = (division) => canAccessDivision(division, userProfile);

    const getVisibleDivisions = (divisions = []) => getAccessibleDivisions(divisions, userProfile);

    const value = {
        userProfile,
        loading,
        isAdmin,
        isSuperAdmin,
        isStaf,
        getUserDivision,
        canAccessUserDivision,
        getVisibleDivisions,
    };

    return (
        <UserProfileContext.Provider value={value}>
            {!loading && children}
        </UserProfileContext.Provider>
    );
};

/*
  ============================================
  CARA PAKAI UserProfileContext:
  ============================================
  
  1. WRAP APP DI main.jsx (SETELAH AuthProvider):
     
     import { UserProfileProvider } from './contexts/UserProfileContext';
     
     <AuthProvider>
       <UserProfileProvider>
         <App />
       </UserProfileProvider>
     </AuthProvider>
  
  2. PAKAI DI KOMPONEN:
     
     import { useUserProfile } from '../contexts/UserProfileContext';
     
     const MyComponent = () => {
       const { userProfile, isAdmin, isStaf, getUserDivision } = useUserProfile();
       
       if (isAdmin()) {
         return <AdminView />;
       }
       
       if (isStaf()) {
         const division = getUserDivision();
         return <StafView division={division} />;
       }
     };
*/
