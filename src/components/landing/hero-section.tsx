import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

export function HeroSection() {
  return (
    <section className="py-16 md:py-24 lg:py-32 bg-gradient-to-b from-background to-secondary/30">
      <div className="container grid grid-cols-1 items-center justify-items-center gap-8 md:grid-cols-2">
        <div className="flex flex-col items-start text-left gap-6 md:items-start md:text-left">
          <h1 className="text-4xl font-bold tracking-tight text-foreground md:text-5xl lg:text-6xl">
            Ontdek je <span className="text-primary">neurodiversiteits</span>-profiel
          </h1>
          <p className="text-lg text-muted-foreground md:text-xl">
            Heb je je ooit afgevraagd waarom jij op sommige manieren anders denkt dan je vrienden? Waarom jij misschien sneller afgeleid bent of juist supergefocust kunt zijn? Of waarom drukke plekken je soms overweldigen? Deze test helpt je ontdekken wat jouw sterke punten zijn en waar jouw uitdagingen liggen. Je krijgt persoonlijke tips die je echt kunnen helpen op school en met vrienden. Neurodiversiteit betekent dat ieders brein anders werkt - ontdek hoe jouw brein speciaal is!
          </p>
          <Button size="lg" asChild className="shadow-lg hover:shadow-primary/50 transition-shadow">
            <Link href="/quizzes">Start gratis quiz</Link>
          </Button>
        </div>
        <div className="relative aspect-video rounded-lg overflow-hidden shadow-2xl w-full max-w-md">
          <Image
            src="https://picsum.photos/seed/neuroArtCreative/800/450"
            alt="Creatieve weergave van neurodiversiteit profiel"
            layout="fill"
            objectFit="cover"
            data-ai-hint="brain creativity"
          />
           <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
        </div>
      </div>
    </section>
  );
}
