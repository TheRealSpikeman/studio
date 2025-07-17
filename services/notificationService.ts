// src/services/notificationService.ts
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
import type { AdminNotification } from '@/types/notification';

const NOTIFICATIONS_COLLECTION = 'notifications';

const getAllNotifications = async (): Promise<AdminNotification[]> => {
  if (!isFirebaseConfigured || !db) return [];
  try {
    const notificationsCollectionRef = collection(db, NOTIFICATIONS_COLLECTION);
    const q = query(notificationsCollectionRef, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      return [];
    }
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    } as AdminNotification));
  } catch (error) {
    console.error("Error fetching all notifications from Firestore:", error);
    return [];
  }
};

const createNotification = async (notificationData: Omit<AdminNotification, 'id'>): Promise<string> => {
  if (!isFirebaseConfigured || !db) throw new Error("Firebase not configured.");
  const notificationsCollectionRef = collection(db, NOTIFICATIONS_COLLECTION);
  const docRef = await addDoc(notificationsCollectionRef, notificationData);
  return docRef.id;
};

const deleteNotification = async (notificationId: string): Promise<void> => {
    if (!isFirebaseConfigured || !db) throw new Error("Firebase not configured.");
    const docRef = doc(db, NOTIFICATIONS_COLLECTION, notificationId);
    await deleteDoc(docRef);
};


// Public API of the service
export const notificationService = {
  getAllNotifications,
  createNotification,
  deleteNotification,
};
