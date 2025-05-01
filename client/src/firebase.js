import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  // Replace these with your Firebase configuration
  apiKey: "AIzaSyA5GE4eYu0n_BHdFR-w_m_ImPJvTrHK7CQ",
  authDomain: "fir-auth-starter-sfuse.firebaseapp.com",
  projectId: "firebase-auth-starter-sfuse",
  storageBucket: "firebase-auth-starter-sfuse.firebasestorage.app",
  messagingSenderId: "308175208605",
  appId: "1:308175208605:web:a34ef35eb006cdada75474"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app); 