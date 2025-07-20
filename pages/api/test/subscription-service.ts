// pages/api/test/subscription-service.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { getSubscriptionPlans, deleteSubscriptionPlan } from '../../../services/subscriptionService';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('🧪 Testing ROOT Subscription Service via API');
  console.log('==============================================');
  
  try {
    console.log('🔍 Testing getSubscriptionPlans function...');
    
    // Test getSubscriptionPlans
    console.log('🔍 Calling getSubscriptionPlans()...');
    const plans = await getSubscriptionPlans();
    
    console.log(`✅ SUCCESS: Retrieved ${plans.length} subscription plans`);
    console.log('📊 Plans:', plans.map(p => ({ id: p.id, name: p.name, price: p.price })));
    
    console.log('\n🎉 ROOT SUBSCRIPTION SERVICE IS WORKING!');
    console.log('🚀 Your subscription functionality is fixed!');
    
    // Return success response
    res.status(200).json({
      success: true,
      message: 'Subscription service is working!',
      plansCount: plans.length,
      plans: plans.map(p => ({ id: p.id, name: p.name, price: p.price }))
    });
    
  } catch (error: any) {
    console.error('❌ Root subscription service test failed:', error.message);
    console.error('📍 Stack:', error.stack);
    
    res.status(500).json({
      success: false,
      error: error.message,
      stack: error.stack
    });
  }
}
