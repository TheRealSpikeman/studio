
// src/app/for-parents/voorbeeld-analyse-rapport/page.tsx
"use client";

import React, { type ElementType } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
    ArrowLeft,
    Users,
    Lightbulb,
    MessageCircle,
    ThumbsUp,
    EyeOff,
    ClipboardList,
    AlertTriangle,
    CheckSquare,
    Info,
    HeartHandshake
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle as AlertTitleUi } from "@/components/ui/alert";

interface ReportSectionProps {
  title: string;
  Icon: ElementType;
  children: React.ReactNode;
  iconColorClass?: string;
}

const ReportSection: React.FC<ReportSectionProps> = ({ title, Icon, children, iconColorClass = "text-primary" }) => (
  <div className="mb-8">
    <h2 className={`text-2xl font-semibold text-foreground mb-4 flex items-center gap-3`}>
      <Icon className={`h-7 w-7 ${iconColorClass}`} />
      {title}
    </h2>
    <Card className="bg-muted/30 border shadow-sm">
      <CardContent className="p-6 text-base leading-relaxed text-foreground/90 space-y-3">
        {children}
      </CardContent>
    </Card>
  </div>
);

export default function VoorbeeldAnalyseRapportPage() {
  const childName = "Sofie"; // Voorbeeld naam

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-gradient-to-b from-background via-secondary/5 to-background py-12 md:py-16 lg:py-20">
        <div className="container mx-auto max-w-3xl">
          <Button variant="outline" asChild className="mb-6">
            <Link href="/for-parents/vergelijkende-analyse">
              <ArrowLeft className="mr-2 h-4 w-4" /> Terug naar uitleg Vergelijkende Analyse
            </Link>
          </Button>

          <Card className="shadow-xl">
            <CardHeader className="text-center pb-8">
              <HeartHandshake className="mx-auto h-16 w-16 text-primary mb-4" />
              <CardTitle className="text-3xl font-bold text-foreground">
                Voorbeeldrapport: Vergelijkende Analyse
              </CardTitle>
              <CardDescription className="text-lg text-muted-foreground mt-2">
                Inzichten voor u en {childName}, gebaseerd op de "Ken je Kind" quiz en {childName}'s Zelfreflectie.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <ReportSection title="1. Perceptie Gaten: Waar Zien Jullie Dingen Anders?" Icon={EyeOff} iconColorClass="text-orange-600">
                <ul className="list-disc list-inside space-y-2 pl-2">
                  <li>
                    <strong>Focus op School:</strong> U geeft aan dat {childName} vaak moeite heeft met concentreren op schoolwerk. {childName} zelf ervaart dit minder als een probleem, en geeft aan dat het meer afhangt van de interesse in het vak.
                    <p className="text-xs text-muted-foreground pl-4 mt-1"><em>Mogelijkheid: Het verschil kan liggen in de definitie van 'focus' of de momenten waarop u {childName} observeert.</em></p>
                  </li>
                  <li>
                    <strong>Sociale Interacties:</strong> U ziet {childName} als soms wat terughoudend in nieuwe groepen. {childName} beschrijft zichzelf als selectief in vriendschappen, maar comfortabel met de vrienden die ze heeft.
                    <p className="text-xs text-muted-foreground pl-4 mt-1"><em>Mogelijkheid: Dit kan duiden op een introverte aard die door u als verlegenheid wordt geïnterpreteerd.</em></p>
                  </li>
                   <li>
                    <strong>Omgaan met Verandering:</strong> U merkt dat {childName} van slag raakt bij onverwachte veranderingen. {childName} geeft aan dat dit vooral geldt voor grote veranderingen, maar kleine aanpassingen wel prima vindt.
                  </li>
                </ul>
              </ReportSection>

              <Separator />

              <ReportSection title="2. Gedeelde Sterktes: Wat Zien Jullie Beiden Positief?" Icon={ThumbsUp} iconColorClass="text-green-600">
                 <ul className="list-disc list-inside space-y-2 pl-2">
                  <li>
                    <strong>Creativiteit:</strong> Zowel u als {childName} benoemen haar creatieve talenten. U noemt haar tekenvaardigheid, {childName} haar vermogen om originele verhalen te bedenken.
                    <p className="text-xs text-muted-foreground pl-4 mt-1"><em>Tip: Stimuleer deze gedeelde kracht door samen creatieve projecten te doen of haar ruimte te geven voor haar creatieve uitingen.</em></p>
                  </li>
                  <li>
                    <strong>Doorzettingsvermogen:</strong> U ziet dat {childName} kan doorzetten als ze iets echt wil. {childName} is trots op het feit dat ze een moeilijk project voor school heeft afgemaakt.
                  </li>
                  <li>
                    <strong>Behulpzaamheid:</strong> U waardeert hoe {childName} helpt in huis. {childName} geeft aan graag anderen te helpen.
                  </li>
                </ul>
              </ReportSection>

              <Separator />

              <ReportSection title="3. Blinde Vlekken: Wat Mist Mogelijk Eén Partij?" Icon={Lightbulb} iconColorClass="text-yellow-500">
                <ul className="list-disc list-inside space-y-2 pl-2">
                  <li>
                    <strong>Impact van Prikkels (Kind Perspectief):</strong> {childName} geeft aan soms overprikkeld te raken door geluid in de klas, iets wat u mogelijk minder direct opmerkt.
                    <p className="text-xs text-muted-foreground pl-4 mt-1"><em>Reflectiepunt: Observeer {childName}'s reactie op drukke omgevingen en bespreek of ze strategieën nodig heeft om hiermee om te gaan.</em></p>
                  </li>
                  <li>
                    <strong>Behoefte aan Erkenning (Ouder Perspectief):</strong> U geeft aan dat {childName} soms onzeker kan zijn, terwijl {childName} dit zelf niet direct als een groot punt noemt in haar zelfreflectie.
                     <p className="text-xs text-muted-foreground pl-4 mt-1"><em>Reflectiepunt: {childName} is zich mogelijk niet bewust van hoe haar onzekerheid overkomt, of u interpreteert haar gedrag als onzekerheid terwijl zij dit anders ervaart.</em></p>
                  </li>
                </ul>
              </ReportSection>

              <Separator />

              <ReportSection title="4. Communicatie Kansen: Hoe Beter Afstemmen?" Icon={MessageCircle} iconColorClass="text-blue-600">
                <ul className="list-disc list-inside space-y-2 pl-2">
                  <li>
                    Praat met {childName} over het verschil in beleving rondom 'focus op school'. Vraag haar: "Wat helpt jou om je aandacht bij een taak te houden? En wanneer vind je het lastig?"
                  </li>
                  <li>
                    Erken haar selectiviteit in vriendschappen. Vraag: "Wat vind je fijn aan je huidige vrienden? En wat zoek je in een vriendschap?"
                  </li>
                  <li>
                    Bespreek samen hoe jullie kunnen omgaan met 'overprikkeling'. Vraag: "Zijn er momenten dat het te druk voor je is? Wat zou je dan helpen?"
                  </li>
                   <li>
                    Geef specifieke complimenten over haar doorzettingsvermogen en creativiteit om haar zelfbeeld te versterken.
                  </li>
                </ul>
              </ReportSection>

              <Separator />

              <ReportSection title="5. Familie Actieplan: Concreet & Haalbaar" Icon={ClipboardList} iconColorClass="text-purple-600">
                 <ul className="list-disc list-inside space-y-2 pl-2">
                  <li>
                    <strong>Wekelijks Creatief Uurtje:</strong> Plan één keer per week een moment waarop {childName} (en eventueel u) tijd besteedt aan een creatieve activiteit naar keuze.
                  </li>
                  <li>
                    <strong>"Focus Plan" Samen Maken:</strong> Bekijk samen met {childName} haar huiswerkplanning. Bespreek welke vakken meer focus vragen en hoe ze pauzes kan inplannen.
                  </li>
                  <li>
                    <strong>"Prikkel Thermometer" Introduceren:</strong> Maak (visueel) afspraken over hoe {childName} kan aangeven dat ze overprikkeld raakt en wat ze dan nodig heeft (bijv. even rust op haar kamer).
                  </li>
                </ul>
              </ReportSection>

               <Separator />

              <ReportSection title="6. Belangrijke Overwegingen" Icon={Info} iconColorClass="text-foreground">
                 <ul className="list-disc list-inside space-y-2 pl-2">
                  <li>
                    Dit rapport is een momentopname en bedoeld als startpunt voor gesprek en begrip. Het is geen diagnostisch instrument.
                  </li>
                  <li>
                    De percepties van zowel u als {childName} zijn waardevol. Er is geen 'goed' of 'fout'.
                  </li>
                  <li>
                    Blijf open communiceren en observeer hoe {childName} zich ontwikkelt. Pas strategieën aan waar nodig.
                  </li>
                  <li>
                    Overweeg professionele begeleiding als u zich zorgen blijft maken of als specifieke uitdagingen aanhouden. MindNavigator kan u helpen een passende coach of tutor te vinden.
                  </li>
                </ul>
              </ReportSection>

              <Alert variant="default" className="mt-8 bg-primary/5 border-primary/20">
                  <AlertTriangle className="h-5 w-5 !text-primary" />
                  <AlertTitleUi className="text-primary font-semibold">Let op: Voorbeeld Data</AlertTitleUi>
                  <AlertDescUi className="text-foreground/80">
                    De inhoud van dit rapport is fictief en dient puur ter illustratie van de structuur en het soort inzichten dat u kunt verwachten van de Vergelijkende Analyse. Echte rapporten worden gegenereerd op basis van de daadwerkelijk ingevulde quizzen.
                  </AlertDescUi>
              </Alert>

            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
