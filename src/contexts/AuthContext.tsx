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
        
        let appUser: User | null = null;

        if (userDocSnap.exists()) {
          const userData = userDocSnap.data() as Omit<User, 'id'>;
          appUser = {
            id: firebaseUser.uid,
            ...userData,
            email: firebaseUser.email || userData.email,
          };
        } else {
          // User exists in Auth, but not in Firestore. Let's fix this for demo users.
          console.warn("User in Auth, but not in Firestore. Attempting to create Firestore document...");
          const userEmail = firebaseUser.email;
          const roleForDemoUser = userEmail ? demoUsers[userEmail] : undefined;

          if (roleForDemoUser) {
            const name = `${roleForDemoUser.charAt(0).toUpperCase() + roleForDemoUser.slice(1)} User`;
            const newUserProfile: Omit<User, 'id'> = {
              name: name,
              email: userEmail || 'unknown@example.com',
              role: roleForDemoUser,
              status: 'actief',
              createdAt: new Date().toISOString(),
              lastLogin: new Date().toISOString(),
              ...(roleForDemoUser === 'leerling' && { ageGroup: '15-18' }),
            };
            
            await setDoc(userDocRef, newUserProfile);
            appUser = { id: firebaseUser.uid, ...newUserProfile };
            console.log("Firestore document created for demo user:", userEmail);
          } else {
            console.error("Unknown user in Auth without Firestore document. Logging out for safety.");
            await signOut(auth);
          }
        }
        
        setUser(appUser);
        if (appUser) {
          localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(appUser));
          const targetPath = `/dashboard/${appUser.role}`;
          if (window.location.pathname !== targetPath) {
            router.push(targetPath);
          }
        }

      } else {
        setUser(null);
        localStorage.removeItem(USER_STORAGE_KEY);
      }
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, [router]);

  const login = useCallback(async (email: string, pass: string): Promise<boolean> => {
    if (!isFirebaseConfigured || !auth) {
      console.error("Firebase not configured, login aborted.");
      return false;
    }
    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, pass);
      // onAuthStateChanged will handle setting the user and redirecting.
      return true;
    } catch (error: any) {
      console.error("Firebase Login Error:", error);
      setIsLoading(false);
      return false;
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
      let errorMessage = "Er is een onbekende fout opgetreden.";
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = "Dit e-mailadres is al in gebruik. Probeer in te loggen of gebruik een ander e-mailadres.";
      }
      return { success: false, error: errorMessage };
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
