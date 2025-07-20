// app/test-firebase/page.tsx
import { getSubscriptionPlans } from '../../services/subscriptionService';

export default async function TestFirebasePage() {
  let result;
  let error = null;
  
  try {
    console.log('🔍 Testing subscription service...');
    const plans = await getSubscriptionPlans();
    
    result = {
      success: true,
      message: '✅ ROOT SUBSCRIPTION SERVICE IS WORKING!',
      plansCount: plans.length,
      plans: plans.map(p => ({ 
        id: p.id, 
        name: p.name, 
        price: p.price,
        features: p.features?.slice(0, 3) // Show first 3 features
      }))
    };
    
    console.log('🎉 SUCCESS:', result);
    
  } catch (err: any) {
    error = err.message;
    result = {
      success: false,
      error: err.message,
      stack: err.stack
    };
    console.error('❌ Test failed:', err);
  }
  
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">🧪 Firebase Subscription Service Test</h1>
      
      {result?.success ? (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-green-800 mb-4">
            🎉 SUCCESS: Subscription Service is Working!
          </h2>
          <div className="space-y-2">
            <p><strong>Plans Retrieved:</strong> {result.plansCount}</p>
            <div className="mt-4">
              <h3 className="font-medium text-green-700 mb-2">📊 Subscription Plans:</h3>
              <div className="space-y-2">
                {result.plans.map((plan: any, index: number) => (
                  <div key={index} className="bg-white p-3 rounded border">
                    <div className="font-medium">{plan.name}</div>
                    <div className="text-sm text-gray-600">
                      ID: {plan.id} | Price: €{plan.price}
                    </div>
                    {plan.features && (
                      <div className="text-xs text-gray-500 mt-1">
                        Features: {plan.features.join(', ')}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-6 p-4 bg-green-100 rounded">
            <p className="font-medium text-green-800">✅ Your original Firebase problem is SOLVED!</p>
            <p className="text-green-700">🚀 Subscription functionality is now working perfectly!</p>
          </div>
        </div>
      ) : (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-red-800 mb-4">
            ❌ Test Failed
          </h2>
          <div className="space-y-2">
            <p><strong>Error:</strong> {error}</p>
            <details className="mt-4">
              <summary className="cursor-pointer font-medium text-red-700">
                Show Stack Trace
              </summary>
              <pre className="mt-2 text-xs bg-red-100 p-2 rounded overflow-auto">
                {result?.stack}
              </pre>
            </details>
          </div>
        </div>
      )}
      
      <div className="mt-8 p-4 bg-gray-50 rounded">
        <h3 className="font-medium mb-2">🔍 Test Details:</h3>
        <ul className="text-sm space-y-1">
          <li>• Testing: <code>getSubscriptionPlans()</code> function</li>
          <li>• Service: <code>services/subscriptionService.ts</code></li>
          <li>• Firebase: Admin SDK via <code>lib/firebase-helpers.ts</code></li>
          <li>• Expected: Retrieval of subscription plans from Firestore</li>
        </ul>
      </div>
    </div>
  );
}
