// src/app/dashboard/admin/quiz-management/reports/page.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BarChartHorizontal } from 'lucide-react';

export default function QuizReportsPage() {
  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold flex items-center gap-2">
            <BarChartHorizontal className="h-6 w-6 text-primary" />
            Quiz Rapportages
          </CardTitle>
          <CardDescription>
            Gedetailleerde analyses van quizdeelnames, scores en vraagprestaties.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] bg-muted rounded-lg flex items-center justify-center">
            <p className="text-muted-foreground italic text-lg">
              Quiz rapportage functionaliteit is binnenkort beschikbaar.
            </p>
          </div>
          <ul className="list-disc list-inside mt-6 space-y-2 text-muted-foreground">
            <li>Overzicht van afnames per quiz (grafiek).</li>
            <li>Gemiddelde score per domein/profiel.</li>
            <li>Snel inzicht in welke vragen vaak anders beantwoord worden.</li>
            <li>Demografische data van deelnemers (geanonimiseerd).</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
