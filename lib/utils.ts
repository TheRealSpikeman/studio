import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// In the new simplified model, all paid plans cover all services.
// These functions check if a plan is a paid plan (i.e., has an ID).
export const isTutorServiceCoveredByPlan = (planId?: string): boolean => {
  return !!planId;
};

export const isCoachServiceCoveredByPlan = (planId?: string): boolean => {
  return !!planId;
};
