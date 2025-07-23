// types/subscription.ts

export const initialDefaultPlans = [];
export const DEFAULT_APP_FEATURES = {};
export function getSubscriptionPlans() { return initialDefaultPlans; }
export function formatPrice(price: number): string { 
  return new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' }).format(price); 
}
export { formatPrice as formatPlanPrice };
export type SubscriptionPlan = {
    id: string;
    name: string;
    price: number;
    features: string[];
  maxChildren?: number;
  yearlyDiscountPercent?: number;
  isPopular?: boolean;
  tagline?: string;
  description?: string;
  maxParents?: number;
  trialPeriodDays?: number;
};
export const LOCAL_STORAGE_SUBSCRIPTION_PLANS_KEY = 'mindnavigator_subscription_plans_v3';

export interface PlatformTool {
  id: string;
  name: string;
  description: string;
  label?: string;
  category?: string;
  icon?: string;
}
