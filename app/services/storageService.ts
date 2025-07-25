// src/services/storageService.ts
import {
  collection,
  getDocs,
  getDoc,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  where,
  limit,
  setDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from '@/lib/firebase';

import type { User, FeedbackEntry, Conversation, OuderSubscription, PayableLesson, ChildBase, ProfessionalBase, ChildProfile, ChildProgressData, Lesson, CoachingSession, StudentEntry, StudentDetails, ScheduledLesson, SubscriptionPlan, AppFeature, QuizAdmin, QuizResult, DocumentationPage } from '@/types';
import { initialDefaultPlans, DEFAULT_APP_FEATURES } from '@/types/subscription';
import { getQuizzes } from './quizService';
import { MOCK_DOCUMENTATION_PAGES } from '@/lib/data/documentation-data';

/**
 * StorageService
 * 
 * This service acts as a centralized data layer for the application.
 * It uses Firestore for core data and simulates localStorage for some legacy/dummy data.
 */

// --- Generic localStorage Helpers ---
const getItem = <T>(key: string, defaultValue: T): T => {
  if (typeof window === 'undefined') {
    return defaultValue;
  }
  try {
    const item = window.localStorage.getItem(key);
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
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error writing to localStorage key “${key}”:`, error);
  }
};

// --- Generic sessionStorage Helpers ---
const getSessionItem = <T>(key: string, defaultValue: T): T => {
  if (typeof window === 'undefined') {
    return defaultValue;
  }
  try {
    const item = window.sessionStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error reading from sessionStorage key “${key}”:`, error);
    return defaultValue;
  }
};

