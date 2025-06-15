// src/app/dashboard/community/page.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { MessagesSquare, Users } from 'lucide-react';

export default function CommunityPage() {
  return (
    <div className="space-y-8">
      <section className="text-center">
        <MessagesSquare className="mx-auto h-16 w-16 text-primary mb-4" />
        <h1 className="text-3xl font-bold text-foreground">Community Forum</h1>
        <p className="text-lg text-muted-foreground mt-2">
          Maak contact, deel ervaringen en leer van anderen.
        </p>
      </section>

      <Card className="shadow-lg max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-6 w-6 text-accent" />
            Binnenkort beschikbaar!
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            We werken hard aan een veilige en ondersteunende community-omgeving waar je in contact kunt komen met andere MindNavigator gebruikers.
            Hier kun je binnenkort:
          </p>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground pl-5">
            <li>Ervaringen en tips uitwisselen.</li>
            <li>Vragen stellen aan elkaar en aan coaches (indien van toepassing).</li>
            <li>Deelnemen aan groepsdiscussies over relevante thema's.</li>
            <li>Ondersteuning vinden en bieden.</li>
          </ul>
          <p className="mt-6 font-semibold text-foreground">
            Houd deze pagina in de gaten voor updates!
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
