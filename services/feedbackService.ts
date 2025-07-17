// src/services/feedbackService.ts
'use client';

import { db, isFirebaseConfigured } from '@/lib/firebase';
import {
  collection,
  getDocs,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  Timestamp,
} from 'firebase/firestore';
import type { FeedbackEntry, FeedbackStatus } from '@/types/feedback';

const FEEDBACK_COLLECTION = 'feedback';

const createFeedback = async (feedbackData: Omit<FeedbackEntry, 'id'>): Promise<string> => {
  if (!isFirebaseConfigured || !db) throw new Error("Firebase is niet geconfigureerd.");
  
  const feedbackCollectionRef = collection(db, FEEDBACK_COLLECTION);
  
  const dataToSave = {
      ...feedbackData,
      status: feedbackData.status || 'nieuw' // Default status
  };

  const docRef = await addDoc(feedbackCollectionRef, dataToSave);
  return docRef.id;
};

const getAllFeedback = async (): Promise<FeedbackEntry[]> => {
  if (!isFirebaseConfigured || !db) return [];
  try {
    const feedbackCollectionRef = collection(db, FEEDBACK_COLLECTION);
    const q = query(feedbackCollectionRef, orderBy('timestamp', 'desc'));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      return [];
    }
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    } as FeedbackEntry));
  } catch (error) {
    console.error("Error fetching feedback from Firestore:", error);
    return [];
  }
};

const updateFeedbackStatus = async (id: string, status: FeedbackStatus): Promise<void> => {
    if (!isFirebaseConfigured || !db) throw new Error("Firebase is niet geconfigureerd.");
    const docRef = doc(db, FEEDBACK_COLLECTION, id);
    await updateDoc(docRef, { status });
};

const deleteFeedback = async (id: string): Promise<void> => {
    if (!isFirebaseConfigured || !db) throw new Error("Firebase is niet geconfigureerd.");
    const docRef = doc(db, FEEDBACK_COLLECTION, id);
    await deleteDoc(docRef);
};

export const feedbackService = {
  createFeedback,
  getAllFeedback,
  updateFeedbackStatus,
  deleteFeedback
};
