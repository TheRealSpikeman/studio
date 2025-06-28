// src/ai/flows/generate-blog-post-flow.ts
'use server';
/**
 * @fileOverview A Genkit flow for generating blog post content from a single topic idea.
 * This flow is rewritten to be more robust by having the AI generate a single markdown
 * field, which is then parsed by the application code.
 */
import { ai } from '@/ai/genkit';
import { z } from 'zod';

export const GenerateBlogPostInputSchema = z.object({
  topic: z.string().describe('The main topic, idea, or subject for the blog post.'),
  personaDescription: z.string().describe('A description of the AI persona to use for writing the blog post.'),
});
export type GenerateBlogPostInput = z.infer<typeof GenerateBlogPostInputSchema>;

// The final output of our flow, after parsing
export const GenerateBlogPostOutputSchema = z.object({
  title: z.string().describe('A catchy and SEO-friendly title for the blog post.'),
  content: z.string().describe('The full content of the blog post in Markdown format. It should be well-structured with headings, paragraphs, and lists.'),
});
export type GenerateBlogPostOutput = z.infer<typeof GenerateBlogPostOutputSchema>;

// An internal schema for what we ask the AI to generate.
const AiSingleFieldOutputSchema = z.object({
    blogPostMarkdown: z.string().describe('The full blog post in a single Markdown string. The VERY FIRST line MUST be the H1 title (e.g., "# My Blog Title"). The rest of the content should follow, starting on a new line.'),
});

export async function generateBlogPost(input: GenerateBlogPostInput): Promise<GenerateBlogPostOutput> {
  return generateBlogPostFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateBlogPostPrompt_v8_single_field_fix', // New name to avoid caching
  input: { schema: GenerateBlogPostInputSchema },
  output: { schema: AiSingleFieldOutputSchema },
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
5.  Your output MUST be a single JSON object with only ONE key: "blogPostMarkdown".
6.  The value for "blogPostMarkdown" must be a single string containing the entire blog post.
7.  The VERY FIRST line of the markdown string MUST be the H1 title, starting with "# ". For example: "# De Toekomst van Leren".

EXAMPLE OUTPUT FORMAT:
{
  "blogPostMarkdown": "# De Perfecte Titel\\n\\nDit is de eerste paragraaf van de blogpost. De content moet volledig binnen deze enkele string staan...\\n\\n## Een Subkop\\n\\n* Een punt in een lijst."
}

Do not include any text or explanation outside of the final JSON object.
  `,
});

const generateBlogPostFlow = ai.defineFlow(
  {
    name: 'generateBlogPostFlow_v8_single_field_fix',
    inputSchema: GenerateBlogPostInputSchema,
    outputSchema: GenerateBlogPostOutputSchema, // The flow's public contract returns the parsed object
  },
  async (input) => {
    // Call the prompt that expects the single markdown field
    const { output: singleFieldOutput } = await prompt(input);

    if (!singleFieldOutput || !singleFieldOutput.blogPostMarkdown) {
      throw new Error('AI did not return any markdown content.');
    }
    
    const markdown = singleFieldOutput.blogPostMarkdown;
    const lines = markdown.split('\n');
    
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
        content = markdown;
    }

    if (!title || !content) {
        throw new Error('Could not parse title and content from the markdown returned by the AI.');
    }

    return { title, content };
  }
);
