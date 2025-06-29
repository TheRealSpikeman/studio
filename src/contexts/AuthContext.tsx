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
import type { User, UserRoleType, UserStatus } from '@/types/user';
import { useToast } from '@/hooks/use-toast';

export interface SignupData {
  email: string;
  pass: string;
  name: string;
  role: UserRoleType;
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
  login: (email: string, pass: string) => Promise<boolean>;
  loginWithGoogle: () => Promise<boolean>;
  loginWithApple: () => Promise<boolean>;
  signup: (data: SignupData) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TEMP_PROFILE_KEY = 'mindnavigator_temp_profile';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    if (!isFirebaseConfigured || !auth || !db) {
      console.log("[Auth Log] Firebase not configured. Auth flow stopped. isLoading: false");
      setIsLoading(false);
      return;
    }

    console.log("[Auth Log] Setting up onAuthStateChanged listener...");
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      console.log(`[Auth Log] onAuthStateChanged triggered. User: ${firebaseUser ? firebaseUser.uid : 'null'}`);
      
      try {
        if (firebaseUser) {
          const userDocRef = doc(db, "users", firebaseUser.uid);
          console.log(`[Auth Log] User authenticated. Checking Firestore doc: ${userDocRef.path}`);
          
          const userDocSnap = await getDoc(userDocRef);

          if (userDocSnap.exists()) {
            const userDataFromDb = userDocSnap.data() as Omit<User, 'id'>;
            console.log(`[Auth Log] Existing user doc found. Role: ${userDataFromDb.role}`);
            const appUser: User = {
              id: firebaseUser.uid,
              ...userDataFromDb,
              email: firebaseUser.email || userDataFromDb.email,
            };
            setUser(appUser);
            updateDoc(userDocRef, { lastLogin: new Date().toISOString() }).catch(e => console.error("[Auth Log] Failed to update last login", e));
          } else {
            console.warn(`[Auth Log] User doc NOT found for ${firebaseUser.uid}. Checking for temp profile data...`);
            const tempProfileRaw = localStorage.getItem(TEMP_PROFILE_KEY);
            
            if (tempProfileRaw) {
              console.log(`[Auth Log] Temp profile data FOUND. Creating Firestore document...`);
              const profileDataToSet = JSON.parse(tempProfileRaw);
              localStorage.removeItem(TEMP_PROFILE_KEY);

              const finalProfileData = { ...profileDataToSet, email: firebaseUser.email };
              await setDoc(userDocRef, finalProfileData);
              console.log(`[Auth Log] Firestore document created successfully for ${firebaseUser.uid}. Role: ${finalProfileData.role}`);
              const appUser: User = { id: firebaseUser.uid, ...finalProfileData };
              setUser(appUser);
            } else {
              console.error(`[Auth Log] CRITICAL: User ${firebaseUser.uid} authenticated, but no doc and no temp signup data. Forcing logout.`);
              await signOut(auth);
            }
          }
        } else {
          console.log(`[Auth Log] No user authenticated. Setting user to null.`);
          setUser(null);
        }
      } catch (error) {
          console.error("[Auth Log] CRITICAL ERROR during user document fetch/create:", error);
          toast({ title: "Fout bij profiel laden", description: `Kon gebruikersprofiel niet ophalen of aanmaken. Fout: ${(error as Error).message}`, variant: "destructive", duration: 10000 });
          if(auth) await signOut(auth);
          setUser(null);
      } finally {
          console.log("[Auth Log] Auth state resolved. Setting isLoading to false.");
          setIsLoading(false);
      }
    });

    return () => {
      console.log("[Auth Log] Cleaning up onAuthStateChanged listener.");
      unsubscribe();
    };
  }, [auth, db, isFirebaseConfigured, toast, router]); // Correct dependency array

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
    
    localStorage.setItem(TEMP_PROFILE_KEY, JSON.stringify(profileData));
    
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.pass);
      
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
      // Let onAuthStateChanged handle user state and redirection
      return true;
    } catch (error: any) {
      console.error("Firebase Login Error:", error);
      toast({ title: "Inloggen Mislukt", description: "De combinatie van e-mail en wachtwoord is onjuist.", variant: "destructive" });
      return false;
    }
  }, [toast]);

  const socialLoginHandler = useCallback(async (provider: GoogleAuthProvider | OAuthProvider): Promise<boolean> => {
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
        
        router.push('/dashboard');
        return true;

    } catch (error: any) {
        console.error("Firebase Social Login Error:", error);
        let description = "Kon niet inloggen. Probeer het opnieuw.";
         if (error.code === 'auth/account-exists-with-different-credential') {
            description = "Er bestaat al een account met dit e-mailadres via een andere methode (bijv. e-mail/wachtwoord). Probeer op die manier in te loggen.";
        } else if (error.code === 'auth/popup-blocked') {
            description = "De pop-up werd geblokkeerd door de browser. Sta pop-ups voor deze site toe en probeer het opnieuw.";
        }
        toast({ title: "Social Login Mislukt", description, variant: "destructive", duration: 7000 });
        return false;
    }
  }, [toast, router]);
  
  const loginWithGoogle = useCallback(() => socialLoginHandler(new GoogleAuthProvider()), [socialLoginHandler]);
  const loginWithApple = useCallback(() => {
    const provider = new OAuthProvider('apple.com');
    provider.addScope('email');
    provider.addScope('name');
    return socialLoginHandler(provider);
  }, [socialLoginHandler]);


  const logout = useCallback(async () => {
    if (auth) {
      console.log(`[Auth Log] Logging out user...`);
      await signOut(auth);
    }
    setUser(null);
    router.push('/login');
  }, [router, auth]);

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    isFirebaseConfigured,
    auth,
    login,
    loginWithGoogle,
    loginWithApple,
    signup,
    logout,
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
