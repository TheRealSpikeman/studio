// services/subscriptionService.ts
'use server';

import { db, isFirebaseConfigured } from '@/lib/firebase-admin'; // Use Admin SDK for server actions
import { collection, doc, getDoc, getDocs, setDoc, updateDoc, deleteDoc, Timestamp, orderBy, query, limit } from 'firebase/firestore';
import type { SubscriptionPlan } from '@/types/subscription';
import { initialDefaultPlans } from '@/lib/data/subscription-data';

const PLANS_COLLECTION = 'subscriptionPlans';

/**
 * Seeds the database with initial plans if the collection is empty.
 * This is a one-time operation.
 */
async function seedInitialPlansIfNeeded() {
  if (!isFirebaseConfigured) return;
  const plansRef = collection(db, PLANS_COLLECTION);
  const snapshot = await getDocs(query(plansRef, orderBy('price'), limit(1)));
  
  if (snapshot.empty) {
    console.log("Seeding initial subscription plans to Firestore...");
    const batch = db.batch();
    initialDefaultPlans.forEach(plan => {
      const docRef = doc(db, PLANS_COLLECTION, plan.id);
      const planData = { ...plan };
      // @ts-ignore
      delete planData.id; // Don't save the ID field in the document data

      batch.set(docRef, {
        ...planData,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });
    });
    await batch.commit();
    console.log("Seeding complete.");
  }
}

// --- Public API ---

/**
 * Retrieves all subscription plans from Firestore. Server-safe.
 * @returns {Promise<SubscriptionPlan[]>} The array of subscription plans.
 */
export async function getSubscriptionPlans(): Promise<SubscriptionPlan[]> {
  if (!isFirebaseConfigured) return [];
  
  await seedInitialPlansIfNeeded();

  const plansRef = collection(db, PLANS_COLLECTION);
  const snapshot = await getDocs(query(plansRef, orderBy('price')));
  
  return snapshot.docs.map(doc => {
    const data = doc.data();
    return {
      ...data,
      id: doc.id,
      // @ts-ignore
      createdAt: (data.createdAt as Timestamp)?.toDate().toISOString(),
      // @ts-ignore
      updatedAt: (data.updatedAt as Timestamp)?.toDate().toISOString(),
    } as SubscriptionPlan;
  });
};

/**
 * Retrieves a single subscription plan by its ID from Firestore. Server-safe.
 * @param {string} id - The ID of the plan to retrieve.
 * @returns {Promise<SubscriptionPlan | null>} The plan object or null if not found.
 */
export async function getSubscriptionPlanById(id: string): Promise<SubscriptionPlan | null> {
  if (!isFirebaseConfigured || !id) return null;
  const docRef = doc(db, PLANS_COLLECTION, id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    const data = docSnap.data();
    return {
      ...data,
      id: docSnap.id,
      // @ts-ignore
      createdAt: (data.createdAt as Timestamp)?.toDate().toISOString(),
      // @ts-ignore
      updatedAt: (data.updatedAt as Timestamp)?.toDate().toISOString(),
    } as SubscriptionPlan;
  }
  return null;
};

/**
 * Creates a new subscription plan in Firestore. Server-side only.
 * @param {Omit<SubscriptionPlan, 'id' | 'createdAt' | 'updatedAt'>} data - The new plan data.
 */
export async function createSubscriptionPlan(data: Omit<SubscriptionPlan, 'id' | 'createdAt' | 'updatedAt'>): Promise<SubscriptionPlan> {
  if (!isFirebaseConfigured) throw new Error("Firebase not configured");
  
  const plansRef = collection(db, PLANS_COLLECTION);
  // @ts-ignore
  const docRef = doc(plansRef, data.id);

  const planWithTimestamps = {
    ...data,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };
  
  // @ts-ignore
  delete planWithTimestamps.id;

  await setDoc(docRef, planWithTimestamps);
  
  return {
    ...data,
    // @ts-ignore
    id: data.id,
    createdAt: planWithTimestamps.createdAt.toDate().toISOString(),
    updatedAt: planWithTimestamps.updatedAt.toDate().toISOString(),
  };
};

/**
 * Updates an existing subscription plan in Firestore. Server-side only.
 * @param {string} id - The ID of the plan to update.
 * @param {Partial<SubscriptionPlan>} data - The fields to update.
 */
export async function updateSubscriptionPlan(id: string, data: Partial<Omit<SubscriptionPlan, 'id'>>): Promise<void> {
    if (!isFirebaseConfigured) throw new Error("Firebase not configured");
    const docRef = doc(db, PLANS_COLLECTION, id);
    await updateDoc(docRef, {
        ...data,
        updatedAt: Timestamp.now(),
    });
};

/**
 * Deletes a subscription plan from Firestore. Server-side only.
 * @param {string} id - The ID of the plan to delete.
 */
export async function deleteSubscriptionPlan(id: string): Promise<void> {
    if (!isFirebaseConfigured) throw new Error("Firebase not configured");
    const docRef = doc(db, PLANS_COLLECTION, id);
    await deleteDoc(docRef);
};
