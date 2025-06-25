// src/contexts/AuthContext.tsx
"use client";

import type { ReactNode, Dispatch, SetStateAction } from 'react';
import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { User, UserRoleType } from '@/types/user';
import { useRouter } from 'next/navigation';

// Dummy users for demo purposes
const DUMMY_USERS: Record<string, Omit<User, 'id' | 'createdAt' | 'lastLogin'>> = {
  'leerling@example.com': { name: 'Alex Leerling', email: 'leerling@example.com', role: 'leerling', status: 'actief', ageGroup: '15-18' },
  'ouder@example.com': { name: 'Olivia Ouder', email: 'ouder@example.com', role: 'ouder', status: 'actief' },
  'tutor@example.com': { name: 'Thomas Tutor', email: 'tutor@example.com', role: 'tutor', status: 'actief' },
  'coach@example.com': { name: 'Carla Coach', email: 'coach@example.com', role: 'coach', status: 'actief' },
  'admin@example.com': { name: 'Adam Admin', email: 'admin@example.com', role: 'admin', status: 'actief' },
};

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<boolean>;
  logout: () => void;
  // This can replace the role switcher for demo purposes
  switchUserRole: (role: UserRoleType) => void; 
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USER_STORAGE_KEY = 'mindnavigator_session_user';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // On mount, try to load user from localStorage to persist session
    try {
      const storedUser = localStorage.getItem(USER_STORAGE_KEY);
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (e) {
      console.error("Failed to load user from storage", e);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateUserInStorage = (newUser: User | null) => {
    setUser(newUser);
    if (newUser) {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(newUser));
    } else {
      localStorage.removeItem(USER_STORAGE_KEY);
    }
  };

  const login = useCallback(async (email: string, pass: string): Promise<boolean> => {
    // In a real app, this would be an API call.
    // Here, we simulate it.
    const foundUser = DUMMY_USERS[email.toLowerCase()];
    if (foundUser && pass === 'password') { // Using a simple password for demo
      const loggedInUser: User = {
        id: `user-${Math.random()}`,
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
        ...foundUser,
      };
      updateUserInStorage(loggedInUser);
      router.push('/dashboard');
      return true;
    }
    return false;
  }, [router]);

  const logout = useCallback(() => {
    updateUserInStorage(null);
    router.push('/login');
  }, [router]);
  
  // Keep this for the demo to easily switch between dashboards
  const switchUserRole = useCallback((role: UserRoleType) => {
      const emailForRole = `${role}@example.com`;
      const userToSwitchTo = DUMMY_USERS[emailForRole];
      if(userToSwitchTo) {
         const switchedUser: User = {
            id: user?.id || `user-${Math.random()}`,
            createdAt: user?.createdAt || new Date().toISOString(),
            lastLogin: new Date().toISOString(),
            ...userToSwitchTo,
         };
         updateUserInStorage(switchedUser);
         router.push(`/dashboard/${role}`);
      }
  }, [user, router]);

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    switchUserRole,
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
