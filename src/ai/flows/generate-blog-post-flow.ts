// src/ai/flows/generate-blog-post-flow.ts
'use server';
/**
 * @fileOverview A Genkit flow for generating blog post content from a single topic idea.
 * This is the v9 fix: AI returns a raw string, not JSON, to maximize stability.
 */
import { ai } from '@/ai/genkit';
import { z } from 'zod';

export const GenerateBlogPostInputSchema = z.object({
  topic: z.string().describe('The main topic, idea, or subject for the blog post.'),
  personaDescription: z.string().describe('A description of the AI persona to use for writing the blog post.'),
});
export type GenerateBlogPostInput = z.infer<typeof GenerateBlogPostInputSchema>;

// The final output of our flow, after parsing the AI's raw string output
export const GenerateBlogPostOutputSchema = z.object({
  title: z.string().describe('A catchy and SEO-friendly title for the blog post.'),
  content: z.string().describe('The full content of the blog post in Markdown format. It should be well-structured with headings, paragraphs, and lists.'),
});
export type GenerateBlogPostOutput = z.infer<typeof GenerateBlogPostOutputSchema>;


export async function generateBlogPost(input: GenerateBlogPostInput): Promise<GenerateBlogPostOutput> {
  return generateBlogPostFlow(input);
}

// The prompt now expects a raw string as output, not JSON.
const prompt = ai.definePrompt({
  name: 'generateBlogPostPrompt_v9_raw_string', // New name to avoid caching
  input: { schema: GenerateBlogPostInputSchema },
  // No output schema is specified, so Genkit defaults to returning raw text.
  prompt: `
// ROLE
You are an expert content creator. Your primary task is to write a blog post in Dutch, perfectly embodying the persona described below.

// PERSONA
Your assigned persona for this task is:
{{{personaDescription}}}

// TASK
Write a comprehensive, engaging, and well-structured blog post on the following topic:
"{{{topic}}}"

// INSTRUCTIONS & FORMATTING
1.  The entire blog post must be in Dutch.
2.  The content must be at least 400 words.
3.  Use Markdown for clear structure (H2 for main sections, H3 for sub-sections, lists for key points).
4.  The tone and style must strictly adhere to the persona provided.
5.  Your output MUST be ONLY the raw markdown of the blog post. DO NOT wrap it in JSON or any other format.
6.  The VERY FIRST line of the markdown MUST be the H1 title, starting with "# ". For example: "# De Toekomst van Leren". The rest of the content should follow on a new line.

Do not include any text, explanation, or conversational filler before or after the markdown content.
  `,
});

const generateBlogPostFlow = ai.defineFlow(
  {
    name: 'generateBlogPostFlow_v9_raw_string',
    inputSchema: GenerateBlogPostInputSchema,
    outputSchema: GenerateBlogPostOutputSchema, // The flow's public contract still returns the parsed object
  },
  async (input) => {
    // Call the prompt and get the raw string output
    const response = await prompt(input);
    const rawMarkdownOutput = response.text; // The raw string from the AI

    if (!rawMarkdownOutput || rawMarkdownOutput.trim() === '') {
      throw new Error('AI did not return any markdown content.');
    }
    
    const lines = rawMarkdownOutput.split('\n');
    
    let title = '';
    let content = '';

    const firstLine = lines[0]?.trim() || '';
    if (firstLine.startsWith('# ')) {
        // Correctly parse the title and the rest of the content
        title = firstLine.substring(2).trim();
        content = lines.slice(1).join('\n').trim();
    } else {
        // Fallback if the AI doesn't follow the H1 instruction
        title = "Titel niet gevonden in AI output";
        content = rawMarkdownOutput; // return the whole thing as content
    }

    if (!title || !content) {
        throw new Error('Could not parse title and content from the markdown returned by the AI.');
    }

    return { title, content };
  }
);
