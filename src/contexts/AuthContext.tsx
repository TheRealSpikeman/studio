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
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
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
    // If firebase is not configured, don't attempt to set up listeners.
    if (!isFirebaseConfigured || !auth || !db) {
      setIsLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
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
            await updateDoc(userDocRef, { lastLogin: new Date().toISOString() });
            router.push(`/dashboard/${appUser.role}`);
          } else {
            console.warn(`User ${firebaseUser.uid} authenticated, but no Firestore doc found. Logging out.`);
            await signOut(auth);
          }
        } catch (error: any) {
          console.error("Error fetching user document from Firestore:", error);
          if (error.code === 'unavailable' || (error.message && error.message.toLowerCase().includes('offline'))) {
            const cachedUserStr = localStorage.getItem(USER_STORAGE_KEY);
            if (cachedUserStr) {
                try {
                  const cachedUser = JSON.parse(cachedUserStr);
                  if (cachedUser.id === firebaseUser.uid) {
                    setUser(cachedUser);
                    toast({
                      title: "Offline modus (beperkt)",
                      description: "Kon profiel niet vernieuwen. Weergegeven data is mogelijk niet up-to-date.",
                      variant: "default",
                    });
                    router.push(`/dashboard/${cachedUser.role}`);
                  } else {
                    await signOut(auth);
                  }
                } catch (e) {
                    await signOut(auth);
                }
            } else {
                toast({
                  title: "Authenticatie Fout",
                  description: "Kon uw profiel niet laden. Log opnieuw in.",
                  variant: "destructive",
                });
                await signOut(auth);
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
  }, [toast, router]);

  const signup = useCallback(async (data: SignupData): Promise<{ success: boolean; error?: string }> => {
    if (!isFirebaseConfigured || !auth || !db) {
      return { success: false, error: "Firebase is niet geconfigureerd." };
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.pass);
      const firebaseUser = userCredential.user;
      const userDocRef = doc(db, "users", firebaseUser.uid);
      const newUserProfile: Omit<User, 'id'> = {
        name: data.name,
        email: data.email,
        role: data.role,
        ageGroup: data.ageGroup,
        status: data.status || 'niet geverifieerd',
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
      };
      await setDoc(userDocRef, newUserProfile);
      return { success: true };
    } catch (error: any) {
      console.error("Signup Error:", error.code, error.message);
      let friendlyError = "Er is een onbekende fout opgetreden.";
      if (error.code === 'auth/email-already-in-use') {
        friendlyError = "Dit e-mailadres is al in gebruik.";
      }
      return { success: false, error: friendlyError };
    }
  }, []);

  const login = useCallback(async (email: string, pass: string): Promise<boolean> => {
    if (!isFirebaseConfigured || !auth) {
      toast({
        title: "Configuratie Fout",
        description: "Firebase is niet geconfigureerd. Controleer .env-variabelen.",
        variant: "destructive"
      });
      return false;
    }
    
    setIsLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, pass);
      // onAuthStateChanged handles success (setting user, redirecting, etc.)
      return true;
    } catch (error) {
      let friendlyMessage = "Er is een onbekende fout opgetreden.";

      // Check if it's a Firebase error with a code property
      if (error && typeof error === 'object' && 'code' in error) {
        const firebaseError = error as { code: string; message: string };
        console.error("Firebase Login Error:", firebaseError.code, firebaseError.message);
        switch (firebaseError.code) {
          case 'auth/user-not-found':
          case 'auth/invalid-credential':
          case 'auth/wrong-password':
            friendlyMessage = "De combinatie van e-mail en wachtwoord is onjuist.";
            break;
          case 'auth/invalid-email':
            friendlyMessage = "Het ingevoerde e-mailadres is ongeldig.";
            break;
          case 'auth/too-many-requests':
            friendlyMessage = "Te veel inlogpogingen. Probeer het later opnieuw.";
            break;
          case 'auth/network-request-failed':
             friendlyMessage = "Netwerkfout. Controleer uw internetverbinding en probeer het opnieuw.";
             break;
          default:
            friendlyMessage = `Er is een fout opgetreden: ${firebaseError.code}`;
            break;
        }
      } else {
        // Log the entire unknown error for better debugging
        console.error("An unknown login error occurred:", error);
      }

      toast({
        title: "Inloggen Mislukt",
        description: friendlyMessage,
        variant: "destructive",
      });

      setIsLoading(false);
      return false;
    }
  }, [toast]);

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
    isFirebaseConfigured, // Pass the boolean from firebase.ts
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
