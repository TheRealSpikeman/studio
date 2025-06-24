// src/app/dashboard/admin/layout.tsx
"use client"; // Make it a client component

import type { ReactNode } from 'react';
import { useDashboardRole } from '@/contexts/DashboardRoleContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function AdminDashboardLayout({ children }: { children: ReactNode }) {
  const { currentDashboardRole } = useDashboardRole();

  if (currentDashboardRole !== 'admin') {
    return (
      <div className="flex items-center justify-center p-8">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <AlertTriangle className="mx-auto h-12 w-12 text-destructive mb-4" />
            <CardTitle className="text-2xl">Geen Toegang</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              U heeft geen rechten om deze pagina te bekijken. Deze sectie is alleen voor administrators.
            </p>
            <Button asChild className="mt-6">
              <Link href="/dashboard">Terug naar mijn dashboard</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // If the role is admin, render the children as normal.
  return <>{children}</>;
}
