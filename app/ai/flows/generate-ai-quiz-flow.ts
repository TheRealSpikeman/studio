'use server';
/**
 * @fileOverview A Genkit flow for generating AI-powered quiz questions.
 *
 * - generateAiQuiz - A function that handles the AI quiz generation process.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {
  GenerateAiQuizInputSchema,
  GenerateAiQuizOutputSchema,
  type GenerateAiQuizInput,
  type GenerateAiQuizOutput
} from './generate-ai-quiz-flow-types';

export async function generateAiQuiz(
  input: GenerateAiQuizInput
): Promise<GenerateAiQuizOutput> {
  return generateAiQuizFlow(input);
}

// New internal schema for the prompt, includes pre-computed booleans
const PromptInternalInputSchema = GenerateAiQuizInputSchema.extend({
    isSelfReflection: z.boolean(),
    isParentObservation: z.boolean(),
    isQuizPurposeOnboarding: z.boolean(),
    isQuizPurposeDeepDive: z.boolean(),
    isQuizPurposeReflection: z.boolean(),
    isQuizPurposeGoalSetting: z.boolean(),
});

const prompt = ai.definePrompt({
  name: 'generateAiQuizPrompt',
  input: {schema: PromptInternalInputSchema},
  output: {schema: GenerateAiQuizOutputSchema},
  prompt: `You are an expert in creating educational quiz questions in Dutch, tailored for specific target audiences and difficulty levels, with a focus on neurodiversity and personal development for the MindNavigator platform.

Your task is to generate a set of quiz questions based on the following criteria:
Topic: {{{topic}}}
Target Audience: {{{audience}}}
Domain/Category: {{{category}}}
Number of Questions: {{{numQuestions}}}
Difficulty Level: {{{difficulty}}}
{{#if quizPurpose}}Quiz Purpose/Journey Moment: {{{quizPurpose}}}{{/if}}

For each question:
1. Generate a clear and concise question text in Dutch.
2. Optionally, provide a brief example or clarification for the question in Dutch. This should be helpful for the target audience.
3. Assign a weight to the question based on its complexity and the overall difficulty level requested. The weight must be an integer between 1 and 5.
   - For 'laag' (low) difficulty, weights should primarily be 1, occasionally 2.
   - For 'gemiddeld' (medium) difficulty, weights should mostly be 2 or 3, but can range from 1 to 4.
   - For 'hoog' (high) difficulty, weights should mostly be 3 or 4, but can range from 2 to 5.

The answer options for all questions will be fixed and provided separately in the application. They are Likert scale options like "Nooit", "Soms", "Vaak", "Altijd".

**!! CRITICAL QUESTION FORMATTING RULE !!**
Every question you generate **MUST** be a statement or a frequency question that can be logically answered with "Nooit", "Soms", "Vaak", of "Altijd".

**CORRECT Examples (Statements or Frequency Questions):**
- "Ik merk dat ik snel ben afgeleid als er achtergrondgeluid is."
- "Hoe vaak voel je je overweldigd in een drukke menigte?"
- "Ik vind het moeilijk om aan een taak te beginnen, zelfs als ik weet dat het moet."
- "Mijn gedachten dwalen af als ik probeer te lezen."

**INCORRECT Examples (AVOID THESE AT ALL COSTS):**
- "Wat voor soort omgeving helpt jou het beste om te leren?" (Asks for a type, not a frequency)
- "Wat zijn je grootste sterke punten?" (Asks for a list, not a frequency)
- "Hoe ga je om met stress?" (Asks for a method, not a frequency)
- "Welke van deze activiteiten geeft je energie?" (Multiple choice, not a Likert scale)

This rule is the most important constraint. Do not deviate from it.

**!! PSYCHOMETRIC CONSIDERATIONS !!**
- All questions should be positively worded. A higher frequency ("Vaak", "Altijd") should consistently indicate a stronger presence of the trait being measured (e.g., "Ik heb moeite met concentreren").
- Avoid reverse-scored items where a lower frequency would indicate a stronger trait (e.g., "Ik kan me gemakkelijk concentreren"). This uniform scoring approach is similar to validated questionnaires like the Conners scales and simplifies analysis.

Specific instructions based on Target Audience:
{{#if isSelfReflection}}
  The questions should help the user (a tiener or volwassene) reflect on THEMSELVES regarding the given topic and domain. The phrasing must fit the Likert scale.
  Example for "Tiener (12-14 jr, voor zichzelf)" on "Focus": "Ik merk dat mijn gedachten afdwalen als ik huiswerk maak."
{{/if}}
{{#if isParentObservation}}
  The questions should be phrased for a PARENT to answer ABOUT THEIR CHILD. They should focus on observable behaviors and patterns that can be rated by frequency.
  Example for "Ouder (over kind 6-11 jr)" on "Routine": "Hoe vaak merkt u dat uw kind van slag raakt bij onverwachte veranderingen in de dagelijkse routine?"
{{/if}}

{{#if isQuizPurposeOnboarding}}
CONTEXT: This quiz is the starting point of a personalized journey for a neurodivergent young person. The results will be used for:
- Daily coaching tips
- Personal affirmations
- Specific micro-tasks
- Long-term growth insights

TONE: Use an age-appropriate, encouraging, and non-judgmental tone for {{{audience}}}.

RESULT FOCUS: Generate questions that yield rich, usable data for meaningful personalization. Focus on basic self-discovery and creating a positive first impression. The questions must adhere to the CRITICAL QUESTION FORMATTING RULE.
{{/if}}
{{#if isQuizPurposeDeepDive}}
Focus on deeper questions about behavior patterns and coping strategies that can be answered on a Likert scale.
{{/if}}
{{#if isQuizPurposeReflection}}
This is a monthly check-in. Focus on reflection on progress and current feelings, phrased as statements or frequency questions.
{{/if}}
{{#if isQuizPurposeGoalSetting}}
Focus on questions that help the user identify and articulate personal goals, phrased as statements or frequency questions. E.g., "Ik weet duidelijk wat mijn doelen zijn voor de komende maand."
{{/if}}

Focus on creating thoughtful questions that encourage self-reflection relevant to the {{{audience}}} on the {{{topic}}} within the {{{category}}}.
Make sure the language used is appropriate for the specified {{{audience}}} (either for the person themselves or for a parent answering about their child).
Ensure you generate exactly {{{numQuestions}}} questions.
`,
});

const generateAiQuizFlow = ai.defineFlow(
  {
    name: 'generateAiQuizFlow',
    inputSchema: GenerateAiQuizInputSchema,
    outputSchema: GenerateAiQuizOutputSchema,
  },
  async input => {
    const promptInput = {
        ...input,
        isSelfReflection: input.audience.includes('voor zichzelf'),
        isParentObservation: input.audience.includes('Ouder (over kind'),
        isQuizPurposeOnboarding: input.quizPurpose === 'onboarding',
        isQuizPurposeDeepDive: input.quizPurpose === 'deep_dive',
        isQuizPurposeReflection: input.quizPurpose === 'reflection',
        isQuizPurposeGoalSetting: input.quizPurpose === 'goal_setting',
    };

    const {output} = await prompt(promptInput);
    
    if (!output) {
      throw new Error('AI did not return an output.');
    }
    if (output.questions.length !== input.numQuestions) {
        console.warn(`AI generated ${output.questions.length} questions, expected ${input.numQuestions}. Truncating or padding might be needed if strict count is required by UI.`);
    }
    return output;
  }
);
