
// src/app/dashboard/ouder/welcome/page.tsx
"use client";

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { FileText, Info, CreditCard, ArrowRight, UserPlus, ShieldCheck, Sparkles, Users, Star, CheckCircle2, HelpCircle, ExternalLink, ScrollText, Compass, Percent, ListChecks, XCircle } from 'lucide-react';
import { Alert, AlertDescription as AlertDescUi, AlertTitle as AlertTitleUi } from "@/components/ui/alert";
import { AddChildForm, type AddChildFormData } from '@/components/ouder/AddChildForm';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import type { ElementType } from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import type { SubscriptionPlan, AppFeature } from '@/app/dashboard/admin/subscription-management/page';
import { ALL_APP_FEATURES } from '@/app/dashboard/admin/subscription-management/page';

const ONBOARDING_KEY_OUDER = 'onboardingCompleted_ouder_v1';

const currentParent = {
  name: "Ouder Tester", 
};

const initialDefaultPlansForWelcome: SubscriptionPlan[] = [
  {
    id: 'free_start', name: 'Gratis Start', description: 'Basis zelfreflectie tool & PDF overzicht.', price: 0, currency: 'EUR', billingInterval: 'once',
    tagline: 'Proef de kracht van zelfinzicht.',
    featureAccess: { 
      ...Object.fromEntries(ALL_APP_FEATURES.map(f => [f.id, false])), // Start all false
      startAssessment: true, 
      basicReflectionToolLimited: true, 
      basicPdfOverview: true, 
      accountManagement: true,
    },
    active: true, trialPeriodDays: 0, maxChildren: 1, isPopular: false,
  },
  {
    id: 'family_guide_monthly', name: 'Gezins Gids - Maandelijks', description: 'Complete digitale ondersteuning voor het gezin.', price: 19.99, currency: 'EUR', billingInterval: 'month',
    tagline: 'Slechts €0,13 per dag voor uitgebreide tools!',
    featureAccess: {
      ...Object.fromEntries(ALL_APP_FEATURES.map(f => [f.id, false])),
      startAssessment: true, weeklyMotivationEmail: true, allReflectionToolsUnlimited: true, interactiveJournal: true, 
      planningFocusTools: true, motivationTracking: true, extensivePdfReports: true,
      childProgressTracking: true, familyInsights: true, communicationWithLinkedProfessionals: true, accountManagement: true,
      max3ChildrenIncluded: true, browseProfessionals: true, viewProfessionalRates: true, bookSessions: true, sessionPlanningReminders: true,
      aiPoweredInsights: true,
      exclusiveCoachingModules: true,
    },
    active: true, trialPeriodDays: 14, maxChildren: 3, isPopular: true,
  },
   {
    id: 'family_guide_yearly', name: 'Gezins Gids - Jaarlijks', description: 'Complete digitale ondersteuning met jaarkorting.', price: 191.88, currency: 'EUR', billingInterval: 'year',
    tagline: 'Jaarlijks voordeel voor het hele gezin!',
    featureAccess: {
       ...Object.fromEntries(ALL_APP_FEATURES.map(f => [f.id, false])),
      startAssessment: true, weeklyMotivationEmail: true, allReflectionToolsUnlimited: true, interactiveJournal: true, 
      planningFocusTools: true, motivationTracking: true, extensivePdfReports: true,
      childProgressTracking: true, familyInsights: true, communicationWithLinkedProfessionals: true, accountManagement: true,
      max3ChildrenIncluded: true, browseProfessionals: true, viewProfessionalRates: true, bookSessions: true, sessionPlanningReminders: true,
      yearlyDiscount15: true,
      aiPoweredInsights: true,
      exclusiveCoachingModules: true,
    },
    active: true, trialPeriodDays: 14, maxChildren: 3, isPopular: false,
  },
  {
    id: 'premium_family_monthly', name: 'Premium Plan - Maandelijks', description: 'Alles van Gezins Gids, plus premium features en meer kinderen.', price: 39.99, currency: 'EUR', billingInterval: 'month',
    tagline: '€0,67 per dag - minder dan een kopje koffie!',
    featureAccess: {
      ...Object.fromEntries(ALL_APP_FEATURES.map(f => [f.id, true])),
      noProgressAnalytics: false,
    },
    active: true, trialPeriodDays: 14, maxChildren: 4, isPopular: false, 
  },
  { 
    id: 'premium_family_yearly', name: 'Premium Plan - Jaarlijks', description: 'Alles van Premium Plan met jaarkorting.', price: 360.00, currency: 'EUR', billingInterval: 'year',
    tagline: 'Het meest complete pakket met maximale korting!',
    featureAccess: { 
      ...Object.fromEntries(ALL_APP_FEATURES.map(f => [f.id, true])),
      noProgressAnalytics: false, 
      yearlyDiscount15: true, 
    },
    active: true, trialPeriodDays: 14, maxChildren: 4, isPopular: false, 
  },
];


