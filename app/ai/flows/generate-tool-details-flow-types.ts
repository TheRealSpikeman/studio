// src/ai/flows/generate-tool-details-flow-types.ts
import { z } from 'genkit';
import { allToolIcons, allToolCategories } from '@/lib/quiz-data/tools-data';

// Extract names for the enum
const validIconNames = allToolIcons.map(icon => icon.name) as [string, ...string[]];
const validCategoryNames = allToolCategories as [string, ...string[]];

export const GenerateToolDetailsInputSchema = z.object({
  toolIdea: z.string().describe('A brief idea or concept for a new tool.'),
  existingIds: z.array(z.string()).describe('A list of existing tool IDs to avoid creating duplicates.'),
});
export type GenerateToolDetailsInput = z.infer<typeof GenerateToolDetailsInputSchema>;

// This schema must match the ToolFormData schema in ToolCreatorForm.tsx
export const GenerateToolDetailsOutputSchema = z.object({
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
