// src/app/dashboard/ouder/welcome/page.tsx
"use client";

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { FileText, Info, CreditCard, ArrowRight, UserPlus, ShieldCheck, Sparkles, Users, Star, CheckCircle2, HelpCircle } from 'lucide-react';
import { Alert, AlertDescription as AlertDescUi, AlertTitle as AlertTitleUi } from "@/components/ui/alert";
import { AddChildForm, type AddChildFormData } from '@/components/ouder/AddChildForm';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import type { ElementType } from 'react';


const ONBOARDING_KEY_OUDER = 'onboardingCompleted_ouder_v1';

const currentParent = {
  name: "Ouder Tester", 
};

interface PlanDisplayDetails {
  id: string;
  name: string;
  shortDescription: string;
  icon: ElementType;
  ctaText: string;
  ctaBaseLink: string;
  colorClass?: string;
  price?: string; 
  features?: string[];
  maxChildrenText: string;
  isPopular?: boolean;
  highlightClass?: string;
  yearlyOptionText?: string;
  yearlySavingsHighlight?: string;
}

const yearlyCoachingPrice = (19.99 * 12 * 0.85).toFixed(2); 
const monthlyEquivalentForYearlyCoaching = (parseFloat(yearlyCoachingPrice) / 12).toFixed(2);
const yearlySavingsCoaching = ((19.99 * 12) - parseFloat(yearlyCoachingPrice)).toFixed(2);

const yearlyPremiumPrice = (39.99 * 12 * 0.85).toFixed(2); 
const monthlyEquivalentForYearlyPremium = (parseFloat(yearlyPremiumPrice) / 12).toFixed(2);
const yearlySavingsPremium = ((39.99 * 12) - parseFloat(yearlyPremiumPrice)).toFixed(2);

const planDetailsMap: Record<string, PlanDisplayDetails> = {
  'free_start': {
    id: 'free_start',
    name: 'Gratis Ontdekking',
    icon: Sparkles,
    shortDescription: 'Basis zelfreflectie tool & PDF overzicht.',
    price: 'Gratis',
    features: ['Start-assessment', 'Wekelijkse motivatie-email', 'Basis zelfreflectie tool (beperkt)', 'Sample coaching content (5 voorbeeldberichten)', 'Basis PDF overzicht van sterke punten', 'Browse coaches & tutors (profielen bekijken)', 'Tarieven en specialisaties zien', 'Geen sessies boeken', 'Account beheer en basisinstellingen', 'Geen voortgangsanalytics'],
    ctaText: 'Gratis Gekozen',
    ctaBaseLink: '/quizzes',
    colorClass: "border-gray-300 hover:border-gray-400",
    maxChildrenText: "1 kind",
  },
  'family_guide_monthly': {
    id: 'family_guide_monthly',
    name: 'Familie Coaching - Maandelijks',
    icon: Users,
    shortDescription: 'Coaching, alle tools, en tot 3 kinderen.',
    price: '€19,99',
    features: ['Alle tools & coaching', 'Tot 3 kinderen', 'Ouder Dashboard', 'Voortgang volgen'],
    ctaText: 'Kies Familie Coaching',
    ctaBaseLink: '/signup',
    isPopular: true,
    highlightClass: "border-primary ring-2 ring-primary/50",
    colorClass: "border-primary hover:border-primary/80",
    yearlyOptionText: `Of kies jaarlijks: €${yearlyCoachingPrice}/jaar (€${monthlyEquivalentForYearlyCoaching}/mnd)`,
    yearlySavingsHighlight: `bespaar €${yearlySavingsCoaching}`,
    maxChildrenText: "maximaal 3 kinderen",
  },
   'family_guide_yearly': { 
    id: 'family_guide_yearly',
    name: 'Familie Coaching - Jaarlijks',
    icon: Users,
    shortDescription: 'Coaching, alle tools, en tot 3 kinderen met jaarkorting.',
    price: `€${yearlyCoachingPrice}/jaar`,
    features: ['Alle tools & coaching (15% korting)', 'Tot 3 kinderen', 'Ouder Dashboard', 'Voortgang volgen'],
    ctaText: 'Kies Jaarlijks Familie Coaching',
    ctaBaseLink: '/signup',
    isPopular: false,
    colorClass: "border-primary hover:border-primary/80",
    maxChildrenText: "maximaal 3 kinderen",
  },
  'premium_family_monthly': {
    id: 'premium_family_monthly',
    name: 'Premium Familie - Maandelijks',
    icon: Star,
    shortDescription: 'Alles van Familie Coaching, plus premium features en onbeperkt kinderen.',
    price: '€39,99',
    features: ['Alles van Familie Coaching', 'Premium features & support', 'Onbeperkt kinderen', 'Maandelijkse familie coaching calls'],
    ctaText: 'Kies Premium',
    ctaBaseLink: '/signup',
    colorClass: "border-accent hover:border-accent/80",
    yearlyOptionText: `Of kies jaarlijks: €${yearlyPremiumPrice}/jaar (€${monthlyEquivalentForYearlyPremium}/mnd)`,
    yearlySavingsHighlight: `bespaar €${yearlySavingsPremium}`,
    maxChildrenText: "een onbeperkt aantal kinderen",
  },
  'premium_family_yearly': { 
    id: 'premium_family_yearly',
    name: 'Premium Familie - Jaarlijks',
    icon: Star,
    shortDescription: 'Alles van Familie Coaching, plus premium features en onbeperkt kinderen met jaarkorting.',
    price: `€${yearlyPremiumPrice}/jaar`,
    features: ['Alles van Familie Coaching (15% korting)', 'Premium features & support', 'Onbeperkt kinderen', 'Maandelijkse familie coaching calls'],
    ctaText: 'Kies Jaarlijks Premium',
    ctaBaseLink: '/signup',
    colorClass: "border-accent hover:border-accent/80",
    maxChildrenText: "een onbeperkt aantal kinderen",
  },
};


