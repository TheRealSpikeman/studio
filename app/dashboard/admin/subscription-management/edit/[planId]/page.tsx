// app/dashboard/admin/subscription-management/edit/[planId]/page.tsx
"use client";

import { SubscriptionPlanForm } from '@/components/admin/subscription-management/SubscriptionPlanForm';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { AlertTriangle, Loader2 } from '@/lib/icons';
import type { SubscriptionPlan } from '@/types/subscription';
import { getSubscriptionPlanById } from '@/types/subscription';

export default function EditSubscriptionPlanPage() {
  const params = useParams();
  const planId = params.planId as string;
  const [planData, setPlanData] = useState<SubscriptionPlan | null | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchPlan() {
        if (planId) {
          setIsLoading(true);
          const foundPlan = await getSubscriptionPlanById(planId);
          setPlanData(foundPlan);
          setIsLoading(false);
        }
    }
    fetchPlan();
  }, [planId]);

  if (isLoading) {
    return <div className="p-8 text-center flex items-center justify-center"><Loader2 className="h-6 w-6 animate-spin mr-2" /> Abonnementsgegevens laden...</div>;
  }

  if (!planData) {
    return (
      <div className="p-8 text-center">
        <AlertTriangle className="mx-auto h-12 w-12 text-destructive mb-4" />
        <h1 className="text-2xl font-bold text-destructive">Abonnement niet gevonden</h1>
        <p className="text-muted-foreground mb-6">Het abonnement met ID "{planId}" kon niet worden geladen.</p>
        <Button asChild variant="outline">
          <Link href="/dashboard/admin/subscription-management">
            Terug naar Overzicht
          </Link>
        </Button>
      </div>
    );
  }
  
  return <SubscriptionPlanForm initialData={planData} isNew={false} />;
}
