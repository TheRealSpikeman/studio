// services/subscriptionService.ts
import type { SubscriptionPlan } from '@/types/subscription';
import { initialDefaultPlans } from '@/lib/data/subscription-data';

export const LOCAL_STORAGE_SUBSCRIPTION_PLANS_KEY = 'adminDashboard_SubscriptionPlans_v3';

// --- Client-side helper ---
const getPlansFromStorage = (): SubscriptionPlan[] => {
  if (typeof window === 'undefined') {
    // On the server, always return the defaults from the code.
    return initialDefaultPlans;
  }
  try {
    const storedPlansRaw = localStorage.getItem(LOCAL_STORAGE_SUBSCRIPTION_PLANS_KEY);
    if (storedPlansRaw) {
      return JSON.parse(storedPlansRaw);
    } else {
      // Initialize localStorage if it's the first time on the client
      localStorage.setItem(LOCAL_STORAGE_SUBSCRIPTION_PLANS_KEY, JSON.stringify(initialDefaultPlans));
      return initialDefaultPlans;
    }
  } catch (error) {
    console.error("Error reading subscription plans from localStorage:", error);
    return initialDefaultPlans; // Fallback to defaults on error
  }
};

/**
 * Retrieves all subscription plans. This function is now server-safe.
 * It will read from localStorage on the client, and from the initial data on the server.
 * @returns {SubscriptionPlan[]} The array of subscription plans.
 */
export const getSubscriptionPlans = (): SubscriptionPlan[] => {
  return getPlansFromStorage();
};

/**
 * Retrieves a single subscription plan by its ID. Server-safe.
 * @param {string} id - The ID of the plan to retrieve.
 * @returns {SubscriptionPlan | null} The plan object or null if not found.
 */
export const getSubscriptionPlanById = (id: string): SubscriptionPlan | null => {
  const allPlans = getPlansFromStorage();
  return allPlans.find(plan => plan.id === id) || null;
};

// --- Client-side only functions ---

const savePlansToStorage = (plans: SubscriptionPlan[]): void => {
  if (typeof window === 'undefined') {
      console.warn("Attempted to save subscription plans on the server. This is a client-side only operation.");
      return;
  }
  localStorage.setItem(LOCAL_STORAGE_SUBSCRIPTION_PLANS_KEY, JSON.stringify(plans));
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

/**
 * Resets the subscription plans in localStorage to the initial defaults. CLIENT-SIDE ONLY.
 * @param {boolean} force - If true, overwrites existing plans.
 */
export const seedInitialPlans = (force: boolean = false): void => {
    if (typeof window === 'undefined') return;
    const existingPlans = localStorage.getItem(LOCAL_STORAGE_SUBSCRIPTION_PLANS_KEY);
    if (!existingPlans || force) {
        savePlansToStorage(initialDefaultPlans);
    }
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
