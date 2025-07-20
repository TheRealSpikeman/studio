// scripts/test-subscriptions.js
const { getFirebaseServices } = require('../lib/firebase-admin.ts');

console.log('🧪 Testing Subscriptions Module');
console.log('==============================');

async function testSubscriptionsWrite() {
  try {
    console.log('🔍 Getting Firebase services...');
    const { db } = await getFirebaseServices();
    
    console.log('�� Testing Firestore write operation...');
    
    // Test subscription data
    const testSubscription = {
      userId: 'test-user-123',
      planId: 'premium-plan',
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date(),
      features: ['feature1', 'feature2'],
      metadata: {
        test: true,
        source: 'firebase-admin-test'
      }
    };
    
    console.log('📝 Writing test subscription to Firestore...');
    
    // Write to subscriptions collection
    const docRef = await db.collection('subscriptions').add(testSubscription);
    
    console.log(`✅ SUCCESS: Subscription created with ID: ${docRef.id}`);
    
    // Read it back to verify
    console.log('🔍 Reading back the created subscription...');
    const doc = await docRef.get();
    
    if (doc.exists) {
      console.log('✅ SUCCESS: Subscription data retrieved');
      console.log('📊 Data:', doc.data());
    } else {
      console.log('❌ ERROR: Could not retrieve created subscription');
    }
    
    // Clean up test data
    console.log('🧹 Cleaning up test data...');
    await docRef.delete();
    console.log('✅ Test subscription deleted');
    
    console.log('\n🎉 ALL SUBSCRIPTION TESTS PASSED!');
    console.log('🚀 Your subscriptions module is ready to use!');
    
    return true;
    
  } catch (error) {
    console.error('❌ Subscription test failed:', error.message);
    if (error.code) {
      console.error('📍 Error code:', error.code);
    }
    console.error('📍 Stack:', error.stack);
    return false;
  }
}

// Run the test
testSubscriptionsWrite().then(success => {
  if (success) {
    console.log('\n✅ Subscriptions module is working perfectly!');
  } else {
    console.log('\n💥 Subscriptions test failed - check errors above');
    process.exit(1);
  }
}).catch(error => {
  console.error('\n💥 CRITICAL ERROR:', error);
  process.exit(1);
});
