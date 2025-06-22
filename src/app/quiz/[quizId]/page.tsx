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
import { answerOptions } from '@/lib/quiz-data/teen-neurodiversity-quiz';

function mapQuestionsToDisplay(questions: QuizAdminQuestion[]): QuestionType[] {
  return questions.map(q => ({
    id: q.id || `q-${Math.random()}`,
    text: q.text,
    options: answerOptions.map(opt => ({ 
        id: `${q.id}-${opt.value}`, // a unique ID for the option
        text: opt.label,
        value: opt.value, // The actual value for the radio group
    }))
  }));
}


async function fetchQuizForPreview(quizIdOrSlug: string): Promise<{ title: string; questions: QuestionType[] } | null> {
    if (typeof window === 'undefined') return null;

    if (quizIdOrSlug === 'debug-flow-test') {
        return {
            title: 'Foutopsporing-Quiz: Data Flow',
            questions: [
                { id: 'dq1', text: 'Vraag 1: Geeft de quiz data correct door?', options: answerOptions.map(o => ({ id: `dq1-${o.value}`, text: o.label, value: o.value })) },
                { id: 'dq2', text: 'Vraag 2: Worden de resultaten correct opgeslagen?', options: answerOptions.map(o => ({ id: `dq2-${o.value}`, text: o.label, value: o.value })) },
                { id: 'dq3', text: 'Vraag 3: Wordt de AI-samenvatting correct gegenereerd?', options: answerOptions.map(o => ({ id: `dq3-${o.value}`, text: o.label, value: o.value })) },
            ]
        };
    }
    
    // First, try to get by ID, which is the key
    const storedById = localStorage.getItem(quizIdOrSlug);
    if (storedById) {
        try {
            const quiz = JSON.parse(storedById);
            // Check if it's a quiz object and ID matches. This works if the URL param is the ID.
            if (quiz.id === quizIdOrSlug && quiz.title && Array.isArray(quiz.questions)) {
              return { title: quiz.title, questions: mapQuestionsToDisplay(quiz.questions) };
            }
        } catch (e) { /* ignore parse error, continue to slug/loop search */ }
    }

    // If not found by ID, iterate all localStorage items to find by slug
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key) { // Check if key is not null
            const storedData = localStorage.getItem(key);
            if (storedData) {
                try {
                    const parsed = JSON.parse(storedData) as QuizAdmin;
                    // Check if it's a quiz object and if the slug matches.
                    if (parsed.id && parsed.title && Array.isArray(parsed.questions) && parsed.slug === quizIdOrSlug) {
                        return { title: parsed.title, questions: mapQuestionsToDisplay(parsed.questions) };
                    }
                } catch (e) { /* ignore items that are not valid JSON or not quiz objects */ }
            }
        }
    }

    return null;
}

export default function TakeQuizPage() {
  const params = useParams();
  const router = useRouter();
  const quizIdOrSlug = params.quizId as string;
  
  const [quizData, setQuizData] = useState<{ title: string; questions: QuestionType[] } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<{[key: string]: string}>({});

  useEffect(() => {
    // Redirect special quizzes to their dedicated handlers
    if (quizIdOrSlug === 'teen-neurodiversity-quiz') {
      router.replace('/quiz/teen-neurodiversity-quiz');
      return;
    }
    
    async function loadQuiz() {
      setIsLoading(true);
      const data = await fetchQuizForPreview(quizIdOrSlug);
      setQuizData(data);
      setIsLoading(false);
    }
    loadQuiz();
  }, [quizIdOrSlug, router]);

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
          <Link href="/dashboard/admin/quiz-management">Terug naar overzicht</Link>
        </Button>
      </div>
    );
  }

  const { questions, title: quizTitle } = quizData;
  const currentQuestion = questions[currentQuestionIndex];

  const handleNextQuestion = (selectedOptionValue: string) => {
    const newAnswers = {...answers, [currentQuestion.id]: selectedOptionValue};
    setAnswers(newAnswers);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      // Quiz finished, save results to localStorage
      const finalAnswers = {
        ...newAnswers,
        [currentQuestion.id]: selectedOptionValue,
      };

      const resultsToStore = {
        quizTitle: quizTitle,
        answers: Object.entries(finalAnswers).map(([qId, val]) => {
          const question = questions.find(q => q.id === qId);
          const option = answerOptions.find(o => o.value === val); // find option by value
          return {
            question: question?.text || 'Onbekende vraag',
            answer: option ? `${option.label} (${option.value})` : `Score ${val}`,
          };
        }),
      };

      try {
        localStorage.setItem(`quizResult_${quizIdOrSlug}`, JSON.stringify(resultsToStore));
      } catch (e) {
        console.error("Failed to save quiz results to localStorage", e);
      }
      
      console.log('Quiz voltooid:', resultsToStore);
      router.push(`/quiz/${quizIdOrSlug}/results`);
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
