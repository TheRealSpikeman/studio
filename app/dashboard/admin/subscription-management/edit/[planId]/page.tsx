// app/dashboard/admin/subscription-management/edit/[planId]/page.tsx
"use client"; // This page now fetches client-side data

import { useEffect, useState } from 'react';
import { useParams, notFound } from 'next/navigation';
import { SubscriptionPlanForm } from '@/components/admin/subscription-management/SubscriptionPlanForm';
import { getSubscriptionPlanById } from '@/services/subscriptionService';
import type { SubscriptionPlan } from '@/types/subscription';
import { Loader2 } from 'lucide-react';

export default function EditSubscriptionPlanPage() {
  const params = useParams();
  const planId = params.planId as string;
  const [planData, setPlanData] = useState<SubscriptionPlan | null | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchPlan() {
      if (planId) {
        setIsLoading(true);
        const data = await getSubscriptionPlanById(planId);
        setPlanData(data);
        setIsLoading(false);
      }
    }
    fetchPlan();
  }, [planId]);

  if (isLoading) {
    return <div className="flex justify-center items-center h-full"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  if (planData === null) {
    // A better user experience than notFound() for client-side rendering
    return <div className="text-center p-8">Abonnement niet gevonden.</div>;
  }

  return (
    <SubscriptionPlanForm 
        initialData={planData} 
        isNew={false}
    />
  );
}
