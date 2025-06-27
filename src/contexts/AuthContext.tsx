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
const TEMP_PROFILE_KEY = 'mindnavigator_temp_profile'; // Key for signup data

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    if (!isFirebaseConfigured || !auth || !db) {
      console.log("[AuthContext] Firebase not configured. Halting auth listener.");
      setIsLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userDocRef = doc(db, "users", firebaseUser.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          console.log(`[AuthContext] Existing user found: ${firebaseUser.uid}. Updating last login.`);
          const appUser: User = {
            id: firebaseUser.uid,
            ...(userDocSnap.data() as Omit<User, 'id'>),
          };
          setUser(appUser);
          localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(appUser));
          await updateDoc(userDocRef, { lastLogin: new Date().toISOString() });
        } else {
          // New user signup flow part 2: Doc doesn't exist yet.
          console.log(`[AuthContext] New user detected: ${firebaseUser.uid}. Checking for temp profile data.`);
          const tempProfileRaw = localStorage.getItem(TEMP_PROFILE_KEY);
          if (tempProfileRaw) {
            console.log(`[AuthContext] Temp profile data found. Creating Firestore document...`);
            try {
              const tempProfileData = JSON.parse(tempProfileRaw);
              const finalProfileData = {
                ...tempProfileData,
                email: firebaseUser.email, // Ensure email from auth is used
              };

              // Create the document. This is the critical step.
              await setDoc(userDocRef, finalProfileData);
              console.log(`[AuthContext] Firestore document created successfully for ${firebaseUser.uid}.`);
              
              // Clean up
              localStorage.removeItem(TEMP_PROFILE_KEY);

              // Set user state and redirect
              const appUser: User = { id: firebaseUser.uid, ...finalProfileData };
              setUser(appUser);
              // Redirection is handled by the form component upon successful signup promise resolution
              
            } catch (error: any) {
              console.error("[AuthContext] FAILED to create Firestore doc from temp data:", error);
              toast({ title: "Profile Creation Failed", description: "Your account was created, but we couldn't save your profile. Please contact support.", variant: "destructive" });
              await signOut(auth); // Log out to prevent inconsistent state
            }
          } else {
            // User is authenticated, no profile doc, and no temp data. This is an error state.
            console.warn(`[AuthContext] User ${firebaseUser.uid} authenticated, but no Firestore doc or temp data found. Logging out.`);
            await signOut(auth);
          }
        }
      } else {
        console.log(`[AuthContext] onAuthStateChanged: No user is authenticated.`);
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
    console.log(`[AuthContext] Starting signup for email: ${data.email}`);
    try {
      // Step 1: Store profile data temporarily.
      const profileData = {
        name: data.name,
        role: data.role,
        ageGroup: data.ageGroup,
        status: data.status || 'niet geverifieerd',
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
      };
      localStorage.setItem(TEMP_PROFILE_KEY, JSON.stringify(profileData));
      console.log(`[AuthContext] Step 1 (Signup): Temp profile data stored in localStorage.`);

      // Step 2: Create the user in Firebase Auth. This will trigger onAuthStateChanged to create the doc.
      console.log(`[AuthContext] Step 2 (Signup): Attempting createUserWithEmailAndPassword.`);
      await createUserWithEmailAndPassword(auth, data.email, data.pass);
      console.log(`[AuthContext] Step 2 SUCCESS. Firebase user created. onAuthStateChanged will handle doc creation.`);
      
      return { success: true };
    } catch (error: any) {
      localStorage.removeItem(TEMP_PROFILE_KEY); // Clean up on failure
      console.error("[AuthContext] Signup Error:", error);
      let friendlyError = "Er is een onbekende fout opgetreden.";
      if (error.code === 'auth/email-already-in-use') {
        friendlyError = "Dit e-mailadres is al in gebruik.";
      }
      return { success: false, error: friendlyError };
    }
  }, []);

  const login = useCallback(async (email: string, pass: string): Promise<boolean> => {
    if (!isFirebaseConfigured || !auth) {
      toast({ title: "Configuratie Fout", description: "Firebase is niet geconfigureerd.", variant: "destructive" });
      return false;
    }
    setIsLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, pass);
      // onAuthStateChanged will handle setting user and redirecting.
      return true;
    } catch (error: any) {
      console.error("Firebase Login Error:", error);
      toast({ title: "Inloggen Mislukt", description: "De combinatie van e-mail en wachtwoord is onjuist.", variant: "destructive" });
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
