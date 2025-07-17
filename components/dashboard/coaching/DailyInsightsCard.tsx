// src/components/dashboard/coaching/DailyInsightsCard.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Sparkles, Repeat } from '@/lib/icons';
import { format } from 'date-fns';
import { nl } from 'date-fns/locale';

interface AiCoachingContent {
  dailyAffirmation: string;
  dailyCoachingTip: string;
  microTaskSuggestion: string;
}

interface DailyInsightsCardProps {
  isLoading: boolean;
  content: AiCoachingContent | null;
  selectedDate: Date | undefined;
}

export const DailyInsightsCard = ({ isLoading, content, selectedDate }: DailyInsightsCardProps) => {
  const formattedDate = selectedDate ? `voor ${format(selectedDate, 'PPP', { locale: nl })}` : '';

  return (
    <>
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            Affirmatie {formattedDate}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? <Skeleton className="h-6 w-3/4" /> : <p className="text-lg italic text-foreground">{content?.dailyAffirmation || "Selecteer een datum of voltooi de Zelfreflectie Tool."}</p>}
        </CardContent>
      </Card>
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Repeat className="h-6 w-6 text-accent" />
            Jouw Groei Streak
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-semibold text-foreground">🔥 5 dagen op rij actief!</p>
          <p className="text-sm text-muted-foreground">Blijf zo doorgaan, je doet het geweldig!</p>
        </CardContent>
      </Card>
    </>
  );
};
