
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { BarChart3, MessageSquare, Users2, Sparkles, Brain, GraduationCap } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ServicePackage {
  icon: React.ReactNode;
  title: string;
  description: string;
  features: string[];
  ctaText: string;
  link: string;
  colorClass: string;
  typeLabel: string;
}

const servicePackages: ServicePackage[] = [
  {
    icon: <BarChart3 className="h-10 w-10 text-primary" />,
    title: 'Gratis Start',
    description: 'Begin met de basis: doe een zelfreflectie-instrument en ontvang direct een uitgebreid PDF-overzicht.',
    features: ['Basis Zelfreflectie Tool', 'Uitgebreid PDF Overzicht'],
    ctaText: 'Start de gratis tool',
    link: '/quizzes',
    colorClass: 'bg-orange-50 border-orange-200 hover:shadow-orange-100',
    typeLabel: 'Gratis',
  },
  {
    icon: <MessageSquare className="h-10 w-10 text-primary" />,
    title: 'Coaching & Tools',
    description: 'Krijg volledige toegang tot alle zelfreflectie-instrumenten, de virtuele coaching hub, dagboek en handige huiswerk tools.',
    features: ['Alle Zelfreflectie Tools', 'Volledige Coaching Hub', 'Huiswerk Tools'],
    ctaText: 'Ontdek Coaching',
    link: '/#pricing', 
    colorClass: 'bg-blue-50 border-blue-200 hover:shadow-blue-100',
    typeLabel: 'Vanaf €3,39 P/M',
  },
  {
    icon: <Users2 className="h-10 w-10 text-primary" />,
    title: 'Gezins Gids',
    description: 'Alles van Coaching & Tools, plus toegang tot persoonlijke coaches en huiswerktutors, en een uitgebreid ouder-dashboard.',
    features: ['Alles van Coaching & Tools', 'Pool Persoonlijke Coaches', 'Pool Huiswerktutors', 'Uitgebreid Ouder Dashboard'],
    ctaText: 'Kies Gezins Gids',
    link: '/#pricing', 
    colorClass: 'bg-green-50 border-green-200 hover:shadow-green-100',
    typeLabel: 'Vanaf €8,49 P/M',
  },
];

export function ServicesSection() {
  return (
    <section className="flex flex-col items-center justify-center py-16 md:py-24 bg-background">
      <div className="container flex flex-col items-center text-center">
        <h2 className="mb-12 text-center text-3xl font-bold tracking-tight text-foreground md:text-4xl">
          Ons Aanbod voor Uw Gezin
        </h2>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 justify-items-stretch">
          {servicePackages.map((pkg, index) => (
            <Card
              key={index}
              className={cn(
                "group flex flex-col items-center text-center shadow-lg hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 h-full",
                pkg.colorClass
              )}
            >
              <CardHeader className="items-center w-full pb-2">
                <div className="mb-2 text-xs font-semibold uppercase text-muted-foreground tracking-wider">{pkg.typeLabel}</div>
                <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  {pkg.icon}
                </div>
                <CardTitle className="text-xl font-bold text-primary">{pkg.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow w-full space-y-2 px-4 pb-3">
                <p className="text-foreground/80 text-sm font-medium leading-snug">{pkg.description}</p>
                {pkg.features && (
                  <ul className="mt-3 list-disc list-inside text-xs text-muted-foreground text-left space-y-1 pl-4">
                    {pkg.features.map((feature, i) => (
                      <li key={i}>{feature}</li>
                    ))}
                  </ul>
                )}
              </CardContent>
              <CardFooter className="w-full pt-4 pb-5 px-4 mt-auto">
                <Button asChild className="w-full bg-primary hover:bg-primary/90 text-primary-foreground group-hover:shadow-md transition-shadow">
                  <Link href={pkg.link}>
                    {pkg.ctaText}
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
        
        <div className="mt-16 text-center max-w-2xl mx-auto">
          <div className="flex items-center justify-center gap-2 text-xl font-semibold text-primary mb-2">
            <Sparkles className="h-6 w-6" />
            <span>Ondersteuning op Maat</span>
            <Sparkles className="h-6 w-6" />
          </div>
          <p className="text-muted-foreground">
            MindNavigator biedt flexibele opties om uw kind te helpen groeien, van gratis inzichten tot complete begeleiding.
          </p>
        </div>

      </div>
    </section>
  );
}
