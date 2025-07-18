import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { SubscriptionPlan } from '@/types/subscription';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const isTutorServiceCoveredByPlan = (plan?: SubscriptionPlan | null): boolean => {
  if (!plan) return false;
  return plan.featureAccess?.['expert-network-tutor'] ?? false;
};

export const isCoachServiceCoveredByPlan = (plan?: SubscriptionPlan | null): boolean => {
  if (!plan) return false;
  return plan.featureAccess?.['expert-network-coach'] ?? false;
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
