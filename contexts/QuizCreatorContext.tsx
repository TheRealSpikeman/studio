
'use client';
import { createContext, useContext, useState, ReactNode, Dispatch, SetStateAction, useEffect } from 'react';
import type { QuizAdminQuestion } from '@/types/quiz-admin';

export type QuizCreationState = {
  // Step 1
  creationType?: 'template' | 'scratch' | 'ai' | 'adaptive';
  selectedTemplateId?: string;

  // Step 2
  audienceType?: 'teen' | 'parent' | 'adult';
  targetAgeGroup?: '12-14' | '15-18' | '18+' | 'all'; // Removed '6-11'
  focusFlags?: ('general' | 'adhd-friendly' | 'autism-friendly' | 'hsp-friendly' | 'dyslexia-friendly' | 'giftedness-focus' | 'executive-functions-focus' | 'sensory-processing-focus' | 'emotion-regulation-focus')[];

  // Step 3
  mainCategory?: string;
  title?: string;
  description?: string;
  estimatedDuration?: string;
  resultType?: string;
  difficulty?: 'laag' | 'gemiddeld' | 'hoog';

  // Step 4
  settings?: {
    resultPresentation?: {
      showToParent: boolean;
      format: 'visual_report' | 'text_summary' | 'score_only' | 'visual_report_with_cta';
      showChart: boolean;
      showParentalCta: boolean;
    };
    saveResultsToProfile?: boolean;
    coachIntegration?: {
      enabled: boolean;
      specializations: string[];
    };
    accessibility?: {
      isPublic: boolean;
      allowedPlans: string[];
    };
    schoolPartnerships?: {
      enabled: false,
      targetGroups: ('voortgezet_onderwijs' | 'speciaal_onderwijs' | 'zorgcoordinatoren')[];
    };
    contentModeration?: {
      required: boolean;
    };
    showRecommendedTools?: boolean;
  };
  thumbnailUrl?: string;

  // Step 5 (was 4)
  questions?: Partial<QuizAdminQuestion>[];

  // Linking context
  sourceBlogInfo?: { id: string; title: string; } | null;
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

const SESSION_STORAGE_DRAFT_KEY = 'quizCreatorDraft_v1';
const SESSION_STORAGE_LINKING_KEY = 'linking_context_blog';

const initialQuizData: QuizCreationState = {
    focusFlags: ['general'],
    mainCategory: undefined,
    title: "",
    description: "",
    estimatedDuration: "3-5 minuten (4-6 vragen)", // Updated default
    resultType: "ai-summary", // Updated default
    difficulty: 'gemiddeld', // Updated default
    settings: {
        resultPresentation: {
            showToParent: true,
            format: 'visual_report',
            showChart: true,
            showParentalCta: false,
        },
        saveResultsToProfile: true,
        coachIntegration: {
            enabled: true,
            specializations: [],
        },
        accessibility: {
            isPublic: false,
            allowedPlans: [],
        },
        schoolPartnerships: {
            enabled: false,
            targetGroups: [],
        },
        contentModeration: {
            required: true,
        },
        showRecommendedTools: true,
    },
    thumbnailUrl: "",
    sourceBlogInfo: null,
};


export const QuizCreatorProvider = ({ children }: { children: ReactNode }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<Record<number, boolean>>({});
  const [quizData, setQuizData] = useState<QuizCreationState>(initialQuizData);

  // Load state from sessionStorage on the client side after initial render
  useEffect(() => {
    try {
      const savedDraft = window.sessionStorage.getItem(SESSION_STORAGE_DRAFT_KEY);
      const linkingContext = window.sessionStorage.getItem(SESSION_STORAGE_LINKING_KEY);
      let draftData = {};
      let linkingData = {};

      if (savedDraft) {
        draftData = JSON.parse(savedDraft);
        window.sessionStorage.removeItem(SESSION_STORAGE_DRAFT_KEY);
      }
      if (linkingContext) {
        linkingData = { sourceBlogInfo: JSON.parse(linkingContext) };
        window.sessionStorage.removeItem(SESSION_STORAGE_LINKING_KEY);
      }
      
      setQuizData(prev => ({ ...prev, ...draftData, ...linkingData }));

    } catch (error) {
      console.error("Error reading from sessionStorage", error);
    }
  }, []);

  const setCompletedStep = (step: number, completed: boolean) => {
    setCompletedSteps(prev => ({
        ...prev,
        [step]: completed
    }));
  };

  const resetQuizCreator = () => {
    setCurrentStep(1);
    setCompletedSteps({});
    setQuizData(initialQuizData);
    if (typeof window !== 'undefined') {
        sessionStorage.removeItem(SESSION_STORAGE_DRAFT_KEY);
        sessionStorage.removeItem(SESSION_STORAGE_LINKING_KEY);
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
