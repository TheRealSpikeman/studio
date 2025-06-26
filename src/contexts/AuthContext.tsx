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
          setUser(appUser);
          localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(appUser));
          const targetPath = `/dashboard/${appUser.role}`;
           if (window.location.pathname !== targetPath && !window.location.pathname.startsWith('/dashboard/')) {
             router.push(targetPath);
           }
        } else {
          // This case handles a new user signup where the Firestore doc might not be created yet.
          // For demo purposes, we will create a doc for known demo users.
          console.warn("User in Auth, but not yet in Firestore. This is likely a new signup.");
          const userEmail = firebaseUser.email;
          const roleForDemoUser = userEmail ? demoUsers[userEmail] : undefined;
          if (roleForDemoUser) {
            const name = `${roleForDemoUser.charAt(0).toUpperCase() + roleForDemoUser.slice(1)} User`;
            const newUserProfile: Omit<User, 'id'> = {
              name: name,
              email: userEmail!,
              role: roleForDemoUser,
              status: 'actief',
              createdAt: new Date().toISOString(),
              lastLogin: new Date().toISOString(),
              ...(roleForDemoUser === 'leerling' && { ageGroup: '15-18' }),
            };
            await setDoc(userDocRef, newUserProfile);
            appUser = { id: firebaseUser.uid, ...newUserProfile };
            setUser(appUser);
            localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(appUser));
             const targetPath = `/dashboard/${appUser.role}`;
             if (window.location.pathname !== targetPath && !window.location.pathname.startsWith('/dashboard/')) {
               router.push(targetPath);
             }
          } else {
            console.log("Regular user signed up, waiting for Firestore doc to be created by signup function.");
            // We give it a moment for the signup function's setDoc to complete.
            setTimeout(async () => {
              const refreshedSnap = await getDoc(userDocRef);
              if (refreshedSnap.exists()) {
                const appUser = { id: firebaseUser.uid, ...(refreshedSnap.data() as Omit<User, 'id'>) };
                setUser(appUser);
                localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(appUser));
              } else {
                console.error("Firestore document still not found for new user after signup. Logging out for safety.");
                await signOut(auth);
              }
            }, 1000);
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
        name: data.name, email: data.email, role: data.role, ageGroup: data.ageGroup, 
        status: data.status || 'niet geverifieerd',
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
