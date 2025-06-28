
// src/app/dashboard/admin/settings/personas/page.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Info, ArrowRight } from "lucide-react";
import Link from 'next/link';

export default function ObsoletePersonaPage() {
  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
             <Info className="h-8 w-8 text-primary" />
            <CardTitle>Deze pagina is verplaatst</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <CardDescription>
            Het beheer van AI Personas is nu onderdeel van de Documentatie sectie, om een duidelijker overzicht te geven van de content-gerelateerde configuraties.
          </CardDescription>
          <Button asChild>
            <Link href="/dashboard/admin/documentation/ai-persona">
              Ga naar de nieuwe AI Persona pagina <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
