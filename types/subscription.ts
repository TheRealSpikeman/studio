// src/types/subscription.ts
import { SubscriptionStatus } from './status';
import { z } from "zod";

// --- LOCAL STORAGE KEYS ---
export const LOCAL_STORAGE_SUBSCRIPTION_PLANS_KEY = 'adminDashboard_SubscriptionPlans_v3'; // Incremented version
export const LOCAL_STORAGE_FEATURES_KEY = 'adminDashboard_AppFeatures_v1';

// --- CORE TYPES ---

export type TargetAudience = 'leerling' | 'ouder' | 'tutor' | 'coach' | 'platform' | 'beide';

const appFeatureSchema = z.object({
    id: z.string(),
    label: z.string(),
    description: z.string().optional(),
    targetAudience: z.array(z.custom<TargetAudience>()),
    category: z.string().optional(),
    isRecommendedTool: z.boolean().optional(),
    adminOnly: z.boolean().optional(),
});
export type AppFeature = z.infer<typeof appFeatureSchema>;

export interface SubscriptionPlan {
  id: string;
  name: string;
  shortName?: string;
  description: string;
  price: number;
  currency: 'EUR';
  billingInterval: 'month' | 'year' | 'once';
  featureAccess?: Record<string, boolean>;
  status: SubscriptionStatus;
  trialPeriodDays?: number;
  maxChildren?: number;
  isPopular?: boolean;
  tagline?: string;
}

export interface SubscriptionTier {
  id: string;
  name: string;
  description: string;
  monthlyPlan: SubscriptionPlan;
  yearlyPlan: SubscriptionPlan;
  targetAudience: ('parent' | 'child' | 'coach')[];
  maxUsers?: number;
}

// --- DATA CONSTANTS ---

