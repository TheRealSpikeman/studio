
// src/components/page/word-coach/BecomeCoachBenefits.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { TrendingUp, Euro, Settings2, Star, Users, Handshake, Brain } from '@/lib/icons';

const benefits = [
  {
    icon: <Handshake className="h-10 w-10 text-primary" />,
    title: 'Betekenisvol Werk',
    description: 'Begeleid jongeren in hun persoonlijke ontwikkeling en help hen hun potentieel te benutten.',
    borderColorClass: 'border-green-500',
  },
  {
    icon: <Brain className="h-10 w-10 text-primary" />,
    title: 'Deel Jouw Expertise',
    description: 'Zet jouw kennis als (kinder)psycholoog, orthopedagoog of ervaren coach in.',
    borderColorClass: 'border-blue-500',
  },
  {
    icon: <Settings2 className="h-10 w-10 text-primary" />,
    title: 'Flexibel & Ondersteund',
    description: 'Bepaal je eigen uren en tarief. Wij ondersteunen met administratie en platformtools.',
    borderColorClass: 'border-purple-500',
  },
];

export function BecomeCoachBenefits() {
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="mb-12 text-center text-3xl font-bold tracking-tight text-foreground md:text-4xl">
          Waarom coach worden bij MindNavigator?
        </h2>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3 mb-16">
          {benefits.map((benefit, index) => (
            <Card 
              key={index} 
              className={`flex flex-col items-center text-center shadow-lg hover:shadow-xl transition-shadow duration-300 border-t-4 ${benefit.borderColorClass} pt-4`}
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

        <div className="text-center mb-16">
          <Button size="lg" asChild className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-md hover:shadow-lg transition-shadow px-8 py-6 text-lg">
            <Link href="/coach-application">Meld je nu aan als coach</Link>
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            <Card className="shadow-md">
                <CardHeader className="flex-row items-center gap-4 pb-2">
                    <Users className="h-10 w-10 text-muted-foreground"/>
                    <div>
                        <CardTitle className="text-lg">Gekwalificeerde Professionals</CardTitle>
                        <p className="text-3xl font-bold text-primary">+50</p>
                    </div>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">Word onderdeel van een netwerk van deskundige coaches en therapeuten.</p>
                </CardContent>
            </Card>
            <Card className="shadow-md">
                 <CardHeader className="pb-2">
                     <div className="flex items-center gap-1">
                        {Array(5).fill(0).map((_, i) => (
                            <Star key={i} className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                        ))}
                     </div>
                    <CardTitle className="text-lg pt-1">"Een waardevolle bijdrage"</CardTitle>
                </CardHeader>
                <CardContent>
                    <blockquote className="italic text-sm text-muted-foreground">
                    "MindNavigator biedt een laagdrempelige manier om jongeren te bereiken die baat hebben bij coaching. Het platform is professioneel en makkelijk in gebruik."
                    </blockquote>
                    <p className="text-xs text-muted-foreground mt-2 text-right">- Dr. S. Elzinga, Kinderpsycholoog</p>
                </CardContent>
            </Card>
        </div>

      </div>
    </section>
  );
}
