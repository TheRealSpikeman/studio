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
import type { User, UserRoleType, UserStatus } from '@/types/user';
import { useToast } from '@/hooks/use-toast';

export interface SignupData {
  email: string;
  pass: string;
  name: string;
  role: UserRoleType;
  ageGroup?: '12-14' | '15-18' | 'adult';
  status?: UserStatus;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isFirebaseConfigured: boolean;
  login: (email: string, pass: string) => Promise<boolean>;
  signup: (data: SignupData) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  switchUserRole: (role: UserRoleType) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USER_STORAGE_KEY = 'mindnavigator_session_user';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    if (!isFirebaseConfigured || !auth) {
      setIsLoading(false);
      return;
    }
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser && db) {
        try { // Wrap in try-catch to handle offline errors
          const userDocRef = doc(db, "users", firebaseUser.uid);
          const userDocSnap = await getDoc(userDocRef);

          if (userDocSnap.exists()) {
            const appUser: User = {
              id: firebaseUser.uid,
              ...(userDocSnap.data() as Omit<User, 'id'>),
              email: firebaseUser.email || userDocSnap.data().email,
            };
            setUser(appUser);
            localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(appUser));
          } else {
            console.warn(`User ${firebaseUser.uid} authenticated, but no Firestore document found. Logging out.`);
            await signOut(auth);
          }
        } catch (error: any) {
          console.error("Firebase Auth Error (onAuthStateChanged):", error);
          if (error.code === 'unavailable') { // Handle offline error gracefully
            toast({
              title: "Offline",
              description: "Kon profiel niet laden. Controleer uw internetverbinding.",
              variant: "destructive",
            });
            const cachedUser = localStorage.getItem(USER_STORAGE_KEY);
            if (cachedUser) {
              setUser(JSON.parse(cachedUser));
            } else {
              setUser(null);
            }
          } else {
            await signOut(auth);
          }
        }
      } else {
        setUser(null);
        localStorage.removeItem(USER_STORAGE_KEY);
      }
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, [toast]);

  const signup = useCallback(async (data: SignupData): Promise<{ success: boolean; error?: string }> => {
    if (!isFirebaseConfigured || !auth || !db) {
      return { success: false, error: "Firebase is not configured." };
    }
    setIsLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.pass);
      const firebaseUser = userCredential.user;
      const userDocRef = doc(db, "users", firebaseUser.uid);
      const newUserProfile: Omit<User, 'id'> = {
        name: data.name, email: data.email, role: data.role, ageGroup: data.ageGroup, 
        status: data.status || 'niet geverifieerd',
        createdAt: new Date().toISOString(), lastLogin: new Date().toISOString(),
      };
      await setDoc(userDocRef, newUserProfile);
      return { success: true };
    } catch (error: any) {
      setIsLoading(false);
      let errorMessage = "Er is een onbekende fout opgetreden.";
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = "Dit e-mailadres is al in gebruik.";
      }
      return { success: false, error: errorMessage };
    }
  }, []);

  const login = useCallback(async (email: string, pass: string): Promise<boolean> => {
    if (!isFirebaseConfigured || !auth) {
      return false;
    }
    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, pass);
      return true;
    } catch (error: any) {
      console.error("Firebase Login Error:", error);
      setIsLoading(false);
      return false;
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

  const switchUserRole = useCallback((role: UserRoleType) => {
    if (user) {
      const updatedUser = { ...user, role: role };
      setUser(updatedUser);
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updatedUser));
      router.push(`/dashboard/${role}`);
    }
  }, [user, router]);

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    isFirebaseConfigured,
    login,
    signup,
    logout,
    switchUserRole
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
