// src/app/dashboard/ouder/welcome/page.tsx
"use client";

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { FileText, Info, CreditCard, ArrowRight, UserPlus, ShieldCheck, Sparkles, Users, Star, CheckCircle2 } from 'lucide-react';
import { Alert, AlertDescription as AlertDescUi, AlertTitle as AlertTitleUi } from "@/components/ui/alert";
import { AddChildForm, type AddChildFormData } from '@/components/ouder/AddChildForm';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

const ONBOARDING_KEY_OUDER = 'onboardingCompleted_ouder_v1';

const currentParent = {
  name: "Ouder Tester", 
};

interface PlanDisplayDetails {
  id: string;
  name: string;
  shortDescription: string;
  icon: React.ElementType;
  ctaText: string;
  ctaBaseLink: string;
  colorClass?: string;
  price?: string; 
  features?: string[];
  maxChildrenText: string;
}

const welcomePagePlans: PlanDisplayDetails[] = [
  {
    id: 'free_start',
    name: 'Gratis Ontdekking',
    icon: Sparkles,
    shortDescription: 'Basis zelfreflectie tool & PDF overzicht.',
    price: 'Gratis',
    features: ['Start-assessment', 'Basis PDF overzicht'],
    ctaText: 'Start gratis',
    ctaBaseLink: '/quizzes',
    colorClass: "border-gray-300 hover:border-gray-400",
    maxChildrenText: "voor 1 kind",
  },
  {
    id: 'family_guide_monthly',
    name: 'Familie Coaching',
    icon: Users,
    shortDescription: 'Coaching, alle tools, en tot 3 kinderen.',
    price: '€19,99/mnd',
    features: ['Alle tools & coaching', 'Tot 3 kinderen', 'Ouder Dashboard'],
    ctaText: 'Kies Familie Coaching',
    ctaBaseLink: '/signup',
    colorClass: "border-primary hover:border-primary/80",
    maxChildrenText: "voor maximaal 3 kinderen",
  },
  {
    id: 'premium_family_monthly',
    name: 'Premium Familie',
    icon: Star,
    shortDescription: 'Alles van Familie Coaching, plus premium features en unlimited kinderen.',
    price: '€39,99/mnd',
    features: ['Alles van Familie Coaching', 'Premium features & support', 'Unlimited kinderen'],
    ctaText: 'Kies Premium',
    ctaBaseLink: '/signup',
    colorClass: "border-accent hover:border-accent/80",
    maxChildrenText: "voor een onbeperkt aantal kinderen",
  },
];

function OuderWelcomePageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [isClient, setIsClient] = useState(false);
  const [addChildFormKey, setAddChildFormKey] = useState(0);

  const planParam = searchParams.get('plan');
  const hasChosenPlan = !!planParam && welcomePagePlans.some(p => p.id === planParam);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleCompleteOnboarding = () => {
    if (!hasChosenPlan) {
      toast({
        title: "Kies eerst een plan",
        description: "Selecteer een abonnement voordat u verder gaat naar het dashboard.",
        variant: "destructive"
      });
      return;
    }
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

  const handlePlanCTAClick = (planId: string, ctaBaseLink: string) => {
    router.push(`${ctaBaseLink}?plan=${planId}`);
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
    },
    {
      id: "voeg-kind-toe",
      title: 'Voeg uw Kind(eren) Toe',
      description: 'Koppel de accounts van uw kinderen aan uw ouderaccount om hun voortgang te volgen en instellingen te beheren. Het kind ontvangt een e-mail om de uitnodiging te bevestigen. Na activatie kunt u de profielinformatie van uw kind verder aanvullen.',
      icon: UserPlus,
    },
    {
      id: "bekijk-abonnementen",
      title: 'Abonnementen & Toegang',
      description: `Kies of bevestig het plan dat het beste bij uw gezin past voor volledige toegang tot coaching, tools en optionele 1-op-1 begeleiding. Elk plan start met een gratis proefperiode.`,
      icon: CreditCard,
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
        
        {!hasChosenPlan && (
           <Alert variant="default" className="mb-6 bg-orange-50 border-orange-300 text-orange-700 text-left">
                <Info className="h-5 w-5 !text-orange-600" />
                <AlertTitleUi className="text-orange-700 font-semibold">Actie Vereist: Kies een Plan</AlertTitleUi>
                <AlertDescUi className="text-orange-600">
                    Om verder te gaan en de andere functies te gebruiken, selecteer hieronder eerst een van onze plannen. U kunt gratis starten om de basis te ontdekken.
                </AlertDescUi>
            </Alert>
        )}
        
        <Accordion type="single" collapsible className="w-full space-y-4 text-left mb-10" defaultValue={!hasChosenPlan ? "bekijk-abonnementen" : (planParam ? "bekijk-abonnementen" : "ken-je-kind")}>
          {actiepuntenBasis.map((item) => (
            <AccordionItem
              key={item.id}
              value={item.id}
              className="bg-card border shadow-md rounded-lg data-[state=open]:shadow-xl"
            >
              <AccordionTrigger 
                className="p-6 text-lg font-semibold hover:no-underline data-[state=open]:text-primary [&[data-state=open]>svg]:text-primary"
                disabled={!hasChosenPlan && item.id !== "bekijk-abonnementen"}
              >
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
                ) : item.id === "bekijk-abonnementen" ? (
                  <div className="space-y-6">
                    {planParam && welcomePagePlans.find(p => p.id === planParam) && (
                        <Alert variant="default" className="bg-green-50 border-green-300 text-green-700">
                            <CheckCircle2 className="h-5 w-5 !text-green-600" />
                            <AlertTitleUi className="text-green-700 font-semibold">Uw voorlopige keuze: {welcomePagePlans.find(p => p.id === planParam)?.name}</AlertTitleUi>
                            <AlertDescUi className="text-green-600">
                                Dit plan staat u toe om {welcomePagePlans.find(p => p.id === planParam)?.maxChildrenText} aan te sluiten.
                                Bevestig hieronder of kies een ander plan.
                            </AlertDescUi>
                        </Alert>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {welcomePagePlans.map(plan => (
                            <Card key={plan.id} className={cn(
                                "flex flex-col text-center transition-all duration-200",
                                plan.colorClass,
                                planParam === plan.id ? "ring-2 ring-primary shadow-2xl scale-105" : "hover:shadow-lg"
                            )}>
                                <CardHeader className="pb-2">
                                    <plan.icon className="mx-auto h-8 w-8 text-primary mb-2"/>
                                    <CardTitle className="text-md font-semibold">{plan.name}</CardTitle>
                                    {plan.price && <p className="text-sm font-bold text-primary">{plan.price}</p>}
                                </CardHeader>
                                <CardContent className="text-xs text-muted-foreground flex-grow space-y-1">
                                  <p className="mb-2">{plan.shortDescription}</p>
                                  <p className="mb-2 font-medium">Max. kinderen: {plan.maxChildrenText}.</p>
                                  {plan.features && plan.features.length > 0 && (
                                    <ul className="list-none p-0 text-left">
                                      {plan.features.map(f => <li key={f} className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-green-500 flex-shrink-0"/>{f}</li>)}
                                    </ul>
                                  )}
                                </CardContent>
                                <CardFooter className="pt-3">
                                    <Button 
                                      size="sm" 
                                      className="w-full" 
                                      variant={planParam === plan.id ? "default" : "outline"}
                                      onClick={() => handlePlanCTAClick(plan.id, plan.ctaBaseLink)}
                                    >
                                      {planParam === plan.id ? "Bevestig & Activeer" : plan.ctaText}
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                  </div>
                ) : (
                  item.link && item.linkText && (
                    <Button asChild variant={item.buttonVariant || 'default'} className="w-full sm:w-auto">
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
           <Button 
            onClick={handleCompleteOnboarding} 
            className="w-full max-w-xs" 
            size="lg"
            disabled={!hasChosenPlan}
          >
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


export default function OuderWelcomePage() {
  return (
    <Suspense fallback={<div>Pagina laden...</div>}>
      <OuderWelcomePageContent />
    </Suspense>
  );
}
