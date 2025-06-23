// src/components/quiz/quiz-steps/BaseQuestionStep.tsx
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { QuestionDisplay } from '@/components/quiz/question-display';
import type { QuizQuestion } from '@/components/quiz/question-display';
import { answerOptions } from '@/lib/quiz-data/teen-neurodiversity-quiz';

interface BaseQuestionStepProps {
  baseQuestions: string[];
  onComplete: (answers: (number | undefined)[]) => void;
  onBackToIntro: () => void;
}

export const BaseQuestionStep = ({ baseQuestions, onComplete, onBackToIntro }: BaseQuestionStepProps) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<(number | undefined)[]>([]);

  useEffect(() => {
    setAnswers(new Array(baseQuestions.length).fill(undefined));
  }, [baseQuestions]);

  const handleNext = useCallback((selectedOptionValue: string) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = parseInt(selectedOptionValue, 10);
    setAnswers(newAnswers);

    if (currentQuestionIndex < baseQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      onComplete(newAnswers);
    }
  }, [answers, currentQuestionIndex, baseQuestions.length, onComplete]);

  const handleBack = () => {
    if (currentQuestionIndex === 0) {
      onBackToIntro();
    } else {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const currentQuestion: QuizQuestion = {
    id: `base-q-${currentQuestionIndex}`,
    text: baseQuestions[currentQuestionIndex],
    options: answerOptions.map(opt => ({ id: `base-opt-${opt.value}`, text: opt.label, value: opt.value })),
  };

  return (
    <QuestionDisplay
      key={`base-q-${currentQuestionIndex}`}
      question={currentQuestion}
      questionNumber={currentQuestionIndex + 1}
      totalQuestions={baseQuestions.length}
      onNext={handleNext}
      onBack={handleBack}
      isFirstQuestion={currentQuestionIndex === 0}
    />
  );
};
