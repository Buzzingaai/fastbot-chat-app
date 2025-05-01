import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, setDoc, collection, getDocs, query, orderBy } from 'firebase/firestore';

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

// Function to save user data to Firestore
export const saveUserData = async (user) => {
  try {
    const userRef = doc(db, 'users', user.uid);
    await setDoc(userRef, {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName || '',
      photoURL: user.photoURL || '',
      createdAt: user.metadata.creationTime,
      lastLogin: user.metadata.lastSignInTime,
    }, { merge: true });
    console.log('User data saved to Firestore');
  } catch (error) {
    console.error('Error saving user data:', error);
  }
};

// Function to fetch all users (for admin page)
export const getAllUsers = async () => {
  try {
    const usersCollection = collection(db, 'users');
    const q = query(usersCollection, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    const users = [];
    querySnapshot.forEach((doc) => {
      users.push(doc.data());
    });
    
    return users;
  } catch (error) {
    console.error('Error fetching users:', error);
    return [];
  }
}; 