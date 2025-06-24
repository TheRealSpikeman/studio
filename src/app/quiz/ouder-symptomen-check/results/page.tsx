
"use client";

import { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { SiteLogo } from '@/components/common/site-logo';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { FileText, Lightbulb, Users, Download, ArrowRight, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

function OuderSymptomenCheckResultsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const kindId = searchParams.get('kindId');

  const handleSaveAndReturn = () => {
    if (!kindId) {
        toast({ title: "Fout", description: "Kon kind ID niet vinden. Terug naar dashboard.", variant: "destructive" });
        router.push('/dashboard/ouder/kinderen');
        return;
    }
    const summary = "Ouder observeert dat het kind soms moeite heeft met starten aan taken, maar zeer creatief en rechtvaardig is. Gevoeligheid voor drukte is ook een aandachtspunt.";
    try {
        localStorage.setItem(`parentObservation_${kindId}`, summary);
        toast({ title: "Resultaten Opgeslagen", description: "De observaties zijn opgeslagen. U wordt teruggestuurd." });
        router.push(`/dashboard/ouder/kinderen/${kindId}/voortgang`);
    } catch (e) {
        toast({ title: "Opslagfout", description: "Kon de resultaten niet in uw browser opslaan.", variant: "destructive" });
        console.error(e);
    }
  };

  return (
    <Card className="w-full max-w-2xl text-center shadow-xl">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-foreground">Resultaten "Ken je Kind" Vragenlijst</CardTitle>
        <CardDescription className="text-base">
          Dit is een voorlopig overzicht op basis van uw ingevulde observaties.
        </CardDescription>
      </CardHeader>
      <CardContent className="text-left space-y-4">
          <div className="p-4 border rounded-md bg-muted/50">
              <h3 className="font-semibold text-lg text-primary flex items-center gap-2"><FileText className="h-5 w-5"/>Algemene Samenvatting (Voorbeeld)</h3>
              <p className="text-sm text-muted-foreground mt-1">
                  Op basis van uw antwoorden lijkt uw kind mogelijk kenmerken te vertonen die wijzen op een voorkeur voor duidelijke structuur en een gevoeligheid voor veel prikkels. Ook lijkt er een patroon te zijn in het uitstellen van taken die minder direct boeiend zijn.
              </p>
          </div>
           <div className="p-4 border rounded-md bg-muted/50">
              <h3 className="font-semibold text-lg text-primary flex items-center gap-2"><Lightbulb className="h-5 w-5"/>Mogelijke Aandachtspunten & Tips (Voorbeeld)</h3>
              <ul className="list-disc list-inside text-sm text-muted-foreground mt-1 space-y-1 pl-2">
                  <li><strong>Structuur & Routine:</strong> Overweeg het gebruik van visuele dagplanners en het consequent aanhouden van routines voor huiswerk en bedtijd.</li>
                  <li><strong>Prikkelreductie:</strong> Zorg voor een rustige studieomgeving. Bespreek met uw kind strategieën om met overprikkeling om te gaan (bijv. koptelefoon, time-outs).</li>
                  <li><strong>Taakinitiatie:</strong> Probeer taken op te delen in kleinere, behapbare stappen. Gebruik eventueel een timer (Pomodoro-techniek) om te starten.</li>
                  <li><strong>Communicatie:</strong> Bespreek deze observaties open en zonder oordeel met uw kind. Vraag hoe zij het ervaren.</li>
              </ul>
          </div>
           <div className="p-4 border rounded-md bg-muted/50">
              <h3 className="font-semibold text-lg text-primary flex items-center gap-2"><Users className="h-5 w-5"/>Vervolgstappen & Ondersteuning (Voorbeeld)</h3>
              <p className="text-sm text-muted-foreground mt-1">
                  Deze inzichten kunnen een goed startpunt zijn voor gesprekken met uw kind en eventueel met de school. Als u zich zorgen maakt, overweeg dan contact op te nemen met een professional (huisarts, psycholoog, schoolbegeleider).
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                  Via het MindNavigator platform kunt u, na activatie van het kinderaccount, ook overwegen een gekwalificeerde coach of tutor te koppelen die ervaring heeft met deze aandachtspunten.
              </p>
          </div>
      </CardContent>
      <CardFooter className="flex-col items-center gap-3 pt-6">
           <Button onClick={handleSaveAndReturn} className="w-full sm:w-auto">
              <Save className="mr-2 h-4 w-4" /> Sla op & terug naar Voortgang
          </Button>
          <Button asChild variant="outline" className="w-full sm:w-auto" disabled>
              <Link href="#">
                  <Download className="mr-2 h-4 w-4" /> Download Overzicht als PDF (binnenkort)
              </Link>
          </Button>
           <Button asChild variant="link" className="text-xs p-0 h-auto">
              <Link href={`/quiz/ouder-symptomen-check?kindId=${kindId || ''}`}>Doe de test opnieuw</Link>
          </Button>
      </CardFooter>
    </Card>
  );
}

export default function OuderSymptomenCheckResultsPage() {
  return (
    <Suspense fallback={<div>Resultaten laden...</div>}>
      <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-primary/5 via-background to-accent/5 p-4 pt-16 md:pt-24 pb-16">
        <div className="absolute top-8 left-8">
          <SiteLogo />
        </div>
        <OuderSymptomenCheckResultsContent />
      </div>
    </Suspense>
  );
}
