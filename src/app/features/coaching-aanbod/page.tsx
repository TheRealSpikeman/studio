
"use client";

import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Brain, GraduationCap, MessageSquareText, ArrowRight, Sparkles, BookOpenCheck, HeartHandshake, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CoachingType {
  icon: React.ElementType;
  title: string;
  description: string;
  features: string[];
  ctaText: string;
  ctaLink: string;
  colorClass: string;
}

const coachingTypes: CoachingType[] = [
  {
    icon: Zap, // Changed from Brain to Sparkles for more "tool-like"
    title: "Ontdek Jezelf: Digitale Tools & Zelfreflectie",
    description: "Start met laagdrempelige, interactieve quizzen en zelfreflectie-instrumenten. Krijg direct inzicht in je denkstijl, sterke punten en mogelijke uitdagingen. De basis voor al onze gepersonaliseerde ondersteuning.",
    features: [
      "Persoonlijke neurodiversiteit-assessments",
      "Directe, heldere rapportages & inzichten",
      "Interactief dagboek voor zelfreflectie",
      "Dagelijkse tips & affirmaties (premium)"
    ],
    ctaText: "Start een Zelfreflectie Tool",
    ctaLink: "/quizzes",
    colorClass: "bg-orange-50 border-orange-200 hover:shadow-orange-100",
  },
  {
    icon: BookOpenCheck, // Changed from GraduationCap for more "homework" feel
    title: "Persoonlijke Huiswerkondersteuning: Onze Tutors",
    description: "Krijg 1-op-1 hulp van gekwalificeerde tutors voor specifieke vakken, studieplanning, of het aanleren van effectieve leerstrategieën. Flexibel en afgestemd op jouw tempo.",
    features: [
      "Vakspecifieke bijles (alle niveaus)",
      "Hulp bij planning en organisatie",
      "Examentraining en toetsvoorbereiding",
      "Gekwalificeerde en gescreende tutors"
    ],
    ctaText: "Vind een Tutor",
    ctaLink: "/dashboard/ouder/zoek-professional", // Placeholder, adjust if specific tutor search page exists
    colorClass: "bg-blue-50 border-blue-200 hover:shadow-blue-100",
  },
  {
    icon: HeartHandshake, // Changed from MessageSquareText for a more personal touch
    title: "Diepgaande Begeleiding: Gesprekken met een Coach",
    description: "Praat met een ervaren coach (of psycholoog) over persoonlijke uitdagingen, het omgaan met emoties, zelfvertrouwen versterken, of het ontwikkelen van strategieën die passen bij jouw neurodivergente profiel.",
    features: [
      "1-op-1 gesprekken (online)",
      "Focus op persoonlijke groei & welzijn",
      "Strategieën voor neurodiversiteit",
      "Ondersteuning bij stress, angst of sociale interacties"
    ],
    ctaText: "Zoek een Coach",
    ctaLink: "/dashboard/ouder/zoek-professional", // Placeholder, adjust if specific coach search page exists
    colorClass: "bg-green-50 border-green-200 hover:shadow-green-100",
  },
];

export default function CoachingAanbodPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-gradient-to-b from-background via-secondary/5 to-background py-12 md:py-20 lg:py-28">
        <div className="container mx-auto px-4">
          <header className="text-center mb-16">
            <Sparkles className="mx-auto h-16 w-16 text-primary mb-6" />
            <h1 className="text-4xl font-bold tracking-tight text-foreground md:text-5xl">
              Ons Coaching & Ondersteuningsaanbod
            </h1>
            <p className="mt-6 text-xl text-muted-foreground max-w-3xl mx-auto">
              MindNavigator biedt verschillende vormen van ondersteuning, passend bij jouw behoeften. Van digitale zelfhulp tot persoonlijke 1-op-1 begeleiding.
            </p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
            {coachingTypes.map((type) => (
              <Card key={type.title} className={cn("flex flex-col shadow-xl hover:shadow-2xl transition-shadow duration-300", type.colorClass)}>
                <CardHeader className="items-center text-center">
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <type.icon className="h-9 w-9" />
                  </div>
                  <CardTitle className="text-2xl font-semibold text-foreground">{type.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow space-y-3">
                  <p className="text-base text-muted-foreground leading-relaxed">{type.description}</p>
                  <ul className="list-disc list-inside space-y-1.5 pl-5 text-sm text-muted-foreground">
                    {type.features.map((feature, idx) => (
                      <li key={idx}>{feature}</li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter className="pt-5">
                  <Button asChild className="w-full text-base py-3">
                    <Link href={type.ctaLink}>
                      {type.ctaText} <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          <section className="mt-28 text-center max-w-2xl mx-auto"> {/* Increased margin-top here */}
            <h2 className="text-3xl font-bold text-foreground mb-4">Klaar om de volgende stap te zetten?</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Of je nu net begint met zelfontdekking of op zoek bent naar specifieke begeleiding, MindNavigator is er om je te ondersteunen.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/signup">Meld je aan voor MindNavigator</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/contact">Neem contact op</Link>
              </Button>
            </div>
          </section>

        </div>
      </main>
      <Footer />
    </div>
  );
}
