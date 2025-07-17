// src/ai/flows/generate-react-component-flow-types.ts
import { z } from 'genkit';

export const GenerateReactComponentInputSchema = z.object({
  title: z.string().describe('The title of the tool.'),
  description: z.string().describe('A brief description of what the tool does.'),
});
export type GenerateReactComponentInput = z.infer<typeof GenerateReactComponentInputSchema>;

export const GenerateReactComponentOutputSchema = z.object({
  componentCode: z.string().describe('The complete TypeScript code for the React component file.'),
});
export type GenerateReactComponentOutput = z.infer<typeof GenerateReactComponentOutputSchema>;
