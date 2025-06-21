'use client';
import { createContext, useContext, useState, ReactNode, Dispatch, SetStateAction } from 'react';
import type { QuizAdminQuestion } from '@/types/quiz-admin';

export type QuizCreationState = {
  // Step 1
  creationType?: 'template' | 'scratch' | 'ai' | 'bulk';
  selectedTemplateId?: string;

  // Step 2
  audienceType?: 'teen' | 'parent' | 'adult';
  targetAgeGroup?: '6-11' | '12-14' | '15-18' | '18+' | 'all';
  focusFlags?: ('general' | 'adhd-friendly' | 'autism-friendly')[];

  // Step 3
  title?: string;
  description?: string;
  estimatedDuration?: string;
  categories?: string[];
  questions?: Partial<QuizAdminQuestion>[];

  // Step 4
  settings?: {
      resultType?: string;
      accessibility?: 'free' | 'premium';
      parentNotification?: 'auto' | 'optional' | 'none';
      followUpAction?: 'coaching' | 'email' | 'related_quizzes' | 'none';
      dataCollection?: 'anonymous' | 'pseudonymous' | 'full';
      integrations?: ('parent_dashboard' | 'coach_matching' | 'pdf_export')[];
  };
};

interface QuizCreatorContextType {
  currentStep: number;
  setCurrentStep: Dispatch<SetStateAction<number>>;
  completedSteps: Record<number, boolean>;
  setCompletedStep: (step: number, completed: boolean) => void;
  quizData: QuizCreationState;
  setQuizData: Dispatch<SetStateAction<QuizCreationState>>;
}

const QuizCreatorContext = createContext<QuizCreatorContextType | undefined>(undefined);

export const QuizCreatorProvider = ({ children }: { children: ReactNode }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<Record<number, boolean>>({});
  const [quizData, setQuizData] = useState<QuizCreationState>({
    focusFlags: ['general']
  });

  const setCompletedStep = (step: number, completed: boolean) => {
    setCompletedSteps(prev => ({ ...prev, [step]: completed }));
  };

  const value = { currentStep, setCurrentStep, completedSteps, setCompletedStep, quizData, setQuizData };

  return (
    <QuizCreatorContext.Provider value={value}>
      {children}
    </QuizCreatorContext.Provider>
  );
};

export const useQuizCreator = () => {
  const context = useContext(QuizCreatorContext);
  if (!context) {
    throw new Error('useQuizCreator must be used within a QuizCreatorProvider');
  }
  return context;
};
