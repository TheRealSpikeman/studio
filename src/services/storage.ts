// src/services/storage.ts
import { COACHING_CONFIG } from '@/lib/constants/coaching';

// Check if window is defined to avoid errors during server-side rendering
const isBrowser = typeof window !== 'undefined';

export const StorageService = {
  getOnboardingAnalysis: (): string | null => {
    if (!isBrowser) return null;
    return localStorage.getItem('mindnavigator_onboardingAnalysis');
  },

  getUserName: (): string => {
    if (!isBrowser) return "een MindNavigator gebruiker";
    const storedUserData = localStorage.getItem('mindnavigator_onboardingUser');
    if (storedUserData) {
      try {
        return JSON.parse(storedUserData).name || "een MindNavigator gebruiker";
      } catch {
        return "een MindNavigator gebruiker";
      }
    }
    return "een MindNavigator gebruiker";
  },

  getFirstCoachingViewed: (): string | null => {
    if (!isBrowser) return null;
    return localStorage.getItem(COACHING_CONFIG.JOURNEY_STEPS.FIRST_COACHING_VIEWED);
  },
  
  setFirstCoachingViewed: (): void => {
    if (!isBrowser) return;
    localStorage.setItem(COACHING_CONFIG.JOURNEY_STEPS.FIRST_COACHING_VIEWED, 'true');
  },
  
  getJournalEntry: (dateKey: string): string | null => {
    if (!isBrowser) return null;
    return localStorage.getItem(`journalEntry_${dateKey}`);
  },

  setJournalEntry: (dateKey: string, content: string): void => {
    if (!isBrowser) return;
    localStorage.setItem(`journalEntry_${dateKey}`, content);
  },
};
