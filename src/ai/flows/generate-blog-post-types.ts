
// src/ai/flows/generate-blog-post-types.ts
import { z } from 'zod';

export const GenerateBlogPostInputSchema = z.object({
  topic: z.string().describe('The main topic, idea, or subject for the blog post.'),
  personaDescription: z.string().describe('A description of the AI persona to use for writing the blog post.'),
});
export type GenerateBlogPostInput = z.infer<typeof GenerateBlogPostInputSchema>;

// The final output of our flow, after parsing the AI's raw string output
export const GenerateBlogPostOutputSchema = z.object({
  title: z.string().describe('A catchy and SEO-friendly title for the blog post.'),
  excerpt: z.string().describe('A short, catchy one-sentence summary for the blog post.'),
  content: z.string().describe('The full content of the blog post in Markdown format. It should be well-structured with headings, paragraphs, and lists.'),
});
export type GenerateBlogPostOutput = z.infer<typeof GenerateBlogPostOutputSchema>;
