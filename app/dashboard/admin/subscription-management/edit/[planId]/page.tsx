
// src/app/dashboard/admin/subscription-management/edit/[planId]/page.tsx
"use client";

import { SubscriptionPlanForm } from '@/components/admin/subscription-management/SubscriptionPlanForm';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { AlertTriangle } from '@/lib/icons';
import type { SubscriptionPlan } from '@/types/subscription';
import { LOCAL_STORAGE_SUBSCRIPTION_PLANS_KEY, DEFAULT_APP_FEATURES } from '@/types/subscription';

export default function EditSubscriptionPlanPage() {
  const params = useParams();
  const planId = params.planId as string;
  const [planData, setPlanData] = useState<SubscriptionPlan | null | undefined>(undefined);

  useEffect(() => {
    if (planId) {
      const storedPlansRaw = localStorage.getItem(LOCAL_STORAGE_SUBSCRIPTION_PLANS_KEY);
      if (storedPlansRaw) {
        const storedPlans: SubscriptionPlan[] = JSON.parse(storedPlansRaw);
        const foundPlan = storedPlans.find(p => p.id === planId);
        
        if (foundPlan) {
            const defaultFeatureAccess: Record<string, boolean> = {};
            DEFAULT_APP_FEATURES.forEach(feature => { 
              defaultFeatureAccess[feature.id] = foundPlan.featureAccess?.[feature.id] || false;
            });

            const planWithDefaults: SubscriptionPlan = {
                ...foundPlan,
                shortName: foundPlan.shortName ?? '',
                featureAccess: defaultFeatureAccess, 
                trialPeriodDays: foundPlan.trialPeriodDays ?? (foundPlan.price === 0 ? 0 : 14),
                maxChildren: foundPlan.maxChildren ?? (foundPlan.id.includes('family') ? 3 : 1),
                isPopular: foundPlan.isPopular ?? false,
                tagline: foundPlan.tagline ?? '',
            };
            setPlanData(planWithDefaults);
        } else {
            setPlanData(null);
        }
      } else {
        setPlanData(null); 
      }
    }
  }, [planId]);

  if (planData === undefined) {
    return <div className="p-8 text-center">Abonnementsgegevens laden...</div>;
  }

  if (planData === null) {
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
    
