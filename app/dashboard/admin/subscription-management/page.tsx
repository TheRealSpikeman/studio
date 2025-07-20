// src/app/dashboard/admin/subscription-management/page.tsx
"use client";

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CreditCard, PlusCircle, Loader2 } from 'lucide-react';
import { getSubscriptionPlans, deleteSubscriptionPlan } from '@/services/subscriptionService';
import { SubscriptionTable } from '@/components/admin/subscription-management/SubscriptionTable';
import type { SubscriptionPlan } from '@/types/subscription';

export default function SubscriptionManagementPage() {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPlans = useCallback(async () => {
    setIsLoading(true);
    const fetchedPlans = await getSubscriptionPlans();
    setPlans(fetchedPlans);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle className="text-2xl font-bold flex items-center gap-2">
                <CreditCard className="h-6 w-6 text-primary" />
                Abonnementenbeheer
              </CardTitle>
              <CardDescription>
                Beheer hier alle abonnementen, prijzen en limieten.
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button asChild>
                <Link href="/dashboard/admin/subscription-management/new">
                  <PlusCircle className="mr-2 h-4 w-4" /> Nieuw Abonnement
                </Link>
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin"/></div>
          ) : (
            <SubscriptionTable 
              initialPlans={plans} 
              deletePlanAction={deleteSubscriptionPlan} 
              onDataChange={fetchPlans} // Pass a function to refetch data
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
