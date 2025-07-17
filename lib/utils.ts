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
