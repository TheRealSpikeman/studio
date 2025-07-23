import { z } from 'zod';

export const QuizAnalysisInputSchema = z.object({
  quizId: z.string(),
  userId: z.string(),
  quizTitle: z.string(),
  answeredQuestions: z.array(z.any()),
  finalScores: z.record(z.string(), z.number()).optional(),
  resultType: z.enum(['score_based', 'personality-4-types', 'open_ended']),
  personalityTypeResult: z.string().optional(),
  quizAudience: z.string(),
});

export const QuizAnalysisOutputSchema = z.object({
  summary: z.string(),
  strengths: z.array(z.string()),
  recommendations: z.array(z.string()),
});

export type QuizAnalysisInput = z.infer<typeof QuizAnalysisInputSchema>;
export type QuizAnalysisOutput = z.infer<typeof QuizAnalysisOutputSchema>;
