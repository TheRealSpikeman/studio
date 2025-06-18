
// src/app/dashboard/admin/subscription-management/page.tsx
"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { CreditCard, PlusCircle, Edit, Trash2, MoreVertical, CheckCircle, XCircle, Star } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';

export interface AppFeature {
  id: string;
  label: string;
  description?: string; // Optional description for admin UI
}

// ALL_APP_FEATURES is now defined here to be easily exportable and usable by other components
export const ALL_APP_FEATURES: AppFeature[] = [
  { id: 'startAssessment', label: 'Start-assessment', description: 'Basis zelfreflectie tool voor een eerste profielschets.' },
  { id: 'weeklyMotivationEmail', label: 'Wekelijkse motivatie-email', description: 'Regelmatige e-mails met tips en motivatie.' },
  { id: 'basicReflectionToolLimited', label: 'Basis zelfreflectie tool (beperkt)', description: 'Toegang tot een beperkte versie van de basis tool.' },
  { id: 'sampleCoachingContent', label: 'Sample coaching content (5 voorbeeldberichten)', description: 'Voorproefje van de dagelijkse coaching.' },
  { id: 'basicPdfOverview', label: 'Basis PDF overzicht van sterke punten', description: 'Een eenvoudig PDF rapport van de assessment.' },
  { id: 'browseProfessionals', label: 'Browse coaches & tutors (profielen bekijken)', description: 'Mogelijkheid om profielen van professionals te zien.' },
  { id: 'viewProfessionalRates', label: 'Tarieven en specialisaties zien', description: 'Details van professionals inzien.' },
  { id: 'bookSessions', label: 'Sessies boeken en betalen bij coaches & tutors', description: 'Mogelijkheid om 1-op-1 sessies te boeken.' },
  { id: 'accountManagement', label: 'Account beheer en basisinstellingen', description: 'Toegang tot standaard accountbeheer.' },
  { id: 'noProgressAnalytics', label: 'Geen voortgangsanalytics', description: 'Basisplan heeft geen gedetailleerde voortgangsanalyse.' },
  
  { id: 'dailyPersonalizedCoaching', label: 'Dagelijkse coaching berichten (gepersonaliseerd)', description: 'Gepersonaliseerde coaching op basis van profiel.' },
  { id: 'allReflectionToolsUnlimited', label: 'Alle zelfreflectie instrumenten (unlimited)', description: 'Onbeperkte toegang tot alle tools.' },
  { id: 'interactiveJournal', label: 'Interactieve dagboek en reflectie-oefeningen', description: 'Tools voor dagelijkse reflectie.' },
  { id: 'planningFocusTools', label: 'Huiswerk planner en focus tools (Pomodoro)', description: 'Tools voor planning en concentratie.' },
  { id: 'motivationTracking', label: 'Motivatie tracking met voortgangsvisualisatie', description: 'Volg en visualiseer motivatie.' },
  { id: 'extensivePdfReports', label: 'Uitgebreide PDF overzichten met diepgaande insights', description: 'Gedetailleerde rapporten.' },
  { id: 'directProfessionalCommunication', label: 'Direct contact en communicatie met professionals', description: 'Berichten sturen naar gekoppelde professionals.' },
  { id: 'reviewRatingSystem', label: 'Review en rating systeem', description: 'Beoordeel professionals.' },
  { id: 'sessionPlanningReminders', label: 'Sessie planning met automatische herinneringen', description: 'Tools voor het plannen van sessies.' },
  { id: 'childProgressTracking', label: 'Voortgangsvolging en trends van uw kind', description: 'Inzicht in de voortgang van het kind (voor ouders).' },
  { id: 'familyInsights', label: 'Familie insights en gepersonaliseerde aanbevelingen', description: 'Inzichten voor het hele gezin.' },
  { id: 'max3ChildrenIncluded', label: 'Tot 3 kinderen inbegrepen', description: 'Standaard voor familieplannen.' },
  { id: 'communicationWithLinkedProfessionals', label: 'Communicatie met gekoppelde coaches en tutors', description: 'Directe communicatie met begeleiders.' },
  { id: 'yearlyDiscount15', label: '15% korting bij jaarlijkse betaling', description: 'Korting voor jaarplannen.' },

  { id: 'extensiveAssessmentAnalysis', label: 'Uitgebreide assessment analyse & rapportage', description: 'Nog diepere analyse van de start-assessment.' },
  { id: 'aiPoweredInsights', label: 'AI-powered insights en gepersonaliseerde aanbevelingen', description: 'Geavanceerde AI-aanbevelingen.' },
  { id: 'advancedAnalyticsTrends', label: 'Advanced analytics en trendanalyse', description: 'Gedetailleerde statistieken en trends.' },
  { id: 'exclusiveCoachingModules', label: 'Exclusieve coaching modules en premium content', description: 'Toegang tot extra coaching materiaal.' },
  { id: 'priorityMatchingAlgorithm', label: 'Prioriteit algoritme voor beste coach matching', description: 'Voorrang bij het matchen met professionals.' },
  { id: 'priorityBooking', label: 'Prioriteit booking bij populaire coaches & tutors', description: 'Eerder toegang tot populaire professionals.' },
  { id: 'extendedSearchFilters', label: 'Extended zoekfilters en matching criteria', description: 'Meer filteropties bij het zoeken.' },
  { id: 'bulkSessionPlanning', label: 'Bulk session planning voor gemak', description: 'Plan meerdere sessies tegelijk.' },
  { id: 'premiumSupport24h', label: 'Premium support (24u response tijd)', description: 'Snellere klantenservice.' },
  { id: 'unlimitedChildren', label: 'Unlimited kinderen (geen limiet meer)', description: 'Onbeperkt aantal kinderen voor premium plannen.' },
  { id: 'monthlyFamilyCoachingCalls', label: 'Maandelijkse familie coaching calls (30 min)', description: 'Live coaching sessies voor het gezin.' },
  { id: 'schoolIntegrationReporting', label: 'School integratie tools en rapportage', description: 'Integratie met school systemen.' },
  { id: 'advancedParentTrainingModules', label: 'Advanced ouder training modules', description: 'Extra training materiaal voor ouders.' },
];


