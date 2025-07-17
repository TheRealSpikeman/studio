// src/ai/flows/generate-ai-quiz-flow-types.ts
import {z} from 'genkit';

export const GenerateAiQuizInputSchema = z.object({
  topic: z.string().describe('The main topic or theme of the quiz.'),
  audience: z.string().describe(
    'The target audience for the quiz (e.g., "Tiener (12-14 jr, voor zichzelf)", "Ouder (over kind 12-14 jr)"). This determines who is answering and about whom.'
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
  quizPurpose: z.string().optional().describe('The specific purpose of this quiz within the user journey, e.g., "onboarding", "deep_dive", "reflection", "goal_setting", or "general".'),
});
export type GenerateAiQuizInput = z.infer<typeof GenerateAiQuizInputSchema>;

export const AiQuestionSchema = z.object({
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

export const GenerateAiQuizOutputSchema = z.object({
  questions: z
    .array(AiQuestionSchema)
    .describe('An array of generated quiz questions.'),
});
export type GenerateAiQuizOutput = z.infer<typeof GenerateAiQuizOutputSchema>;
