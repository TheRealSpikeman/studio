// src/app/dashboard/leerling/quizzes/page.tsx
"use client"; 

import type { ElementType } from 'react';
import { useState, useMemo, useEffect, Suspense } from 'react'; 
import { useSearchParams } from 'next/navigation';
import { QuizCard, QuizStatus } from '@/components/quiz/quiz-card';
import { AlertTriangle, BookOpen, Sparkles, User, Clock, List, Brain, Zap, Award } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface Quiz {
  id: string; 
  title: string;
  description: string; 
  status: QuizStatus; 
  progress?: number;
  imageUrl?: string;
  dataAiHint?: string;
  ageGroup: '12-14' | '15-18' | 'all';
  duration?: string; 
  questionCount?: number; 
  difficulty?: 'makkelijk' | 'gemiddeld' | 'moeilijk';
  icon?: ElementType; 
  badgeText?: string; 
  badgeClass?: string; 
  isNeuroIntake?: boolean; 
}

const allAvailableQuizzes: Quiz[] = [
  { 
    id: 'neuro-intake-12-14', 
    title: 'Zelfreflectie Start (12-14 jr)', 
    description: 'Start hier om jouw unieke eigenschappen en denkstijl te verkennen. Dit helpt ons om je de beste vervolgstappen te tonen.', 
    status: 'Nog niet gestart', 
    imageUrl: 'https://placehold.co/400x200.png?text=Start+12-14', 
    dataAiHint: 'teenager thinking brain',
    ageGroup: '12-14',
    duration: "10-15 min",
    questionCount: 12,
    difficulty: 'gemiddeld',
    icon: Brain,
    badgeText: "Start Hier!",
    badgeClass: "bg-primary text-primary-foreground",
    isNeuroIntake: true,
  },
  { 
    id: 'neuro-intake-15-18', 
    title: 'Zelfreflectie Start (15-18 jr)', 
    description: 'Start hier om jouw unieke eigenschappen en denkstijl te verkennen. Dit helpt ons om je de beste vervolgstappen te tonen.', 
    status: 'Nog niet gestart', 
    imageUrl: 'https://placehold.co/400x200.png?text=Start+15-18',
    dataAiHint: 'teenager focused idea',
    ageGroup: '15-18',
    duration: "12-18 min",
    questionCount: 15,
    difficulty: 'gemiddeld',
    icon: Brain,
    badgeText: "Start Hier!",
    badgeClass: "bg-primary text-primary-foreground",
    isNeuroIntake: true,
  },
  { 
    id: 'exam-stress-planning', 
    title: 'Omgaan met Examenvrees', 
    description: 'Leer stress te beheersen en je planning scherp te houden.', 
    status: 'Nog niet gestart', 
    imageUrl: 'https://placehold.co/400x200.png?text=Examenvrees', 
    dataAiHint: 'student exam stress',
    ageGroup: 'all',
    duration: "8-12 min",
    questionCount: 10,
    difficulty: 'gemiddeld',
    icon: Award,
    badgeText: "Populair!",
    badgeClass: "bg-accent text-accent-foreground",
  },
  { 
    id: 'social-anxiety-friendships', 
    title: 'Sociale Situaties & Vriendschap', 
    description: 'Verken hoe je je voelt in groepen en bij presentaties.', 
    status: 'Nog niet gestart', 
    imageUrl: 'https://placehold.co/400x200.png?text=Sociale+Situaties', 
    dataAiHint: 'teenagers friends group',
    ageGroup: 'all',
    duration: "7-10 min",
    questionCount: 12,
    difficulty: 'makkelijk',
    icon: User,
  },
  { 
    id: 'focus-digital-distraction', 
    title: 'Focus & Digitale Afleiding Tool', 
    description: 'Verken je aandachtspatronen in relatie tot digitale media.', 
    status: 'Nog niet gestart', 
    imageUrl: 'https://placehold.co/400x200.png?text=Focus+Digitaal', 
    dataAiHint: 'teenager phone screen',
    ageGroup: 'all',
    duration: "6-9 min",
    questionCount: 10,
    difficulty: 'makkelijk',
    icon: Zap,
    badgeText: "Nieuw",
    badgeClass: "bg-green-500 text-white",
  },
  { 
    id: 'motivation-goals', 
    title: 'Motivatie & Doelen Stellen', 
    description: 'Leer doelen stellen, successen vieren en gemotiveerd blijven.', 
    status: 'Nog niet gestart', 
    imageUrl: 'https://placehold.co/400x200.png?text=Motivatie+Doelen', 
    dataAiHint: 'success achievement arrow',
    ageGroup: 'all',
    duration: "5-8 min",
    questionCount: 8,
    difficulty: 'makkelijk',
    icon: User,
  },
];

type AgeFilterType = 'all' | '12-14' | '15-18';

