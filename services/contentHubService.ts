// services/contentHubService.ts
import { db, isFirebaseConfigured } from '@/lib/firebase';
import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  increment,
  type DocumentData,
  type Query,
} from 'firebase/firestore';

import type { ContentItem, FaqItem, Category, UserRole, SearchAnalytics } from '@/types/content-hub';

if (!isFirebaseConfigured) {
  console.warn("Firebase is niet geconfigureerd. De Content Hub Service is niet beschikbaar.");
}

const contentCollection = collection(db, 'content');
const faqCollection = collection(db, 'faq');
const categoriesCollection = collection(db, 'categories');
const searchAnalyticsCollection = collection(db, 'searchAnalytics');

// --- Helper ---
async function getDocuments<T>(q: Query): Promise<T[]> {
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as T));
}

// --- Content Item Services ---
export const ContentService = {
  create: async (data: Omit<ContentItem, 'id' | 'createdAt' | 'updatedAt' | 'viewCount' | 'helpfulVotes'>): Promise<string> => {
    const docRef = await addDoc(contentCollection, {
      ...data,
      viewCount: 0,
      helpfulVotes: { up: 0, down: 0 },
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return docRef.id;
  },
  get: async (id: string): Promise<ContentItem | null> => {
    const docSnap = await getDoc(doc(contentCollection, id));
    if (docSnap.exists()) {
        // Increment view count when fetching a single document
        await updateDoc(doc(contentCollection, id), { viewCount: increment(1) });
        return { id: docSnap.id, ...docSnap.data() } as ContentItem
    }
    return null;
  },
  update: async (id: string, data: Partial<ContentItem>): Promise<void> => {
    await updateDoc(doc(contentCollection, id), { ...data, updatedAt: serverTimestamp() });
  },
  delete: async (id: string): Promise<void> => {
    await deleteDoc(doc(contentCollection, id));
  },
  listByRole: async (role: UserRole): Promise<ContentItem[]> => {
    const q = query(contentCollection, where('userRoles', 'array-contains', role), where('status', '==', 'published'), orderBy('updatedAt', 'desc'));
    return getDocuments<ContentItem>(q);
  },
  listAll: async (): Promise<ContentItem[]> => {
    const q = query(contentCollection, orderBy('updatedAt', 'desc'));
    return getDocuments<ContentItem>(q);
  },
  vote: async (id: string, vote: 'up' | 'down'): Promise<void> => {
    const fieldToIncrement = `helpfulVotes.${vote}`;
    await updateDoc(doc(contentCollection, id), { [fieldToIncrement]: increment(1) });
  },
};

// --- FAQ Item Services ---
export const FaqService = {
  create: async (data: Omit<FaqItem, 'id' | 'createdAt' | 'updatedAt' | 'viewCount' | 'helpfulVotes'>): Promise<string> => {
    const docRef = await addDoc(faqCollection, {
      ...data,
      viewCount: 0,
      helpfulVotes: { up: 0, down: 0 },
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return docRef.id;
  },
  listAll: async (): Promise<FaqItem[]> => {
    const q = query(faqCollection, orderBy('updatedAt', 'desc'));
    return getDocuments<FaqItem>(q);
  },
  update: async (id: string, data: Partial<FaqItem>): Promise<void> => {
    await updateDoc(doc(faqCollection, id), { ...data, updatedAt: serverTimestamp() });
  },
  vote: async (id: string, vote: 'up' | 'down'): Promise<void> => {
    const fieldToIncrement = `helpfulVotes.${vote}`;
    await updateDoc(doc(faqCollection, id), { [fieldToIncrement]: increment(1) });
  },
};

// --- Category Services ---
export const CategoryService = {
    // ... (no changes needed here for analytics)
};

// --- Analytics Service ---
export const AnalyticsService = {
  logSearch: async (data: Omit<SearchAnalytics, 'id' | 'timestamp'>): Promise<void> => {
    await addDoc(searchAnalyticsCollection, {
      ...data,
      timestamp: serverTimestamp(),
    });
  },
  getSearchAnalytics: async (): Promise<SearchAnalytics[]> => {
      const q = query(searchAnalyticsCollection, orderBy('timestamp', 'desc'));
      return getDocuments<SearchAnalytics>(q);
  }
};
