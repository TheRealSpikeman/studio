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
  maxChildren?: number; // Nieuw veld
  featureAccess?: Record<string, boolean>; 
  active: boolean;
  trialPeriodDays?: number;
  isPopular?: boolean;
}

// --- DATA CONSTANTS ---
export const LOCAL_STORAGE_SUBSCRIPTION_PLANS_KEY = 'mindnavigator_subscription_plans_v2'; // Version bump

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
    id: '1_kind_maand',
    name: '1 Kind - Maandelijks',
    shortName: '1 Kind',
    description: 'Volledige toegang tot alle tools en de dagelijkse coaching hub voor 1 kind, plus het ouder-dashboard.',
    price: 15.00,
    currency: 'EUR',
    billingInterval: 'month',
    maxChildren: 1,
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
    isPopular: true,
  },
  {
    id: '2_kinderen_maand',
    name: '2 Kinderen - Maandelijks',
    shortName: '2 Kinderen',
    description: 'Volledige toegang voor twee kinderen, inclusief alle tools, coaching en het ouder-dashboard.',
    price: 27.50,
    currency: 'EUR',
    billingInterval: 'month',
    maxChildren: 2,
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
    isPopular: false,
  },
  {
    id: 'gezin_maand',
    name: 'Gezin (3-4 Kinderen) - Maandelijks',
    shortName: 'Gezin',
    description: 'Het beste pakket voor grotere gezinnen. Volledige toegang voor maximaal 4 kinderen.',
    price: 37.50,
    currency: 'EUR',
    billingInterval: 'month',
    maxChildren: 4,
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
    isPopular: false,
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
