// lib/ai/changelog-generator.ts
import { generate } from 'genkit'; // Corrected: import from the root package
import { configureGenkit } from '@/app/ai/genkit';
import { z } from 'zod';
import { softwareEngineerPersona } from '@/app/ai/personas'; // Assuming a persona definition exists

// Define the expected structure of the AI's output using Zod for validation
const ChangelogSchema = z.object({
    title: z.string().describe("Een pakkende, informatieve titel voor deze update (max. 10 woorden)."),
    description: z.string().describe("Een korte, duidelijke beschrijving van de wijziging voor een niet-technische gebruiker (1-2 zinnen)."),
    tags: z.array(z.string()).describe("Een lijst van 2 tot 4 relevante tags (kies uit: 'New Feature', 'Bugfix', 'Improvement', 'Admin', 'Database', 'UI/UX', 'AI', 'Performance', 'Security')."),
    details: z.array(z.string()).describe("Een lijst van 2 tot 5 bullet points die de specifieke wijzigingen in detail beschrijven voor een meer technisch publiek.")
});

/**
 * Analyzes a git diff using an AI model and generates a structured changelog entry.
 * 
 * @param {string} diff - The git diff string containing the code changes.
 * @returns {Promise<z.infer<typeof ChangelogSchema> | null>} A promise that resolves to the structured changelog data, or null if generation fails.
 */
export async function generateChangelogFromDiff(diff: string): Promise<z.infer<typeof ChangelogSchema> | null> {
    try {
        // Ensure Genkit is configured for use
        configureGenkit();

        const model = softwareEngineerPersona; // Use a pre-defined model with specific instructions

        const prompt = `
            Analyze the following git diff. Based on these code changes, generate a concise and clear changelog entry.
            The target audience for the title and description is the end-user. The details are for team members.
            
            Focus on the *user-facing impact* and the *purpose* of the changes, not just a literal description of the code. For example, instead of "updated state management", say "improved loading speed on the dashboard".

            Here is the git diff:
            \`\`\`diff
            ${diff}
            \`\`\`

            Provide the output in the requested JSON format.
        `;

        const { output } = await generate({
            model,
            prompt,
            output: {
                format: 'json',
                schema: ChangelogSchema,
            },
        });

        return output || null;

    } catch (error) {
        console.error("AI changelog generation failed:", error);
        return null;
    }
}
