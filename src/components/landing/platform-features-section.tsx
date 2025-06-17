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
  descriptionPart1: string;
  descriptionLinkText?: string;
  descriptionLinkHref?: string;
  descriptionPart2?: string;
  descriptionFull?: string; 
  link: string;
  linkText: string;
  colorClass: string;
}

const platformFeatures: Feature[] = [
  {
    icon: <Brain className="h-10 w-10 text-primary" />,
    title: 'Gepersonaliseerde Inzichten',
    descriptionPart1: 'Uw kind start met een assessment en krijgt direct inzicht via zelfreflectie-instrumenten. Lees ',
    descriptionLinkText: 'hier meer over neurodiversiteit',
    descriptionLinkHref: '/neurodiversiteit',
    descriptionPart2: '. Ontvang heldere overzichten die u en uw kind helpen unieke krachten en uitdagingen te begrijpen.',
    link: '/features/gepersonaliseerde-inzichten',
    linkText: 'Ontdek de tools',
    colorClass: 'bg-primary/5 border-primary/20 hover:shadow-md',
  },
  {
    icon: <Zap className="h-10 w-10 text-primary" />,
    title: 'Coaching & Tools voor Groei',
    descriptionFull: 'Dagelijkse, laagdrempelige coaching en tools (dagboek, planning) gebaseerd op assessmentresultaten, die uw kind ondersteunen bij routines, zelfvertrouwen en omgaan met uitdagingen.',
    link: '/features/coaching-en-tools',
    linkText: 'Verken coaching',
    colorClass: 'bg-accent/5 border-accent/20 hover:shadow-md',
  },
  {
    icon: <BookOpenCheck className="h-10 w-10 text-primary" />,
    title: 'Huiswerkondersteuning',
    descriptionFull: 'Effectieve tools en strategieën afgestemd op leerstijl, om uw kind te helpen bij planning, focus en het overwinnen van studie-uitdagingen.',
    link: '/features/huiswerkondersteuning',
    linkText: 'Bekijk huiswerk tools',
    colorClass: 'bg-secondary border-border hover:shadow-md',
  },
  {
    icon: <GraduationCap className="h-10 w-10 text-primary" />,
    title: '1-op-1 Begeleiding (Optioneel)',
    descriptionFull: 'Koppel uw kind aan gekwalificeerde tutors of coaches voor persoonlijke hulp, afgestemd op hun assessmentprofiel en behoeften.',
    link: '/features/een-op-een-begeleiding',
    linkText: 'Vind een Begeleider',
    colorClass: 'bg-accent/10 border-accent/30 hover:shadow-md',
  },
  {
    icon: <MessageSquareText className="h-10 w-10 text-primary" />,
    title: 'Ouder Dashboard & Communicatie',
    descriptionFull: 'Krijg via uw eigen portaal (met toestemming) inzicht in de voortgang, beheer abonnementen en communiceer met begeleiders.',
    link: '/features/ouder-dashboard',
    linkText: 'Naar Ouderportaal',
    colorClass: 'bg-primary/10 border-primary/30 hover:shadow-md',
  },
  {
    icon: <ShieldCheck className="h-10 w-10 text-primary" />,
    title: 'Veilig & Deskundig Platform',
    descriptionPart1: 'Een privacygerichte omgeving, gebaseerd op educatieve principes en inzichten van experts. Wij bieden geen diagnoses. Lees meer in ons ',
    descriptionLinkText: 'Privacybeleid',
    descriptionLinkHref: '/privacy', // Dit blijft naar de privacy pagina, een aparte feature pagina voor "veilig platform" wordt ook gemaakt.
    descriptionPart2: '.',
    link: '/features/veilig-platform', 
    linkText: 'Lees meer over ons platform',
    colorClass: 'bg-muted border-border hover:shadow-md',
  },
];

export function PlatformFeaturesSection() { 
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Ontdek de Kracht van MindNavigator: <span className="text-primary">Gepersonaliseerd voor U</span> 
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
            Alles begint met een korte assessment om een gepersonaliseerd pad voor uw kind te creëren. MindNavigator biedt een complete ondersteuningsstructuur. 
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
                  {feature.descriptionFull ? feature.descriptionFull : (
                    <>
                      {feature.descriptionPart1}
                      {feature.descriptionLinkText && feature.descriptionLinkHref && (
                        <Link href={feature.descriptionLinkHref} className="text-primary hover:underline font-medium">
                          {feature.descriptionLinkText} <ExternalLink className="inline-block h-4 w-4 align-text-bottom"/>
                        </Link>
                      )}
                      {feature.descriptionPart2}
                    </>
                  )}
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
                <h3 className="text-2xl font-bold text-foreground">Uw Ouder Dashboard: Inzicht &amp; Overzicht</h3>
              </div>
              <p className="text-muted-foreground mb-4 text-base leading-relaxed">
                Met het "Gezins Gids" pakket (en andere betaalde plannen) krijgt u toegang tot een uitgebreid ouderportaal. Hiermee kunt u:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-6 pl-2">
                <li>De voortgang en inzichten uit de assessment en tools van uw kind (met toestemming) inzien.</li>
                <li>Abonnementen voor uw gezin eenvoudig beheren.</li>
                <li>Effectief communiceren met eventueel gekoppelde coaches en huiswerktutors.</li>
                <li>Toegang krijgen tot specifieke bronnen en tips voor ouders.</li>
              </ul>
              <p className="text-foreground font-medium mb-6">
                U staat er niet alleen voor; wij bieden u de handvatten om uw kind optimaal te ondersteunen.
              </p>
              <Button asChild size="lg">
                <Link href="/#pricing">Ontdek de "Gezins Gids"</Link>
              </Button>
            </div>
            <div className="relative h-64 lg:h-full min-h-[300px] order-first lg:order-last">
              <Image
                src="https://placehold.co/600x450.png"
                alt="Voorbeeld van het MindNavigator Ouder Dashboard interface"
                fill
                style={{ objectFit: 'cover' }}
                data-ai-hint="dashboard interface analytics"
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
