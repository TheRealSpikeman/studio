// src/app/quiz/[quizId]/page.tsx
"use client"; 

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { QuizProgressBar } from '@/components/quiz/quiz-progress-bar';
import { QuestionDisplay } from '@/components/quiz/question-display';
import { Button } from '@/components/ui/button';
import { SiteLogo } from '@/components/common/site-logo';
import Link from 'next/link';
import { Progress } from '@/components/ui/progress';

import type { QuizAdmin, QuizAdminQuestion } from '@/types/quiz-admin';
import type { QuizQuestion as QuestionType, QuizOption as OptionType } from '@/components/quiz/question-display';

// This DUMMY_QUIZZES_FOR_PREVIEW should contain all quizzes that are listed on the quiz-management page.
// It should mirror the DUMMY_QUIZZES from quiz-management/page.tsx
const DUMMY_QUIZZES_FOR_PREVIEW: QuizAdmin[] = [
  { 
    id: 'teen-neuro-15-18', title: 'Basis Zelfreflectie (15-18 jr)', 
    description: 'Algemene neurodiversiteitstest voor oudere tieners, ontdek jouw unieke eigenschappen.', 
    audience: ['Tiener (15-18 jr, voor zichzelf)'], category: 'Basis', status: 'published', 
    questions: [
        {id:'q_tn_1518_1', text:'Ik merk dat mijn gedachten afdwalen, zelfs als ik probeer te focussen op schoolwerk.', weight: 2}, 
        {id:'q_tn_1518_2', text:'Na een lange schooldag heb ik echt tijd nodig om bij te komen.', weight: 1},
        {id:'q_tn_1518_3', text:'Ik voel me snel overweldigd in drukke plekken zoals de kantine.', weight: 3}
    ],
    subtestConfigs: [{subtestId: 'ADD', threshold: 2.6}, {subtestId: 'HSP', threshold: 3.1}],
    lastUpdatedAt: new Date(Date.now() - 86400000 * 2).toISOString(), 
    createdAt: new Date(Date.now() - 86400000 * 10).toISOString(),
    slug: 'basis-neuro-15-18', metaTitle: 'Basis Neuroprofiel Quiz (15-18 jaar)', metaDescription: 'Doe de neurodiversiteitstest voor 15-18 jarigen.',
    thumbnailUrl: 'https://picsum.photos/seed/teenquiz1518/400/200',
    analysisDetailLevel: 'standaard',
    analysisInstructions: 'Focus op het geven van concrete, leeftijdsspecifieke tips voor 15-18 jarigen.',
  },
  { 
    id: 'teen-neuro-12-14', title: 'Basis Zelfreflectie (12-14 jr)', 
    description: 'Speciaal voor 12-14 jaar, ontdek jouw unieke eigenschappen.', 
    audience: ['Tiener (12-14 jr, voor zichzelf)'], category: 'Basis', status: 'published', 
    questions: [
      {id:'q_tn_1214_1', text:'Dwalen je gedachten makkelijk af als je je probeert te concentreren?', weight: 2},
      {id:'q_tn_1214_2', text:'Heb je na een drukke schooldag tijd voor jezelf nodig om bij te komen?', weight: 1}
    ],
    lastUpdatedAt: new Date(Date.now() - 86400000 * 3).toISOString(), 
    createdAt: new Date(Date.now() - 86400000 * 15).toISOString(),
    slug: 'basis-neuro-12-14',
    thumbnailUrl: 'https://picsum.photos/seed/teenquiz1214/400/200',
    analysisDetailLevel: 'standaard',
  },
   { 
    id: 'ouder-ken-je-kind-6-11', title: 'Ken je Kind (6-11 jr)', 
    description: 'Vragenlijst voor ouders om gedrag en kenmerken van hun kind (6-11 jr) beter te begrijpen.', 
    audience: ['Ouder (over kind 6-11 jr)'], category: 'Ouder Observatie', status: 'concept', 
    questions: [
        {id:'q_okk_611_1', text:'Hoe vaak merkt u dat uw kind moeite heeft met stilzitten tijdens maaltijden of rustige activiteiten?', weight: 1}, 
        {id:'q_okk_611_2', text:'In welke mate lijkt uw kind details op te merken die anderen vaak ontgaan?', weight: 2},
    ],
    lastUpdatedAt: new Date(Date.now() - 86400000 * 1).toISOString(), 
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    slug: 'ken-je-kind-6-11',
    thumbnailUrl: 'https://picsum.photos/seed/kenjekind611/400/200',
    analysisDetailLevel: 'standaard',
  },
  { 
    id: 'exam-stress-planning', title: 'Examenvrees & Planning (Tieners)', 
    description: 'Leer stress te beheersen en je planning scherp te houden voor examens.', 
    audience: ['Tiener (15-18 jr, voor zichzelf)', 'Tiener (12-14 jr, voor zichzelf)'], category: 'Thema', status: 'concept', 
    questions: [
      {id:'q_esp_1', text:'Maak je je veel zorgen over toetsen, zelfs als je goed hebt geleerd?', weight: 3},
      {id:'q_esp_2', text:'Vind je het moeilijk om te beginnen met een examen?', weight: 2}
    ],
    lastUpdatedAt: new Date(Date.now() - 86400000 * 5).toISOString(), 
    createdAt: new Date(Date.now() - 86400000 * 20).toISOString(),
    slug: 'examenvrees-planning-quiz',
    thumbnailUrl: 'https://picsum.photos/seed/examstress/400/200',
    analysisDetailLevel: 'beknopt',
    analysisInstructions: 'Houd de analyse over examenvrees kort en to-the-point.',
  },
  { 
    id: 'focus-digital-distraction', title: 'Focus & Digitale Afleiding (Alle)', 
    description: 'Ontdek hoe social media en andere digitale afleidingen je concentratie beïnvloeden.', 
    audience: ['Algemeen (alle leeftijden, voor zichzelf)'], category: 'Thema', status: 'published', 
    questions: [
      {id:'q_fdd_1', text:'Raak je snel afgeleid door meldingen op je telefoon tijdens het huiswerk?', weight: 1},
      {id:'q_fdd_2', text:'Hoe vaak controleer je social media terwijl je eigenlijk zou moeten studeren?', weight: 2}
    ],
    lastUpdatedAt: new Date(Date.now() - 86400000 * 1).toISOString(), 
    createdAt: new Date(Date.now() - 86400000 * 8).toISOString(),
    slug: 'focus-digitale-afleiding',
    thumbnailUrl: 'https://picsum.photos/seed/digitalfocus/400/200',
    analysisDetailLevel: 'uitgebreid',
  },
];

