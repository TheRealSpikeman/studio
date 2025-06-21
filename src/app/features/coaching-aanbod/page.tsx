
"use client";

import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Zap, Brain, BookOpenCheck, GraduationCap, MessageSquareText, ShieldCheck, ExternalLink, ArrowRight, 
  NotebookPen, CalendarCheck, TrendingUp, Smile, Sparkles, CheckCircle2, Lightbulb
} from 'lucide-react';
import { cn } from '@/lib/utils';

// This should probably be in a shared file, but for a single page it's ok here.
const allFeatures = [
  { title: 'Gepersonaliseerde Inzichten', link: '/features/gepersonaliseerde-inzichten', icon: Brain },
  { title: 'Coaching & Tools voor Groei', link: '/features/coaching-aanbod', icon: Zap },
  { title: 'Huiswerkondersteuning', link: '/features/huiswerkondersteuning', icon: BookOpenCheck },
  { title: '1-op-1 Begeleiding (Optioneel)', link: '/features/een-op-een-begeleiding', icon: GraduationCap },
  { title: 'Ouder Dashboard & Communicatie', link: '/features/ouder-dashboard', icon: MessageSquareText },
  { title: 'Veilig & Deskundig Platform', link: '/features/veilig-platform', icon: ShieldCheck },
];

const coachingToolsFeatures = [
  {
    icon: MessageSquareText,
    title: "Dagelijkse Coaching Berichten",
    description: "Korte, motiverende en inzichtgevende berichten die helpen bij zelfreflectie en het ontwikkelen van een positieve mindset, afgestemd op jouw profiel."
  },
  {
    icon: NotebookPen,
    title: "Interactief Dagboek",
    description: "Een veilige plek om gedachten, gevoelens en ervaringen te noteren, wat bijdraagt aan zelfinzicht en emotionele verwerking."
  },
  {
    icon: CalendarCheck,
    title: "Planningstools & Routinebouwers",
    description: "Hulpmiddelen om taken, huiswerk en activiteiten te organiseren, en ondersteuning bij het opzetten van gezonde routines die passen bij jouw energie."
  },
  {
    icon: Smile,
    title: "Zelfvertrouwen Oefeningen",
    description: "Activiteiten en reflecties gericht op het versterken van zelfvertrouwen, het herkennen van kwaliteiten en het omgaan met uitdagingen."
  },
  {
    icon: TrendingUp,
    title: "Voortgang & Motivatie",
    description: "Tools om persoonlijke doelen te stellen, voortgang te visualiseren en gemotiveerd te blijven op de reis naar persoonlijke groei."
  },
  {
    icon: Sparkles,
    title: "Persoonlijke Affirmaties",
    description: "Krachtige, positieve zinnen die speciaal voor jou zijn samengesteld om je te helpen focussen op je sterke punten en doelen."
  }
];

export default function CoachingAanbodPage() {
  const featureTitle = "Coaching & Tools voor Groei";
  const FeatureIcon = Zap;
  const currentLink = "/features/coaching-aanbod";

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
              Ondersteun uw kind met dagelijkse, laagdrempelige coaching en praktische tools, afgestemd op hun unieke profiel.
            </p>
          </div>
          
          <div className="space-y-10 text-base leading-relaxed text-foreground/90">
            <section>
              <p className="mb-4">
                De "Coaching & Tools voor Groei" module van MindNavigator is ontworpen om uw kind dagelijks te ondersteunen op een interactieve en persoonlijke manier. Gebaseerd op de resultaten van hun persoonlijke assessment, bieden we een reeks functionaliteiten die bijdragen aan zelfinzicht, welzijn en de ontwikkeling van belangrijke levensvaardigheden.
              </p>
              <p>
                Ons doel is om een veilige, stimulerende en positieve omgeving te creëren waarin uw kind kan leren, reflecteren en groeien, volledig op eigen tempo.
              </p>
            </section>

            <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="relative aspect-video rounded-lg overflow-hidden shadow-lg order-last md:order-first">
                    <Image
                        src="https://placehold.co/600x400.png"
                        alt="Visualisatie van persoonlijke groei en coaching tools"
                        fill
                        style={{ objectFit: 'cover' }}
                        data-ai-hint="personal growth coaching tools"
                    />
                </div>
                <div className="space-y-4 order-first md:order-last">
                    <h3 className="text-xl font-semibold text-primary flex items-center gap-2">
                        <Lightbulb className="h-6 w-6"/>De Kracht van Dagelijkse Ondersteuning
                    </h3>
                    <p>Onze coaching module is meer dan een verzameling tools; het is een dagelijkse metgezel die helpt bij:</p>
                    <ul className="list-disc list-inside space-y-1.5 pl-5">
                        <li>Het ontwikkelen van een positieve mindset.</li>
                        <li>Het opbouwen van gezonde routines.</li>
                        <li>Het versterken van zelfvertrouwen en zelfbewustzijn.</li>
                        <li>Het leren omgaan met uitdagingen en emoties.</li>
                        <li>Het stellen en bereiken van persoonlijke doelen.</li>
                    </ul>
                </div>
            </div>
            
            <Card className="shadow-lg bg-accent/5 border-accent/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-2xl text-accent">
                    <Sparkles className="h-7 w-7" />Kernonderdelen van onze Coaching & Tools
                </CardTitle>
                <CardDescription>
                  Een selectie van de tools die uw kind kan gebruiken voor dagelijkse groei en reflectie.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {coachingToolsFeatures.map((tool, index) => (
                    <Card key={index} className="shadow-md bg-card border hover:shadow-lg transition-shadow h-full flex flex-col">
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
                Ontgrendel dagelijkse ondersteuning en groei
              </h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
                Geef uw kind de tools in handen om zichzelf beter te begrijpen en te ontwikkelen met onze premium coaching features.
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
