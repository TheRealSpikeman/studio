
'use server';
/**
 * @fileOverview A Genkit flow for verifying quiz questions from the perspective of a psychologist.
 *
 * - verifyQuizQuestions - A function that handles the AI quiz verification process.
 * - VerifyQuizQuestionsInput - The input type for the function.
 * - VerifyQuizQuestionsOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const QuestionInputSchema = z.object({
  text: z.string().describe('The text of the quiz question.'),
  example: z.string().optional().describe('An optional example or clarification for the question.'),
});

const VerifyQuizQuestionsInputSchema = z.object({
  quizTitle: z.string().describe('The title of the quiz.'),
  quizAudience: z.string().describe('The target audience for the quiz (e.g., "Tiener (12-14 jr, voor zichzelf)").'),
  quizCategory: z.string().describe('The category of the quiz (e.g., "Emoties & Gevoelens").'),
  questions: z.array(QuestionInputSchema).describe('The list of questions to be verified.'),
});
export type VerifyQuizQuestionsInput = z.infer<typeof VerifyQuizQuestionsInputSchema>;

const SuggestionSchema = z.object({
  questionIndex: z.number().describe('The 0-based index of the question in the input array.'),
  originalText: z.string().describe('The original text of the question.'),
  issue: z.string().describe("A brief, clear description of the potential issue with the question (e.g., 'Ambiguous phrasing', 'Too complex for age group')."),
  suggestedRevision: z.string().describe('A concrete suggestion for a revised version of the question text.'),
});

const VerifyQuizQuestionsOutputSchema = z.object({
  overallStatus: z.enum(['Goedgekeurd', 'Goedgekeurd met suggesties', 'Revisie nodig']).describe("An overall assessment of the quiz quality. 'Goedgekeurd' if all questions are fine. 'Goedgekeurd met suggesties' if there are minor issues. 'Revisie nodig' if there are significant issues."),
  overallFeedback: z.string().describe("A concise summary (2-3 sentences) of the overall quality, tone, and suitability of the quiz questions for the target audience."),
  suggestions: z.array(SuggestionSchema).describe("A list of specific suggestions for questions that could be improved. This array should be empty if the overallStatus is 'Goedgekeurd'.")
});
export type VerifyQuizQuestionsOutput = z.infer<typeof VerifyQuizQuestionsOutputSchema>;

export async function verifyQuizQuestions(input: VerifyQuizQuestionsInput): Promise<VerifyQuizQuestionsOutput> {
  return verifyQuizQuestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'verifyQuizQuestionsPrompt',
  input: { schema: VerifyQuizQuestionsInputSchema },
  output: { schema: VerifyQuizQuestionsOutputSchema },
  prompt: `
CONTEXT: Je bent een ervaren kinder- en jeugdpsycholoog, gespecialiseerd in het ontwikkelen van psycho-educatieve vragenlijsten voor neurodivergente jongeren. Je bent gevraagd om een set vragen voor een nieuwe quiz op het MindNavigator platform te reviewen.

TAAK: Analyseer de volgende quiz en de bijbehorende vragen. Beoordeel de vragen op basis van de volgende criteria:
1.  **Duidelijkheid & Leeftijdsgeschiktheid:** Is de taal helder, eenvoudig en passend voor de doelgroep '{{{quizAudience}}}'?
2.  **Dubbelzinnigheid:** Kan een vraag verkeerd geïnterpreteerd worden? Zijn er meerdere manieren om de vraag te lezen?
3.  **Suggestiviteit/Bias:** Stuurt de vraag de gebruiker naar een bepaald antwoord? Is de vraag neutraal geformuleerd?
4.  **Toon:** Is de toon van de vragen ondersteunend, niet-oordelend en empowerend?
5.  **Relevantie:** Zijn de vragen consistent met de titel ('{{{quizTitle}}}') en categorie ('{{{quizCategory}}}') van de quiz?

OUTPUT:
1.  **Overall Status:** Bepaal een algehele status:
    -   'Goedgekeurd': Alle vragen zijn van hoge kwaliteit en direct bruikbaar.
    -   'Goedgekeurd met suggesties': De quiz is goed, maar enkele vragen kunnen met kleine aanpassingen verbeterd worden.
    -   'Revisie nodig': Er zijn significante problemen met een of meerdere vragen die aandacht vereisen.
2.  **Overall Feedback:** Geef een korte, professionele samenvatting (2-3 zinnen) van je bevindingen.
3.  **Suggestions:** Maak een lijst van ALLEEN de vragen die verbeterd kunnen worden. Voor elke vraag die je aanpast, geef je het origineel, het probleem en een concreet, verbeterd voorstel. Als alle vragen goed zijn, laat je deze lijst leeg.

QUIZ DETAILS:
-   Titel: {{{quizTitle}}}
-   Doelgroep: {{{quizAudience}}}
-   Categorie: {{{quizCategory}}}

VRAGEN OM TE VERIFIËREN:
{{#each questions}}
-   Vraag {{index}}: "{{text}}" {{#if example}}(Voorbeeld: "{{example}}"){{/if}}
{{/each}}
`,
});

const verifyQuizQuestionsFlow = ai.defineFlow(
  {
    name: 'verifyQuizQuestionsFlow',
    inputSchema: VerifyQuizQuestionsInputSchema,
    outputSchema: VerifyQuizQuestionsOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    if (!output) {
      throw new Error("AI did not return verification feedback.");
    }
    return output;
  }
);

