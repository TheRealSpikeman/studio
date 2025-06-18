
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

export type TargetAudience = 'leerling' | 'ouder' | 'platform' | 'beide';

export interface AppFeature {
  id: string;
  label: string;
  description?: string;
  targetAudience: TargetAudience[];
  category?: string;
}

export const DEFAULT_APP_FEATURES: AppFeature[] = [
  // Kolom 1 uit screenshot (features van de afbeelding)
  { id: 'startAssessment', label: 'Start-assessment', description: 'Basis zelfreflectie tool voor een eerste profielschets.', targetAudience: ['leerling', 'ouder'], category: 'Assessment' },
  { id: 'sampleCoachingContent', label: 'Sample coaching content (5 voorbeeldberichten)', description: 'Voorproefje van de dagelijkse coaching.', targetAudience: ['leerling'], category: 'Coaching' },
  { id: 'professionalRates', label: 'Tarieven en specialisaties zien', description: 'Details van professionals inzien.', targetAudience: ['ouder'], category: 'Professionals' },
  { id: 'noProgressAnalytics', label: 'Geen voortgangsanalytics', description: 'Basisplan heeft geen gedetailleerde voortgangsanalyse.', targetAudience: ['platform'], category: 'Analytics' }, 
  { id: 'interactiveJournal', label: 'Interactieve dagboek en reflectie-oefeningen', description: 'Tools voor dagelijkse reflectie.', targetAudience: ['leerling'], category: 'Tools' },
  { id: 'extensivePdfReports', label: 'Uitgebreide PDF overzichten met diepgaande insights', description: 'Gedetailleerde rapporten.', targetAudience: ['leerling', 'ouder'], category: 'Rapportage' },
  { id: 'sessionPlanningReminders', label: 'Sessie planning met automatische herinneringen', description: 'Tools voor het plannen van sessies.', targetAudience: ['leerling', 'ouder'], category: 'Tools' },
  { id: 'max3ChildrenIncluded', label: 'Tot 3 kinderen inbegrepen', description: 'Standaard voor familieplannen.', targetAudience: ['ouder', 'platform'], category: 'Account' },
  { id: 'extensiveAssessmentAnalysis', label: 'Uitgebreide assessment analyse & rapportage', description: 'Nog diepere analyse van de start-assessment.', targetAudience: ['leerling', 'ouder'], category: 'Assessment' },
  { id: 'exclusiveCoachingModules', label: 'Exclusieve coaching modules en premium content', description: 'Toegang tot extra coaching materiaal.', targetAudience: ['leerling'], category: 'Coaching' },
  { id: 'extendedSearchFilters', label: 'Extended zoekfilters en matching criteria', description: 'Meer filteropties bij het zoeken.', targetAudience: ['ouder'], category: 'Professionals' },
  { id: 'unlimitedChildren', label: 'Unlimited kinderen (geen limiet meer)', description: 'Onbeperkt aantal kinderen voor premium plannen.', targetAudience: ['ouder', 'platform'], category: 'Account' },
  { id: 'advancedParentTrainingModules', label: 'Advanced ouder training modules', description: 'Extra training materiaal voor ouders.', targetAudience: ['ouder'], category: 'Coaching' },

  // Kolom 2 uit screenshot
  { id: 'weeklyMotivationEmail', label: 'Wekelijkse motivatie-email', description: 'Regelmatige e-mails met tips en motivatie.', targetAudience: ['leerling'], category: 'Coaching' },
  { id: 'basicPdfOverview', label: 'Basis PDF overzicht van sterke punten', description: 'Een eenvoudig PDF rapport van de assessment.', targetAudience: ['leerling', 'ouder'], category: 'Rapportage' },
  { id: 'bookPaySessions', label: 'Sessies boeken en betalen bij coaches & tutors', description: 'Mogelijkheid om 1-op-1 sessies te boeken.', targetAudience: ['ouder'], category: 'Professionals' },
  { id: 'dailyPersonalizedCoaching', label: 'Dagelijkse coaching berichten (gepersonaliseerd)', description: 'Gepersonaliseerde coaching op basis van profiel.', targetAudience: ['leerling'], category: 'Coaching' },
  { id: 'homeworkPlannerFocusTools', label: 'Huiswerk planner en focus tools (Pomodoro)', description: 'Tools voor planning en concentratie.', targetAudience: ['leerling'], category: 'Tools' },
  { id: 'directCommunicationProfessionals', label: 'Direct contact en communicatie met professionals', description: 'Berichten sturen naar gekoppelde professionals.', targetAudience: ['beide'], category: 'Communicatie' },
  { id: 'childProgressTracking', label: 'Voortgangsvolging en trends van uw kind', description: 'Inzicht in de voortgang van het kind (voor ouders).', targetAudience: ['ouder'], category: 'Analytics' },
  { id: 'communicationWithLinkedProfessionals', label: 'Communicatie met gekoppelde coaches en tutors', description: 'Directe communicatie met begeleiders.', targetAudience: ['ouder'], category: 'Communicatie' },
  { id: 'aiPoweredInsights', label: 'AI-powered insights en gepersonaliseerde aanbevelingen', description: 'Geavanceerde AI-aanbevelingen.', targetAudience: ['leerling', 'ouder'], category: 'Coaching' },
  { id: 'priorityCoachMatching', label: 'Prioriteit algoritme voor beste coach matching', description: 'Voorrang bij het matchen met professionals.', targetAudience: ['ouder', 'platform'], category: 'Professionals' },
  { id: 'bulkSessionPlanning', label: 'Bulk session planning voor gemak', description: 'Plan meerdere sessies tegelijk.', targetAudience: ['ouder'], category: 'Tools' },
  { id: 'monthlyFamilyCoachingCalls', label: 'Maandelijkse familie coaching calls (30 min)', description: 'Live coaching sessies voor het gezin.', targetAudience: ['ouder'], category: 'Coaching' },

  // Kolom 3 uit screenshot
  { id: 'basicReflectionToolLimited', label: 'Basis zelfreflectie tool (beperkt)', description: 'Toegang tot een beperkte versie van de basis tool.', targetAudience: ['leerling'], category: 'Assessment' },
  { id: 'browseProfessionals', label: 'Browse coaches & tutors (profielen bekijken)', description: 'Mogelijkheid om profielen van professionals te zien.', targetAudience: ['ouder'], category: 'Professionals' },
  { id: 'accountManagement', label: 'Account beheer en basisinstellingen', description: 'Toegang tot standaard accountbeheer.', targetAudience: ['platform'], category: 'Account' },
  { id: 'allReflectionToolsUnlimited', label: 'Alle zelfreflectie instrumenten (unlimited)', description: 'Onbeperkte toegang tot alle tools.', targetAudience: ['leerling'], category: 'Assessment' },
  { id: 'motivationTracking', label: 'Motivatie tracking met voortgangsvisualisatie', description: 'Volg en visualiseer motivatie.', targetAudience: ['leerling'], category: 'Tools' },
  { id: 'reviewRatingSystem', label: 'Review en rating systeem', description: 'Beoordeel professionals.', targetAudience: ['ouder'], category: 'Professionals' },
  { id: 'familyInsights', label: 'Familie insights en gepersonaliseerde aanbevelingen', description: 'Inzichten voor het hele gezin.', targetAudience: ['ouder'], category: 'Coaching' },
  { id: 'yearlyDiscount15', label: '15% korting bij jaarlijkse betaling', description: 'Korting voor jaarplannen.', targetAudience: ['platform'], category: 'Voordeel' },
  { id: 'advancedAnalyticsTrends', label: 'Advanced analytics en trendanalyse', description: 'Gedetailleerde statistieken en trends.', targetAudience: ['ouder'], category: 'Analytics' },
  { id: 'priorityBookingProfessionals', label: 'Prioriteit booking bij populaire coaches & tutors', description: 'Eerder toegang tot populaire professionals.', targetAudience: ['ouder', 'platform'], category: 'Professionals' },
  { id: 'premiumSupport24h', label: 'Premium support (24u response tijd)', description: 'Snellere klantenservice.', targetAudience: ['platform'], category: 'Support' },
  { id: 'schoolIntegrationReporting', label: 'School integratie tools en rapportage', description: 'Integratie met school systemen.', targetAudience: ['ouder', 'platform'], category: 'Tools' },
];

