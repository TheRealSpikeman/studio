// app/dashboard/profile/email_actions.ts
"use server";

import { revalidatePath } from 'next/cache';
import admin from 'lib/firebase-admin';
import { getAuth } from 'firebase-admin/auth';

interface UpdateEmailResult {
  success: boolean;
  error?: string;
}

export async function updateUserEmail(
  userId: string,
  newEmail: string,
): Promise<UpdateEmailResult> {
  if (!userId || !newEmail) {
    return { success: false, error: "User ID and new email are required." };
  }

  try {
    const auth = getAuth(admin.app());
    // Update email in Firebase Authentication
    await auth.updateUser(userId, { email: newEmail, emailVerified: false });

    // Update email in Firestore
    const userRef = admin.firestore().collection("users").doc(userId);
    await userRef.update({ email: newEmail });
    
    // Send verification email to the new address
    // This is a placeholder. In a real app, you'd use a more robust email sending service.
    console.log(`Sending verification email to ${newEmail}`);
    // await auth.generateEmailVerificationLink(newEmail);


    revalidatePath('/dashboard/profile');
    
    return { success: true };
  } catch (error) {
    console.error("Server Action Error - updateUserEmail:", error);
    // Check for specific Firebase Auth errors
    if (error.code === 'auth/email-already-exists') {
        return { success: false, error: "This email address is already in use by another account." };
    }
    if (error.code === 'auth/invalid-email') {
        return { success: false, error: "The new email address is not valid." };
    }
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "An unknown server error occurred." 
    };
  }
}
