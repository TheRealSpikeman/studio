// scripts/clear-subscription-data.js
const { getFirebaseServices } = require('../lib/firebase-admin.ts');

async function clearSubscriptionData() {
  try {
    const { db } = await getFirebaseServices();
    console.log('🗑️ Clearing old subscription data...');
    
    // Delete all subscription plans
    const snapshot = await db.collection('subscriptionPlans').get();
    console.log(`Found ${snapshot.size} subscription plans to delete`);
    
    const batch = db.batch();
    snapshot.docs.forEach(doc => {
      batch.delete(doc.ref);
    });
    
    await batch.commit();
    console.log('✅ All old subscription data cleared!');
    console.log('🎯 Ready for fresh, simple data!');
    
  } catch (error) {
    console.error('Error clearing data:', error);
  }
}

clearSubscriptionData();
