// src/app/quizzes/page.tsx
"use client"; // Made client component for potential future dynamic age handling

import { useState, useEffect } from 'react'; // Added useState and useEffect
import { QuizCard, QuizStatus } from '@/components/quiz/quiz-card';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';

interface Quiz {
  id: string;
  title: string;
  description: string;
  status: QuizStatus;
  progress?: number;
  imageUrl?: string;
  dataAiHint?: string;
  minAge?: number;
  maxAge?: number;
}

// Dummy data for demonstration, in a real app this would come from an API
const allQuizzes: Quiz[] = [
  { 
    id: 'teen-neurodiversity-quiz', 
    title: 'Neurodiversiteit Quiz (12-18 jaar)', 
    description: 'Een quiz speciaal ontworpen voor tieners om inzicht te krijgen in eigenschappen zoals ADD, ADHD, HSP, ASS en Angst/Depressie.', 
    status: 'Nog niet gestart' as QuizStatus, 
    imageUrl: 'https://picsum.photos/seed/teenquiz/400/200',
    dataAiHint: 'teenager brain',
    minAge: 12,
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
  // In a real application, userAge would come from authentication context or user profile.
  // For demonstration, we're using a hardcoded age.
  // Try changing this value (e.g., 15 for teen, 25 for adult) to see filtering in action.
  const [userAge, setUserAge] = useState<number | undefined>(undefined); // Default to undefined to show all if no age context

  // Simulate fetching user age (e.g., after login)
  useEffect(() => {
    // Placeholder: In a real app, you'd fetch this from your auth provider/backend
    // For this demo, we'll set a default age.
    // If you want to test different age filters, you can change this value.
    // For example, set to 15 to see teen-specific quizzes, 25 for adult quizzes.
    // setUserAge(15); 
    // setUserAge(25);
    // By default, no age is set, so all quizzes are shown unless explicitly filtered by age properties.
    // If an age is provided during signup, it should be stored and retrieved here.
  }, []);


  const filteredQuizzes = allQuizzes.filter(quiz => {
    const matchesSearch = quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          quiz.description.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    // If userAge is not set, or quiz has no age restrictions, show it (if it matches search)
    if (userAge === undefined) {
        // If no user age context, show quizzes that don't have specific age restrictions
        // or are generally available. Teens might not want to see adult specific quizzes by default and vice-versa.
        // This logic can be refined. For now, if no userAge, show all (that match search).
        // A better approach might be to show only 'Algemeen' and 'Tiener' if no age is known.
        return true; 
    }

    // Quiz has no age restriction defined
    if (quiz.minAge === undefined && quiz.maxAge === undefined) return true;

    const meetsMinAge = quiz.minAge === undefined || userAge >= quiz.minAge;
    const meetsMaxAge = quiz.maxAge === undefined || userAge <= quiz.maxAge;
    
    return meetsMinAge && meetsMaxAge;
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
              {userAge && ` Momenteel gefilterd voor leeftijd: ${userAge}.`}
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
            {/* Example: Simple buttons to test age filtering for demo purposes */}
            {/* <div className="mt-2 space-x-2">
              <Button onClick={() => setUserAge(15)} variant="outline" size="sm">Toon voor 15 jaar</Button>
              <Button onClick={() => setUserAge(25)} variant="outline" size="sm">Toon voor 25 jaar</Button>
              <Button onClick={() => setUserAge(undefined)} variant="outline" size="sm">Reset leeftijdfilter</Button>
            </div> */}
          </div>
          
          {filteredQuizzes.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredQuizzes.map((quiz) => (
                <QuizCard key={quiz.id} {...quiz} />
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-10">
              {searchTerm ? "Geen quizzen gevonden die overeenkomen met je zoekopdracht." : "Geen quizzen beschikbaar voor de geselecteerde leeftijdscategorie."}
            </p>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
