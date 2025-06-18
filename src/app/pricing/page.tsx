
// src/app/pricing/page.tsx
"use client";

import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { CheckCircle2, Users, Percent, Sparkles, Star, HelpCircle, ExternalLink, ShieldCheck, ListChecks } from 'lucide-react'; // Added ShieldCheck
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';
import type { SubscriptionPlan, AppFeature } from '@/app/dashboard/admin/subscription-management/page'; 
import { ALL_APP_FEATURES } from '@/app/dashboard/admin/subscription-management/page';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";


// Initial default plans (will be overridden by localStorage if available)
// Updated to match the image structure: Gratis Start, Gezin Plan - Maandelijks, Premium Plan - Maandelijks
const initialSubscriptionPlansForPricing: SubscriptionPlan[] = [
  {
    id: 'free_start', name: 'Gratis Start', description: 'Proef de kracht', price: 0, currency: 'EUR', billingInterval: 'once',
    featureAccess: {
      ...Object.fromEntries(ALL_APP_FEATURES.map(f => [f.id, false])), // All false by default
      startAssessment: true,
      basicReflectionToolLimited: true,
    },
    active: true, trialPeriodDays: 0, maxChildren: 1, isPopular: false,
  },
  {
    id: 'family_guide_monthly', name: 'Gezin Plan - Maandelijks', description: 'Slechts €0,13 per dag voor uitgebreide tools!', price: 19.99, currency: 'EUR', billingInterval: 'month',
    featureAccess: { // Features for Gezins Gids - Maandelijks
      ...Object.fromEntries(ALL_APP_FEATURES.map(f => [f.id, false])),
      startAssessment: true, 
      weeklyMotivationEmail: true, 
      allReflectionToolsUnlimited: true, 
      interactiveJournal: true, 
      planningFocusTools: true, 
      motivationTracking: true,
      extensivePdfReports: true, 
      childProgressTracking: true, 
      familyInsights: true, 
      communicationWithLinkedProfessionals: true, 
      accountManagement: true,
    },
    active: true, trialPeriodDays: 14, maxChildren: 3, isPopular: true,
  },
   { // Yearly version of Gezin Plan - Maandelijks
    id: 'family_guide_yearly', name: 'Gezin Plan - Jaarlijks', description: 'Alle voordelen van Gezins Gids Maandelijks, met een aantrekkelijke jaarkorting.', price: 191.88, currency: 'EUR', billingInterval: 'year', // 19.99 * 12 * 0.8 = 191.90, example image uses 191.88 (saving 48.00 from 239.88)
    featureAccess: { 
      ...Object.fromEntries(ALL_APP_FEATURES.map(f => [f.id, false])),
      startAssessment: true, 
      weeklyMotivationEmail: true, 
      allReflectionToolsUnlimited: true, 
      interactiveJournal: true, 
      planningFocusTools: true, 
      motivationTracking: true,
      extensivePdfReports: true, 
      childProgressTracking: true, 
      familyInsights: true, 
      communicationWithLinkedProfessionals: true, 
      accountManagement: true,
      yearlyDiscount15: true,
    },
    active: true, trialPeriodDays: 14, maxChildren: 3, isPopular: false,
  },
  {
    id: 'premium_family_monthly', name: 'Premium Plan - Maandelijks', description: '€0,33 per dag - minder dan een kopje koffie!', price: 39.99, currency: 'EUR', billingInterval: 'month',
    featureAccess: { // All 10 base features from image are true
      ...Object.fromEntries(ALL_APP_FEATURES.map(f => [f.id, false])),
      startAssessment: true,
      weeklyMotivationEmail: true,
      basicReflectionToolLimited: true, // Corresponds to "Basis zelfreflectie tool (beperkt)" in image for Premium
      sampleCoachingContent: true,
      basicPdfOverview: true,
      browseProfessionals: true,
      viewProfessionalRates: true,
      dailyPersonalizedCoaching: true, // Assuming this is part of "en meer"
      allReflectionToolsUnlimited: true, // Assuming this is part of "en meer"
      interactiveJournal: true, // Assuming this is part of "en meer"
      // Add other premium features here if the 10 from image is a subset
      accountManagement: true,
      noProgressAnalytics: false, // Premium should have analytics
      extensiveAssessmentAnalysis: true, // Example of a premium feature
      aiPoweredInsights: true, // Example of a premium feature
    },
    active: true, trialPeriodDays: 14, maxChildren: 4, isPopular: false, 
  },
  { // Yearly version of Premium Plan
    id: 'premium_family_yearly', name: 'Premium Plan - Jaarlijks', description: 'Alle voordelen van Premium Plan, met 15% jaarkorting.', price: 360.00, currency: 'EUR', billingInterval: 'year', // 39.99 * 12 * 0.75 for 25% off? Image says 360, saving 119.88 from 479.88 (so approx 25% off)
    featureAccess: { 
      ...Object.fromEntries(ALL_APP_FEATURES.map(f => [f.id, false])),
      startAssessment: true,
      weeklyMotivationEmail: true,
      basicReflectionToolLimited: true,
      sampleCoachingContent: true,
      basicPdfOverview: true,
      browseProfessionals: true,
      viewProfessionalRates: true,
      dailyPersonalizedCoaching: true, 
      allReflectionToolsUnlimited: true, 
      interactiveJournal: true, 
      accountManagement: true,
      noProgressAnalytics: false, 
      extensiveAssessmentAnalysis: true, 
      aiPoweredInsights: true, 
      yearlyDiscount15: true, // Assuming 15% is the standard yearly discount text
    },
    active: true, trialPeriodDays: 14, maxChildren: 4, isPopular: false, 
  },
];

