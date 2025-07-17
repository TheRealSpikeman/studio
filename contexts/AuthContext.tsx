// src/contexts/AuthContext.tsx
"use client";

import type { ReactNode } from 'react';
import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  OAuthProvider,
  type Auth,
  type User as FirebaseUser 
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db, isFirebaseConfigured } from '@/lib/firebase';
import type { User } from '@/types/user'; // Ensure our custom User type is imported
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isFirebaseConfigured: boolean;
  auth: Auth | null;
  login: (email: string, pass: string) => Promise<boolean>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  loginWithGoogle: () => Promise<boolean>;
  loginWithApple: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  const handleSocialLogin = useCallback(async (firebaseUser: FirebaseUser) => {
    if (!db) return;
    const userDocRef = doc(db, "users", firebaseUser.uid);
    try {
      const userDocSnap = await getDoc(userDocRef);
      if (userDocSnap.exists()) {
        const userDataFromDb = userDocSnap.data() as Omit<User, 'id'>;
        const appUser: User = {
          id: firebaseUser.uid,
          ...userDataFromDb,
          email: firebaseUser.email || userDataFromDb.email,
        };
        setUser(appUser);
        // This client-side write is okay for existing users, but we will centralize it.
        // await updateDoc(userDocRef, { lastLogin: new Date().toISOString() });
      } else {
        // Create a new user document in Firestore
        const newUser: User = {
          id: firebaseUser.uid,
          email: firebaseUser.email || '',
          displayName: firebaseUser.displayName || '',
          photoURL: firebaseUser.photoURL || '',
          role: 'leerling', // Default role
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString(),
        };
        await setDoc(userDocRef, newUser);
        setUser(newUser);
      }
      router.push('/dashboard');
    } catch (error) {
      console.error("Error during social login user handling:", error);
      toast({ title: "Fout bij profiel verwerken", variant: "destructive" });
      await signOut(auth);
    }
  }, [router, toast]);

  const fetchAndSetUser = useCallback(async (firebaseUser: FirebaseUser) => {
    if (!db) return;
    const userDocRef = doc(db, "users", firebaseUser.uid);
    try {
      const userDocSnap = await getDoc(userDocRef);
      if (userDocSnap.exists()) {
        const userDataFromDb = userDocSnap.data() as Omit<User, 'id'>;
        const appUser: User = {
          id: firebaseUser.uid,
          ...userDataFromDb,
          email: firebaseUser.email || userDataFromDb.email,
        };
        setUser(appUser);
      } else {
        // This can happen if a user is created in Auth but not yet in Firestore.
        // The onboarding flow will handle document creation via the API.
        console.warn(`User ${firebaseUser.uid} has no Firestore document yet.`);
        setUser(null); // Set to null temporarily, onboarding will resolve this.
      }
    } catch (error) {
      console.error("Error fetching user document:", error);
      toast({ title: "Fout bij profiel laden", variant: "destructive" });
      await signOut(auth);
    }
  }, [toast]);

  useEffect(() => {
    if (!isFirebaseConfigured || !auth) {
      setIsLoading(false);
      return;
    }
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        await fetchAndSetUser(firebaseUser);
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, [fetchAndSetUser]);

  const refreshUser = useCallback(async () => {
    if (auth?.currentUser) {
      console.log("Refreshing user data from Firestore...");
      await fetchAndSetUser(auth.currentUser);
    }
  }, [auth, fetchAndSetUser]);

  const login = useCallback(async (email: string, pass: string): Promise<boolean> => {
    if (!isFirebaseConfigured || !auth) return false;
    try {
      await signInWithEmailAndPassword(auth, email, pass);
      // onAuthStateChanged will handle the rest
      router.push('/dashboard');
      return true;
    } catch (error) {
      toast({ title: "Inloggen Mislukt", variant: "destructive" });
      return false;
    }
  }, [router, toast]);

  const loginWithGoogle = useCallback(async (): Promise<boolean> => {
    if (!isFirebaseConfigured || !auth) return false;
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      await handleSocialLogin(result.user);
      return true;
    } catch (error: any) {
      if (error.code !== 'auth/popup-closed-by-user') {
        toast({ title: "Google Login Mislukt", description: error.message, variant: "destructive" });
      }
      return false;
    }
  }, [handleSocialLogin, toast]);

  const loginWithApple = useCallback(async (): Promise<boolean> => {
    if (!isFirebaseConfigured || !auth) return false;
    const provider = new OAuthProvider('apple.com');
    try {
      const result = await signInWithPopup(auth, provider);
      await handleSocialLogin(result.user);
      return true;
    } catch (error: any) {
      if (error.code !== 'auth/popup-closed-by-user') {
        toast({ title: "Apple Login Mislukt", description: error.message, variant: "destructive" });
      }
      return false;
    }
  }, [handleSocialLogin, toast]);

  const logout = useCallback(async () => {
    if (auth) {
      await signOut(auth);
      router.replace('/');
    }
  }, [router, auth]);

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    isFirebaseConfigured,
    auth,
    login,
    logout,
    refreshUser,
    loginWithGoogle,
    loginWithApple
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
