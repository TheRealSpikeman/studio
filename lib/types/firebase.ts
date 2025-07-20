// lib/types/firebase.ts

import type * as admin from 'firebase-admin';

/**
 * Defines the strict type for the Firebase Admin SDK credentials.
 */
export interface FirebaseAdminCredentials {
  projectId: string;
  clientEmail: string;
  privateKey: string;
}

/**
 * Defines the complete configuration object.
 */
export interface FirebaseAdminConfig extends FirebaseAdminCredentials {
  databaseURL: string;
  storageBucket: string;
}

/**
 * Defines the structure for the singleton instance stored on the global object.
 */
interface FirebaseAdminSingleton {
  db: admin.firestore.Firestore;
  auth: admin.auth.Auth;
  storage: admin.storage.Storage;
  isInitialized: boolean;
}

/**
 * Defines the structure for the verification result of Firebase services.
 */
export interface FirebaseServicesStatus {
  firestore: { ok: boolean; message: string; };
  auth: { ok: boolean; message: string; };
  storage: { ok: boolean; message: string; };
}

// This declaration merges our custom property with the existing globalThis type.
// It tells TypeScript that our global singleton is expected to exist.
declare global {
  var firebaseAdminInstance: FirebaseAdminSingleton | undefined;
}
