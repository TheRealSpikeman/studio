// app/dashboard/admin/subscription-management/new/page.tsx
"use server";

import { SubscriptionPlanForm } from '@/components/admin/subscription-management/SubscriptionPlanForm';
import { getSubscriptionPlans } from '@/services/subscriptionService';
import { getAllFeatures } from '@/services/featureService';

export default async function NewSubscriptionPlanPage() {
  const allSubscriptionPlans = await getSubscriptionPlans();
  const allAppFeatures = await getAllFeatures();

  return (
    <SubscriptionPlanForm 
        isNew={true} 
        allSubscriptionPlans={allSubscriptionPlans}
        allAppFeatures={allAppFeatures}
    />
  );
}
