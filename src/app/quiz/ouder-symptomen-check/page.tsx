
"use client";

import { Button } from '@/components/ui/button';
import { SiteLogo } from '@/components/common/site-logo';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function OuderSymptomenCheckContent() {
  const searchParams = useSearchParams();
  const kindId = searchParams.get('kindId');

  return (
    <Card className="w-full max-w-2xl text-center shadow-xl">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-foreground">"Ken je Kind" Vragenlijst (voor Ouders)</CardTitle>
        <CardDescription className="text-base">
          Deze vragenlijst is bedoeld om u te helpen reflecteren op observaties over uw kind. Dit is geen diagnostisch instrument, maar kan richting geven.
        </CardDescription>
      </CardHeader>
      <CardContent className="text-left">
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-md mb-6">
              <div className="flex">
                  <div className="flex-shrink-0">
                  <AlertTriangle className="h-6 w-6 text-yellow-700" />
                  </div>
                  <div className="ml-3">
                  <h3 className="text-md font-semibold text-yellow-800">Momenteel in Ontwikkeling</h3>
                  <div className="mt-1 text-sm text-yellow-700">
                      <p>De daadwerkelijke vragen en logica voor deze "Ken je Kind" test worden nog ontwikkeld. De onderstaande interface is een placeholder.</p>
                      <p className="mt-1">U kunt hieronder klikken om te zien hoe de resultatenpagina eruit zou kunnen zien.</p>
                  </div>
                  </div>
              </div>
          </div>
        
        <p className="text-muted-foreground mb-2 text-center">
          Voorbeeldvraag 1: Hoe vaak heeft uw kind moeite met het starten van taken die minder direct boeiend zijn?
        </p>
        <div className="text-center mb-6">
          <Button variant="outline" className="mr-2" disabled>Nooit</Button>
          <Button variant="outline" className="mr-2" disabled>Soms</Button>
          <Button variant="outline" className="mr-2" disabled>Vaak</Button>
          <Button variant="outline" disabled>Altijd</Button>
        </div>

        <p className="text-muted-foreground mb-6 text-center">
          Na het beantwoorden van ongeveer 10-15 van dit soort vragen, krijgt u een overzicht met mogelijke aandachtspunten en tips.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild className="w-full sm:w-auto">
              <Link href={`/quiz/ouder-symptomen-check/results?kindId=${kindId || ''}`}>Bekijk Voorbeeld Resultaten (Demo)</Link>
          </Button>
          <Button asChild variant="outline" className="w-full sm:w-auto">
              <Link href="/dashboard/ouder/welcome">Terug naar Dashboard</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default function OuderSymptomenCheckPage() {
  return (
    <Suspense fallback={<div>Pagina laden...</div>}>
      <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-primary/5 via-background to-accent/5 p-4 pt-16 md:pt-24 pb-16">
        <div className="absolute top-8 left-8">
          <SiteLogo />
        </div>
        <OuderSymptomenCheckContent />
      </div>
    </Suspense>
  );
}
