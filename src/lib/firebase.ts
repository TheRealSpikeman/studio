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
    app = initializeApp({ apiKey: "placeholder-to-prevent-crash", projectId: "placeholder" });
  }
} else {
  app = getApp();
}

auth = getAuth(app);
db = getFirestore(app);
storage = getStorage(app);

// Connect to emulators in development, ONLY ON THE CLIENT SIDE.
if (isConfigured && process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
    // The private property _isEmulator is a reliable way to check this.
    // We only connect if it hasn't been connected before to avoid errors on hot-reloads.
    if (!(auth as any)._isEmulator) {
        try {
            console.log(`Firebase emulators connecting to localhost...`);
            
            // Standardize on 'localhost'. This is the most common and robust setup for local/containerized dev.
            connectAuthEmulator(auth, `http://localhost:9099`, { disableWarnings: true });
            console.log('✅ Auth emulator connected.');
            
            connectFirestoreEmulator(db, 'localhost', 8080);
            console.log('✅ Firestore emulator connected.');
            
            connectStorageEmulator(storage, 'localhost', 9199);
            console.log('✅ Storage emulator connected.');

        } catch(e) {
            console.warn('⚠️ Error connecting to Firebase emulators. This can happen on hot reloads. If services work, this is likely safe to ignore.', e);
        }
    }
}

export { app, auth, db, storage, isConfigured as isFirebaseConfigured };
