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
    {{! This is the main prompt for generating a blog post. }}
    {{! The personaDescription will contain the full instructions for the AI's persona. }}
    {{{personaDescription}}}

    {{! The user provides the topic. }}
    Your task is to write a complete, engaging, and SEO-friendly blog post about the following topic:
    **Blog Topic:** "{{{topic}}}"

    {{! The AI must generate all the fields defined in the output schema. }}
    Generate a JSON object with the following fields:

    *   **title:** A catchy title, appropriate for your persona.
    *   **slug:** A URL-friendly slug based on the title (e.g., 'hoe-omgaan-met-schermtijd').
    *   **excerpt:** A short, compelling summary (1-2 sentences) in your persona's voice.
    *   **content:** The full blog post in Markdown format. It must be at least 400 words and include an introduction, a body with H2/H3 headings, and a conclusion, all written in character.
    *   **tags:** An array of 3-5 relevant tags or categories that fit the topic and persona.
    *   **featuredImageHint:** Two or three keywords in English for an ideal featured image.

    {{! Final instruction to ensure correct output format. }}
    Only return the JSON object with the requested fields. Do not add any extra explanation or text before or after the JSON object.
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
