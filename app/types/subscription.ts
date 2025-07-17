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
    price: 2.50,
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
    price: 10.00,
    currency: 'EUR',
    billingInterval: 'month',
    yearlyDiscountPercent: 15,
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
    // This is now a simple, synchronous function that returns the constant data.
    // This removes all Firestore-related complexity from the client-facing pages.
    return initialDefaultPlans;
};

export const getSubscriptionPlanById = async (id: string): Promise<SubscriptionPlan | null> => {
    // This can remain async for admin panel usage
    if (!isFirebaseConfigured || !db) return null;
    const docRef = doc(db, PLANS_COLLECTION, id);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docSnap.data() as SubscriptionPlan : null;
};

export const saveSubscriptionPlan = async (id: string, data: Partial<SubscriptionPlan>): Promise<void> => {
    if (!isFirebaseConfigured || !db) throw new Error("DB not configured");
    const docRef = doc(db, PLANS_COLLECTION, id);
    await updateDoc(docRef, data);
};

export const createSubscriptionPlan = async (data: SubscriptionPlan): Promise<void> => {
    if (!isFirebaseConfigured || !db) throw new Error("DB not configured");
    const docRef = doc(db, PLANS_COLLECTION, data.id);
    await setDoc(docRef, data);
};

export const deleteSubscriptionPlan = async (id: string): Promise<void> => {
    if (!isFirebaseConfigured || !db) throw new Error("DB not configured");
    await deleteDoc(doc(db, PLANS_COLLECTION, id));
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
