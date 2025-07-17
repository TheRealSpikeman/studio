// src/components/ouder/welcome/PlanSelection.tsx
"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Star, Users, Sparkles, User as UserIcon } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { type SubscriptionPlan, getSubscriptionPlans } from '@/types/subscription';

const getPlanIcon = (planId: string): React.ElementType => {
    if (planId.includes('gezin') || planId.includes('2_kinderen')) return Users;
    return UserIcon;
};

interface PlanSelectionProps {
    planParam: string | null;
    onPlanSelect: (planId: string) => void;
}

export function PlanSelection({ planParam, onPlanSelect }: PlanSelectionProps) {
    const [availablePlans, setAvailablePlans] = useState<SubscriptionPlan[]>([]);
    const [isLoadingPlans, setIsLoadingPlans] = useState(true);

    useEffect(() => {
        async function fetchData() {
            const plans = await getSubscriptionPlans();
            const sortedPlans = plans
                .filter(p => p.active && p.billingInterval === 'month')
                .sort((a, b) => (a.maxChildren || 0) - (b.maxChildren || 0));
            setAvailablePlans(sortedPlans);
            setIsLoadingPlans(false);
        }
        fetchData();
    }, []);

    if (isLoadingPlans) {
        return <div>Plannen laden...</div>;
    }

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {availablePlans.map(plan => {
                    const PlanIcon = getPlanIcon(plan.id);
                    return (
                        <Card key={plan.id} className={cn("flex flex-col text-center transition-all duration-200 border-2", plan.isPopular ? "border-primary ring-2 ring-primary/50" : "border-border", planParam === plan.id ? (plan.isPopular ? "ring-2 ring-primary/50 shadow-2xl scale-105" : "border-primary ring-2 ring-primary/30 shadow-2xl scale-105") : "hover:shadow-lg")}>
                            <CardHeader className="pb-2">
                                <PlanIcon className="mx-auto h-8 w-8 text-primary mb-2"/>
                                <CardTitle className="text-md font-semibold">{plan.name}</CardTitle>
                                {plan.price !== undefined && <p className="text-2xl font-bold text-primary">{plan.price === 0 ? 'Gratis' : `€${plan.price.toFixed(2).replace('.',',')}`}</p>}
                                <p className="text-xs font-normal text-muted-foreground -mt-1">{plan.price === 0 ? 'Proef de kracht' : 'per maand'}</p>
                                {plan.trialPeriodDays && plan.trialPeriodDays > 0 && (<p className="text-xs text-green-600 font-medium">{plan.trialPeriodDays} dagen gratis proberen!</p>)}
                            </CardHeader>
                            <CardContent className="text-xs text-muted-foreground flex-grow">
                                <p>{plan.description}</p>
                            </CardContent>
                            <CardFooter className="pt-3 pb-4">
                                <Button size="sm" className="w-full" variant={planParam === plan.id ? "default" : "outline"} onClick={() => onPlanSelect(plan.id)}>
                                    {planParam === plan.id ? "Gekozen" : "Kies dit Plan"}
                                </Button>
                            </CardFooter>
                        </Card>
                    );
                })}
            </div>
            <Button variant="link" asChild className="p-0 h-auto mt-4">
                <Link href="/pricing" target="_blank">Bekijk alle details en features</Link>
            </Button>
        </div>
    );
}
