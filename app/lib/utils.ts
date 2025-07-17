import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Add these new functions
export const isTutorServiceCoveredByPlan = (planId?: string): boolean => {
  if (!planId) return false;
  return planId.includes('family_guide') || planId.includes('premium_family');
};

export const isCoachServiceCoveredByPlan = (planId?: string): boolean => {
  if (!planId) return false;
  return planId.includes('family_guide') || planId.includes('premium_family') || planId.includes('coaching_tools');
};
