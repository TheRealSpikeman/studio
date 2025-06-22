'use server';

/**
 * @fileOverview Generates a summary of the user's neurodiversity profile based on their quiz results.
 *
 * - generateQuizSummary - A function that generates the quiz summary.
 * - GenerateQuizSummaryInput - The input type for the generateQuizSummary function.
 * - GenerateQuizSummaryOutput - The return type for the generateQuizSummary function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateQuizSummaryInputSchema = z.object({
  quizResults: z.string().describe('A JSON string representing the quiz results.'),
});
export type GenerateQuizSummaryInput = z.infer<typeof GenerateQuizSummaryInputSchema>;

const GenerateQuizSummaryOutputSchema = z.object({
  summary: z.string().describe('A summary of the user\u0027s neurodiversity profile based on their quiz results.'),
});
export type GenerateQuizSummaryOutput = z.infer<typeof GenerateQuizSummaryOutputSchema>;

export async function generateQuizSummary(input: GenerateQuizSummaryInput): Promise<GenerateQuizSummaryOutput> {
  return generateQuizSummaryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateQuizSummaryPrompt',
  input: {schema: GenerateQuizSummaryInputSchema},
  output: {schema: GenerateQuizSummaryOutputSchema},
  prompt: `You are an AI assistant designed to provide summaries of neurodiversity quiz results.

  Based on the quiz results provided (in JSON format), generate a concise summary (approximately 100-150 words) that helps the user quickly understand their neurodiversity profile. Highlight key areas and potential traits indicated by the results.
  
  If the provided quiz results are minimal or don't provide enough information for a detailed summary, provide a general, encouraging summary about the value of self-reflection.

  Quiz Results JSON: {{{quizResults}}}
  `,
});

const generateQuizSummaryFlow = ai.defineFlow(
  {
    name: 'generateQuizSummaryFlow',
    inputSchema: GenerateQuizSummaryInputSchema,
    outputSchema: GenerateQuizSummaryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
