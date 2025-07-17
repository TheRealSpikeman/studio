
// src/app/pricing/page.tsx
"use client";

import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { CheckCircle2, Users, CreditCard, Sparkles, Star, HelpCircle, User as UserIcon, ArrowRight, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { type SubscriptionPlan, type AppFeature, getSubscriptionPlans, getAllFeatures } from '@/types/subscription';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';

const faqItems = [
  {
    question: "Zijn alle features inbegrepen in elk plan?",
    answer: "Ja, alle abonnementen geven volledige toegang tot alle huidige en toekomstige digitale tools, coaching content, het ouder-dashboard en toegang tot ons expert netwerk.",
  },
  {
    question: "Zijn 1-op-1 coaching of tutoring sessies inbegrepen?",
    answer: "Nee, live 1-op-1 sessies worden apart betaald (indicatie: €25-125/uur afhankelijk van specialist). Elk abonnement geeft u toegang tot onze marktplaats om deze professionals te vinden, te boeken en te betalen.",
  },
  {
    question: "Kan ik mijn abonnement op elk moment wijzigen of opzeggen?",
    answer: "Ja, u kunt op elk moment van plan wisselen via uw accountinstellingen, bijvoorbeeld als uw gezinssituatie verandert. Opzeggen kan ook maandelijks.",
  },
  {
    question: "Is er een proefperiode?",
    answer: "Ja, elk betaald abonnement start met een gratis proefperiode van 14 dagen. U kunt in deze periode alles uitproberen en kosteloos opzeggen.",
  },
];

const getPlanIcon = (planId: string): React.ElementType => {
    if (planId.includes('gezin') || (planId.match(/(\d+)/)?.[0] || '1') > '1') return Users;
    return UserIcon;
};

const calculatePrice = (plan: SubscriptionPlan, interval: 'month' | 'year'): number => {
    const parentPrice = plan.pricePerMonthParent || 0;
    const childPrice = plan.pricePerMonthChild || 0;
    const monthlyTotal = parentPrice + (childPrice * (plan.maxChildren || 1));

    if (interval === 'year') {
        const discount = plan.yearlyDiscountPercent || 0;
        return (monthlyTotal * 12 * (1 - discount / 100)) / 12; // Price per month for yearly plan
    }
    return monthlyTotal;
};

export default function PricingPage() {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [allAppFeatures, setAllAppFeatures] = useState<AppFeature[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [billingInterval, setBillingInterval] = useState<'month' | 'year'>('month');

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      const [fetchedPlans, fetchedFeatures] = await Promise.all([
          getSubscriptionPlans(),
          getAllFeatures()
      ]);
      
      const sortedPlans = fetchedPlans
        .filter(p => p.active)
        .sort((a, b) => (a.maxChildren || 0) - (b.maxChildren || 0));
        
      setPlans(sortedPlans);
      setAllAppFeatures(fetchedFeatures);
      setIsLoading(false);
    }
    fetchData();
  }, []);

  const handlePlanSelection = (planId: string) => {
    const planWithInterval = billingInterval === 'year' ? `${planId}_yearly` : `${planId}_monthly`;
    const targetUrl = `/signup?plan=${planWithInterval}`;
    window.location.href = targetUrl;
  };

  if (isLoading) {
    return <div className="flex h-screen items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /> Plannen laden...</div>;
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-gradient-to-b from-background via-secondary/5 to-background">
        <section className="py-12 md:py-20 lg:py-28 text-center">
          <div className="container">
             <div className="mb-12 md:mb-16">
                <CreditCard className="mx-auto h-16 w-16 text-primary mb-4" />
                <h1 className="text-4xl font-bold tracking-tight text-foreground md:text-5xl">
                    Eenvoudig & Transparant
                </h1>
                <p className="mt-3 text-lg text-muted-foreground max-w-3xl mx-auto">
                    Kies het plan dat past bij uw gezin en krijg direct volledige toegang.
                </p>
                <div className="flex items-center justify-center space-x-3 mt-8">
                  <Label htmlFor="billing-toggle" className={cn(billingInterval === 'month' ? 'text-primary font-semibold' : 'text-muted-foreground')}>Maandelijks</Label>
                  <Switch
                    id="billing-toggle"
                    checked={billingInterval === 'year'}
                    onCheckedChange={(checked) => setBillingInterval(checked ? 'year' : 'month')}
                  />
                  <Label htmlFor="billing-toggle" className={cn(billingInterval === 'year' ? 'text-primary font-semibold' : 'text-muted-foreground')}>
                    Jaarlijks
                    {plans.find(p => p.yearlyDiscountPercent && p.yearlyDiscountPercent > 0) && (
                      <Badge variant="success" className="ml-2 bg-green-100 text-green-700 border-green-300">
                         Bespaar {plans.find(p => p.yearlyDiscountPercent && p.yearlyDiscountPercent > 0)?.yearlyDiscountPercent}%
                      </Badge>
                    )}
                  </Label>
                </div>
            </div>
          </div>
        </section>

        <section className="pb-12 md:pb-20"> 
          <div className="container">
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 items-stretch justify-center">
                {plans.map((plan) => {
                  const Icon = getPlanIcon(plan.id);
                  const displayPrice = calculatePrice(plan, billingInterval);
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
                        €{displayPrice.toFixed(2).replace('.',',')}
                      </p>
                      <p className="text-sm font-normal text-muted-foreground -mt-1 h-5"> 
                         per maand
                      </p>
                      {plan.trialPeriodDays && plan.trialPeriodDays > 0 && (
                          <p className="text-xs text-green-600 font-medium mt-1">{plan.trialPeriodDays} dagen gratis proberen!</p>
                      )}
                    </CardHeader>
                    <CardContent className="flex-grow space-y-3 mt-1 px-4 sm:px-6">
                      <p className="mb-3 text-sm text-muted-foreground">{plan.description}</p>
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
        </section>

         <section className="py-12 md:py-16">
            <div className="container max-w-4xl">
              <Card className="bg-muted/30">
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl">Alle abonnementen bevatten volledige toegang:</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-muted-foreground">
                  {allAppFeatures.map(feature => (
                    <div key={feature.id} className="flex items-start gap-3">
                       <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                       <span>{feature.label}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </section>

        <section className="pt-12 md:pt-16 pb-12 md:pb-16 bg-secondary/20"> 
          <div className="container max-w-3xl">
            <h2 className="text-2xl font-semibold text-primary mb-4 flex items-center gap-3">
              <HelpCircle className="h-7 w-7" />
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
