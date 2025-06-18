
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

const defaultFeatureAccessFree: Record<string, boolean> = {};
ALL_APP_FEATURES.forEach(f => defaultFeatureAccessFree[f.id] = false);
defaultFeatureAccessFree.startAssessment = true;
defaultFeatureAccessFree.weeklyMotivationEmail = true;
defaultFeatureAccessFree.basicReflectionToolLimited = true;
defaultFeatureAccessFree.sampleCoachingContent = true;
defaultFeatureAccessFree.basicPdfOverview = true;
defaultFeatureAccessFree.browseProfessionals = true;
defaultFeatureAccessFree.viewProfessionalRates = true;
defaultFeatureAccessFree.accountManagement = true;
defaultFeatureAccessFree.noProgressAnalytics = true;


const defaultFeatureAccessFamily: Record<string, boolean> = {};
ALL_APP_FEATURES.forEach(f => defaultFeatureAccessFamily[f.id] = false);
defaultFeatureAccessFamily.startAssessment = true;
defaultFeatureAccessFamily.weeklyMotivationEmail = true;
defaultFeatureAccessFamily.dailyPersonalizedCoaching = true;
defaultFeatureAccessFamily.allReflectionToolsUnlimited = true;
defaultFeatureAccessFamily.interactiveJournal = true;
defaultFeatureAccessFamily.planningFocusTools = true;
defaultFeatureAccessFamily.motivationTracking = true;
defaultFeatureAccessFamily.extensivePdfReports = true;
defaultFeatureAccessFamily.bookSessions = true;
defaultFeatureAccessFamily.directProfessionalCommunication = true;
defaultFeatureAccessFamily.reviewRatingSystem = true;
defaultFeatureAccessFamily.sessionPlanningReminders = true;
defaultFeatureAccessFamily.childProgressTracking = true;
defaultFeatureAccessFamily.familyInsights = true;
defaultFeatureAccessFamily.max3ChildrenIncluded = true;
defaultFeatureAccessFamily.communicationWithLinkedProfessionals = true;
defaultFeatureAccessFamily.accountManagement = true;

const defaultFeatureAccessPremium: Record<string, boolean> = { ...defaultFeatureAccessFamily };
defaultFeatureAccessPremium.extensiveAssessmentAnalysis = true;
defaultFeatureAccessPremium.aiPoweredInsights = true;
defaultFeatureAccessPremium.advancedAnalyticsTrends = true;
defaultFeatureAccessPremium.exclusiveCoachingModules = true;
defaultFeatureAccessPremium.priorityMatchingAlgorithm = true;
defaultFeatureAccessPremium.priorityBooking = true;
defaultFeatureAccessPremium.extendedSearchFilters = true;
defaultFeatureAccessPremium.bulkSessionPlanning = true;
defaultFeatureAccessPremium.premiumSupport24h = true;
defaultFeatureAccessPremium.unlimitedChildren = true;
defaultFeatureAccessPremium.monthlyFamilyCoachingCalls = true;
defaultFeatureAccessPremium.schoolIntegrationReporting = true;
defaultFeatureAccessPremium.advancedParentTrainingModules = true;
defaultFeatureAccessPremium.max3ChildrenIncluded = false;


