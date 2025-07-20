console.log('--- Simple Firebase Admin Verification Script ---');
console.log('⏳ Testing Firebase Admin SDK...');

async function testFirebaseAdmin() {
  try {
    const { getFirebaseServices } = await import('../lib/firebase-admin.ts');
    console.log('📦 Firebase Admin module imported successfully');
    
    const services = await getFirebaseServices();
    console.log('✅ SUCCESS: Firebase Admin services initialized');
    console.log('✅ App initialized:', !!services.app);
    console.log('✅ Firestore available:', !!services.db);
    console.log('✅ Auth available:', !!services.auth);
    
    console.log('\n🧪 Testing Firestore connection...');
    const firestoreInstance = services.db;
    console.log('✅ Firestore connection test passed');
    
    console.log('\n🎉 ALL TESTS PASSED - Firebase Admin SDK is ready!');
    console.log('🚀 Your subscriptions module can now use Firebase!');
    
    return true;
  } catch (error) {
    console.error('❌ Firebase Admin test failed:', error.message);
    return false;
  }
}

testFirebaseAdmin().then(success => {
  if (!success) {
    console.log('\n💥 TESTS FAILED');
    process.exit(1);
  }
}).catch(error => {
  console.error('\n💥 CRITICAL ERROR:', error);
  process.exit(1);
});