const setSessionItem = <T>(key: string, value: T): void => {
  if (typeof window === 'undefined') {
    return;
  }
  try {
    window.sessionStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error writing to sessionStorage key “${key}”:`, error);
  }
};


// --- KEYS ---
const USERS_COLLECTION = 'users';
const SUBSCRIPTION_PLANS_KEY = 'adminDashboard_SubscriptionPlans_v3';
const FEATURES_KEY = 'adminDashboard_AppFeatures_v1';
const TOOLS_KEY = 'mindnavigator_tools_v1';
const TEMP_QUIZ_RESULT_KEY = 'mindnavigator_temp_quiz_result';
const ONBOARDING_ANALYSIS_KEY = 'mindnavigator_onboardingAnalysis';
const FIRST_COACHING_VIEWED_KEY = 'journey_first_coaching_viewed_v1';
const JOURNEY_QUIZ_COMPLETED_KEY = 'journey_quiz_completed_v1';
const QUIZZES_COLLECTION = 'quizzes';
const QUIZ_RESULTS_COLLECTION = 'quizResults';
const DOC_PAGES_KEY = 'mindnavigator_documentation_pages';


// --- SERVICE API ---
const getCompletedQuizzesForUser = async (userId: string): Promise<QuizResult[]> => {
    if (!isFirebaseConfigured || !db) return [];
    if (!userId) return []; // No user, no quizzes
    try {
        const resultsCollectionRef = collection(db, QUIZ_RESULTS_COLLECTION);
        const q = query(
          resultsCollectionRef,
          where("userId", "==", userId),
          orderBy('dateCompleted', 'desc')
        );
        const querySnapshot = await getDocs(q);
        
        if (querySnapshot.empty) {
          return [];
        }

        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        } as QuizResult));
    } catch (error) {
        console.error(`Error fetching quizzes for user ${userId}:`, error);
        return [];
    }
};

// All dummy data that was here has been removed to reduce bundle size.
// The app will now rely on component-local dummy data or seeded Firestore data.

export const storageService = {
  // --- User Management (Firestore) ---
  getUsers: async (): Promise<User[]> => {
    // This function remains to interact with Firestore, but no longer contains dummy data.
    if (!isFirebaseConfigured || !db) return [];
    try {
        const usersCollectionRef = collection(db, USERS_COLLECTION);
        const q = query(usersCollectionRef, orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        
        return querySnapshot.docs.map(doc => {
            const data = doc.data();
            const processedData = {
                ...data,
                id: doc.id,
                createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : data.createdAt,
                lastLogin: data.lastLogin?.toDate ? data.lastLogin.toDate().toISOString() : data.lastLogin,
            };
            return processedData as User;
        });
    } catch (error) {
        console.error("Error fetching users from Firestore:", error);
        return [];
    }
  },
  
  updateUser: async (updatedUser: User): Promise<void> => {
    if (!isFirebaseConfigured || !db) throw new Error("Firebase not configured.");
    const { id, ...userData } = updatedUser;
    if (!id) throw new Error("User ID is required for updating.");
    const docRef = doc(db, USERS_COLLECTION, id);
    await updateDoc(docRef, userData);
  },

  addUser: async (newUser: User): Promise<string> => {
    if (!isFirebaseConfigured || !db) throw new Error("Firebase not configured.");
    const { id, ...userData } = newUser;
    if (!id) throw new Error("Cannot add user without an ID.");
    const docRef = doc(db, USERS_COLLECTION, id);
    await setDoc(docRef, userData);
    return id;
  },

  deleteUser: async (userId: string): Promise<void> => {
    if (!isFirebaseConfigured || !db) throw new Error("Firebase not configured.");
    const docRef = doc(db, USERS_COLLECTION, userId);
    await deleteDoc(docRef);
  },
  // --- END User Management ---


  // --- Subscription & Feature Management ---
  getSubscriptionPlans: (): SubscriptionPlan[] => getItem(SUBSCRIPTION_PLANS_KEY, initialDefaultPlans),
  saveSubscriptionPlans: (plans: SubscriptionPlan[]): void => setItem(SUBSCRIPTION_PLANS_KEY, plans),

  getAppFeatures: (): AppFeature[] => getItem(FEATURES_KEY, DEFAULT_APP_FEATURES),
  saveAppFeatures: (features: AppFeature[]): void => setItem(FEATURES_KEY, features),

  // --- Quiz Management (FIRESTORE) ---
  getAllQuizzes: async (): Promise<QuizAdmin[]> => {
    if (!isFirebaseConfigured || !db) return [];
    try {
        const quizzesCollectionRef = collection(db, QUIZZES_COLLECTION);
        const q = query(quizzesCollectionRef, orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        if (querySnapshot.empty) {
            console.log('No quizzes found in Firestore. Seeding with default data...');
            const quizzes = await getQuizzes();
            for (const quiz of quizzes) {
                const { id, ...quizData } = quiz; 
                await addDoc(quizzesCollectionRef, quizData);
            }
            const refetchedSnapshot = await getDocs(q);
            return refetchedSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as QuizAdmin));
        }
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as QuizAdmin));
    } catch (error) {
        console.error("Error fetching quizzes from Firestore:", error);
        return [];
    }
  },
  getQuizById: async (quizId: string): Promise<QuizAdmin | null> => {
    if (!isFirebaseConfigured || !db) return null;
    try {
        const docRef = doc(db, QUIZZES_COLLECTION, quizId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return { id: docSnap.id, ...docSnap.data() } as QuizAdmin;
        }
        return null;
    } catch (error) {
        console.error(`Error fetching quiz by id ${quizId}:`, error);
        return null;
    }
  },
  createQuiz: async (newQuizData: Omit<QuizAdmin, 'id'>): Promise<string> => {
    if (!isFirebaseConfigured || !db) throw new Error("Firebase not configured.");
    const quizzesCollectionRef = collection(db, QUIZZES_COLLECTION);
    const docRef = await addDoc(quizzesCollectionRef, newQuizData);
    return docRef.id;
  },
  updateQuiz: async (quizToUpdate: QuizAdmin): Promise<void> => {
    if (!isFirebaseConfigured || !db) throw new Error("Firebase not configured.");
    const { id, ...data } = quizToUpdate;
    if (!id) throw new Error("Quiz ID is required for updating.");
    const docRef = doc(db, QUIZZES_COLLECTION, id);
    await updateDoc(docRef, data);
  },
  deleteQuiz: async (quizId: string): Promise<void> => {
    if (!isFirebaseConfigured || !db) throw new Error("Firebase not configured.");
    const docRef = doc(db, QUIZZES_COLLECTION, quizId);
    await deleteDoc(docRef);
  },
  
  // --- Documentation Pages (localStorage mock) ---
  getAllDocumentationPages: (): DocumentationPage[] => getItem(DOC_PAGES_KEY, MOCK_DOCUMENTATION_PAGES),
  getDocumentationPage: (id: string): DocumentationPage | null => {
      const pages = getItem<DocumentationPage[]>(DOC_PAGES_KEY, MOCK_DOCUMENTATION_PAGES);
      return pages.find(p => p.id === id) || null;
  },
  updateDocumentationPage: (id: string, content: DocumentationPage['content']): void => {
      const pages = getItem<DocumentationPage[]>(DOC_PAGES_KEY, MOCK_DOCUMENTATION_PAGES);
      const updatedPages = pages.map(p => p.id === id ? { ...p, content } : p);
      setItem(DOC_PAGES_KEY, updatedPages);
  },


  // --- Quiz Results & Journey State (Firestore & Session) ---
  getAllCompletedQuizzes: async (): Promise<QuizResult[]> => {
    if (!isFirebaseConfigured || !db) return [];
    try {
        const resultsCollectionRef = collection(db, QUIZ_RESULTS_COLLECTION);
        const q = query(resultsCollectionRef, orderBy('dateCompleted', 'desc'));
        let querySnapshot = await getDocs(q);
        
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        } as QuizResult));
    } catch (error) {
        console.error("Error fetching completed quizzes from Firestore:", error);
        return [];
    }
  },
  getCompletedQuizzesForUser,
  addCompletedQuiz: async (result: Omit<QuizResult, 'id'>): Promise<string> => {
    if (!isFirebaseConfigured || !db) throw new Error("Firebase not configured.");
    const resultsCollectionRef = collection(db, QUIZ_RESULTS_COLLECTION);
    const docRef = await addDoc(resultsCollectionRef, result);
    return docRef.id;
  },
  deleteCompletedQuiz: async (resultId: string): Promise<void> => {
    if (!isFirebaseConfigured || !db) throw new Error("Firebase not configured.");
    const docRef = doc(db, QUIZ_RESULTS_COLLECTION, resultId);
    await deleteDoc(docRef);
  },
  getTempQuizResult: (): QuizResult | null => {
    if (typeof window === 'undefined') return null;
    const result = getSessionItem<QuizResult | null>(TEMP_QUIZ_RESULT_KEY, null);
    if (result) {
      window.sessionStorage.removeItem(TEMP_QUIZ_RESULT_KEY);
    }
    return result;
  },
  setTempQuizResult: (result: QuizResult): void => setSessionItem(TEMP_QUIZ_RESULT_KEY, result),
  
  // Other journey state helpers using localStorage
  getOnboardingAnalysis: (): string | null => getItem(ONBOARDING_ANALYSIS_KEY, null),
  saveOnboardingAnalysis: (analysis: string): void => setItem(ONBOARDING_ANALYSIS_KEY, analysis),
  getFirstCoachingViewed: (): boolean => getItem(FIRST_COACHING_VIEWED_KEY, false),
  setFirstCoachingViewed: (): void => setItem(FIRST_COACHING_VIEWED_KEY, true),
  setJourneyQuizCompleted: (): void => setItem(JOURNEY_QUIZ_COMPLETED_KEY, true),

  // Other dummy data fetches (will be phased out)
  // These are now empty or return empty arrays to reduce bundle size.
  getFeedbackEntries: (): FeedbackEntry[] => [],
  getConversations: (): Conversation[] => [],
  getPayableLessons: (): PayableLesson[] => [],
  getChildrenForParent: (): ChildProfile[] => [],
  getChildProgressData: (childId: string): ChildProgressData | null => null,
  getScheduledLessons: (): ScheduledLesson[] => [],
  getCoachSessions: (): { upcoming: CoachingSession[], past: CoachingSession[] } => ({ upcoming: [], past: [] }),
  getTutorLessons: (): { upcoming: Lesson[], past: Lesson[] } => ({ upcoming: [], past: [] }),
  getClientsForCoach: (): ClientEntry[] => [],
  getStudentsForTutor: (): StudentEntry[] => [],
  getStudentDetails: (studentId: string): StudentDetails | null => null,
};
