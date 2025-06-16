// src/contexts/DashboardRoleContext.tsx
"use client";

import type { ReactNode, Dispatch, SetStateAction } from 'react';
import { createContext, useContext, useState } from 'react';

// Definieer UserRoleType hier als het niet gemakkelijk geëxporteerd kan worden
// of als het nog niet bestaat in een gedeeld types bestand.
export type UserRoleType = 'admin' | 'user' | 'tutor';

interface DashboardRoleContextType {
  currentDashboardRole: UserRoleType;
  setCurrentDashboardRole: Dispatch<SetStateAction<UserRoleType>>;
}

const DashboardRoleContext = createContext<DashboardRoleContextType | undefined>(undefined);

export function DashboardRoleProvider({ children }: { children: ReactNode }) {
  const [currentDashboardRole, setCurrentDashboardRole] = useState<UserRoleType>('user'); // Default naar 'user'
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