export const LOCAL_STORAGE_FEATURES_KEY = 'mindnavigator_app_features';
export const LOCAL_STORAGE_SUBSCRIPTION_PLANS_KEY = 'mindnavigator_subscription_plans';


export interface SubscriptionPlan {
  id: string;
  name: string;
  shortName?: string; // Nieuw veld voor afkorting
  description: string;
  tagline?: string;
  price: number;
  currency: string;
  billingInterval: 'month' | 'year' | 'once';
  featureAccess: Record<string, boolean>; 
  active: boolean;
  trialPeriodDays?: number;
  maxChildren?: number;
  isPopular?: boolean;
}

const initialSubscriptionPlans: SubscriptionPlan[] = [
  {
    id: 'free_start', name: 'Gratis Start', shortName: 'Gratis', description: 'Basis zelfreflectie tool & PDF overzicht.', price: 0, currency: 'EUR', billingInterval: 'once',
    tagline: 'Proef de kracht van zelfinzicht.',
    featureAccess: { 
      ...Object.fromEntries(DEFAULT_APP_FEATURES.map(f => [f.id, false])),
      startAssessment: true, basicReflectionToolLimited: true, basicPdfOverview: true, accountManagement: true,
    },
    active: true, trialPeriodDays: 0, maxChildren: 1, isPopular: false,
  },
  {
    id: 'family_guide_monthly', name: 'Gezins Gids - Maandelijks', shortName: 'Gezin M', description: 'Complete digitale ondersteuning voor het gezin.', price: 19.99, currency: 'EUR', billingInterval: 'month',
    tagline: 'Slechts €0,13 per dag voor uitgebreide tools!',
    featureAccess: {
      ...Object.fromEntries(DEFAULT_APP_FEATURES.map(f => [f.id, false])),
      startAssessment: true, weeklyMotivationEmail: true, allReflectionToolsUnlimited: true, interactiveJournal: true, 
      homeworkPlannerFocusTools: true, motivationTracking: true, extensivePdfReports: true,
      childProgressTracking: true, familyInsights: true, communicationWithLinkedProfessionals: true, accountManagement: true,
      max3ChildrenIncluded: true, browseProfessionals: true, professionalRates: true, bookPaySessions: true, sessionPlanningReminders: true,
      aiPoweredInsights: true, exclusiveCoachingModules: true, 
    },
    active: true, trialPeriodDays: 14, maxChildren: 3, isPopular: true,
  },
   {
    id: 'family_guide_yearly', name: 'Gezins Gids - Jaarlijks', shortName: 'Gezin J', description: 'Complete digitale ondersteuning met jaarkorting.', price: 191.88, currency: 'EUR', billingInterval: 'year',
    tagline: 'Jaarlijks voordeel voor het hele gezin!',
    featureAccess: {
       ...Object.fromEntries(DEFAULT_APP_FEATURES.map(f => [f.id, false])),
      startAssessment: true, weeklyMotivationEmail: true, allReflectionToolsUnlimited: true, interactiveJournal: true, 
      homeworkPlannerFocusTools: true, motivationTracking: true, extensivePdfReports: true,
      childProgressTracking: true, familyInsights: true, communicationWithLinkedProfessionals: true, accountManagement: true,
      max3ChildrenIncluded: true, browseProfessionals: true, professionalRates: true, bookPaySessions: true, sessionPlanningReminders: true,
      yearlyDiscount15: true,
      aiPoweredInsights: true, exclusiveCoachingModules: true,
    },
    active: true, trialPeriodDays: 14, maxChildren: 3, isPopular: false,
  },
    {
    id: 'premium_family_monthly', name: 'Premium Plan - Maandelijks', shortName: 'Prem M', description: 'Alles van Gezins Gids, plus premium features en meer kinderen.', price: 39.99, currency: 'EUR', billingInterval: 'month',
    tagline: '€0,67 per dag - minder dan een kopje koffie!',
    featureAccess: {
      ...Object.fromEntries(DEFAULT_APP_FEATURES.map(f => [f.id, true])), 
      noProgressAnalytics: false, 
    },
    active: true, trialPeriodDays: 14, maxChildren: 4, isPopular: false,
  },
  {
    id: 'premium_family_yearly', name: 'Premium Plan - Jaarlijks', shortName: 'Prem J', description: 'Alles van Premium Plan met jaarkorting.', price: 360.00, currency: 'EUR', billingInterval: 'year',
    tagline: 'Het meest complete pakket met maximale korting!',
    featureAccess: {
      ...Object.fromEntries(DEFAULT_APP_FEATURES.map(f => [f.id, true])),
      noProgressAnalytics: false, 
      yearlyDiscount15: true, 
    },
    active: true, trialPeriodDays: 14, maxChildren: 4, isPopular: false,
  },
];

