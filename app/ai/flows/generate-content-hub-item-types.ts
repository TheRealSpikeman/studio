// app/ai/flows/generate-content-hub-item-types.ts

import { z } from 'zod';

export const StructuredContentSchema = z.object({
    themeColor: z.enum(['teal', 'amber', 'rose', 'blue', 'indigo']).describe("A theme color for the component, used for borders and backgrounds."),
    sections: z.array(z.object({
        iconName: z.string().describe("A valid icon name from the lucide-react library (e.g., 'BookCopy', 'ShieldCheck')."),
        title: z.string(),
        paragraph: z.string().describe("An introductory paragraph for the section."),
        points: z.array(z.string()).describe("A list of key takeaways or bullet points.")
    }))
});

export const GenerateContentHubItemInputSchema = z.object({
  prompt: z.string().min(10, "De prompt moet minstens 10 karakters lang zijn."),
  userRoles: z.array(z.string()).min(1, "Er moet minstens één gebruikersrol geselecteerd zijn."),
});

export const GenerateContentHubItemOutputSchema = z.object({
  title: z.string(),
  suggestedCategory: z.string(),
  suggestedTags: z.array(z.string()),
  structuredContent: StructuredContentSchema,
});


export type GenerateContentHubItemInput = z.infer<typeof GenerateContentHubItemInputSchema>;
export type GenerateContentHubItemOutput = z.infer<typeof GenerateContentHubItemOutputSchema>;
export type StructuredContent = z.infer<typeof StructuredContentSchema>;
