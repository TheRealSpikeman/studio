// src/app/dashboard/admin/documentation/platform-guide/page.tsx
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, BookUser, Users, Brain, LayoutDashboard, ShieldCheck, HeartHandshake, BookOpenCheck } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

export default function PlatformGuidePage() {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
          <BookUser className="h-8 w-8 text-primary" />
          Platform Handleiding
        </h1>
        <Button variant="outline" asChild>
          <Link href="/dashboard/admin/documentation">
            <ArrowLeft className="mr-2 h-4 w-4" /> Terug naar Documentatie
          </Link>
        </Button>
      </div>
      <p className="text-muted-foreground">
        Een uitgebreid overzicht van de features, rollen en functionaliteiten van het MindNavigator platform.
      </p>

      <Accordion type="single" collapsible defaultValue="item-1" className="w-full space-y-4">
        
        <AccordionItem value="item-1">
          <AccordionTrigger className="text-xl font-semibold p-4 bg-muted/50 rounded-t-lg">
            <div className="flex items-center gap-2"><LayoutDashboard className="h-6 w-6 text-primary" />Introductie & Kernconcepten</div>
          </AccordionTrigger>
          <AccordionContent className="p-4 border border-t-0 rounded-b-lg">
            <p className="mb-2">MindNavigator is een B2B2C platform ontworpen om jongeren (de 'eindgebruikers') en hun ouders te ondersteunen bij het navigeren van neurodiversiteit. Het platform biedt diagnostische hulpmiddelen (zelfreflectie tools), gepersonaliseerde coaching en een marktplaats voor 1-op-1 begeleiding.</p>
            <strong className="block mb-1">De Kern Pijlers:</strong>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Zelfinzicht:</strong> Via adaptieve en thematische quizzen krijgen gebruikers inzicht in hun sterktes en uitdagingen.</li>
              <li><strong>Ondersteuning:</strong> Een digitale coaching hub biedt dagelijkse, op maat gemaakte tips en oefeningen.</li>
              <li><strong>Begeleiding:</strong> Een marktplaats verbindt gezinnen met gekwalificeerde tutors en coaches voor persoonlijke ondersteuning.</li>
              <li><strong>Beheer:</strong> Een uitgebreid admin-dashboard voor het beheren van alle aspecten van het platform.</li>
            </ul>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-2">
          <AccordionTrigger className="text-xl font-semibold p-4 bg-muted/50 rounded-t-lg">
             <div className="flex items-center gap-2"><Users className="h-6 w-6 text-primary" />Gebruikersrollen</div>
          </AccordionTrigger>
          <AccordionContent className="p-4 border border-t-0 rounded-b-lg space-y-4">
            <div>
              <h4 className="font-semibold text-lg flex items-center gap-2"><LayoutDashboard className="h-5 w-5 text-muted-foreground"/>Admin</h4>
              <p className="text-sm text-muted-foreground pl-7">Beheert het volledige platform. Kan gebruikers, content, quizzen, en instellingen aanpassen. Heeft toegang tot alle dashboards om de gebruikerservaring te simuleren.</p>
            </div>
             <div>
              <h4 className="font-semibold text-lg flex items-center gap-2"><Users className="h-5 w-5 text-muted-foreground"/>Ouder</h4>
              <p className="text-sm text-muted-foreground pl-7">Maakt een hoofdaccount aan voor het gezin. Kan kinderen toevoegen, abonnementen beheren, en (met toestemming) de voortgang van kinderen inzien. Kan ook 1-op-1 begeleiding zoeken en boeken.</p>
            </div>
             <div>
              <h4 className="font-semibold text-lg flex items-center gap-2"><Brain className="h-5 w-5 text-muted-foreground"/>Leerling (Jongere)</h4>
              <p className="text-sm text-muted-foreground pl-7">De eindgebruiker. Doet zelfreflectie-instrumenten, ontvangt gepersonaliseerde coaching en kan gebruik maken van huiswerk-tools. Kan toestemming geven om resultaten te delen.</p>
            </div>
             <div>
              <h4 className="font-semibold text-lg flex items-center gap-2"><HeartHandshake className="h-5 w-5 text-muted-foreground"/>Coach</h4>
              <p className="text-sm text-muted-foreground pl-7">Een gekwalificeerde professional (psycholoog/orthopedagoog) die 1-op-1 begeleiding biedt voor persoonlijke ontwikkeling en welzijn. Beheert eigen beschikbaarheid, sessies en cliënten.</p>
            </div>
             <div>
              <h4 className="font-semibold text-lg flex items-center gap-2"><BookOpenCheck className="h-5 w-5 text-muted-foreground"/>Tutor</h4>
              <p className="text-sm text-muted-foreground pl-7">Biedt 1-op-1 huiswerkbegeleiding en ondersteuning voor specifieke schoolvakken. Beheert eigen beschikbaarheid, lessen en leerlingen.</p>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-3">
          <AccordionTrigger className="text-xl font-semibold p-4 bg-muted/50 rounded-t-lg">
             <div className="flex items-center gap-2"><Brain className="h-6 w-6 text-primary" />Core Module: Quiz Management</div>
          </AccordionTrigger>
          <AccordionContent className="p-4 border border-t-0 rounded-b-lg space-y-3">
            <p>Het hart van het platform is de mogelijkheid om quizzen te creëren en te beheren. Dit gebeurt in het Admin Dashboard onder "Quizzen Beheer".</p>
            <ul className="list-disc pl-5 space-y-2">
                <li><strong>Quiz Creator:</strong> Een wizard met 5 stappen leidt de admin door het proces van het aanmaken van een nieuwe quiz.</li>
                <li><strong>Quiz Types:</strong>
                    <ul className="list-circle pl-5">
                        <li><strong>Vanaf Nul:</strong> Maak handmatig een quiz met eigen vragen.</li>
                        <li><strong>Template:</strong> Start met een vooraf gedefinieerd sjabloon.</li>
                        <li><strong>AI Gegenereerd:</strong> Laat AI een conceptquiz genereren op basis van een onderwerp.</li>
                        <li><strong>Adaptieve Quiz:</strong> Een slimme quiz die zich aanpast aan de antwoorden van de gebruiker. Bestaat uit een detectiefase en een verdiepingsfase.</li>
                    </ul>
                </li>
                <li><strong>Vragenbank:</strong> Voor adaptieve quizzen kunnen vragen voor de detectie- en verdiepingsfases beheerd worden.</li>
                <li><strong>Configuratie:</strong> Admins kunnen per quiz de doelgroep, categorie, status, en instellingen voor resultaatweergave en follow-up configureren.</li>
            </ul>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="item-4">
          <AccordionTrigger className="text-xl font-semibold p-4 bg-muted/50 rounded-t-lg">
            <div className="flex items-center gap-2"><ShieldCheck className="h-6 w-6 text-primary" />Technologie & Architectuur</div>
          </AccordionTrigger>
          <AccordionContent className="p-4 border border-t-0 rounded-b-lg space-y-3">
            <p>MindNavigator is gebouwd op een moderne en schaalbare tech stack:</p>
             <ul className="list-disc pl-5 space-y-1">
              <li><strong>Frontend:</strong> Next.js (met App Router), React, TypeScript.</li>
              <li><strong>Styling:</strong> Tailwind CSS en ShadCN/UI voor een consistente en professionele look.</li>
              <li><strong>AI & Backend:</strong> Genkit (Google's AI-framework) voor alle generatieve features (quizzen, analyses, coaching).</li>
              <li><strong>Database & Auth:</strong> Momenteel gesimuleerd met `localStorage`. De architectuur is voorbereid op integratie met Firebase (Authentication, Firestore, Storage).</li>
            </ul>
          </AccordionContent>
        </AccordionItem>

      </Accordion>
    </div>
  );
}
