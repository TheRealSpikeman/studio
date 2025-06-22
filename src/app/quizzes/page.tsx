
// src/app/quizzes/page.tsx
"use client"; 

import type { ElementType } from 'react';
import { useState, useMemo, useEffect, Suspense } from 'react'; 
import { useSearchParams } from 'next/navigation';
import { QuizCard, QuizStatus } from '@/components/quiz/quiz-card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Search, AlertTriangle, BookOpen, Sparkles, User, Clock, List, Brain, Zap, Award, Users as UsersIcon } from 'lucide-react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import type { QuizAdmin, QuizAudience } from '@/types/quiz-admin';

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
  isNeuroIntake?: boolean; // Toegevoegd om intake te identificeren
}

const getAgeGroupFromAudience = (audience: QuizAudience[]): '12-14' | '15-18' | 'all' => {
  if (!audience || audience.length === 0) return 'all';
  const audStr = audience.join(' ');
  if (audStr.includes('12-14')) return '12-14';
  if (audStr.includes('15-18')) return '15-18';
  return 'all';
};

const getDuration = (questionCount: number): string => {
  if (questionCount <= 3) return '1-2 min';
  if (questionCount <= 6) return '3-5 min';
  if (questionCount <= 10) return '5-8 min';
  if (questionCount <= 15) return '8-12 min';
  return '>15 min';
};

const getIconForCategory = (category: string): ElementType => {
  switch (category) {
    case 'Basis': return Brain;
    case 'Thema': return Award;
    case 'Ouder Observatie': return UsersIcon;
    default: return Sparkles;
  }
};

const mapAdminQuizToDisplayQuiz = (adminQuiz: QuizAdmin): Quiz => {
  const questionCount = adminQuiz.questions.length;
  const isNeuroIntake = adminQuiz.category === 'Basis';
  return {
    id: adminQuiz.slug || adminQuiz.id,
    title: adminQuiz.title,
    description: adminQuiz.description,
    status: 'Nog niet gestart',
    imageUrl: adminQuiz.thumbnailUrl || `https://placehold.co/400x200.png?text=${adminQuiz.title.replace(/\s/g, '+')}`,
    dataAiHint: 'abstract quiz',
    ageGroup: getAgeGroupFromAudience(adminQuiz.audience),
    duration: getDuration(questionCount),
    questionCount: questionCount,
    difficulty: 'gemiddeld', // This could be enhanced if difficulty is stored in QuizAdmin
    icon: getIconForCategory(adminQuiz.category),
    isNeuroIntake: isNeuroIntake,
    badgeText: isNeuroIntake ? 'Basis' : 'Thema',
    badgeClass: isNeuroIntake ? 'bg-blue-500 text-white' : 'bg-teal-500 text-white',
  };
};

type AgeFilterType = 'all' | '12-14' | '15-18';

