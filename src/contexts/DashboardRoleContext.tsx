// src/contexts/DashboardRoleContext.tsx
"use client";

import type { ReactNode, Dispatch, SetStateAction } from 'react';
import { createContext, useContext, useState } from 'react';

export type UserRoleType = 'admin' | 'leerling' | 'tutor' | 'ouder' | 'coach'; // Added 'coach'

interface DashboardRoleContextType {
  currentDashboardRole: UserRoleType;
  setCurrentDashboardRole: Dispatch<SetStateAction<UserRoleType>>;
}

const DashboardRoleContext = createContext<DashboardRoleContextType | undefined>(undefined);

export function DashboardRoleProvider({ children }: { children: ReactNode }) {
  const [currentDashboardRole, setCurrentDashboardRole] = useState<UserRoleType>('leerling'); // Default naar 'leerling'
  return (
    <DashboardRoleContext.Provider value={{ currentDashboardRole, setCurrentDashboardRole }}>
      {children}
    </DashboardRoleContext.Provider>
  );
}

export function useDashboardRole() {
  const context = useContext(DashboardRoleContext);
  if (context === undefined) {
    throw new Error('useDashboardRole must be used within a DashboardRoleProvider');
  }
  return context;
}
