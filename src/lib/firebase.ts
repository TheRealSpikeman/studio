// src/lib/firebase.ts
import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { 
  getFirestore, 
  type Firestore, 
} from "firebase/firestore";
import { getStorage, type FirebaseStorage } from "firebase/storage";

// --- DIAGNOSTIC STEP ---
// This config is temporarily hardcoded with placeholders.
// You MUST replace the placeholder values with your actual Firebase project
// configuration from the Firebase Console to test the connection.
const firebaseConfig = {
  apiKey: "PLACEHOLDER_REPLACE_WITH_YOUR_API_KEY",
  authDomain: "PLACEHOLDER_REPLACE_WITH_YOUR_AUTH_DOMAIN",
  projectId: "PLACEHOLDER_REPLACE_WITH_YOUR_PROJECT_ID",
  storageBucket: "PLACEHOLDER_REPLACE_WITH_YOUR_STORAGE_BUCKET",
  messagingSenderId: "PLACEHOLDER_REPLACE_WITH_YOUR_MESSAGING_SENDER_ID",
  appId: "PLACEHOLDER_REPLACE_WITH_YOUR_APP_ID",
  measurementId: "PLACEHOLDER_REPLACE_WITH_YOUR_MEASUREMENT_ID",
};

// This check is now based on the hardcoded placeholders.
// Once you fill them in, isConfigured will become true.
const isConfigured = !!firebaseConfig.apiKey && !firebaseConfig.apiKey.includes("PLACEHOLDER");

if (!isConfigured) {
  console.error("🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥");
  console.error("🔥 Firebase config in /src/lib/firebase.ts is NOT SET!");
  console.error("🔥 Please replace the placeholder values with your actual project config.");
  console.error("🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥");
}

let app: FirebaseApp;
let auth: Auth;
let db: Firestore;
let storage: FirebaseStorage;

if (getApps().length === 0) {
    app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

auth = getAuth(app);
db = getFirestore(app);
storage = getStorage(app);

export { app, auth, db, storage, isConfigured as isFirebaseConfigured };
