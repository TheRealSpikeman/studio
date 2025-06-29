// src/app/dashboard/admin/documentation/platform-status/page.tsx
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2, AlertCircle, Wrench, ShieldCheck, Cpu, Bot, Rocket, Database, Users as UsersIcon, CreditCard, LayoutDashboard } from '@/lib/icons';
import { Badge } from '@/components/ui/badge';
import type { ElementType, ReactNode } from 'react';

interface StatusItemProps {
  icon: ElementType;
  title: string;
  description: string;
  status: 'done' | 'in_progress' | 'next';
}

const StatusItem = ({ icon: Icon, title, description, status }: StatusItemProps) => {
  const statusConfig = {
    done: { icon: CheckCircle2, text: "Voltooid", className: "bg-green-100 text-green-700 border-green-300" },
    in_progress: { icon: Wrench, text: "In uitvoering", className: "bg-blue-100 text-blue-700 border-blue-300" },
    next: { icon: Rocket, text: "Volgende Stap", className: "bg-orange-100 text-orange-700 border-orange-300" },
  };
  const currentStatus = statusConfig[status];

  return (
    <div className="flex items-start gap-4 p-4 border rounded-md bg-card">
      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary flex-shrink-0">
        <Icon className="h-6 w-6" />
      </div>
      <div className="flex-1">
        <h3 className="font-semibold text-foreground">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
        <Badge variant="outline" className={`mt-2 text-xs ${currentStatus.className}`}>
            <currentStatus.icon className="mr-1.5 h-3.5 w-3.5" />
            {currentStatus.text}
        </Badge>
      </div>
    </div>
  );
};

export default function PlatformStatusPage() {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
          <Rocket className="h-8 w-8 text-primary" />
          Platform Status & Voortgang
        </h1>
        <Button variant="outline" asChild>
          <Link href="/dashboard/admin/documentation">
            <ArrowLeft className="mr-2 h-4 w-4" /> Terug naar Documentatie
          </Link>
        </Button>
      </div>
      <p className="text-lg text-muted-foreground">
        Een overzicht van de huidige ontwikkelingsstatus van het MindNavigator platform.
      </p>

      <Card>
        <CardHeader>
            <CardTitle>Fundament & Architectuur</CardTitle>
            <CardDescription>De kern van het platform is stabiel en operationeel.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <StatusItem 
                icon={ShieldCheck}
                title="Authenticatie & Autorisatie"
                description="Gebruikers kunnen registreren, inloggen en uitloggen. Rol-gebaseerde toegang tot dashboards is actief."
                status="done"
            />
             <StatusItem 
                icon={Database}
                title="Database & Data Structuur"
                description="De Firestore database structuur is gedefinieerd. De applicatie draait momenteel op dummy data."
                status="in_progress"
            />
             <StatusItem 
                icon={Bot}
                title="AI (Genkit) Integratie"
                description="Alle AI-flows voor het genereren van content (quizzen, analyses, coaching) zijn geïmplementeerd en functioneel."
                status="done"
            />
             <StatusItem 
                icon={LayoutDashboard}
                title="Basis UI & Layout"
                description="De algemene layout, navigatie, header en de inklapbare sidebar zijn volledig geïmplementeerd en responsive."
                status="done"
            />
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
            <CardTitle>Features & Functionaliteiten</CardTitle>
            <CardDescription>Status van de verschillende dashboards en kernfeatures.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <StatusItem 
                icon={Cpu}
                title="Admin Dashboard"
                description="Zeer compleet. Beheer van gebruikers, quizzen, features, abonnementen, tools en content is functioneel (met dummy data)."
                status="done"
            />
            <StatusItem 
                icon={CreditCard}
                title="Betalingen & Abonnementen"
                description="De logica voor het definiëren van abonnementen is klaar. De daadwerkelijke betaal-integratie is de volgende stap."
                status="next"
            />
            <StatusItem 
                icon={UsersIcon}
                title="Ouder & Leerling Dashboards"
                description="Basisstructuur is aanwezig. De volledige functionaliteit (voortgang, coaching-hub etc.) moet nog worden gebouwd."
                status="in_progress"
            />
            <StatusItem 
                icon={Wrench}
                title="Coach & Tutor Dashboards"
                description="Placeholder dashboards zijn aanwezig. Specifieke functionaliteiten zoals lesbeheer zijn de volgende stap."
                status="next"
            />
        </CardContent>
      </Card>
      
       <div className="text-center pt-6">
            <p className="text-muted-foreground mb-4">Voor een gedetailleerd overzicht van alle geplande features, zie de roadmap.</p>
            <Button asChild>
                <Link href="/dashboard/admin/documentation/roadmap">
                    <Rocket className="mr-2 h-4 w-4" /> Bekijk de Volledige Roadmap
                </Link>
            </Button>
        </div>

    </div>
  );
}
