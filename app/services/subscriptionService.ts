// src/services/subscriptionService.ts
import type { SubscriptionPlan, AppFeature } from '@/types/subscription';
import { initialDefaultPlans } from '@/lib/data/subscription-data';

// --- Local Storage Key ---
const LOCAL_STORAGE_SUBSCRIPTION_PLANS_KEY = 'adminDashboard_SubscriptionPlans_v3';

// --- Helper Functions (Client-side Safe) ---

/**
 * Retrieves the subscription plans from localStorage, falling back to initial defaults.
 * @returns {SubscriptionPlan[]} The array of subscription plans.
 */
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
    return initialDefaultPlans; // Fallback to defaults on error
  }
};

/**
 * Saves an array of subscription plans to localStorage.
 * @param {SubscriptionPlan[]} plans - The array of plans to save.
 */
export const saveSubscriptionPlans = (plans: SubscriptionPlan[]): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(LOCAL_STORAGE_SUBSCRIPTION_PLANS_KEY, JSON.stringify(plans));
  } catch (error) {
    console.error("Error saving subscription plans to localStorage:", error);
  }
};

/**
 * Retrieves a single subscription plan by its ID.
 * @param {string} id - The ID of the plan to retrieve.
 * @returns {SubscriptionPlan | null} The plan object or null if not found.
 */
export const getSubscriptionPlanById = (id: string): SubscriptionPlan | null => {
    const allPlans = getSubscriptionPlans();
    return allPlans.find(plan => plan.id === id) || null;
};

/**
 * Adds a new subscription plan.
 * @param {SubscriptionPlan} data - The new plan data.
 */
export const createSubscriptionPlan = (data: SubscriptionPlan): void => {
    const currentPlans = getSubscriptionPlans();
    if (currentPlans.some(p => p.id === data.id)) {
      throw new Error("Een abonnement met dit ID bestaat al.");
    }
    const newPlans = [...currentPlans, data];
    saveSubscriptionPlans(newPlans);
};

/**
 * Updates an existing subscription plan.
 * @param {string} id - The ID of the plan to update.
 * @param {Partial<SubscriptionPlan>} data - The fields to update.
 */
export const saveSubscriptionPlan = (id: string, data: Partial<SubscriptionPlan>): void => {
    const currentPlans = getSubscriptionPlans();
    const updatedPlans = currentPlans.map(plan => plan.id === id ? { ...plan, ...data, id } : plan);
    saveSubscriptionPlans(updatedPlans);
};

/**
 * Deletes a subscription plan.
 * @param {string} id - The ID of the plan to delete.
 */
export const deleteSubscriptionPlan = (id: string): void => {
    const currentPlans = getSubscriptionPlans();
    const updatedPlans = currentPlans.filter(plan => plan.id !== id);
    saveSubscriptionPlans(updatedPlans);
};

/**
 * Resets the subscription plans in localStorage to the initial defaults.
 * @param {boolean} force - If true, overwrites existing plans.
 */
export const seedInitialPlans = (force: boolean = false): void => {
    if (typeof window === 'undefined') return;
    const existingPlans = localStorage.getItem(LOCAL_STORAGE_SUBSCRIPTION_PLANS_KEY);
    if (!existingPlans || force) {
        saveSubscriptionPlans(initialDefaultPlans);
    }
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
