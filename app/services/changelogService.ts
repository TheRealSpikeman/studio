// src/services/changelogService.ts
'use server';

import type { ChangelogEntry } from '@/types/changelog';
import { adminDb } from '@/lib/firebase-admin'; // Using server-side admin SDK for Firebase

/**
 * Fetches all changelog entries from the Firestore database.
 * @returns {Promise<ChangelogEntry[]>} A promise that resolves to the array of changelog entries.
 */
export const getChangelogEntries = async (): Promise<ChangelogEntry[]> => {
  try {
    const changelogCollection = adminDb.collection('changelog');
    const snapshot = await changelogCollection.orderBy('date', 'desc').get();

    if (snapshot.empty) {
      console.log('No matching documents in "changelog" collection.');
      return [];
    }

    const entries: ChangelogEntry[] = snapshot.docs.map(doc => {
      const data = doc.data();
      // Firestore timestamps need to be converted to serializable format (ISO string)
      const date = data.date.toDate ? data.date.toDate().toISOString() : data.date;
      
      return {
        id: doc.id,
        date,
        title: data.title,
        description: data.description,
        tags: data.tags,
        iconName: data.iconName,
        details: data.details,
      };
    });
    
    return entries;
  } catch (error) {
    console.error("Error fetching changelog from Firestore:", error);
    // Return an empty array or re-throw the error, depending on desired error handling
    return [];
  }
};
