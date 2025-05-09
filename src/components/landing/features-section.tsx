
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldCheck, Puzzle, MessagesSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const features = [
  {
    icon: <ShieldCheck className="h-10 w-10 text-primary" />,
    title: 'Persoonlijk Rapport',
    description: 'Ontvang een gedetailleerd rapport over jouw neurodiversiteitsprofiel, inclusief sterke punten en aandachtspunten.',
    ctaText: 'Bekijk Rapport Voorbeeld',
    ctaLink: '/dummy-report.pdf', // Changed link to dummy PDF
  },
  {
    icon: <Puzzle className="h-10 w-10 text-primary" />,
    title: 'Diepgaande Subquizzen',
    description: 'Verdiep je kennis met specifieke subquizzen die aansluiten bij jouw basisprofiel voor een completer beeld.',
    ctaText: 'Ontdek Subquizzen',
    ctaLink: '/quizzes',
  },
  {
    icon: <MessagesSquare className="h-10 w-10 text-primary" />,
    title: 'Dagelijkse Coaching',
    description: 'Krijg dagelijkse, op maat gemaakte tips en inzichten om je te helpen navigeren en groeien.',
    ctaText: 'Probeer Coaching',
    ctaLink: '/dashboard/coaching',
  },
];

export function FeaturesSection() {
  return (
    <section className="flex flex-col items-center justify-center py-16 md:py-24 bg-background">
      <div className="container flex flex-col items-center">
        <h2 className="mb-12 text-center text-3xl font-bold tracking-tight text-foreground md:text-4xl">
          Wat kun je verwachten?
        </h2>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3 justify-center">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="flex flex-col items-center text-center shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-transparent hover:border-primary/30"
            >
              <CardHeader className="items-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  {feature.icon}
                </div>
                <CardTitle className="text-xl font-semibold">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
              <CardFooter className="w-full">
                <Button asChild className="w-full">
                  <Link href={feature.ctaLink}>{feature.ctaText}</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
