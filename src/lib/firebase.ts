// src/lib/firebase.ts
import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { 
  getFirestore, 
  type Firestore, 
} from "firebase/firestore";
import { getStorage, type FirebaseStorage } from "firebase/storage";

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

// Check if the essential config values are present and not placeholders
const isConfigured = !!firebaseConfig.apiKey && !firebaseConfig.apiKey.includes("...");

// Initialize Firebase services and export them.
let app: FirebaseApp;
let auth: Auth;
let db: Firestore;
let storage: FirebaseStorage;

if (getApps().length === 0) {
  if (isConfigured) {
    app = initializeApp(firebaseConfig);
  } else {
    console.error("🔥 FIREBASE CONFIGURATION MISSING OR INCOMPLETE! 🔥");
    console.error("Please check your .env file and ensure all NEXT_PUBLIC_FIREBASE_* variables are set correctly.");
    // Initialize with a placeholder to prevent app crash, but functionality will be disabled.
    app = initializeApp({ apiKey: "placeholder-to-prevent-crash", projectId: "placeholder" });
  }
} else {
  app = getApp();
}

auth = getAuth(app);
db = getFirestore(app);
storage = getStorage(app);

// Emulator connection logic has been REMOVED as per your instruction to solve network issues.
// The app will now connect to the live Firebase backend defined in the .env file.

export { app, auth, db, storage, isConfigured as isFirebaseConfigured };
