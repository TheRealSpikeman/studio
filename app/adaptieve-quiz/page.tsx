// src/app/adaptieve-quiz/page.tsx
"use client";

import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { GitBranch, Target, ClipboardList, Bot, ShieldCheck, AlertTriangle, ArrowRight, Info } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle as AlertTitleUi } from "@/components/ui/alert";

export default function AdaptiveQuizMethodologyPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-gradient-to-b from-background via-secondary/10 to-background py-12 md:py-20 lg:py-28">
        <div className="container mx-auto max-w-3xl">
          <div className="text-center mb-12 md:mb-16">
            <GitBranch className="mx-auto h-16 w-16 text-primary mb-4" />
            <h1 className="text-4xl font-bold text-foreground">Uitleg: Onze Adaptieve Quiz Methodologie</h1>
            <p className="text-lg text-muted-foreground mt-2 max-w-2xl mx-auto">
              Een transparante blik op hoe onze slimme vragenlijst werkt, bedoeld voor toetsing door professionals.
            </p>
          </div>

          <div className="space-y-10 text-base leading-relaxed text-foreground/90">
            <section>
              <h2 className="text-2xl font-semibold text-primary mb-4">Waarom een Adaptieve Aanpak?</h2>
              <p className="mb-3">
                Een standaard, lange vragenlijst kan voor jongeren, met name die met aandachtsuitdagingen, demotiverend en vermoeiend zijn ("survey fatigue"). Dit leidt tot onnauwkeurige resultaten. Onze adaptieve aanpak is ontworpen om dit probleem op te lossen door:
              </p>
              <ul className="list-disc list-inside pl-5 space-y-2">
                <li><strong>Relevantie te maximaliseren:</strong> We stellen alleen verdiepende vragen over onderwerpen die uit een eerste, brede screening relevant lijken.</li>
                <li><strong>De ervaring te personaliseren:</strong> De quiz past zich aan de gebruiker aan, wat de betrokkenheid verhoogt.</li>
                <li><strong>Tijd te besparen:</strong> De totale duur van de quiz wordt beperkt door onnodige vragen over te slaan.</li>
              </ul>
            </section>

            <Card className="bg-card shadow-lg border">
              <CardHeader>
                <CardTitle className="text-2xl">De Twee Fases van de Quiz</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <Card className="bg-muted/50 border">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-xl text-primary"><Target className="h-6 w-6" />Fase 1: Detectie & Signalering</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p><strong>Doel:</strong> Een brede, snelle indruk krijgen van mogelijke neurodivergente kenmerken over verschillende spectrums (o.a. aandacht, prikkelverwerking, sociale interactie).</p>
                    <p><strong>Methode:</strong> De gebruiker beantwoordt een vaste set van 15-20 algemene vragen. Deze vragen zijn zorgvuldig geselecteerd als indicatoren voor meerdere onderliggende spectrums.</p>
                    <p><strong>Resultaat:</strong> Op basis van de antwoorden wordt voor elk spectrum een voorlopige score berekend (als percentage). Deze score is puur voor interne logica en wordt niet direct aan de gebruiker getoond.</p>
                  </CardContent>
                </Card>

                <Card className="bg-muted/50 border">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-xl text-primary"><ClipboardList className="h-6 w-6" />Fase 2: Gerichte Verdieping</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p><strong>Doel:</strong> Dieper ingaan op de spectrums die in Fase 1 als 'relevant' zijn gesignaleerd om een genuanceerder beeld te krijgen.</p>
                    <p><strong>Methode:</strong> Het systeem vergelijkt de scores uit Fase 1 met vooraf ingestelde drempelwaardes (thresholds). Alleen voor de spectrums waarvan de score de drempelwaarde overschrijdt, wordt een set specifieke verdiepingsvragen gepresenteerd.</p>
                    <p><strong>Resultaat:</strong> Een meer betrouwbare en gedetailleerde score per relevant spectrum, die de basis vormt voor het uiteindelijke rapport.</p>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>

            <section>
              <h2 className="text-2xl font-semibold text-primary mb-4 flex items-center gap-2"><Bot className="h-7 w-7" />Het Algoritme Achter de Schermen</h2>
              <p className="mb-4">
                Om te voorkomen dat de quiz te lang wordt als een gebruiker hoog scoort op meerdere spectrums, hanteert het algoritme een aantal regels in Fase 2:
              </p>
              <ol className="list-decimal list-inside pl-5 space-y-3">
                <li><strong>Prioritering:</strong> De spectrums die de drempelwaarde hebben gehaald, worden gesorteerd op basis van de hoogste score uit Fase 1.</li>
                <li><strong>Vragen Toewijzen:</strong> Het systeem begint met het toewijzen van de verdiepingsvragen voor het hoogst scorende spectrum.</li>
                <li><strong>Cap Management:</strong> Het systeem houdt een 'harde limiet' aan voor het totaal aantal vragen in Fase 2 (bijv. maximaal 20 vragen). Nadat de vragen voor het eerste spectrum zijn toegewezen, kijkt het systeem hoeveel vragen er nog over zijn binnen de limiet en wijst deze toe aan het volgende spectrum op de prioriteitenlijst, totdat de limiet is bereikt.</li>
              </ol>
              <p className="mt-4">
                Dit zorgt ervoor dat de meest relevante onderwerpen altijd aan bod komen, terwijl de quiz behapbaar blijft voor de gebruiker.
              </p>
            </section>
            
             <section>
              <h2 className="text-2xl font-semibold text-primary mb-4">Kwaliteit van de Vragenbank</h2>
              <p>
                De vragen in zowel Fase 1 als Fase 2 zijn zorgvuldig samengesteld met input van professionals op het gebied van kinder- en jeugdpsychologie en orthopedagogiek. Ze zijn ontworpen om aan te sluiten bij de belevingswereld van de doelgroep en zijn gebaseerd op kenmerken uit erkende psychologische modellen, vertaald naar laagdrempelige, niet-klinische vraagstellingen.
              </p>
            </section>

             <section>
                <Alert variant="default" className="p-6 rounded-lg bg-muted/50 border-l-4 border-primary">
                    <Info className="h-6 w-6 text-primary" />
                    <AlertTitleUi className="text-xl font-bold text-primary">Essentiële Disclaimer</AlertTitleUi>
                    <AlertDescription className="text-base text-muted-foreground leading-relaxed mt-2">
                        De adaptieve quiz en de resultaten ervan zijn bedoeld als een instrument voor zelfinzicht en educatie. De gegenereerde profielen en scores zijn <strong>geen medische of psychologische diagnose</strong>. Dit platform vervangt geen consultatie met een gekwalificeerde professional zoals een arts, psycholoog of orthopedagoog. Bij zorgen over welzijn of ontwikkeling, neem altijd contact op met een zorgverlener.
                    </AlertDescription>
                </Alert>
             </section>

             <div className="text-center mt-12 pt-10 border-t">
              <h3 className="text-xl font-semibold text-foreground mb-3">Heeft u professionele feedback of vragen?</h3>
              <p className="text-muted-foreground mb-6">
                  We waarderen de input van experts enorm. Neem contact op met ons team.
              </p>
              <Button asChild>
                  <Link href="/contact">Neem Contact Op</Link>
              </Button>
            </div>

          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
