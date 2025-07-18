// src/types/subscription.ts
import { z } from "zod";

// --- CORE TYPES ---

export type TargetAudience = 'leerling' | 'ouder' | 'tutor' | 'coach' | 'platform' | 'beide';

export const appFeatureSchema = z.object({
    id: z.string(),
    label: z.string(),
    description: z.string().optional(),
    targetAudience: z.array(z.custom<TargetAudience>()),
    category: z.string().optional(),
    isRecommendedTool: z.boolean().optional(),
    adminOnly: z.boolean().optional(),
});
export type AppFeature = z.infer<typeof appFeatureSchema>;

export interface SubscriptionPlan {
  id: string;
  name: string;
  shortName?: string;
  description: string;
  tagline?: string;
  price: number;
  currency: 'EUR';
  yearlyDiscountPercent?: number;
  billingInterval: 'month' | 'year' | 'once';
  maxParents?: number; 
  maxChildren?: number;
  featureAccess?: Record<string, boolean>; 
  active: boolean;
  trialPeriodDays?: number;
  isPopular?: boolean;
}
