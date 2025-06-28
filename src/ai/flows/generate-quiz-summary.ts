'use server';

/**
 * @fileOverview Generates a summary of the user's neurodiversity profile based on their quiz results.
 *
 * - generateQuizSummary - A function that generates the quiz summary.
 */

import {ai} from '@/ai/genkit';
import {
  GenerateQuizSummaryInputSchema,
  GenerateQuizSummaryOutputSchema,
  type GenerateQuizSummaryInput,
  type GenerateQuizSummaryOutput
} from './generate-quiz-summary-types';


export async function generateQuizSummary(input: GenerateQuizSummaryInput): Promise<GenerateQuizSummaryOutput> {
  if (!input || !input.quizResults) {
    return { summary: "Bedankt voor het invullen van de quiz! Zelfreflectie is een belangrijke stap in persoonlijke groei." };
  }
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
    if (!output || !output.summary || output.summary.trim().length === 0) {
      return { summary: "Bedankt voor het invullen van de quiz! Zelfreflectie is een belangrijke stap in persoonlijke groei. Op basis van de antwoorden kan er geen gedetailleerde samenvatting worden gemaakt, maar het invullen zelf is al waardevol." };
    }
    return output;
  }
);
