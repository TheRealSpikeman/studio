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
  description: string;
  price: number;
  currency: 'EUR';
  billingInterval: 'month' | 'year' | 'once';
  featureAccess?: Record<string, boolean>; // Still useful for internal logic, even if all plans have all features now
  active: boolean;
  trialPeriodDays?: number;
  maxChildren?: number;
  isPopular?: boolean;
  tagline?: string;
}

// --- DATA CONSTANTS ---

export const ALL_FEATURES: AppFeature[] = [
    { id: 'full-access-tools', label: 'Volledige toegang tot alle zelfreflectie-instrumenten', targetAudience: ['leerling'] },
    { id: 'daily-coaching', label: 'Dagelijkse coaching en motivatie', targetAudience: ['leerling'] },
    { id: 'homework-tools', label: 'Huiswerk- en planningstools', targetAudience: ['leerling'] },
    { id: 'progress-reports', label: 'Persoonlijke voortgangsrapporten', targetAudience: ['leerling', 'ouder'] },
    { id: 'expert-network', label: 'Toegang tot expert netwerk voor coaching & begeleiding', targetAudience: ['ouder'] },
    { id: 'parent-dashboard', label: 'Ouder-dashboard met inzichten', targetAudience: ['ouder'] },
    { id: 'future-updates', label: 'Alle toekomstige updates en nieuwe features', targetAudience: ['platform'] },
];

const fullFeatureAccess = Object.fromEntries(ALL_FEATURES.map(f => [f.id, true]));

export const ALL_PLANS: SubscriptionPlan[] = [
  {
    id: 'gezin_basis',
    name: '1 Kind',
    description: 'De volledige MindNavigator ervaring voor één kind.',
    price: 15.00,
    currency: 'EUR',
    billingInterval: 'month',
    featureAccess: fullFeatureAccess,
    active: true,
    trialPeriodDays: 14,
    maxChildren: 1,
    isPopular: false,
  },
  {
    id: 'gezin_normaal',
    name: '2 Kinderen',
    description: 'Perfect voor gezinnen met twee kinderen die ondersteuning nodig hebben.',
    price: 27.50,
    currency: 'EUR',
    billingInterval: 'month',
    featureAccess: fullFeatureAccess,
    active: true,
    trialPeriodDays: 14,
    maxChildren: 2,
    isPopular: true,
  },
  {
    id: 'gezin_plus',
    name: '3-4 Kinderen',
    description: 'De beste waarde voor grotere gezinnen.',
    price: 37.50,
    currency: 'EUR',
    billingInterval: 'month',
    featureAccess: fullFeatureAccess,
    active: true,
    trialPeriodDays: 14,
    maxChildren: 4,
    isPopular: false,
  },
];


// --- HELPER FUNCTIONS ---
export const getSubscriptionPlans = (): SubscriptionPlan[] => {
    return ALL_PLANS.filter(p => p.active).sort((a,b) => a.price - b.price);
};

export const getAllFeatures = (): AppFeature[] => {
    return ALL_FEATURES;
};
