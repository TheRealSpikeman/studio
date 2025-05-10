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

export type QuizAudience = '12-14' | '15-18' | 'adult' | 'all';
export type QuizCategory = 'Basis' | 'ADD' | 'ADHD' | 'HSP' | 'ASS' | 'AngstDepressie' | 'Thema';
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
  // Conceptual fields for AI generation context, not directly stored yet unless needed for display
  // difficultyLevel?: 'laag' | 'gemiddeld' | 'hoog';
  // weightingScheme?: string; 
}

