// src/app/dashboard/admin/documentation/platform-handleiding/page.tsx
"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import type { ElementType, ReactNode } from 'react';
import {
  ArrowLeft, BookUser, Users, ListChecks, Euro, Cpu, Settings, Bot
} from '@/lib/icons';

// Helper component for consistent section styling
const GuideSection = ({ title, icon: Icon, children }: { title: string, icon: ElementType, children: React.ReactNode }) => (
  <AccordionItem value={title} className="border rounded-lg bg-card shadow-sm">
    <AccordionTrigger className="p-4 font-semibold text-lg hover:no-underline">
      <div className="flex items-center gap-3">
        <Icon className="h-6 w-6 text-primary" />
        {title}
      </div>
    </AccordionTrigger>
    <AccordionContent className="p-4 pt-0 border-t">
      <div className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground">
        {children}
      </div>
    </AccordionContent>
  </AccordionItem>
);

export default function PlatformGuidePage() {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
          <BookUser className="h-8 w-8 text-primary" />
          Platform Handleiding (Admin)
        </h1>
        <Button variant="outline" asChild>
          <Link href="/dashboard/admin/documentation">
            <ArrowLeft className="mr-2 h-4 w-4" /> Terug naar Documentatie
          </Link>
        </Button>
      </div>

      <p className="text-lg text-muted-foreground">
        Welkom bij de handleiding voor beheerders. Dit document geeft een overzicht van de kernfunctionaliteiten van het MindNavigator admin-dashboard en hoe je deze effectief kunt gebruiken.
      </p>

      <Accordion type="multiple" defaultValue={['Gebruikersbeheer']} className="w-full space-y-4">
        <GuideSection title="Gebruikersbeheer" icon={Users}>
          <p>Het beheren van gebruikers is een kerntaak. U kunt alle gebruikersaccounts inzien, bewerken en hun status aanpassen.</p>
          <ul>
            <li><strong>Alle Gebruikers:</strong> Een compleet overzicht van iedereen op het platform. Handig voor snelle zoekacties.</li>
            <li><strong>Specifieke Rollen (Ouders, Leerlingen, Tutoren):</strong> Gefilterde overzichten voor gerichter beheer. Hiermee kunt u bijvoorbeeld snel alle openstaande tutor-aanmeldingen zien.</li>
            <li><strong>Acties:</strong> Via het actiemenu kunt u profielen bekijken/bewerken, wachtwoorden resetten (toekomstig), en gebruikers deactiveren of verwijderen.</li>
            <li><strong>Tutor Goedkeuring:</strong> Onder 'Tutorbeheer' kunt u nieuwe aanmeldingen beoordelen, documenten (CV/VOG) inzien en tutors met één klik goed- of afkeuren. Het systeem simuleert vervolgens de notificatie-e-mails.</li>
          </ul>
        </GuideSection>

        <GuideSection title="Quizbeheer" icon={ListChecks}>
          <p>Creëer en beheer de zelfreflectie-instrumenten die de kern van het platform vormen. De quizzen zijn de basis voor de gepersonaliseerde inzichten.</p>
          <ul>
            <li><strong>Quiz Creator:</strong> Een wizard om stap-voor-stap nieuwe quizzen te bouwen. U kunt kiezen om vanaf nul te beginnen, een template te gebruiken, of de AI een concept te laten genereren.</li>
            <li><strong>Adaptive Quiz:</strong> Een speciaal quiz-type dat zich aanpast aan de gebruiker. In Fase 1 worden patronen gedetecteerd, in Fase 2 volgen verdiepingsvragen over relevante onderwerpen. Dit voorkomt 'survey fatigue' en verhoogt de relevantie.</li>
            <li><strong>AI Verificatie:</strong> Laat de AI-psycholoog (Dr. Sage) uw vragen controleren op toon, duidelijkheid en geschiktheid voor de doelgroep voordat u publiceert.</li>
            <li><strong>Bewerken & Instellingen:</strong> Pas bestaande quizzen aan, voeg vragen toe of wijzig publicatie-instellingen zoals de URL (slug) en welke abonnementen toegang hebben.</li>
          </ul>
        </GuideSection>

        <GuideSection title="Financieel Beheer" icon={Euro}>
          <p>Beheer de commerciële aspecten van het platform.</p>
          <ul>
            <li><strong>Abonnementenbeheer:</strong> Maak en bewerk abonnementsplannen (bijv. 'Gratis', 'Gezins Gids'). Koppel specifieke features aan elk plan om de waarde te bepalen. Dit is een krachtige tool om uw aanbod te segmenteren.</li>
            <li><strong>Betalingen:</strong> (Momenteel een placeholder) Hier vindt u een overzicht van alle transacties, inkomsten en uitbetalingen aan tutoren/coaches.</li>
          </ul>
        </GuideSection>

        <GuideSection title="Platformbeheer" icon={Cpu}>
           <p>Beheer de content en functionaliteiten van het platform zelf.</p>
           <ul>
            <li><strong>Functionaliteiten (Feature Management):</strong> Definieer elke afzonderlijke feature van het platform (bijv. 'Interactief Dagboek'). Dit is de masterlijst die u gebruikt in het abonnementenbeheer om plannen samen te stellen.</li>
            <li><strong>Toolbeheer:</strong> Creëer en beheer de interactieve tools (zoals de 'Focus Timer'). U kunt de AI gebruiken om de eigenschappen te genereren en zelfs de React-component code te laten schrijven, die dan direct in de app wordt geladen.</li>
            <li><strong>Content Pagina's:</strong> Beheer eenvoudige, dynamische contentpagina's (zoals 'Over Ons') zonder de code aan te hoeven raken.</li>
            <li><strong>Blogbeheer:</strong> Schrijf, bewerk en publiceer blogartikelen. Maak gebruik van de AI om concepten te genereren op basis van verschillende persona's.</li>
           </ul>
        </GuideSection>
        
        <GuideSection title="Instellingen" icon={Settings}>
          <p>Configureer de algemene en specifieke instellingen van het platform.</p>
          <ul>
            <li><strong>Algemeen:</strong> Basisinstellingen zoals de platformnaam.</li>
            <li><strong>Rollen & Permissies:</strong> Een gedetailleerde matrix om te definiëren wat elke gebruikersrol (Admin, Leerling, Ouder, etc.) kan zien en doen.</li>
            <li><strong>AI Personas:</strong> Beheer de AI-persoonlijkheden die gebruikt worden voor contentcreatie (bijv. Dr. Florentine Sage). Dit bepaalt de schrijfstijl en expertise van AI-gegenereerde content.</li>
          </ul>
        </GuideSection>

        <GuideSection title="Werken met de AI Assistent" icon={Bot}>
            <p>
                Een groot deel van het beheer wordt ondersteund door een AI-assistent (via Google Gemini & Genkit). De AI kan taken uitvoeren zoals het genereren van quizvragen, het schrijven van blogposts, of het creëren van React componenten. De AI is ontworpen om u te helpen, niet om u te vervangen. <strong>Controleer altijd de output</strong> en pas deze aan waar nodig.
            </p>
            <h4 className="font-semibold mt-2">Hoe het werkt:</h4>
            <p>De AI-assistent is getraind om te reageren op uw commando's. Wanneer u een wijziging aanvraagt, genereert de assistent een XML-plan dat de beoogde bestandsaanpassingen beschrijft. Dit plan wordt vervolgens automatisch door het systeem uitgevoerd. Dit zorgt voor transparantie en controle.</p>
        </GuideSection>
      </Accordion>
    </div>
  );
}
    