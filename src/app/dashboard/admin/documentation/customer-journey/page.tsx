// src/app/dashboard/admin/documentation/customer-journey/page.tsx
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, UserPlus, ShieldCheck, PlayCircle, ClipboardList, Target, BarChart3, LayoutDashboard, GitBranch, Users as UsersIcon, Bot } from '@/lib/icons';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const journeySteps = [
    {
        step: 1,
        icon: UserPlus,
        title: "Registratie & Ouderlijke Toestemming",
        description: "De reis begint met het aanmaken van een account. Omdat de gebruiker minderjarig is, staat veiligheid voorop.",
        details: [
            "Een 12-jarige gebruiker meldt zich aan via de signup-pagina.",
            "Het systeem detecteert de leeftijd en activeert de procedure voor ouderlijke toestemming.",
            "De ouder ontvangt een e-mail, volgt de link, en maakt een eigen account aan om toestemming te verlenen.",
            "Pas na goedkeuring wordt het account van het kind geactiveerd."
        ]
    },
    {
        step: 2,
        icon: PlayCircle,
        title: "Welkomstpagina & Eerste Stappen",
        description: "Na de eerste succesvolle login wordt de gebruiker begeleid naar de start van hun ontdekkingsreis.",
        details: [
            "De gebruiker landt op een speciale welkomstpagina (`/dashboard/leerling/welcome`).",
            "Deze pagina legt de voordelen en de werking van MindNavigator uit.",
            "De primaire call-to-action is de knop 'Start de Zelfreflectie Tool Nu'."
        ]
    },
    {
        step: 3,
        icon: Target,
        title: "De Juiste Quiz Starten",
        description: "De gebruiker wordt naadloos naar de correcte, leeftijdspecifieke quiz geleid.",
        details: [
            "De welkomstknop linkt naar de quiz-overzichtspagina met de juiste `ageGroup` parameter (`/dashboard/leerling/quizzes?ageGroup=12-14`).",
            "De 'Zelfreflectie Start (12-14 jr)' quiz wordt prominent getoond en kan direct worden gestart."
        ]
    },
    {
        step: 4,
        icon: GitBranch,
        title: "Doorlopen van de Adaptieve Quiz",
        description: "De quiz past zich aan de antwoorden aan voor een relevante en efficiënte ervaring.",
        details: [
            "Fase 1: De gebruiker beantwoordt een set basisvragen om een algemeen profiel te schetsen.",
            "Het systeem analyseert de antwoorden en identificeert relevante thema's (bv. Aandacht & Focus, Prikkelverwerking).",
            "Fase 2: De gebruiker krijgt alleen verdiepende vragen over de thema's die in Fase 1 naar voren kwamen."
        ]
    },
    {
        step: 5,
        icon: BarChart3,
        title: "Resultaten & Analyse (AI)",
        description: "Na de quiz ontvangt de gebruiker direct waardevolle, AI-gedreven inzichten.",
        details: [
            "De antwoorden worden geanalyseerd door de 'generateQuizAnalysis' AI flow.",
            "De gebruiker komt op de resultatenpagina met een duidelijke, AI-gegenereerde analyse van hun profiel.",
            "Een nieuwe sectie 'Aanbevolen Tools' toont de 3-4 meest relevante tools (bv. Focus Timer, Sensory Calm Space) op basis van de quizscores.",
            "Elke aanbeveling bevat een uitleg waarom de tool nuttig is en hoe deze gebruikt kan worden."
        ]
    },
    {
        step: 6,
        icon: LayoutDashboard,
        title: "Gepersonaliseerd Dashboard (AI)",
        description: "De gebruiker landt in een omgeving die nu dagelijks door AI wordt afgestemd op hun profiel.",
        details: [
            "De primaire knop op de resultatenpagina is 'Ga naar mijn Dashboard'.",
            "De 'generateCoachingInsights' AI flow gebruikt de analyse om dagelijks unieke content te creëren.",
            "Het dashboard toont een persoonlijke affirmatie, een coaching tip en een micro-taak, speciaal voor de gebruiker gegenereerd."
        ]
    }
];

export default function CustomerJourneyPage() {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
          <UsersIcon className="h-8 w-8 text-primary" />
          Customer Journey: 12-Jarige Gebruiker
        </h1>
        <Button variant="outline" asChild>
          <Link href="/dashboard/admin/documentation">
            <ArrowLeft className="mr-2 h-4 w-4" /> Terug naar Documentatie
          </Link>
        </Button>
      </div>
      <p className="text-muted-foreground">
        Een gedetailleerd overzicht van de stap-voor-stap gebruikerservaring voor een nieuwe, 12-jarige leerling.
      </p>

      <Accordion type="single" collapsible defaultValue="item-1" className="w-full space-y-4">
        {journeySteps.map((item) => {
            const Icon = item.icon;
            return (
              <AccordionItem key={item.step} value={`item-${item.step}`} className="bg-card border shadow-sm rounded-lg data-[state=open]:shadow-lg">
                <AccordionTrigger className="p-4 text-xl font-semibold hover:no-underline data-[state=open]:text-primary [&[data-state=open]>svg]:text-primary">
                    <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-lg flex-shrink-0">
                            {item.step}
                        </div>
                        <div>
                            <h3 className="text-left flex items-center gap-2">{item.title} {item.title.includes('(AI)') && <Bot className="h-5 w-5 text-accent"/>}</h3>
                            <p className="text-sm font-normal text-muted-foreground text-left">{item.description}</p>
                        </div>
                    </div>
                </AccordionTrigger>
                <AccordionContent className="p-4 pt-0 border-t mt-2">
                    <ul className="list-disc list-inside space-y-2 pl-4 pt-4 text-muted-foreground">
                        {item.details.map((detail, index) => <li key={index}>{detail}</li>)}
                    </ul>
                </AccordionContent>
              </AccordionItem>
            )
        })}
      </Accordion>
    </div>
  );
}
