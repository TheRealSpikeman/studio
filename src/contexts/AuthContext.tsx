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

// A list of known demo users.
const DEMO_USERS: Omit<User, 'id' | 'lastLogin' | 'createdAt'>[] = [
  { email: 'admin@example.com', name: 'Admin User', role: 'admin', status: 'actief' },
  { email: 'leerling@example.com', name: 'Leerling User', role: 'leerling', status: 'actief', ageGroup: '15-18' },
  { email: 'ouder@example.com', name: 'Ouder User', role: 'ouder', status: 'actief' },
  { email: 'tutor@example.com', name: 'Tutor User', role: 'tutor', status: 'actief' },
  { email: 'coach@example.com', name: 'Coach User', role: 'coach', status: 'actief' },
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
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
      return { success: false, error: "Firebase is not configured." };
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
      console.error("Signup Error:", error.code);
      return { success: false, error: error.code };
    }
  }, []);

  const login = useCallback(async (email: string, pass: string): Promise<boolean> => {
    if (!isFirebaseConfigured || !auth) {
        return false;
    }
    setIsLoading(true);

    try {
        await signInWithEmailAndPassword(auth, email, pass);
        return true; // Success, onAuthStateChanged will handle the rest
    } catch (error: any) {
        const demoUserConfig = DEMO_USERS.find(u => u.email === email);

        // Self-healing logic for demo users that have been deleted
        if (demoUserConfig && error.code === 'auth/user-not-found') {
            console.log(`Demo user ${email} not found. Attempting to create...`);
            const signupResult = await signup({
                email: demoUserConfig.email,
                pass: 'password', // Always create with the default password
                name: demoUserConfig.name,
                role: demoUserConfig.role,
                ageGroup: demoUserConfig.ageGroup,
                status: 'actief'
            });

            if (signupResult.success) {
                console.log(`Demo user ${email} created. Now logging in with the password you provided...`);
                // Attempt to login again with the password the user actually typed.
                // This allows them to use 'password' and have it work seamlessly.
                try {
                    await signInWithEmailAndPassword(auth, email, pass);
                    return true;
                } catch (secondError: any) {
                    console.error("Second login attempt failed after auto-creation:", secondError.code);
                    setIsLoading(false);
                    return false;
                }
            } else {
                console.error(`Failed to auto-create demo user ${email}. Error: ${signupResult.error}`);
            }
        }
        
        if (error.code === 'auth/invalid-credential') {
             toast({
                title: "Wachtwoord Onjuist",
                description: `Het account ${email} bestaat, maar het wachtwoord is incorrect. Gebruik de 'Invalid Credential' Fix Guide hieronder of reset uw wachtwoord.`,
                variant: "destructive",
                duration: 8000,
            });
        }
        
        console.error("Firebase Login Error:", error.code);
        setIsLoading(false);
        return false;
    }
  }, [signup, toast]);

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
