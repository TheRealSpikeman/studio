// app/dashboard/admin/subscription-management/edit/[planId]/page.tsx
"use server"; 
import { notFound } from 'next/navigation';
import { SubscriptionPlanForm } from '@/components/admin/subscription-management/SubscriptionPlanForm';
import { getSubscriptionPlanById, getSubscriptionPlans } from '@/services/subscriptionService';
import { getAllFeatures } from '@/services/featureService';

interface EditSubscriptionPlanPageProps {
  params: Promise<{
    planId: string;
  }>;
}

export default async function EditSubscriptionPlanPage({ params }: EditSubscriptionPlanPageProps) {
  // Next.js 15: Await params before using
  const { planId } = await params;
  
  try {
    // Data wordt nu op de server opgehaald en doorgegeven als props
    const [planData, allSubscriptionPlans, allFeatures] = await Promise.all([
      getSubscriptionPlanById(planId),
      getSubscriptionPlans(),
      getAllFeatures()
    ]);

    if (!planData) {
      notFound();
    }

    return (
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Edit Subscription Plan</h1>
        
        <SubscriptionPlanForm
          initialData={planData}
          isNew={false}
          allSubscriptionPlans={allSubscriptionPlans || []}
          allAppFeatures={allFeatures || []}
        />
      </div>
    );
  } catch (error) {
    console.error('Error loading subscription plan data:', error);
    notFound();
  }
}
