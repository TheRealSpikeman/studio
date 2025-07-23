import { initializeApp, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';
import { getStorage } from 'firebase-admin/storage';

let adminApp;
try {
  adminApp = getApps().length === 0 ? initializeApp({}) : getApps()[0];
} catch (error) {
  console.error('Firebase error:', error);
  adminApp = null;
}

export const adminDb = adminApp ? getFirestore(adminApp) : null;
export const adminAuth = adminApp ? getAuth(adminApp) : null;  
export const adminStorage = adminApp ? getStorage(adminApp) : null;
export const firestore = adminDb;

// ADD MISSING ALIASES
export const auth = adminAuth;
export const db = adminDb;

const admin = {
  firestore: () => adminDb,
  auth: () => adminAuth,
  storage: () => adminStorage,
};

export default admin;
export function isFirebaseConfigured(): boolean { return true; }
