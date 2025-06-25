
// src/app/dashboard/admin/documentation/platform-guide/page.tsx
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, BookHeart, Users, Brain, LayoutDashboard, Shield, Handshake, BookOpen, CreditCard, BarChart as FileBarChart, GitBranch, MessageSquare, ExternalLink, Bot } from '@/lib/icons'; // Adjusted imports
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

export default function PlatformGuidePage() {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
          <BookHeart className="h-8 w-8 text-primary" />
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
             <div className="flex items-center gap-2"><Users className="h-6 w-6 text-primary" />Gebruikersrollen & Interacties</div>
          </AccordionTrigger>
          <AccordionContent className="p-4 border border-t-0 rounded-b-lg space-y-4">
            <div>
              <h4 className="font-semibold text-lg flex items-center gap-2"><LayoutDashboard className="h-5 w-5 text-muted-foreground"/>Admin</h4>
              <p className="text-sm text-muted-foreground pl-7">Beheert het volledige platform. Kan gebruikers, content, quizzen, en instellingen aanpassen. Heeft toegang tot alle dashboards om de gebruikerservaring te simuleren en kan alle data inzien.</p>
            </div>
             <div>
              <h4 className="font-semibold text-lg flex items-center gap-2"><Users className="h-5 w-5 text-muted-foreground"/>Ouder</h4>
              <p className="text-sm text-muted-foreground pl-7">Maakt een hoofdaccount aan voor het gezin. Kan kinderaccounts aanmaken, abonnementen beheren, en (met toestemming van het kind) de voortgang inzien. Kan ook 1-op-1 begeleiding zoeken en boeken voor de kinderen.</p>
            </div>
             <div>
              <h4 className="font-semibold text-lg flex items-center gap-2"><Brain className="h-5 w-5 text-muted-foreground"/>Leerling (Jongere)</h4>
              <p className="text-sm text-muted-foreground pl-7">De eindgebruiker. Doet zelfreflectie-instrumenten, ontvangt gepersonaliseerde coaching en kan gebruik maken van huiswerk-tools. Kan toestemming geven om resultaten te delen met ouders en/of gekoppelde begeleiders.</p>
            </div>
             <div>
              <h4 className="font-semibold text-lg flex items-center gap-2"><Handshake className="h-5 w-5 text-muted-foreground"/>Coach</h4>
              <p className="text-sm text-muted-foreground pl-7">Een gekwalificeerde professional (psycholoog/orthopedagoog) die 1-op-1 begeleiding biedt voor persoonlijke ontwikkeling en welzijn. Beheert eigen beschikbaarheid, sessies en cliënten. Krijgt alleen toegang tot cliëntgegevens na expliciete koppeling en toestemming.</p>
            </div>
             <div>
              <h4 className="font-semibold text-lg flex items-center gap-2"><BookOpen className="h-5 w-5 text-muted-foreground"/>Tutor</h4>
              <p className="text-sm text-muted-foreground pl-7">Biedt 1-op-1 huiswerkbegeleiding en ondersteuning voor specifieke schoolvakken. Beheert eigen beschikbaarheid, lessen en leerlingen. Ziet alleen relevante informatie na koppeling en toestemming.</p>
            </div>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="item-onboarding">
          <AccordionTrigger className="text-xl font-semibold p-4 bg-muted/50 rounded-t-lg">
             <div className="flex items-center gap-2"><GitBranch className="h-6 w-6 text-primary" />Onboarding & Registratie Flows</div>
          </AccordionTrigger>
          <AccordionContent className="p-4 border border-t-0 rounded-b-lg space-y-3">
             <ul className="list-disc pl-5 space-y-2">
                <li><strong>Leerling Onboarding:</strong> Een jongere start met een gratis, leeftijdsspecifieke assessment. Na voltooiing kan hij/zij een account aanmaken om resultaten op te slaan. Als de jongere jonger dan 16 is, wordt er een e-mail naar de opgegeven ouder gestuurd voor goedkeuring voordat het account volledig actief wordt.</li>
                <li><strong>Ouder Onboarding:</strong> Een ouder registreert zich en kan direct kinderen aan zijn/haar gezin toevoegen. Het kind ontvangt dan een uitnodiging per e-mail om het eigen account te activeren en te koppelen. De ouder beheert de abonnementen.</li>
                <li><strong>Tutor/Coach Onboarding:</strong> Professionals melden zich aan via een aparte pagina. Ze doorlopen een onboarding wizard om hun profiel, kwalificaties (incl. VOG) en beschikbaarheid in te vullen. Een admin beoordeelt de aanvraag voordat het profiel wordt goedgekeurd en zichtbaar wordt op het platform.</li>
             </ul>
             <Button variant="link" asChild className="p-0 h-auto mt-2">
                <Link href="/dashboard/admin/documentation/customer-journey">Bekijk de gedetailleerde Customer Journey <ExternalLink className="ml-1 h-4 w-4"/></Link>
             </Button>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-subscriptions">
          <AccordionTrigger className="text-xl font-semibold p-4 bg-muted/50 rounded-t-lg">
             <div className="flex items-center gap-2"><CreditCard className="h-6 w-6 text-primary" />Abonnementen & Feature Management</div>
          </AccordionTrigger>
          <AccordionContent className="p-4 border border-t-0 rounded-b-lg space-y-3">
            <p>Het businessmodel van het platform is gebaseerd op een flexibel systeem van features en abonnementen, beheerd door de admin.</p>
             <ul className="list-disc pl-5 space-y-2">
                <li><strong>Features:</strong> Dit zijn de 'bouwstenen' van het platform (bv. 'Interactief Dagboek', '1-op-1 Chat met Coach'). Deze worden aangemaakt en beheerd in de 'Feature Management' sectie.</li>
                <li><strong>Abonnementen:</strong> Dit zijn bundels van features die aan gebruikers worden verkocht (bv. 'Gratis Start', 'Gezins Gids', 'Premium Plan'). Deze worden geconfigureerd in 'Abonnementen Beheer'.</li>
                <li><strong>Koppeling:</strong> De admin bepaalt per abonnement welke features inbegrepen zijn. Dit systeem maakt het mogelijk om snel nieuwe abonnementsvormen te creëren of te A/B-testen zonder codeaanpassingen.</li>
             </ul>
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
                 <li><strong>AI Analyse:</strong> Admins kunnen per quiz instrueren hoe de AI de resultaten moet analyseren, wat zorgt voor gepersonaliseerde en relevante rapporten voor de gebruiker.</li>
            </ul>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="item-coaching-hub">
          <AccordionTrigger className="text-xl font-semibold p-4 bg-muted/50 rounded-t-lg">
             <div className="flex items-center gap-2"><MessageSquare className="h-6 w-6 text-primary" />Coaching Hub & Leerling Tools</div>
          </AccordionTrigger>
          <AccordionContent className="p-4 border border-t-0 rounded-b-lg space-y-3">
            <p>De kern van de waarde voor de leerling, na de initiële assessment.</p>
             <ul className="list-disc pl-5 space-y-2">
                <li><strong>Gepersonaliseerd Dashboard:</strong> Toont dagelijkse, AI-gegenereerde content: een affirmatie, een coaching tip en een micro-taak. Dit alles is gebaseerd op de resultaten van de onboarding quiz.</li>
                <li><strong>Dagboek & Reflectie:</strong> Een veilige, privé-ruimte voor de leerling om te schrijven, met toekomstige opties voor foto- en audio-uploads.</li>
                <li><strong>Huiswerk Tools:</strong> Toegang tot planners, Pomodoro-timers en een bibliotheek met vakspecifieke tips, video's en oefeningen.</li>
             </ul>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="item-data-flow">
          <AccordionTrigger className="text-xl font-semibold p-4 bg-muted/50 rounded-t-lg">
             <div className="flex items-center gap-2"><FileBarChart className="h-6 w-6 text-primary" />Data & Inzichten Flow</div>
          </AccordionTrigger>
          <AccordionContent className="p-4 border border-t-0 rounded-b-lg space-y-3">
            <p>Het proces van data naar waardevol inzicht is een cruciale, tweeledige AI-operatie:</p>
             <ol className="list-decimal list-inside pl-5 space-y-2">
                <li><strong>Quiz Analyse:</strong> Antwoorden worden omgezet in een uitgebreide, tekstuele analyse van het profiel.</li>
                <li><strong>Coaching Generatie:</strong> Deze analyse-tekst wordt gebruikt als context om dagelijks nieuwe, relevante coaching tips te genereren.</li>
             </ol>
              <Button variant="link" asChild className="p-0 h-auto mt-2">
                <Link href="/dashboard/admin/documentation/data-flow">Bekijk de gedetailleerde Data Flow <ExternalLink className="ml-1 h-4 w-4"/></Link>
              </Button>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="item-4">
          <AccordionTrigger className="text-xl font-semibold p-4 bg-muted/50 rounded-t-lg">
            <div className="flex items-center gap-2"><Shield className="h-6 w-6 text-primary" />Technologie & Architectuur</div>
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
        
        <AccordionItem value="item-ai-workflow">
          <AccordionTrigger className="text-xl font-semibold p-4 bg-muted/50 rounded-t-lg">
             <div className="flex items-center gap-2"><Bot className="h-6 w-6 text-primary" />AI Prototyper Werkwijze (XML)</div>
          </AccordionTrigger>
          <AccordionContent className="p-4 border border-t-0 rounded-b-lg space-y-3">
             <p>Alle wijzigingen die de AI Prototyper doorvoert, worden gestructureerd via een specifiek XML-formaat. Dit zorgt voor voorspelbare en betrouwbare codewijzigingen. Hieronder staat de structuur die wordt gebruikt:</p>
             <pre className="bg-gray-800 text-white p-4 rounded-md text-sm overflow-x-auto"><code>
{`<changes>
  <description>[Provide a concise summary of the overall changes being made]</description>
  <change>
    <file>[Provide the ABSOLUTE, FULL path to the file being modified]</file>
    <content><![CDATA[Provide the ENTIRE, FINAL, intended content of the file here. Do NOT provide diffs or partial snippets. Ensure all code is properly escaped within the CDATA section.