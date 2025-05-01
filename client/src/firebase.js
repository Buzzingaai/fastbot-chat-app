import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Replace with your actual Firebase configuration from Firebase Console
const firebaseConfig = {
  apiKey: "AIzaSyA5GE4eYu0n_BHdFR-w_m_ImPJvTrHK7CQ",
  authDomain: "fir-auth-starter-sfuse.firebaseapp.com",
  projectId: "firebase-auth-starter-sfuse",
  storageBucket: "firebase-auth-starter-sfuse.firebasestorage.app",
  messagingSenderId: "308175208605",
  appId: "1:308175208605:web:a34ef35eb006cdada75474"
};

console.log("Initializing Firebase with config:", firebaseConfig);

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app); 