// src/app/quizzes/page.tsx
"use client";

import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent } from '@/components/ui/card';
import { Sparkles, BookOpen } from 'lucide-react';
import Link from 'next/link';

// Deze pagina linkt nu direct naar de twee primaire instappunten voor de zelfreflectie quiz.
// Alle andere quizzen zijn verwijderd om de flow te vereenvoudigen en de focus te leggen op de kernfunctionaliteit.
export default function QuizzesOverviewPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex flex-1 flex-col items-center py-12 md:py-16 lg:py-20 bg-muted/20">
        <div className="container space-y-12">
          <section className="text-center">
            <BookOpen className="mx-auto h-12 w-12 text-primary mb-4" />
            <h1 className="text-4xl font-bold text-foreground">Zelfreflectie Tools</h1>
            <p className="text-lg text-muted-foreground mt-2 max-w-2xl mx-auto">
              Kies de tool die bij jouw leeftijd past en start je reis naar zelfinzicht.
            </p>
             <p className="text-md text-accent mt-3 flex items-center justify-center gap-2">
              <Sparkles className="h-5 w-5" />
              Elke tool helpt je dichter bij betere focus en zelfinzicht.
            </p>
          </section>

          <section className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
             <Link href="/quiz/teen-neurodiversity-quiz?ageGroup=12-14" className="block group">
                <Card className="h-full shadow-lg hover:shadow-xl hover:border-primary transition-all duration-300 transform hover:-translate-y-1">
                    <CardHeader>
                        <CardTitle className="text-2xl text-primary group-hover:underline">Zelfreflectie Start (12-14 jr)</CardTitle>
                        <CardDescription className="text-base">Een interactieve gids speciaal voor jou om je unieke talenten en denkstijl te ontdekken.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">Duur: ca. 10-15 minuten.</p>
                    </CardContent>
                </Card>
             </Link>
             <Link href="/quiz/teen-neurodiversity-quiz?ageGroup=15-18" className="block group">
                 <Card className="h-full shadow-lg hover:shadow-xl hover:border-primary transition-all duration-300 transform hover:-translate-y-1">
                    <CardHeader>
                        <CardTitle className="text-2xl text-primary group-hover:underline">Zelfreflectie Start (15-18 jr)</CardTitle>
                        <CardDescription className="text-base">Duik dieper in wat jou drijft en hoe je het beste leert en functioneert in deze levensfase.</CardDescription>
                    </CardHeader>
                     <CardContent>
                        <p className="text-sm text-muted-foreground">Duur: ca. 12-18 minuten.</p>
                    </CardContent>
                </Card>
             </Link>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
