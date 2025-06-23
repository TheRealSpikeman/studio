// src/app/quiz/teen-neurodiversity-quiz/QuizPageContent.tsx
"use client"; 

import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { SiteLogo } from '@/components/common/site-logo';
import Link from 'next/link';

// New step components
import { IntroStep } from '@/components/quiz/quiz-steps/IntroStep';
import { BaseQuestionStep } from '@/components/quiz/quiz-steps/BaseQuestionStep';
import { SubtestConfirmationStep } from '@/components/quiz/quiz-steps/SubtestConfirmationStep';
import { SubtestQuestionStep } from '@/components/quiz/quiz-steps/SubtestQuestionStep';
import { ResultsStep } from '@/components/quiz/quiz-steps/ResultsStep';

import { TeenQuizProgressBar } from '@/components/quiz/teen-quiz-progress-bar';

// Data imports
import {
  baseQuestionsTeen12_14,
  baseQuestionsTeen15_18,
  subTestsTeen12_14,
  subTestsTeen15_18,
  thresholdsTeen12_14,
  thresholdsTeen15_18,
  calculateAverage,
} from '@/lib/quiz-data/teen-neurodiversity-quiz';

type QuizStep = 'intro' | 'baseQuestions' | 'subtestConfirmation' | 'subtestQuestions' | 'results';
type AgeGroup = '12-14' | '15-18' | null;
type Scores = Record<string, number>;

