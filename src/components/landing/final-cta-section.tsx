import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sparkles, ArrowRight } from '@/lib/icons';

export function FinalCtaSection() {
  return (
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="container mx-auto text-center max-w-3xl px-4">
        <h2 className="mb-6 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
          Klaar om uw kind <span className="text-primary">écht te begrijpen</span> en krachtig te ondersteunen?
        </h2>
        <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
          Zet vandaag de eerste stap naar meer inzicht, rust en effectieve strategieën voor uw gezin. MindNavigator biedt u de tools, de kennis, en de weg naar een sterkere verbinding.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <Button size="lg" asChild className="shadow-md hover:shadow-lg transition-shadow text-base sm:text-lg px-8 py-3 sm:py-6">
            <Link href="/pricing">Bekijk onze Abonnementen <ArrowRight className="ml-2 h-5 w-5"/></Link>
          </Button>
          <Button size="lg" variant="outline" asChild className="shadow-md hover:shadow-lg transition-shadow text-base sm:text-lg px-8 py-3 sm:py-6">
            <Link href="/for-parents/quizzes">Doe de "Ken je Kind" Check (Gratis)</Link>
          </Button>
        </div>
        <p className="text-muted-foreground flex items-center justify-center gap-2">
          <Sparkles className="h-5 w-5 text-accent" />
          Investeer in het welzijn en de toekomst van uw kind.
        </p>
      </div>
    </section>
  );
}
