// src/app/quizzes/page.tsx
"use client"; 

import { useState } from 'react'; 
import { QuizCard, QuizStatus } from '@/components/quiz/quiz-card';
import { Input } from '@/components/ui/input';
import { Search, AlertTriangle } from 'lucide-react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import { Button } from '@/components/ui/button';


interface Quiz {
  id: string; 
  title: string;
  description: string;
  status: QuizStatus;
  progress?: number;
  imageUrl?: string;
  dataAiHint?: string;
  ageGroup?: '12-14' | '15-18' | 'all'; // Added for potential future filtering
}

const baseTeenQuizzes: Quiz[] = [
  { 
    id: 'teen-neurodiversity-quiz?ageGroup=12-14', 
    title: 'Neurodiversiteit Quiz (12-14 jaar)', 
    description: 'Ontdek jouw eigenschappen zoals ADD, ADHD, HSP, ASS en Angst/Depressie. Speciaal voor 12-14 jaar.', 
    status: 'Nog niet gestart' as QuizStatus, 
    imageUrl: 'https://picsum.photos/seed/teenquiz1214/400/200',
    dataAiHint: 'teenager study',
    ageGroup: '12-14',
  },
  { 
    id: 'teen-neurodiversity-quiz?ageGroup=15-18', 
    title: 'Neurodiversiteit Quiz (15-18 jaar)', 
    description: 'Ontdek jouw eigenschappen zoals ADD, ADHD, HSP, ASS en Angst/Depressie. Speciaal voor 15-18 jaar.', 
    status: 'Nog niet gestart' as QuizStatus, 
    imageUrl: 'https://picsum.photos/seed/teenquiz1518/400/200',
    dataAiHint: 'teenager focused',
    ageGroup: '15-18',
  },
];

const thematicTeenQuizzes: Quiz[] = [
  { 
    id: 'exam-stress-planning', 
    title: 'Examenvrees & Studieplanning (12-18 jaar)', 
    description: 'Leer stress te beheersen en je planning scherp te houden.', 
    status: 'Nog niet gestart' as QuizStatus, 
    imageUrl: 'https://picsum.photos/seed/examstress/400/200',
    dataAiHint: 'student exam',
    ageGroup: 'all',
  },
  { 
    id: 'social-anxiety-friendships', 
    title: 'Sociale Angst & Vriendschappen (12-18 jaar)', 
    description: 'Verken hoe je je voelt in groepen en bij presentaties.', 
    status: 'Nog niet gestart' as QuizStatus, 
    imageUrl: 'https://picsum.photos/seed/socialanxiety/400/200',
    dataAiHint: 'teenagers friends',
    ageGroup: 'all',
  },
  { 
    id: 'focus-digital-distraction', 
    title: 'Focus & Digitale Afleiding (12-18 jaar)', 
    description: 'Ontdek hoe social media en games je concentratie beïnvloeden.', 
    status: 'Nog niet gestart' as QuizStatus, 
    imageUrl: 'https://picsum.photos/seed/digitalfocus/400/200',
    dataAiHint: 'teenager phone',
    ageGroup: 'all',
  },
  { 
    id: 'motivation-goals', 
    title: 'Motivatie & Doelstellingen (12-18 jaar)', 
    description: 'Leer doelen stellen, successen vieren en gemotiveerd blijven.', 
    status: 'Nog niet gestart' as QuizStatus, 
    imageUrl: 'https://picsum.photos/seed/motivationgoals/400/200',
    dataAiHint: 'success achievement',
    ageGroup: 'all',
  },
];

export default function QuizzesOverviewPage() {
  const [searchTerm, setSearchTerm] = useState('');

  // In a real app with user context, this filter could be enhanced.
  // For now, it's a simple text search on the predefined teen quizzes.
  const filterQuizzes = (quizzes: Quiz[]) => {
    if (!searchTerm) return quizzes;
    return quizzes.filter(quiz => 
      quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quiz.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const filteredBaseQuizzes = filterQuizzes(baseTeenQuizzes);
  const filteredThematicQuizzes = filterQuizzes(thematicTeenQuizzes);
  const noResultsForSearch = searchTerm && filteredBaseQuizzes.length === 0 && filteredThematicQuizzes.length === 0;

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex flex-1 flex-col items-center py-12 md:py-16 lg:py-20">
        <div className="container space-y-10">
          <section>
            <h1 className="text-3xl font-bold text-foreground">Alle Quizzen</h1>
            <p className="text-muted-foreground">
              Verken alle beschikbare quizzen en verdiep je inzicht in neurodiversiteit. 
              Kies de quiz die het beste bij jouw leeftijdscategorie en interesses past.
            </p>
          </section>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <Input 
              placeholder="Zoek quizzen..." 
              className="pl-10 max-w-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)} 
            />
          </div>
          
          {noResultsForSearch && (
             <Card className="bg-secondary/50 border-secondary">
                <CardContent className="p-6 flex flex-col items-center text-center">
                <AlertTriangle className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">Geen quizzen gevonden</h3>
                <p className="text-muted-foreground">
                    Er zijn geen quizzen die overeenkomen met je zoekterm "{searchTerm}". Probeer een andere zoekterm.
                </p>
                <Button onClick={() => setSearchTerm('')} className="mt-4">
                    Wis zoekopdracht
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
                    Geen basistests beschikbaar.
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
                    Geen thema-quizzen beschikbaar.
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
