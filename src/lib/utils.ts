import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// In the new simplified model, all paid plans cover all services.
// These functions check if a plan is a paid plan (i.e., has a price > 0).
export const isTutorServiceCoveredByPlan = (planId?: string): boolean => {
  // A planId existing implies it's a selected, likely paid plan.
  // This could be refined if there are free plans with IDs.
  return !!planId;
};

export const isCoachServiceCoveredByPlan = (planId?: string): boolean => {
  return !!planId;
};