const initialDefaultPlansForWelcome: SubscriptionPlan[] = [
  {
    id: 'free_start', name: 'Gratis Ontdekking', description: 'Basis zelfreflectie tool & PDF overzicht.', price: 0, currency: 'EUR', billingInterval: 'once',
    featureAccess: defaultFeatureAccessFree,
    active: true, trialPeriodDays: 0, maxChildren: 1, isPopular: false,
  },
  {
    id: 'family_guide_monthly', name: 'Familie Coaching - Maandelijks', description: 'Coaching, alle tools, en tot 3 kinderen.', price: 19.99, currency: 'EUR', billingInterval: 'month',
    featureAccess: defaultFeatureAccessFamily,
    active: true, trialPeriodDays: 14, maxChildren: 3, isPopular: true,
  },
  {
    id: 'premium_family_monthly', name: 'Premium Familie - Maandelijks', description: 'Alles van Familie Coaching, plus premium features en onbeperkt kinderen.', price: 39.99, currency: 'EUR', billingInterval: 'month',
    featureAccess: defaultFeatureAccessPremium,
    active: true, trialPeriodDays: 14, maxChildren: 0, isPopular: false,
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
            maxChildren: plan.maxChildren ?? (plan.id.includes('family') ? 3 : (plan.price === 0 ? 1 : 0)),
            isPopular: plan.isPopular ?? false,
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
        contentHeader: "Een korte herinnering aan de belangrijkste punten en links naar de volledige documenten. Door MindNavigator te gebruiken, bent u akkoord gegaan tijdens uw registratie.",
        contentSteps: [
            `U bent akkoord gegaan met deze voorwaarden en ons privacybeleid tijdens uw registratie op [Datum, Tijdstip van registratie].`,
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
        if (id === "ken-je-kind") return "Doe de \"Ken je Kind\" Test (Optioneel)";
        if (id === "voeg-kind-toe") return "Voeg uw Kind(eren) Toe";
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
                        {availablePlans.filter(p => ['free_start', 'family_guide_monthly', 'premium_family_monthly'].includes(p.id)).map(plan => { 
                            const PlanIcon = getPlanIcon(plan.id);
                            const yearlyEquivalentPlan = plan.billingInterval === 'month' ? availablePlans.find(yp => yp.billingInterval === 'year' && yp.id.replace('_yearly', '_monthly') === plan.id.replace('_monthly', '_monthly')) : undefined;
                            const monthlyEq = yearlyEquivalentPlan ? getMonthlyEquivalent(yearlyEquivalentPlan.price, 'year') : null;
                            const savings = yearlyEquivalentPlan ? getYearlySavings(plan.price, yearlyEquivalentPlan.price) : null;
                            
                            return (
                            <Card key={plan.id} className={cn(
                                "flex flex-col text-center transition-all duration-200 border-2",
                                plan.isPopular ? "border-primary ring-2 ring-primary/50" : "border-border",
                                planParam === plan.id ? (plan.isPopular ? "ring-2 ring-primary/50 shadow-2xl scale-105" : "border-primary ring-2 ring-primary/30 shadow-2xl scale-105") : "hover:shadow-lg"
                            )}>
                                <CardHeader className="pb-2">
                                    <PlanIcon className="mx-auto h-8 w-8 text-primary mb-2"/>
                                    <CardTitle className="text-md font-semibold">{plan.name.replace(' - Maandelijks', '')}</CardTitle>
                                    {plan.price !== undefined && <p className="text-sm font-bold text-primary">{plan.price === 0 ? 'Gratis' : `€${plan.price.toFixed(2)}/${plan.billingInterval === 'month' ? 'mnd' : 'jaar'}`}</p>}
                                    {plan.trialPeriodDays && plan.trialPeriodDays > 0 && plan.price > 0 && (
                                      <p className="text-xs text-green-600 font-medium">{plan.trialPeriodDays} dagen gratis proberen!</p>
                                    )}
                                </CardHeader>
                                <CardContent className="text-xs text-muted-foreground flex-grow space-y-1">
                                  <p className="mb-2">{plan.description}</p>
                                  {ALL_APP_FEATURES.slice(0,3).map((appFeature) => {
                                    const hasFeature = plan.featureAccess && plan.featureAccess[appFeature.id];
                                    return (
                                      <p key={appFeature.id} className={cn("flex items-center justify-center gap-1.5", hasFeature ? 'text-green-600' : 'text-muted-foreground/70 line-through')}>
                                        {hasFeature ? <CheckCircle2 className="h-3.5 w-3.5"/> : <XCircle className="h-3.5 w-3.5"/>}
                                        {appFeature.label}
                                      </p>
                                    );
                                  })}
                                  {ALL_APP_FEATURES.length > 3 && <p className="mt-1">... en meer.</p>}
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
                                {yearlyEquivalentPlan && (
                                    <div className="text-center text-xs p-2 border-t">
                                        <Button variant="link" className="p-0 h-auto text-xs text-primary" onClick={() => handlePlanCTAClick(yearlyEquivalentPlan.id)}>
                                            Ook als jaarplan: €{yearlyEquivalentPlan.price.toFixed(2)}/jaar (${monthlyEq ? `€${monthlyEq}/mnd` : ''})
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
    

