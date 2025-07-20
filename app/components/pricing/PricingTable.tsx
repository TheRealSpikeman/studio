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
import type { SubscriptionPlan, PlatformTool } from '@/types/subscription';
import { Separator } from '@/components/ui/separator';

const getPlanIcon = (plan: SubscriptionPlan): React.ElementType => {
    if (plan.maxChildren && plan.maxChildren > 1) return Users;
    if (plan.maxChildren === 1) return UserIcon;
    return Users; // Default for parent-only or other plans
};

const calculatePrice = (plan: SubscriptionPlan, interval: 'month' | 'year'): number => {
  if (interval === 'year' && plan.price > 0 && plan.yearlyDiscountPercent) {
    const totalYearly = plan.price * 12;
    return totalYearly * (1 - plan.yearlyDiscountPercent / 100);
  }
  return plan.price;
};

interface PricingTableProps {
  initialPlans: SubscriptionPlan[];
  tools: PlatformTool[];
}

export function PricingTable({ initialPlans, tools }: PricingTableProps) {
  const [billingInterval, setBillingInterval] = useState<'month' | 'year'>('month');
  const router = useRouter();

  const handlePlanSelection = (planId: string) => {
    const planIdWithInterval = `${planId}_${billingInterval}`;
    router.push(`/signup?plan=${planIdWithInterval}`);
  };

  const hasAnyYearlyDiscount = initialPlans.some(p => p.yearlyDiscountPercent && p.yearlyDiscountPercent > 0);

  const freeFeatures = [
    { id: 'basic-assessment', label: 'Basis "Ken je Kind" Assessment' },
  ];

  return (
    <div>
      <div className="flex items-center justify-center space-x-3 mb-8">
        <Label htmlFor="billing-toggle" className={cn("font-semibold", billingInterval === 'month' ? 'text-primary' : 'text-muted-foreground')}>
          Maandelijks
        </Label>
        <Switch
          id="billing-toggle"
          checked={billingInterval === 'year'}
          onCheckedChange={(checked) => setBillingInterval(checked ? 'year' : 'month')}
          aria-label="Wissel tussen maandelijkse en jaarlijkse betaling"
        />
        <Label htmlFor="billing-toggle" className={cn("font-semibold", billingInterval === 'year' ? 'text-primary' : 'text-muted-foreground')}>
          Jaarlijks
          {hasAnyYearlyDiscount && (
            <Badge variant="default" className="ml-2 bg-green-500 hover:bg-green-600 text-primary-foreground">
              Bespaar 10%
            </Badge>
          )}
        </Label>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4 items-stretch justify-center">
        {initialPlans.map((plan) => {
          const PlanIcon = getPlanIcon(plan);
          const displayPrice = calculatePrice(plan, billingInterval);
          const priceText = billingInterval === 'year' && plan.price > 0
            ? `€${(displayPrice / 12).toFixed(2).replace('.', ',')}`
            : `€${displayPrice.toFixed(2).replace('.', ',')}`;
          
          const includedTools = plan.price > 0 ? tools : freeFeatures;

          return (
            <Card
              key={plan.id}
              className={cn(
                `flex flex-col shadow-lg relative border-2 hover:shadow-xl transition-all duration-300`,
                plan.isPopular ? "border-primary ring-4 ring-primary/20" : "border-border"
              )}
            >
              {plan.isPopular && (
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 transform">
                  <div className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2 text-primary-foreground shadow-lg">
                    <Star className="h-5 w-5 shrink-0 fill-current" />
                    <div className="flex flex-col text-left text-sm font-semibold leading-tight">
                        <span>Meest</span>
                        <span>gekozen</span>
                    </div>
                  </div>
                </div>
              )}
              <CardHeader className="text-center pt-10">
                <PlanIcon className="mx-auto h-12 w-12 text-primary mb-3" />
                <CardTitle className="text-xl font-semibold mb-1">{plan.name}</CardTitle>
                <p className="text-4xl font-bold text-primary">
                  {priceText}
                </p>
                <p className="text-sm font-normal text-muted-foreground -mt-1 h-5"> 
                  {plan.price > 0 ? (billingInterval === 'month' ? 'per maand' : '/mnd, jaarlijks betaald') : ''}
                </p>
                <CardDescription className="h-10 text-xs">{plan.tagline || plan.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-grow flex-col justify-between px-4 sm:px-6">
                <div>
                  <p className="text-xs text-muted-foreground text-center mb-2">
                      Voor max. <strong>{plan.maxChildren} kind(eren)</strong> en <strong>{plan.maxParents} ouder(s)</strong>
                  </p>
                  {plan.trialPeriodDays && plan.trialPeriodDays > 0 && plan.price > 0 && (
                      <p className="text-xs text-green-600 font-semibold text-center">{plan.trialPeriodDays} dagen gratis proberen!</p>
                  )}
                  <Separator className="my-4" />
                  <h4 className="text-sm font-semibold mb-2 text-left">
                      {plan.price > 0 ? "Alle tools inbegrepen:" : "Inbegrepen feature:"}
                  </h4>
                  <ul className="space-y-2 text-xs text-muted-foreground text-left">
                      {includedTools.map(tool => (
                          <li key={tool.id} className="flex items-start gap-2">
                              <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                              <span className="flex-1">{tool.label}</span>
                          </li>
                      ))}
                  </ul>
                </div>
              </CardContent>
              <CardFooter className="mt-auto pt-5 pb-6 px-4 sm:px-6">
                <Button
                  onClick={() => handlePlanSelection(plan.id)}
                  className="w-full h-12 text-base font-semibold"
                  variant={plan.isPopular ? 'default' : 'outline'}
                >
                  {plan.price === 0 ? 'Start Gratis' : (plan.trialPeriodDays ? `Start ${plan.trialPeriodDays} Dagen Gratis` : 'Kies Plan')}
                  {plan.price > 0 && <ArrowRight className="ml-2 h-4 w-4"/>}
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
