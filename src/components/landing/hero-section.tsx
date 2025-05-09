import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { FileText, Puzzle, MessageSquareText } from 'lucide-react'; // Using MessageSquareText for coaching icon

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
            Heb je je ooit afgevraagd waarom jij op sommige manieren anders denkt dan je vrienden? Waarom jij misschien sneller afgeleid bent of juist supergefocust kunt zijn? Of waarom drukke plekken je soms overweldigen? Deze test helpt je ontdekken wat jouw sterke punten zijn en waar jouw uitdagingen liggen. Je krijgt persoonlijke tips die je echt kunnen helpen op school en met vrienden. Neurodiversiteit betekent dat ieders brein anders werkt - ontdek hoe jouw brein speciaal is!
          </p>
          <ul className="space-y-3 text-muted-foreground md:text-lg text-left self-center md:self-start">
            <li className="flex items-center gap-3">
              <FileText className="h-6 w-6 text-primary flex-shrink-0" />
              <span>Persoonlijk rapport in PDF</span>
            </li>
            <li className="flex items-center gap-3">
              <Puzzle className="h-6 w-6 text-primary flex-shrink-0" />
              <span>Diepgaande subquizzen op maat</span>
            </li>
            <li className="flex items-center gap-3">
              <MessageSquareText className="h-6 w-6 text-primary flex-shrink-0" />
              <span>Dagelijkse coachingtips (met account)</span>
            </li>
          </ul>
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto items-stretch sm:items-center justify-center md:justify-start pt-4">
            <Button size="lg" asChild className="shadow-md hover:shadow-lg transition-shadow px-8 py-6">
              <Link href="/quizzes">Ontdek alle quizzen</Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="shadow-md hover:shadow-lg transition-shadow px-8 py-6">
              <Link href="/quiz/teen-neurodiversity-quiz">Start Tienerquiz (zonder account)</Link>
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mt-3">
            ★ 4.8 (1.200+ jongeren gingen je voor)
          </p>
        </div>
        {/* Image column */}
        <div className="relative aspect-[16/10] rounded-lg overflow-hidden shadow-2xl w-full max-w-md md:max-w-lg lg:max-w-xl">
          <Image
            src="https://picsum.photos/seed/teenagerOnlineQuiz/600/750"
            alt="Tiener die een neurodiversiteit-quiz invult op een laptop, gefocust en geïnteresseerd."
            layout="fill"
            objectFit="cover"
            data-ai-hint="teenager laptop quiz"
            priority
          />
           <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-black/10 to-transparent"></div>
        </div>
      </div>
    </section>
  );
}