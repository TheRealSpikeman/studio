
// src/types/subscription.ts
import { z } from "zod";

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
  tagline?: string;
  price: number;
  currency: 'EUR';
  yearlyDiscountPercent?: number;
  billingInterval: 'month' | 'year' | 'once';
  maxParents?: number; 
  maxChildren?: number;
  featureAccess?: Record<string, boolean>; 
  active: boolean;
  trialPeriodDays?: number;
  isPopular?: boolean;
}


// --- DATA CONSTANTS (The Single Source of Truth) ---

export const DEFAULT_APP_FEATURES: AppFeature[] = [
    { id: 'full-access-tools', label: 'Volledige toegang tot alle zelfreflectie-instrumenten', targetAudience: ['leerling'] },
    { id: 'daily-coaching', label: 'Dagelijkse coaching en motivatie', targetAudience: ['leerling'] },
    { id: 'homework-tools', label: 'Huiswerk- en planningstools', targetAudience: ['leerling'] },
    { id: 'progress-reports', label: 'Persoonlijke voortgangsrapporten', targetAudience: ['leerling', 'ouder'] },
    { id: 'parent-dashboard', label: 'Ouder-dashboard met inzichten', targetAudience: ['ouder'] },
    { id: 'expert-network-tutor', label: 'Toegang tot netwerk voor huiswerkbegeleiding (tutors)', targetAudience: ['ouder'] },
    { id: 'expert-network-coach', label: 'Toegang tot netwerk voor 1-op-1 coaching (coaches)', targetAudience: ['ouder'] },
    { id: 'future-updates', label: 'Alle toekomstige updates en nieuwe features', targetAudience: ['platform'] },
];

export const initialDefaultPlans: SubscriptionPlan[] = [
  {
    id: 'coaching_tools_monthly',
    name: 'Coaching & Tools',
    shortName: '1 Kind',
    description: 'Essentiële tools en dagelijkse coaching voor één kind, plus het Ouder Dashboard.',
    price: 15.00,
    currency: 'EUR',
    billingInterval: 'month',
    yearlyDiscountPercent: 15,
    maxParents: 2,
    maxChildren: 1,
    active: true,
    trialPeriodDays: 14,
    isPopular: false,
    featureAccess: { 'full-access-tools': true, 'daily-coaching': true, 'homework-tools': true, 'progress-reports': true, 'parent-dashboard': true, 'expert-network-tutor': true, 'expert-network-coach': true, 'future-updates': true, },
  },
  {
    id: 'family_guide_monthly',
    name: 'Gezins Gids',
    shortName: '2 Kinderen',
    description: 'Alle tools en coaching voor het hele gezin, met ondersteuning voor maximaal 2 kinderen.',
    price: 25.00,
    currency: 'EUR',
    billingInterval: 'month',
    yearlyDiscountPercent: 15,
    maxParents: 2,
    maxChildren: 2,
    active: true,
    trialPeriodDays: 14,
    isPopular: true,
    featureAccess: { 'full-access-tools': true, 'daily-coaching': true, 'homework-tools': true, 'progress-reports': true, 'parent-dashboard': true, 'expert-network-tutor': true, 'expert-network-coach': true, 'future-updates': true, },
  },
   {
    id: 'family_guide_large',
    name: 'Gezins Gids+',
    shortName: '3+ Kinderen',
    description: 'De beste optie voor grotere gezinnen, met ondersteuning voor maximaal 4 kinderen.',
    price: 35.00,
    currency: 'EUR',
    billingInterval: 'month',
    yearlyDiscountPercent: 20,
    maxParents: 2,
    maxChildren: 4,
    active: true,
    trialPeriodDays: 14,
    isPopular: false,
    featureAccess: { 'full-access-tools': true, 'daily-coaching': true, 'homework-tools': true, 'progress-reports': true, 'parent-dashboard': true, 'expert-network-tutor': true, 'expert-network-coach': true, 'future-updates': true, },
  },
];


// --- Helper Functions ---

/**
 * Retrieves the subscription plans.
 * This is now a simple, synchronous function that returns the hardcoded plans,
 * ensuring data is always available without async/client-side dependencies.
 * @returns {SubscriptionPlan[]} The array of subscription plans.
 */
export const getSubscriptionPlans = (): SubscriptionPlan[] => {
  return initialDefaultPlans;
};

/**
 * Retrieves all available application features.
 * @returns {AppFeature[]} The array of application features.
 */
export const getAllFeatures = (): AppFeature[] => {
    return DEFAULT_APP_FEATURES;
};

// Simplified formatters
export const formatPrice = (price: number, currency: string, interval: 'month' | 'year' | 'once') => {
    if (price === 0 && interval === 'once') return 'Gratis';
    const intervalText = interval === 'month' ? '/mnd' : interval === 'year' ? '/jaar' : '';
    return `${currency === 'EUR' ? '€' : currency}${price.toFixed(2).replace('.', ',')}${intervalText}`;
};

export const formatFullPrice = (plan: SubscriptionPlan) => {
    if (plan.billingInterval === 'year' && plan.yearlyDiscountPercent) {
        const yearlyPrice = plan.price * 12;
        const discountedYearly = yearlyPrice * (1 - plan.yearlyDiscountPercent / 100);
        return `${formatPrice(discountedYearly, plan.currency, 'year')} (${plan.yearlyDiscountPercent}% korting)`;
    }
    return formatPrice(plan.price, plan.currency, plan.billingInterval);
};
