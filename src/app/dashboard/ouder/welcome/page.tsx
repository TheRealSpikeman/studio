// src/app/dashboard/ouder/welcome/page.tsx
"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Sparkles, CheckSquare, FileText, Info, CreditCard, ArrowRight, UserPlus } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle as AlertTitleUi } from "@/components/ui/alert";

const ONBOARDING_KEY_OUDER = 'onboardingCompleted_ouder_v1';

// Dummy user data - in a real app, this would come from context/auth
const currentParent = {
  name: "Ouder Tester", 
};

const actiepunten = [
    {
      id: "ken-je-kind",
      title: 'Doe de "Ken je Kind" Test',
      description: 'Krijg een eerste indruk van de mogelijke neurodivergente kenmerken van uw kind en hoe u hen kunt ondersteunen.',
      icon: FileText,
      link: "/quiz/ouder-symptomen-check", 
      linkText: 'Start "Ken je Kind" Test',
      buttonVariant: 'default' as 'default',
      disabled: false,
    },
    {
      id: "voeg-kind-toe",
      title: 'Voeg uw Kind(eren) Toe',
      description: 'Koppel de accounts van uw kinderen aan uw ouderaccount om hun voortgang te volgen en instellingen te beheren.',
      icon: UserPlus,
      link: "/dashboard/ouder/kinderen",
      linkText: 'Ga naar Mijn Kinderen',
      buttonVariant: 'outline' as 'outline',
      disabled: false,
    },
    {
      id: "bekijk-abonnementen",
      title: 'Ontdek onze Abonnementen',
      description: 'Kies het plan dat het beste bij uw gezin past voor volledige toegang tot coaching, tools en 1-op-1 begeleiding.',
      icon: CreditCard,
      link: "/#pricing",
      linkText: 'Bekijk Abonnementen',
      buttonVariant: 'outline' as 'outline',
      disabled: false,
    },
  ];

export default function OuderWelcomePage() {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleCompleteOnboarding = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(ONBOARDING_KEY_OUDER, 'true');
    }
    router.push('/dashboard/ouder');
  };
  
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-3xl text-center">
        <Sparkles className="mx-auto h-14 w-14 text-primary mb-4" />
        <h1 className="text-3xl font-bold text-foreground">
          Welkom bij MindNavigator, {currentParent.name}!
        </h1>
        <p className="text-lg text-muted-foreground mt-2 mb-8">
          Wij helpen u uw kind beter te begrijpen en te ondersteunen op hun pad naar zelfontdekking en groei.
        </p>
        
        <p className="text-base text-foreground/90 leading-relaxed mb-10">
          Als ouder speelt u een cruciale rol. MindNavigator biedt u de tools en inzichten om uw kind(eren) optimaal te begeleiden. Hier zijn een paar belangrijke eerste stappen:
        </p>
        
        <Accordion type="single" collapsible className="w-full space-y-4 text-left mb-10">
          {actiepunten.map((item, index) => (
            <AccordionItem 
              key={item.id} 
              value={item.id} 
              className="bg-card border shadow-md rounded-lg data-[state=open]:shadow-xl"
            >
              <AccordionTrigger className="p-6 text-lg font-semibold hover:no-underline data-[state=open]:text-primary [&[data-state=open]>svg]:text-primary">
                <div className="flex items-center gap-3">
                  <item.icon className="h-7 w-7 text-primary" />
                  {item.title}
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-6 pt-0">
                <p className="text-sm text-muted-foreground mb-4">{item.description}</p>
                <Button asChild variant={item.buttonVariant} className="w-full sm:w-auto" disabled={item.disabled}>
                  <Link href={item.link}>
                    {item.linkText} <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200 text-left mb-10 shadow">
          <h3 className="text-lg font-semibold text-blue-700 mb-2 flex items-center gap-2">
            <Info className="h-5 w-5" />
            Belangrijk om te weten
          </h3>
          <ul className="list-disc list-inside text-sm text-blue-800 space-y-1 pl-2">
            <li>MindNavigator is een tool voor zelfinzicht en biedt <strong>geen</strong> medische diagnoses.</li>
            <li>Privacy van u en uw kind staat voorop. Beheer toestemmingen in uw dashboard.</li>
            <li>Resultaten en inzichten zijn bedoeld als startpunt voor gesprek en begrip.</li>
          </ul>
        </div>
        
        <div className="flex flex-col items-center gap-3">
           <Button onClick={handleCompleteOnboarding} className="w-full max-w-xs" size="lg">
            Doorgaan naar mijn Ouder Dashboard
          </Button>
          <Link href="/for-parents" className="text-xs text-primary hover:underline">
            Meer informatie voor ouders
          </Link>
        </div>
      </div>
    </div>
  );
}
