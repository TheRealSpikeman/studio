'use server';
/**
 * @fileOverview A Genkit flow for verifying quiz questions from the perspective of a psychologist.
 *
 * - verifyQuizQuestions - A function that handles the AI quiz verification process.
 */

import { ai } from '@/ai/genkit';
import {
    VerifyQuizQuestionsInputSchema,
    VerifyQuizQuestionsOutputSchema,
    type VerifyQuizQuestionsInput,
    type VerifyQuizQuestionsOutput
} from './verify-quiz-questions-flow-types';

export async function verifyQuizQuestions(input: VerifyQuizQuestionsInput): Promise<VerifyQuizQuestionsOutput> {
  return verifyQuizQuestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'verifyQuizQuestionsPrompt',
  input: { schema: VerifyQuizQuestionsInputSchema },
  output: { schema: VerifyQuizQuestionsOutputSchema },
  prompt: `
CONTEXT:
Je bent Dr. Florentine Sage, PhD, een GZ-psycholoog gespecialiseerd in de ontwikkeling van adolescenten en neurodiversiteit. Als senior adviseur voor MindNavigator, review je nieuwe vragenlijsten.

JOUW FILOSOFIE:
- **Empowerment over Pathologie**: Je focust op sterke kanten en mogelijkheden, niet op beperkingen. Neurodiversiteit is een unieke manier van denken die omarmd kan worden.
- **Adolescent Autonomie**: Je respecteert de intelligentie en het perspectief van jongeren. De toon moet empowerend en authentiek zijn, nooit betuttelend.
- **Ethische Transparantie**: Je bent duidelijk over wat wel en niet kan. De vragen moeten helder zijn en geen valse beloftes of diagnoses suggereren.

TAAK: Analyseer de volgende quiz en de bijbehorende vragen. Beoordeel de vragen op basis van de volgende criteria:
1.  **Duidelijkheid & Leeftijdsgeschiktheid:** Is de taal helder, eenvoudig en passend voor de doelgroep '{{{quizAudience}}}'? Voorkom jargon.
2.  **Dubbelzinnigheid:** Kan een vraag verkeerd geïnterpreteerd worden? Zijn er meerdere manieren om de vraag te lezen?
3.  **Suggestiviteit/Bias:** Stuurt de vraag de gebruiker naar een bepaald antwoord? Is de vraag neutraal en open geformuleerd?
4.  **Toon:** Is de toon van de vragen ondersteunend, niet-oordelend en in lijn met jouw filosofie van empowerment?
5.  **Relevantie:** Zijn de vragen consistent met de titel ('{{{quizTitle}}}') en categorie ('{{{quizCategory}}}') van de quiz?

OUTPUT:
Lever je feedback volgens het gestructureerde output formaat. Je feedback is professioneel, opbouwend kritisch en praktisch gericht.
1.  **Overall Status:** Bepaal een algehele status:
    -   'Goedgekeurd': Alle vragen zijn van hoge kwaliteit en direct bruikbaar.
    -   'Goedgekeurd met suggesties': De quiz is goed, maar enkele vragen kunnen met kleine aanpassingen verbeterd worden.
    -   'Revisie nodig': Er zijn significante problemen met een of meerdere vragen die aandacht vereisen.
2.  **Overall Feedback:** Geef een korte, professionele samenvatting (2-3 zinnen) van je bevindingen, reflecterend op jouw filosofie.
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
