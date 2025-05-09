import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { Check } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="py-16 md:py-24 lg:py-32 bg-gradient-to-b from-background to-secondary/30">
      <div className="container mx-auto grid grid-cols-1 items-center justify-items-center gap-12 md:grid-cols-2 md:gap-16 lg:gap-20">
        {/* Text content column */}
        <div className="flex flex-col items-center text-center gap-6 md:items-start md:text-left max-w-xl lg:max-w-2xl">
          <h1 className="text-4xl font-bold tracking-tight text-foreground md:text-5xl lg:text-6xl">
            Ontdek je <span className="text-primary">unieke</span> sterktes en uitdagingen
          </h1>
          <p className="text-lg text-muted-foreground md:text-xl">
            Benieuwd waarom jij soms anders denkt of reageert dan anderen? Deze test helpt je jouw unieke sterktes en uitdagingen te ontdekken. Krijg direct praktische tips voor school, vriendschappen en je dagelijks leven.
          </p>
          <ul className="space-y-2 text-muted-foreground md:text-lg text-left self-center md:self-start">
            <li className="flex items-center gap-2">
              <Check className="h-5 w-5 text-primary flex-shrink-0" />
              <span>Persoonlijk rapport in PDF</span>
            </li>
            <li className="flex items-center gap-2">
              <Check className="h-5 w-5 text-primary flex-shrink-0" />
              <span>Diepgaande subquizzen op maat</span>
            </li>
            <li className="flex items-center gap-2">
              <Check className="h-5 w-5 text-primary flex-shrink-0" />
              <span>Dagelijkse coachingtips (met account)</span>
            </li>
          </ul>
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto items-stretch sm:items-center justify-center md:justify-start">
            <Button size="lg" asChild className="shadow-md hover:shadow-lg transition-shadow">
              <Link href="/quizzes">Ontdek alle quizzen</Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="shadow-md hover:shadow-lg transition-shadow">
              <Link href="/quiz/teen-neurodiversity-quiz">Start Tienerquiz (zonder account)</Link>
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            Al 1.200+ jongeren gingen je voor
          </p>
        </div>
        {/* Image column */}
        <div className="relative aspect-[16/10] rounded-lg overflow-hidden shadow-2xl w-full max-w-md md:max-w-lg lg:max-w-xl">
          <Image
            src="https://picsum.photos/seed/teenagerOnlineQuiz/600/750"
            alt="Een jongere die geconcentreerd een online quiz invult op een laptop, symbool voor zelfontdekking en inzicht."
            layout="fill"
            objectFit="cover"
            data-ai-hint="teenager laptop quiz"
            priority
          />
           <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent"></div>
        </div>
      </div>
    </section>
  );
}
