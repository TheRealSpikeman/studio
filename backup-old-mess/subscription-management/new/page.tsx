// app/dashboard/admin/subscription-management/new/page.tsx
"use server";

import { SubscriptionPlanForm } from '@/components/admin/subscription-management/SubscriptionPlanForm';
import { getSubscriptionPlans } from '@/services/subscriptionService';
import { getAllFeatures } from '@/services/featureService';

export default async function NewSubscriptionPlanPage() {
  // Fetch data on the server
  const allSubscriptionPlans = await getSubscriptionPlans();
  const allAppFeatures = await getAllFeatures();

  // Pass data as props to the client component
  return (
    <SubscriptionPlanForm 
        isNew={true} 
        allSubscriptionPlans={allSubscriptionPlans}
        allAppFeatures={allAppFeatures}
    />
  );
}