export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  billingInterval: 'month' | 'year' | 'once';
  featureAccess: Record<string, boolean>; // Key is AppFeature.id
  active: boolean;
  trialPeriodDays?: number;
  maxChildren?: number;
  isPopular?: boolean;
  tagline?: string; // Nieuw marketing tagline veld
}

const initialSubscriptionPlans: SubscriptionPlan[] = [
  {
    id: 'free_start', name: 'Gratis Ontdekking', description: 'Basis zelfreflectie tool & PDF overzicht.', price: 0, currency: 'EUR', billingInterval: 'once',
    tagline: 'Proef de kracht van zelfinzicht.',
    featureAccess: { 
      ...Object.fromEntries(ALL_APP_FEATURES.map(f => [f.id, false])),
      startAssessment: true, basicReflectionToolLimited: true, basicPdfOverview: true, accountManagement: true,
    },
    active: true, trialPeriodDays: 0, maxChildren: 1, isPopular: false,
  },
  {
    id: 'family_guide_monthly', name: 'Gezin Plan - Maandelijks', description: 'Complete digitale ondersteuning voor het gezin.', price: 19.99, currency: 'EUR', billingInterval: 'month',
    tagline: 'Slechts €0,13 per dag voor uitgebreide tools!',
    featureAccess: {
      ...Object.fromEntries(ALL_APP_FEATURES.map(f => [f.id, false])),
      startAssessment: true, weeklyMotivationEmail: true, allReflectionToolsUnlimited: true, interactiveJournal: true, 
      planningFocusTools: true, motivationTracking: true, extensivePdfReports: true,
      childProgressTracking: true, familyInsights: true, communicationWithLinkedProfessionals: true, accountManagement: true,
      max3ChildrenIncluded: true, browseProfessionals: true, viewProfessionalRates: true, bookSessions: true, sessionPlanningReminders: true,
    },
    active: true, trialPeriodDays: 14, maxChildren: 3, isPopular: true,
  },
   {
    id: 'family_guide_yearly', name: 'Gezin Plan - Jaarlijks', description: 'Complete digitale ondersteuning met jaarkorting.', price: 191.88, currency: 'EUR', billingInterval: 'year',
    tagline: 'Jaarlijks voordeel voor het hele gezin!',
    featureAccess: {
       ...Object.fromEntries(ALL_APP_FEATURES.map(f => [f.id, false])),
      startAssessment: true, weeklyMotivationEmail: true, allReflectionToolsUnlimited: true, interactiveJournal: true, 
      planningFocusTools: true, motivationTracking: true, extensivePdfReports: true,
      childProgressTracking: true, familyInsights: true, communicationWithLinkedProfessionals: true, accountManagement: true,
      max3ChildrenIncluded: true, browseProfessionals: true, viewProfessionalRates: true, bookSessions: true, sessionPlanningReminders: true,
      yearlyDiscount15: true,
    },
    active: true, trialPeriodDays: 14, maxChildren: 3, isPopular: false,
  },
    {
    id: 'premium_family_monthly', name: 'Premium Plan - Maandelijks', description: 'Alles van Gezins Gids, plus premium features en meer kinderen.', price: 39.99, currency: 'EUR', billingInterval: 'month',
    tagline: '€0,67 per dag - minder dan een kopje koffie!',
    featureAccess: {
      ...Object.fromEntries(ALL_APP_FEATURES.map(f => [f.id, true])), // All true for premium
      noProgressAnalytics: false, // Explicitly ensure analytics is on for premium
    },
    active: true, trialPeriodDays: 14, maxChildren: 4, isPopular: false,
  },
  {
    id: 'premium_family_yearly', name: 'Premium Plan - Jaarlijks', description: 'Alles van Premium Plan met jaarkorting.', price: 360.00, currency: 'EUR', billingInterval: 'year',
    tagline: 'Het meest complete pakket met maximale korting!',
    featureAccess: {
      ...Object.fromEntries(ALL_APP_FEATURES.map(f => [f.id, true])),
      noProgressAnalytics: false, 
      yearlyDiscount15: true, // Ensure yearly discount flag is set for this plan specifically too
    },
    active: true, trialPeriodDays: 14, maxChildren: 4, isPopular: false,
  },
];

