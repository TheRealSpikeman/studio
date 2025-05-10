// src/app/quizzes/page.tsx
"use client"; 

import { useState } from 'react'; 
import { QuizCard, QuizStatus } from '@/components/quiz/quiz-card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Search, AlertTriangle, BookOpen, Sparkles } from 'lucide-react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

// Define Quiz interface more comprehensively
export interface Quiz {
  id: string; 
  title: string;
  description: string;
  status: QuizStatus;
  progress?: number;
  imageUrl?: string;
  dataAiHint?: string;
  ageGroup: '12-14' | '15-18' | 'all'; // Make non-optional for clarity
  duration?: string; // e.g., "5-10 min"
  questionCount?: number; // e.g., 15
  badgeText?: string; // e.g., "Nieuw", "Populair!"
  badgeClass?: string; // Tailwind classes for badge styling e.g., "bg-primary text-primary-foreground"
}

const baseTeenQuizzes: Quiz[] = [
  { 
    id: 'teen-neurodiversity-quiz?ageGroup=12-14', 
    title: 'Neurodiversiteit (12-14 jr)', 
    description: 'Ontdek jouw eigenschappen zoals ADD, ADHD, HSP, ASS. Speciaal voor 12-14 jaar.', 
    status: 'Nog niet gestart' as QuizStatus, 
    imageUrl: 'https://picsum.photos/seed/teenquiz1214/400/200',
    dataAiHint: 'teenager study',
    ageGroup: '12-14',
    duration: "10-15 min",
    questionCount: 12, // Example base questions
    badgeText: "Basis",
    badgeClass: "bg-blue-500 text-white",
  },
  { 
    id: 'teen-neurodiversity-quiz?ageGroup=15-18', 
    title: 'Neurodiversiteit (15-18 jr)', 
    description: 'Ontdek jouw eigenschappen zoals ADD, ADHD, HSP, ASS. Speciaal voor 15-18 jaar.', 
    status: 'Nog niet gestart' as QuizStatus, 
    imageUrl: 'https://picsum.photos/seed/teenquiz1518/400/200',
    dataAiHint: 'teenager focused',
    ageGroup: '15-18',
    duration: "12-18 min",
    questionCount: 15, // Example base questions
    badgeText: "Basis",
    badgeClass: "bg-blue-500 text-white",
  },
];

const thematicTeenQuizzes: Quiz[] = [
  { 
    id: 'exam-stress-planning', 
    title: 'Examenvrees & Planning', 
    description: 'Leer stress te beheersen en je planning scherp te houden.', 
    status: 'Nog niet gestart' as QuizStatus, 
    imageUrl: 'https://picsum.photos/seed/examstress/400/200',
    dataAiHint: 'student exam',
    ageGroup: 'all',
    duration: "8-12 min",
    questionCount: 10,
    badgeText: "Populair!",
    badgeClass: "bg-accent text-accent-foreground",
  },
  { 
    id: 'social-anxiety-friendships', 
    title: 'Sociale Angst & Vriendschap', 
    description: 'Verken hoe je je voelt in groepen en bij presentaties.', 
    status: 'Nog niet gestart' as QuizStatus, 
    imageUrl: 'https://picsum.photos/seed/socialanxiety/400/200',
    dataAiHint: 'teenagers friends',
    ageGroup: 'all',
    duration: "7-10 min",
    questionCount: 12,
  },
  { 
    id: 'focus-digital-distraction', 
    title: 'Focus & Digitale Afleiding', 
    description: 'Ontdek hoe social media en games je concentratie beïnvloeden.', 
    status: 'Nog niet gestart' as QuizStatus, 
    imageUrl: 'https://picsum.photos/seed/digitalfocus/400/200',
    dataAiHint: 'teenager phone',
    ageGroup: 'all',
    duration: "6-9 min",
    questionCount: 10,
    badgeText: "Nieuw",
    badgeClass: "bg-green-500 text-white",
  },
  { 
    id: 'motivation-goals', 
    title: 'Motivatie & Doelen', 
    description: 'Leer doelen stellen, successen vieren en gemotiveerd blijven.', 
    status: 'Nog niet gestart' as QuizStatus, 
    imageUrl: 'https://picsum.photos/seed/motivationgoals/400/200',
    dataAiHint: 'success achievement',
    ageGroup: 'all',
    duration: "5-8 min",
    questionCount: 8,
  },
];

