// src/app/dashboard/admin/documentation/changelog/page.tsx
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, ScrollText, GitBranch, CheckCircle, Wrench, Shield, Users, Bot, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { FormattedDateCell } from '@/components/admin/user-management/FormattedDateCell';

interface ChangeLogEntry {
  date: string; // ISO String
  title: string;
  description: string;
  icon: React.ElementType;
  tags: { text: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }[];
}

const changelogData: ChangeLogEntry[] = [
    {
        date: new Date().toISOString(),
        title: "Architecturale Refactoring: Context & Services",
        description: "Alle directe localStorage aanroepen zijn gecentraliseerd in een StorageService. De AuthContext is geïntroduceerd om de gebruikersauthenticatie te beheren, wat een cruciale stap is richting een robuuste backend. De demo-rolwisselaar is vervangen door een functionele (gesimuleerde) login.",
        icon: GitBranch,
        tags: [{ text: "Architectuur", variant: "default" }, { text: "Refactor", variant: "secondary" }, { text: "Auth", variant: "outline" }]
    },
    {
        date: new Date(Date.now() - 86400000).toISOString(),
        title: "Feature: Ouder-Kind Vergelijkende Analyse",
        description: "Implementatie van de volledige 'slice' voor de vergelijkende analyse, inclusief een nieuwe quiz voor ouders, een intelligente voortgangspagina die de AI-flow aanroept, en de weergave van het gegenereerde adviesrapport.",
        icon: Users,
        tags: [{ text: "Nieuwe Feature", variant: "default" }, { text: "AI", variant: "secondary" }, { text: "Ouder Dashboard", variant: "outline" }]
    },
    {
        date: new Date(Date.now() - 2 * 86400000).toISOString(),
        title: "Workflow Automatisering: Tool Component Generatie",
        description: "Het proces voor het aanmaken van tool-componenten is volledig geautomatiseerd. Een server-actie genereert de code en schrijft deze direct naar het bestandssysteem, waarna een live preview wordt getoond. Kopiëren en plakken is niet meer nodig.",
        icon: Bot,
        tags: [{ text: "Automatisering", variant: "default" }, { text: "Workflow", variant: "secondary" }, { text: "AI", variant: "outline" }]
    },
    {
        date: new Date(Date.now() - 3 * 86400000).toISOString(),
        title: "Verbetering: Responsive & Inklapbare Sidebar",
        description: "De dashboard layout is volledig vernieuwd met een professionele, inklapbare sidebar die correct werkt op zowel desktop als mobiele apparaten. Inclusief tooltips voor een betere UX in ingeklapte modus.",
        icon: Wrench,
        tags: [{ text: "UX/UI", variant: "default" }, { text: "Layout", variant: "secondary" }]
    },
     {
        date: new Date(Date.now() - 4 * 86400000).toISOString(),
        title: "Fix: Opstartproblemen Server",
        description: "Meerdere servercrashes tijdens het opstarten zijn verholpen. De oorzaak was het importeren van niet-bestaande iconen uit 'lucide-react'. De ongeldige imports zijn gecorrigeerd en verwijderd.",
        icon: Wrench,
        tags: [{ text: "Bugfix", variant: "destructive" }, { text: "Stabiliteit", variant: "secondary" }]
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
                <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
                    <li><strong>Admin:</strong> <code className="bg-background px-2 py-1 rounded-sm font-mono">admin@example.com</code></li>
                    <li><strong>Ouder:</strong> <code className="bg-background px-2 py-1 rounded-sm font-mono">ouder@example.com</code></li>
                    <li><strong>Leerling:</strong> <code className="bg-background px-2 py-1 rounded-sm font-mono">leerling@example.com</code></li>
                    <li><strong>Tutor:</strong> <code className="bg-background px-2 py-1 rounded-sm font-mono">tutor@example.com</code></li>
                    <li><strong>Coach:</strong> <code className="bg-background px-2 py-1 rounded-sm font-mono">coach@example.com</code></li>
                </ul>
            </div>
          </CardContent>
      </Card>
      
      <div className="space-y-6">
        {changelogData.map((entry) => (
            <Card key={entry.date} className="shadow-md flex flex-col md:flex-row">
                <div className="p-4 md:border-r flex flex-row md:flex-col items-center justify-center gap-2 md:w-48 text-center bg-muted/50 rounded-t-lg md:rounded-l-lg md:rounded-r-none">
                    <entry.icon className="h-8 w-8 text-primary"/>
                    <div className="font-semibold text-sm">
                        <FormattedDateCell isoDateString={entry.date} dateFormatPattern="PPP" />
                    </div>
                </div>
                <div className="p-4 flex-1">
                    <h3 className="font-semibold text-lg text-foreground">{entry.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1 mb-3">{entry.description}</p>
                    <div className="flex flex-wrap gap-1">
                        {entry.tags.map(tag => (
                            <Badge key={tag.text} variant={tag.variant}>{tag.text}</Badge>
                        ))}
                    </div>
                </div>
            </Card>
        ))}
      </div>
    </div>
  );
}
