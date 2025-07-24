// src/contexts/AuthContext.tsx
"use client";

import type { ReactNode } from 'react';
import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  sendEmailVerification,
  GoogleAuthProvider,
  OAuthProvider, // Import OAuthProvider for Apple
  signInWithPopup,
  type Auth,
  type User as FirebaseUser 
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db, isFirebaseConfigured } from '@/lib/firebase';
import type { User, UserRole, UserStatus } from '@/types/user';
import { useToast } from '@/hooks/use-toast';

export interface SignupData {
  email: string;
  pass: string;
  name: string;
  role: UserRole;
  ageGroup?: '12-14' | '15-18' | 'adult';
  status?: UserStatus;
  parentEmail?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isFirebaseConfigured: boolean;
  auth: Auth | null;
  isLoggingOut: boolean; // Add isLoggingOut
  login: (email: string, pass: string) => Promise<boolean>;
  loginWithGoogle: () => Promise<boolean>;
  loginWithApple: () => Promise<boolean>;
  signup: (data: SignupData) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TEMP_PROFILE_KEY = 'mindnavigator_temp_profile';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false); // New state for logout process
  const router = useRouter();
  const { toast } = useToast();
  
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
      if(auth) await signOut(auth);
    }
  }, [toast, auth]);

  useEffect(() => {
    if (!isFirebaseConfigured || !auth || !db) {
      console.warn("[AuthContext] Firebase not configured. Halting auth listener.");
      setIsLoading(false);
      return;
    }

    console.log("[AuthContext] Setting up onAuthStateChanged listener...");
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      console.log(`[AuthContext] onAuthStateChanged triggered. Firebase User:`, firebaseUser);
      if (firebaseUser) {
        await fetchAndSetUser(firebaseUser);
      } else {
        console.log(`[AuthContext] No user authenticated.`);
        setUser(null);
        setIsLoggingOut(false); // If user is null, they are definitely not in the process of logging out anymore.
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

  const signup = useCallback(async (data: SignupData): Promise<{ success: boolean; error?: string }> => {
    if (!isFirebaseConfigured || !auth || !db) {
      console.error("[AuthContext] Signup failed: Firebase not configured.");
      return { success: false, error: "Firebase is niet geconfigureerd." };
    }
    
    const needsParentalApproval = data.role === 'leerling' && data.parentEmail;
    
    const profileData = {
      name: data.name,
      role: data.role,
      ageGroup: data.ageGroup,
      status: needsParentalApproval ? 'wacht_op_ouder_goedkeuring' as UserStatus : 'niet geverifieerd' as UserStatus,
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
    };
    
    // For email/pass, we save temp data to localStorage to be picked up by onAuthStateChanged
    localStorage.setItem(TEMP_PROFILE_KEY, JSON.stringify(profileData));
    
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.pass);
      
      // onAuthStateChanged will now create the user document, but we still need to send the email.
      if (needsParentalApproval && data.parentEmail) {
        console.log(`SIMULATING: Sending approval request to ${data.parentEmail} for teen ${data.email}`);
      } else {
        await sendEmailVerification(userCredential.user);
      }
      
      return { success: true };
    } catch (error: any) {
      localStorage.removeItem(TEMP_PROFILE_KEY);
      let friendlyError = "Er is een onbekende fout opgetreden.";
      if (error.code === 'auth/email-already-in-use') {
        friendlyError = "Dit e-mailadres is al in gebruik.";
      }
      return { success: false, error: friendlyError };
    }
  }, [toast]);

  const login = useCallback(async (email: string, pass: string): Promise<boolean> => {
    if (!isFirebaseConfigured || !auth) {
      toast({ title: "Configuratie Fout", description: "Firebase is niet geconfigureerd.", variant: "destructive" });
      return false;
    }
    try {
      await signInWithEmailAndPassword(auth, email, pass);
      // Let onAuthStateChanged handle setting user, then dashboard router will redirect.
      router.push('/dashboard/');
      return true;
    } catch (error: any) {
      console.error("Firebase Login Error:", error);
      toast({ title: "Inloggen Mislukt", description: "De combinatie van e-mail en wachtwoord is onjuist.", variant: "destructive" });
      return false;
    }
  }, [toast, router]);

  const handleSocialLogin = useCallback(async (provider: GoogleAuthProvider | OAuthProvider): Promise<boolean> => {
    if (!isFirebaseConfigured || !auth || !db) {
        toast({ title: "Configuratie Fout", description: "Firebase is niet geconfigureerd.", variant: "destructive" });
        return false;
    }
    try {
        const result = await signInWithPopup(auth, provider);
        const firebaseUser = result.user;

        const userDocRef = doc(db, "users", firebaseUser.uid);
        const userDocSnap = await getDoc(userDocRef);
        
        if (!userDocSnap.exists()) {
            await signOut(auth);
            toast({
                title: "Account niet gevonden",
                description: "Gebruik alstublieft de aanmeldpagina om een nieuw account aan te maken. U kunt daarna inloggen met deze methode.",
                variant: "destructive",
                duration: 8000
            });
            router.push('/signup');
            return false;
        }
        
        router.push('/dashboard/');
        return true;

    } catch (error: any) {
        console.error("Firebase Social Login Error:", error);
        let description = "Kon niet inloggen. Probeer het opnieuw.";
        if (error.code === 'auth/popup-closed-by-user') {
            description = "Het inloggen via de pop-up is geannuleerd.";
        } else if (error.code === 'auth/account-exists-with-different-credential') {
            description = "Er bestaat al een account met dit e-mailadres via een andere methode (bijv. e-mail/wachtwoord). Probeer op die manier in te loggen.";
        }
        toast({ title: "Social Login Mislukt", description, variant: "destructive", duration: 7000 });
        return false;
    }
  }, [toast, router]);
  
  const loginWithGoogle = useCallback(() => handleSocialLogin(new GoogleAuthProvider()), [handleSocialLogin]);
  const loginWithApple = useCallback(() => {
    const provider = new OAuthProvider('apple.com');
    provider.addScope('email');
    provider.addScope('name');
    return handleSocialLogin(provider);
  }, [handleSocialLogin]);


  const logout = useCallback(async () => {
    setIsLoggingOut(true); 
    if (auth) {
      await signOut(auth);
      router.replace('/');
    }
    setIsLoggingOut(false);
  }, [router, auth]);

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    isFirebaseConfigured,
    auth,
    isLoggingOut,
    login,
    loginWithGoogle,
    loginWithApple,
    signup,
    logout,
    refreshUser
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
