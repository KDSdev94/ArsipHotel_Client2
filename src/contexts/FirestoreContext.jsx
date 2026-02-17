// ============================================
// FILE: FirestoreContext.jsx
// FUNGSI: Context untuk kelola operasi Firestore
// FITUR: CRUD operations, Real-time listeners
// ============================================

import React, { createContext, useContext } from 'react';
import { db } from '../firebase/config';
import {
    collection,
    doc,
    getDoc,
    getDocs,
    addDoc,
    setDoc,
    updateDoc,
    deleteDoc,
    onSnapshot,
    query,
    where,
    orderBy,
    limit,
    serverTimestamp
} from 'firebase/firestore';

// ============================================
// BUAT CONTEXT
// ============================================
const FirestoreContext = createContext();

// ============================================
// CUSTOM HOOK - useFirestore
// ============================================
// eslint-disable-next-line react-refresh/only-export-components
export const useFirestore = () => {
    const context = useContext(FirestoreContext);
    if (!context) {
        throw new Error('useFirestore harus dipanggil di dalam FirestoreProvider');
    }
    return context;
};

// ============================================
// FIRESTORE PROVIDER COMPONENT
// ============================================
export const FirestoreProvider = ({ children }) => {

    // ============================================
    // CREATE - Tambah dokumen baru
    // ============================================
    const addDocument = async (collectionName, data) => {
        try {
            // addDoc = ID otomatis dari Firebase
            const docRef = await addDoc(collection(db, collectionName), {
                ...data,
                createdAt: serverTimestamp(), // Timestamp otomatis dari server
                updatedAt: serverTimestamp()
            });

            return { success: true, id: docRef.id };
        } catch (error) {
            console.error('Error adding document:', error);
            return { success: false, error: error.message };
        }
    };

    // ============================================
    // CREATE - Tambah dokumen dengan ID custom
    // ============================================
    const setDocument = async (collectionName, docId, data) => {
        try {
            // setDoc = ID custom yang kita tentukan
            await setDoc(doc(db, collectionName, docId), {
                ...data,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp()
            });

            return { success: true, id: docId };
        } catch (error) {
            console.error('Error setting document:', error);
            return { success: false, error: error.message };
        }
    };

    // ============================================
    // READ - Ambil 1 dokumen berdasarkan ID
    // ============================================
    const getDocument = async (collectionName, docId) => {
        try {
            const docRef = doc(db, collectionName, docId);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                return {
                    success: true,
                    data: { id: docSnap.id, ...docSnap.data() }
                };
            } else {
                return { success: false, error: 'Dokumen tidak ditemukan' };
            }
        } catch (error) {
            console.error('Error getting document:', error);
            return { success: false, error: error.message };
        }
    };

    // ============================================
    // READ - Ambil semua dokumen dari collection
    // ============================================
    const getDocuments = async (collectionName, queryConstraints = []) => {
        try {
            const colRef = collection(db, collectionName);

            // Kalau ada query (filter, order, limit), pakai query()
            // Kalau gak ada, ambil semua
            const q = queryConstraints.length > 0
                ? query(colRef, ...queryConstraints)
                : colRef;

            const snapshot = await getDocs(q);

            const documents = [];
            snapshot.forEach((doc) => {
                documents.push({ id: doc.id, ...doc.data() });
            });

            return { success: true, data: documents };
        } catch (error) {
            console.error('Error getting documents:', error);
            return { success: false, error: error.message };
        }
    };

    // ============================================
    // READ - Real-time listener (auto-update)
    // ============================================
    const subscribeToCollection = (collectionName, callback, queryConstraints = []) => {
        try {
            const colRef = collection(db, collectionName);
            const q = queryConstraints.length > 0
                ? query(colRef, ...queryConstraints)
                : colRef;

            // onSnapshot = Listener real-time
            // Setiap ada perubahan data, callback jalan otomatis
            const unsubscribe = onSnapshot(q, (snapshot) => {
                const documents = [];
                snapshot.forEach((doc) => {
                    documents.push({ id: doc.id, ...doc.data() });
                });
                callback(documents); // Kirim data ke callback
            }, (error) => {
                console.error('Error in snapshot listener:', error);
                callback(null, error.message);
            });

            // Return unsubscribe function buat matiin listener
            return unsubscribe;
        } catch (error) {
            console.error('Error subscribing to collection:', error);
            return null;
        }
    };

    // ============================================
    // UPDATE - Update dokumen yang sudah ada
    // ============================================
    const updateDocument = async (collectionName, docId, data) => {
        try {
            const docRef = doc(db, collectionName, docId);

            // updateDoc cuma update field yang dikasih
            // Field lain gak berubah
            await updateDoc(docRef, {
                ...data,
                updatedAt: serverTimestamp() // Update timestamp
            });

            return { success: true };
        } catch (error) {
            console.error('Error updating document:', error);
            return { success: false, error: error.message };
        }
    };

    // ============================================
    // DELETE - Hapus dokumen
    // ============================================
    const deleteDocument = async (collectionName, docId) => {
        try {
            await deleteDoc(doc(db, collectionName, docId));
            return { success: true };
        } catch (error) {
            console.error('Error deleting document:', error);
            return { success: false, error: error.message };
        }
    };

    // ============================================
    // DELETE - Hapus dokumen berdasarkan Supabase ID (Sync logic)
    // ============================================
    const deleteDocumentBySupabaseId = async (collectionName, supabaseId) => {
        try {
            const colRef = collection(db, collectionName);
            const q = query(colRef, where('supabaseId', '==', supabaseId));
            const snapshot = await getDocs(q);

            if (snapshot.empty) {
                console.warn(`No document found in Firestore with supabaseId: ${supabaseId}`);
                return { success: true }; // Consider it success if already gone
            }

            // Hapus semua baris yang cocok (biasanya cuma 1)
            const deletePromises = snapshot.docs.map(doc => deleteDoc(doc.ref));
            await Promise.all(deletePromises);

            return { success: true };
        } catch (error) {
            console.error('Error deleting document by supabaseId:', error);
            return { success: false, error: error.message };
        }
    };

    // ============================================
    // LOGGING - Catat aktivitas ke Firestore
    // ============================================
    const logActivity = async (activityData) => {
        try {
            // activityData: { user, email, action, documentName, status, type }
            await addDoc(collection(db, 'activities'), {
                ...activityData,
                timestamp: serverTimestamp()
            });
            return { success: true };
        } catch (error) {
            console.error('Error logging activity:', error);
            return { success: false };
        }
    };

    // ============================================
    // QUERY HELPERS - Fungsi bantuan buat query
    // ============================================

    // Filter berdasarkan field
    const whereQuery = (field, operator, value) => where(field, operator, value);

    // Urutkan data
    const orderByQuery = (field, direction = 'asc') => orderBy(field, direction);

    // Batasi jumlah data
    const limitQuery = (count) => limit(count);

    // ============================================
    // VALUE YANG DIBAGIKAN KE SELURUH APP
    // ============================================
    const value = {
        // CRUD Operations
        addDocument,
        setDocument,
        getDocument,
        getDocuments,
        updateDocument,
        deleteDocument,
        deleteDocumentBySupabaseId,
        logActivity,

        // Real-time
        subscribeToCollection,

        // Query Helpers
        whereQuery,
        orderByQuery,
        limitQuery,

        // Timestamp
        serverTimestamp,
    };

    return (
        <FirestoreContext.Provider value={value}>
            {children}
        </FirestoreContext.Provider>
    );
};

