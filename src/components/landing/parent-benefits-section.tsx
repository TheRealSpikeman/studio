
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { FileText, MessageSquareText, BookOpenCheck, Users, BarChart3, ShieldCheck, Zap, Brain, GraduationCap, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Benefit {
  icon: React.ReactNode;
  title: string;
  descriptionPart1: string;
  descriptionLinkText?: string;
  descriptionLinkHref?: string;
  descriptionPart2?: string;
  descriptionFull?: string; // Fallback if no link parts
  link: string;
  linkText: string;
  colorClass: string;
}

const benefits: Benefit[] = [
  {
    icon: <Brain className="h-10 w-10 text-primary" />,
    title: 'Gespecialiseerde Inzichten',
    descriptionPart1: 'Help uw kind zelfinzicht te krijgen met zelfreflectie-instrumenten gericht op het herkennen van patronen in gedrag en denken. Lees ',
    descriptionLinkText: 'hier meer over wat neurodiversiteit inhoudt',
    descriptionLinkHref: '/neurodiversiteit',
    descriptionPart2: '. Ontvang heldere overzichten die u en uw kind helpen unieke krachten en uitdagingen te begrijpen.',
    link: '/quizzes',
    linkText: 'Ontdek de tools',
    colorClass: 'bg-orange-50 border-orange-200 hover:shadow-orange-100',
  },
  {
    icon: <Zap className="h-10 w-10 text-primary" />,
    title: 'Praktische Coaching & Tools voor Groei',
    descriptionFull: 'Dagelijkse, laagdrempelige coaching en tools (dagboek, planning) die uw kind ondersteunen bij het ontwikkelen van routines, het vergroten van zelfvertrouwen en het effectief omgaan met school en sociale situaties.',
    link: '/dashboard/coaching',
    linkText: 'Verken coaching',
    colorClass: 'bg-blue-50 border-blue-200 hover:shadow-blue-100',
  },
  {
    icon: <BookOpenCheck className="h-10 w-10 text-primary" />,
    title: 'Huiswerkondersteuning Tools',
    descriptionFull: 'Effectieve tools en strategieën om uw kind te helpen bij planning, focus en het overwinnen van studie-uitdagingen, direct geïntegreerd in hun dashboard.',
    link: '/dashboard/homework-assistance',
    linkText: 'Bekijk tools',
    colorClass: 'bg-green-50 border-green-200 hover:shadow-green-100',
  },
  {
    icon: <GraduationCap className="h-10 w-10 text-primary" />,
    title: '1-op-1 Huiswerkbegeleiding',
    descriptionFull: 'Koppel uw kind aan gekwalificeerde en gescreende tutors voor persoonlijke hulp bij specifieke vakken. Flexibel en afgestemd op de behoeften van uw kind.',
    link: '/dashboard/homework-assistance/tutors',
    linkText: 'Vind een Tutor',
    colorClass: 'bg-teal-50 border-teal-200 hover:shadow-teal-100',
  },
  {
    icon: <MessageSquareText className="h-10 w-10 text-primary" />,
    title: 'Persoonlijke Coaching (Psychologen)',
    descriptionFull: 'Bied uw kind de mogelijkheid tot verdiepende gesprekken met bij ons aangesloten kinder- en jeugdpsychologen voor extra ondersteuning bij persoonlijke groei en welzijn.',
    link: '/contact',
    linkText: 'Meer Informatie & Contact',
    colorClass: 'bg-pink-50 border-pink-200 hover:shadow-pink-100',
  },
  {
    icon: <ShieldCheck className="h-10 w-10 text-primary" />,
    title: 'Veilig, Vertrouwd & Deskundig',
    descriptionPart1: 'Een privacygerichte omgeving, speciaal ontworpen voor tieners. Onze aanpak is gebaseerd op educatieve principes en inzichten van experts in neurodiversiteit en pedagogiek. Wij bieden geen diagnoses. Lees meer in ons ',
    descriptionLinkText: 'Privacybeleid',
    descriptionLinkHref: '/privacy',
    descriptionPart2: '.',
    link: '/privacy', // Main link for the button can still be privacy or a general "Learn More"
    linkText: 'Lees ons privacybeleid',
    colorClass: 'bg-purple-50 border-purple-200 hover:shadow-purple-100',
  },
];

export function ParentBenefitsSection() {
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Rust en Inzicht voor Uw Gezin: <span className="text-primary">Dit Maakt MindNavigator Uniek</span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
            Ontdek hoe MindNavigator een complete ondersteuningsstructuur biedt, niet alleen voor uw kind, maar ook voor u als ouder.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {benefits.map((benefit, index) => (
            <Card key={index} className={cn("shadow-lg hover:shadow-xl transition-shadow flex flex-col h-full", benefit.colorClass)}>
              <CardHeader className="flex flex-row items-start gap-4 pb-3">
                <div className="flex-shrink-0 mt-1">{benefit.icon}</div>
                <div>
                  <CardTitle className="text-xl font-semibold text-foreground">{benefit.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-sm text-muted-foreground leading-snug">
                  {benefit.descriptionFull ? benefit.descriptionFull : (
                    <>
                      {benefit.descriptionPart1}
                      {benefit.descriptionLinkText && benefit.descriptionLinkHref && (
                        <Link href={benefit.descriptionLinkHref} className="text-primary hover:underline font-medium">
                          {benefit.descriptionLinkText} <ExternalLink className="inline-block h-4 w-4 align-text-bottom"/>
                        </Link>
                      )}
                      {benefit.descriptionPart2}
                    </>
                  )}
                </p>
              </CardContent>
              <CardFooter>
                <Button variant="link" asChild className="p-0 h-auto text-primary">
                  <Link href={benefit.link}>{benefit.linkText} &rarr;</Link>
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
                <h3 className="text-2xl font-bold text-foreground">Uw Eigen Ouderportaal: Inzicht &amp; Begeleiding</h3>
              </div>
              <p className="text-muted-foreground mb-4 text-base leading-relaxed">
                Met het "Gezins Gids" pakket krijgt u toegang tot een uitgebreid ouder-dashboard. Hiermee kunt u:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-6 pl-2">
                <li>De voortgang en inzichten uit zelfreflectie-instrumenten van uw kind (met toestemming) inzien.</li>
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
                src="https://picsum.photos/seed/parentDashboardUI/600/450"
                alt="Voorbeeld van het MindNavigator Ouder Dashboard interface met grafieken en statistieken"
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
