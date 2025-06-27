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
    You are an expert content strategist and writer for MindNavigator, a platform supporting neurodivergent teens and their parents.
    You will be writing with the following persona:
    ---
    {{{personaDescription}}}
    ---
    
    Your task is to take a simple blog topic idea and transform it into a complete, engaging, and SEO-friendly blog post. You must ensure variety in your output.

    **Core Topic Idea:** "{{{topic}}}"

    **Instructions:**
    1.  **Analyze & Strategize:** Based on the core topic, first decide on the most appropriate **target audience** (e.g., 'parents', 'teens', 'professionals') and a fitting **tone** (e.g., 'informatief', 'inspirerend', 'praktisch', 'empathisch'). Also, determine relevant **keywords** for SEO.
    2.  **Generate All Content:** Now, using the persona, generate all of the following fields. Do not reuse the exact same structure or phrasing for every article; create variety.
        *   **Title:** Create a title that is both engaging for your chosen audience and optimized for search engines using your keywords.
        *   **Slug:** Generate a URL-friendly slug from the title (e.g., 'how-to-help-your-teen-focus').
        *   **Excerpt:** Write a concise and compelling summary (1-2 sentences) to hook the reader.
        *   **Content (Markdown):** Write the full blog post in Markdown. It should be at least 400 words, well-structured with an introduction, body (using H2 and H3 headings), and a conclusion. The tone must match the style you chose.
        *   **Tags:** Provide 3-5 relevant tags as an array of strings.
        *   **Featured Image Hint:** Suggest two or three keywords for a suitable Unsplash or stock photo.

    Ensure the final output is high-quality, informative, and resonates with the specific audience you've chosen to target for this article.
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
