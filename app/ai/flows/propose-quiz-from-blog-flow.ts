'use server';
/**
 * @fileOverview A Genkit flow for proposing a quiz structure based on blog content.
 */
import { ai } from '@/ai/genkit';
import {
  ProposeQuizFromBlogInputSchema,
  ProposeQuizFromBlogOutputSchema,
  type ProposeQuizFromBlogInput,
  type ProposeQuizFromBlogOutput
} from './propose-quiz-from-blog-flow-types';

export async function proposeQuizFromBlog(input: ProposeQuizFromBlogInput): Promise<ProposeQuizFromBlogOutput> {
  return proposeQuizFromBlogFlow(input);
}

const prompt = ai.definePrompt({
  name: 'proposeQuizFromBlogPrompt',
  input: { schema: ProposeQuizFromBlogInputSchema },
  output: { schema: ProposeQuizFromBlogOutputSchema },
  prompt: `
    You are an expert in creating engaging educational content for the MindNavigator platform.
    Your task is to analyze the following blog post and propose a short, relevant self-reflection quiz to accompany it.

    **Blog Post Details:**
    - Title: "{{blogTitle}}"
    - Target Audience: "{{targetAudience}}"
    - Content (HTML): {{{blogContent}}}

    **Instructions:**
    1.  **Analyze the Content:** Read the blog post to understand its core message, key themes, and actionable advice.
    2.  **Propose a Quiz Title:** Create a short, catchy, and relevant title for the quiz. It should invite the user to reflect on the blog's topic.
    3.  **Propose a Description:** Write a brief, one-sentence description explaining what the quiz is about.
    4.  **Determine Category:** Choose the MOST fitting category for this quiz from the following list: 'Emoties & Gevoelens', 'Vriendschappen & Sociaal', 'Leren & School', 'Prikkels & Omgeving', 'Wie ben ik?', 'Dromen & Toekomst'.
    5.  **Estimate Duration:** Based on the depth of the topic, estimate the quiz duration. A simple reflection is short, a deeper dive is longer.
    6.  **Propose Difficulty:** Set a difficulty level (laag, gemiddeld, hoog).

    The goal is to create a quiz that feels like a natural extension of the blog post, encouraging the user to apply the concepts to their own life.
  `,
});

const proposeQuizFromBlogFlow = ai.defineFlow(
  {
    name: 'proposeQuizFromBlogFlow',
    inputSchema: ProposeQuizFromBlogInputSchema,
    outputSchema: ProposeQuizFromBlogOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    if (!output) {
      throw new Error('AI did not return a quiz proposal.');
    }
    return output;
  }
);