export default function QuizPageContent() { 
  const router = useRouter();
  const searchParams = useSearchParams();
  const [ageGroup, setAgeGroup] = useState<AgeGroup>(null);

  // State management for the quiz flow
  const [currentStep, setCurrentStep] = useState<QuizStep>('intro');
  const [baseAnswers, setBaseAnswers] = useState<(number | undefined)[]>([]);
  const [subtestAnswers, setSubtestAnswers] = useState<Record<string, (number | undefined)[]>>({});
  const [relevantSubtests, setRelevantSubtests] = useState<string[]>([]);
  const [finalScores, setFinalScores] = useState<Scores>({});
  const [flatSubtestQuestions, setFlatSubtestQuestions] = useState<{ key: string; index: number; text: string; }[]>([]);
  
  const ageGroupFromQuery = searchParams.get('ageGroup') as AgeGroup;
  
  useEffect(() => {
    if (ageGroupFromQuery === '12-14' || ageGroupFromQuery === '15-18') {
      setAgeGroup(ageGroupFromQuery);
    }
  }, [ageGroupFromQuery]);
  
  // Memoized data based on age group
  const currentBaseQuestions = useMemo(() => (ageGroup === '12-14' ? baseQuestionsTeen12_14 : baseQuestionsTeen15_18), [ageGroup]);
  const currentSubTests = useMemo(() => (ageGroup === '12-14' ? subTestsTeen12_14 : subTestsTeen15_18), [ageGroup]);
  const currentThresholds = useMemo(() => (ageGroup === '12-14' ? thresholdsTeen12_14 : thresholdsTeen15_18), [ageGroup]);

  const calculateRelevantSubtests = useCallback((currentAnswers: (number | undefined)[]) => {
    if (Object.keys(currentThresholds).length === 0) return [];
    
    let scores: Scores = {};
    if (ageGroup === '15-18') {
      scores.ADD = calculateAverage(currentAnswers.slice(0, 3));
      scores.ADHD = calculateAverage(currentAnswers.slice(3, 6));
      scores.HSP = calculateAverage(currentAnswers.slice(6, 9));
      scores.ASS = calculateAverage(currentAnswers.slice(9, 12));
      scores.AngstDepressie = calculateAverage(currentAnswers.slice(12, 15));
    } else if (ageGroup === '12-14') {
      scores.ADD = calculateAverage(currentAnswers.slice(0, 2));
      scores.ADHD = calculateAverage(currentAnswers.slice(2, 4));
      scores.HSP = calculateAverage(currentAnswers.slice(4, 6));
      scores.ASS = calculateAverage(currentAnswers.slice(6, 8));
      scores.AngstDepressie = calculateAverage(currentAnswers.slice(8, 10));
    }
    
    return Object.keys(scores).filter(key => currentThresholds[key] && scores[key] >= currentThresholds[key]);
  }, [ageGroup, currentThresholds]);

  const calculateFinalScores = useCallback((currentRelevantSubtests: string[], finalSubtestAnswers: Record<string, (number | undefined)[]>): Scores => {
    if (Object.keys(currentThresholds).length === 0) return {};
    const scores: Scores = {};

    let baseScoresCalc: Scores = {};
     if (ageGroup === '15-18') {
        baseScoresCalc.ADD = calculateAverage(baseAnswers.slice(0, 3));
        baseScoresCalc.ADHD = calculateAverage(baseAnswers.slice(3, 6));
        baseScoresCalc.HSP = calculateAverage(baseAnswers.slice(6, 9));
        baseScoresCalc.ASS = calculateAverage(baseAnswers.slice(9, 12));
        baseScoresCalc.AngstDepressie = calculateAverage(baseAnswers.slice(12, 15));
    } else if (ageGroup === '12-14') {
        baseScoresCalc.ADD = calculateAverage(baseAnswers.slice(0, 2));
        baseScoresCalc.ADHD = calculateAverage(baseAnswers.slice(2, 4));
        baseScoresCalc.HSP = calculateAverage(baseAnswers.slice(4, 6));
        baseScoresCalc.ASS = calculateAverage(baseAnswers.slice(6, 8));
        baseScoresCalc.AngstDepressie = calculateAverage(baseAnswers.slice(8, 10));
    }

    Object.keys(currentThresholds).forEach(key => {
      if (currentRelevantSubtests.includes(key) && finalSubtestAnswers[key] && finalSubtestAnswers[key]?.filter(ans => ans !== undefined).length > 0) {
        scores[key] = calculateAverage(finalSubtestAnswers[key]);
      } else {
         scores[key] = baseScoresCalc[key] || 0;
      }
       scores[key] = Math.round(scores[key] * 100) / 100; 
    });
    return scores;
  }, [ageGroup, baseAnswers, currentThresholds]);

  const handleGoToResults = (finalSubtestAns: Record<string, (number | undefined)[]> = {}) => {
    const scores = calculateFinalScores(relevantSubtests, finalSubtestAns);
    setFinalScores(scores);
    setCurrentStep('results');
  };

  const handleStartQuiz = () => {
    setCurrentStep('baseQuestions');
  };

  const handleBaseQuestionsComplete = useCallback((answers: (number | undefined)[]) => {
    setBaseAnswers(answers);
    const relSubtests = calculateRelevantSubtests(answers);
    setRelevantSubtests(relSubtests);

    if (relSubtests.length === 0) {
      handleGoToResults();
    } else {
      const flattenedQuestions = relSubtests.flatMap(key =>
        (currentSubTests[key] || []).map((qText, qIndex) => ({
          key: key, index: qIndex, text: qText,
        }))
      );
      setFlatSubtestQuestions(flattenedQuestions);
      
      const initialSubAnswers: Record<string, (number | undefined)[]> = {};
      relSubtests.forEach(key => {
        initialSubAnswers[key] = new Array(currentSubTests[key]?.length || 0).fill(undefined);
      });
      setSubtestAnswers(initialSubAnswers);
      setCurrentStep('subtestConfirmation');
    }
  }, [calculateRelevantSubtests, currentSubTests, handleGoToResults]);

  const handleStartSubtests = () => {
    setCurrentStep('subtestQuestions');
  };

  const handleRestart = () => {
    setCurrentStep('intro');
    setBaseAnswers([]);
    setSubtestAnswers({});
    setRelevantSubtests([]);
    setFinalScores({});
    setFlatSubtestQuestions([]);
  };

  const progressStepNames = ["Basisvragen", "Verdieping", "Resultaten"];
  let progressCurrentStepNumber = 1;
  if (currentStep === 'subtestConfirmation' || currentStep === 'subtestQuestions') progressCurrentStepNumber = 2;
  if (currentStep === 'results') progressCurrentStepNumber = 3;

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'intro':
        return <IntroStep ageGroup={ageGroup} onStart={handleStartQuiz} backLink={`/quiz/teen-neurodiversity-quiz?ageGroup=${ageGroup}`} />;
      case 'baseQuestions':
        return <BaseQuestionStep baseQuestions={currentBaseQuestions} onComplete={handleBaseQuestionsComplete} onBackToIntro={() => setCurrentStep('intro')} />;
      case 'subtestConfirmation':
        return <SubtestConfirmationStep relevantSubtests={relevantSubtests} onStartSubtests={handleStartSubtests} onSkip={() => handleGoToResults()} />;
      case 'subtestQuestions':
        return <SubtestQuestionStep flatSubtestQuestions={flatSubtestQuestions} subtestAnswers={subtestAnswers} onComplete={(finalAnswers) => handleGoToResults(finalAnswers)} onBackToConfirmation={() => setCurrentStep('subtestConfirmation')} />;
      case 'results':
        return <ResultsStep finalScores={finalScores} baseAnswers={baseAnswers} subtestAnswers={subtestAnswers} ageGroup={ageGroup} relevantSubtests={relevantSubtests} onRestart={handleRestart} currentBaseQuestions={currentBaseQuestions} currentSubTests={currentSubTests} />;
      default:
        return null;
    }
  };

  if (!ageGroup || currentBaseQuestions.length === 0) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-4">
        <SiteLogo />
        <p className="mt-4">Quiz informatie laden...</p>
        <p className="text-xs text-muted-foreground">Zorg dat je een leeftijdsgroep hebt gekozen via de <Link href="/dashboard/leerling/quizzes" className="text-primary hover:underline">quizzen pagina</Link>.</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center bg-gradient-to-br from-primary/5 via-background to-accent/5 p-4 pt-10 md:pt-16 pb-16">
      <div className="absolute top-4 left-4 md:top-8 md:left-8">
        <SiteLogo />
      </div>

      <div className="w-full max-w-3xl"> 
          {currentStep !== 'intro' && currentStep !== 'results' && (
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-foreground mb-2">Zelfreflectie Quiz ({ageGroup} jaar)</h1>
                <TeenQuizProgressBar currentStep={progressCurrentStepNumber} stepNames={progressStepNames} />
            </div>
          )}
          {renderCurrentStep()}
      </div>
    </div>
  );
}