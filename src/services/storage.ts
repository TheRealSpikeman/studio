// src/services/storage.ts
import { COACHING_CONFIG } from '@/lib/constants/coaching';
import type { QuizResult } from '@/types/dashboard';

// Check if window is defined to avoid errors during server-side rendering
const isBrowser = typeof window !== 'undefined';

const ONBOARDING_ANALYSIS_KEY = 'mindnavigator_onboardingAnalysis';
const ONBOARDING_USER_KEY = 'mindnavigator_onboardingUser';
const COMPLETED_QUIZZES_KEY = 'mindnavigator_completedQuizzes_v1';

export const StorageService = {
  getOnboardingAnalysis: (): string | null => {
    if (!isBrowser) return null;
    return localStorage.getItem(ONBOARDING_ANALYSIS_KEY);
  },

  getUserName: (): string => {
    if (!isBrowser) return "een MindNavigator gebruiker";
    const storedUserData = localStorage.getItem(ONBOARDING_USER_KEY);
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

  getCompletedQuizzes: (): QuizResult[] => {
    if (!isBrowser) return [];
    try {
      const stored = localStorage.getItem(COMPLETED_QUIZZES_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error("Error getting completed quizzes:", error);
      return [];
    }
  },

  addCompletedQuiz: (newResult: QuizResult): void => {
    if (!isBrowser) return;
    try {
      const existingQuizzes = StorageService.getCompletedQuizzes();
      // Add the new result to the beginning of the list
      const updatedQuizzes = [newResult, ...existingQuizzes];
      localStorage.setItem(COMPLETED_QUIZZES_KEY, JSON.stringify(updatedQuizzes));
    } catch (error) {
      console.error("Error adding completed quiz:", error);
    }
  },
};
