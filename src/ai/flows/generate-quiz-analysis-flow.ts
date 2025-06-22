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
  console.log("=== ANALYSIS INPUT VALIDATION ===");
  console.log("Received input:", JSON.stringify(input, null, 2));

  if (!input) {
    console.error("No input provided");
    return { analysis: getDefaultAnalysis() };
  }
  
  if (!input.finalScores || typeof input.finalScores !== 'object' || Object.keys(input.finalScores).length === 0) {
    console.error("Invalid or empty finalScores:", input.finalScores);
    return { analysis: getDefaultAnalysis() };
  }
  
  if (!input.answeredQuestions || !Array.isArray(input.answeredQuestions) || input.answeredQuestions.length === 0) {
    console.error("Invalid or empty answeredQuestions:", input.answeredQuestions);
    return { analysis: getDefaultAnalysis() };
  }
  
  if (!input.ageGroup || !input.quizTitle) {
    console.error("Missing ageGroup or quizTitle:", { ageGroup: input.ageGroup, quizTitle: input.quizTitle });
    return { analysis: getDefaultAnalysis() };
  }
  
  console.log("Input validation passed, calling flow...");
  return generateQuizAnalysisFlow(input);
}


const generateQuizAnalysisFlow = ai.defineFlow(
  {
    name: 'generateQuizAnalysisFlow',
    inputSchema: GenerateQuizAnalysisInputSchema,
    outputSchema: GenerateQuizAnalysisOutputSchema,
  },
  async (input: GenerateQuizAnalysisInput) => {
    console.log("=== MANUAL PROMPT BUILDING IN FLOW ===");
    
    // Manually build the prompt string to avoid Handlebars issues
    let promptText = `CONTEXT: Je bent Dr. Florentine Sage, een GZ-psycholoog gespecialiseerd in neurodiversiteit bij adolescenten. Je analyseert de resultaten van een zelfreflectie-instrument voor een jongere in de leeftijdscategorie ${input.ageGroup}. Je schrijfstijl is warm, empowerend, bemoedigend en makkelijk te begrijpen voor deze doelgroep.

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
-   Quiz Titel: ${input.quizTitle}
-   Leeftijdsgroep: ${input.ageGroup}
-   Scores per Thema (ALLEEN VOOR JOUW INTERNE ANALYSE, NIET TONEN):`;

    for (const [key, value] of Object.entries(input.finalScores)) {
      promptText += `\n    - ${key}: ${value}`;
    }

    promptText += `\n-   Gegeven Antwoorden:`;

    input.answeredQuestions.forEach(q => {
      promptText += `\n    - Vraag over "${q.profileKey || 'algemeen'}": "${q.question}" - Antwoord: "${q.answer}"`;
    });

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

    promptText += `\n\nOUTPUT FORMAT:

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

${analysisInstructions}`;
    
    console.log("Built prompt text length:", promptText.length);
    console.log("First 100 chars of prompt:", promptText.substring(0, 100));

    // Use ai.generate directly to bypass the definePrompt templating engine
    const { output } = await ai.generate({
      model: 'googleai/gemini-2.0-flash',
      prompt: promptText,
      output: { schema: GenerateQuizAnalysisOutputSchema }
    });

    if (!output) {
      throw new Error('AI did not return an analysis.');
    }
    
    return output;
  }
);
