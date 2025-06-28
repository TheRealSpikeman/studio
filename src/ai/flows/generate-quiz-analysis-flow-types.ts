// src/ai/flows/generate-quiz-analysis-flow-types.ts
import {z} from 'genkit';

export const AnsweredQuestionSchema = z.object({
  question: z.string().describe('The text of the quiz question.'),
  answer: z.string().describe('The textual representation of the user_s chosen answer, possibly including the numeric value like "Vaak (3)".'),
  profileKey: z.string().optional().describe('The neurodiversity profile key this question primarily relates to (e.g., ADD, HSP), if applicable.'),
});

export const GenerateQuizAnalysisInputSchema = z.object({
  quizTitle: z.string().describe('The title of the quiz.'),
  ageGroup: z.string().describe('The target age group of the user (e.g., "12-14 jaar", "15-18 jaar").'),
  finalScores: z.record(z.number()).describe('A record of final scores for each neurodiversity profile, where keys are profile IDs (e.g., ADD, HSP) and values are numeric scores (typically 1-4).'),
  answeredQuestions: z.array(AnsweredQuestionSchema).describe('An array of questions the user answered, including the question text and their chosen answer text.'),
  analysisDetailLevel: z.enum(['beknopt', 'standaard', 'uitgebreid']).optional().describe("Specificeert het gewenste detailniveau voor de analyse. 'standaard' is de default.")
});
export type GenerateQuizAnalysisInput = z.infer<typeof GenerateQuizAnalysisInputSchema>;

export const GenerateQuizAnalysisOutputSchema = z.object({
  analysis: z.string().describe('A comprehensive textual analysis of the quiz results, tailored to the user_s age and answers, and het gekozen detailniveau.'),
});
export type GenerateQuizAnalysisOutput = z.infer<typeof GenerateQuizAnalysisOutputSchema>;
