// src/components/ouder/welcome/PlanSelection.tsx
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Star, Users, Sparkles, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { type SubscriptionPlan, type AppFeature, DEFAULT_APP_FEATURES, LOCAL_STORAGE_FEATURES_KEY, LOCAL_STORAGE_SUBSCRIPTION_PLANS_KEY } from '@/types/subscription';
import { Tooltip, TooltipProvider, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const initialDefaultPlansForWelcome: SubscriptionPlan[] = [
   {
    id: 'free_start', name: 'Gratis Start', shortName: 'Gratis', description: 'Basis zelfreflectie tool & PDF overzicht.', price: 0, currency: 'EUR', billingInterval: 'once',
    tagline: 'Proef de kracht van zelfinzicht.',
    featureAccess: { 
      ...Object.fromEntries(DEFAULT_APP_FEATURES.map(f => [f.id, false])), 
      startAssessment: true, basicReflectionToolLimited: true, basicPdfOverview: true, accountManagement: true,
    },
    active: true, trialPeriodDays: 0, maxChildren: 1, isPopular: false,
  },
  {
    id: 'family_guide_monthly', name: 'Gezins Gids - Maandelijks', shortName: 'Gezin M', description: 'Complete digitale ondersteuning voor het gezin.', price: 19.99, currency: 'EUR', billingInterval: 'month',
    tagline: 'Slechts €0,13 per dag voor uitgebreide tools!',
    featureAccess: {
      ...Object.fromEntries(DEFAULT_APP_FEATURES.map(f => [f.id, false])),
      startAssessment: true, weeklyMotivationEmail: true, allReflectionToolsUnlimited: true, interactiveJournal: true, 
      homeworkPlannerFocusTools: true, motivationTracking: true, extensivePdfReports: true,
      childProgressTracking: true, familyInsights: true, communicationWithLinkedProfessionals: true, accountManagement: true,
      max3ChildrenIncluded: true, browseProfessionals: true, professionalRates: true, bookPaySessions: true, sessionPlanningReminders: true,
      aiPoweredInsights: true, exclusiveCoachingModules: true, 
    },
    active: true, trialPeriodDays: 14, maxChildren: 3, isPopular: true,
  },
   {
    id: 'family_guide_yearly', name: 'Gezins Gids - Jaarlijks', shortName: 'Gezin J', description: 'Complete digitale ondersteuning met jaarkorting.', price: 191.88, currency: 'EUR', billingInterval: 'year',
    tagline: 'Jaarlijks voordeel voor het hele gezin!',
    featureAccess: {
       ...Object.fromEntries(DEFAULT_APP_FEATURES.map(f => [f.id, false])),
      startAssessment: true, weeklyMotivationEmail: true, allReflectionToolsUnlimited: true, interactiveJournal: true, 
      homeworkPlannerFocusTools: true, motivationTracking: true, extensivePdfReports: true,
      childProgressTracking: true, familyInsights: true, communicationWithLinkedProfessionals: true, accountManagement: true,
      max3ChildrenIncluded: true, browseProfessionals: true, professionalRates: true, bookPaySessions: true, sessionPlanningReminders: true,
      yearlyDiscount15: true,
      aiPoweredInsights: true, exclusiveCoachingModules: true,
    },
    active: true, trialPeriodDays: 14, maxChildren: 3, isPopular: false,
  },
  {
    id: 'premium_family_monthly', name: 'Premium Plan - Maandelijks', shortName: 'Prem M', description: 'Alles van Gezins Gids, plus premium features en meer kinderen.', price: 39.99, currency: 'EUR', billingInterval: 'month',
    tagline: '€0,67 per dag - minder dan een kopje koffie!',
    featureAccess: {
      ...Object.fromEntries(DEFAULT_APP_FEATURES.map(f => [f.id, true])), 
      noProgressAnalytics: false, 
    },
    active: true, trialPeriodDays: 14, maxChildren: 4, isPopular: false,
  },
  {
    id: 'premium_family_yearly', name: 'Premium Plan - Jaarlijks', shortName: 'Prem J', description: 'Alles van Premium Plan met jaarkorting.', price: 360.00, currency: 'EUR', billingInterval: 'year',
    tagline: 'Het meest complete pakket met maximale korting!',
    featureAccess: {
      ...Object.fromEntries(DEFAULT_APP_FEATURES.map(f => [f.id, true])),
      noProgressAnalytics: false, 
      yearlyDiscount15: true, 
    },
    active: true, trialPeriodDays: 14, maxChildren: 4, isPopular: false,
  },
];


const getPlanIcon = (planId: string): React.ElementType => {
    if (planId.includes('premium')) return Star;
    if (planId.includes('family') || planId.includes('gezin')) return Users;
    return Sparkles;
};

const getMonthlyEquivalent = (price: number, interval: 'month' | 'year' | 'once'): string | null => {
    if (interval === 'year' && price > 0) { return (price / 12).toFixed(2); }
    return null;
};
const getYearlySavings = (monthlyPrice: number, yearlyPrice: number): string | null => {
    if (monthlyPrice > 0 && yearlyPrice > 0) {
        const totalMonthlyCost = monthlyPrice * 12;
        const savings = totalMonthlyCost - yearlyPrice;
        if (savings > 0) { return savings.toFixed(2); }
    }
    return null;
}

const MAX_FEATURES_TO_DISPLAY_ON_CARD_WELCOME = 16;


interface PlanSelectionProps {
    planParam: string | null;
    onPlanSelect: (planId: string) => void;
}

export function PlanSelection({ planParam, onPlanSelect }: PlanSelectionProps) {
    const [availablePlans, setAvailablePlans] = useState<SubscriptionPlan[]>([]);
    const [allAppFeatures, setAllAppFeatures] = useState<AppFeature[]>([]);
    const [isLoadingPlans, setIsLoadingPlans] = useState(true);

    useEffect(() => {
        const storedFeaturesRaw = localStorage.getItem(LOCAL_STORAGE_FEATURES_KEY);
        let loadedFeatures = DEFAULT_APP_FEATURES;
        if (storedFeaturesRaw) {
          try { loadedFeatures = JSON.parse(storedFeaturesRaw); }
          catch (e) { localStorage.setItem(LOCAL_STORAGE_FEATURES_KEY, JSON.stringify(DEFAULT_APP_FEATURES)); }
        } else { localStorage.setItem(LOCAL_STORAGE_FEATURES_KEY, JSON.stringify(DEFAULT_APP_FEATURES)); }
        setAllAppFeatures(loadedFeatures);

        const storedPlansRaw = localStorage.getItem(LOCAL_STORAGE_SUBSCRIPTION_PLANS_KEY);
        let loadedPlans: SubscriptionPlan[] = [];

        const ensureFullFeatureAccess = (plan: SubscriptionPlan): SubscriptionPlan => {
            const migratedFeatureAccess: Record<string, boolean> = {};
            loadedFeatures.forEach(appFeature => {
                migratedFeatureAccess[appFeature.id] = (plan.featureAccess && typeof plan.featureAccess[appFeature.id] === 'boolean') ? plan.featureAccess[appFeature.id] : false;
            });
            return { ...plan, shortName: plan.shortName ?? '', featureAccess: migratedFeatureAccess, trialPeriodDays: plan.trialPeriodDays ?? (plan.price === 0 ? 0 : 14), maxChildren: plan.maxChildren ?? (plan.id.includes('family_guide') ? 3 : (plan.price === 0 ? 1 : 0)), isPopular: plan.isPopular ?? false, tagline: plan.tagline ?? '' };
        };

        if (storedPlansRaw) {
          try {
            const parsedPlans: SubscriptionPlan[] = JSON.parse(storedPlansRaw);
            loadedPlans = parsedPlans.map(ensureFullFeatureAccess);
          } catch (e) {
            loadedPlans = initialDefaultPlansForWelcome.map(ensureFullFeatureAccess);
            localStorage.setItem(LOCAL_STORAGE_SUBSCRIPTION_PLANS_KEY, JSON.stringify(initialDefaultPlansForWelcome));
          }
        } else {
          loadedPlans = initialDefaultPlansForWelcome.map(ensureFullFeatureAccess);
          localStorage.setItem(LOCAL_STORAGE_SUBSCRIPTION_PLANS_KEY, JSON.stringify(initialDefaultPlansForWelcome));
        }
        setAvailablePlans(loadedPlans.filter(p => p.active));
        setIsLoadingPlans(false);
    }, []);

    if (isLoadingPlans) {
        return <div>Plannen laden...</div>;
    }

    return (
        <TooltipProvider>
            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {availablePlans.filter(p => p.active && (p.billingInterval === 'month' || p.billingInterval === 'once')).map(plan => {
                        const PlanIcon = getPlanIcon(plan.id);
                        const yearlyEquivalentPlan = plan.billingInterval === 'month' ? availablePlans.find(yp => yp.active && yp.billingInterval === 'year' && yp.id.replace('_yearly', '_monthly') === plan.id.replace('_monthly', '_monthly')) : undefined;
                        const monthlyEq = yearlyEquivalentPlan ? getMonthlyEquivalent(yearlyEquivalentPlan.price, 'year') : null;
                        const savings = yearlyEquivalentPlan ? getYearlySavings(plan.price, yearlyEquivalentPlan.price) : null;
                        const activeFeaturesForPlan = allAppFeatures.filter(appFeature => plan.featureAccess && plan.featureAccess[appFeature.id]);
                        const featuresToDisplayOnCard = activeFeaturesForPlan.slice(0, MAX_FEATURES_TO_DISPLAY_ON_CARD_WELCOME);
                        const hiddenFeaturesCount = activeFeaturesForPlan.length - featuresToDisplayOnCard.length;
                        const hasMoreFeaturesThanDisplayed = hiddenFeaturesCount > 0;

                        return (
                        <Card key={plan.id} className={cn("flex flex-col text-center transition-all duration-200 border-2", plan.isPopular ? "border-primary ring-2 ring-primary/50" : "border-border", planParam === plan.id ? (plan.isPopular ? "ring-2 ring-primary/50 shadow-2xl scale-105" : "border-primary ring-2 ring-primary/30 shadow-2xl scale-105") : "hover:shadow-lg")}>
                            <CardHeader className="pb-2"><PlanIcon className="mx-auto h-8 w-8 text-primary mb-2"/><CardTitle className="text-md font-semibold">{plan.name.replace(' - Maandelijks', '')}</CardTitle>{plan.price !== undefined && <p className="text-2xl font-bold text-primary">{plan.price === 0 ? 'Gratis' : `€${plan.price.toFixed(2)}`}</p>}<p className="text-xs font-normal text-muted-foreground -mt-1"> {plan.price === 0 ? 'Proef de kracht' : plan.billingInterval === 'month' ? 'p/gezin/maand' : 'eenmalig'}</p>{plan.trialPeriodDays && plan.trialPeriodDays > 0 && plan.price > 0 && (<p className="text-xs text-green-600 font-medium">{plan.trialPeriodDays} dagen gratis proberen!</p>)}{plan.tagline && (<p className="text-xs text-green-600 font-medium mt-1">{plan.tagline}</p>)}</CardHeader>
                            <CardContent className="text-xs text-muted-foreground flex-grow space-y-0.5"><p className="mb-2 text-sm">{plan.description}</p><ul className="space-y-0.5">{featuresToDisplayOnCard.map((appFeature) => (<li key={appFeature.id} className="flex items-start justify-center text-left"><CheckCircle2 className="mr-2 mt-[3px] h-4 w-4 flex-shrink-0 text-green-500" /><span className="text-sm leading-snug text-muted-foreground">{appFeature.label}</span></li>))}{hasMoreFeaturesThanDisplayed && (<li className="text-xs text-muted-foreground/80 text-center pt-0.5"><Tooltip delayDuration={300}><TooltipTrigger asChild><span className="cursor-help underline decoration-dashed hover:text-primary">... en {hiddenFeaturesCount} andere feature{hiddenFeaturesCount > 1 ? 's' : ''}!</span></TooltipTrigger><TooltipContent className="w-56 bg-popover p-2 rounded-md shadow-lg border text-popover-foreground"><p className="font-semibold mb-1.5 text-sm">Extra features:</p><ul className="list-disc list-inside space-y-0.5 text-xs">{activeFeaturesForPlan.slice(MAX_FEATURES_TO_DISPLAY_ON_CARD_WELCOME).map(hf => <li key={hf.id}>{hf.label}</li>)}</ul></TooltipContent></Tooltip></li>)}{activeFeaturesForPlan.length === 0 && (<li className="text-xs text-muted-foreground/80 text-center pt-0.5">Basisfunctionaliteit.</li>)}{plan.maxChildren !== undefined && (<p className="text-xs text-muted-foreground pt-1.5">{plan.maxChildren === 0 ? 'Onbeperkt kinderen' : `Tot ${plan.maxChildren} kind${plan.maxChildren !== 1 ? 'eren' : ''}`}</p>)}</ul></CardContent>
                            <CardFooter className="pt-3 pb-4"><Button size="sm" className="w-full" variant={planParam === plan.id ? (plan.id === 'free_start' ? "default" : "default") : "outline"} onClick={() => onPlanSelect(plan.id)}>{planParam === plan.id ? (plan.id === 'free_start' ? "Gratis Gekozen" : "Bevestig Keuze") : "Kies dit Plan"}</Button></CardFooter>
                            {yearlyEquivalentPlan && (<div className="text-center text-xs p-2 border-t"><Button variant="link" className="p-0 h-auto text-xs text-primary" onClick={() => onPlanSelect(yearlyEquivalentPlan.id)}>Ook jaarlijks: €{yearlyEquivalentPlan.price.toFixed(2)} ({monthlyEq ? `€${monthlyEq}/mnd` : ''}){savings && parseFloat(savings) > 0 && <span className="text-accent font-semibold ml-1">- bespaar €{savings}</span>}</Button></div>)}
                        </Card>
                        );
                    })}
                </div>
                <Button variant="link" asChild className="p-0 h-auto mt-4"><Link href="/pricing">Bekijk alle details en jaaropties</Link></Button>
            </div>
        </TooltipProvider>
    );
}
