// src/app/dashboard/admin/documentation/data-flow/page.tsx
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Database, FileInput, BrainCircuit, Sparkles, LayoutDashboard, ClipboardCheck, Bot } from '@/lib/icons';

const flowSteps = [
    {
        step: 1,
        icon: FileInput,
        title: "Input: Gebruiker Vult Quiz In",
        description: "De reis begint wanneer een gebruiker een zelfreflectie-instrument (quiz) voltooit. De ruwe data bestaat uit de antwoorden op de vragen (bijv. scores van 1-4).",
        details: [
            "Data wordt lokaal in de browser verzameld.",
            "Dit gebeurt in de `teen-neurodiversity-quiz` componenten.",
            "De data omvat antwoorden op basisvragen en eventuele verdiepingsvragen."
        ]
    },
    {
        step: 2,
        icon: BrainCircuit,
        title: "Flow 1: `generateQuizAnalysis` (AI)",
        description: "De verzamelde quizdata wordt naar de eerste AI-flow gestuurd. Deze flow heeft één taak: het creëren van een rijke, tekstuele analyse van het neuroprofiel.",
        details: [
            "Gebruikt een van de Prompt Templates (Multi-Thema of Enkel Thema).",
            "Converteert scores naar kwalitatieve beschrijvingen.",
            "Identificeert sterke kanten, aandachtspunten en geeft algemene tips.",
            "De output is een gestructureerde HTML-tekst, de 'onboardingAnalysisText'."
        ]
    },
    {
        step: 3,
        icon: Database,
        title: "Opslag: Lokale Browser (localStorage)",
        description: "De gegenereerde 'onboardingAnalysisText' en andere resultaten worden tijdelijk opgeslagen in de lokale opslag (localStorage) van de browser van de gebruiker. Dit is een bewuste keuze voor de huidige ontwikkelfase.",
        details: [
            "**Snel Prototypen:** Maakt het mogelijk om de volledige flow te testen zonder een complexe database-backend op te zetten.",
            "**Geen Kosten:** Geen databasekosten tijdens de ontwikkeling en het testen.",
            "**Offline Toegang:** Resultaten blijven beschikbaar op het apparaat van de gebruiker, zelfs zonder internetverbinding.",
            "**Volgende Stap:** De volgende grote stap in de roadmap is om deze lokale opslag te vervangen door een robuuste, online database (Firebase Firestore) voor persistentie en synchronisatie tussen apparaten."
        ]
    },
     {
        step: 4,
        icon: Sparkles,
        title: "Flow 2: `generateCoachingInsights` (AI)",
        description: "Wanneer de gebruiker de Coaching Hub bezoekt, wordt de opgeslagen 'onboardingAnalysisText' opgehaald en als input gebruikt voor de tweede AI-flow.",
        details: [
            "Deze flow is lichter en sneller dan de eerste.",
            "Gebruikt de volledige analyse als context om dag-specifieke, relevante content te genereren.",
            "Dit is waar de daadwerkelijke, dagelijkse personalisatie plaatsvindt."
        ]
    },
    {
        step: 5,
        icon: ClipboardCheck,
        title: "Output: Dagelijkse Gepersonaliseerde Content",
        description: "De `generateCoachingInsights` flow levert een gestructureerd object op met drie specifieke, dagelijkse stukjes content.",
        details: [
            "Een persoonlijke affirmatie.",
            "Een concrete, relevante coaching tip.",
            "Een kleine, haalbare micro-taak."
        ]
    },
    {
        step: 6,
        icon: LayoutDashboard,
        title: "Weergave: Gepersonaliseerd Dashboard",
        description: "De dagelijkse, gepersonaliseerde content wordt direct getoond op het dashboard van de gebruiker, waardoor de omgeving elke dag fris en relevant aanvoelt.",
        details: [
            "Creëert een 'levende' hub die meegroeit.",
            "Stimuleert dagelijkse interactie en betrokkenheid.",
            "De basisanalyse blijft constant, terwijl de dagelijkse toepassing varieert."
        ]
    },
];

export default function DataFlowPage() {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
          <BrainCircuit className="h-8 w-8 text-primary" />
          Data & Inzichten Flow
        </h1>
        <Button variant="outline" asChild>
          <Link href="/dashboard/admin/documentation">
            <ArrowLeft className="mr-2 h-4 w-4" /> Terug naar Documentatie
          </Link>
        </Button>
      </div>
      <p className="text-muted-foreground">
        Een gedetailleerd overzicht van hoe data van een ingevulde quiz wordt omgezet in dagelijkse, gepersonaliseerde coaching content voor de gebruiker.
      </p>

      <div className="relative space-y-12 pl-8">
        {/* Vertical line */}
        <div className="absolute left-8 top-8 bottom-8 w-0.5 bg-border/70" aria-hidden="true"></div>

        {flowSteps.map((item, index) => {
            const Icon = item.icon;
            const isAiStep = item.title.includes('(AI)');
            return (
              <div key={item.step} className="relative flex items-start gap-6">
                 <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 border-4 border-background text-primary font-bold text-lg flex-shrink-0 z-10">
                    {isAiStep ? <Bot className="h-8 w-8"/> : <Icon className="h-8 w-8"/>}
                 </div>
                 <div className="flex-1 pt-1">
                    <h3 className="text-xl font-semibold text-primary mb-1">Stap {item.step}: {item.title}</h3>
                    <p className="text-base text-muted-foreground mb-3">{item.description}</p>
                    <ul className="list-disc list-inside space-y-1 pl-2 text-sm text-foreground/80">
                        {item.details.map((detail, detailIndex) => <li key={detailIndex} dangerouslySetInnerHTML={{ __html: detail.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />)}
                    </ul>
                 </div>
              </div>
            )
        })}
      </div>
    </div>
  );
}
