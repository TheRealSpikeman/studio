// src/components/quiz/quiz-steps/SubtestQuestionStep.tsx
"use client";

import React, { useState, useCallback } from 'react';
import { QuestionDisplay } from '@/components/quiz/question-display';
import type { QuizQuestion } from '@/components/quiz/question-display';
import { answerOptions } from '@/lib/quiz-data/teen-neurodiversity-quiz';

interface FlatQuestion {
  key: string;
  index: number;
  text: string;
}

interface SubtestQuestionStepProps {
  flatSubtestQuestions: FlatQuestion[];
  subtestAnswers: Record<string, (number | undefined)[]>;
  onComplete: (answers: Record<string, (number | undefined)[]>) => void;
  onBackToConfirmation: () => void;
}

export const SubtestQuestionStep = ({ flatSubtestQuestions, subtestAnswers, onComplete, onBackToConfirmation }: SubtestQuestionStepProps) => {
  const [currentFlatIndex, setCurrentFlatIndex] = useState(0);
  const [answers, setAnswers] = useState(subtestAnswers);

  const handleNext = useCallback((selectedOptionValue: string) => {
    const currentQuestion = flatSubtestQuestions[currentFlatIndex];
    if (!currentQuestion) return;

    const { key, index } = currentQuestion;
    const newSubtestAnswers = { ...answers };
    
    // Ensure the array for the subtest exists
    if (!newSubtestAnswers[key]) {
      const questionsForSubtest = flatSubtestQuestions.filter(q => q.key === key);
      newSubtestAnswers[key] = new Array(questionsForSubtest.length).fill(undefined);
    }
    
    const newAnswersForSubtest = [...newSubtestAnswers[key]];
    newAnswersForSubtest[index] = parseInt(selectedOptionValue, 10);
    newSubtestAnswers[key] = newAnswersForSubtest;
    setAnswers(newSubtestAnswers);

    if (currentFlatIndex < flatSubtestQuestions.length - 1) {
      setCurrentFlatIndex(prev => prev + 1);
    } else {
      onComplete(newSubtestAnswers);
    }
  }, [answers, currentFlatIndex, flatSubtestQuestions, onComplete]);

  const handleBack = () => {
    if (currentFlatIndex === 0) {
      onBackToConfirmation();
    } else {
      setCurrentFlatIndex(prev => prev - 1);
    }
  };
  
  if (flatSubtestQuestions.length === 0) return null;

  const currentQuestion = flatSubtestQuestions[currentFlatIndex];
  if (!currentQuestion) return null; // Extra safety check

  const question: QuizQuestion = {
    id: `sub-q-${currentFlatIndex}`,
    text: currentQuestion.text,
    options: answerOptions.map(opt => ({ id: `sub-opt-${opt.value}`, text: opt.label, value: opt.value })),
  };

  return (
    <QuestionDisplay
      key={`sub-q-${currentFlatIndex}`}
      question={question}
      questionNumber={currentFlatIndex + 1}
      totalQuestions={flatSubtestQuestions.length}
      onNext={handleNext}
      onBack={handleBack}
      isFirstQuestion={false} // Back button always enabled to go to confirmation step
    />
  );
};