const answerOptions: OptionType[] = [
  { value: '1', label: 'Nooit' },
  { value: '2', label: 'Soms' },
  { value: '3', label: 'Vaak' },
  { value: '4', label: 'Altijd' },
];

function mapQuestionsToDisplay(questions: QuizAdminQuestion[]): QuestionType[] {
  return questions.map(q => ({
    id: q.id || `q-${Math.random()}`,
    text: q.text,
    options: answerOptions.map(opt => ({ id: `${q.id}-${opt.value}`, text: opt.label }))
  }));
}

async function fetchQuizForPreview(quizIdOrSlug: string): Promise<{ title: string; questions: QuestionType[] } | null> {
    if (typeof window === 'undefined') return null; // Can't access localStorage on server

    // Check dummy data first
    const dummyQuiz = DUMMY_QUIZZES_FOR_PREVIEW.find(q => q.id === quizIdOrSlug || q.slug === quizIdOrSlug);
    if (dummyQuiz) {
        return { title: dummyQuiz.title, questions: mapQuestionsToDisplay(dummyQuiz.questions) };
    }
    
    // Then, check local storage for AI quizzes.
    // The quizId for AI quizzes is the key in localStorage.
    const storedQuizData = localStorage.getItem(quizIdOrSlug);
    if (storedQuizData) {
        try {
            const quiz = JSON.parse(storedQuizData) as QuizAdmin;
            if (quiz.id === quizIdOrSlug || quiz.slug === quizIdOrSlug) {
              return { title: quiz.title, questions: mapQuestionsToDisplay(quiz.questions) };
            }
        } catch (e) { /* ignore parse error */ }
    }

    // Fallback: iterate localStorage to find by slug if ID doesn't match
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (key.startsWith('ai-quiz-') || key.startsWith('manual-quiz-'))) { 
            const storedData = localStorage.getItem(key);
            if (storedData) {
                try {
                    const parsed = JSON.parse(storedData) as QuizAdmin;
                    if (parsed.slug === quizIdOrSlug) {
                        return { title: parsed.title, questions: mapQuestionsToDisplay(parsed.questions) };
                    }
                } catch (e) { /* ignore */ }
            }
        }
    }

    return null;
}

