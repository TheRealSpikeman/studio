// services/featureService.ts
import type { AppFeature } from '@/types/subscription';
import { DEFAULT_APP_FEATURES } from '@/lib/data/subscription-data';

// This is a server-safe service.

const FEATURES_KEY = 'adminDashboard_AppFeatures_v1';

// --- Client-side helper ---
const getFeaturesFromStorage = (): AppFeature[] => {
  if (typeof window === 'undefined') {
    return DEFAULT_APP_FEATURES;
  }
  try {
    const item = localStorage.getItem(FEATURES_KEY);
    return item ? JSON.parse(item) : DEFAULT_APP_FEATURES;
  } catch (error) {
    console.error("Error reading features from localStorage:", error);
    return DEFAULT_APP_FEATURES;
  }
};

/**
 * Retrieves all application features. Server-safe.
 * @returns {Promise<AppFeature[]>} A promise that resolves to the array of features.
 */
export const getAllFeatures = async (): Promise<AppFeature[]> => {
    return Promise.resolve(getFeaturesFromStorage());
};

const saveFeaturesToStorage = (features: AppFeature[]): void => {
    if (typeof window !== 'undefined') {
        localStorage.setItem(FEATURES_KEY, JSON.stringify(features));
    }
};

/**
 * Saves a single feature, either creating a new one or updating an existing one. CLIENT-SIDE ONLY.
 * @param {AppFeature} featureData The feature data to save.
 * @param {string | null} originalId The original ID of the feature if it's being edited.
 */
export const saveFeature = async (featureData: AppFeature, originalId: string | null = null): Promise<void> => {
    const currentFeatures = await getAllFeatures();
    const isEditing = originalId !== null;

    let updatedFeaturesList;
    if (isEditing) {
        if (originalId !== featureData.id) {
            throw new Error("Het wijzigen van een feature ID is niet toegestaan.");
        }
        updatedFeaturesList = currentFeatures.map(f => f.id === originalId ? featureData : f);
    } else {
        if (currentFeatures.some(f => f.id === featureData.id)) {
            throw new Error(`Een feature met ID "${featureData.id}" bestaat al.`);
        }
        updatedFeaturesList = [featureData, ...currentFeatures];
    }
    
    saveFeaturesToStorage(updatedFeaturesList.sort((a,b) => a.label.localeCompare(b.label)));
};

/**
 * Deletes a feature. CLIENT-SIDE ONLY.
 * @param {string} featureId The ID of the feature to delete.
 */
export const deleteFeature = async (featureId: string): Promise<void> => {
    const currentFeatures = await getAllFeatures();
    const updatedFeatures = currentFeatures.filter(f => f.id !== featureId);
    saveFeaturesToStorage(updatedFeatures);
};