export const DEFAULT_APP_FEATURES: AppFeature[] = [
    { id: 'startAssessment', label: 'Start Neurodivergentie Assessment', description: 'Toegang tot de eerste assessment.', targetAudience: ['leerling', 'ouder'], category: 'Onboarding', isRecommendedTool: true },
    { id: 'weeklyMotivationEmail', label: 'Wekelijkse motivatie email', description: 'Wekelijkse e-mails vol tips voor zelfreflectie', targetAudience: ['leerling'], category: 'Communicatie' },
    { id: 'basicReflectionToolLimited', label: 'Zelfreflectie Tools (basis, beperkt)', description: 'Basistools voor zelfreflectie', targetAudience: ['leerling'], category: 'Gratis Tier' },
    { id: 'allReflectionToolsUnlimited', label: 'Zelfreflectie Tools (alles, onbeperkt)', description: 'Toegang tot alle zelfreflectietools.', targetAudience: ['leerling'], category: 'Coaching' },
    { id: 'interactiveJournal', label: 'Interactief Dagboek', description: 'Interactief dagboek om ideeën te ordenen.', targetAudience: ['leerling'], category: 'Coaching', isRecommendedTool: true },
    { id: 'homeworkPlannerFocusTools', label: 'Huiswerk Planner & Focus Tools', description: 'Tools om huiswerk te plannen en beter te focussen.', targetAudience: ['leerling'], category: 'Tools', isRecommendedTool: true },
    { id: 'motivationTracking', label: 'Motivatie Tracker', description: 'Tool om persoonlijke motivatie te monitoren.', targetAudience: ['leerling'], category: 'Tools' },
    { id: 'basicPdfOverview', label: 'PDF rapportages (basis)', description: 'PDF export van de assessment resultaten (basis).', targetAudience: ['leerling', 'ouder'], category: 'Gratis Tier' },
    { id: 'extensivePdfReports', label: 'PDF rapportages (uitgebreid)', description: 'PDF export van de assessment resultaten (uitgebreid).', targetAudience: ['leerling', 'ouder'], category: 'Rapportage' },
    { id: 'noProgressAnalytics', label: 'Geen voortgangsanalyse', description: 'Gebruikers kunnen voortgangsanalyse uitzetten', targetAudience: ['platform'], category: 'Privacy', adminOnly: true },
    { id: 'childProgressTracking', label: 'Kind voortgang volgen', description: 'Voortgang volgen van een kind.', targetAudience: ['ouder'], category: 'Ouder Dashboard' },
    { id: 'familyInsights', label: 'Familie inzichten', description: 'Inzichten over het hele gezin.', targetAudience: ['ouder'], category: 'Ouder Dashboard' },
    { id: 'communicationWithLinkedProfessionals', label: 'Communicatie met tutors/coaches', description: 'Direct communiceren met gekoppelde begeleiders.', targetAudience: ['ouder', 'leerling'], category: 'Communicatie' },
    { id: 'browseProfessionals', label: 'Browse Geregistreerde Professionals', description: 'Browse door geregistreerde professionals.', targetAudience: ['ouder'], category: 'Marktplaats' },
    { id: 'professionalRates', label: 'Inzien Tarieven Professionals', description: 'Inzien van de tarieven van geregistreerde professionals.', targetAudience: ['ouder'], category: 'Marktplaats' },
    { id: 'bookPaySessions', label: 'Sessie Boeken & Betalen', description: 'Mogelijkheid tot het boeken en betalen van sessies.', targetAudience: ['ouder'], category: 'Marktplaats' },
    { id: 'sessionPlanningReminders', label: 'Sessie Planning & Reminders', description: 'Sessie planning met automatische reminders.', targetAudience: ['ouder', 'leerling', 'tutor', 'coach'], category: 'Planning' },
    { id: 'aiPoweredInsights', label: 'AI gedreven inzichten', description: 'AI gedreven inzichten voor kind en ouder', targetAudience: ['leerling', 'ouder'], category: 'AI', isRecommendedTool: true },
    { id: 'exclusiveCoachingModules', label: 'Exclusive coaching modules', description: 'Exclusieve coaching modules', targetAudience: ['leerling'], category: 'Coaching' },
    { id: 'accountManagement', label: 'Accountbeheer', description: 'Toegang tot accountbeheer', targetAudience: ['platform'], category: 'Algemeen' },
    { id: 'max3ChildrenIncluded', label: 'Max 3 kinderen', description: 'Account heeft tot 3 kinderen', targetAudience: ['ouder'], category: 'Abonnementen' },
    { id: 'max4ChildrenIncluded', label: 'Max 4 kinderen', description: 'Account heeft tot 4 kinderen', targetAudience: ['ouder'], category: 'Abonnementen' },
    { id: 'yearlyDiscount15', label: '15% jaarkorting', description: '15% korting voor jaarabonnement', targetAudience: ['platform'], category: 'Abonnementen', adminOnly: true },
];

