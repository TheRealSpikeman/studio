// src/lib/quiz-data/dummy-quizzes.ts
import type { QuizAdmin } from '@/types/quiz-admin';

// This data is no longer used to rely on a single source of truth (localStorage).
// The array is kept to prevent import errors in the project, but it should not be used.
export const DUMMY_QUIZZES_DATA: QuizAdmin[] = [];
