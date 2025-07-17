// src/app/faq/page.tsx
"use client";

import { useState, useMemo, useEffect } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { HelpCircle, MessageCircleQuestion, Brain, Users, ShieldCheck, CreditCard, ExternalLink, Search, AlertTriangle, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

const generalFaqs = [
  {
    id: "faq-what-is-mn",
    question: "Wat is MindNavigator precies?",
    answer: "MindNavigator is een online platform dat jongeren (voornamelijk 12-18 jaar) en hun ouders ondersteunt bij het begrijpen en navigeren van neurodiversiteit. Het biedt tools voor zelfreflectie, gepersonaliseerde inzichten, digitale coaching en de mogelijkheid tot 1-op-1 begeleiding via gekwalificeerde tutors en coaches.",
    keywords: ["platform", "neurodiversiteit", "jongeren", "ouders", "zelfreflectie", "coaching", "tutors"]
  },
  {
    id: "faq-for-whom",
    question: "Voor wie is MindNavigator bedoeld?",
    answer: "MindNavigator is primair bedoeld voor:<ul><li class='ml-4 list-disc'><strong>Jongeren (12-18 jaar):</strong> Voor zelfontdekking, het leren omgaan met uitdagingen en het benutten van sterke punten.</li><li class='ml-4 list-disc'><strong>Ouders/Verzorgers:</strong> Om hun kinderen beter te begrijpen, te ondersteunen en toegang te krijgen tot relevante informatie en begeleiding.</li><li class='ml-4 list-disc'><strong>Tutors & Coaches:</strong> Als platform om hun diensten aan te bieden en leerlingen/cliënten te begeleiden.</li></ul>",
    keywords: ["doelgroep", "jongeren", "ouders", "verzorgers", "tutors", "coaches", "administrators"]
  },
  {
    id: "faq-how-tools-work",
    question: "Hoe werken de zelfreflectie tools?",
    answer: "Onze zelfreflectie tools (quizzen) bestaan uit een reeks vragen die jongeren helpen na te denken over hun denkstijl, gedrag, en hoe ze de wereld ervaren. Op basis van hun antwoorden genereren we een persoonlijk overzicht met inzichten, mogelijke sterke punten, aandachtspunten en concrete tips. Deze tools zijn gebaseerd op erkende psychologische modellen maar zijn geen diagnostische instrumenten.",
    keywords: ["zelfreflectie", "tools", "quizzen", "vragenlijsten", "inzichten", "psychologisch"]
  },
  {
    id: "faq-replace-professional-help",
    question: "Vervangt MindNavigator professionele hulp?",
    answer: "<strong>Nee, absoluut niet.</strong> MindNavigator is een hulpmiddel voor zelfinzicht, educatie en laagdrempelige ondersteuning. Het stelt geen medische diagnoses en vervangt geen professioneel medisch of psychologisch advies, diagnose of behandeling. Bij serieuze zorgen of de wens voor een formele diagnose, adviseren wij altijd contact op te nemen met een gekwalificeerde zorgverlener. Lees onze <a href='/disclaimer' class='text-accent hover:underline font-medium'>volledige disclaimer <ExternalLink class='inline-block h-4 w-4 align-text-bottom'/></a>.",
    keywords: ["professionele hulp", "diagnose", "medisch advies", "psychologisch", "zorgverlener", "disclaimer"]
  },
  {
    id: "faq-privacy",
    question: "Hoe zit het met mijn privacy en gegevensbeveiliging?",
    answer: "Privacy en veiligheid zijn voor ons van het grootste belang. We behandelen alle persoonlijke gegevens vertrouwelijk en conform de AVG/GDPR-richtlijnen. Resultaten van zelfreflectie-instrumenten zijn persoonlijk en worden niet zonder toestemming gedeeld. Voor betaalde abonnementen voor minderjarigen is altijd ouderlijke toestemming en betaling vereist. Voor gedetailleerde informatie verwijzen we u naar ons <a href='/privacy' class='text-accent hover:underline font-medium'>Privacybeleid <ExternalLink class='inline-block h-4 w-4 align-text-bottom'/></a>.",
    keywords: ["privacy", "gegevensbeveiliging", "avg", "gdpr", "vertrouwelijk", "toestemming"]
  },
  {
    id: "faq-costs",
    question: "Wat zijn de kosten van MindNavigator?",
    answer: "MindNavigator biedt een gratis startoptie waarmee u de basis zelfreflectie tools kunt gebruiken. Voor toegang tot alle tools, de volledige coaching hub, het ouder dashboard en andere premium functies bieden we verschillende abonnementen. De kosten voor 1-op-1 begeleiding door tutors of coaches variëren per professional. Bekijk onze <a href='/pricing' class='text-accent hover:underline font-medium'>prijzenpagina <ExternalLink class='inline-block h-4 w-4 align-text-bottom'/></a> voor een actueel overzicht.",
    keywords: ["kosten", "prijzen", "abonnementen", "gratis", "premium", "coaching", "tutoring"]
  },
   {
    id: "faq-account-types",
    question: "Welke verschillende account types zijn er?",
    answer: "Er zijn accounts voor Leerlingen/Jongeren, Ouders/Verzorgers, Tutors, Coaches en Administrators. Elk accounttype heeft een eigen dashboard en functionaliteiten die zijn afgestemd op hun rol binnen het platform. Ouders kunnen bijvoorbeeld kinderaccounts aanmaken en beheren, en tutors kunnen hun beschikbaarheid en lessen beheren.",
    keywords: ["account", "type", "rol", "leerling", "ouder", "tutor", "coach", "admin", "dashboard"]
  },
   {
    id: "faq-parental-approval",
    question: "Hoe werkt ouderlijke goedkeuring voor minderjarigen?",
    answer: "Voor jongeren onder een bepaalde leeftijd (meestal 16 jaar, afhankelijk van lokale wetgeving die we hier simuleren als 16) is ouderlijke toestemming vereist om een account aan te maken of een betaald abonnement af te sluiten. Tijdens het registratieproces van de jongere wordt gevraagd om het e-mailadres van een ouder/verzorger. De ouder ontvangt dan een e-mail met een link om toestemming te geven en, indien van toepassing, de betaling voor een abonnement te voltooien. Pas na deze goedkeuring wordt het account van de jongere volledig geactiveerd.",
    keywords: ["ouderlijke goedkeuring", "toestemming", "minderjarig", "registratie", "abonnement", "betaling"]
  },
  {
    id: "faq-support",
    question: "Waar kan ik terecht als ik technische problemen ervaar of andere vragen heb?",
    answer: "Voor technische problemen of vragen die niet in deze FAQ beantwoord worden, kunt u contact opnemen met onze supportafdeling via de <a href='/contact' class='text-accent hover:underline font-medium'>contactpagina <ExternalLink class='inline-block h-4 w-4 align-text-bottom'/></a>. We streven ernaar u zo snel mogelijk te helpen.",
    keywords: ["support", "hulp", "technische problemen", "contact", "klantenservice"]
  }
];

export default function FaqPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const filteredFaqs = useMemo(() => {
    if (!searchTerm) return generalFaqs;
    const lowerSearchTerm = searchTerm.toLowerCase();
    return generalFaqs.filter(faq => 
      faq.question.toLowerCase().includes(lowerSearchTerm) ||
      faq.answer.toLowerCase().includes(lowerSearchTerm) ||
      (faq.keywords && faq.keywords.some(keyword => keyword.toLowerCase().includes(lowerSearchTerm)))
    );
  }, [searchTerm]);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-gradient-to-b from-background via-secondary/10 to-background py-12 md:py-20 lg:py-28">
        <div className="container mx-auto max-w-3xl">
          <div className="text-center mb-12 md:mb-16">
            <HelpCircle className="mx-auto h-16 w-16 text-primary mb-4" />
            <h1 className="text-4xl font-bold text-foreground">Veelgestelde Vragen</h1>
            <p className="text-lg text-muted-foreground mt-2">
              Vind hier antwoorden op de meest gestelde vragen over MindNavigator.
            </p>
          </div>
          
          <div className="space-y-10 text-base leading-relaxed text-foreground/90">
            <div className="relative mb-8">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Zoek in vragen en antwoorden..."
                className="pl-10 text-base h-12 rounded-lg shadow-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {isClient && filteredFaqs.length > 0 && (
              <Accordion type="single" collapsible className="w-full space-y-4">
                {filteredFaqs.map((faq) => (
                  <AccordionItem 
                    key={faq.id} 
                    value={faq.id}
                    className="bg-muted/30 rounded-lg border border-border shadow-sm hover:shadow-md transition-shadow"
                  >
                    <AccordionTrigger className="text-left font-semibold hover:no-underline py-5 px-6 text-lg data-[state=open]:text-primary [&[data-state=open]>svg]:text-primary">
                      <div className="flex items-center gap-3">
                        <MessageCircleQuestion className="h-6 w-6 text-primary/80" />
                        {faq.question}
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-5 pt-1 text-base leading-relaxed text-foreground/80 bg-card rounded-b-lg data-[state=open]:bg-muted/20">
                      <div dangerouslySetInnerHTML={{ __html: faq.answer.replace(/\n/g, '<br/>') }} />
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            )}

            {isClient && filteredFaqs.length === 0 && searchTerm && (
              <div className="text-center py-10">
                <AlertTriangle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-xl font-semibold text-foreground mb-2">Geen resultaten gevonden</p>
                <p className="text-muted-foreground">
                  Sorry, we konden geen antwoorden vinden voor "{searchTerm}". Probeer een andere zoekterm.
                </p>
              </div>
            )}

            <div className="text-center pt-10 border-t mt-12">
              <h3 className="text-xl font-semibold text-foreground mb-3">Staat uw vraag er niet bij?</h3>
              <p className="text-muted-foreground mb-6">
                  Ons support team helpt u graag verder.
              </p>
              <Button asChild>
                  <Link href="/contact">Neem Contact Op</Link>
              </Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
