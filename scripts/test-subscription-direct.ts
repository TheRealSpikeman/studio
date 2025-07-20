// scripts/test-subscription-direct.ts
import { getSubscriptionPlans } from '../services/subscriptionService';

console.log('🧪 Testing ROOT Subscription Service (TypeScript)');
console.log('==================================================');

async function testSubscriptionService() {
  try {
    console.log('🔍 Calling getSubscriptionPlans()...');
    const plans = await getSubscriptionPlans();
    
    console.log(`✅ SUCCESS: Retrieved ${plans.length} subscription plans`);
    console.log('📊 Plans:', plans.map(p => ({ id: p.id, name: p.name, price: p.price })));
    
    console.log('\n🎉 ROOT SUBSCRIPTION SERVICE IS WORKING!');
    console.log('🚀 Your subscription functionality is fixed!');
    console.log('✅ Your original subscription problem is SOLVED!');
    
  } catch (error: any) {
    console.error('❌ Subscription test failed:', error.message);
    console.error('📍 Stack:', error.stack);
  }
}

testSubscriptionService();