export default function TakeQuizPage() {
  const params = useParams();
  const router = useRouter();
  const quizId = params.quizId as string;
  
  const [quizData, setQuizData] = useState<{ title: string; questions: QuestionType[] } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<{[key: string]: string}>({});

  useEffect(() => {
    // Redirect special quizzes to their dedicated handlers
    if (quizId === 'teen-neurodiversity-quiz') {
      router.replace('/quiz/teen-neurodiversity-quiz');
      return;
    }
    
    async function loadQuiz() {
      setIsLoading(true);
      const data = await fetchQuizForPreview(quizId);
      setQuizData(data);
      setIsLoading(false);
    }
    loadQuiz();
  }, [quizId, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-4 text-center">
        <p>Laden van de zelfreflectie tool...</p>
      </div>
    );
  }

  if (!quizData) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-4 text-center">
         <div className="absolute top-8 left-8">
            <SiteLogo />
        </div>
        <h1 className="text-2xl font-semibold mb-4">Tool niet gevonden</h1>
        <p className="text-muted-foreground mb-6">Sorry, we konden de gevraagde zelfreflectie tool niet laden. Controleer of de slug/ID correct is.</p>
        <Button asChild>
          <Link href="/quizzes">Terug naar overzicht</Link>
        </Button>
      </div>
    );
  }

  const { questions, title: quizTitle } = quizData;
  const currentQuestion = questions[currentQuestionIndex];

  const handleNextQuestion = (selectedOptionId: string) => {
    setAnswers(prev => ({ ...prev, [questions[currentQuestionIndex].id]: selectedOptionId }));
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      console.log('Quiz voltooid:', answers);
      router.push(`/quiz/${quizId}/results`); // Go to a generic results page
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const totalSteps = questions.length;
  const currentGlobalStep = currentQuestionIndex + 1;

  return (
    <div className="flex min-h-screen flex-col items-center bg-gradient-to-br from-primary/5 via-background to-accent/5 p-4 pt-16 md:pt-24 pb-16">
      <div className="absolute top-8 left-8">
            <SiteLogo />
      </div>
      <div className="w-full max-w-3xl text-center mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">{quizTitle}</h1>
        {/* Using a simpler progress bar for thematic quizzes */}
        <Progress value={(currentGlobalStep / totalSteps) * 100} className="w-full h-2" />
        <p className="text-sm text-muted-foreground mt-2">Vraag {currentGlobalStep} van {totalSteps}</p>
      </div>
      
      <QuestionDisplay
        question={currentQuestion}
        questionNumber={currentQuestionIndex + 1}
        totalQuestions={questions.length}
        onNext={handleNextQuestion}
        onBack={handlePreviousQuestion}
        isFirstQuestion={currentQuestionIndex === 0}
      />
    </div>
  );
}