export default function SubscriptionManagementPage() {
  const { toast } = useToast();
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);

  useEffect(() => {
    const storedPlansRaw = localStorage.getItem('subscriptionPlans');
    if (storedPlansRaw) {
      try {
        const parsedPlans: SubscriptionPlan[] = JSON.parse(storedPlansRaw);
        const migratedPlans = parsedPlans.map(plan => {
          const defaultAccess: Record<string,boolean> = {};
          ALL_APP_FEATURES.forEach(f => defaultAccess[f.id] = false); 
          
          return {
            ...plan,
            featureAccess: plan.featureAccess || defaultAccess, 
            trialPeriodDays: plan.trialPeriodDays ?? (plan.price === 0 ? 0 : 14),
            maxChildren: plan.maxChildren ?? (plan.id.includes('family') || plan.id.includes('gezin') ? 3 : (plan.price === 0 ? 1 : 0)),
            isPopular: plan.isPopular ?? false,
            tagline: plan.tagline || '', // Add tagline
          };
        });
        setPlans(migratedPlans);
        if (JSON.stringify(parsedPlans) !== JSON.stringify(migratedPlans)) {
            localStorage.setItem('subscriptionPlans', JSON.stringify(migratedPlans));
        }
      } catch (error) {
        console.error("Error parsing subscription plans from localStorage:", error);
        setPlans(initialSubscriptionPlans); 
        localStorage.setItem('subscriptionPlans', JSON.stringify(initialSubscriptionPlans));
      }
    } else {
      setPlans(initialSubscriptionPlans);
      localStorage.setItem('subscriptionPlans', JSON.stringify(initialSubscriptionPlans));
    }
  }, []);

  const handleDeletePlan = (planId: string) => {
    const updatedPlans = plans.filter(plan => plan.id !== planId);
    setPlans(updatedPlans);
    localStorage.setItem('subscriptionPlans', JSON.stringify(updatedPlans));
    toast({ title: "Abonnement Verwijderd", description: `Abonnement met ID ${planId} is verwijderd.` });
  };
  
  const formatPrice = (price: number, currency: string, interval: 'month' | 'year' | 'once') => {
    if (price === 0 && interval === 'once') return 'Gratis';
    const intervalText = interval === 'month' ? '/mnd' : interval === 'year' ? '/jaar' : '';
    return `${currency === 'EUR' ? '€' : currency}${price.toFixed(2)}${intervalText}`;
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle className="text-2xl font-bold flex items-center gap-2">
                <CreditCard className="h-6 w-6 text-primary" />
                Abonnementenbeheer
              </CardTitle>
              <CardDescription>
                Beheer hier de abonnementsplannen die beschikbaar zijn voor gebruikers.
              </CardDescription>
            </div>
            <Button asChild>
              <Link href="/dashboard/admin/subscription-management/new">
                <PlusCircle className="mr-2 h-4 w-4" /> Nieuw Abonnement Toevoegen
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Naam</TableHead>
                  <TableHead>ID</TableHead>
                  <TableHead>Prijs</TableHead>
                  <TableHead>Interval</TableHead>
                  <TableHead>Proefperiode</TableHead>
                  <TableHead>Max. Kinderen</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Populair</TableHead>
                  <TableHead className="text-right">Acties</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {plans.length === 0 && (
                  <TableRow><TableCell colSpan={9} className="h-24 text-center">Geen abonnementen geconfigureerd.</TableCell></TableRow>
                )}
                {plans.map((plan) => (
                  <TableRow key={plan.id}>
                    <TableCell className="font-medium">{plan.name}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{plan.id}</TableCell>
                    <TableCell>{formatPrice(plan.price, plan.currency, plan.billingInterval)}</TableCell>
                    <TableCell>{plan.billingInterval}</TableCell>
                    <TableCell>{plan.trialPeriodDays ? `${plan.trialPeriodDays} dagen` : 'N.v.t.'}</TableCell>
                    <TableCell>{plan.maxChildren === 0 ? 'Onbeperkt' : (plan.maxChildren || 'N.v.t.')}</TableCell>
                    <TableCell>
                      <Badge variant={plan.active ? 'default' : 'secondary'} className={plan.active ? 'bg-green-100 text-green-700 border-green-300' : 'bg-gray-100 text-gray-700 border-gray-300'}>
                        {plan.active ? <CheckCircle className="mr-1 h-3 w-3"/> : <XCircle className="mr-1 h-3 w-3"/>}
                        {plan.active ? 'Actief' : 'Inactief'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {plan.isPopular && <Star className="h-5 w-5 text-yellow-500 fill-yellow-400" />}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="h-4 w-4" /><span className="sr-only">Acties</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/dashboard/admin/subscription-management/edit/${plan.id}`}><Edit className="mr-2 h-4 w-4" />Bewerken</Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDeletePlan(plan.id)} className="text-destructive focus:text-destructive">
                            <Trash2 className="mr-2 h-4 w-4" />Verwijderen
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
    
