
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
  parentObservations: z.string().describe("A summary of the parent's observations from the 'Ken je Kind' quiz, focusing on perceived strengths and challenges. Dit representeert de 'OUDER PERSPECTIEF' input."),
  childSelfReflection: z.string().describe("A summary of the child's self-reflection from their 'Zelfreflectie Tool', highlighting recognized traits and experiences. Dit representeert de 'KIND PERSPECTIEF' input."),
});
export type CompareParentChildInput = z.infer<typeof CompareParentChildInputSchema>;

const CompareParentChildOutputSchema = z.object({
  parentingAdvice: z.string().describe("AI-generated advice for the parent, structured according to the ANALYSE FRAMEWORK, including sections on perception gaps, shared strengths, blind spots, communication opportunities, and actionable family tips. The advice should be empathetic, constructive, and actionable."),
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
  prompt: `
CONTEXT: Je bent een ervaren kinderpsycholoog en gezinscoach, gespecialiseerd in neurodiversiteit bij tieners (leeftijd {{{childAgeGroup}}}).
Een ouder heeft observaties over hun kind, {{{childName}}}, gedeeld. Het kind, {{{childName}}}, heeft ook een zelfreflectie gedaan.
Jouw taak is om deze twee perspectieven te vergelijken en de ouder constructief, praktisch en begripvol advies te geven voor betere communicatie en ondersteuning.

OUDER PERSPECTIEF (samenvatting van ouder-input):
{{{parentObservations}}}

KIND PERSPECTIEF (samenvatting van kind-input):
{{{childSelfReflection}}}

ANALYSE FRAMEWORK (structureer je output als volgt, gebruik Markdown voor opmaak: ## voor kopjes, * voor lijstjes):

## 1. Perceptie Gaten: Waar Zien Jullie Dingen Anders?
* Identificeer 3-5 specifieke punten waar de observaties van de ouder en de zelfreflectie van {{{childName}}} significant verschillen.
* Wees hierbij voorzichtig en oordeel niet. Focus op het signaleren van mogelijke verschillende belevingen (bijv. ouder ziet een probleem waar {{{childName}}} een neutrale eigenschap ervaart, of andersom).
* Geef voor elk verschil een korte, duidelijke uitleg van beide kanten.

## 2. Gedeelde Sterktes: Wat Zien Jullie Beiden Positief?
* Benoem 3-5 belangrijke punten waar de ouder en {{{childName}}} het eens zijn over krachten of positieve eigenschappen.
* Hoe kunnen deze gedeelde inzichten ingezet worden om {{{childName}}} verder te ondersteunen?

## 3. Blinde Vlekken: Wat Mist Mogelijk Eén Partij?
* Identificeer 2-3 punten die de ouder of {{{childName}}} mogelijk over het hoofd ziet, gebaseerd op de input van de ander.
* Bijvoorbeeld: Ziet de ouder een specifieke behoefte van {{{childName}}} niet? Of erkent {{{childName}}} een zorg van de ouder niet?
* Formuleer dit als reflectiepunten, niet als beschuldigingen.

## 4. Communicatie Kansen: Hoe Beter Afstemmen?
* Geef 3-5 concrete tips hoe de ouder het gesprek hierover open en constructief kan aangaan met {{{childName}}}.
* Moedig aan om te vragen naar de beleving van {{{childName}}}.
* Geef voorbeelden van openende vragen die de ouder kan stellen (bijv. "Ik merk dat..., hoe ervaar jij dat?").
* Focus op het bouwen van een brug en wederzijds begrip.

## 5. Familie Actieplan: Concreet & Haalbaar
* Geef 2-3 direct toepasbare en haalbare acties die het gezin kan ondernemen.
* Focus op positieve verandering, het versterken van de relatie, en het ondersteunen van {{{childName}}} op een manier die bij hen past.
* Voorbeelden: een wekelijks check-in moment, een gezamenlijke activiteit rond een gedeelde interesse, een nieuwe afspraak over huiswerk.

## 6. Belangrijke Overwegingen
* Herinner de ouder eraan dat dit inzichten zijn en geen diagnoses.
* Benadruk het belang van open, geduldige en liefdevolle communicatie met {{{childName}}}.
* Adviseer om bij aanhoudende zorgen of grote verschillen professioneel advies in te winnen (bijv. via MindNavigator coaches of externe hulp).

TONE: Wees begripvol, optimistisch en praktisch. Gebruik heldere taal zonder jargon.
FOCUS: Geef familie-specifieke tips, geen generieke adviezen. Het doel is de ouder-kind relatie te versterken en een ondersteunende thuisomgeving te creëren.
Vermijd het direct labelen van gedrag als 'slecht' of 'goed'; focus op de beleving en functie van het gedrag.
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

