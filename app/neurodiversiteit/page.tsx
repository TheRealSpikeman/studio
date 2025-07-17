// src/app/neurodiversiteit/page.tsx
"use client"; 

import React, { useState, useEffect, useRef } from 'react'; 
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Brain, Zap, Sparkles, Compass, ShieldAlert, Info, Users, CheckSquare, AlertTriangle, ExternalLink, BookHeart, MessageCircleQuestion, ImageUp, Link as LinkIcon } from 'lucide-react'; 
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription as AlertDescUi, AlertTitle as AlertTitleUi } from "@/components/ui/alert";
import type { ElementType, ReactNode } from 'react';
import { Input } from '@/components/ui/input'; 
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface NeurodiversitySectionDetail {
  subTitle: string;
  paragraphs: string[];
}

interface NeurodiversityTopic {
  id: string;
  title: string; 
  icon: ElementType;
  shortDescription?: string; 
  content?: string[]; 
  sections?: NeurodiversitySectionDetail[]; 
  imageUrl?: string;
  dataAiHint?: string;
  colorClass?: string;
  bgClass?: string;
}

// Default intro image is now the Firebase Storage URL for Diverse_colorful_brains_connected.png
const DEFAULT_INTRO_IMAGE_URL = "https://firebasestorage.googleapis.com/v0/b/neurodiversity-navigator.firebasestorage.app/o/Diverse_colorful_brains_connected.png?alt=media&token=34a3ce36-5a69-4f6f-99b2-5bb49b72c4ed";

