// services/featureService.ts
import type { AppFeature } from '@/app/types/subscription';
import { DEFAULT_APP_FEATURES } from '@/lib/data/subscription-data';

// This is a server-safe service. No 'use client' needed.

// IMPORTANT: The localStorage logic has been removed. 
// Management of features will be done via a database or a config file in a real app.
// For this prototype, we will treat DEFAULT_APP_FEATURES as the source of truth.

/**
 * Retrieves all application features directly from the source data.
 * This is a synchronous function that can be used on both server and client.
 * @returns {Promise<AppFeature[]>} A promise that resolves to the array of features.
 */
export const getAllFeatures = async (): Promise<AppFeature[]> => {
    // In a real app, this would fetch from a database.
    // For now, it returns the static data, which is server-safe.
    return Promise.resolve(DEFAULT_APP_FEATURES);
};

// Functions to save/delete features would need to be implemented
// to write to a persistent data store (e.g., Firestore or a JSON file)
// if dynamic feature management is required. For the current scope,
// we rely on the static data.
