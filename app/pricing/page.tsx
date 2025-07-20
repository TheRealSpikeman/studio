// src/app/pricing/page.tsx
"use client";

import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { CreditCard, HelpCircle, ArrowRight, Loader2 } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { getSubscriptionPlans } from '@/services/subscriptionService';
import { getAllTools } from '@/services/toolService';
import { PricingTable } from '@/components/pricing/PricingTable';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ToolShowcase } from '@/components/pricing/ToolShowcase';
import type { SubscriptionPlan, PlatformTool } from '@/types/subscription';

const faqItems = [
  {
    question: "Zijn alle tools inbegrepen in elk betaald plan?",
    answer: "Ja, alle betaalde abonnementen ('Gezins Gids') geven volledige toegang tot alle huidige en toekomstige digitale tools, de coaching hub en het ouder-dashboard.",
  },
  {
    question: "Zijn 1-op-1 coaching of tutoring sessies inbegrepen?",
    answer: "Nee, live 1-op-1 sessies worden apart betaald. Het tarief wordt bepaald door de professional zelf. Elk abonnement geeft u toegang tot onze marktplaats om deze professionals te vinden, te boeken en te betalen.",
  },
  {
    question: "Kan ik mijn abonnement op elk moment wijzigen of opzeggen?",
    answer: "Ja, u kunt op elk moment van plan wisselen via uw accountinstellingen, bijvoorbeeld als uw gezinssituatie verandert. Opzeggen kan maandelijks (voor maandabonnementen) of jaarlijks (voor jaarabonnementen).",
  },
  {
    question: "Is er een proefperiode?",
    answer: "Ja, elk betaald abonnement start met een gratis proefperiode van 14 dagen. U kunt in deze periode alles uitproberen en kosteloos opzeggen als het niet bevalt.",
  },
];

export default function PricingPage() {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [tools, setTools] = useState<PlatformTool[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      const [fetchedPlans, fetchedTools] = await Promise.all([
        getSubscriptionPlans(),
        getAllTools()
      ]);
      setPlans(fetchedPlans);
      setTools(fetchedTools);
      setIsLoading(false);
    }
    fetchData();
  }, []);

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
                    Kies het plan dat past bij uw gezin en krijg direct volledige toegang. Alle plannen zijn maandelijks opzegbaar en starten met een gratis proefperiode van 14 dagen.
                </p>
            </div>
          </div>
        </section>

        <section className="pb-12 md:pb-20"> 
          <div className="container">
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <PricingTable 
                initialPlans={plans.filter(p => p.active)}
                tools={tools}
              />
            )}
          </div>
        </section>

        <ToolShowcase tools={tools} />

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
                  <AccordionTrigger className="text-left text-lg hover:no-underline font-medium text-foreground py-5 px-6 data-[state=open]:text-primary [&[data-state=open]>svg]:text-primary [&[data-state=open]>svg]:rotate-180 transition-all">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed px-6 pb-5 pt-0 bg-card rounded-b-lg text-base data-[state=open]:bg-muted/20">
                    <div dangerouslySetInnerHTML={{ __html: faq.answer }} />
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
