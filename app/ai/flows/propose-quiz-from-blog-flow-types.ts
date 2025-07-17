// src/ai/flows/propose-quiz-from-blog-flow-types.ts
import {z} from 'genkit';

export const ProposeQuizFromBlogInputSchema = z.object({
  blogTitle: z.string().describe('The title of the blog post.'),
  blogContent: z.string().describe('The full HTML content of the blog post.'),
  targetAudience: z.string().describe('The target audience of the blog post, e.g., "Ouders", "Tieners 12-14".'),
});
export type ProposeQuizFromBlogInput = z.infer<typeof ProposeQuizFromBlogInputSchema>;

// The output should be a subset of QuizCreationState that can be pre-filled
export const ProposeQuizFromBlogOutputSchema = z.object({
  title: z.string().describe('A catchy, relevant title for a short quiz based on the blog post.'),
  description: z.string().describe('A short, engaging description for the quiz.'),
  mainCategory: z.string().describe('The most fitting category for the quiz, e.g., "Emoties & Gevoelens", "Leren & School".'),
  estimatedDuration: z.enum(['2-3 minuten (2-3 vragen)', '3-5 minuten (4-6 vragen)', '5-8 minuten (7-10 vragen)', '8-12 minuten (11-15 vragen)']).describe('An estimation of the quiz duration based on its depth.'),
  difficulty: z.enum(['laag', 'gemiddeld', 'hoog']).describe('The proposed difficulty level.'),
});
export type ProposeQuizFromBlogOutput = z.infer<typeof ProposeQuizFromBlogOutputSchema>;
