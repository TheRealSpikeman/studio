
"use client";

import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Brain, GraduationCap, MessageSquareText, ArrowRight, Sparkles, BookOpenCheck, HeartHandshake, Zap, CheckCircle2, ShieldCheck, Info, Star, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Alert, AlertTitle as AlertTitleUi, AlertDescription as AlertDescriptionUi } from "@/components/ui/alert";


interface CoachingType {
  icon: React.ElementType;
  title: string;
  description: string;
  features: string[];
  ctaText: string;
  ctaLink: string;
  colorClass: string;
  priceIndication: string;
  qualityNote?: string;
}

const coachingTypes: CoachingType[] = [
  {
    icon: Zap,
    title: "Digitale Tools & Zelfreflectie",
    description: "Ontdek je denkstijl en sterke punten via interactieve quizzen. De basis voor gepersonaliseerde ondersteuning.",
    features: [
      "Persoonlijke neurodiversiteit-assessments",
      "Directe, heldere rapportages & inzichten",
      "Interactief dagboek voor zelfreflectie",
      "Dagelijkse tips & affirmaties (premium)"
    ],
    ctaText: "Start een Zelfreflectie Tool",
    ctaLink: "/quizzes",
    colorClass: "bg-orange-50 border-orange-200 hover:shadow-orange-100",
    priceIndication: "Vanaf €0 (Gratis Start)",
  },
  {
    icon: BookOpenCheck,
    title: "Persoonlijke Huiswerkondersteuning",
    description: "Deskundige tutors bieden 1-op-1 hulp bij vakken, planning of leerstrategieën. Flexibel en op jouw tempo.",
    features: [
      "Vakspecifieke bijles (alle niveaus)",
      "Hulp bij planning en organisatie",
      "Examentraining en toetsvoorbereiding",
    ],
    ctaText: "Vind een Tutor",
    ctaLink: "/dashboard/ouder/zoek-professional",
    colorClass: "bg-blue-50 border-blue-200 hover:shadow-blue-100",
    priceIndication: "Vanaf €25/uur",
    qualityNote: "✓ Al onze tutors zijn VOG-gescreend en hebben ervaring met diverse leerstijlen.",
  },
  {
    icon: HeartHandshake,
    title: "Diepgaande Begeleiding (Coach)",
    description: "Ervaren coaches bieden hulp bij persoonlijke uitdagingen en emoties, met passende strategieën.",
    features: [
      "1-op-1 gesprekken (online)",
      "Focus op persoonlijke groei & welzijn",
      "Strategieën voor neurodiversiteit",
      "Ondersteuning bij stress & emoties"
    ],
    ctaText: "Zoek een Coach",
    ctaLink: "/dashboard/ouder/zoek-professional",
    colorClass: "bg-green-50 border-green-200 hover:shadow-green-100",
    priceIndication: "Vanaf €75/uur",
    qualityNote: "✓ Onze coaches zijn gekwalificeerde professionals (psycholoog/orthopedagoog) en VOG-gescreend.",
  },
];

const testimonials = [
  {
    name: "Moeder van Lotte (14, HSP kenmerken)",
    quote: "MindNavigator heeft ons gezin geholpen om open te praten over hoe mijn dochter de wereld ervaart. De tools zijn praktisch en de inzichten waardevol.",
    rating: 5,
  },
  {
    name: "Vader van Sem (16, ADD kenmerken)",
    quote: "De combinatie van de zelfreflectie en de tips van de tutor voor huiswerkplanning heeft echt een verschil gemaakt voor Sem. Hij is gemotiveerder en zijn resultaten verbeteren.",
    rating: 4,
  },
  {
    name: "Jara (17, zoekt coaching)",
    quote: "Ik vond het fijn om eerst zelf de tools te doen en daarna met een coach te praten over wat ik had ontdekt. Het voelde heel persoonlijk en afgestemd.",
    rating: 5,
  }
];


