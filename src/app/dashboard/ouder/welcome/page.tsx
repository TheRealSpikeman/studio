// src/app/dashboard/ouder/welcome/page.tsx
"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { FileText, Info, CreditCard, ArrowRight, UserPlus, Edit } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle as AlertTitleUi } from "@/components/ui/alert";
import { AddChildForm, type AddChildFormData } from '@/components/ouder/AddChildForm'; // Importeer AddChildForm
import { useToast } from '@/hooks/use-toast'; // Importeer useToast

const ONBOARDING_KEY_OUDER = 'onboardingCompleted_ouder_v1';

const currentParent = {
  name: "Ouder Tester", 
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
      id: "voeg-kind-toe", // Dit item krijgt nu het formulier
      title: 'Voeg uw Kind(eren) Toe',
      description: 'Koppel de accounts van uw kinderen aan uw ouderaccount om hun voortgang te volgen en instellingen te beheren. U ontvangt een e-mail om de uitnodiging te bevestigen. Na activatie kunt u de profielinformatie van uw kind verder aanvullen.',
      icon: UserPlus,
      // Link en linkText zijn niet meer nodig voor de knop binnen dit item
    },
    {
      id: "bekijk-abonnementen",
      title: 'Ontdek onze Abonnementen',
      description: 'Kies het plan dat het beste bij uw gezin past voor volledige toegang tot coaching, tools en 1-op-1 begeleiding. Start met een gratis proefperiode voor elk betaald plan.',
      icon: CreditCard,
      link: "/#pricing",
      linkText: 'Bekijk Abonnementen & Start Proef',
      buttonVariant: 'outline' as 'outline',
      disabled: false,
    },
  ];

export default function OuderWelcomePage() {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const { toast } = useToast();
  const [addChildFormKey, setAddChildFormKey] = useState(0); // Key om AddChildForm te resetten

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleCompleteOnboarding = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(ONBOARDING_KEY_OUDER, 'true');
    }
    router.push('/dashboard/ouder');
  };

  const handleSaveChildOnWelcome = (data: AddChildFormData) => {
    console.log("Kind toegevoegd via welkomstpagina (simulatie):", data);
    // TODO: Hier zou de logica komen om het kind daadwerkelijk toe te voegen aan de backend.
    // En om een uitnodigingsmail te sturen.
    toast({
      title: "Kind Succesvol Toegevoegd (Simulatie)",
      description: `${data.firstName} ${data.lastName} is toegevoegd. Een uitnodigingsmail is (gesimuleerd) verstuurd naar ${data.childEmail}. U kunt hieronder nog een kind toevoegen of doorgaan.`,
      duration: 8000,
    });
    setAddChildFormKey(prevKey => prevKey + 1); // Forceer re-render van AddChildForm
  };
  
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
                    key={addChildFormKey} // Om reset mogelijk te maken
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
