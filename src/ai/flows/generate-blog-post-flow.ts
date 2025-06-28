
'use server';
/**
 * @fileOverview A Genkit flow for generating blog post content from a single topic idea.
 * This is the v12 fix: AI returns a raw string with Title, Excerpt, Tags, Image Hint, and Content to maximize stability.
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
  name: 'generateBlogPostPrompt_v12_with_image_hint',
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
8.  The THIRD line MUST be a comma-separated list of 3-5 relevant, single-word, lowercase keywords (tags). Start this line with "TAGS: ". For example: "TAGS: focus, ouders, neurodiversiteit".
9.  The FOURTH line MUST be one or two simple, lowercase keywords for an image search, representing the article's theme. Start this line with "IMAGE_HINT: ". For example: "IMAGE_HINT: brain connection".
10. The FIFTH line MUST be empty.
11. The rest of the content should follow from the SIXTH line onwards.

EXAMPLE OUTPUT STRUCTURE:
# Titel van de Blogpost
Dit is een pakkende samenvatting die uitnodigt om verder te lezen.
TAGS: tag1, tag2, tag3
IMAGE_HINT: hint1 hint2

## Eerste Sectie
Hier begint de daadwerkelijke content van het artikel...

Do not include any text, explanation, or conversational filler before or after the markdown content.
  `,
});

const generateBlogPostFlow = ai.defineFlow(
  {
    name: 'generateBlogPostFlow_v12_with_image_hint',
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
    let tags: string[] = [];
    let featuredImageHint = '';
    let content = '';

    if (lines.length >= 6 && lines[0]?.trim().startsWith('# ')) {
        title = lines[0].substring(2).trim();
        excerpt = lines[1]?.trim() || '';
        
        const tagsLine = lines[2]?.trim() || '';
        if (tagsLine.toUpperCase().startsWith('TAGS:')) {
          tags = tagsLine.substring(6).split(',').map(tag => tag.trim().toLowerCase()).filter(Boolean);
        }
        
        const hintLine = lines[3]?.trim() || '';
        if (hintLine.toUpperCase().startsWith('IMAGE_HINT:')) {
          featuredImageHint = hintLine.substring(12).trim();
        }

        // Skip the title, excerpt, tags, hint and the blank line
        content = lines.slice(5).join('\n').trim();
    } else {
        // Fallback if the AI doesn't follow instructions
        console.warn("AI output did not follow the 6-line header structure. Parsing as fallback.");
        title = "Titel niet gevonden in AI output";
        excerpt = "Samenvatting niet gevonden.";
        tags = [];
        featuredImageHint = 'abstract';
        content = rawMarkdownOutput;
    }

    if (!title || !content || !excerpt) {
        console.error("Parsing failed. AI Output was:\n", rawMarkdownOutput);
        throw new Error('Could not parse title, excerpt, and content from the markdown returned by the AI.');
    }

    return { title, content, excerpt, tags, featuredImageHint };
  }
);
