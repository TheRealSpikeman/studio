import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { BarChart3, Laptop, Users2, BookOpenText, Sparkles } from 'lucide-react';

const services = [
  {
    icon: <BarChart3 className="h-10 w-10 text-primary" />,
    title: 'Gratis Quiz',
    description: 'Direct inzicht in je leerstijl en prikkelgevoeligheid.',
    ctaText: 'Start gratis quiz',
    link: '/quizzes',
  },
  {
    icon: <Laptop className="h-10 w-10 text-primary" />,
    title: 'Online Huiswerkbegeleiding',
    description: 'Wekelijkse groepssessies voor structuur en motivatie.',
    ctaText: 'Bekijk online aanbod',
    link: '/dashboard/homework-assistance', // Assuming this is the relevant link
  },
  {
    icon: <Users2 className="h-10 w-10 text-primary" />,
    title: '1-op-1 Begeleiding',
    description: 'Persoonlijke studieplanning en tips.',
    ctaText: 'Plan kennismaking',
    link: '/dashboard/homework-assistance/tutors', // Assuming this is the relevant link
  },
  {
    icon: <BookOpenText className="h-10 w-10 text-primary" />,
    title: 'Dagelijkse Coaching-hub',
    description: 'Dagboek, check-in, tips & forum voor je groei.',
    ctaText: 'Ontdek coaching-hub',
    link: '/dashboard/coaching',
    extraBullets: [
      'Houd een kort dagboek bij en meet je stemming.',
      'Ontvang elke dag gepersonaliseerde tips.',
      'Deel ervaringen met leeftijdsgenoten in ons forum.',
    ],
  },
];

export function ServicesSection() {
  return (
    <section className="flex flex-col items-center justify-center py-16 md:py-24 bg-background">
      <div className="container flex flex-col items-center text-center">
        <h2 className="mb-12 text-center text-3xl font-bold tracking-tight text-foreground md:text-4xl">
          Ons Aanbod
        </h2>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4 justify-items-stretch">
          {services.map((service, index) => (
            <Card
              key={index}
              className="flex flex-col items-center text-center shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-transparent hover:border-primary/30 h-full"
            >
              <CardHeader className="items-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  {service.icon}
                </div>
                <CardTitle className="text-xl font-semibold text-primary">{service.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-muted-foreground">{service.description}</p>
                {service.extraBullets && (
                  <ul className="mt-3 list-disc list-inside text-sm text-muted-foreground text-left space-y-1">
                    {service.extraBullets.map((bullet, i) => (
                      <li key={i}>{bullet}</li>
                    ))}
                  </ul>
                )}
              </CardContent>
              <CardFooter className="w-full pt-4 mt-auto">
                <Button asChild className="w-full">
                  <Link href={service.link}>
                    {service.ctaText}
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
        <div className="mt-12 text-center max-w-2xl mx-auto">
          <div className="flex items-center justify-center gap-2 text-xl font-semibold text-primary mb-2">
            <Sparkles className="h-6 w-6" />
            <span>Vertrouwd door Velen</span>
            <Sparkles className="h-6 w-6" />
          </div>
          <p className="text-muted-foreground">
            Al meer dan 500 jongeren gebruiken onze dagelijkse coaching en zien hun motivatie omhoog schieten. Sluit je aan en ontdek wat MindNavigator voor jou kan betekenen!
          </p>
        </div>
      </div>
    </section>
  );
}
