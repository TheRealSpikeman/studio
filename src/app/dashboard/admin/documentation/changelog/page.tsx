// src/app/dashboard/admin/documentation/changelog/page.tsx
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, ScrollText, GitBranch, CheckCircle, Wrench, ShieldCheck, Users, Bot, Sparkles, Rocket, Package, Rss } from '@/lib/icons';
import { Badge } from '@/components/ui/badge';
import { FormattedDateCell } from '@/components/admin/user-management/FormattedDateCell';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

interface ChangeLogEntry {
  date: string; // ISO String
  title: string;
  icon: React.ElementType;
  description: string;
  details?: string[]; // For the expandable content
  tags: { text: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }[];
}

const now = new Date(); // Base time to make variations more predictable

const changelogData: ChangeLogEntry[] = [
    {
        date: new Date(now.getTime() - (1 * 3600 * 1000)).toISOString(), // 1 hour ago
        title: "End-to-End Quiz Flow Functioneel Gemaakt",
        icon: CheckCircle,
        description: "De volledige 'happy path' voor gebruikers is nu functioneel: een quiz invullen, de resultaten opslaan en deze correct weergeven op de resultatenpagina. Dit maakt uitvoerig testen van de kern-quiz-logica mogelijk.",
        details: [
            "**Quiz Logica (`QuizPageContent.tsx`):** De component slaat nu na voltooiing het volledige AI-gegenereerde rapport op in de `localStorage` via de `StorageService`.",
            "**Resultatenpagina (`results/page.tsx`):** Deze pagina haalt nu de opgeslagen quizresultaten op en toont deze, in plaats van dummy data.",
            "**Data Types & Services:** De `QuizResult` type en `StorageService` zijn bijgewerkt om de volledige data flow te ondersteunen.",
            "**Resultaat:** Een testbare, naadloze gebruikerservaring van start tot resultaat."
        ],
        tags: [{ text: "Fix", variant: "destructive" }, { text: "Quiz Flow", variant: "secondary" }, { text: "Testen", variant: "outline" }]
    },
    {
        date: new Date(now.getTime() - (2 * 3600 * 1000)).toISOString(), // 2 hours ago
        title: "Architectuur Refactor: Centralisatie & Stabiliteit",
        icon: GitBranch,
        description: "Een grote architectonische refactoring doorgevoerd om de codebase te stabiliseren en te organiseren. Alle AI-flows zijn opgesplitst in aparte 'types' en 'flow' bestanden om te voldoen aan de Next.js 'use server' vereisten. Iconen en types zijn gecentraliseerd voor betere onderhoudbaarheid.",
        details: [
            "**AI Flows Opgesplitst:** Alle Zod-schema's en TypeScript-types zijn verplaatst naar `*-types.ts` bestanden, waardoor de `*-flow.ts` bestanden met `'use server'` alleen nog serverfuncties exporteren. Dit loste een fundamentele build-fout op.",
            "**Gecentraliseerde Iconen:** Een nieuw bestand `src/lib/icons.ts` fungeert als één centraal exportpunt voor alle `lucide-react` iconen. Dit voorkomt 'icon not defined' fouten en vereenvoudigt het beheer.",
            "**Type Beheer Hersteld:** Het `src/types/index.ts` 'barrel file' is hersteld om alle type-definities vanuit één punt te kunnen importeren.",
            "**Resultaat:** Een stabielere, schone en beter onderhoudbare architectuur die klaar is voor toekomstige uitbreidingen."
        ],
        tags: [{ text: "Refactor", variant: "default" }, { text: "Architectuur", variant: "secondary" }, { text: "Stabiliteit", variant: "outline" }]
    },
    {
        date: new Date(now.getTime() - (1 * 24 * 3600000) - (5 * 3600 * 1000)).toISOString(), // 1 day and 5 hours ago
        title: "Feature: AI-Gedreven Blog & Content Management",
        icon: Rss,
        description: "Een volledig functioneel blogsysteem is geïmplementeerd. Admins kunnen nu blogartikelen genereren met behulp van AI persona's, deze beheren in het dashboard, en publiceren. De publieke blog is live, inclusief een overzichtspagina en individuele artikelpagina's met social sharing.",
        details: [
            "**AI Content Creatie:** Een nieuwe Genkit-flow (`generate-blog-post-flow.ts`) kan volledige, gestructureerde blogposts schrijven.",
            "**Persona Selectie:** Admins kunnen kiezen uit verschillende AI-persona's (psycholoog, SEO-expert, tiener) om de toon van de content te bepalen.",
            "**Admin Dashboard:** Een nieuwe sectie onder 'Platformbeheer > Blogbeheer' voor het aanmaken, bewerken en verwijderen van posts.",
            "**Publieke Routes:** De routes `/blog` en `/blog/[slug]` zijn aangemaakt en gestyled om de blogposts weer te geven.",
            "**Navigatie:** Links zijn toegevoegd aan de header en footer voor makkelijke toegang."
        ],
        tags: [{ text: "Nieuwe Feature", variant: "default" }, { text: "AI", variant: "secondary" }, { text: "Content Management", variant: "outline" }]
    },
    {
        date: new Date(now.getTime() - (2 * 24 * 3600000) - (8 * 3600 * 1000)).toISOString(), // 2 days and 8 hours ago
        title: "Bugfix: Hardnekkige Build Fout Opgelost",
        icon: Wrench,
        description: "Een aanhoudende en frustrerende build-fout (`Unexpected eof`) in de 'Platform Handleiding' documentatiepagina is definitief opgelost. De pagina compileert nu correct, waardoor de stabiliteit van de ontwikkelomgeving is hersteld.",
        details: [
            "**Probleem:** De applicatie kon niet compileren vanwege een syntaxisfout in `platform-guide/page.tsx`.",
            "**Analyse:** De hoofdoorzaak was dat een XML-codevoorbeeld direct als JSX werd behandeld in plaats van als een string, wat de compiler in de war bracht.",
            "**Oplossing:** De XML-code is correct ingesloten in een JavaScript template literal (backticks ``), waardoor het nu als tekst wordt gezien en de JSX-structuur van de component niet langer verstoort.",
            "**Resultaat:** De build is weer stabiel en de documentatiepagina is correct beschikbaar in het admin dashboard."
        ],
        tags: [{ text: "Bugfix", variant: "destructive" }, { text: "Stabiliteit", variant: "secondary" }, { text: "Admin Dashboard", variant: "outline" }]
    },
    {
        date: new Date(now.getTime() - (3 * 24 * 3600000) - (1 * 3600 * 1000)).toISOString(), // 3 days and 1 hour ago
        title: "Fundamentele Stabiliteits- & Authenticatie-fix",
        icon: Wrench,
        description: "Een reeks diepgewortelde problemen opgelost die de Firebase-verbinding en het inloggen verstoorden. De applicatie is nu stabiel, robuust en correct geconfigureerd.",
        details: [
            "**Probleem:** Gebruikers konden niet inloggen door aanhoudende `Missing or insufficient permissions` fouten en de server crashte periodiek.",
            "**Analyse:** Na een uitgebreide analyse bleek de kernoorzaak een dieper configuratieprobleem. Zelfs met open Firestore-regels faalde de connectie, wat wees op incorrecte environment variable handling (.env werd niet geladen), syntaxisfouten in `next.config.ts`, en logische fouten in de `AuthContext` (zoals een oneindige laad-spinner).",
            "**Oplossing:** De Firestore-regels zijn tijdelijk volledig opengezet om connectiviteit te valideren en daarna correct geconfigureerd. Het `.env` bestand is correct gevuld, `firebase.ts` is robuust gemaakt, `next.config.ts` is gecorrigeerd en de `AuthContext` is opgeschoond.",
            "**Resultaat:** De applicatie is nu stabiel en de authenticatie-flow werkt zoals verwacht, wat de weg vrijmaakt voor verdere ontwikkeling."
        ],
        tags: [{ text: "Bugfix", variant: "destructive" }, { text: "Authenticatie", variant: "secondary" }, { text: "Core", variant: "default" }]
    },
    {
        date: new Date(now.getTime() - (4 * 24 * 3600000) - (11 * 3600 * 1000)).toISOString(), // 4 days and 11 hours ago
        title: "Architectuur: Feature & Abonnementenbeheer",
        description: "Implementatie van een flexibel systeem voor het beheren van platform-features en abonnementen. Admins kunnen nu dynamisch functionaliteiten definiëren en deze koppelen aan verschillende abonnementen (bijv. 'Gratis Start', 'Gezins Gids'). Dit is een cruciale stap richting een schaalbaar B2B2C-model.",
        icon: Package,
        tags: [{ text: "Architectuur", variant: "default" }, { text: "Admin Dashboard", variant: "secondary" }, { text: "Nieuwe Feature", variant: "outline" }]
    },
    {
        date: new Date(now.getTime() - (5 * 24 * 3600000) - (6 * 3600 * 1000)).toISOString(), // 5 days and 6 hours ago
        title: "Prestatie Optimalisatie: Dynamisch Dashboard Laden",
        description: "Het leerling-dashboard laadt nu dynamisch met `next/dynamic` en toont een 'skeleton' UI tijdens het laden. Dit verbetert de initiële laadtijd en gebruikerservaring, conform de technische roadmap.",
        icon: Rocket,
        tags: [{ text: "Prestatie", variant: "default" }, { text: "UX/UI", variant: "secondary" }, { text: "Refactor", variant: "outline" }]
    },
    {
        date: new Date(now.getTime() - (6 * 24 * 3600000) - (14 * 3600 * 1000)).toISOString(), // 6 days and 14 hours ago
        title: "Architectuur & Authenticatie Refactor",
        description: "Een fundamentele verbetering van de app-architectuur. De demo-rolwisselaar is vervangen door een robuuste (gesimuleerde) login flow via een centrale AuthContext. Alle localStorage-logica is verplaatst naar een StorageService, wat de overstap naar een echte database in de toekomst vereenvoudigt.",
        icon: GitBranch,
        tags: [{ text: "Architectuur", variant: "default" }, { text: "Refactor", variant: "secondary" }, { text: "Auth", variant: "outline" }]
    },
    {
        date: new Date(now.getTime() - (7 * 24 * 3600000) - (4 * 3600 * 1000)).toISOString(), // 7 days and 4 hours ago
        title: "Feature: Ouder-Kind Vergelijkende Analyse",
        description: "Implementatie van de volledige 'slice' voor de vergelijkende analyse, inclusief een nieuwe quiz voor ouders, een intelligente voortgangspagina die de AI-flow aanroept, en de weergave van het gegenereerde adviesrapport.",
        icon: Users,
        tags: [{ text: "Nieuwe Feature", variant: "default" }, { text: "AI", variant: "secondary" }, { text: "Ouder Dashboard", variant: "outline" }]
    },
    {
        date: new Date(now.getTime() - (8 * 24 * 3600000) - (9 * 3600 * 1000)).toISOString(), // 8 days and 9 hours ago
        title: "Verbetering: Responsive & Inklapbare Dashboard Sidebar",
        description: "De dashboard layout is volledig vernieuwd met een professionele, inklapbare sidebar die correct werkt op zowel desktop als mobiele apparaten. De UX is verbeterd met gecentraliseerde iconen en tooltips voor een strakke, intuïtieve interface.",
        icon: Wrench,
        tags: [{ text: "UX/UI", variant: "default" }, { text: "Layout", variant: "secondary" }]
    },
    {
        date: new Date(now.getTime() - (9 * 24 * 3600000) - (2 * 3600 * 1000)).toISOString(), // 9 days and 2 hours ago
        title: "Workflow Automatisering: Tool Component Generatie",
        description: "Het proces voor het aanmaken van tool-componenten is volledig geautomatiseerd. Een server-actie genereert de code en schrijft deze direct naar het bestandssysteem, waarna een live preview wordt getoond. Kopiëren en plakken is niet meer nodig.",
        icon: Bot,
        tags: [{ text: "Automatisering", variant: "default" }, { text: "Workflow", variant: "secondary" }, { text: "AI", variant: "outline" }]
    },
];

