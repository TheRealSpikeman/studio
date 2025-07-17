// src/components/leerling/welcome/StartQuizCta.tsx
"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, ArrowRight } from '@/lib/icons';

interface StartQuizCtaProps {
  ageGroup: '12-14' | '15-18' | 'adult';
  startQuizLink: string;
}

export function StartQuizCta({ ageGroup, startQuizLink }: StartQuizCtaProps) {
  return (
    <Card className="p-6 bg-primary/10 rounded-lg border border-primary/30 text-left mb-10 shadow-md">
      <CardHeader className="p-0 mb-3">
        <CardTitle className="text-xl font-semibold text-primary flex items-center gap-2">
          <BookOpen className="h-6 w-6" />
          Jouw Eerste Stap: De Zelfreflectie Tool
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <p className="text-foreground/80 mb-4 text-base">
          Deze set vragen is speciaal voor jouw leeftijdscategorie ({ageGroup} jaar). Er zijn geen goede of foute antwoorden!
        </p>
        <Button size="lg" className="w-full" asChild>
          <Link href={startQuizLink}>
            Start de Zelfreflectie Tool Nu <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
