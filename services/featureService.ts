// services/featureService.ts
"use client";

import type { AppFeature } from '@/types/subscription';
import { DEFAULT_APP_FEATURES } from '@/lib/data/subscription-data';

const FEATURES_KEY = 'adminDashboard_AppFeatures_v1';

const getItem = <T>(key: string, defaultValue: T): T => {
  if (typeof window === 'undefined') {
    return defaultValue;
  }
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error reading from localStorage key “${key}”:`, error);
    return defaultValue;
  }
};

const setItem = <T>(key: string, value: T): void => {
  if (typeof window === 'undefined') {
    return;
  }
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error writing to localStorage key “${key}”:`, error);
  }
};

/**
 * Retrieves all application features from local storage, falling back to defaults.
 * @returns {Promise<AppFeature[]>} A promise that resolves to the array of features.
 */
export const getAllFeatures = async (): Promise<AppFeature[]> => {
    return Promise.resolve(getItem(FEATURES_KEY, DEFAULT_APP_FEATURES));
};

/**
 * Saves a single feature, either creating a new one or updating an existing one.
 * @param {AppFeature} featureData The feature data to save.
 * @param {string | null} originalId The original ID of the feature if it's being edited (to find it in the array).
 */
export const saveFeature = async (featureData: AppFeature, originalId: string | null = null): Promise<void> => {
    const currentFeatures = await getAllFeatures();
    const isEditing = originalId !== null;

    let updatedFeaturesList;

    if (isEditing) {
        if(originalId !== featureData.id) { // ID has been changed, which is not allowed.
            throw new Error("Het wijzigen van een feature ID is niet toegestaan.");
        }
        updatedFeaturesList = currentFeatures.map(f => f.id === originalId ? featureData : f);
    } else {
        if (currentFeatures.some(f => f.id === featureData.id)) {
            throw new Error(`Een feature met ID "${featureData.id}" bestaat al.`);
        }
        updatedFeaturesList = [featureData, ...currentFeatures];
    }
    
    setItem(FEATURES_KEY, updatedFeaturesList.sort((a,b) => a.label.localeCompare(b.label)));
    return Promise.resolve();
};

/**
 * Deletes a feature from local storage.
 * @param {string} featureId The ID of the feature to delete.
 */
export const deleteFeature = async (featureId: string): Promise<void> => {
    const currentFeatures = await getAllFeatures();
    const updatedFeatures = currentFeatures.filter(f => f.id !== featureId);
    setItem(FEATURES_KEY, updatedFeatures);
    return Promise.resolve();
};
