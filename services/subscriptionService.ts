// services/subscriptionService.ts
'use client'; // This service now uses localStorage and is client-side.

import type { SubscriptionPlan } from '@/types/subscription';
import { initialDefaultPlans } from '@/lib/data/subscription-data';

const LOCAL_STORAGE_KEY = 'mindnavigator_subscription_plans_v3';

// --- Helper Functions for localStorage ---

const getPlansFromStorage = (): SubscriptionPlan[] => {
  if (typeof window === 'undefined') {
    return initialDefaultPlans; // Return initial data during SSR
  }
  try {
    const item = localStorage.getItem(LOCAL_STORAGE_KEY);
    // If nothing is in storage, initialize it with default plans.
    if (!item || item === 'undefined') {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(initialDefaultPlans));
      return initialDefaultPlans;
    }
    return JSON.parse(item);
  } catch (error) {
    console.error("Error reading subscription plans from localStorage:", error);
    return initialDefaultPlans; // Fallback to default
  }
};

const savePlansToStorage = (plans: SubscriptionPlan[]): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(plans));
  } catch (error) {
    console.error("Error writing subscription plans to localStorage:", error);
  }
};


// --- Public API (mimics async behavior of a real API) ---

/**
 * Retrieves all subscription plans from localStorage.
 * @returns {Promise<SubscriptionPlan[]>} The array of subscription plans.
 */
export async function getSubscriptionPlans(): Promise<SubscriptionPlan[]> {
  await new Promise(resolve => setTimeout(resolve, 50)); // Simulate network delay
  return getPlansFromStorage().sort((a,b) => a.price - b.price);
};

/**
 * Retrieves a single subscription plan by its ID from localStorage.
 * @param {string} id - The ID of the plan to retrieve.
 * @returns {Promise<SubscriptionPlan | null>} The plan object or null if not found.
 */
export async function getSubscriptionPlanById(id: string): Promise<SubscriptionPlan | null> {
  await new Promise(resolve => setTimeout(resolve, 50));
  const plans = getPlansFromStorage();
  return plans.find(plan => plan.id === id) || null;
};

/**
 * Creates a new subscription plan in localStorage.
 * @param {Omit<SubscriptionPlan, 'createdAt' | 'updatedAt'>} data - The new plan data.
 */
export async function createSubscriptionPlan(data: Omit<SubscriptionPlan, 'createdAt' | 'updatedAt'>): Promise<SubscriptionPlan> {
  await new Promise(resolve => setTimeout(resolve, 50));
  const currentPlans = getPlansFromStorage();
  if (currentPlans.some(p => p.id === data.id)) {
      throw new Error(`Een abonnement met ID "${data.id}" bestaat al.`);
  }

  const newPlan: SubscriptionPlan = {
      ...data,
      // No longer adding createdAt/updatedAt as they are not in the simplified type
  };

  const updatedPlans = [...currentPlans, newPlan];
  savePlansToStorage(updatedPlans);
  return newPlan;
};

/**
 * Updates an existing subscription plan in localStorage.
 * @param {string} id - The ID of the plan to update.
 * @param {Partial<SubscriptionPlan>} data - The fields to update.
 */
export async function updateSubscriptionPlan(id: string, data: Partial<Omit<SubscriptionPlan, 'id'>>): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 50));
    const currentPlans = getPlansFromStorage();
    const updatedPlans = currentPlans.map(plan => 
        plan.id === id ? { ...plan, ...data } : plan
    );
    savePlansToStorage(updatedPlans);
};

/**
 * Deletes a subscription plan from localStorage.
 * @param {string} id - The ID of the plan to delete.
 */
export async function deleteSubscriptionPlan(id: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 50));
    const currentPlans = getPlansFromStorage();
    const updatedPlans = currentPlans.filter(plan => plan.id !== id);
    savePlansToStorage(updatedPlans);
};
