// src/ai/flows/generate-blog-post-flow.ts
'use server';
/**
 * @fileOverview A Genkit flow for generating blog post content.
 */
import { ai } from '@/ai/genkit';
import { z } from 'zod';

export const GenerateBlogPostInputSchema = z.object({
  topic: z.string().describe('The main topic or subject of the blog post.'),
  keywords: z.string().optional().describe('Comma-separated keywords to include for SEO purposes.'),
  targetAudience: z.enum(['parents', 'teens', 'professionals']).describe('The primary audience for the blog post.'),
  tone: z.enum(['informatief', 'inspirerend', 'praktisch', 'empathisch']).describe('The desired tone of voice.'),
  personaDescription: z.string().describe('A description of the AI persona to use for writing the blog post.'),
});
export type GenerateBlogPostInput = z.infer<typeof GenerateBlogPostInputSchema>;

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
    {{{personaDescription}}}
    Your task is to generate a complete, engaging, and well-structured blog post based on the provided criteria.

    **Topic:** {{{topic}}}
    **Target Audience:** {{{targetAudience}}}
    **Desired Tone:** {{{tone}}}
    {{#if keywords}}**Keywords to include:** {{{keywords}}}{{/if}}

    **Instructions:**
    1.  **Title:** Create a title that is both engaging for the target audience and optimized for search engines.
    2.  **Slug:** Generate a URL-friendly slug from the title (e.g., 'how-to-help-your-teen-focus').
    3.  **Excerpt:** Write a concise and compelling summary (1-2 sentences) to hook the reader.
    4.  **Content:** Write the full blog post in Markdown. The content should be at least 400 words. Structure it with a clear introduction, body (using H2 and H3 headings for sections), and a concluding paragraph. The tone must match the requested style.
    5.  **Tags:** Provide 3-5 relevant tags as an array of strings.
    6.  **Featured Image Hint:** Suggest two or three keywords for a suitable Unsplash or stock photo.

    Ensure the final output is high-quality, informative, and resonates with the specified audience.
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
