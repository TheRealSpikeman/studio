// lib/firebase-helpers.ts
// Helper functions for Firebase Admin SDK access

import { getFirebaseServices as getServices } from './firebase-admin';

// Re-export the main function for compatibility
export const getFirebaseServices = getServices;

// Additional helper functions can be added here
export async function getFirestore() {
  try {
    const { db } = await getFirebaseServices();
    return db;
  } catch (error) {
    console.error('Error getting Firestore:', error);
    throw error;
  }
}

export async function getAuth() {
  try {
    const { auth } = await getFirebaseServices();
    return auth;
  } catch (error) {
    console.error('Error getting Auth:', error);
    throw error;
  }
}

export async function getApp() {
  try {
    const { app } = await getFirebaseServices();
    return app;
  } catch (error) {
    console.error('Error getting App:', error);
    throw error;
  }
}

// Export a simple initialization check
export async function isFirebaseInitialized() {
  try {
    await getFirebaseServices();
    return true;
  } catch (error) {
    console.error('Firebase not initialized:', error);
    return false;
  }
}