export default function QuizzesOverviewPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [ageFilter, setAgeFilter] = useState('all');
  const [durationFilter, setDurationFilter] = useState('all');
  const [themeFilter, setThemeFilter] = useState('');


  const filterQuizzes = (quizzes: Quiz[]) => {
    return quizzes.filter(quiz => {
      const matchesSearch = !searchTerm || 
        quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        quiz.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesAge = ageFilter === 'all' || quiz.ageGroup === ageFilter || quiz.ageGroup === 'all';
      
      // Basic duration filtering logic (can be refined)
      let matchesDuration = true;
      if (quiz.duration && durationFilter !== 'all') {
        const avgDuration = quiz.duration.split('-').map(d => parseInt(d)).reduce((a,b)=>a+b,0)/2; // simplified
        if (durationFilter === '<5' && avgDuration >= 5) matchesDuration = false;
        if (durationFilter === '5-10' && (avgDuration < 5 || avgDuration > 10)) matchesDuration = false;
        if (durationFilter === '>10' && avgDuration <= 10) matchesDuration = false;
      }

      // Basic theme filtering (searches in title/description for now)
      const matchesTheme = !themeFilter || 
        quiz.title.toLowerCase().includes(themeFilter.toLowerCase()) ||
        quiz.description.toLowerCase().includes(themeFilter.toLowerCase());

      return matchesSearch && matchesAge && matchesDuration && matchesTheme;
    });
  };

  const filteredBaseQuizzes = filterQuizzes(baseTeenQuizzes);
  const filteredThematicQuizzes = filterQuizzes(thematicTeenQuizzes);
  const noResultsForSearch = searchTerm && filteredBaseQuizzes.length === 0 && filteredThematicQuizzes.length === 0;

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex flex-1 flex-col items-center py-12 md:py-16 lg:py-20">
        <div className="container space-y-10">
          <section className="text-center">
            <BookOpen className="mx-auto h-12 w-12 text-primary mb-4" />
            <h1 className="text-4xl font-bold text-foreground">Alle Quizzen</h1>
            <p className="text-lg text-muted-foreground mt-2 max-w-2xl mx-auto">
              Verken alle beschikbare quizzen en verdiep je inzicht in neurodiversiteit. 
              Kies de quiz die het beste bij jouw leeftijdscategorie en interesses past.
            </p>
             <p className="text-md text-accent mt-3 flex items-center justify-center gap-2">
              <Sparkles className="h-5 w-5" />
              Elke quiz helpt je dichter bij betere focus en zelfinzicht.
            </p>
          </section>

          {/* Filter Section */}
          <Card className="shadow-md">
            <CardContent className="p-6 space-y-4 md:space-y-0 md:flex md:items-end md:gap-4">
              <div className="flex-grow relative">
                <Label htmlFor="search-quiz" className="sr-only">Zoek quizzen</Label>
                <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <Input 
                  id="search-quiz"
                  placeholder="Zoek op trefwoord..." 
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)} 
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:flex-none">
                <div>
                    <Label htmlFor="age-filter" className="text-xs font-medium text-muted-foreground">Leeftijd</Label>
                    <Select value={ageFilter} onValueChange={setAgeFilter}>
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
                        <SelectItem value="&lt;5">&lt; 5 min</SelectItem>
                        <SelectItem value="5-10">5-10 min</SelectItem>
                        <SelectItem value="&gt;10">&gt; 10 min</SelectItem>
                    </SelectContent>
                    </Select>
                </div>
                <div className="sm:col-span-3 md:col-auto"> {/* Theme filter takes full width on small, auto on md */}
                    <Label htmlFor="theme-filter" className="text-xs font-medium text-muted-foreground">Thema (zoekterm)</Label>
                    <Input 
                    id="theme-filter"
                    placeholder="Bijv. focus, angst..." 
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
                    Er zijn geen quizzen die overeenkomen met je zoekterm "{searchTerm}". Probeer een andere zoekterm of pas je filters aan.
                </p>
                <Button onClick={() => {setSearchTerm(''); setThemeFilter(''); setAgeFilter('all'); setDurationFilter('all');}} className="mt-4">
                    Wis filters & zoekopdracht
                </Button>
                </CardContent>
            </Card>
          )}

          {!noResultsForSearch && (
            <>
              <section>
                <h2 className="mb-6 text-2xl font-semibold text-foreground">Basistests voor jouw leeftijd</h2>
                {filteredBaseQuizzes.length > 0 ? (
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {filteredBaseQuizzes.map((quiz) => (
                      <QuizCard key={quiz.id} {...quiz} />
                    ))}
                  </div>
                ) : (
                   <p className="text-muted-foreground text-center py-6">
                    Geen basistests gevonden die voldoen aan de huidige filters.
                  </p>
                )}
              </section>

              <section>
                <h2 className="mb-6 text-2xl font-semibold text-foreground">Verdiepende thema-quizzen</h2>
                {filteredThematicQuizzes.length > 0 ? (
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {filteredThematicQuizzes.map((quiz) => (
                      <QuizCard key={quiz.id} {...quiz} />
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-6">
                    Geen thema-quizzen gevonden die voldoen aan de huidige filters.
                  </p>
                )}
              </section>
            </>
          )}

        </div>
      </main>
      <Footer />
    </div>
  );
}