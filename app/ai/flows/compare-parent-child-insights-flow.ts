'use server';
/**
 * @fileOverview A Genkit flow for comparing parent's observations with a child's self-reflection
 * and generating parenting advice.
 *
 * - compareParentChildInsights - A function that handles the comparison and advice generation.
 */

import {ai} from '@/ai/genkit';
import {
  CompareParentChildInputSchema,
  CompareParentChildOutputSchema,
  type CompareParentChildInput,
  type CompareParentChildOutput,
} from './compare-parent-child-insights-types';

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
Jouw taak is om deze twee perspectieven te vergelijken en de ouder constructief, praktisch en begripvol advies te geven voor betere communicatie en ondersteuning, resulterend in een rapport zoals het voorbeeld dat de gebruiker heeft gezien. Beide perspectieven zijn waardevol.

OUDER PERSPECTIEF (antwoorden uit "Ken je Kind" quiz):
{{#each parentObservations}}
- Vraag: "{{this.question}}" | Antwoord: "{{this.answer}}"
{{/each}}

KIND PERSPECTIEF (antwoorden uit "Zelfreflectie" tool):
{{#each childSelfReflection}}
- Vraag: "{{this.question}}" | Antwoord: "{{this.answer}}"
{{/each}}


ANALYSE FRAMEWORK (structureer je output als volgt, gebruik Markdown voor opmaak: ## voor kopjes, * voor lijstjes):

## 1. Perceptie Gaten: Waar Zien Jullie Dingen Anders?
* Identificeer 3-4 specifieke punten waar de observaties van de ouder en de zelfreflectie van {{{childName}}} significant verschillen.
* Geef voor elk verschil een korte, duidelijke uitleg van beide kanten, inclusief mogelijke verklaringen (bijv. tussen haakjes of als 'Mogelijkheid: ...').
* Wees hierbij voorzichtig en oordeel niet. Focus op het signaleren van mogelijke verschillende belevingen. Geen schuldtoewijzing.

## 2. Gedeelde Sterktes: Wat Zien Jullie Beiden Positief?
* Benoem 3 belangrijke punten waar de ouder en {{{childName}}} het eens zijn over krachten of positieve eigenschappen, met concrete voorbeelden van beide perspectieven.
* Hoe kunnen deze gedeelde inzichten ingezet worden om {{{childName}}} verder te ondersteunen? Geef praktische tips.

## 3. Blinde Vlekken: Wat Mist Mogelijk Eén Partij?
* Identificeer 2 punten die de ouder of {{{childName}}} mogelijk over het hoofd ziet, gebaseerd op de input van de ander.
* Formuleer dit als reflectiepunten voor de ouder, niet als beschuldigingen.

## 4. Communicatie Kansen: Hoe Beter Afstemmen?
* Geef 3-5 concrete tips hoe de ouder het gesprek hierover open en constructief kan aangaan met {{{childName}}}.
* Geef voorbeelden van exacte gespreksopeners die de ouder kan stellen (focus op vragen stellen, niet op zeggen wat de ouder vindt, bijv. "Ik merk X, hoe ervaar jij dat?" of "Kun je me meer vertellen over Y?").
* Focus op het bouwen van een brug en wederzijds begrip.

## 5. Familie Actieplan: Concreet & Haalbaar
* Geef 2-3 direct toepasbare en haalbare acties die het gezin kan ondernemen, met herkenbare namen voor de 'tools' of methodes (bijv. 'Focus Plan', 'Prikkel Thermometer').
* Focus op positieve verandering, het versterken van de relatie, en het ondersteunen van {{{childName}}} op een manier die bij hen past. Geen vaag advies.

## 6. Belangrijke Overwegingen
* Herinner de ouder eraan dat dit inzichten zijn en geen diagnoses.
* Benadruk het belang van open, geduldige en liefdevolle communicatie met {{{childName}}}.
* Adviseer om bij aanhoudende zorgen of grote verschillen professioneel advies in te winnen (bijv. via MindNavigator coaches of externe hulp).

TONE: Begripvol, optimistisch, praktisch. Wees niet beschuldigend.
FOCUS: Familie-specifieke tips. Vermijd het direct labelen van gedrag als 'slecht' of 'goed'; focus op de beleving en functie van het gedrag.
OUTPUT FORMAT: Zorg voor concrete tools en haalbare acties in het actieplan.
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
