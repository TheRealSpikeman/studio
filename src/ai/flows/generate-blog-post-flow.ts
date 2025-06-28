
'use server';
/**
 * @fileOverview A Genkit flow for generating blog post content from a single topic idea.
 * This is the v10 fix: AI returns a raw string with Title (H1), Excerpt, and Content to maximize stability.
 */
import { ai } from '@/ai/genkit';
import {
  GenerateBlogPostInputSchema,
  GenerateBlogPostOutputSchema,
  type GenerateBlogPostInput,
  type GenerateBlogPostOutput
} from './generate-blog-post-types';

export async function generateBlogPost(input: GenerateBlogPostInput): Promise<GenerateBlogPostOutput> {
  return generateBlogPostFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateBlogPostPrompt_v10_with_excerpt',
  input: { schema: GenerateBlogPostInputSchema },
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
6.  The VERY FIRST line of the markdown MUST be the H1 title, starting with "# ". For example: "# De Toekomst van Leren".
7.  The SECOND line of the markdown MUST be a short, catchy, one-sentence summary (excerpt) of the blog post. Do not add any special formatting to this line.
8.  The THIRD line MUST be empty.
9.  The rest of the content should follow from the FOURTH line onwards.

EXAMPLE OUTPUT STRUCTURE:
# Titel van de Blogpost
Dit is een pakkende samenvatting die uitnodigt om verder te lezen.

## Eerste Sectie
Hier begint de daadwerkelijke content van het artikel...

Do not include any text, explanation, or conversational filler before or after the markdown content.
  `,
});

const generateBlogPostFlow = ai.defineFlow(
  {
    name: 'generateBlogPostFlow_v10_with_excerpt',
    inputSchema: GenerateBlogPostInputSchema,
    outputSchema: GenerateBlogPostOutputSchema,
  },
  async (input) => {
    const response = await prompt(input);
    const rawMarkdownOutput = response.text;

    if (!rawMarkdownOutput || rawMarkdownOutput.trim() === '') {
      throw new Error('AI did not return any markdown content.');
    }
    
    const lines = rawMarkdownOutput.split('\n');
    
    let title = '';
    let excerpt = '';
    let content = '';

    const firstLine = lines[0]?.trim() || '';
    if (firstLine.startsWith('# ')) {
        title = firstLine.substring(2).trim();
        excerpt = lines[1]?.trim() || '';
        // Skip the blank line (index 2) and join the rest
        content = lines.slice(3).join('\n').trim();
    } else {
        // Fallback if the AI doesn't follow instructions
        title = "Titel niet gevonden in AI output";
        excerpt = "Samenvatting niet gevonden.";
        content = rawMarkdownOutput;
    }

    if (!title || !content || !excerpt) {
        throw new Error('Could not parse title, excerpt, and content from the markdown returned by the AI.');
    }

    return { title, content, excerpt };
  }
);