const faqItems = [
  {
    question: "Wat is het verschil tussen de plannen?",
    answer: "Gratis: Proef de basis digitale tools (beperkt). Gezins Gids: Complete digitale ondersteuning & tools voor het gezin (tot 3 kinderen), inclusief ouder-dashboard. Premium Plan: Alles van Gezins Gids, plus extra premium features en tot 4 kinderen (of meer, afhankelijk van configuratie).",
  },
  {
    question: "Zijn 1-op-1 coaching sessies inbegrepen?",
    answer: "Nee, live coaching en tutoring worden apart betaald per sessie (indicatie: €25-125/uur afhankelijk van specialist). Met een betaald abonnement krijgt u toegang tot onze marktplaats om deze professionals te boeken en te betalen.",
  },
  {
    question: "Kan ik upgraden of downgraden?",
    answer: "Ja, u kunt op elk moment van plan wisselen via uw accountinstellingen. Bij een upgrade wordt het verschil direct verrekend. Bij een downgrade gaat de wijziging in bij uw volgende factuurperiode.",
  },
  {
    question: "Hoeveel kinderen kan ik toevoegen?",
    answer: "Gratis Start: 1 kind. Gezins Gids: Tot 3 kinderen (kan verschillen per exacte planconfiguratie). Premium Plan: Meestal 4 of meer, afhankelijk van de exacte configuratie.",
  },
  {
    question: "Hoe werkt de jaarlijkse betaling?",
    answer: "Bij een jaarlijkse betaling betaalt u voor 12 maanden vooruit en ontvangt u een korting. Uw abonnement wordt dan jaarlijks verlengd, tenzij u opzegt.",
  },
];

const getPlanIcon = (planId: string): React.ElementType => {
    if (planId.includes('premium')) return Star;
    if (planId.includes('family_guide') || planId.includes('gezin')) return Users;
    if (planId.includes('coaching_tools')) return Sparkles; 
    return Sparkles; 
};

const getMonthlyEquivalent = (price: number, interval: 'month' | 'year' | 'once'): string | null => {
    if (interval === 'year' && price > 0) {
        return (price / 12).toFixed(2);
    }
    return null;
};
const getYearlySavings = (monthlyPrice: number, yearlyPrice: number): string | null => {
    if (monthlyPrice > 0 && yearlyPrice > 0) {
        const totalMonthlyCost = monthlyPrice * 12;
        const savings = totalMonthlyCost - yearlyPrice;
        if (savings > 0) {
            return savings.toFixed(2);
        }
    }
    return null;
}

