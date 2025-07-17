// app/dashboard/profile/_actions.ts
"use server";

import { revalidatePath } from 'next/cache';
import admin from 'lib/firebase-admin';
import type { User } from '@/types/user';

const db = admin.firestore();

type UserProfileUpdates = Pick<User, 
  'name' | 'phone' | 'birthDate' | 'address' | 'communicationPreferences' | 'billingAddress'
>;

interface UpdateProfileResult {
  success: boolean;
  error?: string;
}

/**
 * Server Action to update a user's profile information.
 * @param userId - The ID of the user to update.
 * @param updates - The profile data to update.
 * @returns A result object indicating success or failure.
 */
export async function updateUserProfile(
  userId: string,
  updates: UserProfileUpdates
): Promise<UpdateProfileResult> {
  if (!userId) {
    return { success: false, error: "User ID is required." };
  }

  try {
    const userRef = db.collection("users").doc(userId);
    await userRef.update(updates);
    
    revalidatePath('/dashboard/profile');
    
    return { success: true };
  } catch (error) {
    console.error("Server Action Error - updateUserProfile:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "An unknown error occurred." 
    };
  }
}
