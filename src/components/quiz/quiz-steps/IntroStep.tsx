// src/components/quiz/quiz-steps/IntroStep.tsx
"use client";

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, ArrowRight, User, Target, Clock, ShieldCheck, PauseCircle, Users as UsersIcon } from 'lucide-react';
import Link from 'next/link';

interface IntroStepProps {
  ageGroup: '12-14' | '15-18' | null;
  onStart: () => void;
  backLink: string;
}

export const IntroStep = ({ ageGroup, onStart, backLink }: IntroStepProps) => {
  return (
    <Card className="w-full max-w-3xl text-center shadow-xl border-border/50">
       <CardHeader className="pt-10 px-6">
        <Sparkles className="mx-auto h-12 w-12 text-primary mb-4" />
        <CardTitle className="text-3xl font-bold text-foreground">
            Jouw Reis naar Zelfinzicht Start Hier!
        </CardTitle>
        <CardDescription className="text-lg text-muted-foreground mt-2 max-w-2xl mx-auto">
            Deze zelfreflectie-quiz helpt je ontdekken wat jouw unieke denk- en leerstijl is. Er zijn geen foute antwoorden, alleen jouw ervaring telt.
        </CardDescription>
        </CardHeader>
        <CardContent className="px-6 sm:px-8 space-y-6 pt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-left text-sm">
              <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg border">
                  <User className="h-7 w-7 text-primary flex-shrink-0" />
                  <div>
                      <strong className="text-foreground">Voor wie?</strong>
                      <p className="text-muted-foreground">Speciaal voor jongeren van {ageGroup} jaar.</p>
                  </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg border">
                  <Target className="h-7 w-7 text-primary flex-shrink-0" />
                  <div>
                      <strong className="text-foreground">Doel</strong>
                      <p className="text-muted-foreground">Zelfinzicht krijgen, geen 'goed' of 'fout'.</p>
                  </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg border">
                  <Clock className="h-7 w-7 text-primary flex-shrink-0" />
                  <div>
                      <strong className="text-foreground">Duur</strong>
                      <p className="text-muted-foreground">Ongeveer 10-15 minuten.</p>
                  </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg border">
                  <ShieldCheck className="h-7 w-7 text-primary flex-shrink-0" />
                  <div>
                      <strong className="text-foreground">Privacy</strong>
                      <p className="text-muted-foreground">Je antwoorden zijn privé en worden veilig opgeslagen.</p>
                  </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg border">
                  <PauseCircle className="h-7 w-7 text-primary flex-shrink-0" />
                  <div>
                      <strong className="text-foreground">Pauzeren</strong>
                      <p className="text-muted-foreground">Je kunt de quiz altijd later afmaken.</p>
                  </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg border">
                  <UsersIcon className="h-7 w-7 text-primary flex-shrink-0" />
                  <div>
                      <strong className="text-foreground">Delen</strong>
                      <p className="text-muted-foreground">Jij bepaalt of je ouders je resultaten zien. Delen is nodig voor een vergelijkende analyse.</p>
                  </div>
              </div>
          </div>
        <p className="text-sm text-muted-foreground">
            Wil je eerst meer weten over verschillende denkstijlen? Bezoek onze{' '}
            <Link href={`/features/coaching-en-tools?from=${encodeURIComponent(backLink)}`} target="_blank" rel="noopener noreferrer" className="text-primary underline hover:text-primary/80">info pagina over denkstijlen</Link>.
        </p>
        </CardContent>
        <CardFooter className="flex justify-center pt-6 pb-8">
        <Button size="lg" onClick={onStart} className="shadow-md">
            Start de Zelfreflectie
            <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
        </CardFooter>
    </Card>
  );
};
