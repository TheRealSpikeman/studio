// src/components/page/word-tutor/BecomeTutorBenefits.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { TrendingUp, Euro, Settings2, Star, Users } from '@/lib/icons';

const benefits = [
  {
    icon: <TrendingUp className="h-10 w-10 text-primary" />, // Icon remains primary color
    title: 'Jouw Impact',
    description: 'Help tieners hun zelfvertrouwen en schoolresultaten te verbeteren.',
    borderColorClass: 'border-yellow-500', // Warm orange-gold tint
  },
  {
    icon: <Euro className="h-10 w-10 text-primary" />, // Icon remains primary color
    title: 'Bepaal Je Inkomsten',
    description: 'Werk wanneer jij wilt en zet je eigen tarief.',
    borderColorClass: 'border-green-500', // Fris groen
  },
  {
    icon: <Settings2 className="h-10 w-10 text-primary" />, // Icon remains primary color
    title: 'Wij Ondersteunen Jou',
    description: 'Wij regelen administratie, betalingen en platformtools.',
    borderColorClass: 'border-purple-500', // Zacht paars
  },
];

export function BecomeTutorBenefits() {
  return (
    <section className="py-16 md:py-24 bg-secondary/30">
      <div className="container mx-auto px-4">
        <h2 className="mb-12 text-center text-3xl font-bold tracking-tight text-foreground md:text-4xl">
          Waarom tutor worden bij MindNavigator?
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
            <Link href="/tutor-application">Meld je nu aan als tutor</Link>
          </Button>
        </div>
        
        {/* Testimonials or Stats Section Placeholder */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            <Card className="shadow-md">
                <CardHeader className="flex-row items-center gap-4 pb-2">
                    <Users className="h-10 w-10 text-muted-foreground"/>
                    <div>
                        <CardTitle className="text-lg">Gecertificeerde Tutors</CardTitle>
                        <p className="text-3xl font-bold text-primary">+150</p>
                    </div>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">Sluit je aan bij ons groeiende netwerk van deskundige tutors.</p>
                </CardContent>
            </Card>
            <Card className="shadow-md">
                 <CardHeader className="pb-2">
                     <div className="flex items-center gap-1">
                        {Array(5).fill(0).map((_, i) => (
                            <Star key={i} className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                        ))}
                     </div>
                    <CardTitle className="text-lg pt-1">"Geweldig platform!"</CardTitle>
                </CardHeader>
                <CardContent>
                    <blockquote className="italic text-sm text-muted-foreground">
                    "Dankzij MindNavigator heb ik mijn bijlespraktijk enorm kunnen uitbreiden en help ik nu wekelijks meerdere studenten."
                    </blockquote>
                    <p className="text-xs text-muted-foreground mt-2 text-right">- J. de Vries, Wiskunde Tutor</p>
                </CardContent>
            </Card>
        </div>

      </div>
    </section>
  );
}
