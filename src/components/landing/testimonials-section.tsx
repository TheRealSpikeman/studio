
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Star, Users,ThumbsUp } from 'lucide-react';

const testimonials = [
  {
    name: 'Sophie V.',
    age: 16,
    avatarSeed: 'sophie-avatar',
    quote: "Deze tool gaf me echt inzicht in waarom ik soms zo overweldigd raak in drukke klassen. De tips voor gevoeligheid helpen me enorm!",
    rating: 5,
  },
  {
    name: 'Daan K.',
    age: 14,
    avatarSeed: 'daan-avatar',
    quote: "Nu snap ik beter hoe mijn brein werkt bij drukte en de coaching tips zijn super praktisch voor school.",
    rating: 4,
  },
  {
    name: 'Lisa de B.',
    age: 17,
    avatarSeed: 'lisa-avatar',
    quote: "Eindelijk een platform dat uitlegt waarom ik dingen anders zie. Het overzicht over sociale voorkeuren was verhelderend en de dagelijkse affirmaties zijn fijn.",
    rating: 5,
  },
];

export function TestimonialsSection() {
  return (
    <section className="py-12 md:py-16 bg-secondary/30">
      <div className="container mx-auto px-4">
        <h2 className="mb-12 text-center text-3xl font-bold tracking-tight text-foreground md:text-4xl">
          Ervaringen van Jongeren én Ouders
        </h2>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="flex flex-col shadow-lg transform hover:scale-105 transition-transform duration-300 bg-card">
              <CardHeader className="flex flex-row items-center gap-4 pb-2">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={`https://picsum.photos/seed/${testimonial.avatarSeed}/100/100`} alt={testimonial.name} data-ai-hint="person avatar" />
                  <AvatarFallback>{testimonial.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-lg font-semibold">{testimonial.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">Leeftijd: {testimonial.age}</p>
                </div>
              </CardHeader>
              <CardContent className="flex-grow pt-2">
                <div className="mb-2 flex">
                  {Array(5).fill(0).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${i < testimonial.rating ? 'text-primary fill-primary' : 'text-muted-foreground'}`}
                    />
                  ))}
                </div>
                <blockquote className="italic text-muted-foreground before:content-['“'] after:content-['”']">
                  {testimonial.quote}
                </blockquote>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 gap-8 text-center">
            <div className="rounded-lg border bg-card p-6 shadow-sm">
                <Users className="mx-auto h-12 w-12 text-primary mb-3"/>
                <p className="text-3xl font-bold text-foreground">1.200+</p>
                <p className="text-muted-foreground">Zelfreflectie-sessies voltooid door jongeren</p>
            </div>
            <div className="rounded-lg border bg-card p-6 shadow-sm">
                <ThumbsUp className="mx-auto h-12 w-12 text-primary mb-3"/>
                <p className="text-3xl font-bold text-foreground">95%</p>
                <p className="text-muted-foreground">Ouders beveelt MindNavigator aan</p>
            </div>
        </div>
      </div>
    </section>
  );
}
