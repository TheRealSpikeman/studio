'use client';
import { createContext, useContext, useState, ReactNode, Dispatch, SetStateAction, useEffect } from 'react';
import type { QuizAdminQuestion } from '@/types/quiz-admin';

export type QuizCreationState = {
  // Step 1
  creationType?: 'template' | 'scratch' | 'ai' | 'bulk';
  selectedTemplateId?: string;

  // Step 2
  audienceType?: 'teen' | 'parent' | 'adult';
  targetAgeGroup?: '6-11' | '12-14' | '15-18' | '18+' | 'all';
  focusFlags?: ('general' | 'adhd-friendly' | 'autism-friendly' | 'hsp-friendly' | 'dyslexia-friendly' | 'giftedness-focus' | 'executive-functions-focus' | 'sensory-processing-focus' | 'emotion-regulation-focus')[];

  // Step 3
  mainCategory?: string;
  title?: string;
  description?: string;
  estimatedDuration?: string;
  resultType?: string;
  difficulty?: string;

  // Step 4
  questions?: Partial<QuizAdminQuestion>[];

  // Step 5
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
  resetQuizCreator: () => void; // Functie om de state te resetten
}

const QuizCreatorContext = createContext<QuizCreatorContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'quizCreatorDraft_v1';

const initialQuizData: QuizCreationState = {
    focusFlags: ['general'],
    mainCategory: undefined,
    title: "",
    description: "",
    estimatedDuration: "3-5",
    resultType: "personality-4-types",
    difficulty: undefined,
};


export const QuizCreatorProvider = ({ children }: { children: ReactNode }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<Record<number, boolean>>({});
  
  const [quizData, setQuizData] = useState<QuizCreationState>(() => {
    if (typeof window === 'undefined') {
        return initialQuizData;
    }
    try {
        const savedDraft = window.localStorage.getItem(LOCAL_STORAGE_KEY);
        return savedDraft ? JSON.parse(savedDraft) : initialQuizData;
    } catch (error) {
        console.error("Error reading quiz draft from localStorage", error);
        return initialQuizData;
    }
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
        try {
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(quizData));
        } catch (error) {
            console.error("Error saving quiz draft to localStorage", error);
        }
    }
  }, [quizData]);

  const setCompletedStep = (step: number, completed: boolean) => {
    setCompletedSteps(prev => ({ ...prev, [step]: completed }));
  };

  const resetQuizCreator = () => {
    setCurrentStep(1);
    setCompletedSteps({});
    setQuizData(initialQuizData);
    if (typeof window !== 'undefined') {
        localStorage.removeItem(LOCAL_STORAGE_KEY);
    }
  };

  const value = { currentStep, setCurrentStep, completedSteps, setCompletedStep, quizData, setQuizData, resetQuizCreator };

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
