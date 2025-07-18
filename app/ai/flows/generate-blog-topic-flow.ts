'use server';
/**
 * @fileOverview A Genkit flow for generating a single blog topic idea based on a persona.
 */
import { ai } from '@/ai/genkit';
import {
  GenerateBlogTopicInputSchema,
  GenerateBlogTopicOutputSchema,
  type GenerateBlogTopicInput,
  type GenerateBlogTopicOutput
} from './generate-blog-topic-types';

export async function generateBlogTopic(input: GenerateBlogTopicInput): Promise<GenerateBlogTopicOutput> {
  return generateBlogTopicFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateBlogTopicPrompt_v2_with_audience',
  input: { schema: GenerateBlogTopicInputSchema },
  output: { schema: GenerateBlogTopicOutputSchema },
  prompt: `
// ROLE
You are a creative content strategist. Your assigned persona for this task is:
{{{personaDescription}}}

// TASK
Your task is to suggest ONE single, compelling, and highly relevant blog post topic in Dutch. The topic should be suitable for the MindNavigator platform and specifically targeted at the following audience: **{{{targetAudience}}}**.

// INSTRUCTIONS
1.  The topic must be in Dutch.
2.  The topic should be specific enough to be covered in a 400-word blog post.
3.  The topic must be engaging for the specified target audience.
4.  Do NOT suggest one of the following existing topics: {{#each existingTopics}}"{{this}}"{{#unless @last}}, {{/unless}}{{/each}}.
5.  Your output must ONLY be the JSON object with the "topic" field. Do not add any conversational filler.

EXAMPLE OUTPUT:
{ "topic": "5 Manieren om je Tiener te Helpen met Overprikkeling na School" }
  `,
});


const generateBlogTopicFlow = ai.defineFlow(
  {
    name: 'generateBlogTopicFlow_v2_with_audience',
    inputSchema: GenerateBlogTopicInputSchema,
    outputSchema: GenerateBlogTopicOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    if (!output?.topic) {
        throw new Error('AI did not return a topic suggestion.');
    }
    return output;
  }
);
