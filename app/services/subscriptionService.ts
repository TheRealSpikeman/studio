// src/services/subscriptionService.ts
import type { SubscriptionPlan, AppFeature } from '@/types/subscription';
import { initialDefaultPlans } from '@/lib/data/subscription-data';

// This is a server-safe service. No 'use client' needed.

// IMPORTANT: The localStorage logic has been removed. 
// The functions now operate on the static data or a future database.
// This allows them to be called from Server Components.

/**
 * Retrieves all subscription plans.
 * @returns {Promise<SubscriptionPlan[]>} The array of subscription plans.
 */
export const getSubscriptionPlans = async (): Promise<SubscriptionPlan[]> => {
    // In a real app, this would fetch from Firestore or another database.
    // For this prototype, we return the static data directly.
    return Promise.resolve(initialDefaultPlans);
};

/**
 * Retrieves a single subscription plan by its ID.
 * @param {string} id - The ID of the plan to retrieve.
 * @returns {Promise<SubscriptionPlan | null>} The plan object or null if not found.
 */
export const getSubscriptionPlanById = async (id: string): Promise<SubscriptionPlan | null> => {
    const allPlans = await getSubscriptionPlans();
    return allPlans.find(plan => plan.id === id) || null;
};

// The following functions are placeholders. In a real application, they would
// interact with a database (like Firestore) to persist changes.
// They are defined here to satisfy the imports in the components.

/**
 * Adds a new subscription plan to a persistent store. (Placeholder)
 * @param {SubscriptionPlan} data - The new plan data.
 */
export const createSubscriptionPlan = async (data: SubscriptionPlan): Promise<void> => {
    console.log("Simulating creation of new subscription plan:", data);
    // In a real app: await db.collection('subscriptions').doc(data.id).set(data);
    return Promise.resolve();
};

/**
 * Updates an existing subscription plan in a persistent store. (Placeholder)
 * @param {string} id - The ID of the plan to update.
 * @param {Partial<SubscriptionPlan>} data - The fields to update.
 */
export const saveSubscriptionPlan = async (id: string, data: Partial<SubscriptionPlan>): Promise<void> => {
    console.log(`Simulating update for subscription plan ${id}:`, data);
    // In a real app: await db.collection('subscriptions').doc(id).update(data);
    return Promise.resolve();
};

/**
 * Deletes a subscription plan from a persistent store. (Placeholder)
 * @param {string} id - The ID of the plan to delete.
 */
export const deleteSubscriptionPlan = async (id: string): Promise<void> => {
    console.log(`Simulating deletion of subscription plan: ${id}`);
    // In a real app: await db.collection('subscriptions').doc(id).delete();
    return Promise.resolve();
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
