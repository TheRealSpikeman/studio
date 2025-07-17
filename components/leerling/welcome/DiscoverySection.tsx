// src/components/leerling/welcome/DiscoverySection.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Compass, Lightbulb, Rocket } from '@/lib/icons';

export function DiscoverySection() {
  return (
    <div className="text-left mb-10">
      <h2 className="text-2xl font-semibold text-foreground text-center mb-6">Wat ga je ontdekken?</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <Card className="bg-card border shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg text-primary">
              <Compass className="h-6 w-6"/> Jouw Denkstijl
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            <p>Verken hoe jij informatie verwerkt en de wereld ziet.</p>
            <p className="text-xs italic mt-2">Voorbeeldvragen: "Krijg je energie van drukte of juist van rust? Ben je een snelle beslisser of denk je liever lang na?"</p>
          </CardContent>
        </Card>

        <Card className="bg-card border shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg text-primary">
              <Lightbulb className="h-6 w-6"/> Sterktes & Uitdagingen
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            <p>Leer waar je van nature goed in bent en waar je misschien wat extra ondersteuning kunt gebruiken.</p>
            <p className="text-xs italic mt-2">Voorbeeld: Ontdek of je een 'creatieve dromer' bent die soms moeite heeft met plannen.</p>
          </CardContent>
        </Card>

        <Card className="bg-card border shadow-sm">
          <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg text-primary">
              <Rocket className="h-6 w-6"/> Jouw Persoonlijke Toolkit
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            <p>Na de quiz krijg je toegang tot tools die bij jou passen.</p>
            <p className="text-xs italic mt-2">Denk aan: een <strong className="text-foreground">Focus Timer</strong>, een <strong className="text-foreground">Mood Tracker</strong> of <strong className="text-foreground">Relaxatie Oefeningen</strong>.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
