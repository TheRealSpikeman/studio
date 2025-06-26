// src/contexts/AuthContext.tsx
"use client";

import type { ReactNode } from 'react';
import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { User as FirebaseUser } from 'firebase/auth';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db, isFirebaseConfigured } from '@/lib/firebase';
import type { User, UserRoleType } from '@/types/user';

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
  isFirebaseConfigured: boolean;
  login: (email: string, pass: string) => Promise<boolean>;
  signup: (data: SignupData) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USER_STORAGE_KEY = 'mindnavigator_session_user';

const demoUsers: Record<string, UserRoleType> = {
  'admin@example.com': 'admin',
  'ouder@example.com': 'ouder',
  'leerling@example.com': 'leerling',
  'tutor@example.com': 'tutor',
  'coach@example.com': 'coach',
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!isFirebaseConfigured || !auth) {
      setIsLoading(false);
      return;
    }
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser && db) {
        const userDocRef = doc(db, "users", firebaseUser.uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          const userData = userDocSnap.data() as Omit<User, 'id'>;
          const appUser: User = {
            id: firebaseUser.uid,
            ...userData,
            email: firebaseUser.email || userData.email,
          };
          setUser(appUser);
          localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(appUser));
        } else {
          console.warn("User exists in Auth but not in Firestore. Logging out.");
          await signOut(auth);
          setUser(null);
          localStorage.removeItem(USER_STORAGE_KEY);
        }
      } else {
        setUser(null);
        localStorage.removeItem(USER_STORAGE_KEY);
      }
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const login = useCallback(async (email: string, pass: string): Promise<boolean> => {
    if (!isFirebaseConfigured || !auth || !db) {
      console.error("Firebase not configured, login aborted.");
      return false;
    }
    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, pass);
      // onAuthStateChanged will handle setting user and redirecting
      return true;
    } catch (error: any) {
      const roleForDemoUser = demoUsers[email];
      // If it's a known demo user and the error is user-not-found or invalid-credential, try to create it.
      if (roleForDemoUser && (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential')) {
        console.log(`Demo user ${email} not found. Attempting to create...`);
        try {
          // Attempt to sign up the demo user
          const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
          const firebaseUser = userCredential.user;
          const userDocRef = doc(db, "users", firebaseUser.uid);
          
          const name = `${roleForDemoUser.charAt(0).toUpperCase() + roleForDemoUser.slice(1)} User`;
          
          const newUserProfile: Omit<User, 'id'> = {
            name: name,
            email: email,
            role: roleForDemoUser,
            status: 'actief', // Demo users are active by default
            createdAt: new Date().toISOString(),
            lastLogin: new Date().toISOString(),
            // Add default ageGroup for leerling demo user
            ...(roleForDemoUser === 'leerling' && { ageGroup: '15-18' }),
          };
          
          await setDoc(userDocRef, newUserProfile);
          // onAuthStateChanged will handle the rest.
          return true;
        } catch (signupError) {
          console.error(`Failed to create demo user ${email}:`, signupError);
          setIsLoading(false);
          return false;
        }
      } else {
        // It's a regular login error (e.g. wrong password for an existing user)
        console.error("Firebase Login Error:", error);
        setIsLoading(false);
        return false;
      }
    }
  }, []);

  const signup = useCallback(async (data: SignupData): Promise<{ success: boolean; error?: string }> => {
    if (!isFirebaseConfigured || !auth || !db) {
      console.error("Firebase not configured, signup aborted.");
      return { success: false, error: "Firebase is not configured." };
    }
    setIsLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.pass);
      const firebaseUser = userCredential.user;
      const userDocRef = doc(db, "users", firebaseUser.uid);
      const newUserProfile: Omit<User, 'id'> = {
        name: data.name, email: data.email, role: data.role, ageGroup: data.ageGroup, status: 'niet geverifieerd',
        createdAt: new Date().toISOString(), lastLogin: new Date().toISOString(),
      };
      await setDoc(userDocRef, newUserProfile);
      return { success: true };
    } catch (error: any) {
      console.error("Firebase Signup Error:", error);
      setIsLoading(false);
      return { success: false, error: error.message };
    }
  }, []);

  const logout = useCallback(async () => {
    if (auth) {
      await signOut(auth);
    }
    setUser(null);
    localStorage.removeItem(USER_STORAGE_KEY);
    router.push('/login');
  }, [router]);

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    isFirebaseConfigured,
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
