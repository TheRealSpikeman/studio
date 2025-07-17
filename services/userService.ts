// services/userService.ts
import admin from 'lib/firebase-admin';
import type { User, UserStatus } from '@/types/user';
import { Timestamp } from 'firebase-admin/firestore';

const db = admin.firestore();

const processUserData = async (doc: admin.firestore.DocumentSnapshot): Promise<User> => {
    const data = doc.data();
    if (!data) {
      throw new Error(`Document data is undefined for doc: ${doc.id}`);
    }
    const roleName = data.role || 'Geen Rol';
    const createdAt = data.createdAt instanceof Timestamp ? data.createdAt.toDate().toISOString() : (data.createdAt || new Date().toISOString());
    const lastLogin = data.lastLogin instanceof Timestamp ? data.lastLogin.toDate().toISOString() : (data.lastLogin || new Date().toISOString());
    const userObject: User = {
      ...data, id: doc.id, role: roleName, createdAt, lastLogin,
      name: data.name || 'N/A', email: data.email, status: data.status || 'niet geverifieerd',
    };
    return userObject;
};

export const getAllUsers = async (): Promise<User[]> => {
  try {
    const usersCollection = db.collection("users");
    const userSnapshot = await usersCollection.get();
    if (userSnapshot.empty) return [];
    return await Promise.all(userSnapshot.docs.map(processUserData));
  } catch (error) {
    console.error('Error in getAllUsers:', error);
    throw new Error('Could not fetch users from Firestore.');
  }
};

/**
 * Updates a user's data in Firestore using the Admin SDK.
 * @param {string} userId - The ID of the user to update.
 * @param {Partial<User>} updates - An object containing the fields to update.
 * @returns {Promise<{success: boolean}>} A promise that resolves to an object indicating success.
 */
export const updateUser = async (userId: string, updates: Partial<User>): Promise<{success: boolean}> => {
  if (!userId || !updates) {
    throw new Error("User ID and updates must be provided.");
  }
  try {
    const userRef = db.collection("users").doc(userId);
    await userRef.update(updates);
    return { success: true };
  } catch (error) {
    console.error(`Error updating user ${userId}:`, error);
    throw new Error('Could not update user in Firestore.');
  }
};
