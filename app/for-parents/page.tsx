// src/app/for-parents/page.tsx
"use client";

import { useState } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ShieldCheck, Brain, MessageCircleQuestion, HeartHandshake, Users, ExternalLink, AlertTriangle, ArrowRight, Search, CheckCircle2, Compass, FileText } from '@/lib/icons';
import { Alert, AlertTitle as AlertTitleUi, AlertDescription as AlertDescriptionUi } from "@/components/ui/alert";
import { useToast } from '@/hooks/use-toast';
import { EditableImage } from '@/components/common/EditableImage';

const parentFaqs = [
  {
    question: "Wat is neurodiversiteit precies?",
    answer: "Neurodiversiteit betekent dat ieders brein uniek is en anders werkt. Net zoals er variatie is in haarkleur of lengte, is er ook variatie in hoe onze hersenen informatie verwerken, hoe we leren, en hoe we de wereld ervaren. Eigenschappen zoals aandachtspatronen, energielevels, prikkelgevoeligheid, en sociale voorkeuren zijn voorbeelden van neurodivergente profielen. MindNavigator helpt uw kind deze unieke eigenschappen te ontdekken als sterke punten en uitdagingen. Bekijk onze <a href='/neurodiversiteit' class='text-primary hover:underline font-medium'>uitgebreide informatiepagina over neurodiversiteit <ExternalLink class='inline-block h-4 w-4'/></a> voor meer details.",
  },
  {
    question: "Hoe helpt MindNavigator mijn kind?",
    answer: "Via laagdrempelige zelfreflectie-instrumenten krijgt uw kind inzicht in zijn of haar persoonlijke neurodiversiteitsprofiel. Dit overzicht biedt herkenning en concrete tips voor school, thuis en sociale situaties. Onze (premium) coaching-hub biedt dagelijkse ondersteuning met routines, reflectie en tools om zelfvertrouwen op te bouwen en beter om te gaan met uitdagingen.",
  },
  {
    question: "Is MindNavigator veilig en hoe zit het met privacy?",
    answer: "Veiligheid en privacy zijn voor ons van het grootste belang. We behandelen alle persoonlijke gegevens vertrouwelijk en conform de AVG/GDPR-richtlijnen. Resultaten van zelfreflectie-instrumenten zijn persoonlijk en worden niet zonder toestemming gedeeld. Voor betaalde abonnementen voor minderjarigen is altijd ouderlijke toestemming en betaling vereist. Lees meer in ons <a href='/privacy' class='text-primary hover:underline'>Privacybeleid <ExternalLink class='inline-block h-4 w-4'/></a>.",
  },
  {
    id: "faq-payment",
    question: "Wat als mijn kind professionele hulp nodig heeft?",
    answer: "MindNavigator is een tool voor zelfinzicht en ondersteuning, maar vervangt geen professionele diagnose of behandeling. Als u of uw kind zorgen heeft, raden wij altijd aan contact op te nemen met uw huisarts, een gekwalificeerde zorgverlener of een andere specialist. Meer informatie en verwijzingen vindt u ook op onze <a href='/neurodiversiteit' class='text-primary hover:underline font-medium'>neurodiversiteit pagina <ExternalLink class='inline h-4 w-4'/></a>.",
  },
  {
    question: "Hoe werkt de betaling voor een abonnement?",
    answer: "Als uw kind (jonger dan 18) een betaald abonnement kiest, vragen wij tijdens de registratie om uw e-mailadres. U ontvangt dan een e-mail met een beveiligde link om de betaling af te ronden en toestemming te geven. Pas na uw goedkeuring en betaling wordt het abonnement van de jongere volledig geactiveerd.",
  },
];


