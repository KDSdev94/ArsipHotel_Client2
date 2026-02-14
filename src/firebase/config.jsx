import { initializeApp } from "firebase/app"; // Alat buat ngenalin app kita ke Firebase
import { getAuth } from "firebase/auth"; // Urusan login-loginan
import { getFirestore } from "firebase/firestore"; // Database utama kita (Firestore)
import { getDatabase } from "firebase/database"; // Realtime database (kalo butuh yang cepet banget)
import { getStorage } from "firebase/storage"; // Tempat naro file foto atau dokumen

// Ini "KTP" aplikasi kita buat lapor ke Firebase
const firebaseConfig = {
    apiKey: "AIzaSyCmmXFnG5SpeJGkeEhFRB6PPhOXZanXGqk",
    authDomain: "arsip-hotel.firebaseapp.com",
    databaseURL: "https://arsip-hotel-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "arsip-hotel",
    storageBucket: "arsip-hotel.firebasestorage.app",
    messagingSenderId: "354578994462",
    appId: "1:354578994462:web:b61e064dc1ca9eb0ae250f"
};

// Nyalain koneksi ke Firebase-nya
const app = initializeApp(firebaseConfig);

// Daftarin layanan apa aja yang mau kita pake biar gampang dipanggil di file lain
export const auth = getAuth(app); // Panggil 'auth' kalo mau ngecek siapa yang login
export const db = getFirestore(app); // Panggil 'db' buat ambil data arsip
export const rtdb = getDatabase(app); // Panggil 'rtdb' buat data yang live banget
export const storage = getStorage(app); // Panggil 'storage' buat upload/download file dokumen

export default app; // Ekspor app-nya sebagai pusat utamanya