function PublicQuizzesContent() {
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [ageFilter, setAgeFilter] = useState<AgeFilterType>('all');
  const [durationFilter, setDurationFilter] = useState('all');
  const [themeFilter, setThemeFilter] = useState('');

  const [allQuizzes, setAllQuizzes] = useState<Quiz[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const ageGroupFromQuery = searchParams.get('ageGroup');

  useEffect(() => {
    setIsLoading(true);
    const loadedQuizzes: Quiz[] = [];
    if (typeof window !== 'undefined') {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key) {
          try {
            const storedData = localStorage.getItem(key);
            if (storedData) {
              const quiz = JSON.parse(storedData) as QuizAdmin;
              if (quiz.id && quiz.title && Array.isArray(quiz.questions) && quiz.category && quiz.status === 'published') {
                loadedQuizzes.push(mapAdminQuizToDisplayQuiz(quiz));
              }
            }
          } catch (e) { /* Not a valid quiz object, ignore. */ }
        }
      }
    }
    setAllQuizzes(loadedQuizzes);
    setIsLoading(false);
  }, []);


  useEffect(() => {
    if (ageGroupFromQuery) {
      if (ageGroupFromQuery === '12-14' || ageGroupFromQuery === '15-18') {
        setAgeFilter(ageGroupFromQuery as '12-14' | '15-18');
      } else if (ageGroupFromQuery === 'adult') {
        setAgeFilter('all'); 
      }
    }
  }, [ageGroupFromQuery]);

  const filteredQuizzes = useMemo(() => {
    return allQuizzes.filter(quiz => {
      const matchesSearch = !searchTerm || 
        quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        quiz.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (quiz.badgeText && quiz.badgeText.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesAge = ageFilter === 'all' || quiz.ageGroup === ageFilter || quiz.ageGroup === 'all';
      
      let matchesDuration = true;
      if (quiz.duration && durationFilter !== 'all') {
        const minDurationMatch = quiz.duration.match(/^(\d+)-/);
        if(minDurationMatch){
          const minDuration = parseInt(minDurationMatch[1]);
          if (durationFilter === '<5' && minDuration >= 5) matchesDuration = false;
          if (durationFilter === '5-10' && (minDuration < 5 || minDuration > 10)) matchesDuration = false;
          if (durationFilter === '>10' && minDuration <= 10) matchesDuration = false;
        }
      }

      const matchesTheme = !themeFilter || 
        quiz.title.toLowerCase().includes(themeFilter.toLowerCase()) ||
        quiz.description.toLowerCase().includes(themeFilter.toLowerCase());

      return matchesSearch && matchesAge && matchesDuration && matchesTheme;
    });
  }, [allQuizzes, searchTerm, ageFilter, durationFilter, themeFilter]);
  
  const baseQuizzes = filteredQuizzes.filter(q => q.isNeuroIntake);
  const thematicQuizzes = filteredQuizzes.filter(q => !q.isNeuroIntake);

  const noResultsForSearch = searchTerm && baseQuizzes.length === 0 && thematicQuizzes.length === 0;

  if (isLoading) {
    return (
        <div className="flex flex-1 items-center justify-center">
            <p>Quizzen laden...</p>
        </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex flex-1 flex-col items-center py-12 md:py-16 lg:py-20">
        <div className="container space-y-12">
          <section className="text-center">
            <BookOpen className="mx-auto h-12 w-12 text-primary mb-4" />
            <h1 className="text-4xl font-bold text-foreground">Zelfreflectie Tools</h1>
            <p className="text-lg text-muted-foreground mt-2 max-w-2xl mx-auto">
              Ontdek onze tools om meer inzicht te krijgen in jouw unieke denkstijl, sterke punten en uitdagingen.
            </p>
             <p className="text-md text-accent mt-3 flex items-center justify-center gap-2">
              <Sparkles className="h-5 w-5" />
              Elke tool helpt je dichter bij betere focus en zelfinzicht.
            </p>
          </section>

          <Card className="shadow-md">
            <CardContent className="p-6 space-y-4 md:space-y-0 md:flex md:items-end md:gap-4">
              <div className="flex-grow relative">
                <Label htmlFor="search-quiz" className="sr-only">Zoek quizzen</Label>
                <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <Input 
                  id="search-quiz"
                  placeholder="Zoek op trefwoord (bijv. focus, planning, sociale voorkeuren)..." 
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)} 
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:flex-none">
                <div>
                    <Label htmlFor="age-filter" className="text-xs font-medium text-muted-foreground">Leeftijd</Label>
                    <Select value={ageFilter} onValueChange={(value) => setAgeFilter(value as AgeFilterType)}>
                    <SelectTrigger id="age-filter"><SelectValue placeholder="Alle leeftijden" /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Alle leeftijden</SelectItem>
                        <SelectItem value="12-14">12-14 jaar</SelectItem>
                        <SelectItem value="15-18">15-18 jaar</SelectItem>
                    </SelectContent>
                    </Select>
                </div>
                <div>
                    <Label htmlFor="duration-filter" className="text-xs font-medium text-muted-foreground">Duur</Label>
                    <Select value={durationFilter} onValueChange={setDurationFilter}>
                    <SelectTrigger id="duration-filter"><SelectValue placeholder="Alle duur" /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Alle duur</SelectItem>
                        <SelectItem value="<5">&lt; 5 min</SelectItem>
                        <SelectItem value="5-10">5-10 min</SelectItem>
                        <SelectItem value=">10">&gt; 10 min</SelectItem>
                    </SelectContent>
                    </Select>
                </div>
                <div className="sm:col-span-3 md:col-auto">
                    <Label htmlFor="theme-filter" className="text-xs font-medium text-muted-foreground">Thema (zoekterm)</Label>
                    <Input 
                      id="theme-filter"
                      placeholder="Bijv. Aandacht, examenstress..." 
                      value={themeFilter}
                      onChange={(e) => setThemeFilter(e.target.value)}
                    />
                </div>
              </div>
            </CardContent>
          </Card>
          
          {noResultsForSearch && (
             <Card className="bg-secondary/50 border-secondary">
                <CardContent className="p-6 flex flex-col items-center text-center">
                <AlertTriangle className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">Geen quizzen gevonden</h3>
                <p className="text-muted-foreground">
                    Er zijn geen zelfreflectie-tools die overeenkomen met je zoekterm "{searchTerm}". Probeer een andere zoekterm of pas je filters aan.
                </p>
                <Button onClick={() => {setSearchTerm(''); setThemeFilter(''); setAgeFilter('all'); setDurationFilter('all');}} className="mt-4">
                    Wis filters &amp; zoekopdracht
                </Button>
                </CardContent>
            </Card>
          )}

          {!noResultsForSearch && (
            <>
              {baseQuizzes.length > 0 && (
                <section>
                  <h2 className="mb-2 text-2xl font-semibold text-foreground">Basis Zelfreflectie Tools</h2>
                  <p className="text-sm text-muted-foreground mb-6">Start hier als je voor het eerst jouw eigenschappen wilt verkennen.</p>
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                      {baseQuizzes.map((quiz) => (
                        <QuizCard key={quiz.id} {...quiz} />
                      ))}
                  </div>
                </section>
              )}

              {thematicQuizzes.length > 0 && (
                <section>
                  <h2 className="mb-2 text-2xl font-semibold text-foreground">Kies jouw verdieping: examenvrees, sociale situaties &amp; meer</h2>
                  <p className="text-sm text-muted-foreground mb-6">Duik dieper in specifieke onderwerpen die voor jou relevant zijn.</p>
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                      {thematicQuizzes.map((quiz) => (
                        <QuizCard key={quiz.id} {...quiz} />
                      ))}
                  </div>
                </section>
              )}

               {baseQuizzes.length === 0 && thematicQuizzes.length === 0 && (
                  <Card className="bg-secondary/50 border-secondary">
                    <CardContent className="p-6 flex flex-col items-center text-center">
                    <AlertTriangle className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-xl font-semibold text-foreground mb-2">Geen Quizzen Beschikbaar</h3>
                    <p className="text-muted-foreground">
                        Er zijn momenteel geen gepubliceerde quizzen die aan je filters voldoen. Kom later terug!
                    </p>
                    </CardContent>
                  </Card>
              )}
            </>
          )}

          <section className="mt-16 border-t pt-12 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl mb-4">
              Klaar om te ontdekken wat <span className="text-primary">jouw brein uniek</span> maakt?
            </h2>
            <Button size="lg" asChild className="shadow-md hover:shadow-lg transition-shadow">
              <Link href="/quizzes?ageGroup=12-14">Start gratis quiz (12-14jr)</Link>
            </Button>
             <Button size="lg" variant="outline" asChild className="shadow-md hover:shadow-lg transition-shadow ml-4">
              <Link href="/quizzes?ageGroup=15-18">Start gratis quiz (15-18jr)</Link>
            </Button>
            <p className="mt-6 text-muted-foreground">
              <Sparkles className="inline-block h-5 w-5 mr-1 text-accent" />
              Geen oordeel—alleen inzicht en tips.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default function QuizzesOverviewPage() {
  return (
    <Suspense fallback={<div>Pagina laden...</div>}>
      <PublicQuizzesContent />
    </Suspense>
  );
}

