
// src/app/pricing/page.tsx
"use client";

import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { CheckCircle2, Users, Percent, Sparkles, Star, HelpCircle, ExternalLink, ShieldCheck, ListChecks, XCircle, Package, CreditCard, BarChart3, FileText as FileTextIcon, MessageCircleQuestion } from 'lucide-react'; // Renamed FileText to FileTextIcon
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';
import type { SubscriptionPlan, AppFeature } from '@/app/dashboard/admin/subscription-management/types'; 
import { DEFAULT_APP_FEATURES, LOCAL_STORAGE_FEATURES_KEY, LOCAL_STORAGE_SUBSCRIPTION_PLANS_KEY, initialDefaultPlans } from '@/app/dashboard/admin/subscription-management/types'; 
import { Tooltip, TooltipProvider, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";


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

const MAX_FEATURES_TO_DISPLAY_ON_CARD = 16;

export default function PricingPage() {
  const router = useRouter();
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [allAppFeatures, setAllAppFeatures] = useState<AppFeature[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load features
    const storedFeaturesRaw = localStorage.getItem(LOCAL_STORAGE_FEATURES_KEY);
    let loadedFeatures = DEFAULT_APP_FEATURES;
    if (storedFeaturesRaw) {
      try {
        loadedFeatures = JSON.parse(storedFeaturesRaw);
      } catch (e) {
        console.error("Error parsing features from localStorage on pricing page, using defaults", e);
        localStorage.setItem(LOCAL_STORAGE_FEATURES_KEY, JSON.stringify(DEFAULT_APP_FEATURES));
      }
    } else {
      localStorage.setItem(LOCAL_STORAGE_FEATURES_KEY, JSON.stringify(DEFAULT_APP_FEATURES));
    }
    setAllAppFeatures(loadedFeatures);

    // Load plans
    const storedPlansRaw = localStorage.getItem(LOCAL_STORAGE_SUBSCRIPTION_PLANS_KEY);
    let activePlans: SubscriptionPlan[] = [];
    if (storedPlansRaw) {
      try {
        const parsedPlans: SubscriptionPlan[] = JSON.parse(storedPlansRaw);
        activePlans = parsedPlans.filter(p => p.active).map(plan => {
          const migratedFeatureAccess: Record<string, boolean> = {};
          loadedFeatures.forEach(appFeature => { 
            migratedFeatureAccess[appFeature.id] = (plan.featureAccess && typeof plan.featureAccess[appFeature.id] === 'boolean')
              ? plan.featureAccess[appFeature.id]
              : false;
          });
          return {
            ...plan,
            shortName: plan.shortName ?? '',
            featureAccess: migratedFeatureAccess,
            trialPeriodDays: plan.trialPeriodDays ?? (plan.price === 0 ? 0 : 14),
            maxChildren: plan.maxChildren ?? (plan.id.includes('family_guide') ? 3 : (plan.price === 0 ? 1 : 0)),
            isPopular: plan.isPopular ?? false,
            tagline: plan.tagline ?? '',
          };
        });
      } catch (e) {
        console.error("Error parsing plans from localStorage on pricing page, using defaults", e);
        activePlans = initialDefaultPlans.filter(p => p.active).map(plan => ({
            ...plan,
            shortName: plan.shortName ?? '',
            featureAccess: Object.fromEntries(loadedFeatures.map(f => [f.id, plan.featureAccess?.[f.id] || false])), 
             isPopular: plan.isPopular ?? false,
             tagline: plan.tagline ?? '',
        }));
        localStorage.setItem(LOCAL_STORAGE_SUBSCRIPTION_PLANS_KEY, JSON.stringify(initialDefaultPlans));
      }
    } else {
      activePlans = initialDefaultPlans.filter(p => p.active).map(plan => ({
            ...plan,
            shortName: plan.shortName ?? '',
            featureAccess: Object.fromEntries(loadedFeatures.map(f => [f.id, plan.featureAccess?.[f.id] || false])),
             isPopular: plan.isPopular ?? false,
             tagline: plan.tagline ?? '',
        }));
      localStorage.setItem(LOCAL_STORAGE_SUBSCRIPTION_PLANS_KEY, JSON.stringify(initialDefaultPlans));
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
            p.id.replace('_monthly', '_monthly') === plan.id.replace('_monthly', '_monthly') &&
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
            p.id.replace('_monthly', '_monthly') === plan.id.replace('_monthly', '_monthly') &&
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
        <section className="py-12 md:py-20 lg:py-28 text-center">
          <div className="container">
             <div className="mb-12 md:mb-16">
                <CreditCard className="mx-auto h-16 w-16 text-primary mb-4" />
                <h1 className="text-4xl font-bold tracking-tight text-foreground md:text-5xl">
                    Kies het plan dat bij uw gezin past
                </h1>
                <p className="mt-3 text-lg text-muted-foreground max-w-3xl mx-auto">
                    Start gratis om de basis te ontdekken, of kies een compleet pakket voor de volledige MindNavigator ervaring. Registratie en beheer via uw ouderaccount. Elk pad begint met een waardevolle, persoonlijke assessment voor uw kind.
                    {plans.some(p => p.trialPeriodDays && p.trialPeriodDays > 0 && p.price > 0) && (
                    <span className="block mt-2 font-semibold text-primary">Alle betaalde plannen starten met een gratis proefperiode!</span>
                    )}
                </p>
            </div>
          </div>
        </section>

        <section className="pb-12 md:pb-20"> 
          <div className="container">
            <TooltipProvider>
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 items-stretch">
                {displayPlans.map((plan) => {
                  const Icon = getPlanIcon(plan.id);
                  const yearlyOptionText = getPlanYearlyOptionText(plan);
                  const yearlySavingsHighlight = getPlanYearlySavingsHighlight(plan);
                  const yearlyPlanId = getYearlyPlanIdForMonthly(plan.id);

                  const activeFeaturesForPlan = allAppFeatures.filter(
                    (appFeature) => plan.featureAccess && plan.featureAccess[appFeature.id]
                  );
                  const featuresToDisplayOnCard = activeFeaturesForPlan.slice(0, MAX_FEATURES_TO_DISPLAY_ON_CARD);
                  const hiddenFeaturesCount = activeFeaturesForPlan.length - featuresToDisplayOnCard.length;
                  const hasMoreFeaturesThanDisplayed = hiddenFeaturesCount > 0;

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
                      {plan.tagline && (
                        <p className="text-xs text-green-600 font-medium mt-1">{plan.tagline}</p>
                      )}
                    </CardHeader>
                    <CardContent className="flex-grow space-y-3 mt-1 px-4 sm:px-6">
                      <p className="mb-3 text-sm text-muted-foreground">{plan.description}</p>
                      <ul className="space-y-0.5">
                        {featuresToDisplayOnCard.map((appFeature) => (
                              <li key={appFeature.id} className="flex items-start text-left">
                              <CheckCircle2 className="mr-2 mt-[3px] h-4 w-4 flex-shrink-0 text-green-500" />
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
                                    ... en {hiddenFeaturesCount} andere feature{hiddenFeaturesCount > 1 ? 's' : ''}!
                                  </span>
                                </TooltipTrigger>
                                <TooltipContent className="w-64 bg-popover p-3 rounded-md shadow-lg border text-popover-foreground">
                                  <p className="font-semibold mb-2">Extra features:</p>
                                  <ul className="list-disc list-inside space-y-1 text-sm">
                                    {activeFeaturesForPlan.slice(MAX_FEATURES_TO_DISPLAY_ON_CARD).map(hf => <li key={hf.id}>{hf.label}</li>)}
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
                    <CardFooter className="mt-auto pt-5 pb-6 px-4 sm:px-6 flex flex-col gap-2.5">
                      <Button
                        onClick={() => handlePlanSelection(plan.id)}
                        className="w-full h-11 sm:h-12 text-sm sm:text-base font-semibold"
                        variant={plan.isPopular ? 'default' : (plan.id === 'free_start' ? 'outline' : 'secondary')}
                      >
                        {plan.id === 'free_start' ? 'Start gratis ontdekking' : `Kies ${plan.name.replace(' - Maandelijks', '')}`}
                      </Button>
                      {yearlyOptionText && yearlyPlanId && (
                        <div className="text-center mt-1.5 w-full">
                          <Button
                            onClick={() => handlePlanSelection(yearlyPlanId)}
                            variant="link"
                            className="h-auto text-xs text-primary py-1 px-2 text-center flex-wrap justify-center items-baseline leading-tight"
                          >
                            <span>{yearlyOptionText}</span>
                            {yearlySavingsHighlight && (
                              <span className="text-accent font-semibold ml-1 whitespace-nowrap">- {yearlySavingsHighlight}</span>
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

        <section className="pt-12 md:pt-16 pb-12 md:pb-16 bg-secondary/20"> 
          <div className="container max-w-3xl">
            <h2 className="text-2xl font-semibold text-primary mb-4 flex items-center gap-3">
              <MessageCircleQuestion className="h-7 w-7" />
              Veelgestelde Vragen
            </h2>
            <Accordion type="single" collapsible className="w-full space-y-4">
              {faqItems.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`faq-${index}`}
                  className="bg-card rounded-lg shadow-sm border"
                >
                  <AccordionTrigger className="text-left text-lg hover:no-underline font-medium text-foreground py-5 px-6 data-[state=open]:text-primary [&[data-state=open]>svg]:text-primary">
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

        <section className="pt-12 md:pt-16 pb-12 md:pb-16"> 
          <div className="container max-w-4xl text-center">
             <h2 className="text-2xl font-semibold text-primary mb-4 flex items-center gap-3 justify-center">
               <ShieldCheck className="h-7 w-7" /> Onze Garanties
            </h2>
            <div className="grid md:grid-cols-3 gap-8 text-left mt-6">
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

        <section className="pt-12 md:pt-16 pb-12 md:pb-20 bg-primary/5"> 
          <div className="container max-w-4xl text-center">
            <h2 className="text-2xl font-semibold text-primary mb-4 flex items-center gap-3 justify-center">
              <Percent className="h-7 w-7" /> Waarom MindNavigator?
            </h2>
            <div className="grid md:grid-cols-3 gap-6 text-left mt-6">
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
