import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyCmmXFnG5SpeJGkeEhFRB6PPhOXZanXGqk",
    authDomain: "arsip-hotel.firebaseapp.com",
    databaseURL: "https://arsip-hotel-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "arsip-hotel",
    storageBucket: "arsip-hotel.firebasestorage.app",
    messagingSenderId: "354578994462",
    appId: "1:354578994462:web:b61e064dc1ca9eb0ae250f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const rtdb = getDatabase(app);
export const storage = getStorage(app);

export default app;
