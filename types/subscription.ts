// src/types/subscription.ts
import { z } from "zod";

// DEPRECATED, but kept for reference if needed by other components.
// The new model uses PlatformTool.
export type TargetAudience = 'leerling' | 'ouder' | 'tutor' | 'coach' | 'platform' | 'beide';

// The new, separate Tool type, replacing AppFeature for this purpose
export interface PlatformTool {
    id: string;
    label: string;
    description: string;
    targetAudience: TargetAudience[];
    category: string;
    // Potentially other fields like 'iconName', 'link', etc.
}

// The new, simplified SubscriptionPlan
export interface SubscriptionPlan {
  id: string;
  name: string;
  shortName?: string; // e.g., "1 Kind", "Gezin"
  description: string;
  tagline?: string; // e.g. "Beste voor startende gezinnen"
  price: number;
  currency: 'EUR';
  yearlyDiscountPercent?: number;
  billingInterval: 'month' | 'year' | 'once';
  maxParents?: number; 
  maxChildren?: number;
  // REMOVED: featureAccess is no longer part of the plan itself
  active: boolean;
  trialPeriodDays?: number;
  isPopular?: boolean;
}
