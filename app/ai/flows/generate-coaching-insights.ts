'use server';
/**
 * @fileOverview Generates personalized daily coaching content based on onboarding quiz analysis.
 *
 * - generateCoachingInsights - A function that generates daily coaching content.
 */

import {ai} from '@//ai/genkit';
import {
  GenerateCoachingInsightsInputSchema,
  GenerateCoachingInsightsOutputSchema,
  type GenerateCoachingInsightsInput,
  type GenerateCoachingInsightsOutput
} from './generate-coaching-insights-types';


export async function generateCoachingInsights(
  input: GenerateCoachingInsightsInput
): Promise<GenerateCoachingInsightsOutput> {
  // Robust check at the entry point. This prevents the flow from being called with invalid data.
  // This is the definitive fix for the INVALID_ARGUMENT error that could cause spinners downstream.
  if (!input || !input.onboardingAnalysisText || input.onboardingAnalysisText.trim().length === 0) {
    console.warn("generateCoachingInsights called with invalid input. Returning default content from the wrapper function.");
    return {
      dailyAffirmation: "Elke dag is een nieuwe kans om te groeien.",
      dailyCoachingTip: "Neem vandaag een moment voor jezelf. Een korte wandeling of even rustig ademhalen kan al een groot verschil maken.",
      microTaskSuggestion: "Schrijf één ding op waar je vandaag trots op was."
    };
  }

  // Only call the flow if input is valid.
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
    // This flow can now assume it receives valid input because of the wrapper function.
    const {output} = await prompt(input);
    if (!output) {
        throw new Error('AI model did not return the expected daily coaching content structure.');
    }
    return output;
  }
);
