import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// These functions are now deprecated due to the new, simplified plan structure.
// They can be removed or updated if a more complex plan structure returns.
export const isTutorServiceCoveredByPlan = (planId?: string): boolean => {
  // In the new model, all paid plans cover tutor services.
  return !!planId;
};

export const isCoachServiceCoveredByPlan = (planId?: string): boolean => {
  // In the new model, all paid plans cover coach services.
  return !!planId;
};
