'use client';
import { createContext, useContext, useState, ReactNode, Dispatch, SetStateAction, useEffect } from 'react';
import type { QuizAdminQuestion } from '@/types/quiz-admin';

export type QuizCreationState = {
  // Step 1
  creationType?: 'template' | 'scratch' | 'ai' | 'adaptive';
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
  settings?: {
    resultPresentation?: {
      showToParent: boolean;
      format: 'visual_report' | 'text_summary' | 'score_only';
    };
    saveResultsToProfile?: boolean;
    coachIntegration?: {
      enabled: boolean;
      specializations: string[];
    };
    accessibility?: {
      isPublic: boolean;
      accessLevel: 'free' | 'premium';
    };
    schoolPartnerships?: {
      enabled: boolean;
      targetGroups: ('voortgezet_onderwijs' | 'speciaal_onderwijs' | 'zorgcoordinatoren')[];
    };
    contentModeration?: {
      required: boolean;
    };
  };

  // Step 5 (was 4)
  questions?: Partial<QuizAdminQuestion>[];
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
    settings: {
        resultPresentation: {
            showToParent: true,
            format: 'visual_report',
        },
        saveResultsToProfile: true,
        coachIntegration: {
            enabled: true,
            specializations: [],
        },
        accessibility: {
            isPublic: true,
            accessLevel: 'free',
        },
        schoolPartnerships: {
            enabled: false,
            targetGroups: [],
        },
        contentModeration: {
            required: true,
        },
    },
};


export const QuizCreatorProvider = ({ children }: { children: ReactNode }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<Record<number, boolean>>({});
  const [quizData, setQuizData] = useState<QuizCreationState>(initialQuizData);

  // Load state from localStorage on the client side after initial render
  useEffect(() => {
    try {
      const savedDraft = window.localStorage.getItem(LOCAL_STORAGE_KEY);
      if (savedDraft) {
        setQuizData(JSON.parse(savedDraft));
      }
    } catch (error) {
      console.error("Error reading quiz draft from localStorage", error);
    }
  }, []);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    try {
        // Prevent saving the initial empty state on first load
        if (JSON.stringify(quizData) !== JSON.stringify(initialQuizData)) {
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(quizData));
        }
    } catch (error) {
      console.error("Error saving quiz draft to localStorage", error);
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