function DashboardQuizContent() {
  const searchParams = useSearchParams();
  const [currentUserAgeGroup, setCurrentUserAgeGroup] = useState<AgeFilterType>('all');
  const [neuroIntakeCompleted, setNeuroIntakeCompleted] = useState(false); 

  useEffect(() => {
    const ageGroupFromQuery = searchParams.get('ageGroup') as AgeFilterType;
    if (ageGroupFromQuery && (ageGroupFromQuery === '12-14' || ageGroupFromQuery === '15-18')) {
      setCurrentUserAgeGroup(ageGroupFromQuery);
    } else {
      // Fallback or default if no valid ageGroup in query
      setCurrentUserAgeGroup('15-18');
    }
  }, [searchParams]);

  const neuroIntakeTest = useMemo(() => {
    return allAvailableQuizzes.find(quiz => quiz.isNeuroIntake && quiz.ageGroup === currentUserAgeGroup);
  }, [currentUserAgeGroup]);

  const relevantThematicQuizzes = useMemo(() => {
    if (!neuroIntakeCompleted) return [];
    return allAvailableQuizzes.filter(quiz => 
      !quiz.isNeuroIntake && (quiz.ageGroup === currentUserAgeGroup || quiz.ageGroup === 'all')
    );
  }, [currentUserAgeGroup, neuroIntakeCompleted]);

  // Simulate intake completion for demo purposes
  const toggleIntakeStatus = () => setNeuroIntakeCompleted(prev => !prev);

  if (!neuroIntakeTest) {
    return (
      <div className="space-y-12">
        <section className="text-center">
          <AlertTriangle className="mx-auto h-12 w-12 text-destructive mb-4" />
          <h1 className="text-4xl font-bold text-foreground">
            Geen Passende Start Quiz Gevonden
          </h1>
          <p className="text-lg text-muted-foreground mt-2 max-w-2xl mx-auto">
            Helaas konden we geen specifieke start-quiz vinden die past bij jouw leeftijdsgroep ({currentUserAgeGroup}).
          </p>
          <p className="mt-4">
            Dit is waarschijnlijk een fout in de configuratie. Neem alstublieft contact op met support.
          </p>
          <Button asChild className="mt-6">
            <Link href="/dashboard">Terug naar Dashboard</Link>
          </Button>
        </section>
      </div>
    );
  }

  return (
    <div className="space-y-12">
        <section className="text-center">
        <BookOpen className="mx-auto h-12 w-12 text-primary mb-4" />
        <h1 className="text-4xl font-bold text-foreground">
          {neuroIntakeCompleted ? "Jouw Pad naar Zelfinzicht" : `Start je Zelfreflectie (${currentUserAgeGroup} jr)`}
        </h1>
        <p className="text-lg text-muted-foreground mt-2 max-w-2xl mx-auto">
          {neuroIntakeCompleted 
            ? "Je hebt de Start Tool voltooid! Hieronder vind je verdiepende tools die je verder kunnen helpen."
            : `De Zelfreflectie Start Tool is de eerste stap om meer over jouw unieke denkstijl te leren. Deze tool is speciaal voor ${currentUserAgeGroup} jaar.`}
        </p>
        <p className="text-md text-accent mt-3 flex items-center justify-center gap-2">
            <Sparkles className="h-5 w-5" />
            Elke tool helpt je dichter bij betere focus en zelfinzicht.
        </p>
        </section>

        <div className="text-center">
            <Button onClick={toggleIntakeStatus} variant="outline">
                Simuleer: Start Tool {neuroIntakeCompleted ? 'Niet ' : ''}Voltooid
            </Button>
        </div>

        {!neuroIntakeCompleted && (
            <section>
                <h2 className="mb-6 text-2xl font-semibold text-foreground text-center">Jouw Start Tool</h2>
                <div className="flex justify-center">
                    <div className="w-full max-w-sm">
                        <QuizCard {...neuroIntakeTest} />
                    </div>
                </div>
            </section>
        )}

        {neuroIntakeCompleted && (
        <>
            {relevantThematicQuizzes.length > 0 && (
            <section>
                <h2 className="mb-6 text-2xl font-semibold text-foreground">Aanbevolen Verdiepingsmodules</h2>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {relevantThematicQuizzes.map((quiz) => (
                    <QuizCard key={quiz.id} {...quiz} />
                ))}
                </div>
            </section>
            )}

            {relevantThematicQuizzes.length === 0 && (
                 <Card className="bg-secondary/50 border-secondary">
                    <CardContent className="p-6 flex flex-col items-center text-center">
                        <AlertTriangle className="h-12 w-12 text-muted-foreground mb-4" />
                        <h3 className="text-xl font-semibold text-foreground mb-2">Nog geen verdiepingsmodules</h3>
                        <p className="text-muted-foreground">
                            Er zijn momenteel geen specifieke verdiepingsmodules aanbevolen. Kom later terug of bekijk de algemene thema's.
                        </p>
                    </CardContent>
                </Card>
            )}
        </>
        )}

        <section className="mt-16 border-t pt-12 text-center">
        <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl mb-4">
            Klaar om <span className="text-primary">jezelf beter te leren kennen</span>?
        </h2>
        {!neuroIntakeCompleted && (
            <Button size="lg" asChild className="shadow-md hover:shadow-lg transition-shadow">
                <Link href={neuroIntakeTest.id.startsWith('teen-neurodiversity-quiz') || neuroIntakeTest.id.startsWith('neuro-intake-') ? `/quiz/teen-neurodiversity-quiz?ageGroup=${neuroIntakeTest.ageGroup}` : `/quiz/${neuroIntakeTest.id}`}>
                    Start de Zelfreflectie Tool
                </Link>
            </Button>
        )}
        {neuroIntakeCompleted && (
             <Button size="lg" variant="outline" asChild className="shadow-md hover:shadow-lg transition-shadow">
                <Link href="/dashboard/results">Bekijk je resultaten</Link>
            </Button>
        )}
        <p className="mt-6 text-muted-foreground">
            <Sparkles className="inline-block h-5 w-5 mr-1 text-accent" />
            Ontdek je krachten en vind nieuwe strategieën.
        </p>
        </section>
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