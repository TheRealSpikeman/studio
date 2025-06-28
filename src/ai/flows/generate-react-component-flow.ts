'use server';
/**
 * @fileOverview A Genkit flow for generating a React component for a tool.
 */

import { ai } from '@/ai/genkit';
import {
  GenerateReactComponentInputSchema,
  GenerateReactComponentOutputSchema,
  type GenerateReactComponentInput,
  type GenerateReactComponentOutput
} from './generate-react-component-flow-types';


export async function generateReactComponent(input: GenerateReactComponentInput): Promise<GenerateReactComponentOutput> {
  return generateReactComponentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateReactComponentPrompt',
  input: { schema: GenerateReactComponentInputSchema },
  output: { schema: GenerateReactComponentOutputSchema },
  prompt: `
    You are an expert Next.js developer tasked with creating a single, complete React component file.

    **Instructions:**
    1.  The component must be a client component. Start the file with \`'use client';\`.
    2.  Use TypeScript for all code.
    3.  Use shadcn/ui components (e.g., <Card>, <Button>, <Input>, <Label>, <Switch>) for the UI. Import them from '@/components/ui/...'.
    4.  Use lucide-react for icons.
    5.  Use Tailwind CSS for styling, applying it via the \`className\` prop.
    6.  The component should be functional, interactive, and visually represent the core idea of the tool described below. State management should be handled with React hooks (\`useState\`, \`useEffect\`).
    7.  The entire output must be a single block of code representing the final content of the .tsx file. Do not add any explanations before or after the code.

    **Tool to Build:**
    -   **Title:** "{{title}}"
    -   **Description:** "{{description}}"

    **Component Logic (Simulation):**
    -   The component should visually simulate the tool's functionality. For a "Distraction Blocker", this means having a list of sites, a way to add to it, a timer, and a toggle.
    -   It does not need to actually block websites in the browser. This is a UI/UX simulation.
    -   Ensure all necessary imports are included.
    -   The main export should be the component function.
    -   Use appropriate state management to make the UI interactive (e.g., handling the toggle state, adding items to a list).
  `,
});

const generateReactComponentFlow = ai.defineFlow(
  {
    name: 'generateReactComponentFlow',
    inputSchema: GenerateReactComponentInputSchema,
    outputSchema: GenerateReactComponentOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    if (!output) {
      throw new Error('AI did not return any component code.');
    }
    return output;
  }
);
