// src/app/quizzes/page.tsx
"use client"; 

import type { ElementType } from 'react';
import { useState, useMemo, useEffect, Suspense } from 'react'; 
import { useSearchParams } from 'next/navigation';
import { QuizCard, QuizStatus } from '@/components/quiz/quiz-card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Search, AlertTriangle, BookOpen, Sparkles, User, Clock, List, Brain, Zap, Award } from 'lucide-react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

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

const recommendedQuizzes: Quiz[] = [
    { 
    id: 'teen-neurodiversity-quiz?ageGroup=15-18', 
    title: 'Zelfreflectie Tool (15-18 jr)', 
    description: 'Verken jouw unieke eigenschappen. Speciaal voor 15-18 jaar.', 
    status: 'Nog niet gestart', 
    imageUrl: 'https://firebasestorage.googleapis.com/v0/b/neurodiversity-navigator.firebasestorage.app/o/teenage_girl_with_dark_hair_in_ponytai.png?alt=media&token=055da5d1-2291-4858-8c90-b903be950264',
    dataAiHint: 'teenager portrait',
    ageGroup: '15-18',
    duration: "12-18 min",
    questionCount: 15,
    difficulty: 'gemiddeld',
    icon: Brain,
    badgeText: "Aanrader",
    badgeClass: "bg-purple-500 text-white",
    isNeuroIntake: true,
  },
  { 
    id: 'focus-digital-distraction', 
    title: 'Focus & Digitale Afleiding Tool', 
    description: 'Ontdek hoe social media je concentratie beïnvloeden.', 
    status: 'Nog niet gestart', 
    imageUrl: 'https://firebasestorage.googleapis.com/v0/b/neurodiversity-navigator.firebasestorage.app/o/teenage_girl_with_dark_hair_in_ponytail-screen-time.png?alt=media&token=17820a6c-b5ad-4719-ac21-6541d59ada65',
    dataAiHint: 'teenager phone',
    ageGroup: 'all',
    duration: "6-9 min",
    questionCount: 10,
    difficulty: 'makkelijk',
    icon: Zap,
    badgeText: "Nieuw",
    badgeClass: "bg-green-500 text-white",
  },
];

const baseTeenQuizzes: Quiz[] = [
  { 
    id: 'teen-neurodiversity-quiz?ageGroup=12-14', 
    title: 'Zelfreflectie Tool (12-14 jr)', 
    description: 'Verken jouw unieke eigenschappen. Speciaal voor 12-14 jaar.', 
    status: 'Nog niet gestart', 
    imageUrl: 'https://firebasestorage.googleapis.com/v0/b/neurodiversity-navigator.firebasestorage.app/o/young_teenage_boy_13_years_old_with_blonde_hair.png?alt=media&token=79e72caf-3dcd-4dcf-8d01-9074ceb3f8aa',
    dataAiHint: 'teenage boy',
    ageGroup: '12-14',
    duration: "10-15 min",
    questionCount: 12,
    difficulty: 'gemiddeld',
    icon: Brain,
    badgeText: "Basis",
    badgeClass: "bg-blue-500 text-white",
    isNeuroIntake: true,
  },
  { 
    id: 'teen-neurodiversity-quiz?ageGroup=15-18', 
    title: 'Zelfreflectie Tool (15-18 jr)', 
    description: 'Verken jouw unieke eigenschappen. Speciaal voor 15-18 jaar.', 
    status: 'Nog niet gestart', 
    imageUrl: 'https://firebasestorage.googleapis.com/v0/b/neurodiversity-navigator.firebasestorage.app/o/teenage_girl_with_dark_hair_in_ponytai.png?alt=media&token=055da5d1-2291-4858-8c90-b903be950264',
    dataAiHint: 'teenager portrait',
    ageGroup: '15-18',
    duration: "12-18 min",
    questionCount: 15,
    difficulty: 'gemiddeld',
    icon: Brain,
    badgeText: "Basis",
    badgeClass: "bg-blue-500 text-white",
    isNeuroIntake: true,
  },
];

const thematicTeenQuizzes: Quiz[] = [
  { 
    id: 'exam-stress-planning', 
    title: 'Omgaan met Examenvrees', 
    description: 'Leer stress te beheersen en je planning scherp te houden.', 
    status: 'Nog niet gestart', 
    imageUrl: 'https://firebasestorage.googleapis.com/v0/b/neurodiversity-navigator.firebasestorage.app/o/teenage_girl_with_dark_skin_curly_hair.png?alt=media&token=00582d3b-19c5-4744-be12-8636535829f8', 
    dataAiHint: 'student thinking',
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
    title: 'Sociale Situaties &amp; Vriendschap', 
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
    description: 'Ontdek hoe social media je concentratie beïnvloeden.', 
    status: 'Nog niet gestart', 
    imageUrl: 'https://firebasestorage.googleapis.com/v0/b/neurodiversity-navigator.firebasestorage.app/o/teenage_girl_with_dark_hair_in_ponytail-screen-time.png?alt=media&token=17820a6c-b5ad-4719-ac21-6541d59ada65',
    dataAiHint: 'teenager phone',
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
    imageUrl: 'https://firebasestorage.googleapis.com/v0/b/neurodiversity-navigator.firebasestorage.app/o/teenage_boy_with_dark_skin_setting_goals_and_celeb.png?alt=media&token=91f4d153-37f2-468f-a40e-4a6606ba1670', 
    dataAiHint: 'success celebration',
    ageGroup: 'all',
    duration: "5-8 min",
    questionCount: 8,
    difficulty: 'makkelijk',
    icon: User,
  },
];

type AgeFilterType = 'all' | '12-14' | '15-18';

