'use server';
/**
 * @fileOverview A Genkit flow for generating AI-powered analysis of quiz results.
 *
 * - generateQuizAnalysis - A function that handles the AI quiz result analysis process.
 * - GenerateQuizAnalysisInput - The input type for the generateQuizAnalysis function.
 * - GenerateQuizAnalysisOutput - The return type for the generateQuizAnalysis function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnsweredQuestionSchema = z.object({
  question: z.string().describe('The text of the quiz question.'),
  answer: z.string().describe('The textual representation of the user_s chosen answer, possibly including the numeric value like "Vaak (3)".'),
  profileKey: z.string().optional().describe('The neurodiversity profile key this question primarily relates to (e.g., ADD, HSP), if applicable.'),
});

const GenerateQuizAnalysisInputSchema = z.object({
  quizTitle: z.string().describe('The title of the quiz.'),
  ageGroup: z.string().describe('The target age group of the user (e.g., "12-14 jaar", "15-18 jaar").'),
  finalScores: z.record(z.number()).describe('A record of final scores for each neurodiversity profile, where keys are profile IDs (e.g., ADD, HSP) and values are numeric scores (typically 1-4).'),
  answeredQuestions: z.array(AnsweredQuestionSchema).describe('An array of questions the user answered, including the question text and their chosen answer text.'),
  analysisDetailLevel: z.enum(['beknopt', 'standaard', 'uitgebreid']).optional().describe("Specificeert het gewenste detailniveau voor de analyse. 'standaard' is de default.")
});
export type GenerateQuizAnalysisInput = z.infer<typeof GenerateQuizAnalysisInputSchema>;

const GenerateQuizAnalysisOutputSchema = z.object({
  analysis: z.string().describe('A comprehensive textual analysis of the quiz results, tailored to the user_s age and answers, and het gekozen detailniveau.'),
});
export type GenerateQuizAnalysisOutput = z.infer<typeof GenerateQuizAnalysisOutputSchema>;

// Define een type voor de input van de prompt-functie zelf, inclusief de dynamische instructies.
// Dit is intern aan de flow.
const PromptInternalInputSchema = GenerateQuizAnalysisInputSchema.extend({
  analysisInstructions: z.string().optional(),
});
type PromptInternalInput = z.infer<typeof PromptInternalInputSchema>;


export async function generateQuizAnalysis(
  input: GenerateQuizAnalysisInput
): Promise<GenerateQuizAnalysisOutput> {
  // Robust validation at the entry point to prevent calling the flow with invalid data.
  if (!input || !input.finalScores || Object.keys(input.finalScores).length === 0 || !input.answeredQuestions || input.answeredQuestions.length === 0) {
    console.warn("generateQuizAnalysis called with invalid or empty input. Returning default analysis.", input);
    return {
      analysis: `## Analyse Onvolledig

We konden geen analyse genereren omdat er onvoldoende gegevens beschikbaar waren. Dit kan gebeuren als de quiz niet volledig is ingevuld of als er een fout is opgetreden.

**Wat nu?**
* Probeer de quiz opnieuw te doen.
* Als het probleem aanhoudt, neem dan contact op met support en vermeld de quiz die je deed.
`
    };
  }
  return generateQuizAnalysisFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateQuizAnalysisPrompt',
  input: {schema: PromptInternalInputSchema}, // Gebruik het interne schema hier
  output: {schema: GenerateQuizAnalysisOutputSchema},
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
    {{#each finalScores}}
    - {{@key}}: {{{this}}}
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
Lijst 2-3 positieve sterke punten op basis van de antwoorden, gebruikmakend van bullet points (`* `). Frame ze als talenten of superkrachten en verbind ze aan concrete voorbeelden.
*Voorbeeld: "* Je vermogen om je intensief te focussen op een hobby die je interessant vindt (zoals aangegeven bij 'Sociale & Sensorische Voorkeuren') is een grote kracht. Dit kan je helpen om een expert te worden in iets wat je leuk vindt!"*

## Aandachtspunten
Lijst 2-3 uitdagingen op, geframed als 'groeikansen' of 'dingen om op te letten'. Wees zacht en constructief. Vermijd negatieve taal.
*Voorbeeld: "* De quiz laat zien dat je het soms lastig vindt om je te concentreren op taken die je minder boeien. Het is belangrijk om te weten dat je hier niet alleen in bent en dat er manieren zijn om hiermee om te gaan."*

## Tips voor Jou
Geef 3-4 concrete, praktische en direct toepasbare tips. Geef de tips creatieve, herkenbare namen.
*Voorbeeld: "* **De Focus Sprint:** Probeer eens te werken met een timer voor 20 minuten en neem daarna 5 minuten pauze. Dit kan helpen om taken minder overweldigend te maken."*

{{{analysisInstructions}}}
`,
});

const generateQuizAnalysisFlow = ai.defineFlow(
  {
    name: 'generateQuizAnalysisFlow',
    inputSchema: GenerateQuizAnalysisInputSchema, // De flow gebruikt het externe input schema
    outputSchema: GenerateQuizAnalysisOutputSchema,
  },
  async (input: GenerateQuizAnalysisInput) => {
    // Debug logging as requested
    console.log("=== GENKIT FLOW DEBUG ===");
    console.log("input.quizTitle:", input.quizTitle);
    console.log("input.ageGroup:", input.ageGroup);
    console.log("input.finalScores:", input.finalScores);
    console.log("input.answeredQuestions length:", input.answeredQuestions?.length);
    console.log("answeredQuestions:", JSON.stringify(input.answeredQuestions, null, 2));

    let analysisInstructions = "";
    switch (input.analysisDetailLevel) {
      case 'beknopt':
        analysisInstructions = "Houd de analyse beknopt en focus op de hoofdpunten, ongeveer 150 woorden.";
        break;
      case 'uitgebreid':
        analysisInstructions = "De analyse moet zeer gedetailleerd zijn (minstens 350-400 woorden), diep ingaan op nuances en meerdere voorbeelden of reflectiepunten per sectie bieden.";
        break;
      case 'standaard':
      default:
        analysisInstructions = "De analyse moet gedetailleerd zijn (minstens 250-300 woorden).";
        break;
    }
    
    const promptInput = { ...input, analysisInstructions };
    console.log("Calling prompt with:", JSON.stringify(promptInput, null, 2));

    // Roep de prompt aan met de originele input PLUS de gegenereerde instructies
    const {output} = await prompt(promptInput);
    if (!output) {
      throw new Error('AI did not return an analysis.');
    }
    return output;
  }
);
