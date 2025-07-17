// src/app/pricing/page.tsx
"use client";

import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { CheckCircle2, Users, Percent, Sparkles, Star, HelpCircle, ExternalLink, ShieldCheck, ListChecks, XCircle, Package, CreditCard, BarChart3, FileText as FileTextIcon, MessageCircleQuestion } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { Tooltip, TooltipProvider, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { SUBSCRIPTION_PLANS, getPlanById, getTierById, getYearlyDiscount, formatPrice, type SubscriptionTier, type AppFeature, DEFAULT_APP_FEATURES } from '@/types/subscription';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';

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
    if (planId.includes('family_guide') || planId.includes('gezin') || planId.includes('family')) return Users;
    if (planId.includes('coaching_tools') || planId.includes('personal')) return Sparkles;
    return Sparkles;
};

const getMonthlyEquivalent = (price: number): string | null => {
    if (price > 0) {
        return (price / 12).toFixed(2);
    }
    return null;
};

const MAX_FEATURES_TO_DISPLAY_ON_CARD = 16;

export default function PricingPage() {
  const router = useRouter();
  const [plans, setPlans] = useState<SubscriptionTier[]>([]);
  const [allAppFeatures, setAllAppFeatures] = useState<AppFeature[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showYearly, setShowYearly] = useState(false);

  useEffect(() => {
    setAllAppFeatures(DEFAULT_APP_FEATURES);
    setPlans(SUBSCRIPTION_PLANS);
    setIsLoading(false);
  }, []);

  const handlePlanSelection = (planId: string) => {
    router.push(`/signup?plan=${planId}`);
  };

  if (isLoading) {
    return <div className="flex h-screen items-center justify-center">Abonnementen laden...</div>;
  }

  const displayablePlans = plans.filter(tier => tier.monthlyPlan.active || tier.yearlyPlan.active);

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
                    Start gratis, of kies een compleet pakket voor de volledige MindNavigator ervaring.
                </p>
                <div className="mt-8 flex justify-center items-center gap-4">
                    <span className={cn(showYearly ? "text-muted-foreground" : "text-foreground font-semibold")}>Maandelijks</span>
                    <Switch
                        checked={showYearly}
                        onCheckedChange={setShowYearly}
                        aria-label="Toggle between monthly and yearly pricing"
                    />
                    <span className={cn(showYearly ? "text-foreground font-semibold" : "text-muted-foreground")}>Jaarlijks</span>
                    <Badge variant="secondary" className="bg-green-100 text-green-700">Bespaar ~15%</Badge>
                </div>
            </div>
          </div>
        </section>

        <section className="pb-12 md:pb-20"> 
          <div className="container">
            <TooltipProvider>
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 items-stretch justify-center">
                {displayablePlans.map((tier) => {
                  const plan = showYearly ? tier.yearlyPlan : tier.monthlyPlan;
                  const Icon = getPlanIcon(plan.id);
                  const monthlyEq = showYearly ? getMonthlyEquivalent(plan.price) : null;

                  if (!plan.active) return null;

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
                      <CardTitle className="text-2xl font-semibold mb-1">{tier.name}</CardTitle>
                      <p className="text-4xl font-bold text-primary">
                        {formatPrice(plan.price, 'EUR', plan.billingInterval)}
                      </p>
                      <p className="text-sm font-normal text-muted-foreground -mt-1 h-5"> 
                         {monthlyEq && <span className="block text-xs">(~{formatPrice(parseFloat(monthlyEq), 'EUR', 'month')}/maand)</span>}
                      </p>
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
                                  <p className="font-semibold mb-2 text-sm">Extra features:</p>
                                  <ul className="list-disc list-inside space-y-1 text-xs">
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
                    <CardFooter className="mt-auto pt-5 pb-6 px-4 sm:px-6">
                      <Button
                        onClick={() => handlePlanSelection(plan.id)}
                        className="w-full h-11 sm:h-12 text-sm sm:text-base font-semibold"
                        variant={plan.isPopular ? 'default' : (plan.id === 'free_start' ? 'outline' : 'secondary')}
                      >
                        {plan.id === 'free_start' ? 'Start gratis' : `Kies ${tier.name}`}
                      </Button>
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
      </main>
      <Footer />
    </div>
  );
}