const neurodiversityTopicsData: NeurodiversityTopic[] = [
  {
    id: "algemeen",
    title: "Wat is Neurodiversiteit?", 
    icon: Brain,
    sections: [ 
      {
        subTitle: "De Basis van Neurodiversiteit",
        paragraphs: [
          "Neurodiversiteit is het idee dat verschillen in hersenfunctie en gedragskenmerken normale variaties zijn binnen de menselijke bevolking. Net zoals we verschillen in lengte, haarkleur of talenten, zo verschillen onze breinen ook in hoe ze informatie verwerken, leren, en de wereld ervaren."
        ]
      },
      {
        subTitle: "Neurodivergentie vs. Neurotypisch",
        paragraphs: [
          "Termen zoals ADD/ADHD, autisme (ASS), hoogsensitiviteit (HSP), dyslexie en dyscalculie vallen onder de noemer neurodivergentie. Dit betekent dat de hersenen op een andere manier informatie verwerken dan wat als 'neurotypisch' (de meest voorkomende manier) wordt beschouwd."
        ]
      },
      {
        subTitle: "Een Kwestie van Erkenning en Waardering",
        paragraphs: [
          "Het is belangrijk om te onthouden dat neurodiversiteit geen ziekte of stoornis is die 'genezen' moet worden. Het gaat om het erkennen en waarderen van deze verschillen, het begrijpen van zowel de sterke kanten als de uitdagingen die hiermee gepaard kunnen gaan, en het creëren van een omgeving waarin iedereen kan floreren."
        ]
      }
    ],
    dataAiHint: "diverse brains connection" 
  },
  {
    id: "add",
    title: "Aandacht & Focus (vaak geassocieerd met ADD)",
    icon: Brain,
    shortDescription: "Mogelijke kenmerken zijn onoplettendheid, dromerigheid, en moeite met focus.",
    content: [
      "Kinderen en jongeren die patronen van onoplettendheid of dromerigheid herkennen (soms gerelateerd aan wat ADD wordt genoemd, vaak het overwegend onoplettende subtype van ADHD), kunnen moeite ervaren met aandacht en concentratie. Ze kunnen dromerig of afwezig lijken, en het lastig vinden om taken te starten of af te maken, vooral als deze minder boeiend of repetitief zijn. Eventuele hyperactiviteit is hierbij minder op de voorgrond of afwezig.",
      "Herkenbare punten voor ouders en jongeren kunnen zijn:",
      "- Moeite met het vasthouden van aandacht bij schoolwerk of spel.",
      "- Lijkt soms niet te luisteren als er direct gesproken wordt.",
      "- Instructies worden niet altijd goed opgevolgd en taken soms niet afgemaakt.",
      "- Moeite met het organiseren van taken en activiteiten.",
      "- Vermijdt, heeft een hekel aan of is onwillig om taken te doen die langdurige mentale inspanning vereisen.",
      "- Raakt vaak dingen kwijt die nodig zijn voor taken of activiteiten.",
      "- Is gemakkelijk afgeleid door externe prikkels.",
      "- Is soms vergeetachtig bij dagelijkse bezigheden."
    ],
    colorClass: "border-blue-500",
    bgClass: "bg-blue-50"
  },
  {
    id: "adhd",
    title: "Energie & Impulsiviteit (vaak geassocieerd met ADHD)",
    icon: Zap,
    shortDescription: "Mogelijke kenmerken zijn veel energie, bewegingsdrang en soms impulsief handelen.",
    content: [
      "Patronen van hyperactiviteit en impulsiviteit (soms gerelateerd aan wat ADHD wordt genoemd) kunnen invloed hebben op functioneren of ontwikkeling. Jongeren die dit herkennen, kunnen het lastig vinden om stil te zitten, op hun beurt te wachten, en impulsen te beheersen. Ze kunnen ook snel afgeleid zijn en moeite hebben met het organiseren van taken, naast de energetische en impulsieve aspecten.",
      "Herkenbare punten voor ouders en jongeren (hyperactiviteit/impulsiviteit) kunnen zijn:",
      "- Vaak onrustig bewegen met handen of voeten, of draaien op de stoel.",
      "- Vaak opstaan in situaties waar verwacht wordt dat men blijft zitten.",
      "- Soms rondrennen of overal op klimmen in situaties waarin dit minder gepast is.",
      "- Kan het moeilijk vinden rustig te spelen of zich bezig te houden met ontspannende activiteiten.",
      "- Is vaak 'in de weer' of lijkt 'maar door te draven'.",
      "- Praat soms excessief.",
      "- Gooit het antwoord er al uit voordat de vraag volledig gesteld is.",
      "- Heeft moeite op zijn/haar beurt te wachten.",
      "- Verstoort soms bezigheden van anderen of dringt zich op."
    ],
    colorClass: "border-orange-500",
    bgClass: "bg-orange-50"
  },
  {
    id: "hsp",
    title: "Prikkelverwerking & Empathie (vaak geassocieerd met HSP)",
    icon: Sparkles,
    shortDescription: "Diepgaande verwerking van prikkels, empathie en gevoeligheid voor omgeving.",
    content: [
      "Een hoge sensitiviteit voor prikkels (soms gerelateerd aan wat HSP wordt genoemd) betekent dat prikkels (zoals geluiden, licht, geuren, maar ook emoties van anderen) intenser en gedetailleerder kunnen worden waargenomen en verwerkt. Dit kan leiden tot een rijk innerlijk leven en grote empathie, maar ook tot snellere overprikkeling.",
      "Herkenbare punten voor ouders en jongeren kunnen zijn:",
      "- Subtiele details en nuances opmerken die anderen vaak ontgaan.",
      "- Gevoelig zijn voor stemmingen en emoties van anderen.",
      "- Overweldigd kunnen raken door fel licht, harde geluiden, sterke geuren of drukke omgevingen.",
      "- Vaak meer tijd nodig hebben om bij te komen na drukke of intense activiteiten.",
      "- Diep nadenken over dingen en vaak diepzinnige vragen stellen.",
      "- Vaak zorgzaam en gewetensvol zijn.",
      "- Moeite kunnen hebben met plotselinge veranderingen of verrassingen.",
      "- Gevoeliger kunnen zijn voor pijn, cafeïne of medicatie."
    ],
    colorClass: "border-purple-500",
    bgClass: "bg-purple-50"
  },
  {
    id: "ass",
    title: "Sociale & Sensorische Voorkeuren (vaak geassocieerd met ASS)",
    icon: Compass,
    shortDescription: "Behoefte aan structuur, specifieke interesses en een andere beleving van sociale interactie.",
    content: [
      "Een voorkeur voor structuur en een andere beleving van sociale en sensorische informatie (soms gerelateerd aan wat ASS wordt genoemd) kan invloed hebben op hoe iemand communiceert, sociale interacties aangaat en de wereld ervaart. Kinderen en jongeren die dit herkennen, hebben vaak een sterke behoefte aan structuur, routine en voorspelbaarheid. Ze kunnen intense, specifieke interesses hebben en informatie op een gedetailleerde manier verwerken.",
      "Herkenbare punten voor ouders en jongeren kunnen zijn:",
      "- Moeite met het initiëren of onderhouden van sociale interacties op een manier die als 'standaard' wordt gezien; kan soms onhandig overkomen.",
      "- Beperkter gebruik of begrip van non-verbale communicatie (oogcontact, gezichtsuitdrukkingen, gebaren).",
      "- Moeite met het ontwikkelen, onderhouden en begrijpen van relaties op de 'standaard' manier.",
      "- Sterke voorkeur voor routines en mogelijke weerstand tegen veranderingen.",
      "- Zeer specifieke, soms intense interesses.",
      "- Herhalende gedragingen of bewegingen (stereotypieën) kunnen voorkomen.",
      "- Over- of ondergevoeligheid voor zintuiglijke prikkels (geluid, licht, textuur, etc.).",
      "- Neiging tot letterlijk taalbegrip; soms moeite met sarcasme, ironie of figuurlijk taalgebruik."
    ],
    colorClass: "border-teal-500",
    bgClass: "bg-teal-50"
  },
  {
    id: "angst-depressie",
    title: "Stemmings- & Zorgpatronen (soms gerelateerd aan Angst & Depressie)",
    icon: ShieldAlert,
    shortDescription: "Mogelijke aanhoudende zorgen, somberheid, en impact op dagelijks functioneren.",
    content: [
      "Zorg- en stemmingspatronen komen vaak voor bij jongeren. Overmatige zorgen kunnen zich uiten in piekeren, nervositeit, vermijdingsgedrag en fysieke symptomen zoals hartkloppingen of buikpijn. Somberheid kan zich uiten in aanhoudend neerslachtige gevoelens, verlies van interesse of plezier, vermoeidheid en veranderingen in slaap of eetlust.",
      "Herkenbare punten bij zorgen/angst kunnen zijn:",
      "- Overmatige zorgen over alledaagse dingen (school, vrienden, gezondheid).",
      "- Rusteloosheid of een 'opgejaagd' gevoel.",
      "- Snel geïrriteerd zijn.",
      "- Moeite met concentreren.",
      "- Spierspanning, hoofdpijn, buikpijn zonder duidelijke medische oorzaak.",
      "- Slaapproblemen (moeite met inslapen, doorslapen, of onrustige slaap).",
      "- Vermijden van bepaalde situaties of plaatsen uit angst.",
      "Herkenbare punten bij somberheid kunnen zijn:",
      "- Aanhoudende sombere of prikkelbare stemming gedurende het grootste deel van de dag.",
      "- Duidelijk verminderde interesse of plezier in (bijna) alle activiteiten.",
      "- Significant gewichtsverlies (zonder dieet) of gewichtstoename, of verandering in eetlust.",
      "- Slaapproblemen (te veel of te weinig slapen).",
      "- Psychomotorische agitatie (onrust) of remming (traagheid), soms waarneembaar door anderen.",
      "- Vermoeidheid of verlies van energie.",
      "- Gevoelens van waardeloosheid of overmatige/onterechte schuldgevoelens.",
      "- Verminderd vermogen tot nadenken of concentreren, of besluiteloosheid.",
      "- Terugkerende gedachten aan de dood, suïcidale gedachten zonder specifiek plan, of een suïcidepoging of een specifiek plan daarvoor. Zoek direct professionele hulp als dit speelt."
    ],
    colorClass: "border-red-500",
    bgClass: "bg-red-50"
  }
];

