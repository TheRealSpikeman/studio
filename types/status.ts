
import { z } from 'zod';

/**
 * Represents a generic status, combining a status identifier with a user-friendly description.
 * This can be used for various status indicators throughout the application.
 */
export interface Status {
  status: string;
  description: string;
}

/**
 * Defines specific error statuses with their descriptions, intended for error handling and display.
 * These provide consistent error messaging across the application.
 */
export const ErrorStatus = {
  ErrorNotAuthorized: 'User is not authorized to perform the requested action. Check your rules to ensure they are correct.',
  ErrorRetryLimitExceeded: 'The maximum time limit on an operation (upload, download, delete, etc.) has been exceeded. Try uploading again.',
};

// Enum types for standardized, readable fields, moved from schema.sql
export const USER_STATUS = z.enum(['actief', 'pending_approval', 'niet geverifieerd', 'gedeactiveerd', 'rejected']);
export type UserStatus = z.infer<typeof USER_STATUS>;

export const SUBSCRIPTION_STATUS = z.enum(['actief', 'opgezegd', 'gepauzeerd', 'proefperiode']);
export type SubscriptionStatus = z.infer<typeof SUBSCRIPTION_STATUS>;
