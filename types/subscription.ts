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
  billingInterval: 'month' | 'year' | 'once';
  featureAccess?: Record<string, boolean>; 
  active: boolean;
  trialPeriodDays?: number;
  maxChildren?: number;
  isPopular?: boolean;
}

// --- DATA CONSTANTS ---
export const LOCAL_STORAGE_SUBSCRIPTION_PLANS_KEY = 'mindnavigator_subscription_plans';

export const DEFAULT_APP_FEATURES: AppFeature[] = [
    { id: 'full-access-tools', label: 'Volledige toegang tot alle zelfreflectie-instrumenten', targetAudience: ['leerling'] },
    { id: 'daily-coaching', label: 'Dagelijkse coaching en motivatie', targetAudience: ['leerling'] },
    { id: 'homework-tools', label: 'Huiswerk- en planningstools', targetAudience: ['leerling'] },
    { id: 'progress-reports', label: 'Persoonlijke voortgangsrapporten', targetAudience: ['leerling', 'ouder'] },
    { id: 'expert-network', label: 'Toegang tot expert netwerk voor coaching & begeleiding', targetAudience: ['ouder'] },
    { id: 'parent-dashboard', label: 'Ouder-dashboard met inzichten', targetAudience: ['ouder'] },
    { id: 'future-updates', label: 'Alle toekomstige updates en nieuwe features', targetAudience: ['platform'] },
];

export const initialDefaultPlans: SubscriptionPlan[] = [
  {
    id: 'free_start',
    name: 'Gratis Start',
    shortName: 'Gratis',
    description: 'Doe de basis assessment en ontdek je profiel. Een perfecte eerste stap.',
    price: 0,
    currency: 'EUR',
    billingInterval: 'once',
    featureAccess: {
        'full-access-tools': true,
    },
    active: true,
    isPopular: false,
  },
  {
    id: 'coaching_tools_monthly',
    name: 'Coaching & Tools - Maandelijks',
    shortName: 'Coaching M',
    description: 'Volledige toegang tot alle tools en de dagelijkse coaching hub voor 1 kind.',
    price: 2.50,
    currency: 'EUR',
    billingInterval: 'month',
    featureAccess: {
        'full-access-tools': true,
        'daily-coaching': true,
        'homework-tools': true,
        'progress-reports': true,
        'future-updates': true,
    },
    active: true,
    trialPeriodDays: 14,
    maxChildren: 1,
    isPopular: false,
  },
  {
    id: 'family_guide_monthly',
    name: 'Gezins Gids - Maandelijks',
    shortName: 'Gezin M',
    description: 'Alles van "Coaching & Tools", plus het Ouder Dashboard en toegang tot de marktplaats voor begeleiders.',
    price: 5.00,
    currency: 'EUR',
    billingInterval: 'month',
    featureAccess: {
        'full-access-tools': true,
        'daily-coaching': true,
        'homework-tools': true,
        'progress-reports': true,
        'expert-network': true,
        'parent-dashboard': true,
        'future-updates': true,
    },
    active: true,
    trialPeriodDays: 14,
    maxChildren: 3,
    isPopular: true,
  }
];


// --- HELPER FUNCTIONS ---
export const getSubscriptionPlans = (): SubscriptionPlan[] => {
    if (typeof window === 'undefined') {
        return initialDefaultPlans;
    }
    const storedPlansRaw = localStorage.getItem(LOCAL_STORAGE_SUBSCRIPTION_PLANS_KEY);
    if (storedPlansRaw && storedPlansRaw !== 'undefined') {
        try {
            return JSON.parse(storedPlansRaw);
        } catch (e) {
            return initialDefaultPlans;
        }
    }
    return initialDefaultPlans;
};

export const saveSubscriptionPlans = (plans: SubscriptionPlan[]): void => {
    if (typeof window !== 'undefined') {
        localStorage.setItem(LOCAL_STORAGE_SUBSCRIPTION_PLANS_KEY, JSON.stringify(plans));
    }
};

export const getAllFeatures = (): AppFeature[] => {
    return DEFAULT_APP_FEATURES;
};

// You might need a saveAllFeatures if you plan to make features editable
export const saveAllFeatures = (features: AppFeature[]): void => {
  // In this simplified setup, we don't save features back to a central store
  // as they are defined as a constant. If they were dynamic, this function
  // would save them to localStorage or a database.
  console.log("Saving features is not implemented in this mock setup.");
};

export const formatPrice = (price: number, currency: string, interval: 'month' | 'year' | 'once') => {
    if (price === 0 && interval === 'once') return 'Gratis';
    const intervalText = interval === 'month' ? '/mnd' : interval === 'year' ? '/jaar' : '';
    return `${currency === 'EUR' ? '€' : currency}${price.toFixed(2)}${intervalText}`;
};
