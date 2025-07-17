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
  price: number; // The single source of truth for the monthly price
  currency: 'EUR';
  yearlyDiscountPercent?: number; // Optional yearly discount percentage
  billingInterval: 'month' | 'year' | 'once';
  maxParents?: number;
  maxChildren?: number;
  featureAccess?: Record<string, boolean>; 
  active: boolean;
  trialPeriodDays?: number;
  isPopular?: boolean;
}

// --- DATA CONSTANTS (for seeding and direct use) ---
const PLANS_COLLECTION = 'subscriptionPlans';
const FEATURES_COLLECTION = 'features';

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
    shortName: 'Coaching & Tools',
    description: 'Essentiële tools en dagelijkse coaching voor één kind.',
    price: 15.00,
    currency: 'EUR',
    billingInterval: 'month',
    yearlyDiscountPercent: 15,
    maxParents: 1,
    maxChildren: 1,
    active: true,
    trialPeriodDays: 14,
    isPopular: true,
    featureAccess: { 'full-access-tools': true, 'daily-coaching': true, 'homework-tools': true, 'progress-reports': true, 'parent-dashboard': false, 'expert-network-tutor': false, 'expert-network-coach': true, 'future-updates': true, },
  },
  {
    id: 'family_guide_monthly',
    name: 'Gezins Gids',
    shortName: 'Gezins Gids',
    description: 'Alles van "Coaching & Tools", plus het Ouder Dashboard en toegang tot alle begeleiders.',
    price: 25.00,
    currency: 'EUR',
    billingInterval: 'month',
    yearlyDiscountPercent: 15,
    maxParents: 2,
    maxChildren: 2,
    active: true,
    trialPeriodDays: 14,
    isPopular: false,
    featureAccess: { 'full-access-tools': true, 'daily-coaching': true, 'homework-tools': true, 'progress-reports': true, 'parent-dashboard': true, 'expert-network-tutor': true, 'expert-network-coach': true, 'future-updates': true, },
  },
  {
    id: 'family_guide_large',
    name: 'Gezins Gids (Groot)',
    shortName: 'Gezins Gids+',
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

// --- Simple, synchronous functions to return the data constants ---

export const getSubscriptionPlans = (): SubscriptionPlan[] => {
    return initialDefaultPlans;
};

export const getSubscriptionPlanById = (id: string): SubscriptionPlan | null => {
    return initialDefaultPlans.find(p => p.id === id) || null;
};

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
    return formatPrice(plan.price, plan.currency, plan.billingInterval);
};
