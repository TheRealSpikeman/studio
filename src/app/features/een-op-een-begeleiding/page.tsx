
"use client";

import React, { type ReactNode, type ElementType } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { 
  GraduationCap, Brain, Zap, BookOpenCheck, MessageSquareText, ShieldCheck, ExternalLink, ArrowRight, 
  Users, Search, MessageCircle, CalendarDays, Settings, Eye, CheckCircle2, AlertTriangle, Info, Target,
  ThumbsUp, Edit2Icon, Lightbulb, HelpCircle, Sparkles, Compass, BookHeart, MessageCircleQuestion, Lock, Wallet,
  Video, ListChecks, UserCheck as UserCheckIcon, HeartHandshake, PieChart
} from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Alert, AlertTitle as AlertTitleUi, AlertDescription as AlertDescUi } from "@/components/ui/alert";
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';


const allFeatures = [
  { title: 'Gepersonaliseerde Inzichten', link: '/features/gepersonaliseerde-inzichten', icon: Brain },
  { title: 'Coaching & Tools voor Groei', link: '/features/coaching-en-tools', icon: Zap },
  { title: 'Huiswerkondersteuning', link: '/features/huiswerkondersteuning', icon: BookOpenCheck },
  { title: '1-op-1 Begeleiding (Optioneel)', link: '/features/een-op-een-begeleiding', icon: GraduationCap },
  { title: 'Ouder Dashboard & Communicatie', link: '/features/ouder-dashboard', icon: MessageSquareText },
  { title: 'Veilig & Deskundig Platform', link: '/features/veilig-platform', icon: ShieldCheck },
];

const faqItems = [
  {
    id: "faq-klik",
    question: "Wat als mijn kind niet klikt met de begeleider?",
    answer: "Een goede klik is essentieel. Na het gratis kennismakingsgesprek kunt u meestal 1-2 sessies proberen. Mocht er geen klik zijn, dan kunt u eenvoudig op zoek naar een andere begeleider via het platform. Er zijn geen langdurige verplichtingen per begeleider."
  },
  {
    id: "faq-frequentie",
    question: "Hoe vaak zijn de sessies en hoe lang duren ze?",
    answer: "Dit bepaalt u in overleg met de begeleider, afgestemd op de behoeften van uw kind. Sessies duren meestal 45-60 minuten. De frequentie kan variëren van wekelijks tot tweewekelijks of incidenteel, afhankelijk van de doelen."
  },
  {
    id: "faq-privacy-toggle",
    question: "Kan ik het delen van informatie met een begeleider later weer stopzetten?",
    answer: "Ja, absoluut. Via uw Ouder Dashboard kunt u per kind en per gekoppelde begeleider de privacy-instellingen op elk moment eenvoudig aanpassen. U behoudt volledige controle over welke informatie gedeeld wordt."
  },
  {
    id: "faq-veiligheid-communicatie",
    question: "Is de communicatie en het delen van informatie veilig?",
    answer: "Ja, alle communicatie via het platform, inclusief eventuele video-oproepen voor sessies, is versleuteld. Begeleiders zien alleen de informatie die u expliciet met hen deelt via de privacy-instellingen. We hechten veel waarde aan de veiligheid en privacy van uw gegevens."
  },
  {
    id: "faq-annuleren",
    question: "Kan ik een geplande sessie annuleren?",
    answer: "Ja, dat kan. De meeste begeleiders hanteren een annuleringsbeleid waarbij u tot 24 uur van tevoren kosteloos kunt annuleren. Bij annulering binnen 24 uur of bij een no-show kunnen kosten in rekening worden gebracht. In geval van onvoorziene omstandigheden of noodgevallen is er vaak flexibiliteit in overleg met de begeleider."
  }
];

