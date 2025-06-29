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
      console.warn("[AuthContext] Firebase not configured. Halting auth listener.");
      setIsLoading(false);
      return;
    }

    console.log("[AuthContext] Setting up onAuthStateChanged listener...");
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      console.log(`[AuthContext] onAuthStateChanged triggered. Firebase User:`, firebaseUser);
      if (firebaseUser) {
        const userDocRef = doc(db, "users", firebaseUser.uid);
        console.log(`[AuthContext] User is authenticated. Checking Firestore for doc:`, userDocRef.path);
        
        try {
          const userDocSnap = await getDoc(userDocRef);

          if (userDocSnap.exists()) {
            console.log(`[AuthContext] Existing user doc found for ${firebaseUser.uid}.`);
            const userDataFromDb = userDocSnap.data() as Omit<User, 'id'>;
            const appUser: User = {
              id: firebaseUser.uid,
              ...userDataFromDb, // Spread DB data first
              email: firebaseUser.email || userDataFromDb.email, // Then ensure email from auth takes precedence
            };
            setUser(appUser);
            // Don't await this, let it run in the background
            updateDoc(userDocRef, { lastLogin: new Date().toISOString() });
          } else {
            console.log(`[AuthContext] User doc NOT found for ${firebaseUser.uid}. Checking for signup method...`);
            const tempProfileRaw = localStorage.getItem(TEMP_PROFILE_KEY);
            
            if (tempProfileRaw) {
              // User signed up with email/password, create their doc
              console.log(`[AuthContext] Temp profile data FOUND. Creating Firestore document for email signup...`);
              const profileDataToSet = JSON.parse(tempProfileRaw);
              localStorage.removeItem(TEMP_PROFILE_KEY);

              const finalProfileData = {
                ...profileDataToSet,
                email: firebaseUser.email, // Always use the email from the authenticated user
              };
              await setDoc(userDocRef, finalProfileData);
              console.log(`[AuthContext] Firestore document created successfully for ${firebaseUser.uid}.`);
              const appUser: User = { id: firebaseUser.uid, ...finalProfileData };
              setUser(appUser);
            } else {
              // This is an unprovisioned user (e.g., social login without a profile, or some other edge case).
              // We sign them out to force them through a proper signup or login flow.
              console.warn(`[AuthContext] User ${firebaseUser.uid} authenticated, but no doc and no signup data found. Logging out.`);
              await signOut(auth);
            }
          }
        } catch (error) {
            console.error("[AuthContext] CRITICAL ERROR during user document fetch/create:", error);
            toast({ title: "Fout bij profiel laden", description: `Kon gebruikersprofiel niet ophalen of aanmaken. Fout: ${(error as Error).message}`, variant: "destructive", duration: 10000 });
            await signOut(auth);
        }
      } else {
        console.log(`[AuthContext] No user authenticated.`);
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [toast, router]); // Corrected dependency array

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
      
      if (needsParentalApproval && data.parentEmail) {
        // Send approval request email (simulated)
        console.log(`SIMULATING: Sending approval request to ${data.parentEmail} for teen ${data.email}`);
        // In a real app, you would call a backend function here to send a templated email.
        // The email would contain a link like: `/parental-approval?token=...&teenEmail=...`
      } else {
        // Standard verification for users who don't need parental approval
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
      router.push('/dashboard');
      return true;
    } catch (error: any) {
      console.error("Firebase Login Error:", error);
      toast({ title: "Inloggen Mislukt", description: "De combinatie van e-mail en wachtwoord is onjuist.", variant: "destructive" });
      return false;
    }
  }, [toast, router]);

  const socialLoginHandler = useCallback(async (provider: GoogleAuthProvider | OAuthProvider): Promise<boolean> => {
    if (!isFirebaseConfigured || !auth || !db) {
        toast({ title: "Configuratie Fout", description: "Firebase is niet geconfigureerd.", variant: "destructive" });
        return false;
    }
    try {
        const result = await signInWithPopup(auth, provider);
        const firebaseUser = result.user;
        
        // Check if user document exists
        const userDocRef = doc(db, "users", firebaseUser.uid);
        const userDocSnap = await getDoc(userDocRef);
        
        if (!userDocSnap.exists()) {
            // User does not have a profile in our database. This is an invalid login attempt.
            await signOut(auth); // Sign them out immediately.
            toast({
                title: "Account niet gevonden",
                description: "Gebruik alstublieft de aanmeldpagina om een nieuw account aan te maken. U kunt daarna inloggen met deze methode.",
                variant: "destructive",
                duration: 8000
            });
            router.push('/signup'); // Guide them to the correct flow.
            return false;
        }
        
        // If we are here, the user exists. The onAuthStateChanged listener will handle the rest.
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
      await signOut(auth);
    }
    setUser(null);
    router.push('/login');
  }, [router]);

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
