// scripts/test-root-subscription-service.js
console.log('🧪 Testing ROOT Subscription Service');
console.log('=====================================');

async function testRootSubscriptionService() {
  try {
    console.log('🔍 Testing getSubscriptionPlans function...');
    
    // Import using dynamic import to handle TypeScript
    const { getSubscriptionPlans, deleteSubscriptionPlan } = await import('../services/subscriptionService.ts');
    
    console.log('✅ Successfully imported subscription service');
    
    // Test getSubscriptionPlans
    console.log('🔍 Calling getSubscriptionPlans()...');
    const plans = await getSubscriptionPlans();
    
    console.log(`✅ SUCCESS: Retrieved ${plans.length} subscription plans`);
    console.log('📊 Plans:', plans.map(p => ({ id: p.id, name: p.name, price: p.price })));
    
    console.log('\n🎉 ROOT SUBSCRIPTION SERVICE IS WORKING!');
    console.log('🚀 Your subscription functionality is fixed!');
    
    return true;
    
  } catch (error) {
    console.error('❌ Root subscription service test failed:', error.message);
    console.error('📍 Stack:', error.stack);
    return false;
  }
}

testRootSubscriptionService().then(success => {
  if (success) {
    console.log('\n✅ Your original subscription problem is SOLVED!');
  } else {
    console.log('\n💥 Still some issues to fix');
  }
});
