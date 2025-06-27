// src/lib/firebase.ts
import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { 
  getFirestore, 
  type Firestore, 
} from "firebase/firestore";
import { getStorage, type FirebaseStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// This check is the definitive way to see if the environment is set up.
const isConfigured = !!firebaseConfig.apiKey && !!firebaseConfig.projectId && !firebaseConfig.apiKey.includes("REPLACE_WITH");

// Explicitly type the variables to allow for null.
let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;
let storage: FirebaseStorage | null = null;

// Initialize Firebase only if it's configured
if (isConfigured) {
  if (getApps().length === 0) {
      app = initializeApp(firebaseConfig);
  } else {
    app = getApp();
  }

  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);
} else {
   // Use console.warn instead of console.error to avoid a browser crash overlay.
   console.warn("Firebase config is NOT SET correctly in .env file. Firebase services will be unavailable. Please check your NEXT_PUBLIC_FIREBASE_* variables.");
}


export { app, auth, db, storage, isConfigured as isFirebaseConfigured };