const MAX_FEATURES_TO_DISPLAY_ON_CARD = 7;

export default function PricingPage() {
  const router = useRouter();
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedPlansRaw = localStorage.getItem('subscriptionPlans');
    let activePlans: SubscriptionPlan[] = [];
    if (storedPlansRaw) {
      try {
        const parsedPlans: SubscriptionPlan[] = JSON.parse(storedPlansRaw);
        activePlans = parsedPlans.filter(p => p.active).map(plan => {
          const migratedFeatureAccess: Record<string, boolean> = {};
          ALL_APP_FEATURES.forEach(appFeature => {
            migratedFeatureAccess[appFeature.id] = (plan.featureAccess && typeof plan.featureAccess[appFeature.id] === 'boolean') 
              ? plan.featureAccess[appFeature.id] 
              : false; 
          });
          return {
            ...plan,
            featureAccess: migratedFeatureAccess,
            trialPeriodDays: plan.trialPeriodDays ?? (plan.price === 0 ? 0 : (plan.id.includes('coaching_tools') ? 180 : 14)), // Fallback logic retained
            maxChildren: plan.maxChildren ?? (plan.id.includes('coaching_tools') ? 0 : (plan.id.includes('family_guide') ? 3 : (plan.price === 0 ? 1 : 0))), // Fallback logic retained
            isPopular: plan.isPopular ?? false, // Default to false if not present
          };
        });
      } catch (e) {
        console.error("Error parsing plans from localStorage, using defaults", e);
        activePlans = initialSubscriptionPlansForPricing.filter(p => p.active).map(plan => ({
            ...plan,
             isPopular: plan.isPopular ?? false,
        }));
        localStorage.setItem('subscriptionPlans', JSON.stringify(initialSubscriptionPlansForPricing));
      }
    } else {
      activePlans = initialSubscriptionPlansForPricing.filter(p => p.active).map(plan => ({
            ...plan,
             isPopular: plan.isPopular ?? false,
        }));
      localStorage.setItem('subscriptionPlans', JSON.stringify(initialSubscriptionPlansForPricing));
    }
    setPlans(activePlans);
    setIsLoading(false);
  }, []);


  const handlePlanSelection = (planId: string) => {
    router.push(`/signup?plan=${planId}`);
  };

  const getPlanPriceDetail = (plan: SubscriptionPlan): string => {
    if (plan.price === 0) return 'Proef de kracht';
    if (plan.billingInterval === 'month') return 'p/gezin/maand';
    if (plan.billingInterval === 'year') return 'p/gezin/jaar';
    return '';
  }
  
  const getPlanYearlyOptionText = (plan: SubscriptionPlan): string | undefined => {
    if (plan.billingInterval === 'month' && plan.price > 0) {
        const yearlyEquivalentPlan = plans.find(p => 
            p.billingInterval === 'year' &&
            p.id.replace('_yearly', '_monthly') === plan.id.replace('_monthly', '_monthly') && 
            p.maxChildren === plan.maxChildren
        );
        if (yearlyEquivalentPlan) {
            const monthlyEq = getMonthlyEquivalent(yearlyEquivalentPlan.price, 'year');
            return `Of kies jaarlijks: €${yearlyEquivalentPlan.price.toFixed(2)}/jaar (${monthlyEq ? `€${monthlyEq}/mnd` : ''})`;
        }
    }
    return undefined;
  }

  const getPlanYearlySavingsHighlight = (plan: SubscriptionPlan): string | undefined => {
    if (plan.billingInterval === 'month' && plan.price > 0) {
       const yearlyEquivalentPlan = plans.find(p => 
            p.billingInterval === 'year' &&
            p.id.replace('_yearly', '_monthly') === plan.id.replace('_monthly', '_monthly') &&
            p.maxChildren === plan.maxChildren
        );
        if (yearlyEquivalentPlan) {
            const savings = getYearlySavings(plan.price, yearlyEquivalentPlan.price);
            if (savings) return `bespaar €${savings}`;
        }
    }
    return undefined;
  }
  
  const getYearlyPlanIdForMonthly = (monthlyPlanId: string): string | undefined => {
    const baseName = monthlyPlanId.replace('_monthly', '');
    return plans.find(p => p.id === `${baseName}_yearly`)?.id;
  }


  if (isLoading) {
    return <div className="flex h-screen items-center justify-center">Abonnementen laden...</div>;
  }
  
  const displayPlans = plans.filter(p => p.active && (p.billingInterval === 'month' || p.billingInterval === 'once'));


  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-gradient-to-b from-background via-secondary/5 to-background">
        <section className="py-16 md:py-20 text-center">
          <div className="container">
            <h1 className="text-4xl font-bold tracking-tight text-foreground md:text-5xl">
              Kies het plan dat bij uw gezin past
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-3xl mx-auto">
              Start gratis om de basis te ontdekken, of kies voor volledige digitale coaching en ondersteuning voor uw kind en uzelf. Registratie en beheer via uw ouderaccount. Elk pad begint met een persoonlijke assessment.
              {plans.some(p => p.trialPeriodDays && p.trialPeriodDays > 0 && p.price > 0) && (
                <span className="block mt-2 font-semibold text-primary">Alle betaalde plannen starten met een gratis proefperiode!</span>
              )}
            </p>
          </div>
        </section>

        <section className="pb-16 md:pb-24">
          <div className="container">
            <TooltipProvider>
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 items-stretch">
                {displayPlans.map((plan) => {
                  const Icon = getPlanIcon(plan.id);
                  const yearlyOptionText = getPlanYearlyOptionText(plan);
                  const yearlySavingsHighlight = getPlanYearlySavingsHighlight(plan);
                  const yearlyPlanId = getYearlyPlanIdForMonthly(plan.id);

                  const activeFeaturesForPlan = ALL_APP_FEATURES.filter(
                    (appFeature) => plan.featureAccess && plan.featureAccess[appFeature.id]
                  );
                  const featuresToDisplayOnCard = activeFeaturesForPlan.slice(0, MAX_FEATURES_TO_DISPLAY_ON_CARD);
                  const hiddenFeatures = activeFeaturesForPlan.slice(MAX_FEATURES_TO_DISPLAY_ON_CARD);
                  const hasMoreFeaturesThanDisplayed = hiddenFeatures.length > 0;

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
                      <Icon className="mx-auto h-12 w-12 text-primary mb-3" />
                      <CardTitle className="text-2xl font-semibold mb-1">{plan.name}</CardTitle>
                      <p className="text-4xl font-bold text-primary">
                        {plan.price === 0 ? 'Gratis' : `€${plan.price.toFixed(2)}`}
                      </p>
                      <p className="text-sm font-normal text-muted-foreground -mt-1"> {getPlanPriceDetail(plan)}</p>
                      {plan.trialPeriodDays && plan.trialPeriodDays > 0 && plan.price > 0 && (
                          <p className="text-xs text-green-600 font-medium mt-1">{plan.trialPeriodDays} dagen gratis proberen!</p>
                      )}
                      {plan.id === "family_guide_monthly" && (
                          <p className="text-xs text-green-600 font-medium mt-1">€0,67 per dag - minder dan een kopje koffie!</p>
                      )}
                       {plan.id === "premium_family_monthly" && (
                          <p className="text-xs text-green-600 font-medium mt-1">€1,33 per dag voor ultieme ondersteuning!</p>
                      )}
                      {plan.id === "coaching_tools_monthly" && (
                          <p className="text-xs text-green-600 font-medium mt-1">Slechts €0,13 per dag voor uitgebreide tools!</p>
                      )}
                    </CardHeader>
                    <CardContent className="flex-grow space-y-3 mt-1">
                      <p className="mb-2 text-sm text-muted-foreground">{plan.description}</p>
                      <ul className="space-y-2.5">
                        {featuresToDisplayOnCard.map((appFeature) => (
                              <li key={appFeature.id} className="flex items-start text-left">
                              <CheckCircle2 className="mr-2.5 mt-0.5 h-5 w-5 flex-shrink-0 text-green-500" />
                              <span className="text-sm leading-snug text-muted-foreground">
                                  {appFeature.label}
                              </span>
                              </li>
                          ))}
                          {hasMoreFeaturesThanDisplayed && (
                            <li className="text-xs text-muted-foreground text-center pt-1">
                              <Tooltip delayDuration={300}>
                                <TooltipTrigger asChild>
                                  <span className="cursor-help underline decoration-dashed hover:text-primary">
                                    ... en {hiddenFeatures.length} andere feature{hiddenFeatures.length > 1 ? 's' : ''}!
                                  </span>
                                </TooltipTrigger>
                                <TooltipContent className="w-64 bg-popover p-3 rounded-md shadow-lg border text-popover-foreground">
                                  <p className="font-semibold mb-2">Extra features:</p>
                                  <ul className="list-disc list-inside space-y-1 text-sm">
                                    {hiddenFeatures.map(hf => <li key={hf.id}>{hf.label}</li>)}
                                  </ul>
                                </TooltipContent>
                              </Tooltip>
                            </li>
                          )}
                          {activeFeaturesForPlan.length === 0 && (
                              <li className="text-sm text-muted-foreground text-center pt-1">Basisfunctionaliteit inbegrepen.</li>
                          )}
                      </ul>
                      {plan.maxChildren !== undefined && (
                          <p className="text-xs text-muted-foreground text-center pt-2">
                              {plan.maxChildren === 0 ? 'Onbeperkt aantal kinderen' : `Tot ${plan.maxChildren} kind${plan.maxChildren !== 1 ? 'eren' : ''} inbegrepen.`}
                          </p>
                      )}
                    </CardContent>
                    <CardFooter className="mt-auto pt-5 pb-6 flex flex-col gap-2.5">
                      <Button
                        onClick={() => handlePlanSelection(plan.id)}
                        className="w-full h-12 text-base font-semibold"
                        variant={plan.isPopular ? 'default' : (plan.id === 'free_start' ? 'outline' : 'secondary')}
                      >
                        {plan.id === 'free_start' ? 'Start gratis ontdekking' : `Kies ${plan.name.replace(' - Maandelijks', '')}`}
                      </Button>
                      {yearlyOptionText && yearlyPlanId && (
                        <div className="text-center mt-1.5">
                          <Button
                            onClick={() => handlePlanSelection(yearlyPlanId)}
                            variant="link"
                            className="h-auto text-xs text-primary py-1 px-2 text-center flex-wrap justify-center items-baseline leading-tight"
                          >
                            <span>{yearlyOptionText}</span>
                            {yearlySavingsHighlight && (
                              <span className="text-accent font-semibold ml-1">- {yearlySavingsHighlight}</span>
                            )}
                          </Button>
                        </div>
                      )}
                    </CardFooter>
                  </Card>
                  );
                })}
              </div>
            </TooltipProvider>
          </div>
        </section>

        <section className="py-16 md:py-20 bg-secondary/20">
          <div className="container max-w-3xl">
            <h2 className="mb-10 text-center text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              <HelpCircle className="inline-block h-9 w-9 mr-2 text-primary" /> Veelgestelde Vragen
            </h2>
            <Accordion type="single" collapsible className="w-full space-y-4">
              {faqItems.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`faq-${index}`}
                  className="bg-card rounded-lg shadow-sm border"
                >
                  <AccordionTrigger className="text-left text-lg hover:no-underline font-medium text-foreground py-5 px-6 data-[state=open]:text-primary [&[data-state=open]>svg]:text-primary [&[data-state=open]>svg]:rotate-180 transition-all">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed px-6 pb-5 pt-0 bg-card rounded-b-lg text-base data-[state=open]:bg-muted/20">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        <section className="py-16 md:py-20">
          <div className="container max-w-4xl text-center">
             <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl mb-6">
              <ShieldCheck className="inline-block h-10 w-10 mr-2 text-primary" /> Onze Garanties
            </h2>
            <div className="grid md:grid-cols-3 gap-8 text-left">
              <Card className="bg-green-50 border-green-200 shadow-sm">
                <CardHeader><CardTitle className="text-green-700">Privacy & Veiligheid</CardTitle></CardHeader>
                <CardContent className="text-sm text-green-800 space-y-1">
                  <p>AVG-conform platform speciaal voor tieners.</p>
                  <p>Geen data doorverkoop - uw informatie blijft privé.</p>
                  <p>Beveiligde betalingen via Nederlandse banken.</p>
                </CardContent>
              </Card>
              <Card className="bg-blue-50 border-blue-200 shadow-sm">
                <CardHeader><CardTitle className="text-blue-700">Transparantie</CardTitle></CardHeader>
                <CardContent className="text-sm text-blue-800 space-y-1">
                  <p>Geen verborgen kosten of verrassingen.</p>
                  <p>Altijd duidelijk wat wel en niet inbegrepen is.</p>
                  <p>Wij bieden geen diagnoses - alleen ondersteuning.</p>
                </CardContent>
              </Card>
              <Card className="bg-yellow-50 border-yellow-200 shadow-sm">
                <CardHeader><CardTitle className="text-yellow-700">Flexibiliteit</CardTitle></CardHeader>
                <CardContent className="text-sm text-yellow-800 space-y-1">
                  <p>Maandelijks opzegbaar (bij maandabonnement).</p>
                  <p>Geen langdurige binding of opstartkosten.</p>
                  <p>Probeer tot 180 dagen gratis bij elk betaald plan.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        
        <section className="py-16 md:py-20 bg-primary/5">
          <div className="container max-w-4xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl mb-8">
              <Percent className="inline-block h-10 w-10 mr-3 text-accent" /> Waarom MindNavigator?
            </h2>
            <div className="grid md:grid-cols-3 gap-6 text-left">
                <div className="p-6 bg-card rounded-lg shadow-md border border-border">
                    <h3 className="font-semibold text-lg text-primary mb-1">Betaalbare Digitale Ondersteuning</h3>
                    <p className="text-sm text-muted-foreground">MindNavigator (betaalde plannen): vanaf €3.99/maand. Traditionele coaching: vaak €100-150/uur per kind. Bespaar honderden euro's per maand.</p>
                </div>
                 <div className="p-6 bg-card rounded-lg shadow-md border border-border">
                    <h3 className="font-semibold text-lg text-primary mb-1">Direct Beschikbaar, Geen Wachttijden</h3>
                    <p className="text-sm text-muted-foreground">GGZ wachttijden: 6-12+ maanden. MindNavigator digitale tools: start vandaag nog, 24/7 toegankelijk. Live professionals beschikbaar via ons platform.</p>
                </div>
                 <div className="p-6 bg-card rounded-lg shadow-md border border-border">
                    <h3 className="font-semibold text-lg text-primary mb-1">Complete Oplossing</h3>
                    <p className="text-sm text-muted-foreground">Digitale tools voor dagelijkse ondersteuning van uw kind, toegang tot live professionals wanneer nodig, en een familie dashboard om alles centraal te beheren.</p>
                </div>
            </div>
            <Button size="lg" asChild className="mt-10 shadow-md hover:shadow-lg transition-shadow px-8 py-3">
                <Link href="/signup?plan=family_guide_monthly">
                    Start met Gezins Gids
                </Link>
            </Button>
            <p className="text-xs text-muted-foreground mt-3">14 dagen gratis proberen, daarna maandelijks opzegbaar.</p>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
    

