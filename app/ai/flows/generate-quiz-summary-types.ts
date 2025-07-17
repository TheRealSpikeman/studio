// src/ai/flows/generate-quiz-summary-types.ts
import {z} from 'genkit';

export const GenerateQuizSummaryInputSchema = z.object({
  quizResults: z.string().describe('A JSON string representing the quiz results.'),
});
export type GenerateQuizSummaryInput = z.infer<typeof GenerateQuizSummaryInputSchema>;

export const GenerateQuizSummaryOutputSchema = z.object({
  summary: z.string().describe('A summary of the user\u0027s neurodiversity profile based on their quiz results.'),
});
export type GenerateQuizSummaryOutput = z.infer<typeof GenerateQuizSummaryOutputSchema>;
