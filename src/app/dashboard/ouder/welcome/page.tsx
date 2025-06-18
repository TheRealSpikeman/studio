// src/app/dashboard/ouder/welcome/page.tsx
"use client";

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation'; // Importeren useSearchParams
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { FileText, Info, CreditCard, ArrowRight, UserPlus, Edit } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle as AlertTitleUi } from "@/components/ui/alert";
import { AddChildForm, type AddChildFormData } from '@/components/ouder/AddChildForm';
import { useToast } from '@/hooks/use-toast';

const ONBOARDING_KEY_OUDER = 'onboardingCompleted_ouder_v1';

const currentParent = {
  name: "Ouder Tester",
};

const planNames: { [key: string]: string } = {
  coaching_tools_monthly: "Coaching & Tools - Maandelijks",
  coaching_tools_yearly: "Coaching & Tools - Jaarlijks",
  family_guide_monthly: "Gezins Gids - Maandelijks",
  family_guide_yearly: "Gezins Gids - Jaarlijks",
  premium_family_monthly: "Premium Familie - Maandelijks",
  premium_family_yearly: "Premium Familie - Jaarlijks",
  free_start: "Gratis Ontdekking"
};

export default function OuderWelcomePage() {
  const router = useRouter();
  const searchParams = useSearchParams(); // Hook gebruiken
  const { toast } = useToast();
  const [isClient, setIsClient] = useState(false);
  const [addChildFormKey, setAddChildFormKey] = useState(0);
  const [currentPlanName, setCurrentPlanName] = useState<string | null>(null);

  useEffect(() => {
    setIsClient(true);
    const planParam = searchParams.get('plan');
    if (planParam && planNames[planParam]) {
      setCurrentPlanName(planNames[planParam]);
    }
  }, [searchParams]);

  const handleCompleteOnboarding = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(ONBOARDING_KEY_OUDER, 'true');
    }
    router.push('/dashboard/ouder');
  };

  const handleSaveChildOnWelcome = (data: AddChildFormData) => {
    console.log("Kind toegevoegd via welkomstpagina (simulatie):", data);
    toast({
      title: "Kind Succesvol Toegevoegd (Simulatie)",
      description: `${data.firstName} ${data.lastName} is toegevoegd. Een uitnodigingsmail is (gesimuleerd) verstuurd naar ${data.childEmail}. U kunt hieronder nog een kind toevoegen of doorgaan.`,
      duration: 8000,
    });
    setAddChildFormKey(prevKey => prevKey + 1);
  };

  const actiepuntenBasis = [
    {
      id: "ken-je-kind",
      title: 'Doe de "Ken je Kind" Test',
      description: 'Krijg een eerste indruk van de mogelijke neurodivergente kenmerken van uw kind en hoe u hen kunt ondersteunen. Dit helpt u ook bij het invullen van het profiel van uw kind.',
      icon: FileText,
      link: "/quiz/ouder-symptomen-check",
      linkText: 'Start "Ken je Kind" Test',
      buttonVariant: 'default' as 'default',
      disabled: false,
    },
    {
      id: "voeg-kind-toe",
      title: 'Voeg uw Kind(eren) Toe',
      description: 'Koppel de accounts van uw kinderen aan uw ouderaccount om hun voortgang te volgen en instellingen te beheren. U ontvangt een e-mail om de uitnodiging te bevestigen. Na activatie kunt u de profielinformatie van uw kind verder aanvullen.',
      icon: UserPlus,
    },
    {
      id: "bekijk-abonnementen",
      title: currentPlanName ? `Activeer je Gekozen Plan: ${currentPlanName}` : 'Ontdek onze Abonnementen',
      description: currentPlanName
        ? `Je hebt aangegeven interesse te hebben in het "${currentPlanName}" abonnement. Voltooi de activatie en start de proefperiode.`
        : 'Kies het plan dat het beste bij uw gezin past voor volledige toegang tot coaching, tools en 1-op-1 begeleiding. Start met een gratis proefperiode voor elk betaald plan.',
      icon: CreditCard,
      link: `/#pricing${currentPlanName ? '?selectedPlan=' + searchParams.get('plan') : ''}`, // Link naar pricing, evt. met parameter
      linkText: currentPlanName ? `Activeer ${currentPlanName}` : 'Bekijk Abonnementen & Start Proef',
      buttonVariant: (currentPlanName ? 'default' : 'outline') as 'default' | 'outline',
      disabled: false,
    },
  ];

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-3xl text-center">
        <h1 className="text-3xl font-bold text-foreground mb-4">
          Welkom bij MindNavigator, {currentParent.name}!
        </h1>
        <p className="text-lg text-muted-foreground mt-2 mb-8">
          Wij helpen u uw kind beter te begrijpen en te ondersteunen op hun pad naar zelfontdekking en groei.
        </p>
        <p className="text-base text-foreground/90 leading-relaxed mb-10">
          Als ouder speelt u een cruciale rol. MindNavigator biedt u de tools en inzichten om uw kind(eren) optimaal te begeleiden. Hier zijn een paar belangrijke eerste stappen:
        </p>
        <Accordion type="single" collapsible className="w-full space-y-4 text-left mb-10">
          {actiepuntenBasis.map((item) => (
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
                {item.id === "voeg-kind-toe" ? (
                  <AddChildForm
                    key={addChildFormKey}
                    onSave={handleSaveChildOnWelcome}
                    onCancel={() => { /* Blijf in het accordeon, reset wordt afgehandeld door key */ }}
                  />
                ) : (
                  item.link && item.linkText && (
                    <Button asChild variant={item.buttonVariant || 'default'} className="w-full sm:w-auto" disabled={item.disabled}>
                      <Link href={item.link}>
                        {item.linkText} <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  )
                )}
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
