
// src/lib/firebase.ts
import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAuth, connectAuthEmulator, type Auth } from "firebase/auth";
import { 
  getFirestore, 
  connectFirestoreEmulator,
  type Firestore, 
} from "firebase/firestore";
import { getStorage, connectStorageEmulator, type FirebaseStorage } from "firebase/storage";

// Your web app's Firebase configuration from .env.local
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// A function to check if the config is valid
export const isFirebaseConfigured = !!firebaseConfig.apiKey && !firebaseConfig.apiKey.includes("...");

// Initialize Firebase services and export them.
// They will be null if the config is not provided.
let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;
let storage: FirebaseStorage | null = null;

if (isFirebaseConfigured) {
  app = getApps().length ? getApp() : initializeApp(firebaseConfig);
  auth = getAuth(app);
  storage = getStorage(app);
  // Simplified Firestore initialization for better server/client compatibility
  db = getFirestore(app);

  // Connect to emulators in development
  if (process.env.NODE_ENV === 'development') {
    try {
        console.log("Connecting to Firebase emulators on localhost...");
        connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true });
        if (db) {
          connectFirestoreEmulator(db, 'localhost', 8080);
        }
        if (storage) {
          connectStorageEmulator(storage, 'localhost', 9199);
        }
    } catch(e) {
        console.warn('Error connecting to Firebase emulators. This is expected if emulators are not running.');
    }
  }

}

export { app, auth, db, storage };