export default function ForParentsPage() {
  const { toast } = useToast();
  const [imageUrl, setImageUrl] = useState('https://firebasestorage.googleapis.com/v0/b/neurodiversity-navigator.firebasestorage.app/o/parents-2.png?alt=media&token=c8f9238e-81c7-46a3-9499-b36ba37a2e28');

  const handleImageSave = (newUrl: string) => {
    setImageUrl(newUrl);
    toast({
      title: 'Afbeelding opgeslagen!',
      description: 'De afbeelding is bijgewerkt.',
    });
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-gradient-to-b from-background via-secondary/10 to-background py-12 md:py-20 lg:py-28">
        <div className="container mx-auto max-w-4xl">
          
          <div className="text-center mb-12 md:mb-16">
            <Users className="mx-auto h-16 w-16 text-primary mb-4" />
            <h1 className="text-4xl font-bold text-foreground">Informatie voor Ouders</h1>
            <p className="text-lg text-muted-foreground mt-2">
              Ontdek hoe MindNavigator uw kind kan ondersteunen op hun reis naar zelfinzicht en groei.
            </p>
          </div>
          
          <div className="space-y-10 text-base leading-relaxed text-foreground/90">
            <section>
              <h2 className="text-2xl font-semibold text-primary mb-4 flex items-center gap-3">
                <Brain className="h-7 w-7" />
                Wat is MindNavigator?
              </h2>
              <p>
                MindNavigator is een online platform speciaal ontwikkeld voor jongeren (12-18 jaar) om hen te helpen hun neurodiversiteit te begrijpen. Door middel van interactieve zelfreflectie-instrumenten, persoonlijke overzichten en een (optionele) dagelijkse coaching-hub, bieden we tools en inzichten die bijdragen aan zelfbewustzijn, het herkennen van talenten en het omgaan met uitdagingen. Lees meer over <Link href='/neurodiversiteit' className='text-primary hover:underline font-medium'>wat neurodiversiteit precies inhoudt <ExternalLink className="inline-block h-4 w-4 align-text-bottom"/></Link> op onze infopagina.
              </p>
               <p className="mt-3">
                We focussen op een positieve benadering van neurodiversiteit, waarbij we de unieke manier van denken en leren van elk kind als een kracht zien.
              </p>
            </section>
            
            <section>
              <Card className="shadow-md border-primary/20 bg-primary/5">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-6 w-6 text-primary"/>
                    Ouder-specifieke Vragenlijsten
                  </CardTitle>
                  <CardDescription>
                    Naast de tools voor uw kind, bieden we ook vragenlijsten speciaal voor u als ouder. Krijg meer inzicht door vanuit uw perspectief te reflecteren.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button asChild>
                    <Link href="/for-parents/quizzes">
                      Bekijk alle vragenlijsten voor ouders <ArrowRight className="ml-2 h-4 w-4"/>
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </section>

            <div className="grid md:grid-cols-2 gap-8 items-center">
               <EditableImage
                  wrapperClassName="relative aspect-video rounded-lg overflow-hidden shadow-lg"
                  src={imageUrl}
                  alt="Ouder en kind die samen praten en leren"
                  fill
                  style={{ objectFit: 'cover' }}
                  data-ai-hint="parent child learning discussion"
                  onSave={handleImageSave}
                  uploadPath="images/website"
              />
              <section>
                  <h2 className="text-2xl font-semibold text-primary mb-4 flex items-center gap-3">
                  <HeartHandshake className="h-7 w-7" />
                  Hoe ondersteunen wij uw kind?
                  </h2>
                  <ul className="list-disc list-inside space-y-2 pl-5 text-base">
                      <li><strong>Zelfinzicht:</strong> Heldere overzichten die neurodivergente eigenschappen (zoals aandachtspatronen, gevoeligheid, sociale voorkeuren) uitleggen in begrijpelijke taal.</li>
                      <li><strong>Praktische Tips:</strong> Concrete strategieën voor school, thuis, en sociale situaties, afgestemd op hun leeftijd en profiel.</li>
                      <li><strong>Dagelijkse Groei:</strong> Via de (premium) coaching-hub dagelijkse affirmaties, reflectie-oefeningen en tools voor planning en focus.</li>
                      <li><strong>Positieve Benadering:</strong> We benadrukken sterke punten en helpen bij het ontwikkelen van copingmechanismen voor uitdagingen.</li>
                  </ul>
              </section>
            </div>
            
            <section>
              <Card className="bg-orange-50/70 border-2 border-primary/30 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3 mb-2">
                    <Search className="h-8 w-8 text-primary" />
                    <CardTitle className="text-2xl md:text-3xl font-bold text-primary">
                      NIEUW: Ouder-Kind Vergelijkende Analyse
                    </CardTitle>
                  </div>
                  <CardDescription className="text-base text-muted-foreground leading-relaxed">
                    Verkrijg dieper inzicht in de dynamiek tussen u en uw kind. Onze nieuwe module analyseert de resultaten van de "Ken je Kind" quiz (die u invult) en de zelfreflectie van uw kind.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 text-foreground/90">
                  <ul className="list-none space-y-2 pl-0">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span>Identificeer verschillen en overeenkomsten in perceptie.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span>Ontvang AI-gegenereerde tips voor betere communicatie.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span>Krijg een concreet familie actieplan met haalbare stappen.</span>
                    </li>
                  </ul>
                  <div className="pt-4">
                    <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground">
                      <Link href="/for-parents/vergelijkende-analyse">
                        Lees meer over de Vergelijkende Analyse <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-primary mb-4 flex items-center gap-3">
                <ShieldCheck className="h-7 w-7" />
                Veiligheid & Privacy
              </h2>
              <p>
                De veiligheid en privacy van uw kind staan bij ons voorop. We voldoen aan de AVG (GDPR) en zorgen voor een beveiligde omgeving. Persoonlijke resultaten van de tools zijn strikt vertrouwelijk. Voor jongeren onder de 18 jaar is voor betaalde diensten altijd uw toestemming en betalingsafhandeling nodig. U kunt hierover meer lezen in ons <Link href="/privacy" className="text-primary hover:underline font-medium">Privacybeleid <ExternalLink className="inline-block h-4 w-4 align-text-bottom"/></Link>.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-primary mb-4 flex items-center gap-3">
                <AlertTriangle className="h-7 w-7 text-destructive" /> {/* Icoon blijft destructive voor nadruk */}
                Belangrijk: MindNavigator en Professionele Hulp
              </h2>
              <p>
                MindNavigator is een platform voor zelfinzicht en biedt ondersteunende tools. Het is <strong>geen</strong> vervanging voor professionele diagnostiek of medische hulp. Indien u of uw kind specifieke zorgen heeft of een diagnose overweegt, raden wij u ten zeerste aan contact op te nemen met uw huisarts of een gekwalificeerde zorgverlener. Zij kunnen u adviseren over de juiste stappen en eventuele doorverwijzingen. Lees ook onze <Link href="/disclaimer" className="text-primary hover:underline font-medium">volledige disclaimer <ExternalLink className="inline-block h-4 w-4 align-text-bottom"/></Link>.
              </p>
            </section>

            <section id="faq-payment">
              <Card className="shadow-md border-border">
                <CardHeader>
                  <h2 className="text-2xl font-semibold text-primary mb-4 flex items-center gap-3">
                    <MessageCircleQuestion className="h-7 w-7" />
                    Veelgestelde Vragen door Ouders
                  </h2>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full space-y-3">
                    {parentFaqs.map((faq, index) => (
                      <AccordionItem 
                        key={index} 
                        value={`parent-faq-${index}`}
                        className="bg-muted/30 rounded-md border border-border"
                      >
                        <AccordionTrigger className="text-left font-medium hover:no-underline py-4 px-5 text-lg data-[state=open]:text-primary [&[data-state=open]>svg]:text-primary">
                          {faq.question}
                        </AccordionTrigger>
                        <AccordionContent className="px-5 pb-4 pt-1 text-base leading-relaxed text-foreground/80 bg-card rounded-b-lg data-[state=open]:bg-muted/20">
                          <p dangerouslySetInnerHTML={{ __html: faq.answer }} />
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            </section>

            <section className="text-center border-t border-border pt-12 mt-12">
              <h2 className="text-2xl font-semibold text-foreground mb-3">Heeft u nog vragen?</h2>
              <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
                  We staan klaar om uw vragen te beantwoorden en u meer te vertellen over hoe MindNavigator uw kind kan helpen.
              </p>
              <Button size="lg" asChild>
                  <Link href="/contact">Neem contact met ons op</Link>
              </Button>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
