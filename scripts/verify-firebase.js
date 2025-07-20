// scripts/verify-firebase.js
const { firebaseAdmin } = require('../lib/firebase-admin');

console.log('--- Firebase Admin Verification Script ---');

async function main() {
  console.log('⏳ Awaiting Firebase Admin initialization...');
  
  try {
    const instance = await firebaseAdmin;

    if (!instance.isInitialized) {
      console.error('❌ FATAL: Firebase Admin SDK failed to initialize. Check previous logs.');
      process.exit(1);
    }
    
    console.log('✅ Firebase Admin SDK initialized.');

    const { db, auth, storage } = instance;
    let allChecksPassed = true;

    // 1. Firestore Check
    try {
      await db.doc('verification/script-check').get();
      console.log('✅ Firestore: Connection successful.');
    } catch (error) {
      console.error('❌ Firestore: Connection FAILED.', error.message);
      allChecksPassed = false;
    }

    // 2. Auth Check
    try {
      await auth.listUsers(1);
      console.log('✅ Auth: Service is reachable.');
    } catch (error) {
      console.error('❌ Auth: Service FAILED.', error.message);
      allChecksPassed = false;
    }

    // 3. Storage Check
    try {
      await storage.bucket().getFiles({ maxResults: 1 });
      console.log('✅ Storage: Service is reachable.');
    } catch (error) {
      if (error.code === 404) {
        console.log('⚠️  Storage: Default bucket not found, but service is authenticated.');
      } else {
        console.error('❌ Storage: Service FAILED.', error.message);
        allChecksPassed = false;
      }
    }
    
    // Final Verdict
    if (allChecksPassed) {
      console.log('');
      console.log('--- ✅ SUCCESS: All Firebase Admin services are correctly configured and reachable. ---');
      process.exit(0);
    } else {
      console.log('');
      console.error('--- ❌ FAILURE: One or more Firebase services failed the verification check. ---');
      process.exit(1);
    }

  } catch (error) {
    console.error('❌ An unexpected error occurred during the verification process:', error);
    process.exit(1);
  }
}

main();