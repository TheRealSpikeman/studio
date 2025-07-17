// src/ai/flows/verify-quiz-questions-flow-types.ts
import { z } from 'genkit';

export const QuestionInputSchema = z.object({
  text: z.string().describe('The text of the quiz question.'),
  example: z.string().optional().describe('An optional example or clarification for the question.'),
});

export const VerifyQuizQuestionsInputSchema = z.object({
  quizTitle: z.string().describe('The title of the quiz.'),
  quizAudience: z.string().describe('The target audience for the quiz (e.g., "Tiener (12-14 jr, voor zichzelf)").'),
  quizCategory: z.string().describe('The category of the quiz (e.g., "Emoties & Gevoelens").'),
  questions: z.array(QuestionInputSchema).describe('The list of questions to be verified.'),
});
export type VerifyQuizQuestionsInput = z.infer<typeof VerifyQuizQuestionsInputSchema>;

export const SuggestionSchema = z.object({
  questionIndex: z.number().describe('The 0-based index of the question in the input array.'),
  originalText: z.string().describe('The original text of the question.'),
  issue: z.string().describe("A brief, clear description of the potential issue with the question (e.g., 'Ambiguous phrasing', 'Too complex for age group')."),
  suggestedRevision: z.string().describe('A concrete suggestion for a revised version of the question text.'),
});

export const VerifyQuizQuestionsOutputSchema = z.object({
  overallStatus: z.enum(['Goedgekeurd', 'Goedgekeurd met suggesties', 'Revisie nodig']).describe("An overall assessment of the quiz quality. 'Goedgekeurd' if all questions are fine. 'Goedgekeurd met suggesties' if there are minor issues. 'Revisie nodig' if there are significant issues."),
  overallFeedback: z.string().describe("A concise summary (2-3 sentences) of the overall quality, tone, and suitability of the quiz questions for the target audience."),
  suggestions: z.array(SuggestionSchema).describe("A list of specific suggestions for questions that could be improved. This array should be empty if the overallStatus is 'Goedgekeurd'.")
});
export type VerifyQuizQuestionsOutput = z.infer<typeof VerifyQuizQuestionsOutputSchema>;