interface Actiepunt {
  id: string;
  stepNumber: number;
  title: string;
  description: string;
  link?: string;
  linkText?: string;
  buttonVariant?: "default" | "outline" | "secondary" | "ghost" | "link" | null | undefined;
  contentHeader?: string;
  contentSteps?: string[];
}

const getPlanIcon = (planId: string): React.ElementType => {
    if (planId.includes('premium')) return Star;
    if (planId.includes('family') || planId.includes('gezin')) return Users;
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

const MAX_FEATURES_TO_DISPLAY_ON_CARD_WELCOME = 12;


function OuderWelcomePageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [isClient, setIsClient] = useState(false);
  const [addChildFormKey, setAddChildFormKey] = useState(0);
  const [availablePlans, setAvailablePlans] = useState<SubscriptionPlan[]>([]);
  const [isLoadingPlans, setIsLoadingPlans] = useState(true);

  const planParam = searchParams.get('plan');
  const hasChosenPlan = !!planParam && availablePlans.some(p => p.id === planParam);

  useEffect(() => {
    setIsClient(true);
    const storedPlansRaw = localStorage.getItem('subscriptionPlans');
    let loadedPlans: SubscriptionPlan[] = [];

    const ensureFullFeatureAccess = (plan: SubscriptionPlan): SubscriptionPlan => {
        const migratedFeatureAccess: Record<string, boolean> = {};
        ALL_APP_FEATURES.forEach(appFeature => {
            migratedFeatureAccess[appFeature.id] = (plan.featureAccess && typeof plan.featureAccess[appFeature.id] === 'boolean') 
            ? plan.featureAccess[appFeature.id] 
            : false;
        });
        return {
            ...plan,
            featureAccess: migratedFeatureAccess,
            trialPeriodDays: plan.trialPeriodDays ?? (plan.price === 0 ? 0 : 14),
            maxChildren: plan.maxChildren ?? (plan.id.includes('family_guide') ? 3 : (plan.price === 0 ? 1 : 0)),
            isPopular: plan.isPopular ?? false, 
            tagline: plan.tagline ?? '',
        };
    };

    if (storedPlansRaw) {
      try {
        const parsedPlans: SubscriptionPlan[] = JSON.parse(storedPlansRaw);
        loadedPlans = parsedPlans.map(ensureFullFeatureAccess);
      } catch (e) {
        console.error("Error parsing plans from localStorage on welcome page, using defaults", e);
        loadedPlans = initialDefaultPlansForWelcome.map(ensureFullFeatureAccess);
        localStorage.setItem('subscriptionPlans', JSON.stringify(initialDefaultPlansForWelcome)); 
      }
    } else {
      loadedPlans = initialDefaultPlansForWelcome.map(ensureFullFeatureAccess);
      localStorage.setItem('subscriptionPlans', JSON.stringify(initialDefaultPlansForWelcome));
    }
    
    setAvailablePlans(loadedPlans.filter(p => p.active));
    setIsLoadingPlans(false);
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
  
 const getActiepuntenConfig = (): Actiepunt[] => {
    let currentStep = 1;
    const config: Actiepunt[] = [];
    const alertMessage = "Kies eerst een plan (zie stap hieronder) om deze actie te kunnen doorlopen.";
    const chosenPlanDetails = planParam ? availablePlans.find(p => p.id === planParam) : null;

    const abonnementActiepuntData: Omit<Actiepunt, 'stepNumber' | 'title'> = {
      id: "bekijk-abonnementen",
      description: "Kies een abonnement om te starten. Met 'Gratis Ontdekking' kan uw kind de basisassessment doen. Voor volledige coaching en tools is een betaald plan nodig.",
      contentHeader: hasChosenPlan && chosenPlanDetails
        ? chosenPlanDetails.id === 'free_start' 
          ? "U kunt hieronder nog steeds kiezen voor een uitgebreider betaald plan, of doorgaan met de gratis optie."
          : "Bevestig hieronder uw keuze of selecteer een ander plan."
        : "Selecteer hieronder een plan. Na uw keuze worden de andere instelopties actief.",
    };
    
    const voorwaardenActiepuntData: Omit<Actiepunt, 'stepNumber' | 'title'> = {
        id: "belangrijke-voorwaarden",
        description: "Een korte herinnering aan de belangrijkste punten en links naar de volledige documenten.",
        contentHeader: "Door MindNavigator te gebruiken, bent u akkoord gegaan tijdens uw registratie.",
        contentSteps: [
            `U bent akkoord gegaan met deze voorwaarden en ons privacybeleid tijdens uw registratie.`,
            "MindNavigator is een hulpmiddel voor zelfinzicht en ondersteuning. Het vervangt geen professionele diagnose of behandeling. Lees onze volledige documenten voor een compleet begrip van onze diensten en uw rechten."
        ],
    };

    const andereActiepuntenData: Omit<Actiepunt, 'stepNumber' | 'title'>[] = [
       {
        id: "ken-je-kind",
        description: 'Doe een korte test (optioneel, ca. 5 min) om een eerste indruk te krijgen van mogelijke neurodivergente kenmerken van uw kind en hoe u hen kunt ondersteunen.',
        link: "/quiz/ouder-symptomen-check",
        linkText: 'Start "Ken je Kind" Test',
        buttonVariant: 'default',
        contentHeader: hasChosenPlan ? "Deze test geeft u een eerste indruk en kan helpen bij het invullen van het kinderprofiel. De resultaten zijn alleen voor u." : alertMessage,
      },
      {
        id: "voeg-kind-toe",
        description: "Maak profielen aan voor uw kinderen. Na het toevoegen ontvangt uw kind een e-mail om het eigen account te activeren en te koppelen. Hierna kunt u de voortgang volgen, privacy-instellingen beheren en eventueel begeleiders koppelen. Deze stap is essentieel om de MindNavigator tools voor uw kind(eren) te kunnen gebruiken.",
        contentHeader: hasChosenPlan ? "Na het toevoegen ontvangt uw kind een e-mail om het account te activeren. Daarna kunt u de voortgang volgen en instellingen beheren." : alertMessage,
      },
      {
        id: "privacy-delen",
        description: "Bekijk en beheer hier per kind de deelinstellingen voor resultaten en communicatie. Lees ook onze tips over respectvolle communicatie en het waarborgen van autonomie.",
        link: "/dashboard/ouder/privacy-instellingen",
        linkText: "Beheer Privacy & Delen",
        buttonVariant: 'outline',
        contentHeader: hasChosenPlan ? "Stel hier de privacyvoorkeuren in. Deze instellingen bepalen welke informatie zichtbaar is voor u en, indien van toepassing, voor gekoppelde tutors of coaches." : alertMessage,
      },
    ];
    
    const getBaseTitleForId = (id: string): string => {
        if (id === "bekijk-abonnementen") return hasChosenPlan && chosenPlanDetails ? (chosenPlanDetails.id === 'free_start' ? "U Gebruikt het Gratis Plan" : `Uw Keuze: ${chosenPlanDetails.name}`) : "Abonnementen & Toegang";
        if (id === "belangrijke-voorwaarden") return "Belangrijke Voorwaarden & Privacy";
        if (id === "ken-je-kind") return "\"Ken je Kind\" Test (Optioneel)";
        if (id === "voeg-kind-toe") return "Kind(eren) Toevoegen";
        if (id === "privacy-delen") return "Privacy & Deelinstellingen Kinderen";
        return "Onbekende Stap";
    };

    if (!hasChosenPlan) {
        config.push({ ...abonnementActiepuntData, title: getBaseTitleForId("bekijk-abonnementen"), stepNumber: currentStep++ });
        config.push({ ...voorwaardenActiepuntData, title: getBaseTitleForId("belangrijke-voorwaarden"), stepNumber: currentStep++ });
        andereActiepuntenData.forEach(item => {
            config.push({...item, title: getBaseTitleForId(item.id), stepNumber: currentStep++ });
        });
    } else {
        andereActiepuntenData.forEach(item => {
            config.push({...item, title: getBaseTitleForId(item.id), stepNumber: currentStep++ });
        });
        config.push({ ...voorwaardenActiepuntData, title: getBaseTitleForId("belangrijke-voorwaarden"), stepNumber: currentStep++ });
        config.push({ ...abonnementActiepuntData, title: getBaseTitleForId("bekijk-abonnementen"), stepNumber: currentStep++ });
    }
    return config;
  };
  
  const sortedActiepunten = getActiepuntenConfig();
  
  const getDefaultAccordionValue = () => {
    if (!hasChosenPlan) return "bekijk-abonnementen";
    const firstActionable = sortedActiepunten.find(ap => ap.id !== "bekijk-abonnementen" && ap.id !== "belangrijke-voorwaarden");
    return firstActionable?.id || sortedActiepunten[0]?.id || "";
  }
  const defaultOpenAccordionItem = getDefaultAccordionValue();

  if (isLoadingPlans) {
    return <div className="flex h-screen items-center justify-center">Pagina laden...</div>;
  }

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
          <h2 className="text-2xl font-semibold mb-3 flex items-center gap-2"><Compass className="h-7 w-7"/>Stel uw Ouder Dashboard in (~10-15 min)</h2>
          <p className="text-sm mb-4 text-blue-800">Doorloop de onderstaande actiepunten om MindNavigator optimaal voor uw gezin in te richten:</p>
          <ol className="list-decimal list-inside space-y-1.5 text-sm text-blue-800">
            <li><strong>Kies een Abonnement:</strong> Selecteer een plan (gratis of betaald). Dit activeert de overige instellingen.</li>
            <li><strong>Belangrijke Info:</strong> Neem kennis van onze voorwaarden en hoe wij met privacy omgaan.</li>
            <li><strong>Kind(eren) Toevoegen:</strong> Maak profielen aan voor uw kinderen. Zij ontvangen een e-mail om hun account te activeren.</li>
            <li><strong>Privacy & Delen Instellen:</strong> Bepaal per kind wat er gedeeld mag worden.</li>
            <li><strong>'Ken je Kind' Test (Optioneel):</strong> Krijg eerste inzichten die helpen bij het instellen en gesprekken (circa 5 min).</li>
          </ol>
          <p className="mt-3 text-sm text-blue-800">Na deze stappen is uw Ouder Dashboard klaar voor gebruik en kunt u de voortgang van uw kinderen volgen en eventueel begeleiding koppelen.</p>
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
        
        <TooltipProvider>
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
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold text-sm flex-shrink-0">
                      {item.stepNumber}
                    </div>
                    {item.title}
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6 pt-0">
                  <p className="text-sm text-muted-foreground mb-4">{item.description}</p>
                  {item.contentHeader && <p className="text-sm font-medium text-foreground mb-4">{item.contentHeader}</p>}
                  
                  {item.id === "belangrijke-voorwaarden" && item.contentSteps && (
                    <div className="space-y-2 text-sm text-muted-foreground mb-4">
                      {item.contentSteps.map((step, i) => <p key={i}>{step}</p>)}
                      <div className="flex flex-col sm:flex-row gap-2 mt-3">
                          <Button variant="link" asChild className="p-0 h-auto text-primary"><Link href="/terms" target="_blank">Algemene Voorwaarden <ExternalLink className="ml-1 h-3 w-3"/></Link></Button>
                          <Button variant="link" asChild className="p-0 h-auto text-primary"><Link href="/privacy" target="_blank">Privacybeleid <ExternalLink className="ml-1 h-3 w-3"/></Link></Button>
                          <Button variant="link" asChild className="p-0 h-auto text-primary"><Link href="/disclaimer" target="_blank">Disclaimer <ExternalLink className="ml-1 h-3 w-3"/></Link></Button>
                      </div>
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
                          {availablePlans.filter(p => p.active && (p.billingInterval === 'month' || p.billingInterval === 'once')).map(plan => { 
                              const PlanIcon = getPlanIcon(plan.id);
                              const yearlyEquivalentPlan = plan.billingInterval === 'month' ? availablePlans.find(yp => yp.active && yp.billingInterval === 'year' && yp.id.replace('_yearly', '_monthly') === plan.id.replace('_monthly', '_monthly')) : undefined;
                              const monthlyEq = yearlyEquivalentPlan ? getMonthlyEquivalent(yearlyEquivalentPlan.price, 'year') : null;
                              const savings = yearlyEquivalentPlan ? getYearlySavings(plan.price, yearlyEquivalentPlan.price) : null;
                              
                              const activeFeaturesForPlan = ALL_APP_FEATURES.filter(
                                (appFeature) => plan.featureAccess && plan.featureAccess[appFeature.id]
                              );
                              const featuresToDisplayOnCard = activeFeaturesForPlan.slice(0, MAX_FEATURES_TO_DISPLAY_ON_CARD_WELCOME);
                              const hiddenFeaturesCount = activeFeaturesForPlan.length - featuresToDisplayOnCard.length;
                              const hasMoreFeaturesThanDisplayed = hiddenFeaturesCount > 0;

                              return (
                              <Card key={plan.id} className={cn(
                                  "flex flex-col text-center transition-all duration-200 border-2",
                                  plan.isPopular ? "border-primary ring-2 ring-primary/50" : "border-border",
                                  planParam === plan.id ? (plan.isPopular ? "ring-2 ring-primary/50 shadow-2xl scale-105" : "border-primary ring-2 ring-primary/30 shadow-2xl scale-105") : "hover:shadow-lg"
                              )}>
                                  <CardHeader className="pb-2">
                                      <PlanIcon className="mx-auto h-8 w-8 text-primary mb-2"/>
                                      <CardTitle className="text-md font-semibold">{plan.name.replace(' - Maandelijks', '')}</CardTitle>
                                      {plan.price !== undefined && <p className="text-2xl font-bold text-primary">{plan.price === 0 ? 'Gratis' : `€${plan.price.toFixed(2)}`}</p>}
                                      <p className="text-xs font-normal text-muted-foreground -mt-1"> {plan.price === 0 ? 'Proef de kracht' : plan.billingInterval === 'month' ? 'p/gezin/maand' : 'eenmalig'}</p>
                                      {plan.trialPeriodDays && plan.trialPeriodDays > 0 && plan.price > 0 && (
                                        <p className="text-xs text-green-600 font-medium">{plan.trialPeriodDays} dagen gratis proberen!</p>
                                      )}
                                      {plan.tagline && (<p className="text-xs text-green-600 font-medium mt-1">{plan.tagline}</p>)}
                                  </CardHeader>
                                  <CardContent className="text-xs text-muted-foreground flex-grow space-y-1">
                                    <p className="mb-2 text-sm">{plan.description}</p>
                                    <ul className="space-y-1">
                                      {featuresToDisplayOnCard.map((appFeature) => (
                                        <li key={appFeature.id} className="flex items-start justify-center text-left">
                                          <CheckCircle2 className="mr-2 mt-[3px] h-3.5 w-3.5 flex-shrink-0 text-green-500" />
                                          <span className="text-xs leading-snug">{appFeature.label}</span>
                                        </li>
                                      ))}
                                      {hasMoreFeaturesThanDisplayed && (
                                        <li className="text-xs text-muted-foreground/80 text-center pt-0.5">
                                          <Tooltip delayDuration={300}>
                                            <TooltipTrigger asChild>
                                              <span className="cursor-help underline decoration-dashed hover:text-primary">
                                                ... en {hiddenFeaturesCount} andere feature{hiddenFeaturesCount > 1 ? 's' : ''}!
                                              </span>
                                            </TooltipTrigger>
                                            <TooltipContent className="w-56 bg-popover p-2 rounded-md shadow-lg border text-popover-foreground">
                                              <p className="font-semibold mb-1.5 text-sm">Extra features:</p>
                                              <ul className="list-disc list-inside space-y-0.5 text-xs">
                                                {activeFeaturesForPlan.slice(MAX_FEATURES_TO_DISPLAY_ON_CARD_WELCOME).map(hf => <li key={hf.id}>{hf.label}</li>)}
                                              </ul>
                                            </TooltipContent>
                                          </Tooltip>
                                        </li>
                                      )}
                                      {activeFeaturesForPlan.length === 0 && (
                                        <li className="text-xs text-muted-foreground/80 text-center pt-0.5">Basisfunctionaliteit.</li>
                                      )}
                                    </ul>
                                    {plan.maxChildren !== undefined && (
                                        <p className="text-xs text-muted-foreground pt-1.5">
                                            {plan.maxChildren === 0 ? 'Onbeperkt kinderen' : `Tot ${plan.maxChildren} kind${plan.maxChildren !== 1 ? 'eren' : ''}`}
                                        </p>
                                    )}
                                  </CardContent>
                                  <CardFooter className="pt-3 pb-4">
                                      <Button 
                                        size="sm" 
                                        className="w-full" 
                                        variant={planParam === plan.id ? (plan.id === 'free_start' ? "default" : "default") : "outline"}
                                        onClick={() => handlePlanCTAClick(plan.id)}
                                      >
                                        {planParam === plan.id ? (plan.id === 'free_start' ? "Gratis Gekozen" : "Bevestig Keuze") : "Kies dit Plan"}
                                      </Button>
                                  </CardFooter>
                                  {yearlyEquivalentPlan && (
                                      <div className="text-center text-xs p-2 border-t">
                                          <Button variant="link" className="p-0 h-auto text-xs text-primary" onClick={() => handlePlanCTAClick(yearlyEquivalentPlan.id)}>
                                              Ook jaarlijks: €{yearlyEquivalentPlan.price.toFixed(2)} (${monthlyEq ? `€${monthlyEq}/mnd` : ''})
                                              {savings && parseFloat(savings) > 0 && <span className="text-accent font-semibold ml-1">- bespaar €{savings}</span>}
                                          </Button>
                                      </div>
                                  )}
                              </Card>
                          );
                        })}
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
        </TooltipProvider>
        
        <div className="flex flex-col items-center gap-3 mt-10">
           <Button 
            onClick={handleCompleteOnboarding} 
            className="w-full max-w-xs" 
            size="lg"
            disabled={!hasChosenPlan || isLoadingPlans}
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
    
