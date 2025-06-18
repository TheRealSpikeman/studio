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

// Updated QuizAudience type
export type QuizAudience = 
  | 'Tiener (12-14 jr, voor zichzelf)' 
  | 'Tiener (15-18 jr, voor zichzelf)' 
  | 'Volwassene (18+, voor zichzelf)' 
  | 'Algemeen (alle leeftijden, voor zichzelf)'
  | 'Ouder (over kind 6-11 jr)'
  | 'Ouder (over kind 12-14 jr)'
  | 'Ouder (over kind 15-18 jr)';

export type QuizCategory = 'Basis' | 'ADD' | 'ADHD' | 'HSP' | 'ASS' | 'AngstDepressie' | 'Thema' | 'Ouder Observatie'; // Added Ouder Observatie
export type QuizStatusAdmin = 'concept' | 'published';

export interface QuizSubtestConfig {
  subtestId: string; // e.g., 'ADD', 'HSP' that maps to a QuizCategory
  threshold: number; // Score needed on parent quiz to trigger this subtest
}

export interface QuizAdmin {
  id: string; // UUID
  title: string;
  description: string;
  audience: QuizAudience[];
  category: QuizCategory;
  status: QuizStatusAdmin;
  questions: QuizAdminQuestion[];
  subtestConfigs?: QuizSubtestConfig[]; // For basis quizzes that lead to subtests
  slug?: string;
  metaTitle?: string;
  metaDescription?: string;
  thumbnailUrl?: string;
  lastUpdatedAt: string; // ISO date string
  createdAt: string; // ISO date string
}
