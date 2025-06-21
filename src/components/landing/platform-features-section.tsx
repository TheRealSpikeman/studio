

"use client"; 

import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { FileText, MessageSquareText, BookOpenCheck, Users, BarChart3, ShieldCheck, Zap, Brain, GraduationCap, ExternalLink, ArrowRight } from 'lucide-react'; 
import { cn } from '@/lib/utils';

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string; 
  link: string;
  linkText: string;
  colorClass: string;
}

const platformFeatures: Feature[] = [
  {
    icon: <Brain className="h-10 w-10 text-primary" />,
    title: 'Gepersonaliseerde Inzichten & Tools',
    description: 'Na een korte, kindvriendelijke assessment krijgt uw kind direct inzicht in de eigen denkstijl en sterke punten, plus toegang tot tools die hierop aansluiten.',
    link: '/features/gepersonaliseerde-inzichten',
    linkText: 'Ontdek de assessment',
    colorClass: 'bg-primary/5 border-primary/20 hover:shadow-md',
  },
  {
    icon: <Zap className="h-10 w-10 text-primary" />,
    title: 'Dagelijkse Coaching & Groei',
    description: 'Een (premium) hub met dagelijkse, laagdrempelige coaching, reflectie-oefeningen in een interactief dagboek, en tools voor planning en routine die écht bij uw kind passen.',
    link: '/features/coaching-en-tools',
    linkText: 'Verken coaching features',
    colorClass: 'bg-accent/5 border-accent/20 hover:shadow-md',
  },
  {
    icon: <BookOpenCheck className="h-10 w-10 text-primary" />,
    title: 'Effectieve Huiswerkondersteuning',
    description: 'Praktische tips, tools en strategieën om studie-uitdagingen aan te gaan, afgestemd op de individuele leerstijl en behoeften van uw kind.',
    link: '/features/huiswerkondersteuning',
    linkText: 'Bekijk huiswerkhulp',
    colorClass: 'bg-secondary border-border hover:shadow-md',
  },
  {
    icon: <GraduationCap className="h-10 w-10 text-primary" />,
    title: '1-op-1 Begeleiding (Optioneel)',
    description: 'Koppel uw kind aan gekwalificeerde tutors of coaches voor persoonlijke, professionele hulp, afgestemd op hun profiel en specifieke behoeften.',
    link: '/features/een-op-een-begeleiding',
    linkText: 'Meer over begeleiding',
    colorClass: 'bg-accent/10 border-accent/30 hover:shadow-md',
  },
  {
    icon: <MessageSquareText className="h-10 w-10 text-primary" />,
    title: 'Betrokken Ouder Dashboard',
    description: 'Krijg (met toestemming) inzicht in de voortgang van uw kind, beheer abonnementen en communiceer veilig met gekoppelde begeleiders via uw eigen portaal.',
    link: '/features/ouder-dashboard',
    linkText: 'Ontdek het ouderportaal',
    colorClass: 'bg-primary/10 border-primary/30 hover:shadow-md',
  },
  {
    icon: <ShieldCheck className="h-10 w-10 text-primary" />,
    title: 'Veilig & Deskundig Platform',
    description: 'Een privacygerichte omgeving, gebouwd op educatieve principes en inzichten van experts. Wij bieden ondersteuning, geen diagnoses.',
    link: '/features/veilig-platform', 
    linkText: 'Lees over onze aanpak',
    colorClass: 'bg-muted border-border hover:shadow-md',
  },
];

export function PlatformFeaturesSection() { 
  return (
    <section id="platform-features-overview" className="py-12 md:py-16 bg-gradient-to-b from-background via-secondary/10 to-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Ontdek de Kracht van MindNavigator: <span className="text-primary">Ondersteuning op Maat</span> 
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
            Van een laagdrempelige start-assessment tot dagelijkse coaching en optionele 1-op-1 begeleiding – MindNavigator biedt een complete structuur voor zelfontdekking en groei.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {platformFeatures.map((feature, index) => ( 
            <Card key={index} className={cn("shadow-lg hover:shadow-xl transition-shadow flex flex-col h-full", feature.colorClass)}>
              <CardHeader className="flex flex-row items-start gap-4 pb-3">
                <div className="flex-shrink-0 mt-1">{feature.icon}</div>
                <div>
                  <CardTitle className="text-xl font-semibold text-foreground">{feature.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-sm text-muted-foreground leading-snug">
                  {feature.description}
                </p>
              </CardContent>
              <CardFooter>
                <Button variant="link" asChild className="p-0 h-auto text-primary inline-flex items-center group">
                  <Link href={feature.link}>
                    {feature.linkText}
                    <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <Card className="shadow-xl bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 items-center">
            <div className="p-8 md:p-10 lg:p-12">
              <div className="flex items-center gap-3 mb-3">
                <BarChart3 className="h-10 w-10 text-primary" />
                <h3 className="text-2xl font-bold text-foreground">Uw Ouder Dashboard: Inzicht &amp; Controle</h3>
              </div>
              <p className="text-muted-foreground mb-4 text-base leading-relaxed">
                Met het "Gezins Gids" pakket (en andere betaalde plannen) krijgt u toegang tot een uitgebreid ouderportaal. Hiermee kunt u:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-6 pl-2">
                <li>De voortgang en inzichten uit de assessment en tools van uw kind (met toestemming) inzien.</li>
                <li>Abonnementen voor uw gezin eenvoudig beheren en aanpassen.</li>
                <li>Effectief en veilig communiceren met eventueel gekoppelde coaches en huiswerktutors.</li>
                <li>Toegang krijgen tot specifieke bronnen en tips voor ouders.</li>
              </ul>
              <p className="text-foreground font-medium mb-6">
                U staat er niet alleen voor; wij bieden u de handvatten om uw kind optimaal te ondersteunen in hun ontwikkeling.
              </p>
              <Button asChild size="lg">
                <Link href="/#pricing">Ontdek de "Gezins Gids"</Link>
              </Button>
            </div>
            <div className="relative h-64 lg:h-full min-h-[300px] order-first lg:order-last">
              <Image
                src="https://firebasestorage.googleapis.com/v0/b/neurodiversity-navigator.firebasestorage.app/o/parents-2.png?alt=media&token=c8f9238e-81c7-46a3-9499-b36ba37a2e28" 
                alt="Voorbeeld van het MindNavigator Ouder Dashboard interface met grafieken en overzichten"
                fill
                style={{ objectFit: 'cover' }}
                data-ai-hint="parent dashboard"
                className="opacity-90"
              />
               <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-transparent lg:from-transparent lg:via-transparent lg:to-primary/5"></div>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}
