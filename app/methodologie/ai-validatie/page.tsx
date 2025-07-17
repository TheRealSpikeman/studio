// src/app/methodologie/ai-validatie/page.tsx
"use client";

import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Gavel, Bot, CheckCircle2, ShieldCheck, BarChart3, Info, GitBranch } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle as AlertTitleUi } from "@/components/ui/alert";
import { CodeBlock } from '@/components/common/CodeBlock';

const validationScoreExplanation = `
function calculateOverallScore(inputAlignment, contentQuality, hallucinationPenalty) {
  // Weighted average for a balanced score. Accuracy is most important.
  const weights = {
    inputAlignment: 0.4,
    contentQuality: 0.35,
    hallucinations: 0.25
  };
  
  const score = (inputAlignment * weights.inputAlignment) +
                (contentQuality * weights.contentQuality) +
                ((100 - hallucinationPenalty) * weights.hallucinations);
  
  return Math.max(0, Math.min(score, 98)); // Cap at 98 for realism
}
`.trim();


export default function AiValidationMethodologyPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-gradient-to-b from-background via-secondary/10 to-background py-12 md:py-20 lg:py-28">
        <div className="container mx-auto max-w-3xl">
          <div className="text-center mb-12 md:mb-16">
            <Gavel className="mx-auto h-16 w-16 text-primary mb-4" />
            <h1 className="text-4xl font-bold text-foreground">AI Validatie & Kwaliteitsborging</h1>
            <p className="text-lg text-muted-foreground mt-2 max-w-2xl mx-auto">
              Transparantie over hoe we de betrouwbaarheid van AI-gegenereerde rapporten waarborgen.
            </p>
          </div>

          <div className="space-y-10 text-base leading-relaxed text-foreground/90">
            <section>
              <h2 className="text-2xl font-semibold text-primary mb-4">Ons Doel: Betrouwbare Inzichten</h2>
              <p className="mb-3">
                Bij MindNavigator zetten we AI in om gepersonaliseerde en schaalbare inzichten te bieden. We begrijpen dat de betrouwbaarheid van deze AI-gegenereerde content cruciaal is. Daarom hebben we een geautomatiseerd validatiesysteem ontwikkeld dat na elke generatie de kwaliteit van een rapport controleert. Dit proces zorgt ervoor dat de output niet alleen nuttig, maar ook accuraat en veilig is.
              </p>
            </section>

            <Card className="bg-card shadow-lg border">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2"><Bot className="h-7 w-7"/>Het 3-Staps Validatieproces</CardTitle>
                <CardDescription>Elk AI-rapport wordt direct na generatie onderworpen aan de volgende drie controles:</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <Card className="bg-muted/50 border">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-xl text-primary"><GitBranch className="h-6 w-6" />1. Input-Output Afstemming</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p><strong>Doel:</strong> Controleren of de AI de verstrekte data correct gebruikt en geen scores 'verzint'.</p>
                    <p><strong>Methode:</strong> Het systeem extraheert alle numerieke scores (bv. "scoort 3.2/4") uit het gegenereerde rapport. Vervolgens vergelijkt het deze met de daadwerkelijke scores uit de quiz-input. Voor elke genoemde score moet een overeenkomende input-score bestaan (binnen een kleine tolerantie).</p>
                    <p><strong>Resultaat:</strong> Een 'Input Alignment Score' die aangeeft hoe trouw de AI is aan de feitelijke data.</p>
                  </CardContent>
                </Card>

                <Card className="bg-muted/50 border">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-xl text-primary"><ShieldCheck className="h-6 w-6" />2. Detectie van Hallucinaties</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p><strong>Doel:</strong> Voorkomen dat de AI specifieke, niet-ondersteunde details toevoegt die de geloofwaardigheid ondermijnen.</p>
                    <p><strong>Methode:</strong> Het systeem scant het rapport op claims die niet uit de quizvragen kunnen worden afgeleid. Denk aan:</p>
                    <ul className="list-disc pl-5 mt-1 text-sm">
                        <li><strong>Absolute claims:</strong> Woorden als "altijd", "nooit", "constant".</li>
                        <li><strong>Specifieke contexten:</strong> Details over "in de klas" of "met vrienden" die niet in de vragen voorkwamen.</li>
                        <li><strong>Leeftijds-incongruentie:</strong> Een rapport voor een 13-jarige mag geen advies bevatten over 'werk' of 'universiteit'.</li>
                    </ul>
                    <p><strong>Resultaat:</strong> Een 'Hallucination Penalty Score'. Hoe hoger de score, hoe meer ongefundeerde claims er zijn gedetecteerd.</p>
                  </CardContent>
                </Card>

                 <Card className="bg-muted/50 border">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-xl text-primary"><BarChart3 className="h-6 w-6" />3. Kwaliteit van de Content</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p><strong>Doel:</strong> Evalueren of het rapport daadwerkelijk nuttig, concreet en relevant is.</p>
                    <p><strong>Methode:</strong> Het systeem controleert op:</p>
                        <ul className="list-disc pl-5 mt-1 text-sm">
                            <li><strong>Generieke zinnen:</strong> Een overmaat aan vage uitspraken zoals "het is belangrijk om..." leidt tot een lagere score.</li>
                            <li><strong>Concrete voorbeelden:</strong> De aanwezigheid van specifieke, bruikbare voorbeelden (zoals "probeer 5 minuten...") wordt positief gewaardeerd.</li>
                            <li><strong>Relevantie:</strong> De tekst wordt vergeleken met de sleutelwoorden uit de quizvragen en de geselecteerde focus-categorieën om te zien of de analyse on-topic is.</li>
                        </ul>
                    <p><strong>Resultaat:</strong> Een 'Content Quality Score' die de bruikbaarheid van het rapport aangeeft.</p>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>

            <section>
              <h2 className="text-2xl font-semibold text-primary mb-4">De Uiteindelijke 'Validatie Score'</h2>
              <p className="mb-4">De scores van de drie stappen worden gecombineerd in een gewogen gemiddelde om tot een definitieve <strong>Validatie Score (0-100%)</strong> te komen. Rapporten met een te lage score worden intern gemarkeerd voor menselijke review en verbetering. In het admin-dashboard is deze score zichtbaar, en voor de gebruiker wordt de kwaliteit vertaald naar een icoon (Goud, Professioneel, Basis) in het rapport.</p>
              <CodeBlock language="typescript" code={validationScoreExplanation} />
            </section>
            
             <section>
                <Alert variant="default" className="p-6 rounded-lg bg-muted/50 border-l-4 border-primary">
                    <Info className="h-6 w-6 text-primary" />
                    <AlertTitleUi className="text-xl font-bold text-primary">Essentiële Disclaimer</AlertTitleUi>
                    <AlertDescription className="text-base text-muted-foreground leading-relaxed mt-2">
                        Dit validatiesysteem is ontworpen om de kwaliteit en consistentie van onze AI te waarborgen. Het vervangt echter niet het kritische denkvermogen van de gebruiker of het oordeel van een gekwalificeerde professional. Een AI-rapport, hoe goed ook gevalideerd, blijft een hulpmiddel en is <strong>geen diagnose</strong>.
                    </AlertDescription>
                </Alert>
             </section>

             <div className="text-center mt-12 pt-10 border-t">
              <h3 className="text-xl font-semibold text-foreground mb-3">Vragen over onze aanpak?</h3>
              <p className="text-muted-foreground mb-6">
                  We staan open voor feedback en vragen van professionals en gebruikers.
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
