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
// They will be null if the config is not provided.
let app: FirebaseApp;
let auth: Auth;
let db: Firestore;
let storage: FirebaseStorage;


// This pattern prevents re-initializing the app on hot reloads
if (getApps().length === 0) {
  if (isConfigured) {
    app = initializeApp(firebaseConfig);
  } else {
    console.error("🔥 FIREBASE CONFIGURATION MISSING OR INCOMPLETE! 🔥");
    console.error("Please check your .env file and ensure all NEXT_PUBLIC_FIREBASE_* variables are set correctly.");
    // Create a dummy app to prevent the app from crashing.
    // The UI will show a warning because isConfigured is false.
    app = initializeApp({ apiKey: "placeholder-to-prevent-crash", projectId: "placeholder" });
  }
} else {
  app = getApp();
}

auth = getAuth(app);
db = getFirestore(app);
storage = getStorage(app);

// Connect to emulators in development.
// This check must be outside of the initialization block to work with hot-reloading.
if (isConfigured && process.env.NODE_ENV === 'development') {
    try {
        console.log(`Firebase emulators connecting... NODE_ENV: ${process.env.NODE_ENV}`);
        
        console.log('Connecting to Auth emulator at http://localhost:9099');
        connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true });
        console.log('✅ Auth emulator connected.');
        
        console.log('Connecting to Firestore emulator at localhost:8080');
        connectFirestoreEmulator(db, 'localhost', 8080);
        console.log('✅ Firestore emulator connected.');
        
        console.log('Connecting to Storage emulator at localhost:9199');
        connectStorageEmulator(storage, 'localhost', 9199);
        console.log('✅ Storage emulator connected.');

    } catch(e) {
        console.warn('⚠️ Error connecting to Firebase emulators. This is expected if emulators are not running or if this is a production build.', e);
    }
}


export { app, auth, db, storage, isConfigured as isFirebaseConfigured };