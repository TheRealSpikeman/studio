// src/app/quizzes/page.tsx
"use client"; 

import { useState, useEffect } from 'react'; 
import { QuizCard, QuizStatus } from '@/components/quiz/quiz-card';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';

interface Quiz {
  id: string; // This will be the quiz path segment, e.g., 'teen-neurodiversity-quiz?ageGroup=12-14'
  title: string;
  description: string;
  status: QuizStatus;
  progress?: number;
  imageUrl?: string;
  dataAiHint?: string;
  minAge?: number; // For filtering on this page if userAge context is available
  maxAge?: number; // For filtering on this page if userAge context is available
}

// Dummy data for demonstration, in a real app this would come from an API
const allQuizzes: Quiz[] = [
  { 
    id: 'teen-neurodiversity-quiz?ageGroup=12-14', 
    title: 'Neurodiversiteit Quiz (12-14 jaar)', 
    description: 'Een quiz speciaal ontworpen voor jou (12-14 jaar) om inzicht te krijgen in eigenschappen zoals ADD, ADHD, HSP, ASS en Angst/Depressie.', 
    status: 'Nog niet gestart' as QuizStatus, 
    imageUrl: 'https://picsum.photos/seed/teenquiz1214/400/200',
    dataAiHint: 'teenager study',
    minAge: 12,
    maxAge: 14,
  },
  { 
    id: 'teen-neurodiversity-quiz?ageGroup=15-18', 
    title: 'Neurodiversiteit Quiz (15-18 jaar)', 
    description: 'Een quiz speciaal ontworpen voor jou (15-18 jaar) om inzicht te krijgen in eigenschappen zoals ADD, ADHD, HSP, ASS en Angst/Depressie.', 
    status: 'Nog niet gestart' as QuizStatus, 
    imageUrl: 'https://picsum.photos/seed/teenquiz1518/400/200',
    dataAiHint: 'teenager focused',
    minAge: 15,
    maxAge: 18,
  },
  { 
    id: 'neuroprofile-101', 
    title: 'Basis Neuroprofiel Quiz (Volwassenen)', 
    description: 'Ontdek je fundamentele neurodiversiteitskenmerken. Geschikt voor volwassenen.', 
    status: 'Nog niet gestart' as QuizStatus, 
    imageUrl: 'https://picsum.photos/seed/neuro1/400/200', 
    dataAiHint: 'brain puzzle',
    minAge: 19,
  },
  { 
    id: 'adhd-focus-201', 
    title: 'ADHD & Focus Verdieping (Volwassenen)', 
    description: 'Specifieke vragen rondom aandacht en hyperactiviteit voor volwassenen.', 
    status: 'Nog niet gestart' as QuizStatus, 
    progress: 0, 
    imageUrl: 'https://picsum.photos/seed/adhd1/400/200', 
    dataAiHint: 'focus target',
    minAge: 19,
  },
  { 
    id: 'autism-spectrum-202', 
    title: 'Autisme Spectrum Verkenning (Volwassenen)', 
    description: 'Verken kenmerken gerelateerd aan het autismespectrum voor volwassenen.', 
    status: 'Nog niet gestart' as QuizStatus, 
    imageUrl: 'https://picsum.photos/seed/autism1/400/200', 
    dataAiHint: 'social connection',
    minAge: 19,
  },
  { 
    id: 'dyslexia-reading-203', 
    title: 'Dyslexie & Leesvaardigheid (Algemeen)', 
    description: 'Inzicht in lees- en schrijfpatronen.', 
    status: 'Nog niet gestart' as QuizStatus, 
    imageUrl: 'https://picsum.photos/seed/dyslexia1/400/200', 
    dataAiHint: 'open book',
    // No specific age restriction, or could be e.g., minAge: 7
  },
  { 
    id: 'sensory-processing-204', 
    title: 'Sensorische Prikkelverwerking (Algemeen)', 
    description: 'Begrijp hoe je reageert op zintuiglijke input.', 
    status: 'Nog niet gestart' as QuizStatus, 
    imageUrl: 'https://picsum.photos/seed/sensory1/400/200', 
    dataAiHint: 'sound waves',
    // No specific age restriction
  },
];

export default function QuizzesOverviewPage() {
  const [searchTerm, setSearchTerm] = useState('');
  // userAge could be fetched from auth context if user is logged in.
  // For this page's purpose of selecting a quiz, explicit age filtering might not be primary
  // if quizzes are already named by age group (e.g. "Quiz 12-14 jaar").
  const [userAge, setUserAge] = useState<number | undefined>(undefined); 

  useEffect(() => {
    // Example: Fetch userAge from auth context or a stored profile
    // setUserAge(16); // for testing
  }, []);


  const filteredQuizzes = allQuizzes.filter(quiz => {
    const matchesSearch = quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          quiz.description.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    // If userAge is available (e.g., from logged-in profile), filter by it.
    // Otherwise, show all quizzes that match search term.
    if (userAge !== undefined) {
        const meetsMinAge = quiz.minAge === undefined || userAge >= quiz.minAge;
        const meetsMaxAge = quiz.maxAge === undefined || userAge <= quiz.maxAge;
        return meetsMinAge && meetsMaxAge;
    }
    
    return true; // Show all if no userAge context or no specific age selection on this page
  });

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex flex-1 flex-col items-center justify-center py-12 md:py-16 lg:py-20">
        <div className="container space-y-8">
          <section>
            <h1 className="text-3xl font-bold text-foreground">Alle Quizzen</h1>
            <p className="text-muted-foreground">
              Verken alle beschikbare quizzen en verdiep je inzicht in neurodiversiteit. 
              Kies de quiz die het beste bij jouw leeftijdscategorie past.
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
          
          {filteredQuizzes.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredQuizzes.map((quiz) => (
                // The QuizCard will use `quiz.id` to construct the href: `/quiz/${quiz.id}`
                // So, for `id: 'teen-neurodiversity-quiz?ageGroup=12-14'`, href becomes `/quiz/teen-neurodiversity-quiz?ageGroup=12-14`
                <QuizCard key={quiz.id} {...quiz} />
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-10">
              {searchTerm ? "Geen quizzen gevonden die overeenkomen met je zoekopdracht." : "Geen quizzen beschikbaar."}
            </p>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
