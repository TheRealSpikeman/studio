
// src/ai/flows/generate-coaching-insights.ts
'use server';

/**
 * @fileOverview Generates personalized daily coaching content based on onboarding quiz analysis.
 *
 * - generateCoachingInsights - A function that generates daily coaching content.
 * - GenerateCoachingInsightsInput - The input type for the function.
 * - GenerateCoachingInsightsOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateCoachingInsightsInputSchema = z.object({
  onboardingAnalysisText: z
    .string()
    .describe('The AI-generated analysis text from the user\'s onboarding quiz/self-reflection tool. This provides context about the user\'s neurodiversity profile, strengths, and challenges.'),
  userName: z.string().optional().describe('The name of the user for personalization in the coaching content.'),
  currentDate: z.string().optional().describe('The current date (e.g., "maandag 1 januari") for context, if needed.')
});
export type GenerateCoachingInsightsInput = z.infer<
  typeof GenerateCoachingInsightsInputSchema
>;

const GenerateCoachingInsightsOutputSchema = z.object({
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

export async function generateCoachingInsights(
  input: GenerateCoachingInsightsInput
): Promise<GenerateCoachingInsightsOutput> {
  // The primary validation is now inside the flow itself, ensuring any call is safe.
  // This wrapper simply calls the flow.
  return generateCoachingInsightsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateDailyCoachingContentPrompt',
  input: {schema: GenerateCoachingInsightsInputSchema},
  output: {schema: GenerateCoachingInsightsOutputSchema},
  prompt: `Je bent een empathische en deskundige coach gespecialiseerd in neurodiversiteit bij tieners.
De gebruiker, {{#if userName}}{{{userName}}}{{else}}een tiener{{/if}}, heeft een zelfreflectie tool gedaan. Hun persoonlijke analyse is als volgt:
---
{{{onboardingAnalysisText}}}
---

Jouw taak is om voor vandaag, {{#if currentDate}}{{{currentDate}}}{{else}}vandaag{{/if}}, drie dingen te genereren:
1.  Een **dailyAffirmation**: Een korte, krachtige en positieve affirmatie (1-2 zinnen) die aansluit bij hun profiel of een algemeen thema van zelfacceptatie en groei. Maak het persoonlijk als de naam bekend is.
2.  Een **dailyCoachingTip**: Een concrete en praktische tip (2-3 zinnen) die relevant is voor de inzichten uit hun analyse. De tip moet hen helpen een aspect van hun neurodiversiteit beter te begrijpen of een strategie aanreiken voor een mogelijke uitdaging. Focus op empowerment.
3.  Een **microTaskSuggestion**: Een kleine, haalbare taak (1 zin) die ze vandaag kunnen doen, die aansluit bij de coaching tip of een algemeen welzijnsdoel. Het moet een gevoel van succes kunnen geven.

Voorbeelden (pas aan op basis van de analyse):
-   Affirmatie: "Ik omarm mijn unieke manier van denken en zie mijn creativiteit als een kracht." (Als analyse wijst op creativiteit)
-   Coaching Tip: "Als je merkt dat je focus verslapt, probeer dan de Pomodoro-techniek: werk 25 minuten geconcentreerd en neem dan 5 minuten pauze. Dit kan helpen je energie beter te verdelen." (Als analyse wijst op focusuitdagingen)
-   Microtaak: "Zet vandaag een timer voor één studieblok van 25 minuten en neem daarna bewust 5 minuten pauze."

Zorg dat de output direct bruikbaar en bemoedigend is voor de tiener.
`,
});

const generateCoachingInsightsFlow = ai.defineFlow(
  {
    name: 'generateDailyCoachingContentFlow',
    inputSchema: GenerateCoachingInsightsInputSchema,
    outputSchema: GenerateCoachingInsightsOutputSchema,
  },
  async input => {
    // Robust check to prevent calling the flow with empty or invalid input.
    // This is the definitive fix for the INVALID_ARGUMENT error.
    if (!input || !input.onboardingAnalysisText || input.onboardingAnalysisText.trim().length === 0) {
      console.warn("generateCoachingInsightsFlow called with invalid input. Returning default content from within the flow.");
      return {
        dailyAffirmation: "Elke dag is een nieuwe kans om te groeien.",
        dailyCoachingTip: "Neem vandaag een moment voor jezelf. Een korte wandeling of even rustig ademhalen kan al een groot verschil maken.",
        microTaskSuggestion: "Schrijf één ding op waar je vandaag trots op was."
      };
    }

    const {output} = await prompt(input);
    if (!output) {
        throw new Error('AI model did not return the expected daily coaching content structure.');
    }
    return output;
  }
);
