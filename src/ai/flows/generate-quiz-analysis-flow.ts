'use server';
/**
 * @fileOverview A Genkit flow for generating AI-powered analysis of quiz results.
 *
 * - generateQuizAnalysis - A function that handles the AI quiz result analysis process.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {
  GenerateQuizAnalysisInputSchema,
  GenerateQuizAnalysisOutputSchema,
  type GenerateQuizAnalysisInput,
  type GenerateQuizAnalysisOutput
} from './generate-quiz-analysis-flow-types';

// Helper function for default analysis text
function getDefaultAnalysis(): string {
  return `## Analyse Onvolledig

We konden geen analyse genereren omdat er onvoldoende gegevens beschikbaar waren. Dit kan gebeuren als de quiz niet volledig is ingevuld of als er een fout is opgetreden.

**Wat nu?**
* Probeer de quiz opnieuw te doen.
* Als het probleem aanhoudt, neem dan contact op met support en vermeld de quiz die je deed.`;
}

export async function generateQuizAnalysis(
  input: GenerateQuizAnalysisInput
): Promise<GenerateQuizAnalysisOutput> {
  // Input validation wrapper to prevent calling the flow with invalid data.
  if (!input) {
    console.error("No input provided to generateQuizAnalysis.");
    return { analysis: getDefaultAnalysis() };
  }
  
  if (!input.finalScores || typeof input.finalScores !== 'object' || Object.keys(input.finalScores).length === 0) {
    console.error("Invalid or empty finalScores in generateQuizAnalysis:", input.finalScores);
    return { analysis: getDefaultAnalysis() };
  }
  
  if (!input.answeredQuestions || !Array.isArray(input.answeredQuestions) || input.answeredQuestions.length === 0) {
    console.error("Invalid or empty answeredQuestions in generateQuizAnalysis:", input.answeredQuestions);
    return { analysis: getDefaultAnalysis() };
  }
  
  if (!input.ageGroup || !input.quizTitle) {
    console.error("Missing ageGroup or quizTitle in generateQuizAnalysis:", { ageGroup: input.ageGroup, quizTitle: input.quizTitle });
    return { analysis: getDefaultAnalysis() };
  }
  
  return generateQuizAnalysisFlow(input);
}

// New internal schema to make data iterable for Handlebars and add booleans
const PromptInternalInputSchema = GenerateQuizAnalysisInputSchema.extend({
  finalScoresArray: z.array(z.object({
    key: z.string(),
    value: z.number(),
  })),
  isDetailBeknopt: z.boolean(),
  isDetailStandaard: z.boolean(),
  isDetailUitgebreid: z.boolean(),
});

const prompt = ai.definePrompt({
    name: 'generateQuizAnalysisPrompt',
    input: { schema: PromptInternalInputSchema },
    output: { schema: GenerateQuizAnalysisOutputSchema },
    prompt: `CONTEXT: Je bent Dr. Florentine Sage, een GZ-psycholoog gespecialiseerd in neurodiversiteit bij adolescenten. Je analyseert de resultaten van een zelfreflectie-instrument voor een jongere in de leeftijdscategorie {{{ageGroup}}}. Je schrijfstijl is warm, empowerend, bemoedigend en makkelijk te begrijpen voor deze doelgroep.

BELANGRIJKE INSTRUCTIES:
1.  **GEEN MEDISCHE LABELS**: Gebruik **NOOIT** acroniemen zoals ADD, ADHD, ASS, HSP, of termen als 'stoornis'. Gebruik in plaats daarvan beschrijvende, neutrale thema's:
    *   'Aandacht & Focus' (voor ADD/ADHD gerelateerde vragen)
    *   'Energie & Impulsiviteit' (voor ADHD hyperactiviteit)
    *   'Prikkelverwerking & Empathie' (voor HSP)
    *   'Sociale & Sensorische Voorkeuren' (voor ASS)
    *   'Stemmings- & Zorgpatronen' (voor Angst/Depressie)
2.  **GEEN SCORES**: Toon **NOOIT** de numerieke scores (zoals "Score: 3.5") in je antwoord. Beschrijf de resultaten kwalitatief (bijv. "Je herkent duidelijk patronen van...", "Je lijkt een talent te hebben voor...").
3.  **GEEN DIAGNOSE**: Frame je analyse altijd als een inzicht in patronen en voorkeuren, **nooit** als een diagnose of medische uitspraak. Gebruik zinnen als "Je antwoorden laten zien dat...", "Je lijkt te herkennen dat...".
4.  **STRUCTUUR**: Structureer je output exact volgens de volgende Markdown-koppen: "## Jouw Profiel In Vogelvlucht", "## Sterke Kanten", "## Aandachtspunten", "## Tips voor Jou".
5.  **TOON**: Schrijf direct tegen de jongere ('jij' en 'jouw'). Wees positief en focus op sterktes en groeimogelijkheden.

ANALYSEER DE VOLGENDE DATA:
-   Quiz Titel: {{{quizTitle}}}
-   Leeftijdsgroep: {{{ageGroup}}}
-   Scores per Thema (ALLEEN VOOR JOUW INTERNE ANALYSE, NIET TONEN):
{{#each finalScoresArray}}
    - {{this.key}}: {{this.value}}
{{/each}}
-   Gegeven Antwoorden:
{{#each answeredQuestions}}
    - Vraag over "{{this.profileKey}}": "{{this.question}}" - Antwoord: "{{this.answer}}"
{{/each}}

OUTPUT FORMAT:

## Jouw Profiel In Vogelvlucht
Begin met een korte, algemene en bemoedigende introductie. Vat daarna per relevant thema (zie de thema's hierboven) in een paar zinnen samen wat de antwoorden suggereren. Focus op het normaliseren van de ervaring.
*Voorbeeld: "Aandacht & Focus: Je lijkt te herkennen dat je gedachten soms alle kanten op schieten. Dat is een teken van een creatief brein!"*

## Sterke Kanten
Lijst 2-3 positieve sterke punten op basis van de antwoorden, gebruikmakend van bullet points (\`* \`). Frame ze als talenten of superkrachten en verbind ze aan concrete voorbeelden.
*Voorbeeld: "* Je vermogen om je intensief te focussen op een hobby die je interessant vindt (zoals aangegeven bij 'Sociale & Sensorische Voorkeuren') is een grote kracht. Dit kan je helpen om een expert te worden in iets wat je leuk vindt!"*

## Aandachtspunten
Lijst 2-3 uitdagingen op, geframed als 'groeikansen' of 'dingen om op te letten'. Wees zacht en constructief. Vermijd negatieve taal.
*Voorbeeld: "* De quiz laat zien dat je het soms lastig vindt om je te concentreren op taken die je minder boeien. Het is belangrijk om te weten dat je hier niet alleen in bent en dat er manieren zijn om hiermee om te gaan."*

## Tips voor Jou
Geef 3-4 concrete, praktische en direct toepasbare tips. Geef de tips creatieve, herkenbare namen.
*Voorbeeld: "* **De Focus Sprint:** Probeer eens te werken met een timer voor 20 minuten en neem daarna 5 minuten pauze. Dit kan helpen om taken minder overweldigend te maken."*

{{#if analysisInstructions}}{{{analysisInstructions}}}{{/if}}
{{#if analysisDetailLevel}}
{{#if isDetailBeknopt}}Houd de analyse beknopt en focus op de hoofdpunten, ongeveer 150 woorden.{{/if}}
{{#if isDetailStandaard}}De analyse moet gedetailleerd zijn (minstens 250-300 woorden).{{/if}}
{{#if isDetailUitgebreid}}De analyse moet zeer gedetailleerd zijn (minstens 350-400 woorden), diep ingaan op nuances en meerdere voorbeelden of reflectiepunten per sectie bieden.{{/if}}
{{else}}
De analyse moet gedetailleerd zijn (minstens 250-300 woorden).
{{/if}}
`,
});

const generateQuizAnalysisFlow = ai.defineFlow(
  {
    name: 'generateQuizAnalysisFlow',
    inputSchema: GenerateQuizAnalysisInputSchema,
    outputSchema: GenerateQuizAnalysisOutputSchema,
  },
  async (input: GenerateQuizAnalysisInput) => {
    // Transform the finalScores record into an array for Handlebars iteration
    const finalScoresArray = Object.entries(input.finalScores).map(([key, value]) => ({ key, value }));

    const promptInput = {
      ...input,
      finalScoresArray,
      isDetailBeknopt: input.analysisDetailLevel === 'beknopt',
      isDetailStandaard: input.analysisDetailLevel === 'standaard',
      isDetailUitgebreid: input.analysisDetailLevel === 'uitgebreid',
    };

    const { output } = await prompt(promptInput);

    if (!output) {
      throw new Error('AI did not return an analysis.');
    }
    
    return output;
  }
);
