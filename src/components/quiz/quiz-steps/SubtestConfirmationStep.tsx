// src/components/quiz/quiz-steps/SubtestConfirmationStep.tsx
"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Brain } from 'lucide-react';
import { neurotypeDescriptionsTeen } from '@/lib/quiz-data/teen-neurodiversity-quiz';
import type { ElementType } from 'react';

interface SubtestConfirmationStepProps {
  relevantSubtests: string[];
  onStartSubtests: () => void;
  onSkip: () => void;
}

export const SubtestConfirmationStep = ({ relevantSubtests, onStartSubtests, onSkip }: SubtestConfirmationStepProps) => {
  return (
    <Card className="w-full max-w-2xl shadow-xl rounded-lg">
      <CardHeader className="text-center pt-8 px-6">
        <CardTitle className="text-[1.75rem] font-bold text-accent">Klaar voor de volgende stap?</CardTitle>
        <CardDescription className="pt-1 text-foreground/80 leading-relaxed text-base">
            Op basis van je antwoorden gaan we dieper in op een paar thema's die bij jou passen. Dit helpt je nog meer te ontdekken!
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 pt-2 px-6">
        <div className="space-y-4">
          {relevantSubtests.map(key => {
            const profile = neurotypeDescriptionsTeen[key];
            if (!profile) return null; // Guard clause if profile doesn't exist
            const Icon: ElementType = Brain; // Fallback icon
            return (
              <Card key={key} className="bg-muted/50 border p-4 flex items-center gap-4">
                <Icon className="h-8 w-8 text-primary flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-foreground">{profile.title}</h4>
                  <p className="text-sm text-muted-foreground">{profile.uitleg || "Verdiepende vragen over dit thema."}</p>
                </div>
              </Card>
            );
          })}
        </div>
        <div className="my-6 p-4 bg-primary/10 border-l-4 border-primary rounded-r-lg">
          <p className="font-semibold text-primary">Een noot van Dr. Florentine Sage:</p>
          <blockquote className="mt-1 italic text-muted-foreground">
              "We gaan nu wat dieper in op de thema's die bij jou naar voren kwamen. Onthoud: we zoeken niet naar wat 'fout' is, maar naar wat jou uniek maakt. Jouw antwoorden helpen ons een completer beeld te krijgen van jouw superkrachten en uitdagingen. Wees eerlijk, er zijn geen foute antwoorden!"
          </blockquote>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row justify-end gap-2 pt-6 pb-8 px-6">
        <Button variant="secondary" onClick={onSkip}>Sla over & bekijk basisinzichten</Button>
        <Button onClick={onStartSubtests} className="w-full sm:w-auto">
            Ja, stel me de verdiepende vragen! <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};