export default function ChangelogPage() {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
          <ScrollText className="h-8 w-8 text-primary" />
          Changelog & Platform Updates
        </h1>
        <Button variant="outline" asChild>
          <Link href="/dashboard/admin/documentation">
            <ArrowLeft className="mr-2 h-4 w-4" /> Terug naar Documentatie
          </Link>
        </Button>
      </div>

      <Card className="shadow-lg">
          <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-primary"/>Demo Login Informatie
              </CardTitle>
              <CardDescription>
                  Gebruik de volgende gegevens om in te loggen als verschillende rollen. Het wachtwoord is voor alle accounts hetzelfde.
              </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-muted p-4 rounded-md border">
                <p><strong>Wachtwoord (voor alle accounts):</strong> <code className="bg-background px-2 py-1 rounded-sm text-primary font-mono">password</code></p>
                <div className="mt-2 space-y-1 text-sm">
                    <p>• <strong>Admin:</strong> <code className="bg-background px-2 py-1 rounded-sm font-mono">alice@example.com</code></p>
                    <p>• <strong>Ouder:</strong> <code className="bg-background px-2 py-1 rounded-sm font-mono">olivia.ouder@example.com</code></p>
                    <p>• <strong>Leerling:</strong> <code className="bg-background px-2 py-1 rounded-sm font-mono">sofie.kind@example.com</code></p>
                    <p>• <strong>Tutor:</strong> <code className="bg-background px-2 py-1 rounded-sm font-mono">anna.visser@example.com</code></p>
                    <p>• <strong>Coach:</strong> <code className="bg-background px-2 py-1 rounded-sm font-mono">edward@example.com</code></p>
                </div>
            </div>
          </CardContent>
      </Card>
      
      <Accordion type="single" collapsible className="w-full space-y-6">
        {changelogData.map((entry, index) => (
            <AccordionItem value={`item-${index}`} key={entry.date} disabled={!entry.details} className="bg-card border rounded-lg shadow-md data-[state=open]:shadow-lg">
              <AccordionTrigger className="p-0 hover:no-underline w-full accordion-trigger-no-icon [&[data-state=open]>svg]:rotate-180">
                  <div className="flex flex-col md:flex-row w-full">
                      <div className="p-4 md:border-r flex flex-row md:flex-col items-center justify-center gap-2 md:w-48 text-center bg-muted/50 rounded-t-lg md:rounded-l-lg md:rounded-r-none">
                          <entry.icon className="h-8 w-8 text-primary"/>
                          <div className="font-semibold text-sm">
                              <FormattedDateCell isoDateString={entry.date} dateFormatPattern="PPPp" />
                          </div>
                      </div>
                      <div className="p-4 flex-1 text-left">
                          <h3 className="font-semibold text-lg text-foreground">{entry.title}</h3>
                          <p className="text-sm text-muted-foreground mt-1 mb-3">{entry.description}</p>
                          <div className="flex flex-wrap gap-1">
                              {entry.tags.map(tag => (
                                  <Badge key={tag.text} variant={tag.variant}>{tag.text}</Badge>
                              ))}
                          </div>
                      </div>
                  </div>
              </AccordionTrigger>
              {entry.details && (
                <AccordionContent className="p-4 pt-2 border-t">
                  <h4 className="font-semibold mb-2">Details van de wijziging:</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                    {entry.details.map((detail, detailIndex) => (
                      <li key={detailIndex} dangerouslySetInnerHTML={{ __html: detail.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                    ))}
                  </ul>
                </AccordionContent>
              )}
            </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
