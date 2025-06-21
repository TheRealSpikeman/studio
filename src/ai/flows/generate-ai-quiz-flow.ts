'use server';
/**
 * @fileOverview A Genkit flow for generating AI-powered quiz questions.
 *
 * - generateAiQuiz - A function that handles the AI quiz generation process.
 * - GenerateAiQuizInput - The input type for the generateAiQuiz function.
 * - GenerateAiQuizOutput - The return type for the generateAiQuiz function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import type { QuizAudience } from '@/types/quiz-admin'; 

const GenerateAiQuizInputSchema = z.object({
  topic: z.string().describe('The main topic or theme of the quiz.'),
  audience: z.custom<QuizAudience>().describe(
    'The target audience for the quiz (e.g., "Tiener (12-14 jr, voor zichzelf)", "Ouder (over kind 6-11 jr)"). This determines who is answering and about whom.'
  ),
  category: z
    .string()
    .describe(
      'The specific domain or category the quiz falls into (e.g., "ADD", "Examenvrees", "Ouder Observatie").'
    ),
  numQuestions: z
    .number()
    .int()
    .min(1)
    .describe('The desired number of questions for the quiz.'),
  difficulty: z
    .string()
    .describe(
      'The difficulty level of the quiz, which should influence question complexity and weight (e.g., "laag", "gemiddeld", "hoog").'
    ),
  quizPurpose: z.enum(['onboarding', 'deep_dive', 'reflection', 'goal_setting', 'general']).optional().describe('The specific purpose of this quiz within the user journey, e.g., initial onboarding, deep dive, reflection.'),
});
export type GenerateAiQuizInput = z.infer<typeof GenerateAiQuizInputSchema>;

const AiQuestionSchema = z.object({
  text: z.string().describe('The text of the quiz question.'),
  example: z
    .string()
    .optional()
    .describe('An optional example or clarification for the question.'),
  weight: z
    .number()
    .int()
    .min(1)
    .max(5)
    .describe(
      'The weight of the question, from 1 (easiest) to 5 (hardest), reflecting its importance or difficulty.'
    ),
});

const GenerateAiQuizOutputSchema = z.object({
  questions: z
    .array(AiQuestionSchema)
    .describe('An array of generated quiz questions.'),
});
export type GenerateAiQuizOutput = z.infer<typeof GenerateAiQuizOutputSchema>;

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

The answer options for all questions will be fixed and provided separately in the application (e.g., Nooit, Soms, Vaak, Altijd, or similar Likert scale). You DO NOT need to generate answer options.

Specific instructions based on Target Audience:
{{#if isSelfReflection}}
  The questions should help the user (a tiener or volwassene) reflect on THEMSELVES regarding the given topic and domain in the context of their neurodiversity and personal growth.
  When the category is 'Thema (algemeen)' or the topic is about personal development, the questions should explicitly guide the user towards self-discovery, understanding their behaviors, and identifying opportunities for personal growth.
  Example for "Tiener (12-14 jr, voor zichzelf)" on "Focus": "Merk je dat je gedachten afdwalen als je huiswerk maakt?"
{{/if}}
{{#if isParentObservation}}
  The questions should be phrased for a PARENT to answer ABOUT THEIR CHILD. They should focus on observable behaviors and patterns of the child.
  Example for "Ouder (over kind 6-11 jr)" on "Routine": "Hoe vaak merkt u dat uw kind van slag raakt bij onverwachte veranderingen in de dagelijkse routine?"
  The questions should help the parent reflect on their child's behavior, challenges, and strengths related to the {{{topic}}} within the {{{category}}}.
{{/if}}

{{#if isQuizPurposeOnboarding}}
CONTEXT: This quiz is the starting point of a personalized journey for a neurodivergent young person. The results will be used for:
- Daily coaching tips
- Personal affirmations
- Specific micro-tasks
- Long-term growth insights

TONE: Use an age-appropriate, encouraging, and non-judgmental tone for {{{audience}}}.

QUESTION TYPES that work well for personalization:
- Situational scenarios: "When you feel stressed, what do you usually do?"
- Preferences: "What way of learning works best for you?"
- Strength recognition: "What are you really good at?"
- Challenge acknowledgment: "What do you find difficult sometimes?"

AVOID:
- Yes/no questions (they provide little input for personalization)
- Medical/diagnostic language
- Negatively charged words

RESULT FOCUS: Generate questions that yield rich, usable data for meaningful personalization. Focus on basic self-discovery and creating a positive first impression.
{{/if}}
{{#if isQuizPurposeDeepDive}}
Focus on deeper questions about behavior patterns and coping strategies.
{{/if}}
{{#if isQuizPurposeReflection}}
This is a monthly check-in. Focus on reflection on progress and current feelings.
{{/if}}
{{#if isQuizPurposeGoalSetting}}
Focus on questions that help the user identify and articulate personal goals.
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
