// app/dashboard/profile/password_actions.ts
"use server";

import admin from 'lib/firebase-admin';
import { getAuth } from 'firebase-admin/auth';

interface ChangePasswordResult {
  success: boolean;
  error?: string;
}

export async function changePassword(
  userId: string,
  newPassword
): Promise<ChangePasswordResult> {
  if (!userId || !newPassword) {
    return { success: false, error: "User ID and a new password are required." };
  }

  try {
    const auth = getAuth(admin.app());
    await auth.updateUser(userId, {
      password: newPassword,
    });
    
    return { success: true };
  } catch (error) {
    console.error("Server Action Error - changePassword:", error);
    return { 
      success: false, 
      error: "An unknown server error occurred while changing the password." 
    };
  }
}
