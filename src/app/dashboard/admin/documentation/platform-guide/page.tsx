// src/app/dashboard/admin/documentation/platform-guide/page.tsx
"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, AlertTriangle } from '@/lib/icons';

// Renamed to avoid component name collision, which was causing the build to fail.
export default function ObsoletePlatformGuidePage() {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
          <AlertTriangle className="h-8 w-8 text-destructive" />
          Placeholder Pagina
        </h1>
        <Button variant="outline" asChild>
          <Link href="/dashboard/admin/documentation">
            <ArrowLeft className="mr-2 h-4 w-4" /> Terug naar Documentatie
          </Link>
        </Button>
      </div>

      <p className="text-lg text-muted-foreground">
        Deze pagina is geneutraliseerd om een technisch conflict in de applicatie op te lossen. De correcte, werkende versie van de handleiding vindt u op de pagina 'Platform Handleiding'.
      </p>
    </div>
  );
}