function PublicQuizzesContent() {
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [ageFilter, setAgeFilter] = useState<AgeFilterType>('all');
  const [durationFilter, setDurationFilter] = useState('all');
  const [themeFilter, setThemeFilter] = useState('');

  const ageGroupFromQuery = searchParams.get('ageGroup');

  useEffect(() => {
    if (ageGroupFromQuery) {
      if (ageGroupFromQuery === '12-14' || ageGroupFromQuery === '15-18') {
        setAgeFilter(ageGroupFromQuery as '12-14' | '15-18');
      } else if (ageGroupFromQuery === 'adult') {
        setAgeFilter('all'); 
      }
    }
  }, [ageGroupFromQuery]);


  const filterQuizzes = (quizzesToFilter: Quiz[], isRecommendedSection: boolean = false) => {
    return quizzesToFilter.filter(quiz => {
      const matchesSearch = !searchTerm || 
        quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        quiz.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (quiz.badgeText && quiz.badgeText.toLowerCase().includes(searchTerm.toLowerCase()));
      
      let matchesAge = true;
      if (!isRecommendedSection) { 
        matchesAge = ageFilter === 'all' || quiz.ageGroup === ageFilter || quiz.ageGroup === 'all';
      }
      
      let matchesDuration = true;
      if (quiz.duration && durationFilter !== 'all') {
        const [minDuration, maxDuration] = quiz.duration.replace(' min', '').split('-').map(d => parseInt(d));
        const avgDuration = maxDuration ? (minDuration + maxDuration) / 2 : minDuration;
        if (durationFilter === '<5' && avgDuration >= 5) matchesDuration = false;
        if (durationFilter === '5-10' && (avgDuration < 5 || avgDuration > 10)) matchesDuration = false;
        if (durationFilter === '>10' && avgDuration <= 10) matchesDuration = false;
      }

      const matchesTheme = !themeFilter || 
        quiz.title.toLowerCase().includes(themeFilter.toLowerCase()) ||
        quiz.description.toLowerCase().includes(themeFilter.toLowerCase());

      return matchesSearch && matchesAge && matchesDuration && matchesTheme;
    });
  };

  const filteredRecommendedQuizzes = filterQuizzes(recommendedQuizzes, true);
  const filteredBaseQuizzes = filterQuizzes(baseTeenQuizzes);
  const filteredThematicQuizzes = filterQuizzes(thematicTeenQuizzes);
  
  const noResultsForSearch = searchTerm && 
                             filteredRecommendedQuizzes.length === 0 && 
                             filteredBaseQuizzes.length === 0 && 
                             filteredThematicQuizzes.length === 0;

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
                <Label htmlFor="search-quiz" className="sr-only">Zoek tools</Label>
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
                <h3 className="text-xl font-semibold text-foreground mb-2">Geen tools gevonden</h3>
                <p className="text-muted-foreground">
                    Er zijn geen zelfreflectie-instrumenten die overeenkomen met je zoekterm "{searchTerm}". Probeer een andere zoekterm of pas je filters aan.
                </p>
                <Button onClick={() => {setSearchTerm(''); setThemeFilter(''); setAgeFilter('all'); setDurationFilter('all');}} className="mt-4">
                    Wis filters &amp; zoekopdracht
                </Button>
                </CardContent>
            </Card>
          )}

          {!noResultsForSearch && (
            <>
              {filteredRecommendedQuizzes.length > 0 && (
                <section>
                  <h2 className="mb-6 text-2xl font-semibold text-foreground">⭐ Voor jou aanbevolen</h2>
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {filteredRecommendedQuizzes.map((quiz) => (
                      <QuizCard key={`${quiz.id}-recommended`} {...quiz} />
                    ))}
                  </div>
                </section>
              )}

              <section>
                <h2 className="mb-2 text-2xl font-semibold text-foreground">Basistools voor jouw leeftijd</h2>
                 <p className="text-sm text-muted-foreground mb-6">Start hier als je voor het eerst jouw eigenschappen wilt verkennen.</p>
                {filteredBaseQuizzes.length > 0 ? (
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {filteredBaseQuizzes.map((quiz) => (
                      <QuizCard key={quiz.id} {...quiz} />
                    ))}
                  </div>
                ) : (
                   <p className="text-muted-foreground text-center py-6">
                    Geen basistools gevonden die voldoen aan de huidige filters.
                  </p>
                )}
              </section>

              <section>
                <h2 className="mb-2 text-2xl font-semibold text-foreground">Kies jouw verdieping: examenvrees, sociale situaties &amp; meer</h2>
                <p className="text-sm text-muted-foreground mb-6">Duik dieper in specifieke onderwerpen die voor jou relevant zijn.</p>
                {filteredThematicQuizzes.length > 0 ? (
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {filteredThematicQuizzes.map((quiz) => (
                      <QuizCard key={quiz.id} {...quiz} />
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-6">
                    Geen thematische tools gevonden die voldoen aan de huidige filters.
                  </p>
                )}
              </section>
            </>
          )}

          <section className="mt-16 border-t pt-12 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl mb-4">
              Klaar om te ontdekken wat <span className="text-primary">jouw brein uniek</span> maakt?
            </h2>
            <Button size="lg" asChild className="shadow-md hover:shadow-lg transition-shadow">
              <Link href="/quizzes?ageGroup=12-14">Start gratis tool (12-14jr)</Link>
            </Button>
             <Button size="lg" variant="outline" asChild className="shadow-md hover:shadow-lg transition-shadow ml-4">
              <Link href="/quizzes?ageGroup=15-18">Start gratis tool (15-18jr)</Link>
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
