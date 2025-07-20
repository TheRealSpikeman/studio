// app/dashboard/admin/subscription-management/edit/[planId]/page.tsx
"use server"; 

import { notFound } from 'next/navigation';
import { SubscriptionPlanForm } from '@/components/admin/subscription-management/SubscriptionPlanForm';
import { getSubscriptionPlanById, getSubscriptionPlans } from '@/services/subscriptionService';
import { getAllFeatures } from '@/services/featureService';

interface EditSubscriptionPlanPageProps {
  params: {
    planId: string;
  };
}

export default async function EditSubscriptionPlanPage({ params }: EditSubscriptionPlanPageProps) {
  const { planId } = params;
  
  // Data wordt nu op de server opgehaald en doorgegeven als props
  const planData = await getSubscriptionPlanById(planId);
  const allSubscriptionPlans = await getSubscriptionPlans();
  const allAppFeatures = await getAllFeatures();

  // Als het plan niet wordt gevonden, toon een 404-pagina.
  if (!planData) {
    notFound();
  }
  
  // Het client component `SubscriptionPlanForm` wordt gerenderd met de data als prop.
  return (
    <SubscriptionPlanForm 
      initialData={planData} 
      isNew={false} 
      allSubscriptionPlans={allSubscriptionPlans}
      allAppFeatures={allAppFeatures}
    />
  );
}
