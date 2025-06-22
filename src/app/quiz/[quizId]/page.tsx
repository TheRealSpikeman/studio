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
    if (typeof window === 'undefined') return null;
    
    // Check localStorage by ID first
    const storedById = localStorage.getItem(quizIdOrSlug);
    if (storedById) {
      try {
        const quiz = JSON.parse(storedById);
        if (quiz.id === quizIdOrSlug) {
          return { title: quiz.title, questions: mapQuestionsToDisplay(quiz.questions) };
        }
      } catch (e) {}
    }

    // Fallback: iterate localStorage to find by slug
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (key.startsWith('ai-quiz-') || key.startsWith('manual-quiz-') || key.startsWith('teen-neuro-'))) { 
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
