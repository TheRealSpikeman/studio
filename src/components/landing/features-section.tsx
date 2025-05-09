import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldCheck, Puzzle, MessagesSquare } from 'lucide-react';

const features = [
  {
    icon: <ShieldCheck className="h-10 w-10 text-primary" />,
    title: 'Persoonlijk Rapport',
    description: 'Ontvang een gedetailleerd rapport over jouw neurodiversiteitsprofiel, inclusief sterke punten en aandachtspunten.',
  },
  {
    icon: <Puzzle className="h-10 w-10 text-primary" />,
    title: 'Diepgaande Subquizzen',
    description: 'Verdiep je kennis met specifieke subquizzen die aansluiten bij jouw basisprofiel voor een completer beeld.',
  },
  {
    icon: <MessagesSquare className="h-10 w-10 text-primary" />,
    title: 'Dagelijkse Coaching',
    description: 'Krijg dagelijkse, op maat gemaakte tips en inzichten om je te helpen navigeren en groeien.',
  },
];

export function FeaturesSection() {
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container">
        <h2 className="mb-12 text-center text-3xl font-bold tracking-tight text-foreground md:text-4xl">
          Wat kun je verwachten?
        </h2>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {features.map((feature, index) => (
            <Card key={index} className="flex flex-col items-center text-center shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  {feature.icon}
                </div>
                <CardTitle className="text-xl font-semibold">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
