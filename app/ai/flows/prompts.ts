// app/ai/flows/prompts.ts
import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import {
  QuizAnalysisInputSchema,
  QuizAnalysisOutputSchema,
} from './generate-quiz-analysis-flow-types';

export const defaultAnalysisPrompt = ai.definePrompt({
    name: 'defaultAnalysisPrompt',
    input: { schema: QuizAnalysisInputSchema },
    output: { schema: QuizAnalysisOutputSchema },
    prompt: `Analyze the quiz results and provide a summary.`,
});

export const parentAnalysisPrompt = ai.definePrompt({
    name: 'parentAnalysisPrompt',
    input: { schema: QuizAnalysisInputSchema },
    output: { schema: QuizAnalysisOutputSchema },
    prompt: `Analyze the quiz results from a parent's perspective and provide a summary.`,
});

export const personalityAnalysisPrompt = ai.definePrompt({
    name: 'personalityAnalysisPrompt',
    input: { schema: QuizAnalysisInputSchema },
    output: { schema: QuizAnalysisOutputSchema },
    prompt: `Analyze the personality quiz results and provide a summary.`,
});

export const mostRelevantToolPrompt = ai.definePrompt({
    name: 'mostRelevantToolPrompt',
    input: { schema: z.object({ analysis: z.string() }) },
    output: { schema: z.object({ toolId: z.string() }) },
    prompt: `Based on the analysis, suggest the most relevant tool.`,
});
