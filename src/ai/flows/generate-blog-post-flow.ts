// src/ai/flows/generate-blog-post-flow.ts
'use server';
/**
 * @fileOverview A Genkit flow for generating blog post content from a single topic idea.
 * This flow is simplified to be more robust, generating only the title and main content.
 */
import { ai } from '@/ai/genkit';
import { z } from 'zod';

export const GenerateBlogPostInputSchema = z.object({
  topic: z.string().describe('The main topic, idea, or subject for the blog post.'),
  personaDescription: z.string().describe('A description of the AI persona to use for writing the blog post.'),
});
export type GenerateBlogPostInput = z.infer<typeof GenerateBlogPostInputSchema>;

// *** SIMPLIFIED OUTPUT SCHEMA ***
// This is the core of the fix. We only ask for the two most important text fields.
// The AI is much more likely to return this simple structure correctly.
export const GenerateBlogPostOutputSchema = z.object({
  title: z.string().describe('A catchy and SEO-friendly title for the blog post.'),
  content: z.string().describe('The full content of the blog post in Markdown format. It should be well-structured with headings, paragraphs, and lists, and be at least 400 words.'),
});
export type GenerateBlogPostOutput = z.infer<typeof GenerateBlogPostOutputSchema>;


export async function generateBlogPost(input: GenerateBlogPostInput): Promise<GenerateBlogPostOutput> {
  return generateBlogPostFlow(input);
}

// *** SIMPLIFIED PROMPT ***
// The prompt now focuses on just getting the title and content right.
const prompt = ai.definePrompt({
  name: 'generateBlogPostPrompt_v3', // New name to avoid caching issues
  input: { schema: GenerateBlogPostInputSchema },
  output: { schema: GenerateBlogPostOutputSchema },
  prompt: `
// ROLE
You are an expert content creator. Your primary task is to write a blog post in Dutch, perfectly embodying the persona described below.

// PERSONA
Your assigned persona for this task is:
{{{personaDescription}}}

// TASK
Write a comprehensive, engaging, and well-structured blog post on the following topic:
"{{{topic}}}"

// INSTRUCTIONS
1.  Write the entire blog post in Dutch.
2.  The main content must be at least 400 words.
3.  Use Markdown for clear structure (e.g., H2 for main sections, H3 for sub-sections, lists for key points).
4.  The tone, style, and content must strictly adhere to the persona provided.
5.  You MUST generate a 'title' and the 'content'. Do not generate any other fields.
  `,
});

const generateBlogPostFlow = ai.defineFlow(
  {
    name: 'generateBlogPostFlow_v3',
    inputSchema: GenerateBlogPostInputSchema,
    outputSchema: GenerateBlogPostOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    if (!output) {
      throw new Error('AI did not return a blog post.');
    }
    return output;
  }
);
