// app/dashboard/admin/user-management/_actions.ts
"use server";

import { revalidatePath } from 'next/cache';
import { updateUser as updateUserService } from '@/services/userService';
import type { User, UserStatus } from '@/types/user';

interface UpdateUserResult {
  success: boolean;
  error?: string;
}

/**
 * A Server Action to update a user's status.
 * This function runs securely on the server and is safe to call from client components.
 * @param userId The ID of the user to update.
 * @param updates An object containing the new status.
 * @returns A result object indicating success or failure.
 */
export async function updateUserAction(
  userId: string, 
  updates: Partial<User>
): Promise<UpdateUserResult> {
  if (!userId) {
    return { success: false, error: "User ID is required." };
  }

  try {
    await updateUserService(userId, updates);
    // Invalidate the cache for the user management page to show the updated data
    revalidatePath('/dashboard/admin/user-management');
    // Also invalidate the edit page itself
    revalidatePath(`/dashboard/admin/user-management/edit/${userId}`);
    return { success: true };
  } catch (error) {
    console.error("Server Action Error - updateUserAction:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "An unknown error occurred." 
    };
  }
}
