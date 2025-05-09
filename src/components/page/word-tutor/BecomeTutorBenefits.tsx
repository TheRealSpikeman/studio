// src/components/page/word-tutor/BecomeTutorBenefits.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Euro, Settings2 } from 'lucide-react';

const benefits = [
  {
    icon: <TrendingUp className="h-10 w-10 text-primary" />,
    title: 'Impact Maken',
    description: 'Help jongeren groeien, hun zelfvertrouwen opbouwen en academisch succes behalen.',
  },
  {
    icon: <Euro className="h-10 w-10 text-primary" />,
    title: 'Flexibel Verdienen',
    description: 'Kies je eigen uurtarief en werk op momenten die perfect in jouw schema passen.',
  },
  {
    icon: <Settings2 className="h-10 w-10 text-primary" />,
    title: 'Ondersteuning',
    description: 'Wij regelen de administratie, veilige betalingen en bieden een platform voor jouw diensten.',
  },
];

export function BecomeTutorBenefits() {
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto">
        <h2 className="mb-12 text-center text-3xl font-bold tracking-tight text-foreground md:text-4xl">
          Waarom tutor worden bij MindNavigator?
        </h2>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {benefits.map((benefit, index) => (
            <Card 
              key={index} 
              className="flex flex-col items-center text-center shadow-lg hover:shadow-xl transition-shadow duration-300 border-t-4 border-primary pt-4"
            >
              <CardHeader className="items-center pb-2">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  {benefit.icon}
                </div>
                <CardTitle className="text-xl font-semibold text-primary">{benefit.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-muted-foreground">{benefit.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
