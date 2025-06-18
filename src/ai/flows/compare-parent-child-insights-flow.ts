
'use server';
/**
 * @fileOverview A Genkit flow for comparing parent's observations with a child's self-reflection
 * and generating parenting advice.
 *
 * - compareParentChildInsights - A function that handles the comparison and advice generation.
 * - CompareParentChildInput - The input type for the function.
 * - CompareParentChildOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CompareParentChildInputSchema = z.object({
  childName: z.string().describe("The name of the child for personalization in the advice."),
  childAgeGroup: z.string().describe("The age group of the child (e.g., '12-14 jaar', '15-18 jaar') to contextualize the advice."),
  parentObservations: z.string().describe("A summary of the parent's observations from the 'Ken je Kind' quiz, focusing on perceived strengths and challenges."),
  childSelfReflection: z.string().describe("A summary of the child's self-reflection from their 'Zelfreflectie Tool', highlighting recognized traits and experiences."),
});
export type CompareParentChildInput = z.infer<typeof CompareParentChildInputSchema>;

const CompareParentChildOutputSchema = z.object({
  parentingAdvice: z.string().describe("AI-generated advice for the parent, including sections on agreements, differences, conversation starters, and support strategies. The advice should be empathetic, constructive, and actionable."),
});
export type CompareParentChildOutput = z.infer<typeof CompareParentChildOutputSchema>;

export async function compareParentChildInsights(
  input: CompareParentChildInput
): Promise<CompareParentChildOutput> {
  return compareParentChildInsightsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'compareParentChildInsightsPrompt',
  input: {schema: CompareParentChildInputSchema},
  output: {schema: CompareParentChildOutputSchema},
  prompt: `Je bent een ervaren kinderpsycholoog en gezinscoach, gespecialiseerd in neurodiversiteit bij tieners (leeftijd {{{childAgeGroup}}}).
Een ouder heeft observaties over hun kind, {{{childName}}}, gedeeld. Het kind, {{{childName}}}, heeft ook een zelfreflectie gedaan.
Jouw taak is om deze twee perspectieven te vergelijken en de ouder constructief advies te geven.

Observaties van de ouder:
{{parentObservations}}

Zelfreflectie van {{{childName}}}:
{{childSelfReflection}}

Genereer een advies voor de ouder. Structureer het advies in de volgende secties, gebruik Markdown voor opmaak (## voor kopjes, * voor lijstjes):

## Overeenkomsten in Zicht
* Identificeer en benoem de belangrijkste punten waar de observaties van de ouder en de zelfreflectie van {{{childName}}} overeenkomen.
* Wat zien jullie beiden als een kracht of een uitdaging?

## Verschillen in Perceptie
* Waar ziet de ouder iets anders dan {{{childName}}}? (Bijvoorbeeld: ouder ziet een probleem waar {{{childName}}} een neutrale eigenschap of zelfs een kracht ervaart, of andersom).
* Wees hierbij voorzichtig en oordeel niet. Focus op het signaleren van mogelijke verschillende belevingen.

## Gesprekstips met {{{childName}}}
* Geef concrete tips hoe de ouder het gesprek hierover open en constructief kan aangaan met {{{childName}}}.
* Moedig aan om te vragen naar de beleving van {{{childName}}}.
* Voorbeeld vragen die de ouder kan stellen.

## Strategieën voor Ondersteuning
* Geef 2-3 concrete en praktische tips hoe de ouder {{{childName}}} kan ondersteunen, zowel thuis als eventueel richting school, gebaseerd op de gecombineerde inzichten.
* Focus op het versterken van de sterke kanten en het bieden van begrip en tools voor de uitdagingen.
* Houd rekening met de leeftijd ({{{childAgeGroup}}}).

## Belangrijke Overwegingen
* Herinner de ouder eraan dat dit inzichten zijn en geen diagnoses.
* Benadruk het belang van open communicatie en samenwerking met {{{childName}}}.
* Adviseer om bij aanhoudende zorgen of grote verschillen professioneel advies in te winnen (bijv. via MindNavigator coaches of externe hulp).

Gebruik een empathische, positieve en oplossingsgerichte toon. Vermijd jargon en maak het advies praktisch en direct toepasbaar voor de ouder.
Het doel is om begrip te vergroten en de ouder-kind relatie te versterken.
`,
});

const compareParentChildInsightsFlow = ai.defineFlow(
  {
    name: 'compareParentChildInsightsFlow',
    inputSchema: CompareParentChildInputSchema,
    outputSchema: CompareParentChildOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error('AI did not return parenting advice.');
    }
    return output;
  }
);