export default function NeurodiversiteitPage() {
  const introTopic = neurodiversityTopicsData.find(topic => topic.id === "algemeen");

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-gradient-to-b from-background via-secondary/10 to-background py-12 md:py-20 lg:py-28">
        <div className="container mx-auto max-w-4xl"> 
          
          <div className="text-center mb-12 md:mb-16"> 
            <Brain className="mx-auto h-16 w-16 text-primary mb-4" />
            <h1 className="text-4xl font-bold text-foreground">Wat is Neurodiversiteit?</h1>
            <p className="text-lg text-muted-foreground mt-2">
              Een gids om de unieke denkstijlen en behoeften van jezelf of je kind beter te begrijpen.
            </p>
          </div>
          
          <div className="space-y-10 text-lg leading-relaxed text-foreground/90"> 
            {introTopic && (
              <section key={introTopic.id} className="grid md:grid-cols-2 gap-8 items-start mb-12">
                <div className="space-y-3">
                  {introTopic.sections?.map((section, sIndex) => (
                    <div key={sIndex} className={sIndex > 0 ? "mt-6" : ""}>
                      <h3 className="text-xl font-semibold text-primary mb-2">{section.subTitle}</h3>
                      {section.paragraphs.map((paragraph, pIndex) => (
                        <p key={pIndex} className="mb-2 last:mb-0 text-base text-muted-foreground leading-relaxed">{paragraph}</p>
                      ))}
                    </div>
                  ))}
                </div>
                <div className="space-y-4">
                  <div className="relative aspect-[4/3] rounded-lg overflow-hidden shadow-lg">
                    <Image
                        src={DEFAULT_INTRO_IMAGE_URL}
                        alt={introTopic.title || "Neurodiversiteit introductie afbeelding"}
                        fill
                        style={{ objectFit: 'cover' }}
                        data-ai-hint={introTopic.dataAiHint}
                        priority
                        unoptimized={DEFAULT_INTRO_IMAGE_URL.includes("firebasestorage.googleapis.com")}
                    />
                  </div>
                </div>
              </section>
            )}

            <Accordion type="single" collapsible className="w-full space-y-4">
              {neurodiversityTopicsData.filter(topic => topic.id !== "algemeen").map((topic) => {
                const IconComponent = topic.icon;
                return (
                  <AccordionItem 
                      key={topic.id} 
                      value={topic.id} 
                      className={`rounded-lg border-2 ${topic.colorClass || 'border-border'} ${topic.bgClass || 'bg-card'} shadow-md hover:shadow-lg transition-shadow`}
                  >
                    <AccordionTrigger className="text-left font-semibold hover:no-underline py-5 px-6 text-xl data-[state=open]:text-primary [&[data-state=open]>svg]:text-primary">
                      <div className="flex items-center gap-3">
                        <IconComponent className="h-7 w-7 text-primary" />
                        {topic.title}
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-6 pt-2 text-base leading-relaxed text-foreground/80 bg-card rounded-b-lg">
                      {topic.shortDescription && <p className="italic text-muted-foreground mb-4">{topic.shortDescription}</p>}
                      {topic.content?.map((paragraph, pIndex) => {
                          if (paragraph.startsWith("Herkenbare punten")) {
                              return <p key={pIndex} className="font-semibold mt-3 mb-1">{paragraph.replace(/Herkenbare punten voor ouders en jongeren:\s*|Herkenbare punten bij zorgen\/angst kunnen zijn:\s*|Herkenbare punten bij somberheid kunnen zijn:\s*/, '')}</p>;
                          }
                          if (paragraph.startsWith("- ")) { 
                              return <li key={pIndex} className="ml-5 list-disc">{paragraph.substring(2)}</li>;
                          }
                          return <p key={pIndex} className="mb-2">{paragraph}</p>;
                        })}
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
            
            <section className="mt-12 pt-8 border-t border-border">
                <h2 className="text-2xl font-semibold text-primary mb-4 flex items-center gap-2">
                  <MessageCircleQuestion className="h-7 w-7" />Professionele Hulp en Ondersteuning
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                  De informatie en tools op MindNavigator zijn bedoeld voor zelfinzicht, educatie en het bieden van praktische handvatten. Ze zijn <strong>niet</strong> bedoeld als vervanging voor professionele diagnostiek of behandeling.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-3">
                  Als u of uw kind worstelt met klachten, of als u een vermoeden heeft van een specifieke neurodivergente eigenschap en behoefte heeft aan een formele diagnose of gespecialiseerde begeleiding, is het belangrijk om contact op te nemen met een gekwalificeerde professional.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-1">U kunt hierbij denken aan:</p>
              <ul className="list-disc list-inside pl-5 space-y-1 text-muted-foreground leading-relaxed mb-4">
                  <li>Uw huisarts (voor een eerste gesprek en eventuele doorverwijzing)</li>
                  <li>Een kinderarts of jeugdarts</li>
                  <li>Een GZ-psycholoog, kinder- en jeugdpsycholoog of orthopedagoog</li>
                  <li>Gespecialiseerde centra voor diagnostiek en behandeling van bijvoorbeeld ADHD, autisme, etc.</li>
                  <li>De schoolbegeleidingsdienst of zorgcoördinator op school</li>
              </ul>
                <p className="text-muted-foreground leading-relaxed">
                  Zij kunnen een passend onderzoek doen, een eventuele diagnose stellen en adviseren over de best passende hulp en ondersteuning voor uw specifieke situatie.
                </p>
            </section>

            <Alert variant="destructive" className="mt-12 p-6 rounded-lg shadow-md">
                <AlertTriangle className="h-6 w-6" />
                <AlertTitleUi className="text-xl font-bold">Belangrijke Mededeling</AlertTitleUi>
                <AlertDescUi className="text-base leading-relaxed mt-2">
                  MindNavigator is ontworpen om inzicht en ondersteuning te bieden via zelfreflectie-instrumenten en educatieve content. Het is <strong>nadrukkelijk geen diagnostisch instrument</strong>. De informatie op deze pagina en de resultaten van onze tools zijn bedoeld voor educatieve doeleinden en zelfreflectie. Ze vervangen geen professioneel medisch of psychologisch advies.
                  <br /><br />
                  Als u zich zorgen maakt over de ontwikkeling, het gedrag of het welzijn van uzelf of uw kind, of als u een formele diagnose overweegt, adviseren wij u dringend om contact op te nemen met een gekwalificeerde professional. Zij kunnen u de juiste begeleiding en eventuele diagnostiek bieden. MindNavigator is niet aansprakelijk voor beslissingen genomen op basis van de hier verstrekte informatie.
                </AlertDescUi>
                  <Button asChild variant="link" className="p-0 h-auto text-destructive hover:text-destructive/80 mt-3">
                      <Link href="/contact">Neem contact op voor meer informatie of vragen <ExternalLink className="inline h-4 w-4 ml-1"/> </Link>
                  </Button>
            </Alert>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
