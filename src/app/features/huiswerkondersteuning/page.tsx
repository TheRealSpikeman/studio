
// src/app/features/huiswerkondersteuning/page.tsx
"use client";

import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import {
  BookOpenCheck, Brain, Zap, GraduationCap, MessageSquareText, ShieldCheck, ExternalLink, ArrowRight,
  CalendarCheck, Timer, Lightbulb, Sparkles, CheckCircle2, ClipboardList
} from 'lucide-react';
import { cn } from '@/lib/utils';

// This should probably be in a shared file, but for a single page it's ok here.
const allFeatures = [
  { title: 'Gepersonaliseerde Inzichten', link: '/features/gepersonaliseerde-inzichten', icon: Brain },
  { title: 'Coaching & Tools voor Groei', link: '/features/coaching-en-tools', icon: Zap },
  { title: 'Huiswerkondersteuning', link: '/features/huiswerkondersteuning', icon: BookOpenCheck },
  { title: '1-op-1 Begeleiding (Optioneel)', link: '/features/een-op-een-begeleiding', icon: GraduationCap },
  { title: 'Ouder Dashboard & Communicatie', link: '/features/ouder-dashboard', icon: MessageSquareText },
  { title: 'Veilig & Deskundig Platform', link: '/features/veilig-platform', icon: ShieldCheck },
];

const homeworkFeatures = [
  {
    icon: CalendarCheck,
    title: "Overzichtelijke Planningstools",
    description: "Digitale planners en schema's helpen bij het organiseren van huiswerk, toetsen en projecten, wat zorgt voor minder stress en meer overzicht."
  },
  {
    icon: Timer,
    title: "Focus Technieken",
    description: "Hulp bij het toepassen van bewezen methoden zoals de Pomodoro-techniek om concentratie te verbeteren en afleiding te verminderen."
  },
  {
    icon: Lightbulb,
    title: "Slimme Studievaardigheden",
    description: "Praktische strategieën voor effectief leren, samenvatten, en voorbereiden op toetsen, afgestemd op verschillende leerstijlen."
  },
  {
    icon: ClipboardList,
    title: "Vakspecifieke Hulpmiddelen",
    description: "Toegang tot een geselecteerde bibliotheek van online bronnen, uitlegvideo's en oefeningen per vak (indien beschikbaar)."
  }
];

export default function HuiswerkondersteuningPage() {
  const featureTitle = "Huiswerkondersteuning";
  const FeatureIcon = BookOpenCheck;
  const currentLink = "/features/huiswerkondersteuning";

  const otherFeatures = allFeatures.filter(feature => feature.link !== currentLink);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-gradient-to-b from-background via-secondary/10 to-background py-12 md:py-20 lg:py-28">
        <div className="container mx-auto max-w-4xl">

          <div className="text-center mb-12 md:mb-16">
            <Link href="/#platform-features-overview" aria-label={`Terug naar feature overzicht: ${featureTitle}`}>
              <FeatureIcon className="mx-auto h-16 w-16 text-primary mb-4 cursor-pointer transition-transform hover:scale-110" />
            </Link>
            <h1 className="text-4xl font-bold text-foreground">{featureTitle}</h1>
            <p className="text-lg text-muted-foreground mt-2 max-w-2xl mx-auto">
              Effectieve tools en strategieën om studie-uitdagingen te overwinnen.
            </p>
          </div>

          <div className="space-y-10 text-base leading-relaxed text-foreground/90">
            <section>
              <p className="mb-4">
                Schoolwerk kan soms een uitdaging zijn, zeker voor neurodivergente jongeren. MindNavigator biedt praktische huiswerkondersteuning die is afgestemd op de individuele leerstijl en behoeften van uw kind, met als doel zelfstandigheid en zelfvertrouwen te bevorderen.
              </p>
              <p>
                We bieden geen kant-en-klare antwoorden, maar reiken de juiste tools en strategieën aan om het leerproces zelf in handen te nemen. Dit helpt niet alleen bij het huidige huiswerk, maar bouwt ook vaardigheden op voor de toekomst.
              </p>
            </section>

            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="relative aspect-video rounded-lg overflow-hidden shadow-lg">
                  <Image
                      src="https://placehold.co/600x400.png"
                      alt="Student die geconcentreerd aan een bureau werkt met een planner"
                      fill
                      style={{ objectFit: 'cover' }}
                      data-ai-hint="student planning homework"
                  />
              </div>
              <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-primary flex items-center gap-2">
                      <Sparkles className="h-6 w-6"/>Van Overweldigd naar Overzicht
                  </h3>
                  <p>Onze tools zijn ontworpen om structuur te bieden en het leerproces te vereenvoudigen:</p>
                  <ul className="list-disc list-inside space-y-1.5 pl-5">
                      <li>Breek grote projecten op in kleine, haalbare taken.</li>
                      <li>Leer effectief plannen om last-minute stress te voorkomen.</li>
                      <li>Ontdek technieken om focus te behouden, zelfs bij saaie vakken.</li>
                      <li>Verhoog de motivatie door doelen te stellen en successen te vieren.</li>
                  </ul>
              </div>
            </div>

            <Card className="shadow-lg bg-accent/5 border-accent/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-2xl text-accent">
                    <BookOpenCheck className="h-7 w-7" />Onze Huiswerkondersteuning Omvat
                </CardTitle>
                <CardDescription>
                  Een selectie van de tools die uw kind helpen om schoolwerk effectiever aan te pakken.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {homeworkFeatures.map((tool, index) => (
                    <Card key={index} className="shadow-sm bg-card border hover:shadow-md transition-shadow h-full flex flex-col">
                      <CardHeader className="flex flex-row items-center gap-3 pb-3">
                        <div className="flex-shrink-0 p-2 bg-primary/10 rounded-full">
                          <tool.icon className="h-6 w-6 text-primary" />
                        </div>
                        <CardTitle className="text-md font-semibold text-foreground">{tool.title}</CardTitle>
                      </CardHeader>
                      <CardContent className="text-xs text-muted-foreground flex-grow">
                        {tool.description}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            <section className="text-center mt-16 pt-10 border-t">
              <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl mb-4">
                Klaar om huiswerk <span className="text-primary">slimmer aan te pakken</span>?
              </h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
                Geef uw kind de tools voor academisch succes. De huiswerkondersteuning is onderdeel van onze premium pakketten.
              </p>
              <Button size="lg" asChild className="shadow-md hover:shadow-lg transition-shadow">
                <Link href="/#pricing">
                  Bekijk onze abonnementen <ArrowRight className="ml-2 h-5 w-5"/>
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
