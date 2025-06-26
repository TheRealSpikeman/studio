// src/contexts/AuthContext.tsx
"use client";

import type { ReactNode } from 'react';
import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { User as FirebaseUser } from 'firebase/auth';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import type { User, UserRoleType } from '@/types/user';

// This is the new data needed for signup
export interface SignupData {
  email: string;
  pass: string;
  name: string;
  role: UserRoleType;
  ageGroup?: '12-14' | '15-18' | 'adult';
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<boolean>;
  signup: (data: SignupData) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USER_STORAGE_KEY = 'mindnavigator_session_user';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Effect to handle auth state changes from Firebase
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // User is signed in, get their profile from Firestore
        const userDocRef = doc(db, "users", firebaseUser.uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          const userData = userDocSnap.data() as Omit<User, 'id'>;
          const appUser: User = {
            id: firebaseUser.uid,
            ...userData,
            // Ensure email from auth is used if not in doc
            email: firebaseUser.email || userData.email, 
          };
          setUser(appUser);
          localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(appUser));
        } else {
          // This case might happen if a user exists in Auth but not Firestore.
          // For now, we log them out to force a clean state.
          console.warn("User exists in Auth but not in Firestore. Logging out.");
          await signOut(auth);
          setUser(null);
          localStorage.removeItem(USER_STORAGE_KEY);
        }
      } else {
        // User is signed out
        setUser(null);
        localStorage.removeItem(USER_STORAGE_KEY);
      }
      setIsLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const login = useCallback(async (email: string, pass: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, pass);
      // onAuthStateChanged will handle setting user and redirecting
      router.push('/dashboard');
      return true;
    } catch (error) {
      console.error("Firebase Login Error:", error);
      setIsLoading(false);
      return false;
    }
  }, [router]);

  const signup = useCallback(async (data: SignupData): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.pass);
      const firebaseUser = userCredential.user;

      // Now, create a user document in Firestore
      const userDocRef = doc(db, "users", firebaseUser.uid);
      const newUserProfile: Omit<User, 'id'> = {
        name: data.name,
        email: data.email,
        role: data.role,
        ageGroup: data.ageGroup,
        status: 'niet geverifieerd', // Or 'actief' if email verification is not required step
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
      };
      
      await setDoc(userDocRef, newUserProfile);
      
      // onAuthStateChanged will handle setting the user state.
      return { success: true };
    } catch (error: any) {
      console.error("Firebase Signup Error:", error);
      setIsLoading(false);
      return { success: false, error: error.message };
    }
  }, []);

  const logout = useCallback(async () => {
    await signOut(auth);
    router.push('/login');
  }, [router]);

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    signup,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
