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
  maxParents?: number; // Nieuw veld
  maxChildren?: number;
  featureAccess?: Record<string, boolean>; 
  active: boolean;
  trialPeriodDays?: number;
  isPopular?: boolean;
}


// --- DATA CONSTANTS (for seeding) ---
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
    id: '1_kind_maand',
    name: '1 Kind',
    description: 'Volledige toegang voor één kind.',
    price: 15.00,
    currency: 'EUR',
    billingInterval: 'month',
    yearlyDiscountPercent: 10,
    maxChildren: 1,
    active: true,
  },
  {
    id: '2_kinderen_maand',
    name: '2 Kinderen',
    description: 'Volledige toegang voor twee kinderen.',
    price: 27.50,
    currency: 'EUR',
    billingInterval: 'month',
    yearlyDiscountPercent: 10,
    maxChildren: 2,
    active: true,
    isPopular: true,
  },
   {
    id: '3_4_kinderen_maand',
    name: '3-4 Kinderen',
    description: 'Volledige toegang voor 3 tot 4 kinderen.',
    price: 37.50,
    currency: 'EUR',
    billingInterval: 'month',
    yearlyDiscountPercent: 10,
    maxChildren: 4,
    active: true,
  },
  {
    id: 'ouder_dashboard_addon',
    name: 'Ouder Dashboard',
    description: 'Inzicht in voortgang en coach sessies',
    price: 7.50,
    currency: 'EUR',
    billingInterval: 'month',
    active: true,
  },
];


// --- ASYNC HELPER FUNCTIONS FOR FIRESTORE ---

export async function seedInitialPlans(force: boolean = false): Promise<void> {
    if (!isFirebaseConfigured || !db) return;
    const plansRef = collection(db, PLANS_COLLECTION);
    if (force) {
        const snapshot = await getDocs(plansRef);
        if (!snapshot.empty) {
            const batch = writeBatch(db);
            snapshot.docs.forEach(doc => batch.delete(doc.ref));
            await batch.commit();
            console.log("Forced re-seed: Existing plans deleted.");
        }
    }
    const snapshot = await getDocs(plansRef);
    if (snapshot.empty || force) {
        console.log("Seeding subscription plans...");
        const batch = writeBatch(db);
        initialDefaultPlans.forEach(plan => {
            const docRef = doc(db, PLANS_COLLECTION, plan.id);
            batch.set(docRef, plan);
        });
        await batch.commit();
    }
}

export async function seedInitialFeatures(): Promise<void> {
    if (!isFirebaseConfigured || !db) return;
    const featuresRef = collection(db, FEATURES_COLLECTION);
    const snapshot = await getDocs(featuresRef);
    if (snapshot.empty) {
        console.log("Seeding features...");
        const batch = writeBatch(db);
        DEFAULT_APP_FEATURES.forEach(feature => {
            const docRef = doc(db, FEATURES_COLLECTION, feature.id);
            batch.set(docRef, feature);
        });
        await batch.commit();
    }
}

export const getSubscriptionPlans = async (): Promise<SubscriptionPlan[]> => {
    if (!isFirebaseConfigured || !db) {
        console.warn("Firebase not configured. Returning local mock data for subscription plans.");
        return initialDefaultPlans;
    }
    await seedInitialPlans(); // Ensure data exists
    const snapshot = await getDocs(collection(db, PLANS_COLLECTION));
    if (snapshot.empty) return initialDefaultPlans; // Fallback
    return snapshot.docs.map(doc => doc.data() as SubscriptionPlan);
};

export const getSubscriptionPlanById = async (id: string): Promise<SubscriptionPlan | null> => {
    if (!isFirebaseConfigured || !db) {
        return initialDefaultPlans.find(p => p.id === id) || null;
    }
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

export const getAllFeatures = async (): Promise<AppFeature[]> => {
    if (!isFirebaseConfigured || !db) return [];
    await seedInitialFeatures();
    const snapshot = await getDocs(collection(db, FEATURES_COLLECTION));
    return snapshot.docs.map(doc => doc.data() as AppFeature);
};

export const saveAllFeatures = async (features: AppFeature[]): Promise<void> => {
    if (!isFirebaseConfigured || !db) throw new Error("DB not configured");
    const batch = writeBatch(db);
    features.forEach(feature => {
        const docRef = doc(db, FEATURES_COLLECTION, feature.id);
        batch.set(docRef, feature);
    });
    await batch.commit();
};

export const saveFeature = async (feature: AppFeature, oldId?: string): Promise<void> => {
    if (!isFirebaseConfigured || !db) throw new Error("DB not configured");
    if (oldId && oldId !== feature.id) {
       throw new Error("Changing Feature ID is not supported yet.");
    }
    const docRef = doc(db, FEATURES_COLLECTION, feature.id);
    await setDoc(docRef, feature, { merge: true });
};

export const deleteFeature = async (id: string): Promise<void> => {
    if (!isFirebaseConfigured || !db) throw new Error("DB not configured");
    await deleteDoc(doc(db, FEATURES_COLLECTION, id));
};

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
