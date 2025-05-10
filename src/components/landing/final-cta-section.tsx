
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function FinalCtaSection() {
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto text-center max-w-2xl px-4">
        <h2 className="mb-6 text-2xl font-bold tracking-tight text-foreground md:text-3xl">
          Klaar om te beginnen?
        </h2>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
          <Button size="lg" asChild className="shadow-md hover:shadow-lg transition-shadow">
            <Link href="/quizzes">Start gratis quiz</Link>
          </Button>
          <Button size="lg" variant="outline" asChild className="shadow-md hover:shadow-lg transition-shadow">
            <Link href="/dashboard/coaching">Ontdek coaching-hub</Link>
          </Button>
        </div>
        <p className="text-base text-foreground/80">
          Kies je begeleiding op maat: online groepssessies, 1-op-1 of dagelijkse coaching-hub. Probeer het gratis!
        </p>
      </div>
    </section>
  );
}

