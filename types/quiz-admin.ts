// src/types/quiz-admin.ts
export type QuizAnswerOptionValue = 1 | 2 | 3 | 4; // Nooit, Soms, Vaak, Altijd

export interface QuizAdminQuestionOption {
  text: string;
  value: QuizAnswerOptionValue;
}

export interface QuizAdminQuestion {
  id: string; // UUID
  text: string;
  // For simplicity, assume fixed options for now (Nooit, Soms, Vaak, Altijd)
  // options?: QuizAdminQuestionOption[]; // If options can vary per question
  example?: string; // Optional example/clarification
  weight?: number; // New: For weighted scoring (e.g., 1, 2, 3)
}

// ---- SINGLE SOURCE OF TRUTH FOR AUDIENCE ----
export type QuizAudience = 
  | 'Tiener (12-14 jr, voor zichzelf)' 
  | 'Tiener (15-18 jr, voor zichzelf)' 
  | 'Volwassene (18+, voor zichzelf)' 
  | 'Algemeen (alle leeftijden, voor zichzelf)'
  | 'Ouder (over kind 12-14 jr)'
  | 'Ouder (over kind 15-18 jr)';

export const audienceOptions: { id: QuizAudience; label: string }[] = [
  { id: 'Tiener (12-14 jr, voor zichzelf)', label: 'Tiener (12-14 jr, voor zichzelf)' },
  { id: 'Tiener (15-18 jr, voor zichzelf)', label: 'Tiener (15-18 jr, voor zichzelf)' },
  { id: 'Volwassene (18+, voor zichzelf)', label: 'Volwassene (18+, voor zichzelf)' },
  { id: 'Algemeen (alle leeftijden, voor zichzelf)', label: 'Algemeen (alle leeftijden, voor zichzelf)' },
  { id: 'Ouder (over kind 12-14 jr)', label: 'Ouder (over kind 12-14 jr)' },
  { id: 'Ouder (over kind 15-18 jr)', label: 'Ouder (over kind 15-18 jr)' },
];
// ---- END OF SINGLE SOURCE OF TRUTH ----

export type QuizCategory = string;

// ---- SINGLE SOURCE OF TRUTH FOR CATEGORIES ----
export const categoryOptions: { id: QuizCategory; label: string }[] = [
  { id: 'Basis', label: 'Basis Zelfreflectie (Kind/Tiener)' },
  { id: 'Thema', label: 'Thematische Quiz (Kind/Tiener)' },
  { id: 'Ouder Observatie', label: 'Ouder Observatie (Ken je Kind)' },
  { id: 'ADD', label: 'Subtest: ADD Kenmerken' },
  { id: 'ADHD', label: 'Subtest: ADHD Kenmerken' },
  { id: 'HSP', label: 'Subtest: HSP Kenmerken' },
  { id: 'ASS', label: 'Subtest: ASS Kenmerken' },
  { id: 'AngstDepressie', label: 'Subtest: Angst/Depressie Kenmerken' },
  { id: 'emoties_gevoelens', label: 'Emoties & Gevoelens' },
  { id: 'vriendschappen_sociaal', label: 'Vriendschappen & Sociaal' },
  { id: 'leren_school', label: 'Leren & School' },
  { id: 'prikkels_omgeving', label: 'Prikkels & Omgeving' },
  { id: 'wie_ben_ik', label: 'Wie ben ik?' },
  { id: 'dromen_toekomst', label: 'Dromen & Toekomst' },
];

export const getCategoryLabel = (categoryId: string): string => {
  const option = categoryOptions.find(opt => opt.id === categoryId);
  return option ? option.label : categoryId;
};
// ---- END OF SINGLE SOURCE OF TRUTH ----


export type QuizStatusAdmin = 'concept' | 'published';
export type AnalysisDetailLevel = 'beknopt' | 'standaard' | 'uitgebreid';

export interface QuizSubtestConfig {
  subtestId: string; // e.g., 'ADD', 'HSP' that maps to a QuizCategory
  threshold: number; // Score needed on parent quiz to trigger this subtest
}

export interface QuizAdmin {
  id: string; // UUID
  title: string;
  description: string;
  descriptionForParent?: string; // NEW: Parent-specific description
  audience: QuizAudience;
  category: QuizCategory;
  status: QuizStatusAdmin;
  questions: QuizAdminQuestion[];
  focusFlags?: string[];
  subtestConfigs?: QuizSubtestConfig[]; // For basis quizzes that lead to subtests
  slug?: string;
  metaTitle?: string;
  metaDescription?: string;
  thumbnailUrl?: string;
  lastUpdatedAt: string; // ISO date string
  createdAt: string; // ISO date string
  
  // Settings object to align with creator context
  settings?: {
    resultPresentation?: {
      showToParent: boolean;
      format: 'visual_report' | 'text_summary' | 'score_only' | 'visual_report_with_cta';
      showChart?: boolean; // Nieuw
      showParentalCta?: boolean; // Nieuw
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
      enabled: boolean;
      targetGroups: ('voortgezet_onderwijs' | 'speciaal_onderwijs' | 'zorgcoordinatoren')[];
    };
    contentModeration?: {
      required: boolean;
    };
    showRecommendedTools?: boolean;
    analysisDetailLevel?: AnalysisDetailLevel;
    analysisInstructions?: string;
    difficulty?: 'laag' | 'gemiddeld' | 'hoog'; // Added from Step3 content
    estimatedDuration?: string; // Added from Step3 content
  };
}
