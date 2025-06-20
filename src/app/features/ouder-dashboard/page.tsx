
"use client";

import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { MessageSquareText, Brain, Zap, BookOpenCheck, GraduationCap, ShieldCheck, ExternalLink, ArrowRight, Users, BarChart3, CreditCard, CheckCircle2, Lightbulb, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

const allFeatures = [
  { title: 'Gepersonaliseerde Inzichten', link: '/features/gepersonaliseerde-inzichten', icon: Brain },
  { title: 'Coaching & Tools voor Groei', link: '/features/coaching-en-tools', icon: Zap },
  { title: 'Huiswerkondersteuning', link: '/features/huiswerkondersteuning', icon: BookOpenCheck },
  { title: '1-op-1 Begeleiding (Optioneel)', link: '/features/een-op-een-begeleiding', icon: GraduationCap },
  { title: 'Ouder Dashboard & Communicatie', link: '/features/ouder-dashboard', icon: MessageSquareText },
  { title: 'Veilig & Deskundig Platform', link: '/features/veilig-platform', icon: ShieldCheck },
];

const ouderDashboardFeatures = [
  {
    icon: BarChart3,
    title: "Inzicht in Voortgang (met toestemming)",
    description: "Bekijk samenvattingen van voltooide assessments en zelfreflectie-instrumenten van uw kind."
  },
  {
    icon: CreditCard,
    title: "Abonnementen Beheren",
    description: "Pas eenvoudig gezinsabonnementen aan en beheer betalingsgegevens op één centrale plek."
  },
  {
    icon: Users,
    title: "Communicatie met Begeleiders",
    description: "Veilig en direct berichten uitwisselen met gekoppelde tutors of coaches van uw kind."
  },
  {
    icon: ShieldCheck,
    title: "Privacy & Deelinstellingen",
    description: "Beheer per kind wie toegang heeft tot welke informatie, en pas dit op elk moment aan."
  },
  {
    icon: Lightbulb,
    title: "Bronnen & Tips voor Ouders",
    description: "Toegang tot artikelen en adviezen die specifiek zijn gericht op het ondersteunen van neurodivergente jongeren."
  }
];

export default function OuderDashboardPage() {
  const featureTitle = "Ouder Dashboard & Communicatie";
  const FeatureIcon = MessageSquareText;
  const currentLink = "/features/ouder-dashboard";

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
              Inzicht, beheer en communicatie, allemaal op één centrale en veilige plek voor u als ouder.
            </p>
          </div>
          
          <div className="space-y-10 text-base leading-relaxed text-foreground/90">
            <section className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-2xl font-semibold text-primary mb-4">
                  Uw Cruciale Rol, Ondersteund door Tools
                </h2>
                <p className="mb-4">
                  Als ouder speelt u een essentiële rol in de ontwikkeling en het welzijn van uw kind. Het MindNavigator Ouder Dashboard is speciaal ontworpen om u te ondersteunen, te informeren en te betrekken bij de voortgang van uw kind, altijd met het grootste respect voor hun privacy en autonomie.
                </p>
                <p>
                  Wij bieden u een centrale plek waar u relevante informatie kunt vinden, instellingen kunt beheren en, indien van toepassing, kunt communiceren met de begeleiders van uw kind.
                </p>
              </div>
              <div className="relative aspect-video rounded-lg overflow-hidden shadow-lg">
                <Image
                  src="https://placehold.co/600x400.png" 
                  alt="Ouder die het MindNavigator dashboard gebruikt op een tablet"
                  fill
                  style={{ objectFit: 'cover' }}
                  data-ai-hint="parent using dashboard tablet"
                />
              </div>
            </section>
            
            <Card className="shadow-lg bg-primary/5 border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-2xl text-primary">
                    <Users className="h-7 w-7" />Het Ouderportaal: Uw Hub voor Ondersteuning
                </CardTitle>
                <CardDescription>
                  Ontdek de belangrijkste functionaliteiten die u als ouder tot uw beschikking heeft.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {ouderDashboardFeatures.map((feature, index) => (
                    <Card key={index} className="shadow-sm bg-card border hover:shadow-md transition-shadow h-full flex flex-col">
                      <CardHeader className="flex flex-row items-center gap-3 pb-3">
                        <div className="flex-shrink-0 p-2 bg-primary/10 rounded-full">
                          <feature.icon className="h-6 w-6 text-primary" />
                        </div>
                        <CardTitle className="text-md font-semibold text-foreground">{feature.title}</CardTitle>
                      </CardHeader>
                      <CardContent className="text-xs text-muted-foreground flex-grow">
                        {feature.description}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <section className="text-center mt-16 pt-10 border-t">
              <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl mb-4">
                Samen werken aan <span className="text-primary">inzicht en groei</span>
              </h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
                Registreer u als ouder om toegang te krijgen tot het dashboard en uw kind(eren) te koppelen.
              </p>
              <Button size="lg" asChild className="shadow-md hover:shadow-lg transition-shadow">
                <Link href="/signup">
                  Account Aanmaken (voor Ouders) <ArrowRight className="ml-2 h-5 w-5"/>
                </Link>
              </Button>
              <p className="text-sm text-muted-foreground mt-3 flex items-center justify-center gap-1">
                <Sparkles className="h-4 w-4 text-accent" /> Bekijk ook onze <Link href="/for-parents" className="text-primary hover:underline">speciale pagina voor ouders</Link>.
              </p>
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
