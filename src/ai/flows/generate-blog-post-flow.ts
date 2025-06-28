// src/ai/flows/generate-blog-post-flow.ts
'use server';
/**
 * @fileOverview A Genkit flow for generating blog post content from a single topic idea.
 */
import { ai } from '@/ai/genkit';
import { z } from 'zod';

// Simplified input: just the core idea and the persona to use.
export const GenerateBlogPostInputSchema = z.object({
  topic: z.string().describe('The main topic, idea, or subject for the blog post.'),
  personaDescription: z.string().describe('A description of the AI persona to use for writing the blog post.'),
});
export type GenerateBlogPostInput = z.infer<typeof GenerateBlogPostInputSchema>;

// Output remains the same, as the AI still needs to generate all these fields.
export const GenerateBlogPostOutputSchema = z.object({
  title: z.string().describe('A catchy and SEO-friendly title for the blog post.'),
  slug: z.string().describe('A URL-friendly slug for the blog post, using kebab-case.'),
  excerpt: z.string().describe('A short, compelling summary of the blog post (1-2 sentences).'),
  content: z.string().describe('The full content of the blog post in Markdown format. It should be well-structured with headings, paragraphs, and lists.'),
  tags: z.array(z.string()).describe('An array of 3-5 relevant tags or categories for the blog post.'),
  featuredImageHint: z.string().describe('Two or three keywords describing an ideal featured image for this post (e.g., "teenager studying focused").'),
});
export type GenerateBlogPostOutput = z.infer<typeof GenerateBlogPostOutputSchema>;

export async function generateBlogPost(input: GenerateBlogPostInput): Promise<GenerateBlogPostOutput> {
  return generateBlogPostFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateBlogPostPrompt',
  input: { schema: GenerateBlogPostInputSchema },
  output: { schema: GenerateBlogPostOutputSchema },
  prompt: `
// ROLE
You are an expert content creator. Your primary task is to write a complete blog post in Dutch, perfectly embodying the persona described below.

// PERSONA
Your assigned persona for this task is:
{{{personaDescription}}}

// TASK
Write a comprehensive, engaging, and SEO-friendly blog post on the following topic:
"{{{topic}}}"

// INSTRUCTIONS
1.  Write the entire blog post in Dutch.
2.  The main content must be at least 400 words.
3.  Use Markdown for clear structure (e.g., H2 for main sections, H3 for sub-sections, lists for key points).
4.  The tone, style, and content must strictly adhere to the persona provided.
5.  Based on the content you write, you must also generate all the required metadata fields.
  `,
});

const generateBlogPostFlow = ai.defineFlow(
  {
    name: 'generateBlogPostFlow',
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
