// types/index.ts

export * from './activity-log';
export * from './blog';
export * from './changelog';
export * from './content-hub';
export * from './dashboard';
export * from './feedback';
export * from './notification';
export * from './quiz-admin';
export * from './status';
export * from './subscription';
export * from './user';
export type { QuizResult } from './dashboard';


// New type for the pending report claim
export interface PendingReport {
  id?: string; // Firestore document ID
  email: string;
  claimToken: string;
  quizResult: QuizResult;
  expiresAt: Date; // For Firestore TTL
  createdAt: Date;
}
