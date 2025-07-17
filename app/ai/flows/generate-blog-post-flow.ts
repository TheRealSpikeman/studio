
'use server';
/**
 * @fileOverview A Genkit flow for generating blog post content from a single topic idea.
 * This is the v19 fix: Removed the output schema to force raw text output, aligning with the prompt's instructions.
 */
import { ai } from '@/app/ai/genkit';
import { z } from 'genkit';
import {
  GenerateBlogPostInputSchema,
  GenerateBlogPostOutputSchema,
  type GenerateBlogPostInput,
  type GenerateBlogPostOutput
} from './generate-blog-post-types';
import { getAllBlogTags } from '@/config/blog-tags';

export async function generateBlogPost(input: GenerateBlogPostInput): Promise<GenerateBlogPostOutput> {
  return generateBlogPostFlow(input);
}

// Define an internal schema that includes the dynamic list of tags
const InternalPromptInputSchema = GenerateBlogPostInputSchema.extend({
  availableTags: z.string().describe('A comma-separated list of available tags for the AI to choose from.'),
});

// Define the prompt ONCE at the module level.
const prompt = ai.definePrompt({
  name: 'generateBlogPostPrompt_v19_raw_text',
  input: { schema: InternalPromptInputSchema },
  // No output schema is defined. This tells Genkit to expect raw text output from the model.
  prompt: `
// ROLE
You are an expert content creator. Your primary task is to write a blog post in Dutch, perfectly embodying the persona described below.

// PERSONA
Your assigned persona for this task is:
{{{personaDescription}}}

// TASK
Write a comprehensive, engaging, and well-structured blog post on the following topic:
"{{{topic}}}"

// TARGET AUDIENCE
The primary target audience for this blog post is: {{{targetAudience}}}.
Your tone, word choice, and examples must be perfectly tailored to this audience. For example, if the audience is "Tieners 12-14", use accessible language and relatable examples. If it's "Ouders", address their specific concerns and questions.

// INSTRUCTIONS & FORMATTING
1.  The entire blog post must be in Dutch.
2.  The content must be at least 400 words.
3.  Use simple HTML tags for structure in the main content (e.g., <h2>, <h3>, <p>, <ul>, <li>, <strong>, <em>, <ol>). Do NOT include <html>, <head>, or <body> tags.
4.  The tone and style must strictly adhere to the persona and target audience provided.
5.  The VERY FIRST line of the response MUST be the H1 title, starting with "# ". This title must be concise, engaging, and ideally between 40 and 70 characters long. For example: "# De Toekomst van Leren".
6.  The SECOND line of the response MUST be a short, catchy, one-sentence summary (excerpt) of the blog post. Do not add any special formatting to this line.
7.  The THIRD line MUST be a comma-separated list of 3-5 relevant, single-word, lowercase keywords (tags). CHOOSE TAGS *EXCLUSIVELY* FROM THE FOLLOWING PRE-APPROVED LIST. Start this line with "TAGS: ".
    Approved Tags: {{{availableTags}}}
    For example: "TAGS: focus, ouders, strategieën".
8.  The FOURTH line MUST be one or two simple, lowercase keywords for an image search, representing the article's theme. Start this line with "IMAGE_HINT: ". For example: "IMAGE_HINT: brain connection".
9.  The FIFTH line MUST be empty.
10. The rest of the content, starting from the SIXTH line, should be the HTML body of the blog post.

EXAMPLE OUTPUT STRUCTURE:
# Titel van de Blogpost
Dit is een pakkende samenvatting die uitnodigt om verder te lezen.
TAGS: tag1, tag2, tag3
IMAGE_HINT: hint1 hint2

<h2>Eerste Sectie</h2>
<p>Hier begint de daadwerkelijke <strong>HTML-content</strong> van het artikel...</p><ul><li>Een punt in een lijst</li></ul>

Do not include any text, explanation, or conversational filler before or after the response content.
  `,
});


const generateBlogPostFlow = ai.defineFlow(
  {
    name: 'generateBlogPostFlow_v19_raw_text',
    inputSchema: GenerateBlogPostInputSchema,
    outputSchema: GenerateBlogPostOutputSchema,
  },
  async (input) => {
    // Get the dynamic list of tags on each execution
    const availableTags = getAllBlogTags().join(', ');

    // Call the single, module-level prompt with the extended input object
    const response = await prompt({
      ...input,
      availableTags,
    });

    const rawTextOutput = response.text;

    if (!rawTextOutput || rawTextOutput.trim() === '') {
      throw new Error('AI did not return any content.');
    }
    
    const lines = rawTextOutput.split('\n');
    
    let title = '';
    let excerpt = '';
    let tags: string[] = [];
    let featuredImageHint = '';
    let content = '';

    if (lines.length >= 5 && lines[0]?.trim().startsWith('# ')) {
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
        console.warn("AI output did not follow the header structure. Parsing as fallback.");
        title = "Titel niet gevonden in AI output";
        excerpt = "Samenvatting niet gevonden.";
        tags = [];
        featuredImageHint = 'abstract';
        content = rawTextOutput;
    }

    if (!title || !content) {
        console.error("Parsing failed for title or content. AI Output was:\n", rawTextOutput);
        throw new Error('Could not parse title or content from the text returned by the AI.');
    }

    if (!excerpt) {
        console.warn("Excerpt was missing, generating a fallback from content.");
        const strippedContent = content.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
        excerpt = strippedContent.substring(0, 150) + (strippedContent.length > 150 ? '...' : '');
    }

    // Ensure excerpt is never empty, even after fallback.
    if (!excerpt) {
      excerpt = `Lees meer over: ${title}`;
    }

    return { title, content, excerpt, tags, featuredImageHint };
  }
);
