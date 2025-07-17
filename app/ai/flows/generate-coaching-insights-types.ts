// src/ai/flows/generate-coaching-insights-types.ts
import {z} from 'genkit';

export const GenerateCoachingInsightsInputSchema = z.object({
  onboardingAnalysisText: z
    .string()
    .describe('The AI-generated analysis text from the user\'s onboarding quiz/self-reflection tool. This provides context about the user\'s neurodiversity profile, strengths, and challenges.'),
  userName: z.string().optional().describe('The name of the user for personalization in the coaching content.'),
  currentDate: z.string().optional().describe('The current date (e.g., "maandag 1 januari") for context, if needed.')
});
export type GenerateCoachingInsightsInput = z.infer<
  typeof GenerateCoachingInsightsInputSchema
>;

export const GenerateCoachingInsightsOutputSchema = z.object({
  dailyAffirmation: z
    .string()
    .describe('A short, positive, and personalized affirmation for the day, ideally related to the user\'s profile insights.'),
  dailyCoachingTip: z
    .string()
    .describe('A concrete, actionable coaching tip for the day, derived from or relevant to the user\'s onboarding analysis. This should be practical and supportive.'),
  microTaskSuggestion: z
    .string()
    .describe('A small, achievable micro-task for the day that aligns with the coaching tip or user\'s profile, promoting a sense of accomplishment.')
});
export type GenerateCoachingInsightsOutput = z.infer<
  typeof GenerateCoachingInsightsOutputSchema
>;
