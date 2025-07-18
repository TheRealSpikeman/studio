// src/components/providers/AppProviders.tsx
"use client";

import type { ReactNode } from 'react';
import { AuthProvider } from '@/app/contexts/AuthContext';
import { TooltipProvider } from '@/components/ui/tooltip';

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <TooltipProvider>
        {children}
      </TooltipProvider>
    </AuthProvider>
  );
}
