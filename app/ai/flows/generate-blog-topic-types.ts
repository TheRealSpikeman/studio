// src/ai/flows/generate-blog-topic-types.ts
import { z } from 'genkit';

export const GenerateBlogTopicInputSchema = z.object({
  personaDescription: z.string().describe('A description of the AI persona to use for suggesting a blog post topic.'),
  targetAudience: z.string().describe('The target audience for whom the topic should be relevant (e.g., "Ouders", "Tieners 12-14").'),
  existingTopics: z.array(z.string()).describe('A list of existing blog topics to avoid duplicates.'),
});
export type GenerateBlogTopicInput = z.infer<typeof GenerateBlogTopicInputSchema>;

export const GenerateBlogTopicOutputSchema = z.object({
  topic: z.string().describe('A single, engaging, and relevant blog post topic idea.'),
});
export type GenerateBlogTopicOutput = z.infer<typeof GenerateBlogTopicOutputSchema>;