const howItWorksSteps = [
  { num: 1, icon: Search, title: "Zoek & Match", content: "Filter op specialiteit, prijs en beschikbaarheid. Bekijk profielen, ervaring en reviews. Vergelijk tarieven (wat u ziet = wat u betaalt)." },
  { num: 2, icon: MessageCircle, title: "Kennismaking", content: "Gratis 15-minuten gesprek. Bespreek doelen en werkwijze. Voel of er een 'klik' is." },
  { num: 3, icon: Lock, title: "Privacy Instellen", content: "U bepaalt wat u deelt: 'Ken je Kind' assessment, onboarding resultaten, platform voortgang. Per coach/begeleider apart instelbaar en altijd wijzigbaar." },
  { num: 4, icon: CalendarDays, title: "Sessies Plannen", content: "Boek direct via platform. Automatische herinneringen. Beveiligde video-oproepen. Flexibele tijden." }
];

const whyOurGuidanceItems = [
    { icon: Sparkles, title: "Voor Uw Kind", items: ["100% persoonlijke aandacht", "Eigen tempo, geen groepsdruk", "Vertrouwde thuisomgeving", "Aanpak op maat"] },
    { icon: Users, title: "Voor U (Ouders)", items: ["Transparante prijzen", "Flexibele planning", "Kwaliteitsgarantie (VOG, intake)", "Volledige privacy-controle"] },
    { icon: CheckCircle2, title: "Toegevoegde Waarde", items: ["Assessment inzichten direct bruikbaar", "Alle administratie geregeld", "Continue kwaliteitsbewaking", "24/7 klantenservice"] },
];