export const SUBSCRIPTION_PLANS: SubscriptionTier[] = [
  {
    id: 'free',
    name: 'Gratis Kennismaking',
    description: 'Ontdek MindNavigator zonder kosten',
    monthlyPlan: {
      id: 'free_start', name: 'Gratis Start', shortName: 'Gratis', description: 'Basis zelfreflectie tool & PDF overzicht.', price: 0, currency: 'EUR', billingInterval: 'once',
      featureAccess: { ...Object.fromEntries(DEFAULT_APP_FEATURES.map(f => [f.id, false])), startAssessment: true, basicReflectionToolLimited: true, basicPdfOverview: true, accountManagement: true, }, status: 'actief', trialPeriodDays: 0, maxChildren: 1, isPopular: false,
    },
    yearlyPlan: {
      id: 'free_start_yearly', name: 'Gratis Start Jaarlijks', shortName: 'Gratis', description: 'Basis zelfreflectie tool & PDF overzicht.', price: 0, currency: 'EUR', billingInterval: 'year',
      featureAccess: { ...Object.fromEntries(DEFAULT_APP_FEATURES.map(f => [f.id, false])), startAssessment: true, basicReflectionToolLimited: true, basicPdfOverview: true, accountManagement: true, }, status: 'actief', trialPeriodDays: 0, maxChildren: 1, isPopular: false,
    },
    targetAudience: ['parent', 'child']
  },
  {
    id: 'family_guide',
    name: 'Gezins Gids',
    description: 'Complete digitale ondersteuning voor het gezin.',
    monthlyPlan: {
      id: 'family_guide_monthly', name: 'Gezins Gids - Maandelijks', shortName: 'Gezin M', description: 'Complete digitale ondersteuning voor het gezin.', price: 19.99, currency: 'EUR', billingInterval: 'month',
      featureAccess: { ...Object.fromEntries(DEFAULT_APP_FEATURES.map(f => [f.id, false])), startAssessment: true, weeklyMotivationEmail: true, allReflectionToolsUnlimited: true, interactiveJournal: true, homeworkPlannerFocusTools: true, motivationTracking: true, extensivePdfReports: true, childProgressTracking: true, familyInsights: true, communicationWithLinkedProfessionals: true, accountManagement: true, max3ChildrenIncluded: true, browseProfessionals: true, professionalRates: true, bookPaySessions: true, sessionPlanningReminders: true, aiPoweredInsights: true, exclusiveCoachingModules: true, },
      status: 'actief', trialPeriodDays: 14, maxChildren: 3, isPopular: true,
    },
    yearlyPlan: {
      id: 'family_guide_yearly', name: 'Gezins Gids - Jaarlijks', shortName: 'Gezin J', description: 'Complete digitale ondersteuning met jaarkorting.', price: 191.88, currency: 'EUR', billingInterval: 'year',
      featureAccess: { ...Object.fromEntries(DEFAULT_APP_FEATURES.map(f => [f.id, false])), startAssessment: true, weeklyMotivationEmail: true, allReflectionToolsUnlimited: true, interactiveJournal: true, homeworkPlannerFocusTools: true, motivationTracking: true, extensivePdfReports: true, childProgressTracking: true, familyInsights: true, communicationWithLinkedProfessionals: true, accountManagement: true, max3ChildrenIncluded: true, browseProfessionals: true, professionalRates: true, bookPaySessions: true, sessionPlanningReminders: true, yearlyDiscount15: true, aiPoweredInsights: true, exclusiveCoachingModules: true, },
      status: 'actief', trialPeriodDays: 14, maxChildren: 3, isPopular: false,
    },
    targetAudience: ['parent']
  },
];

export const initialDefaultPlans: SubscriptionPlan[] = SUBSCRIPTION_PLANS.flatMap(tier => [tier.monthlyPlan, tier.yearlyPlan]);


// --- HELPER FUNCTIONS ---
export function getPlanById(planId: string): SubscriptionPlan | undefined {
  for (const tier of SUBSCRIPTION_PLANS) {
    if (tier.monthlyPlan.id === planId) return tier.monthlyPlan;
    if (tier.yearlyPlan.id === planId) return tier.yearlyPlan;
  }
  return undefined;
}

export function getTierById(tierId: string): SubscriptionTier | undefined {
  return SUBSCRIPTION_PLANS.find(tier => tier.id === tierId);
}

export const formatPrice = (price: number, currency: string = 'EUR', interval?: 'month' | 'year' | 'once'): string => {
    if (price === 0 && (!interval || interval === 'once')) return 'Gratis';
    const intervalText = interval === 'month' ? '/mnd' : interval === 'year' ? '/jaar' : '';
    return `${currency === 'EUR' ? '€' : currency}${price.toFixed(2).replace('.', ',')}${intervalText}`;
};

export const getYearlyDiscount = (monthlyPrice: number, yearlyPrice: number): string | null => {
    if (monthlyPrice > 0 && yearlyPrice > 0) {
        const totalMonthlyCost = monthlyPrice * 12;
        const savings = totalMonthlyCost - yearlyPrice;
        if (savings > 0) { return savings.toFixed(2).replace('.',','); }
    }
    return null;
}
