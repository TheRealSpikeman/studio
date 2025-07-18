// services/subscriptionService.ts
import { db, isFirebaseConfigured, adminDb } from '@/lib/firebase-admin';
import { collection, doc, getDoc, getDocs, setDoc, updateDoc, deleteDoc, Timestamp, orderBy, query, limit } from 'firebase/firestore';
import type { SubscriptionPlan } from '@/types/subscription';
import { initialDefaultPlans } from '@/lib/data/subscription-data';

const PLANS_COLLECTION = 'subscriptionPlans';
const LOCAL_STORAGE_KEY = 'adminDashboard_SubscriptionPlans_v3';

// This function can be used on the client-side as a fallback.
export function getSubscriptionPlans(): SubscriptionPlan[] {
  if (typeof window === 'undefined') {
    return initialDefaultPlans;
  }
  try {
    const item = localStorage.getItem(LOCAL_STORAGE_KEY);
    return item ? JSON.parse(item) : initialDefaultPlans;
  } catch (error) {
    console.error("Error reading from localStorage:", error);
    return initialDefaultPlans;
  }
}

// This function can be used on the client-side as a fallback.
export function saveSubscriptionPlans(plans: SubscriptionPlan[]): void {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(plans));
    } catch (error) {
      console.error("Error writing to localStorage:", error);
    }
  }
}

/**
 * Retrieves a single subscription plan by its ID from localStorage.
 * @param {string} id - The ID of the plan to retrieve.
 * @returns {SubscriptionPlan | null} The plan object or null if not found.
 */
export function getSubscriptionPlanById(id: string): SubscriptionPlan | null {
  const plans = getSubscriptionPlans();
  return plans.find(plan => plan.id === id) || null;
}

/**
 * Creates a new subscription plan in Firestore. Server-side only.
 * @param {Omit<SubscriptionPlan, 'id' | 'createdAt' | 'updatedAt'>} data - The new plan data.
 */
export async function createSubscriptionPlanOnServer(data: Omit<SubscriptionPlan, 'id' | 'createdAt' | 'updatedAt'>): Promise<SubscriptionPlan> {
  if (!isFirebaseConfigured) throw new Error("Firebase not configured");
  
  const plansRef = collection(db, PLANS_COLLECTION);
  // @ts-ignore
  const docRef = doc(plansRef, data.id);

  const planWithTimestamps = {
    ...data,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };
  
  // @ts-ignore
  delete planWithTimestamps.id;

  await setDoc(docRef, planWithTimestamps);
  
  return {
    ...data,
    // @ts-ignore
    id: data.id,
    createdAt: planWithTimestamps.createdAt.toDate().toISOString(),
    updatedAt: planWithTimestamps.updatedAt.toDate().toISOString(),
  };
};

/**
 * Updates an existing subscription plan in Firestore. Server-side only.
 * @param {string} id - The ID of the plan to update.
 * @param {Partial<SubscriptionPlan>} data - The fields to update.
 */
export async function updateSubscriptionPlanOnServer(id: string, data: Partial<Omit<SubscriptionPlan, 'id'>>): Promise<void> {
    if (!isFirebaseConfigured) throw new Error("Firebase not configured");
    const docRef = doc(db, PLANS_COLLECTION, id);
    await updateDoc(docRef, {
        ...data,
        updatedAt: Timestamp.now(),
    });
};

/**
 * Deletes a subscription plan from Firestore. Server-side only.
 * @param {string} id - The ID of the plan to delete.
 */
export async function deleteSubscriptionPlan(id: string): Promise<void> {
    if (!isFirebaseConfigured) {
        // Fallback to localStorage
        const plans = getSubscriptionPlans();
        const updatedPlans = plans.filter(p => p.id !== id);
        saveSubscriptionPlans(updatedPlans);
        return;
    }
    const docRef = doc(db, PLANS_COLLECTION, id);
    await deleteDoc(docRef);
};

// --- Formatting Helpers (Server-safe) ---
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
