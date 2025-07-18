// src/services/subscriptionService.ts
import type { SubscriptionPlan } from '@/types/subscription';
import { initialDefaultPlans } from '@/lib/data/subscription-data';

// This is now a server-safe service layer.

const LOCAL_STORAGE_KEY = 'adminDashboard_SubscriptionPlans_v3';

// --- Client-side helper ---
const getPlansFromStorage = (): SubscriptionPlan[] => {
  if (typeof window === 'undefined') {
    // On the server, always return the defaults from the code.
    return initialDefaultPlans;
  }
  try {
    const storedPlansRaw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (storedPlansRaw) {
      return JSON.parse(storedPlansRaw);
    }
  } catch (error) {
    console.error("Error reading from localStorage, falling back to defaults:", error);
  }
  // If nothing in storage or on server, return defaults.
  return initialDefaultPlans;
};

// --- Public API ---

/**
 * Retrieves all subscription plans. Server-safe.
 * @returns {Promise<SubscriptionPlan[]>} The array of subscription plans.
 */
export const getSubscriptionPlans = async (): Promise<SubscriptionPlan[]> => {
  // This simulates an async fetch, but uses the deterministic client-safe helper.
  return Promise.resolve(getPlansFromStorage());
};

/**
 * Retrieves a single subscription plan by its ID. Server-safe.
 * @param {string} id - The ID of the plan to retrieve.
 * @returns {Promise<SubscriptionPlan | null>} The plan object or null if not found.
 */
export const getSubscriptionPlanById = async (id: string): Promise<SubscriptionPlan | null> => {
  const allPlans = await getSubscriptionPlans();
  return allPlans.find(plan => plan.id === id) || null;
};

/**
 * Saves all subscription plans. CLIENT-SIDE ONLY.
 * @param {SubscriptionPlan[]} plans - The array of plans to save.
 */
const savePlansToStorage = (plans: SubscriptionPlan[]): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(plans));
  }
};

/**
 * Adds a new subscription plan. CLIENT-SIDE ONLY.
 * @param {SubscriptionPlan} data - The new plan data.
 */
export const createSubscriptionPlan = (data: SubscriptionPlan): void => {
    const currentPlans = getPlansFromStorage();
    if (currentPlans.some(p => p.id === data.id)) {
      throw new Error("Een abonnement met dit ID bestaat al.");
    }
    const newPlans = [...currentPlans, data];
    savePlansToStorage(newPlans);
};

/**
 * Updates an existing subscription plan. CLIENT-SIDE ONLY.
 * @param {string} id - The ID of the plan to update.
 * @param {Partial<SubscriptionPlan>} data - The fields to update.
 */
export const saveSubscriptionPlan = (id: string, data: Partial<SubscriptionPlan>): void => {
    const currentPlans = getPlansFromStorage();
    const updatedPlans = currentPlans.map(plan => plan.id === id ? { ...plan, ...data, id } : plan);
    savePlansToStorage(updatedPlans);
};

/**
 * Deletes a subscription plan. CLIENT-SIDE ONLY.
 * @param {string} id - The ID of the plan to delete.
 */
export const deleteSubscriptionPlan = (id: string): void => {
    const currentPlans = getPlansFromStorage();
    const updatedPlans = currentPlans.filter(plan => plan.id !== id);
    savePlansToStorage(updatedPlans);
};

// --- Formatting Helpers ---

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
