
// src/app/dashboard/leerling/quizzes/page.tsx
"use client"; 

import type { ElementType } from 'react';
import { useState, useMemo, useEffect, Suspense } from 'react'; 
import { useSearchParams } from 'next/navigation';
import { QuizCard, type QuizStatus, type QuizCardProps } from '@/components/quiz/quiz-card';
import { AlertTriangle, BookOpen, Sparkles, User, HelpCircle, Brain, Users as UsersIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import type { QuizAdmin, QuizCategory, QuizAudience } from '@/types/quiz-admin';
import { useToast } from '@/hooks/use-toast';
import { storageService } from '@/services/storageService';

// The Quiz interface now uses the full QuizCardProps for consistency.
export interface Quiz extends QuizCardProps {}
type AgeFilterType = 'all' | '12-14' | '15-18';


const getIconForCategory = (category: QuizCategory): ElementType => {
  switch (category) {
    case 'Basis': return Brain;
    case 'Thema': return Sparkles;
    case 'Ouder Observatie': return UsersIcon;
    default: return HelpCircle;
  }
};

const getBadgeForCategory = (category: QuizCategory): { text: string; className: string } | null => {
  if (category === 'Basis') return { text: "Start Hier!", className: "bg-primary text-primary-foreground" };
  return null;
};

const getAgeGroupFromAudience = (audience: QuizAudience): '12-14' | '15-18' | 'all' => {
  if (!audience) return 'all';
  if (audience.includes('12-14')) return '12-14';
  if (audience.includes('15-18')) return '15-18';
  return 'all';
};


const mapQuizAdminToQuiz = (quizAdmin: QuizAdmin): Quiz => {
  const badge = getBadgeForCategory(quizAdmin.category);
  const quizDifficulty = (quizAdmin as any).difficulty || 'gemiddeld';

  return {
    id: quizAdmin.id,
    title: quizAdmin.title,
    description: quizAdmin.description,
    status: 'Nog niet gestart', // This could be enhanced later with user progress data
    audience: quizAdmin.audience, // Pass the original audience string
    category: quizAdmin.category,
    imageUrl: quizAdmin.thumbnailUrl || `https://placehold.co/400x200.png?text=${quizAdmin.title.replace(/\s/g, '+')}`,
    dataAiHint: 'abstract illustration',
    ageGroup: getAgeGroupFromAudience(quizAdmin.audience),
    duration: quizAdmin.settings?.estimatedDuration || '5-10 min',
    questionCount: quizAdmin.questions.length,
    difficulty: quizDifficulty,
    icon: getIconForCategory(quizAdmin.category),
    badgeText: badge?.text,
    badgeClass: badge?.className,
    isNeuroIntake: quizAdmin.category === 'Basis',
    focusFlags: quizAdmin.focusFlags || [],
  };
};

function DashboardQuizContent() {
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [allAvailableQuizzes, setAllAvailableQuizzes] = useState<Quiz[]>([]);
  const [currentUserAgeGroup, setCurrentUserAgeGroup] = useState<AgeFilterType>('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAndProcessQuizzes = async () => {
      setIsLoading(true);
      const loadedQuizzesAdmin = await storageService.getAllQuizzes();
      
      const publishedQuizzes = loadedQuizzesAdmin.filter(q => q.status === 'published');
      setAllAvailableQuizzes(publishedQuizzes.map(mapQuizAdminToQuiz));
      setIsLoading(false);
    };

    fetchAndProcessQuizzes();
  }, [toast]);

  useEffect(() => {
    // This is now only used for the intro text, not for filtering.
    const ageGroupFromQuery = searchParams.get('ageGroup') as AgeFilterType;
    if (ageGroupFromQuery && (ageGroupFromQuery === '12-14' || ageGroupFromQuery === '15-18')) {
      setCurrentUserAgeGroup(ageGroupFromQuery);
    } else {
      setCurrentUserAgeGroup('15-18');
    }
  }, [searchParams]);

  const filteredAndSortedQuizzes = useMemo(() => {
    return allAvailableQuizzes
      // CORRECTED: Only filter out quizzes for parents.
      .filter(quiz => !quiz.audience.toLowerCase().includes('ouder'))
      .sort((a, b) => {
        if (a.isNeuroIntake && !b.isNeuroIntake) return -1;
        if (!a.isNeuroIntake && b.isNeuroIntake) return 1;
        return a.title.localeCompare(b.title);
      });
  }, [allAvailableQuizzes]);
  
  const handleQuizUpdate = (updatedQuizAdmin: QuizAdmin) => {
    const updatedCardProps = mapQuizAdminToQuiz(updatedQuizAdmin);
    setAllAvailableQuizzes(prev =>
        prev.map(q => q.id === updatedCardProps.id ? updatedCardProps : q)
    );
  };

  if (isLoading) {
    return <div>Quizzen laden...</div>
  }

  return (
    <div className="space-y-12">
        <section className="text-center">
            <BookOpen className="mx-auto h-12 w-12 text-primary mb-4" />
            <h1 className="text-4xl font-bold text-foreground">
                Jouw Pad naar Zelfinzicht
            </h1>
            <p className="text-lg text-muted-foreground mt-2 max-w-2xl mx-auto">
                Hieronder vind je alle zelfreflectie tools die beschikbaar zijn voor jouw leeftijdsgroep ({currentUserAgeGroup} jr). We raden aan te beginnen met de "Start Hier!" quiz, maar voel je vrij om te kiezen wat jou het meest aanspreekt.
            </p>
            <p className="text-md text-accent mt-3 flex items-center justify-center gap-2">
                <Sparkles className="h-5 w-5" />
                Elke tool helpt je dichter bij betere focus en zelfinzicht.
            </p>
        </section>

        {filteredAndSortedQuizzes.length > 0 ? (
            <section>
                <h2 className="mb-6 text-2xl font-semibold text-foreground">Beschikbare Zelfreflectie Tools</h2>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {filteredAndSortedQuizzes.map((quiz) => (
                        <QuizCard key={quiz.id} {...quiz} onQuizUpdate={handleQuizUpdate} />
                    ))}
                </div>
            </section>
        ) : (
            <Card className="bg-secondary/50 border-secondary">
                <CardContent className="p-6 flex flex-col items-center text-center">
                    <AlertTriangle className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-xl font-semibold text-foreground mb-2">Geen quizzen gevonden</h3>
                    <p className="text-muted-foreground">
                        Er zijn momenteel geen quizzen beschikbaar voor jouw leeftijdsgroep. Een beheerder kan dit aanpassen in het quizbeheer.
                    </p>
                </CardContent>
            </Card>
        )}

    </div>
  );
}

export default function DashboardQuizzesPage() {
  return (
    <Suspense fallback={<div>Zelfreflectie tools laden...</div>}>
      <DashboardQuizContent />
    </Suspense>
  );
}