/*
  ============================================
  CARA PAKAI FirestoreContext:
  ============================================
  
  1. WRAP APP DI main.jsx:
     
     import { FirestoreProvider } from './contexts/FirestoreContext';
     
     <FirestoreProvider>
       <App />
     </FirestoreProvider>
  
  2. PAKAI DI KOMPONEN:
     
     import { useFirestore } from '../contexts/FirestoreContext';
     
     const Users = () => {
       const { getDocuments, subscribeToCollection } = useFirestore();
       const [users, setUsers] = useState([]);
       
       // Ambil data sekali
       const fetchUsers = async () => {
         const result = await getDocuments('users');
         if (result.success) {
           setUsers(result.data);
         }
       };
       
       // Real-time listener
       useEffect(() => {
         const unsubscribe = subscribeToCollection('users', (data) => {
           setUsers(data);
         });
         return () => unsubscribe();
       }, []);
     };
  
  ============================================
  CONTOH PENGGUNAAN LENGKAP:
  ============================================
  
  // 1. TAMBAH DATA
  const { addDocument } = useFirestore();
  await addDocument('divisions', {
    name: 'Finance',
    description: 'Divisi keuangan'
  });
  
  // 2. AMBIL DATA DENGAN FILTER
  const { getDocuments, whereQuery, orderByQuery } = useFirestore();
  const result = await getDocuments('users', [
    whereQuery('role', '==', 'Admin'),
    orderByQuery('createdAt', 'desc')
  ]);
  
  // 3. UPDATE DATA
  const { updateDocument } = useFirestore();
  await updateDocument('users', userId, {
    name: 'Nama Baru'
  });
  
  // 4. HAPUS DATA
  const { deleteDocument } = useFirestore();
  await deleteDocument('users', userId);
  
  // 5. REAL-TIME LISTENER
  const { subscribeToCollection } = useFirestore();
  useEffect(() => {
    const unsubscribe = subscribeToCollection('divisions', (data) => {
      setDivisions(data);
    });
    return () => unsubscribe();
  }, []);
  
  ============================================
  KEUNTUNGAN PAKAI CONTEXT:
  ============================================
  
  1. Gak perlu import Firestore functions di setiap file
  2. Consistent error handling
  3. Automatic timestamp (createdAt, updatedAt)
  4. Mudah testing dan debugging
  5. Bisa tambah custom logic (logging, analytics, dll)
*/
