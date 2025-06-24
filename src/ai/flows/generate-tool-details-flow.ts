
'use server';
/**
 * @fileOverview A Genkit flow for generating detailed tool definitions from a simple idea.
 *
 * - generateToolDetails - A function that handles the AI tool detail generation process.
 * - GenerateToolDetailsInput - The input type for the function.
 * - GenerateToolDetailsOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { allToolIcons, allToolCategories } from '@/lib/quiz-data/tools-data';

// Extract names for the enum
const validIconNames = allToolIcons.map(icon => icon.name) as [string, ...string[]];
const validCategoryNames = allToolCategories as [string, ...string[]];

const GenerateToolDetailsInputSchema = z.object({
  toolIdea: z.string().describe('A brief idea or concept for a new tool.'),
  existingIds: z.array(z.string()).describe('A list of existing tool IDs to avoid creating duplicates.'),
});
export type GenerateToolDetailsInput = z.infer<typeof GenerateToolDetailsInputSchema>;

// This schema must match the ToolFormData schema in ToolCreatorForm.tsx
const GenerateToolDetailsOutputSchema = z.object({
  id: z.string().describe("A short, unique, kebab-case ID for the tool (e.g., 'breathing-exercise-visualizer')."),
  title: z.string().describe("A catchy, clear, and encouraging title for the tool (e.g., 'Adem-Anker')."),
  description: z.string().describe("A one-sentence description explaining what the tool does."),
  icon: z.enum(validIconNames).describe("The most appropriate icon name from the provided list."),
  category: z.enum(validCategoryNames).describe("The most appropriate category from the provided list."),
  reasoning: z.object({
    high: z.string().describe("Why this tool is essential for someone scoring high on a related trait (e.g., high anxiety, low focus)."),
    medium: z.string().describe("Why it's helpful for someone with average scores on a related trait."),
    low: z.string().describe("How someone who doesn't necessarily 'need' it could still benefit."),
  }),
  usage: z.object({
    when: z.string().describe("The ideal situation or moment for the user to use this tool."),
    benefit: z.string().describe("The single biggest, most tangible benefit for the user."),
  }),
});
export type GenerateToolDetailsOutput = z.infer<typeof GenerateToolDetailsOutputSchema>;


export async function generateToolDetails(
  input: GenerateToolDetailsInput
): Promise<GenerateToolDetailsOutput> {
  return generateToolDetailsFlow(input);
}

// Internal schema for the prompt, includes the arrays for iteration.
const PromptInputSchema = GenerateToolDetailsInputSchema.extend({
  validIconNames: z.array(z.string()),
  validCategoryNames: z.array(z.string()),
});

const prompt = ai.definePrompt({
  name: 'generateToolDetailsPrompt',
  input: { schema: PromptInputSchema },
  output: { schema: GenerateToolDetailsOutputSchema },
  prompt: `You are an expert UX writer and educational tool designer for MindNavigator, a platform for neurodivergent teens.

Your task is to take a simple tool idea and flesh it out into a complete, structured tool definition in Dutch.

Tool Idea: "{{toolIdea}}"

Fill out the following fields based on this idea:

1.  **id**: Create a short, unique, slug-like ID in kebab-case (e.g., 'breathing-exercise-visualizer', 'daily-gratitude-log'). It must NOT be one of these existing IDs: {{#if existingIds}}{{#each existingIds}}'{{this}}'{{#unless @last}}, {{/unless}}{{/each}}{{else}}none{{/if}}.
2.  **title**: A catchy, clear, and encouraging title for the tool (e.g., "Adem-Anker", "Dank-Dagboek").
3.  **description**: A one-sentence description explaining what the tool does.
4.  **icon**: Choose the MOST appropriate icon from this list of valid names: {{#each validIconNames}}'{{this}}'{{#unless @last}}, {{/unless}}{{/each}}.
5.  **category**: Choose the MOST appropriate category from this list: {{#each validCategoryNames}}'{{this}}'{{#unless @last}}, {{/unless}}{{/each}}.
6.  **reasoning**: Explain WHY this tool is recommended based on a user's quiz score (high, medium, low) for a relevant neurodiversity profile.
    *   **high**: Why is this tool essential for someone scoring high on a related trait (e.g., high anxiety, low focus)?
    *   **medium**: Why is it helpful for someone with average scores?
    *   **low**: How could someone who doesn't 'need' it still benefit?
7.  **usage**: Provide short, practical advice for the user.
    *   **when**: In what specific situation should the user use this tool?
    *   **benefit**: What is the single biggest, most tangible benefit for the user?

Keep all text in Dutch and tailor the tone to be supportive and empowering for teenagers.
`,
});

const generateToolDetailsFlow = ai.defineFlow(
  {
    name: 'generateToolDetailsFlow',
    inputSchema: GenerateToolDetailsInputSchema,
    outputSchema: GenerateToolDetailsOutputSchema,
  },
  async (input) => {
    const promptInput = {
      ...input,
      validIconNames: validIconNames,
      validCategoryNames: validCategoryNames,
    };

    const { output } = await prompt(promptInput);
    
    if (!output) {
      throw new Error('AI did not return the expected tool details structure.');
    }
    return output;
  }
);