export default function CoachingAanbodPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-gradient-to-b from-background via-secondary/5 to-background py-12 md:py-20 lg:py-28">
        <div className="container mx-auto px-4">
          <header className="text-center mb-12 md:mb-16">
            <Sparkles className="mx-auto h-16 w-16 text-primary mb-6" />
            <h1 className="text-4xl font-bold tracking-tight text-foreground md:text-5xl">
              Ons Coaching & Ondersteuningsaanbod
            </h1>
            <p className="mt-3 text-lg text-accent font-medium">
              Speciaal ontworpen voor neurodivergente jongeren (12-18 jaar) en hun ouders.
            </p>
            <p className="mt-4 text-xl text-muted-foreground max-w-3xl mx-auto">
              MindNavigator biedt verschillende vormen van ondersteuning, passend bij jouw behoeften. Van digitale zelfhulp tot persoonlijke 1-op-1 begeleiding.
            </p>
          </header>

          <Alert variant="default" className="mb-12 md:mb-16 max-w-3xl mx-auto bg-blue-50 border-blue-200 text-blue-700">
            <ShieldCheck className="h-5 w-5 !text-blue-600" />
            <AlertTitleUi className="text-blue-700 font-semibold">Onze Belofte: Empowerment & Ondersteuning</AlertTitleUi>
            <AlertDescriptionUi className="text-blue-600">
            MindNavigator stelt geen medische diagnoses. Onze focus ligt op het bieden van inzicht, praktische tools en het versterken van zelfvertrouwen. Voor diagnostiek en medische behandeling verwijzen wij altijd naar gekwalificeerde professionals.
            </AlertDescriptionUi>
          </Alert>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
            {coachingTypes.map((type) => (
              <Card key={type.title} className={cn("flex flex-col shadow-xl hover:shadow-2xl transition-shadow duration-300 h-full", type.colorClass)}>
                <CardHeader className="items-center text-center">
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <type.icon className="h-9 w-9" />
                  </div>
                  <CardTitle className="text-2xl font-semibold text-foreground">{type.title}</CardTitle>
                   <CardDescription className="text-sm text-primary font-medium pt-1">{type.priceIndication}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow space-y-3">
                  <p className="text-base text-muted-foreground leading-relaxed">{type.description}</p>
                  <ul className="list-none space-y-1.5 pl-0 text-sm text-muted-foreground">
                    {type.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  {type.qualityNote && (
                    <p className="text-xs text-muted-foreground italic pt-2 font-semibold">{type.qualityNote}</p>
                  )}
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
          
          <section className="py-16 md:py-20 bg-secondary/20 mt-20 mb-16 rounded-lg">
            <div className="container mx-auto px-4 text-center max-w-3xl">
                <h3 className="text-2xl font-semibold text-foreground mb-8 flex items-center justify-center gap-2">
                    <Star className="h-7 w-7 text-yellow-500" />
                    Vertrouwd door Velen
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {testimonials.map((testimonial, index) => (
                        <Card key={index} className="bg-card border-border p-4 rounded-lg shadow-sm text-left">
                            <div className="flex items-center gap-1 mb-1.5">
                                {Array(testimonial.rating).fill(0).map((_, i) => <Star key={i} className="h-4 w-4 text-yellow-400 fill-yellow-400"/>)}
                                {Array(5 - testimonial.rating).fill(0).map((_, i) => <Star key={`empty-${i}`} className="h-4 w-4 text-yellow-200 fill-yellow-200"/>)}
                            </div>
                            <blockquote className="text-sm text-muted-foreground italic mb-2">"{testimonial.quote}"</blockquote>
                            <p className="text-xs font-medium text-foreground">- {testimonial.name}</p>
                        </Card>
                    ))}
                </div>
            </div>
          </section>

          <section className="mt-16 text-center max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-foreground mb-4">Klaar om de volgende stap te zetten?</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Of je nu net begint met zelfontdekking of op zoek bent naar specifieke begeleiding, MindNavigator is er om je te ondersteunen.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild className="bg-primary hover:bg-primary/90 text-primary-foreground">
                <Link href="/quizzes">Start de gratis assessment</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/#pricing">Bekijk Prijzen & Pakketten</Link>
              </Button>
            </div>
          </section>

        </div>
      </main>
      <Footer />
    </div>
  );
}