export default function EenOpEenBegeleidingPage() {
  const featureTitle = "1-op-1 Begeleiding bij MindNavigator";
  const FeatureIcon = GraduationCap;
  const currentLink = "/features/een-op-een-begeleiding";

  const otherFeatures = allFeatures.filter(feature => feature.link !== currentLink);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-gradient-to-b from-background via-secondary/5 to-background py-12 md:py-20 lg:py-28">
        <div className="container mx-auto max-w-4xl">
          
          <div className="text-center mb-12 md:mb-16">
            <Link href="/#platform-features-overview" aria-label={`Terug naar feature overzicht: ${featureTitle}`}>
              <FeatureIcon className="mx-auto h-16 w-16 text-primary mb-4 cursor-pointer transition-transform hover:scale-110" />
            </Link>
            <h1 className="text-4xl font-bold text-foreground">{featureTitle}</h1>
            <p className="text-lg text-muted-foreground mt-2">
              Persoonlijke ondersteuning voor uw neurodivergente kind.
            </p>
          </div>
          
          <div className="space-y-10 text-base leading-relaxed text-foreground/90">
            <section className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                    <h2 className="text-2xl font-semibold text-primary mb-4 flex items-center gap-3">
                        <HeartHandshake className="h-7 w-7" />
                        Gerichte Ondersteuning op Maat
                    </h2>
                    <p className="mb-4">
                        Soms is er naast digitale tools behoefte aan directe, persoonlijke begeleiding. MindNavigator verbindt u met gekwalificeerde tutors voor huiswerkondersteuning en ervaren coaches (psychologen/orthopedagogen) voor diepgaandere begeleiding. Alle begeleiders zijn VOG-gescreend en hebben affiniteit met neurodiversiteit.
                    </p>
                    <p>
                        Deze 1-op-1 sessies, online via ons platform, bieden een veilige en vertrouwde omgeving waarin uw kind kan werken aan specifieke leerdoelen, sociale vaardigheden of persoonlijke groei.
                    </p>
                </div>
                <div className="relative aspect-video rounded-lg overflow-hidden shadow-lg">
                    <Image
                        src="https://placehold.co/600x400.png"
                        alt="Begeleider die online een kind helpt"
                        fill
                        style={{ objectFit: 'cover' }}
                        data-ai-hint="online tutor student session"
                    />
                </div>
            </section>

            <Card className="shadow-lg bg-primary/5 border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-2xl text-primary">
                    <GraduationCap className="h-7 w-7" />De Kern van Onze 1-op-1 Begeleiding
                </CardTitle>
                <CardDescription>
                    Ontdek hoe MindNavigator u en uw kind ondersteunt met persoonlijke begeleiding.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                    <h3 className="text-xl font-semibold text-foreground mb-3 flex items-center gap-2"><PieChart className="h-6 w-6 text-accent"/>Twee Soorten Begeleiding</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                        <Card className="bg-card border">
                          <CardHeader className="pb-2"><CardTitle className="text-lg font-medium text-blue-700 flex items-center gap-2"><BookOpenCheck className="h-6 w-6"/>Online Huiswerk Begeleiding</CardTitle></CardHeader>
                          <CardContent className="text-sm text-muted-foreground space-y-1"><p>Voor praktische schoolondersteuning (planning, vakinhoud, leerstrategieën).</p></CardContent>
                        </Card>
                        <Card className="bg-card border">
                          <CardHeader className="pb-2"><CardTitle className="text-lg font-medium text-green-700 flex items-center gap-2"><Brain className="h-6 w-6"/>Coaching met Psychologen</CardTitle></CardHeader>
                          <CardContent className="text-sm text-muted-foreground space-y-1"><p>Voor diepere ondersteuning bij persoonlijke uitdagingen, emoties en ontwikkeling.</p></CardContent>
                        </Card>
                    </div>
                </div>
                <Separator />
                <div>
                    <h3 className="text-xl font-semibold text-foreground mb-3 flex items-center gap-2"><ListChecks className="h-6 w-6 text-accent"/>Hoe Het Werkt</h3>
                    <div className="space-y-3">
                        {howItWorksSteps.map(step => (
                          <div key={step.num} className="flex items-start gap-3 p-3 bg-card border rounded-md">
                            <div className="flex-shrink-0 h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-md font-bold">{step.num}</div>
                            <div>
                              <h4 className="text-md font-semibold text-foreground flex items-center gap-1.5 mb-0.5"><step.icon className="h-4 w-4"/>{step.title}</h4>
                              <p className="text-xs text-muted-foreground">{step.content}</p>
                            </div>
                          </div>
                        ))}
                    </div>
                </div>
                 <Separator />
                 <div>
                    <h3 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2"><ShieldCheck className="h-6 w-6 text-accent"/>Waarom Onze 1-op-1 Begeleiding?</h3>
                    <div className="grid md:grid-cols-3 gap-4">
                        {whyOurGuidanceItems.map(item => (
                             <Card key={item.title} className="bg-card border p-4">
                                <CardTitle className="text-md font-medium text-foreground flex items-center gap-2 mb-2"><item.icon className="h-5 w-5 text-primary"/>{item.title}</CardTitle>
                                <ul className="list-none space-y-1 text-xs text-muted-foreground">
                                    {item.items.map(point => <li key={point} className="flex items-start gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-green-500 flex-shrink-0 mt-0.5"/>{point}</li>)}
                                </ul>
                            </Card>
                        ))}
                    </div>
                </div>
              </CardContent>
            </Card>
            
            <section>
              <h2 className="text-2xl font-semibold text-primary mb-4 flex items-center gap-3"><Wallet className="h-7 w-7"/>Transparante Prijzen</h2>
              <Card className="bg-yellow-50/70 border-yellow-200">
                <CardContent className="p-6 space-y-3">
                  <h3 className="text-xl font-semibold text-yellow-700 flex items-center gap-2"><Info className="h-6 w-6"/>Geen Verborgen Kosten</h3>
                  <p className="text-yellow-800">
                    Begeleider vraagt €50/uur → U betaalt €50/uur <br/>
                    Coach vraagt €90/uur → U betaalt €90/uur
                  </p>
                  <div className="pt-3 mt-3 border-t border-yellow-300">
                    <h4 className="text-lg font-semibold text-yellow-700 flex items-center gap-2 mb-1"><Settings className="h-5 w-5"/>Wat MindNavigator Regelt</h4>
                    <p className="text-xs text-yellow-800">Voor 6% commissie (betaald door de begeleider/coach, niet door u) verzorgen wij:</p>
                    <ul className="list-disc list-inside pl-4 text-xs text-yellow-800 space-y-0.5 mt-1">
                      <li>Beveiligde betalingen via iDEAL/Creditcard</li>
                      <li>Stabiele en beveiligde video-oproepen</li>
                      <li>Planningstool met automatische herinneringen</li>
                      <li>Kwaliteitsbewaking en VOG-check</li>
                      <li>Ondersteuning bij geschillen</li>
                      <li>Facturatie en administratie</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-primary mb-4 flex items-center gap-3"><Compass className="h-7 w-7"/>Voorbeeld Zoektocht</h2>
              <Alert variant="default" className="bg-indigo-50/70 border-indigo-200">
                <UserCheckIcon className="h-5 w-5 !text-indigo-600" />
                <AlertTitleUi className="text-indigo-700 font-semibold">Situatie: 14-jarige zoon, herkent ADHD-kenmerken, wiskunde problemen</AlertTitleUi>
                <AlertDescUi className="text-indigo-800 space-y-1 text-sm">
                  <p><strong>Zoek:</strong> "Huiswerkbegeleiding + ADHD + Wiskunde" → 12 resultaten.</p>
                  <p><strong>Filter:</strong> €30-50/uur, na schooltijd → 5 resultaten.</p>
                  <p><strong>Keuze:</strong> Lisa - Wiskundeleraar, 8 jaar ervaring met ADHD, €45/uur ⭐⭐⭐⭐⭐.</p>
                  <p><strong>Privacy:</strong> U deelt de "Ken je Kind" assessment met Lisa voor een gerichte aanpak.</p>
                  <p><strong>Resultaat:</strong> Lisa start direct met visuele wiskundetechnieken die passen bij zijn leerstijl.</p>
                </AlertDescUi>
              </Alert>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-primary mb-4 flex items-center gap-3"><MessageCircleQuestion className="h-7 w-7"/>Veelgestelde Vragen</h2>
              <Accordion type="single" collapsible className="w-full space-y-3">
                {faqItems.map((faq) => (
                  <AccordionItem key={faq.id} value={faq.id} className="bg-muted/40 rounded-lg border">
                    <AccordionTrigger className="text-left font-medium hover:no-underline py-4 px-5 text-lg data-[state=open]:text-primary [&[data-state=open]>svg]:text-primary">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="px-5 pb-4 pt-1 text-base leading-relaxed text-foreground/80">
                      <p>{faq.answer}</p>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </section>
            
            <section className="text-center mt-16 pt-10 border-t">
              <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl mb-4">
                Klaar voor <span className="text-primary">persoonlijke ondersteuning</span>?
              </h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
                Vind de perfecte tutor of coach die aansluit bij de unieke behoeften van uw kind.
              </p>
              <Button size="lg" asChild className="shadow-md hover:shadow-lg transition-shadow">
                <Link href="/dashboard/ouder/zoek-professional">
                  Zoek een Tutor of Coach <ArrowRight className="ml-2 h-5 w-5"/>
                </Link>
              </Button>
            </section>

            <div className="mt-16 pt-10 border-t border-border">
              <h4 className="text-xl font-semibold text-foreground mb-6 text-center">Ontdek ook onze andere features:</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                {otherFeatures.map(feature => (
                  <Button
                    key={feature.link}
                    variant="link"
                    asChild
                    className="p-0 h-auto justify-start text-left text-base text-primary hover:text-accent group"
                  >
                    <Link href={feature.link} className="inline-flex items-center gap-2">
                      <feature.icon className="h-5 w-5 text-primary/80 group-hover:text-accent transition-colors" />
                      <span>{feature.title}</span>
                      <ArrowRight className="ml-auto h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity group-hover:translate-x-1" />
                    </Link>
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

