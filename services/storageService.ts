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

import {
  DUMMY_USERS,
  dummyFeedbackEntries,
  dummyConversations,
  dummySubscriptions,
  dummyPayableLessons,
  dummyChildrenData,
  dummyProfessionalsData,
  dummyChildren,
  dummyProgressData,
  initialScheduledLessons,
  dummyUpcomingCoachSessions,
  dummyPastCoachSessions,
  dummyUpcomingLessons,
  dummyPastLessons,
  dummyClients,
  dummyStudents,
  allStudentDetails,
  dummyCompletedQuizzes,
} from '@/lib/data/dummy-data';

import type { User, FeedbackEntry, Conversation, OuderSubscription, PayableLesson, ChildBase, ProfessionalBase, ChildProfile, ChildProgressData, Lesson, CoachingSession, StudentEntry, StudentDetails, ScheduledLesson, SubscriptionPlan, AppFeature, QuizAdmin, QuizResult } from '@/types';
import { initialDefaultPlans, DEFAULT_APP_FEATURES } from '@/types/subscription';
import { getQuizzes } from './quizService';

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

const getCompletedQuizzesForUser = async (userId: string): Promise<QuizResult[]> => {
    if (!isFirebaseConfigured || !db) return [];
    if (!userId) return [];
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

export const storageService = {
  getUsers: async (): Promise<User[]> => {
    if (!isFirebaseConfigured || !db) return [];
    try {
        const usersCollectionRef = collection(db, USERS_COLLECTION);
        const q = query(usersCollectionRef, orderBy('createdAt', 'desc'));
        let querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            console.warn("Users collection is empty. Seeding with dummy data for demonstration.");
            for (const user of DUMMY_USERS) {
                const docRef = doc(db, USERS_COLLECTION, user.id);
                const { id, ...userData } = user;
                await setDoc(docRef, userData);
            }
            querySnapshot = await getDocs(q);
        }

        return querySnapshot.docs.map(doc => {
            const data = doc.data();
            
            const processedData = {
                ...data,
                id: doc.id,
                createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : data.createdAt,
                lastLogin: data.lastLogin?.toDate ? data.lastLogin.toDate().toISOString() : data.lastLogin,
            };

            if (processedData.coaching && processedData.coaching.startDate?.toDate) {
                processedData.coaching.startDate = processedData.coaching.startDate.toDate().toISOString();
            }

            return processedData as User;
        });
    } catch (error) {
        console.error("Error fetching users from Firestore:", error);
        return [];
    }
  },
  
  getTutors: async (): Promise<User[]> => {
      const allUsers = await storageService.getUsers();
      return allUsers.filter(u => u.role === 'tutor');
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

  getSubscriptionPlans: (): SubscriptionPlan[] => getItem(SUBSCRIPTION_PLANS_KEY, initialDefaultPlans),
  saveSubscriptionPlans: (plans: SubscriptionPlan[]): void => setItem(SUBSCRIPTION_PLANS_KEY, plans),

  getAppFeatures: (): AppFeature[] => getItem(FEATURES_KEY, DEFAULT_APP_FEATURES),
  saveAppFeatures: (features: AppFeature[]): void => setItem(FEATURES_KEY, features),

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

  getAllCompletedQuizzes: async (): Promise<QuizResult[]> => {
    if (!isFirebaseConfigured || !db) return [];
    try {
        const resultsCollectionRef = collection(db, QUIZ_RESULTS_COLLECTION);
        const q = query(resultsCollectionRef, orderBy('dateCompleted', 'desc'));
        let querySnapshot = await getDocs(q);
        
        if (querySnapshot.empty) {
          console.warn("No quiz results found in Firestore. Seeding with dummy data for demonstration.");
          for (const result of dummyCompletedQuizzes) {
            await addDoc(resultsCollectionRef, result);
          }
          querySnapshot = await getDocs(q);
        }

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
  
  getOnboardingAnalysis: (): string | null => getItem(ONBOARDING_ANALYSIS_KEY, null),
  saveOnboardingAnalysis: (analysis: string): void => setItem(ONBOARDING_ANALYSIS_KEY, analysis),
  getFirstCoachingViewed: (): boolean => getItem(FIRST_COACHING_VIEWED_KEY, false),
  setFirstCoachingViewed: (): void => setItem(FIRST_COACHING_VIEWED_KEY, true),
  setJourneyQuizCompleted: (): void => setItem(JOURNEY_QUIZ_COMPLETED_KEY, true),
  
  getFeedbackEntries: (): FeedbackEntry[] => dummyFeedbackEntries,
  getConversations: (): Conversation[] => dummyConversations,
  getPayableLessons: (): PayableLesson[] => dummyPayableLessons,
  getChildrenForParent: (): ChildProfile[] => dummyChildren,
  getChildProgressData: (childId: string): ChildProgressData | null => dummyProgressData[childId] || null,
  getScheduledLessons: (): ScheduledLesson[] => initialScheduledLessons,
  getCoachSessions: (): { upcoming: CoachingSession[], past: CoachingSession[] } => ({ upcoming: dummyUpcomingCoachSessions, past: dummyPastCoachSessions }),
  getTutorLessons: (): { upcoming: Lesson[], past: Lesson[] } => ({ upcoming: dummyUpcomingLessons, past: dummyPastLessons }),
  getClientsForCoach: (): ClientEntry[] => dummyClients,
  getStudentsForTutor: (): StudentEntry[] => dummyStudents,
  getStudentDetails: (studentId: string): StudentDetails | null => allStudentDetails[studentId] || null,
};
