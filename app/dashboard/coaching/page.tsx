// src/app/dashboard/coaching/page.tsx
"use client";

import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Calendar } from '@/components/ui/calendar';
import { Alert, AlertDescription as AlertDescUi, AlertTitle as AlertTitleUi } from "@/components/ui/alert";
import Link from 'next/link';
import { CalendarDays, Eye, EyeOff, Sparkles, Info } from '@/lib/icons';
import { COACHING_CONFIG } from '@/lib/constants/coaching';

// Nieuwe, opgesplitste componenten
import { DailyInsightsCard } from '@/components/dashboard/coaching/DailyInsightsCard';
import { JournalSection } from '@/components/dashboard/coaching/JournalSection';
import { TasksSection } from '@/components/dashboard/coaching/TasksSection';
import { MediaAndProgressSection } from '@/components/dashboard/coaching/MediaAndProgressSection';

// Nieuwe custom hook voor data
import { useCoachingData } from '@/hooks/useCoachingData';

// Service voor localStorage
import { storageService } from '@/services/storageService';

export default function CoachingPage() {
  const [isClient, setIsClient] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [showFirstTimeCoachingExplanation, setShowFirstTimeCoachingExplanation] = useState(false);
  const { toast } = useToast();
  
  // Gebruik van de custom hook
  const { aiCoachingContent, isLoading: isLoadingAiContent, error } = useCoachingData(selectedDate);
  
  // Effect om client-side status en welkomstbericht te beheren
  useEffect(() => {
    setIsClient(true);
    const hasOnboardingAnalysis = !!storageService.getOnboardingAnalysis();
    const firstCoachingViewed = !!storageService.getFirstCoachingViewed();
    
    if (hasOnboardingAnalysis && !firstCoachingViewed) {
      setShowFirstTimeCoachingExplanation(true);
      storageService.setFirstCoachingViewed();
    }
  }, []);

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(new Date(date.setHours(0, 0, 0, 0))); 
    }
  };

  const toggleCalendar = () => setIsCalendarOpen(prev => !prev);
  
  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-3xl font-bold text-foreground">Dagelijkse Coaching</h1>
        <p className="text-muted-foreground">
          Jouw persoonlijke hub voor groei, reflectie en welzijn. Bekijk content voor een specifieke dag via de kalender.
        </p>
      </section>

      {isClient && !isLoadingAiContent && !showFirstTimeCoachingExplanation && storageService.getOnboardingAnalysis() && (
        <Alert variant="default" className="bg-gradient-to-r from-primary/5 to-purple-50/50 border-primary/20 shadow-sm">
          <Sparkles className="h-5 w-5 !text-primary" />
          <AlertTitleUi className="text-primary font-semibold">Jouw Persoonlijke Coaching</AlertTitleUi>
          <AlertDescUi className="text-foreground/80">
            Op basis van jouw Zelfreflectie Tool krijg je elke dag content die echt bij jou past.
            <Button variant="link" className="p-0 h-auto text-primary hover:text-primary/80 ml-2" asChild>
              <Link href="/dashboard/results">Bekijk je resultaten →</Link>
            </Button>
          </AlertDescUi>
        </Alert>
      )}

      {isClient && showFirstTimeCoachingExplanation && (
         <Alert variant="default" className="bg-blue-50 border-blue-200 text-blue-700">
            <Info className="h-5 w-5 !text-blue-600" />
            <AlertTitleUi className="text-blue-700 font-semibold">Welkom bij je Coaching Hub!</AlertTitleUi>
            <AlertDescUi className="text-blue-600">
                Dit is je persoonlijke ruimte voor dagelijkse groei. Elke dag vind je hier content die is afgestemd op de inzichten uit je Zelfreflectie Tool.
            </AlertDescUi>
          </Alert>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertTitleUi>Fout bij laden</AlertTitleUi>
          <AlertDescUi>{error}</AlertDescUi>
        </Alert>
      )}

      <Card className="shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <CalendarDays className="h-6 w-6 text-primary" />
            Selecteer een datum
          </CardTitle>
          <Button onClick={toggleCalendar} variant="outline">
            {isCalendarOpen ? <EyeOff className="mr-2 h-4 w-4" /> : <Eye className="mr-2 h-4 w-4" />}
            {isCalendarOpen ? "Verberg Kalender" : "Toon Kalender"}
          </Button>
        </CardHeader>
        {isCalendarOpen && (
          <CardContent className="flex justify-center pt-4">
            {!isClient ? (
              <Skeleton className="h-[290px] w-[280px] rounded-md border" />
            ) : (
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={handleDateSelect}
                className="rounded-md border"
                locale={nl}
                disabled={(date) => date > new Date() || date < COACHING_CONFIG.START_DATE}
                initialFocus
              />
            )}
          </CardContent>
        )}
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        <DailyInsightsCard 
          isLoading={isLoadingAiContent} 
          content={aiCoachingContent}
          selectedDate={selectedDate}
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <JournalSection selectedDate={selectedDate} onSave={toast} />
        <TasksSection 
          isLoading={isLoadingAiContent} 
          content={aiCoachingContent}
          selectedDate={selectedDate}
        />
      </div>

      <MediaAndProgressSection selectedDate={selectedDate} />
    </div>
  );
}
