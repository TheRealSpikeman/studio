// lib/firebase-verification.ts
import { adminDb, adminAuth, adminStorage, isFirebaseConfigured } from './firebase-admin';
import type { FirebaseServicesStatus } from './types/firebase';

/**
 * Performs a series of checks to verify that all core Firebase Admin services are operational.
 * This function is crucial for health checks and diagnostics.
 * @returns {Promise<FirebaseServicesStatus>} An object detailing the status of each service.
 */
export async function verifyFirebaseServices(): Promise<FirebaseServicesStatus> {
  const status: FirebaseServicesStatus = {
    firestore: { ok: false, message: 'Not checked' },
    auth: { ok: false, message: 'Not checked' },
    storage: { ok: false, message: 'Not checked' },
  };

  if (!isFirebaseConfigured) {
    const unconfiguredMessage = 'Firebase not configured. Check credentials and server logs.';
    status.firestore = { ok: false, message: unconfiguredMessage };
    status.auth = { ok: false, message: unconfiguredMessage };
    status.storage = { ok: false, message: unconfiguredMessage };
    return status;
  }

  // 1. Test Firestore
  try {
    await adminDb.doc('test/connection-check').get();
    status.firestore = { ok: true, message: 'Firestore connection successful.' };
  } catch (error: any) {
    status.firestore = { ok: false, message: `Firestore connection failed: ${error.message}` };
  }

  // 2. Test Auth
  try {
    await adminAuth.listUsers(1);
    status.auth = { ok: true, message: 'Auth service connection successful.' };
  } catch (error: any) {
    status.auth = { ok: false, message: `Auth service connection failed: ${error.message}` };
  }

  // 3. Test Storage
  try {
    await adminStorage.bucket().getFiles({ maxResults: 1 });
    status.storage = { ok: true, message: 'Storage service connection successful.' };
  } catch (error: any) {
    // Gracefully handle cases where the default bucket might not exist yet
    if (error.code === 404) {
       status.storage = { ok: true, message: 'Storage bucket not found, but service is reachable.' };
    } else {
       status.storage = { ok: false, message: `Storage service connection failed: ${error.message}` };
    }
  }

  console.log('🔬 Firebase Service Verification Complete:', status);
  return status;
}
