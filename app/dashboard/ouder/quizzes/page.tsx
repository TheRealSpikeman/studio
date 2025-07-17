// src/app/dashboard/ouder/quizzes/page.tsx
"use client";

import type { ElementType } from 'react';
import { useState, useMemo, useEffect, Suspense } from 'react';
import { QuizCard, type QuizCardProps } from '@/components/quiz/quiz-card';
import { FileText, Sparkles, User, HelpCircle, Brain, Users as UsersIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import type { QuizAdmin, QuizCategory, QuizAudience } from '@/types/quiz-admin';
import { useToast } from '@/hooks/use-toast';
import { getQuizzes } from '@/services/quizService';

// The helper functions can be reused, but we adapt the filtering logic.

const getIconForCategory = (category: QuizCategory): ElementType => {
  switch (category) {
    case 'Ouder Observatie': return UsersIcon;
    default: return HelpCircle;
  }
};

const getBadgeForCategory = (category: QuizCategory): { text: string; className: string } | null => {
  if (category === 'Ouder Observatie') return { text: "Voor Ouders", className: "bg-accent text-accent-foreground" };
  return null;
};

const getAgeGroupFromAudience = (audience: QuizAudience | QuizAudience[]): '12-14' | '15-18' | 'all' => {
  const aud = Array.isArray(audience) ? audience[0] : audience;
  if (!aud) return 'all';
  if (aud.includes('12-14')) return '12-14';
  if (aud.includes('15-18')) return '15-18';
  return 'all';
};

const mapQuizAdminToQuiz = (quizAdmin: QuizAdmin): QuizCardProps => {
  const badge = getBadgeForCategory(quizAdmin.category);
  const quizDifficulty = (quizAdmin as any).difficulty || 'gemiddeld';

  const isForParent = typeof quizAdmin.audience === 'string' && quizAdmin.audience.toLowerCase().includes('ouder');
  const descriptionForCard = (isForParent && quizAdmin.descriptionForParent) 
    ? quizAdmin.descriptionForParent 
    : quizAdmin.description;

  return {
    id: quizAdmin.id,
    title: quizAdmin.title,
    description: descriptionForCard,
    status: 'Nog niet gestart',
    audience: quizAdmin.audience,
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
  };
};

function DashboardOuderQuizContent() {
  const { toast } = useToast();
  const [allAvailableQuizzes, setAllAvailableQuizzes] = useState<QuizCardProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchQuizzes = async () => {
      setIsLoading(true);
      const loadedQuizzesAdmin = await getQuizzes();
      
      const processedQuizzes = loadedQuizzesAdmin.map(q => ({
          ...q, 
          questions: q.questions.map(ques => ({...ques, weight: ques.weight ?? 1})),
          thumbnailUrl: q.thumbnailUrl || `https://placehold.co/400x200.png?text=${q.title.replace(/\s/g, '+')}`,
          settings: { ...q.settings, accessibility: { isPublic: q.settings?.accessibility?.isPublic ?? false, allowedPlans: q.settings?.accessibility?.allowedPlans ?? [] } }
      }));
      
      // Key change: Filter for quizzes where audience is specifically 'Ouder'.
      const publishedParentQuizzes = processedQuizzes.filter(q => 
          q.status === 'published' && 
          typeof q.audience === 'string' &&
          q.audience.toLowerCase().includes('ouder')
      );
      
      setAllAvailableQuizzes(publishedParentQuizzes.map(mapQuizAdminToQuiz));
      setIsLoading(false);
    }
    fetchQuizzes();
  }, [toast]);

  if (isLoading) {
    return <div>Vragenlijsten laden...</div>
  }

  return (
    <div className="space-y-12">
        <section className="text-center">
            <FileText className="mx-auto h-12 w-12 text-primary mb-4" />
            <h1 className="text-4xl font-bold text-foreground">
                Vragenlijsten voor Ouders
            </h1>
            <p className="text-lg text-muted-foreground mt-2 max-w-2xl mx-auto">
                Deze vragenlijsten helpen u om uw kind beter te begrijpen door vanuit uw perspectief naar gedrag en patronen te kijken. De resultaten kunnen een startpunt zijn voor gesprekken en, indien gewenst, een vergelijkende analyse.
            </p>
        </section>

        {allAvailableQuizzes.length > 0 ? (
            <section>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {allAvailableQuizzes.map((quiz) => (
                        <QuizCard key={quiz.id} {...quiz} />
                    ))}
                </div>
            </section>
        ) : (
            <Card className="bg-secondary/50 border-secondary">
                <CardContent className="p-6 flex flex-col items-center text-center">
                    <h3 className="text-xl font-semibold text-foreground mb-2">Geen vragenlijsten gevonden</h3>
                    <p className="text-muted-foreground">
                        Er zijn momenteel geen vragenlijsten beschikbaar die specifiek voor ouders zijn. Een beheerder kan dit aanpassen.
                    </p>
                </CardContent>
            </Card>
        )}
    </div>
  );
}

export default function DashboardOuderQuizzesPage() {
  return (
    <Suspense fallback={<div>Pagina laden...</div>}>
      <DashboardOuderQuizContent />
    </Suspense>
  );
}
