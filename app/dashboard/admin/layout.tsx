// src/app/dashboard/admin/layout.tsx
"use client";

import { useAuth } from '@/contexts/AuthContext';
import { Loader2, ShieldAlert } from '@/lib/icons';
import type { ReactNode } from 'react';

export default function AdminDashboardLayout({ children }: { children: ReactNode }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center p-8">
        <Loader2 className="h-6 w-6 animate-spin mr-3" />
        <p>Admin-toegang controleren...</p>
      </div>
    );
  }

  if (user?.role !== 'admin') {
    return (
       <div className="flex h-full w-full items-center justify-center p-8">
         <div className="text-center">
            <ShieldAlert className="mx-auto h-12 w-12 text-destructive mb-4" />
            <h2 className="text-xl font-bold text-destructive">Geen Toegang</h2>
            <p className="text-muted-foreground">U heeft geen rechten om deze pagina te bekijken.</p>
         </div>
      </div>
    );
  }

  // If user is admin, render the children (the actual page content)
  return <>{children}</>;
}
