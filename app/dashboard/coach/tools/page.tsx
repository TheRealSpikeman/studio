// src/app/dashboard/coach/tools/page.tsx
"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { ArrowLeft, Wrench, BarChart3, Users, MessageSquare, FileText, Info } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

interface CoachTool {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  link?: string;
  disabled?: boolean;
}

const coachTools: CoachTool[] = [
  {
    id: 'client-analysis',
    title: 'Cliënt Analyse',
    description: 'Bekijk de (gedeelde) resultaten van zelfreflectie-instrumenten van je cliënten om je sessies beter voor te bereiden.',
    icon: BarChart3,
    link: '/dashboard/coach/students',
  },
  {
    id: 'session-templates',
    title: 'Sessie Templates',
    description: 'Maak en beheer templates voor verschillende soorten coachingsessies (intake, voortgang, afronding).',
    icon: FileText,
    disabled: true,
  },
  {
    id: 'communication-hub',
    title: 'Communicatie Hub',
    description: 'Beheer hier de veilige communicatie met al je cliënten en hun ouders.',
    icon: MessageSquare,
    disabled: true,
  },
  {
    id: 'resource-library',
    title: 'Bronnen Bibliotheek',
    description: 'Deel relevante artikelen, video\'s of oefeningen met je cliënten vanuit een centrale bibliotheek.',
    icon: Users,
    disabled: true,
  },
];

export default function CoachToolsPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <Wrench className="h-8 w-8 text-primary" />
            Coach Tools & Hulpmiddelen
          </h1>
          <p className="text-muted-foreground">
            Een overzicht van tools om je coaching te ondersteunen.
          </p>
        </div>
        <Button variant="outline" asChild>
          <Link href="/dashboard/coach">
            <ArrowLeft className="mr-2 h-4 w-4" /> Terug naar Coach Dashboard
          </Link>
        </Button>
      </div>
      
       <Alert variant="default" className="bg-blue-50 border-blue-200 text-blue-700">
        <Info className="h-5 w-5 !text-blue-600" />
        <AlertTitle className="text-blue-700 font-semibold">In Ontwikkeling</AlertTitle>
        <AlertDescription className="text-blue-600">
          Veel van deze tools zijn nog in actieve ontwikkeling. Uw feedback is waardevol om ze zo goed mogelijk te maken.
        </AlertDescription>
      </Alert>


      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {coachTools.map((tool) => (
          <Card key={tool.id} className="flex flex-col shadow-md hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <tool.icon className="h-6 w-6 text-primary" />
                  {tool.title}
                </CardTitle>
                {tool.disabled && <Badge variant="outline">Binnenkort</Badge>}
              </div>
              <CardDescription>{tool.description}</CardDescription>
            </CardHeader>
            <CardFooter className="mt-auto">
              <Button asChild className="w-full" disabled={tool.disabled}>
                {tool.link ? <Link href={tool.link}>Open Tool</Link> : <span>Binnenkort</span>}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
