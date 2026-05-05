import { initializeApp, getApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'demo-key',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'demo.firebaseapp.com',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'demo-project',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'demo-project.appspot.com',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '0',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || 'demo-app',
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

let app;
let auth: Auth;
let db: Firestore;
let storage: FirebaseStorage;
let isInitialized = false;

const initializeFirebase = () => {
  if (isInitialized) return;

  try {
    // Check if already initialized
    try {
      app = getApp();
    } catch {
      app = initializeApp(firebaseConfig);
    }

    auth = getAuth(app);
    db = getFirestore(app);
    storage = getStorage(app);
    isInitialized = true;

    // Use emulators in development if available
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
      const isDemoMode = !process.env.NEXT_PUBLIC_FIREBASE_API_KEY;

      if (isDemoMode) {
        console.log('[Firebase] Running in demo mode. Set environment variables for production.');
      }
    }
  } catch (error) {
    console.error('Firebase initialization error:', error);
    if (process.env.NODE_ENV === 'production') {
      throw new Error('Failed to initialize Firebase. Please check your configuration.');
    }
  }
};

// Initialize Firebase
initializeFirebase();

export { auth, db, storage, app, isInitialized };
