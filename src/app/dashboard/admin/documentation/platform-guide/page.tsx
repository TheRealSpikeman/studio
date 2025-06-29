// src/app/dashboard/admin/documentation/platform-guide/page.tsx
"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, BookUser } from '@/lib/icons';

export default function PlatformGuidePage() {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
          <BookUser className="h-8 w-8 text-primary" />
          Platform Handleiding (Admin)
        </h1>
        <Button variant="outline" asChild>
          <Link href="/dashboard/admin/documentation">
            <ArrowLeft className="mr-2 h-4 w-4" /> Terug naar Documentatie
          </Link>
        </Button>
      </div>

      <p className="text-lg text-muted-foreground">
        Welkom bij de handleiding voor beheerders. Deze pagina is momenteel een placeholder en zal in de toekomst worden uitgebreid met gedetailleerde informatie over alle platformfunctionaliteiten.
      </p>

      <div className="p-6 bg-muted rounded-lg">
          <h2 className="text-xl font-semibold mb-2">In ontwikkeling</h2>
          <p className="text-muted-foreground">
              De uitgebreide handleiding wordt momenteel geschreven. Kom binnenkort terug voor meer details.
          </p>
      </div>
    </div>
  );
}
