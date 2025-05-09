// src/ai/flows/generate-coaching-insights.ts
'use server';

/**
 * @fileOverview Generates personalized coaching insights based on quiz results.
 *
 * - generateCoachingInsights - A function that generates coaching insights.
 * - GenerateCoachingInsightsInput - The input type for the generateCoachingInsights function.
 * - GenerateCoachingInsightsOutput - The return type for the generateCoachingInsights function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateCoachingInsightsInputSchema = z.object({
  quizResults: z
    .string()
    .describe('The quiz results, as a stringified JSON.'),
  profileDescription: z.string().describe('A description of the user profile.'),
});
export type GenerateCoachingInsightsInput = z.infer<
  typeof GenerateCoachingInsightsInputSchema
>;

const GenerateCoachingInsightsOutputSchema = z.object({
  coachingInsights: z
    .string()
    .describe('Personalized coaching insights based on the quiz results.'),
});
export type GenerateCoachingInsightsOutput = z.infer<
  typeof GenerateCoachingInsightsOutputSchema
>;

export async function generateCoachingInsights(
  input: GenerateCoachingInsightsInput
): Promise<GenerateCoachingInsightsOutput> {
  return generateCoachingInsightsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateCoachingInsightsPrompt',
  input: {schema: GenerateCoachingInsightsInputSchema},
  output: {schema: GenerateCoachingInsightsOutputSchema},
  prompt: `You are an expert coach specializing in neurodiversity.

  Based on the quiz results and user profile, generate personalized coaching insights.

  Quiz Results: {{{quizResults}}}
  Profile Description: {{{profileDescription}}}

  Coaching Insights:`,
});

const generateCoachingInsightsFlow = ai.defineFlow(
  {
    name: 'generateCoachingInsightsFlow',
    inputSchema: GenerateCoachingInsightsInputSchema,
    outputSchema: GenerateCoachingInsightsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
