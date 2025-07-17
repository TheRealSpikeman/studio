// src/types/subscription.ts
import { z } from "zod";
import { db, isFirebaseConfigured } from '@/lib/firebase';
import { collection, getDocs, getDoc, doc, addDoc, updateDoc, deleteDoc, writeBatch, setDoc } from 'firebase/firestore';

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


// --- DATA CONSTANTS (for seeding and direct use) ---
export const LOCAL_STORAGE_SUBSCRIPTION_PLANS_KEY = 'adminDashboard_SubscriptionPlans_v3';

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
    name: 'Coaching & Tools - Maandelijks',
    shortName: 'Coaching & Tools',
    description: 'Essentiële tools en dagelijkse coaching voor één kind, inclusief ouder-dashboard.',
    price: 15.00,
    currency: 'EUR',
    billingInterval: 'month',
    yearlyDiscountPercent: 15,
    maxParents: 2,
    maxChildren: 1,
    active: true,
    trialPeriodDays: 14,
    isPopular: true,
    featureAccess: { 'full-access-tools': true, 'daily-coaching': true, 'homework-tools': true, 'progress-reports': true, 'parent-dashboard': true, 'expert-network-tutor': true, 'expert-network-coach': true, 'future-updates': true, },
  },
  {
    id: 'family_guide_monthly',
    name: 'Gezins Gids - Maandelijks',
    shortName: 'Gezins Gids',
    description: 'Alle tools en coaching voor het hele gezin, met ondersteuning voor maximaal 2 kinderen.',
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


// --- ASYNC HELPER FUNCTIONS FOR FIRESTORE (for backend/admin use) ---

export const getSubscriptionPlans = (): SubscriptionPlan[] => {
  if (typeof window === 'undefined') {
    return initialDefaultPlans; // Fallback for server-side rendering
  }
  try {
    const storedPlansRaw = localStorage.getItem(LOCAL_STORAGE_SUBSCRIPTION_PLANS_KEY);
    if (storedPlansRaw) {
      return JSON.parse(storedPlansRaw);
    } else {
      localStorage.setItem(LOCAL_STORAGE_SUBSCRIPTION_PLANS_KEY, JSON.stringify(initialDefaultPlans));
      return initialDefaultPlans;
    }
  } catch (error) {
    console.error("Error reading subscription plans from localStorage:", error);
    return initialDefaultPlans; // Fallback to defaults
  }
};

export const saveSubscriptionPlans = (plans: SubscriptionPlan[]): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(LOCAL_STORAGE_SUBSCRIPTION_PLANS_KEY, JSON.stringify(plans));
  } catch (error) {
    console.error("Error saving subscription plans to localStorage:", error);
  }
};

export const getSubscriptionPlanById = (id: string): SubscriptionPlan | null => {
    const allPlans = getSubscriptionPlans();
    return allPlans.find(plan => plan.id === id) || null;
};

export const createSubscriptionPlan = (data: SubscriptionPlan): void => {
    const currentPlans = getSubscriptionPlans();
    if (currentPlans.some(p => p.id === data.id)) {
      throw new Error("Een abonnement met dit ID bestaat al.");
    }
    const newPlans = [...currentPlans, data];
    saveSubscriptionPlans(newPlans);
};

export const saveSubscriptionPlan = (id: string, data: Partial<SubscriptionPlan>): void => {
    const currentPlans = getSubscriptionPlans();
    const updatedPlans = currentPlans.map(plan => plan.id === id ? { ...plan, ...data, id } : plan);
    saveSubscriptionPlans(updatedPlans);
};

export const deleteSubscriptionPlan = (id: string): void => {
    const currentPlans = getSubscriptionPlans();
    const updatedPlans = currentPlans.filter(plan => plan.id !== id);
    saveSubscriptionPlans(updatedPlans);
};

export const getAllFeatures = (): AppFeature[] => {
    // For now, features are static. Could be moved to localStorage like plans if needed.
    return DEFAULT_APP_FEATURES;
};


// Simplified formatters
export const formatPrice = (price: number, currency: string, interval: 'month' | 'year' | 'once') => {
    if (price === 0 && interval === 'once') return 'Gratis';
    const intervalText = interval === 'month' ? '/mnd' : interval === 'year' ? '/jaar' : '';
    return `${currency === 'EUR' ? '€' : currency}${price.toFixed(2).replace('.', ',')}${intervalText}`;
};

export const formatFullPrice = (plan: SubscriptionPlan) => {
    // New logic to handle yearly discount correctly
    if (plan.billingInterval === 'year' && plan.yearlyDiscountPercent) {
        const yearlyPrice = plan.price * 12;
        const discountedYearly = yearlyPrice * (1 - plan.yearlyDiscountPercent / 100);
        return `${formatPrice(discountedYearly, plan.currency, 'year')} (${plan.yearlyDiscountPercent}% korting)`;
    }
    return formatPrice(plan.price, plan.currency, plan.billingInterval);
};
