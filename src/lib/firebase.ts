
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics, isSupported } from 'firebase/analytics';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCYUzDQO0JBUJIHArtOxtZv9pk3idiKafY",
  authDomain: "socilet.firebaseapp.com",
  projectId: "socilet",
  storageBucket: "socilet.firebasestorage.app",
  messagingSenderId: "164599253893",
  appId: "1:164599253893:web:94f448445dfdc276f612ec",
  measurementId: "G-CVEXEM5MVZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Initialize Analytics conditionally (only in browser environments)
export const initializeAnalytics = async () => {
  try {
    if (await isSupported()) {
      return getAnalytics(app);
    }
    return null;
  } catch (error) {
    console.error('Firebase Analytics initialization error:', error);
    return null;
  }
};

export default app;
