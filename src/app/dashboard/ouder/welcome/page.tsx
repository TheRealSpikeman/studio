
// src/app/dashboard/ouder/welcome/page.tsx
"use client";

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { FileText, Info, CreditCard, ArrowRight, UserPlus, ShieldCheck, Sparkles, Users, Star, CheckCircle2, HelpCircle, ExternalLink, ScrollText, Compass } from 'lucide-react';
import { Alert, AlertDescription as AlertDescUi, AlertTitle as AlertTitleUi } from "@/components/ui/alert";
import { AddChildForm, type AddChildFormData } from '@/components/ouder/AddChildForm';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import type { ElementType } from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

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
    ctaText: 'Start gratis ontdekking',
    ctaBaseLink: '/quizzes',
    colorClass: "border-gray-300 hover:border-gray-400",
    maxChildrenText: "1 kind",
  },
  'family_guide_monthly': {
    id: 'family_guide_monthly',
    name: 'Familie Coaching',
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
    maxChildrenText: "tot 3 kinderen",
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
    maxChildrenText: "tot 3 kinderen",
  },
  'premium_family_monthly': {
    id: 'premium_family_monthly',
    name: 'Premium Familie',
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
  contentHeader?: string;
  contentSteps?: string[];
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
    // Using router.replace to re-render with new searchParam without a full navigation
    router.replace(newUrl.href, { scroll: false }); 
  };
  
  const getAbonnementActiepunt = (): Actiepunt => {
    const gekozenPlanDetails = planParam && planDetailsMap[planParam];
    
    let title = `Abonnementen & Toegang`;
    let description = `Kies het plan dat het beste bij uw gezin past. Elk plan start met een gratis proefperiode van 14 dagen. Dit activeert de overige instellingen.`;
    let contentHeader = "Selecteer hieronder een plan. Na uw keuze worden de andere instelopties actief.";
    
    if (gekozenPlanDetails) {
      title = gekozenPlanDetails.id === 'free_start' 
        ? `U Gebruikt het Gratis Start Plan` 
        : `Uw Keuze: ${gekozenPlanDetails.name}`;
      description = gekozenPlanDetails.id === 'free_start'
        ? `U start met het gratis plan waarmee uw kind een basis assessment kan doen. Dit plan is voor ${gekozenPlanDetails.maxChildrenText}. Overweeg een upgrade voor volledige toegang.`
        : `U heeft gekozen voor '${gekozenPlanDetails.name}'. Dit plan stelt u in staat om ${gekozenPlanDetails.maxChildrenText} aan te sluiten. Bevestig hieronder uw keuze of selecteer een ander plan.`;
      contentHeader = gekozenPlanDetails.id === 'free_start' 
        ? "U kunt hieronder nog steeds kiezen voor een uitgebreider betaald plan, of doorgaan met de gratis optie."
        : "Bevestig hieronder uw keuze of selecteer een ander plan.";
    }

    return {
      id: "bekijk-abonnementen",
      title: title,
      description: description,
      icon: CreditCard,
      contentHeader: contentHeader,
    };
  };
  
  const getActiepuntenConfig = (): Actiepunt[] => {
    let currentStepNumber = 1;
    const config: Actiepunt[] = [];
    const alertMessage = "Kies eerst een plan om deze stap te kunnen doorlopen.";

    if (!hasChosenPlan) {
      const abonnementActiepunt = getAbonnementActiepunt();
      config.push({
        ...abonnementActiepunt,
        title: `Stap ${currentStepNumber++}: ${abonnementActiepunt.title}`
      });
    }

    config.push({
      id: "belangrijke-voorwaarden",
      title: `Stap ${currentStepNumber++}: Belangrijke Voorwaarden & Privacy`,
      description: "Bekijk de kernpunten van onze voorwaarden en privacybeleid. Door MindNavigator te gebruiken, bent u akkoord gegaan tijdens uw registratie.",
      icon: ScrollText,
      contentHeader: "Een korte herinnering aan de belangrijkste punten en links naar de volledige documenten.",
      contentSteps: [
        `U bent akkoord gegaan met deze voorwaarden en ons privacybeleid tijdens uw registratie op [Datum, Tijdstip van registratie].`,
        "MindNavigator is een hulpmiddel voor zelfinzicht en ondersteuning. Het vervangt geen professionele diagnose of behandeling. Lees onze volledige documenten voor een compleet begrip van onze diensten en uw rechten."
      ],
    });
    
    const otherActionItems: Omit<Actiepunt, 'title'>[] = [
      {
        id: "ken-je-kind",
        description: 'Krijg een eerste indruk van de mogelijke neurodivergente kenmerken van uw kind en hoe u hen kunt ondersteunen.',
        icon: FileText,
        link: "/quiz/ouder-symptomen-check",
        linkText: 'Start "Ken je Kind" Test',
        buttonVariant: 'default',
        contentHeader: hasChosenPlan ? "Deze test geeft u een eerste indruk en kan helpen bij het invullen van het kinderprofiel. De resultaten zijn alleen voor u." : alertMessage,
      },
      {
        id: "voeg-kind-toe",
        description: "Maak profielen aan voor uw kinderen. Na het toevoegen ontvangt uw kind een e-mail om het eigen account te activeren. Hierna kunt u de voortgang volgen, privacy-instellingen beheren en eventueel begeleiders koppelen.",
        icon: UserPlus,
        contentHeader: hasChosenPlan ? "Na het toevoegen ontvangt uw kind een e-mail om het account te activeren. Daarna kunt u de voortgang volgen en instellingen beheren." : alertMessage,
      },
      {
        id: "privacy-delen",
        description: "Bekijk en beheer hier per kind de deelinstellingen voor resultaten en communicatie. Lees ook onze tips over respectvolle communicatie en het waarborgen van autonomie.",
        icon: ShieldCheck,
        link: "/dashboard/ouder/privacy-instellingen",
        linkText: "Beheer Privacy & Delen",
        buttonVariant: 'outline',
        contentHeader: hasChosenPlan ? "Stel hier de privacyvoorkeuren in. Deze instellingen bepalen welke informatie zichtbaar is voor u en, indien van toepassing, voor gekoppelde tutors of coaches." : alertMessage,
      }
    ];

    otherActionItems.forEach(item => {
      let itemTitle = "";
      if (item.id === "ken-je-kind") itemTitle = "Doe de \"Ken je Kind\" Test (Optioneel, ca. 5 min)";
      else if (item.id === "voeg-kind-toe") itemTitle = "Voeg uw Kind(eren) Toe";
      else if (item.id === "privacy-delen") itemTitle = "Privacy & Deelinstellingen Kinderen";
      
      config.push({
        ...item,
        title: `Stap ${currentStepNumber++}: ${itemTitle}`,
      });
    });

    if (hasChosenPlan) {
      const abonnementActiepunt = getAbonnementActiepunt();
      config.push({
          ...abonnementActiepunt,
          title: `Stap ${currentStepNumber++}: ${abonnementActiepunt.title.replace(/^Stap \d+: /, '')}`
      });
    }
    return config;
  };
  
  const sortedActiepunten = getActiepuntenConfig();
  
  let defaultOpenAccordionItemValue = "";
  if (!hasChosenPlan) {
    const abonnementItem = sortedActiepunten.find(ap => ap.id === "bekijk-abonnementen");
    if (abonnementItem) {
      defaultOpenAccordionItemValue = "bekijk-abonnementen";
    } else if (sortedActiepunten.length > 0) {
      defaultOpenAccordionItemValue = sortedActiepunten[0]?.id || "";
    }
  } else {
    if (sortedActiepunten.length > 0) {
      // If a plan is chosen, open the first *actionable* step if it's not the "bekijk-abonnementen" one.
      const firstActionable = sortedActiepunten.find(ap => ap.id !== "bekijk-abonnementen" && ap.id !== "belangrijke-voorwaarden");
      defaultOpenAccordionItemValue = firstActionable?.id || sortedActiepunten[0]?.id || "";
    }
  }
  const defaultOpenAccordionItem = defaultOpenAccordionItemValue;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-3xl text-center">
        <h1 className="text-3xl font-bold text-foreground mb-4">
          Welkom bij MindNavigator, {currentParent.name}!
        </h1>
        <p className="text-lg text-muted-foreground mt-2 mb-6">
          Wij helpen u uw kind beter te begrijpen en te ondersteunen.
        </p>
        
        <div className="mb-8 p-6 bg-blue-50 border border-blue-200 rounded-lg text-blue-700 text-left shadow-sm">
          <h2 className="text-xl font-semibold mb-3 flex items-center gap-2"><Compass className="h-6 w-6"/>Stel uw Ouder Dashboard in (~10-15 min)</h2>
          <p className="text-sm mb-3 text-blue-800">Doorloop de onderstaande actiepunten om MindNavigator optimaal voor uw gezin in te richten:</p>
          <ol className="list-decimal list-inside space-y-1 text-sm text-blue-800">
            <li><strong>Kies een Abonnement:</strong> Selecteer een plan (gratis of betaald). Dit activeert de overige instellingen.</li>
            <li><strong>Belangrijke Info:</strong> Neem kennis van onze voorwaarden en hoe wij met privacy omgaan.</li>
            <li><strong>'Ken je Kind' Test (Optioneel):</strong> Krijg eerste inzichten die helpen bij het instellen en gesprekken (circa 5 min).</li>
            <li><strong>Kind(eren) Toevoegen:</strong> Maak profielen aan. Uw kind ontvangt een e-mail om het account te activeren.</li>
            <li><strong>Privacy & Delen Instellen:</strong> Bepaal per kind wat er gedeeld mag worden.</li>
          </ol>
          <p className="mt-3 text-sm text-blue-800">Na deze stappen is uw Ouder Dashboard klaar voor gebruik!</p>
        </div>
        
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
             const isDisabled = !hasChosenPlan && !["bekijk-abonnementen", "belangrijke-voorwaarden"].includes(item.id);
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
                {item.contentHeader && <p className="text-sm font-medium text-foreground mb-4">{item.contentHeader}</p>}
                
                {item.id === "belangrijke-voorwaarden" && item.contentSteps && (
                  <div className="space-y-2 text-sm text-muted-foreground mb-4">
                    {item.contentSteps.map((step, i) => <p key={i}>{step}</p>)}
                  </div>
                )}

                {item.id === "voeg-kind-toe" ? (
                  <AddChildForm
                    key={addChildFormKey} 
                    onSave={handleSaveChildOnWelcome}
                    onCancel={() => { /* Blijf in het accordeon */ }}
                  />
                ) : item.id === "bekijk-abonnementen" ? (
                  <div className="space-y-6">
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
                ) : item.id === "belangrijke-voorwaarden" ? (
                    <div className="space-y-3">
                        <div className="flex flex-col sm:flex-row gap-2">
                             <Button variant="link" asChild className="p-0 h-auto text-primary"><Link href="/terms" target="_blank">Algemene Voorwaarden <ExternalLink className="ml-1 h-3 w-3"/></Link></Button>
                             <Button variant="link" asChild className="p-0 h-auto text-primary"><Link href="/privacy" target="_blank">Privacybeleid <ExternalLink className="ml-1 h-3 w-3"/></Link></Button>
                             <Button variant="link" asChild className="p-0 h-auto text-primary"><Link href="/disclaimer" target="_blank">Disclaimer <ExternalLink className="ml-1 h-3 w-3"/></Link></Button>
                        </div>
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
        
        <div className="flex flex-col items-center gap-3 mt-10">
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

