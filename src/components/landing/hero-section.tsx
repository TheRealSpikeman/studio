import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

export function HeroSection() {
  return (
    <section className="py-16 md:py-24 lg:py-32 bg-gradient-to-b from-background to-secondary/30">
      <div className="container grid grid-cols-1 items-center gap-8 md:grid-cols-2">
        <div className="flex flex-col items-start gap-6">
          <h1 className="text-4xl font-bold tracking-tight text-foreground md:text-5xl lg:text-6xl">
            Ontdek je <span className="text-primary">neurodiversiteits</span>-profiel
          </h1>
          <p className="text-lg text-muted-foreground md:text-xl">
            Krijg inzicht in jouw unieke sterktes en uitdagingen. Start vandaag nog met onze wetenschappelijk onderbouwde quiz en ontvang gepersonaliseerde coaching.
          </p>
          <Button size="lg" asChild className="shadow-lg hover:shadow-primary/50 transition-shadow">
            <Link href="/quizzes">Start gratis quiz</Link>
          </Button>
        </div>
        <div className="relative aspect-video rounded-lg overflow-hidden shadow-2xl">
          <Image
            src="https://picsum.photos/seed/neurodiversity/800/450"
            alt="Abstract representation of neurodiversity"
            layout="fill"
            objectFit="cover"
            data-ai-hint="brain connections"
          />
           <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
        </div>
      </div>
    </section>
  );
}
