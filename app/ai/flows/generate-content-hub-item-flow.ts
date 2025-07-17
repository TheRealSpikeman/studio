// app/ai/flows/generate-content-hub-item-flow.ts
'use server';

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import {
  GenerateContentHubItemInputSchema,
  GenerateContentHubItemOutputSchema,
} from './generate-content-hub-item-types';

export async function generateStructuredContent(input: z.infer<typeof GenerateContentHubItemInputSchema>) {
    const validatedInput = GenerateContentHubItemInputSchema.parse(input);
    return await generateStructuredContentFlow(validatedInput);
}

const structuredContentPrompt = ai.definePrompt(
    {
        name: 'structuredContentGenerator',
        input: { schema: GenerateContentHubItemInputSchema },
        output: { schema: GenerateContentHubItemOutputSchema, format: 'json' },
        prompt: `
            Je bent een UX Writer en UI Designer voor MindNavigator, een platform voor neurodivergentie.
            Je taak is om een prompt om te zetten in een rijk, gestructureerd en visueel aantrekkelijk content-item.
            De output moet een perfect JSON-object zijn dat voldoet aan het opgegeven schema.

            CONTEXT:
            - Platform: MindNavigator
            - Doelgroep(en): {{#each userRoles}}{{this}}{{#unless @last}}, {{/unless}}{{/each}}

            INSTRUCTIES:
            1.  **Genereer een Titel:** Creëer een duidelijke, pakkende titel voor de hele handleiding.
            2.  **Genereer Gestructureerde Content:**
                a. **Kies een Thema Kleur:** Selecteer een van de volgende kleuren die het beste past bij de content: 'teal', 'amber', 'rose', 'blue', 'indigo'.
                b. **Creëer Secties (2 tot 4):** Voor elke sectie:
                    i. **Kies een Icoon:** Selecteer een relevante icoon-naam uit de 'lucide-react' bibliotheek (bv. 'BookCopy', 'ShieldCheck', 'Heart', 'Puzzle').
                    ii. **Schrijf een Titel:** Geef de sectie een korte, krachtige titel.
                    iii. **Schrijf een Paragraaf:** Schrijf een heldere, inleidende paragraaf.
                    iv. **Maak een Lijst:** Som 2 tot 4 concrete tips of punten op.
            3.  **Genereer een Categorie:** Bepaal de meest logische categorie. Kies uit: Accountbeheer, Tools, Abonnementen, Coaching, Veiligheid, Algemeen.
            4.  **Genereer Tags:** Creëer een lijst van 3 tot 5 relevante en specifieke zoekwoorden/tags in lowercase.

            GEBRUIKERSPROMPT:
            "{{prompt}}"
        `,
    }
);

const generateStructuredContentFlow = ai.defineFlow(
  {
    name: 'generateStructuredContentFlow',
    inputSchema: GenerateContentHubItemInputSchema,
    outputSchema: GenerateContentHubItemOutputSchema,
  },
  async (input) => {
    const llmResponse = await structuredContentPrompt(input);
    const output = llmResponse.output; // CORRECTED: This is now a property, not a function.
    if (!output) {
      throw new Error("AI-model gaf geen antwoord. Probeer het opnieuw.");
    }
    return output;
  }
);
