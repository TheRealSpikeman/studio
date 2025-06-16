
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

const GenerateAiQuizInputSchema = z.object({
  topic: z.string().describe('The main topic or theme of the quiz.'),
  audience: z
    .string()
    .describe(
      'The target age group for the quiz (e.g., "12-14 jaar", "15-18 jaar").'
    ),
  category: z
    .string()
    .describe(
      'The specific domain or category the quiz falls into (e.g., "ADD", "Examenvrees").'
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

const prompt = ai.definePrompt({
  name: 'generateAiQuizPrompt',
  input: {schema: GenerateAiQuizInputSchema},
  output: {schema: GenerateAiQuizOutputSchema},
  prompt: `You are an expert in creating educational quiz questions for neurodiversity topics, tailored for specific age groups and difficulty levels in Dutch.

Your task is to generate a set of quiz questions based on the following criteria:
Topic: {{{topic}}}
Target Audience: {{{audience}}}
Domain/Category: {{{category}}}
Number of Questions: {{{numQuestions}}}
Difficulty Level: {{{difficulty}}}

For each question:
1. Generate a clear and concise question text in Dutch.
2. Optionally, provide a brief example or clarification for the question in Dutch. This should be helpful for the target audience.
3. Assign a weight to the question based on its complexity and the overall difficulty level requested. The weight must be an integer between 1 and 5.
   - For 'laag' (low) difficulty, weights should primarily be 1, occasionally 2.
   - For 'gemiddeld' (medium) difficulty, weights should mostly be 2 or 3, but can range from 1 to 4.
   - For 'hoog' (high) difficulty, weights should mostly be 3 or 4, but can range from 2 to 5.

The questions should help users reflect on the given topic and domain in the context of their neurodiversity and personal growth. When the category is 'Thema (algemeen)' or the topic is about personal development, the questions should explicitly guide the user towards self-discovery, understanding their behaviors, and identifying opportunities for personal growth.
The answer options for all questions will be fixed and provided separately in the application (Nooit, Soms, Vaak, Altijd). You DO NOT need to generate answer options.
Focus on creating thoughtful questions that encourage self-reflection relevant to the {{{audience}}} on the {{{topic}}} within the {{{category}}}.
Make sure the language used is appropriate for the specified {{{audience}}}.
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
    const {output} = await prompt(input);
    if (!output) {
      throw new Error('AI did not return an output.');
    }
    // Ensure the AI returns the correct number of questions
    if (output.questions.length !== input.numQuestions) {
        console.warn(`AI generated ${output.questions.length} questions, expected ${input.numQuestions}. Truncating or padding might be needed if strict count is required by UI.`);
        // For now, we'll return what AI gave, but this could be handled more robustly.
    }
    return output;
  }
);

