
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { BarChart3, Laptop, Users2, BookOpenText, Sparkles, Star } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

interface Service {
  icon: React.ReactNode;
  title: string;
  tagline: string;
  bullets: string[];
  ctaText: string;
  link: string;
  colorClass: string;
  type: string;
}

const services: Service[] = [
  {
    icon: <BarChart3 className="h-10 w-10 text-primary" />,
    title: 'Ontdek Jouw Leerstijl',
    tagline: 'Krijg direct inzicht in je leerstijl en prikkelgevoeligheid via onze quiz.',
    bullets: ['Leeftijd 12–18 jaar', 'Direct PDF-rapport (beperkt)', 'Duur: ±5 minuten'],
    ctaText: 'Ik wil starten met de quiz',
    link: '/quizzes',
    colorClass: 'bg-orange-50 border-orange-200 hover:shadow-orange-100',
    type: 'Quiz',
  },
  {
    icon: <BookOpenText className="h-10 w-10 text-primary" />,
    title: 'Dagelijkse Groei-oefeningen',
    tagline: 'Versterk je focus en zelfvertrouwen met praktische coaching tools en video\'s.',
    bullets: [
      'Toegang 24/7 tot alle coaching materialen',
      'Houd een dagboek bij en meet je stemming',
      'Deel ervaringen in ons ondersteunende forum',
      '3 korte vragen per dag & wekelijkse voortgang',
    ],
    ctaText: 'Start mijn coaching',
    link: '/dashboard/coaching',
    colorClass: 'bg-blue-50 border-blue-200 hover:shadow-blue-100',
    type: 'Coaching',
  },
  {
    icon: <Laptop className="h-10 w-10 text-primary" />,
    title: 'Leer Plannen & Focussen',
    tagline: 'Krijg grip op je schoolwerk met slimme huiswerkbegeleiding tools.',
    bullets: [
      'Planningssjablonen voor effectief leren',
      'Motivatie-kaarten en studietechnieken',
      'Max. 6 leerlingen per online groepssessie',
      'Sessies van 45 min, meerdere keren per week',
    ],
    ctaText: 'Gebruik mijn studieplanner',
    link: '/dashboard/homework-assistance',
    colorClass: 'bg-green-50 border-green-200 hover:shadow-green-100',
    type: 'Huiswerk Tools',
  },
  {
    icon: <Users2 className="h-10 w-10 text-primary" />,
    title: 'Persoonlijke Leercoaching',
    tagline: 'Krijg 1-op-1 hulp van ervaren tutors, afgestemd op jouw behoeften.',
    bullets: [
      'Persoonlijke intake en plan op maat',
      'Flexibel plannen: 30–60 min per afspraak',
      'Directe hulp van gecertificeerde tutors',
    ],
    ctaText: 'Plan mijn intake',
    link: '/dashboard/homework-assistance/tutors',
    colorClass: 'bg-purple-50 border-purple-200 hover:shadow-purple-100',
    type: '1-op-1 Begeleiding',
  },
];

const testimonials = [
  {
    name: 'Sophie V.',
    age: 15,
    avatarSeed: 'sophie-service',
    quote: "Dankzij de dagelijkse coaching maak ik nu echt iedere dag mijn huiswerk af!",
    rating: 5,
  },
  {
    name: 'Marc K.',
    age: 17,
    avatarSeed: 'marc-service',
    quote: "De quiz was zo snel, daarna koos ik meteen 1-op-1 begeleiding. Top!",
    rating: 5,
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
              className={cn(
                "group flex flex-col items-center text-center shadow-lg hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 h-full",
                service.colorClass
              )}
            >
              <CardHeader className="items-center w-full pb-2">
                <div className="mb-2 text-xs font-semibold uppercase text-muted-foreground tracking-wider">{service.type}</div>
                <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  {service.icon}
                </div>
                <CardTitle className="text-xl font-bold text-primary">{service.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow w-full space-y-2 px-4 pb-3">
                <p className="text-foreground/80 text-sm font-medium leading-snug">{service.tagline}</p>
                {service.bullets && (
                  <ul className="mt-3 list-disc list-inside text-xs text-muted-foreground text-left space-y-1 pl-4">
                    {service.bullets.map((bullet, i) => (
                      <li key={i}>{bullet}</li>
                    ))}
                  </ul>
                )}
              </CardContent>
              <CardFooter className="w-full pt-4 pb-5 px-4 mt-auto">
                <Button asChild className="w-full bg-primary hover:bg-primary/90 text-primary-foreground group-hover:shadow-md transition-shadow">
                  <Link href={service.link}>
                    {service.ctaText}
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
        
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="shadow-md text-left bg-card">
              <CardHeader className="flex flex-row items-center gap-3 pb-2">
                <Avatar className="h-11 w-11">
                  <AvatarImage src={`https://picsum.photos/seed/${testimonial.avatarSeed}/100/100`} alt={testimonial.name} data-ai-hint="person avatar" />
                  <AvatarFallback>{testimonial.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-md font-semibold">{testimonial.name}, {testimonial.age}</CardTitle>
                   <div className="flex items-center">
                    {Array(testimonial.rating).fill(0).map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-primary fill-primary" />
                    ))}
                    {Array(5 - testimonial.rating).fill(0).map((_, i) => (
                        <Star key={`empty-${i}`} className="h-4 w-4 text-muted-foreground/50" />
                    ))}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-1">
                <blockquote className="italic text-sm text-muted-foreground">
                  "{testimonial.quote}"
                </blockquote>
              </CardContent>
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

        <div className="mt-16 border-t border-border pt-12 w-full max-w-3xl mx-auto">
            <h3 className="mb-4 text-2xl font-bold tracking-tight text-foreground">
                <span className="text-primary">🔶</span> Klaar om te starten? <span className="text-primary">🔶</span>
            </h3>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" asChild className="shadow-md hover:shadow-lg transition-shadow bg-primary hover:bg-primary/90 text-primary-foreground">
                    <Link href="/quizzes">Start gratis quiz</Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="shadow-md hover:shadow-lg transition-shadow">
                    <Link href="/dashboard/coaching">Ontdek coaching-hub</Link>
                </Button>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
                Probeer eerst de quiz, kies daarna de begeleiding die bij jou past.
            </p>
        </div>

      </div>
    </section>
  );
}

