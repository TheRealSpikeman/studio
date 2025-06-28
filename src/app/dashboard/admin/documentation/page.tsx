
// src/app/dashboard/admin/documentation/page.tsx
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { GitBranch, BookHeart, ExternalLink, MessageCircleQuestion, BookUser, Bot, Users, BrainCircuit, ScrollText, Rocket } from 'lucide-react';

const documentationLinks = [
  {
    title: "Development Roadmap",
    description: "Een interactief overzicht van de ontwikkelingsfasen en taken voor het MindNavigator platform, gebaseerd op een Firebase-First strategie.",
    icon: Rocket,
    href: "/dashboard/admin/documentation/roadmap",
    linkText: "Bekijk Roadmap",
    isExternal: false,
  },
  {
    title: "Customer Journey (12-jarige)",
    description: "Stap-voor-stap overzicht van de gebruikersreis voor een nieuwe 12-jarige leerling, van registratie tot dashboard.",
    icon: Users,
    href: "/dashboard/admin/documentation/customer-journey",
    linkText: "Bekijk Journey",
    isExternal: false,
  },
  {
    title: "Data & Inzichten Flow",
    description: "Gedetailleerde uitleg over hoe quizdata wordt omgezet in gepersonaliseerde coaching content.",
    icon: BrainCircuit,
    href: "/dashboard/admin/documentation/data-flow",
    linkText: "Bekijk Data Flow",
    isExternal: false,
  },
   {
    title: "AI Persona: Dr. Florentine Sage",
    description: "Het gedetailleerde profiel en de professionele filosofie van onze AI-gedreven psycholoog, Dr. F. Sage.",
    icon: Bot,
    href: "/dashboard/admin/documentation/ai-persona",
    linkText: "Bekijk Persona Profiel",
    isExternal: false,
  },
    {
    title: "Uitleg: Adaptieve Quiz Methodologie",
    description: "Een diepgaande uitleg van de twee-fase-structuur, het algoritme en de onderliggende principes van onze adaptieve quizzen.",
    icon: GitBranch,
    href: "/methodologie/adaptieve-quiz",
    linkText: "Bekijk Methodologie",
    isExternal: true,
  },
  {
    title: "Veelgestelde Vragen (Publiek)",
    description: "De openbare FAQ-pagina die antwoord geeft op de meest voorkomende vragen van (potentiële) gebruikers, ouders en begeleiders.",
    icon: MessageCircleQuestion,
    href: "/faq",
    linkText: "Bekijk FAQ",
    isExternal: true,
  },
  {
    title: "Changelog & Updates",
    description: "Een overzicht van alle recente wijzigingen, fixes en updates aan het platform, inclusief demo login info.",
    icon: ScrollText,
    href: "/dashboard/admin/documentation/changelog",
    linkText: "Bekijk Changelog",
    isExternal: false,
  },
];

export default function AdminDocumentationPage() {
  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
          <BookHeart className="h-8 w-8 text-primary" />
          Documentatie & Hulp
        </h1>
        <p className="text-muted-foreground">
          Een overzicht van belangrijke handleidingen en documenten over de werking van het platform.
        </p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {documentationLinks.map((link) => (
          <Card key={link.title} className="shadow-lg flex flex-col">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="flex-shrink-0 p-3 bg-primary/10 rounded-full">
                    <link.icon className="h-7 w-7 text-primary" />
                </div>
                <CardTitle className="text-xl font-semibold">{link.title}</CardTitle>
              </div>
              <CardDescription>{link.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow"></CardContent>
            <CardContent>
              <Button asChild>
                <Link href={link.href} target={link.isExternal ? "_blank" : "_self"} rel={link.isExternal ? "noopener noreferrer" : ""}>
                  {link.linkText} {link.isExternal && <ExternalLink className="ml-2 h-4 w-4" />}
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