interface Actiepunt {
  id: string;
  title: string;
  description: string;
  icon: ElementType;
  link?: string;
  linkText?: string;
  buttonVariant?: "default" | "outline" | "secondary" | "ghost" | "link" | null | undefined;
}

function OuderWelcomePageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [isClient, setIsClient] = useState(false);
  const [addChildFormKey, setAddChildFormKey] = useState(0);

  const planParam = searchParams.get('plan');
  const hasChosenPlan = !!planParam && !!planDetailsMap[planParam];

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

  const handlePlanCTAClick = (planId: string) => {
    const newUrl = new URL(window.location.href);
    newUrl.searchParams.set('plan', planId);
    window.history.pushState({ path: newUrl.href }, '', newUrl.href);
    router.replace(newUrl.href, { scroll: false });
  };
  
  const getAbonnementActiepunt = (): Actiepunt => {
    const gekozenPlanDetails = planParam && planDetailsMap[planParam];
    let title = "Abonnementen & Toegang";
    let description = `Kies het plan dat het beste bij uw gezin past voor volledige toegang tot coaching, tools en optionele 1-op-1 begeleiding. Elk plan start met een gratis proefperiode.`;
    
    if (gekozenPlanDetails) {
      title = gekozenPlanDetails.id === 'free_start' 
        ? "Je Gebruikt het Gratis Start Plan" 
        : `Actief Plan (Voorlopig): ${gekozenPlanDetails.name}`;
      description = gekozenPlanDetails.id === 'free_start'
        ? `Met het gratis plan kan uw kind een basis assessment doen. Dit plan is voor ${gekozenPlanDetails.maxChildrenText}. Overweeg een upgrade voor volledige toegang.`
        : `U heeft gekozen voor '${gekozenPlanDetails.name}'. Dit plan is voor ${gekozenPlanDetails.maxChildrenText}. Bevestig hieronder uw keuze of selecteer een ander plan.`;
    }

    return {
      id: "bekijk-abonnementen",
      title: title,
      description: description,
      icon: CreditCard,
    };
  };

  const actiepuntenConfig: Actiepunt[] = [
    {
      id: "bekijk-abonnementen", // Wordt dynamisch aangepast door getAbonnementActiepunt
      title: "Abonnementen & Toegang",
      description: "Kies een plan om toegang te krijgen tot alle functies.",
      icon: CreditCard,
    },
    {
      id: "privacy-delen",
      title: "Privacy & Deelinstellingen Kinderen",
      description: "Bekijk en beheer hier per kind de deelinstellingen voor resultaten en communicatie. Lees ook onze tips over respectvolle communicatie en het waarborgen van autonomie.",
      icon: ShieldCheck,
      link: "/dashboard/ouder/privacy-instellingen",
      linkText: "Beheer Privacy & Delen",
      buttonVariant: 'outline',
    },
    {
      id: "ken-je-kind",
      title: 'Doe de "Ken je Kind" Test',
      description: 'Krijg een eerste indruk van de mogelijke neurodivergente kenmerken van uw kind en hoe u hen kunt ondersteunen. Dit helpt u ook bij het invullen van het profiel van uw kind.',
      icon: FileText,
      link: "/quiz/ouder-symptomen-check",
      linkText: 'Start "Ken je Kind" Test',
      buttonVariant: 'default',
    },
    {
      id: "voeg-kind-toe",
      title: 'Voeg uw Kind(eren) Toe',
      description: 'Koppel de accounts van uw kinderen aan uw ouderaccount. Uw kind ontvangt een e-mail om het account te activeren en te koppelen. Hierna kunt u hun voortgang volgen en instellingen beheren.',
      icon: UserPlus,
    },
  ];
  
  const getSortedActiepunten = () => {
    const abonnementActiepunt = getAbonnementActiepunt();
    const andereActiepunten = actiepuntenConfig.filter(ap => ap.id !== "bekijk-abonnementen");

    if (!hasChosenPlan) {
      return [
        abonnementActiepunt,
        ...andereActiepunten,
      ];
    }
    return [
      actiepuntenConfig.find(ap => ap.id === "ken-je-kind")!,
      actiepuntenConfig.find(ap => ap.id === "voeg-kind-toe")!,
      actiepuntenConfig.find(ap => ap.id === "privacy-delen")!,
      abonnementActiepunt,
    ].filter(Boolean) as Actiepunt[];
  };
  
  const sortedActiepunten = getSortedActiepunten();
  const defaultOpenAccordionItem = !hasChosenPlan ? "bekijk-abonnementen" : (planParam ? "bekijk-abonnementen" : "ken-je-kind");

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
          Als ouder speelt u een cruciale rol. MindNavigator biedt u de tools en inzichten om uw kind(eren) optimaal te begeleiden. Doorloop onderstaande stappen om te starten.
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
        
        <Accordion type="single" collapsible className="w-full space-y-4 text-left mb-10" defaultValue={defaultOpenAccordionItem}>
          {sortedActiepunten.map((item) => {
             const isDisabled = !hasChosenPlan && item.id !== "bekijk-abonnementen";
            return (
            <AccordionItem
              key={item.id}
              value={item.id}
              className="bg-card border shadow-md rounded-lg data-[state=open]:shadow-xl"
              disabled={isDisabled}
            >
              <AccordionTrigger 
                className="p-6 text-lg font-semibold hover:no-underline data-[state=open]:text-primary [&[data-state=open]>svg]:text-primary data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed"
                disabled={isDisabled}
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
                    {planParam && planDetailsMap[planParam] && planDetailsMap[planParam].id !== 'free_start' && (
                        <Alert variant="default" className="bg-green-50 border-green-300 text-green-700">
                            <CheckCircle2 className="h-5 w-5 !text-green-600" />
                            <AlertTitleUi className="text-green-700 font-semibold">Uw voorlopige keuze: {planDetailsMap[planParam]?.name}</AlertTitleUi>
                            <AlertDescUi className="text-green-600">
                                Dit plan staat u toe om {planDetailsMap[planParam]?.maxChildrenText} aan te sluiten.
                                Bevestig hieronder uw keuze of selecteer een ander plan.
                            </AlertDescUi>
                        </Alert>
                    )}
                     {planParam && planDetailsMap[planParam] && planDetailsMap[planParam].id === 'free_start' && (
                        <Alert variant="default" className="bg-blue-50 border-blue-300 text-blue-700">
                            <Info className="h-5 w-5 !text-blue-600" />
                            <AlertTitleUi className="text-blue-700 font-semibold">U heeft gekozen voor: {planDetailsMap[planParam]?.name}</AlertTitleUi>
                            <AlertDescUi className="text-blue-600">
                                Met het gratis plan kan uw kind een basis assessment doen en kunt u {planDetailsMap[planParam]?.maxChildrenText} aansluiten. Overweeg een upgrade voor volledige toegang tot alle tools en coaching.
                            </AlertDescUi>
                        </Alert>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {Object.values(planDetailsMap).filter(p => ['free_start', 'family_guide_monthly', 'premium_family_monthly'].includes(p.id)).map(plan => ( 
                            <Card key={plan.id} className={cn(
                                "flex flex-col text-center transition-all duration-200",
                                plan.colorClass,
                                planParam === plan.id ? (plan.highlightClass || "ring-2 ring-primary shadow-2xl scale-105") : "hover:shadow-lg"
                            )}>
                                <CardHeader className="pb-2">
                                    <plan.icon className="mx-auto h-8 w-8 text-primary mb-2"/>
                                    <CardTitle className="text-md font-semibold">{plan.name.replace(' - Maandelijks', '')}</CardTitle>
                                    {plan.price && <p className="text-sm font-bold text-primary">{plan.price === 'Gratis' ? plan.price : `${plan.price}/mnd`}</p>}
                                </CardHeader>
                                <CardContent className="text-xs text-muted-foreground flex-grow space-y-1">
                                  <p className="mb-2">{plan.shortDescription}</p>
                                  <p className="mb-2 font-medium">Max. kinderen: {plan.maxChildrenText}.</p>
                                  {plan.features && plan.features.length > 0 && (
                                    <ul className="list-none p-0 text-left">
                                      {plan.features.slice(0,3).map(f => <li key={f} className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-green-500 flex-shrink-0"/>{f}</li>)}
                                      {plan.features.length > 3 && <li>... en meer</li>}
                                    </ul>
                                  )}
                                </CardContent>
                                <CardFooter className="pt-3">
                                    <Button 
                                      size="sm" 
                                      className="w-full" 
                                      variant={planParam === plan.id ? (plan.id === 'free_start' ? "default" : "default") : "outline"}
                                      onClick={() => handlePlanCTAClick(plan.id)}
                                    >
                                      {planParam === plan.id ? (plan.id === 'free_start' ? "Gratis Gekozen" : "Bevestig & Activeer") : "Kies dit Plan"}
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                     <Button variant="link" asChild className="p-0 h-auto mt-4">
                        <Link href="/pricing">Bekijk alle details en jaaropties</Link>
                    </Button>
                  </div>
                ) : (
                  item.link && item.linkText && (
                    <Button asChild variant={item.buttonVariant || 'default'} className="w-full sm:w-auto" disabled={isDisabled}>
                      <Link href={isDisabled ? '#' : item.link}>
                        {item.linkText} <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  )
                )}
              </AccordionContent>
            </AccordionItem>
            );
          })}
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

