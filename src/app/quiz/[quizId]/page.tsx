
"use client"; 

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { QuizProgressBar } from '@/components/quiz/quiz-progress-bar';
import { QuestionDisplay, QuizQuestion as QuestionType } from '@/components/quiz/question-display';
import { Button } from '@/components/ui/button';
import { SiteLogo } from '@/components/common/site-logo';
import Link from 'next/link';

// Dummy quiz data - replace with actual data fetching
const dummyQuizData: { [key: string]: QuestionType[] } = {
  'neuroprofile-101': [
    { id: 'q1', text: 'Hoe voel je je meestal in sociale situaties?', options: [{ id: 'o1a', text: 'Energiek en spraakzaam' }, { id: 'o1b', text: 'Rustig en observerend' }, { id: 'o1c', text: 'Afhankelijk van de situatie' }] },
    { id: 'q2', text: 'Als je een nieuwe taak krijgt, hoe pak je die meestal aan?', options: [{ id: 'o2a', text: 'Ik begin direct en zie wel waar ik uitkom' }, { id: 'o2b', text: 'Ik maak eerst een gedetailleerd plan' }, { id: 'o2c', text: 'Ik zoek een balans tussen plannen en doen' }] },
    { id: 'q3', text: 'Hoe ga je om met onverwachte veranderingen in je routine?', options: [{ id: 'o3a', text: 'Ik vind het lastig en heb tijd nodig om aan te passen' }, { id: 'o3b', text: 'Ik pas me makkelijk aan en zie het als een uitdaging' }, { id: 'o3c', text: 'Het hangt af van de soort verandering' }] },
  ],
  'adhd-focus-201': [
    { id: 'q1-adhd', text: 'Hoe vaak heb je moeite om je aandacht bij taken of spelactiviteiten te houden?', options: [{ id: 'o1a-adhd', text: 'Zelden of nooit' }, { id: 'o1b-adhd', text: 'Soms' }, { id: 'o1c-adhd', text: 'Vaak' }, { id: 'o1d-adhd', text: 'Zeer vaak' }] },
    { id: 'q2-adhd', text: 'Hoe vaak lijk je niet te luisteren als je direct wordt aangesproken?', options: [{ id: 'o1a-adhd', text: 'Zelden of nooit' }, { id: 'o1b-adhd', text: 'Soms' }, { id: 'o1c-adhd', text: 'Vaak' }, { id: 'o1d-adhd', text: 'Zeer vaak' }] },
  ],
};

const quizTitles: { [key: string]: string } = {
    'neuroprofile-101': 'Basis Zelfreflectie Tool (Volwassenen)',
    'adhd-focus-201': 'ADHD & Focus Verdieping (Volwassenen)',
};

export default function TakeQuizPage() {
  const params = useParams();
  const router = useRouter();
  const quizId = params.quizId as string;

  useEffect(() => {
    if (quizId === 'teen-neurodiversity-quiz') {
      router.replace('/quiz/teen-neurodiversity-quiz'); // This ensures it redirects to the specific teen quiz handler
    }
  }, [quizId, router]);
  
  const questions = quizId === 'teen-neurodiversity-quiz' ? [] : dummyQuizData[quizId] || [];
  const quizTitle = quizTitles[quizId] || "Zelfreflectie Tool";

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<{[key: string]: string}>({});

  const handleNextQuestion = (selectedOptionId: string) => {
    setAnswers(prev => ({ ...prev, [questions[currentQuestionIndex].id]: selectedOptionId }));
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      console.log('Basisvragen voltooid:', answers);
      router.push(`/quiz/${quizId}/subquiz-selection`);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };
  
  if (quizId === 'teen-neurodiversity-quiz') {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-4 text-center">
        <p>Laden van de zelfreflectie tool...</p>
      </div>
    );
  }
  
  if (!questions || questions.length === 0) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-4 text-center">
         <div className="absolute top-8 left-8">
            <SiteLogo />
        </div>
        <h1 className="text-2xl font-semibold mb-4">Tool niet gevonden</h1>
        <p className="text-muted-foreground mb-6">Sorry, we konden de gevraagde zelfreflectie tool niet laden of deze is verplaatst.</p>
        <Button asChild>
          <Link href="/quizzes">Terug naar overzicht</Link>
        </Button>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const totalSteps = 3; // Basis, Subquiz, Resultaten
  const currentGlobalStep = 1; // Basisvragen

  return (
    <div className="flex min-h-screen flex-col items-center bg-gradient-to-br from-primary/5 via-background to-accent/5 p-4 pt-16 md:pt-24 pb-16">
      <div className="absolute top-8 left-8">
            <SiteLogo />
      </div>
      <div className="w-full max-w-3xl text-center mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">{quizTitle}</h1>
        <QuizProgressBar currentStep={currentGlobalStep} totalSteps={totalSteps} stepNames={["Basis", "Verdieping", "Resultaten"]} />
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