export default function SubscriptionManagementPage() {
  const { toast } = useToast();
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);

  useEffect(() => {
    const storedPlansRaw = localStorage.getItem(LOCAL_STORAGE_SUBSCRIPTION_PLANS_KEY);
    if (storedPlansRaw) {
      try {
        const parsedPlans: SubscriptionPlan[] = JSON.parse(storedPlansRaw);
        const migratedPlans = parsedPlans.map(plan => {
          const defaultAccess: Record<string,boolean> = {};
          DEFAULT_APP_FEATURES.forEach(f => {
            defaultAccess[f.id] = plan.featureAccess?.[f.id] || false;
          }); 
          
          return {
            ...plan,
            shortName: plan.shortName ?? '',
            featureAccess: defaultAccess,
            trialPeriodDays: plan.trialPeriodDays ?? (plan.price === 0 ? 0 : 14),
            maxChildren: plan.maxChildren ?? (plan.id.includes('family') || plan.id.includes('gezin') ? 3 : (plan.price === 0 ? 1 : 0)),
            isPopular: plan.isPopular ?? false,
            tagline: plan.tagline || '',
          };
        });
        setPlans(migratedPlans);
        if (JSON.stringify(parsedPlans) !== JSON.stringify(migratedPlans)) { // Check if migration actually changed something
            localStorage.setItem(LOCAL_STORAGE_SUBSCRIPTION_PLANS_KEY, JSON.stringify(migratedPlans));
        }
      } catch (error) {
        console.error("Error parsing subscription plans from localStorage:", error);
        setPlans(initialSubscriptionPlans); 
        localStorage.setItem(LOCAL_STORAGE_SUBSCRIPTION_PLANS_KEY, JSON.stringify(initialSubscriptionPlans));
      }
    } else {
      setPlans(initialSubscriptionPlans);
      localStorage.setItem(LOCAL_STORAGE_SUBSCRIPTION_PLANS_KEY, JSON.stringify(initialSubscriptionPlans));
    }
  }, []);

  const handleDeletePlan = (planId: string) => {
    const updatedPlans = plans.filter(plan => plan.id !== planId);
    setPlans(updatedPlans);
    localStorage.setItem(LOCAL_STORAGE_SUBSCRIPTION_PLANS_KEY, JSON.stringify(updatedPlans));
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
                  <TableHead>Afkorting</TableHead>
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
                  <TableRow><TableCell colSpan={10} className="h-24 text-center">Geen abonnementen geconfigureerd.</TableCell></TableRow>
                )}
                {plans.map((plan) => (
                  <TableRow key={plan.id}>
                    <TableCell className="font-medium">{plan.name}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{plan.shortName || '-'}</TableCell>
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
    
