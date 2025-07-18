// src/components/pricing/PricingTable.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Star, User as UserIcon, Users, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { SubscriptionPlan, AppFeature } from '@/types/subscription';
import { formatPrice, formatFullPrice } from '@/lib/utils';

const getPlanIcon = (planId: string): React.ElementType => {
  if (planId.includes('family_guide') || planId.includes('2_kinderen')) return Users;
  return UserIcon;
};

const calculatePrice = (plan: SubscriptionPlan, interval: 'month' | 'year'): number => {
  if (interval === 'year') {
    const discount = plan.yearlyDiscountPercent || 0;
    const totalYearly = plan.price * 12;
    return totalYearly * (1 - discount / 100);
  }
  return plan.price;
};

interface PricingTableProps {
  initialPlans: SubscriptionPlan[];
  allFeatures: AppFeature[];
}

export function PricingTable({ initialPlans, allFeatures }: PricingTableProps) {
  const [billingInterval, setBillingInterval] = useState<'month' | 'year'>('month');
  const router = useRouter();

  const handlePlanSelection = (planId: string) => {
    const planIdWithInterval = `${planId}_${billingInterval}`;
    router.push(`/signup?plan=${planIdWithInterval}`);
  };

  const hasAnyYearlyDiscount = initialPlans.some(p => p.yearlyDiscountPercent && p.yearlyDiscountPercent > 0);

  return (
    <div>
      <div className="flex items-center justify-center space-x-3 mb-8">
        <Label htmlFor="billing-toggle" className={cn(billingInterval === 'month' ? 'text-primary font-semibold' : 'text-muted-foreground')}>
          Maandelijks
        </Label>
        <Switch
          id="billing-toggle"
          checked={billingInterval === 'year'}
          onCheckedChange={(checked) => setBillingInterval(checked ? 'year' : 'month')}
        />
        <Label htmlFor="billing-toggle" className={cn(billingInterval === 'year' ? 'text-primary font-semibold' : 'text-muted-foreground')}>
          Jaarlijks
          {hasAnyYearlyDiscount && (
            <Badge variant="default" className="ml-2 bg-green-100 text-green-700 border-green-300">
              Bespaar
            </Badge>
          )}
        </Label>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 items-stretch justify-center">
        {initialPlans.map((plan) => {
          const PlanIcon = getPlanIcon(plan.id);
          const displayPrice = calculatePrice(plan, billingInterval);
          const priceText = billingInterval === 'year' && plan.price > 0
            ? `€${(displayPrice / 12).toFixed(2).replace('.', ',')}`
            : `€${displayPrice.toFixed(2).replace('.', ',')}`;

          return (
            <Card
              key={plan.id}
              className={cn(
                `flex flex-col shadow-lg relative border-2 hover:shadow-xl transition-all duration-300`,
                plan.isPopular ? "border-primary ring-2 ring-primary/50" : "border-border"
              )}
            >
              {plan.isPopular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 transform">
                  <span className="inline-flex items-center gap-1 rounded-full bg-primary px-4 py-1.5 text-sm font-semibold text-primary-foreground shadow-md">
                    <Star className="h-4 w-4 fill-current" /> Meest gekozen
                  </span>
                </div>
              )}
              <CardHeader className="text-center pt-10">
                <PlanIcon className="mx-auto h-12 w-12 text-primary mb-3" />
                <CardTitle className="text-2xl font-semibold mb-1">{plan.name}</CardTitle>
                <p className="text-4xl font-bold text-primary">
                  {priceText}
                </p>
                <p className="text-sm font-normal text-muted-foreground -mt-1 h-5"> 
                  {plan.price > 0 ? 'per maand' : ''}
                  {billingInterval === 'year' && plan.price > 0 && <span className="text-xs"> (jaarlijks betaald)</span>}
                </p>
                {plan.trialPeriodDays && plan.trialPeriodDays > 0 && (
                  <p className="text-xs text-green-600 font-medium mt-1">{plan.trialPeriodDays} dagen gratis proberen!</p>
                )}
              </CardHeader>
              <CardContent className="flex-grow space-y-3 mt-1 px-4 sm:px-6">
                <p className="mb-3 text-sm text-muted-foreground">{plan.description}</p>
                <ul className="space-y-2 text-sm text-left">
                  {allFeatures
                    .filter(feature => plan.featureAccess?.[feature.id])
                    .map(feature => (
                      <li key={feature.id} className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                        <span>{feature.label}</span>
                      </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter className="mt-auto pt-5 pb-6 px-4 sm:px-6">
                <Button
                  onClick={() => handlePlanSelection(plan.id)}
                  className="w-full h-11 sm:h-12 text-sm sm:text-base font-semibold"
                  variant={plan.isPopular ? 'default' : 'secondary'}
                >
                  {plan.trialPeriodDays && plan.trialPeriodDays > 0 ? `Start ${plan.trialPeriodDays} Dagen Gratis` : 'Kies Plan'}
                  <ArrowRight className="ml-2 h-4 w-4"/>
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
