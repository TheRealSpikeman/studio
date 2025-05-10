'use server';
/**
 * @fileOverview A Genkit flow for generating AI-powered analysis of quiz results.
 *
 * - generateQuizAnalysis - A function that handles the AI quiz result analysis process.
 * - GenerateQuizAnalysisInput - The input type for the generateQuizAnalysis function.
 * - GenerateQuizAnalysisOutput - The return type for the generateQuizAnalysis function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnsweredQuestionSchema = z.object({
  question: z.string().describe('The text of the quiz question.'),
  answer: z.string().describe('The textual representation of the user_s chosen answer, possibly including the numeric value like "Vaak (3)".'),
  profileKey: z.string().optional().describe('The neurodiversity profile key this question primarily relates to (e.g., ADD, HSP), if applicable.'),
});

const GenerateQuizAnalysisInputSchema = z.object({
  quizTitle: z.string().describe('The title of the quiz.'),
  ageGroup: z.string().describe('The target age group of the user (e.g., "12-14 jaar", "15-18 jaar").'),
  finalScores: z.record(z.number()).describe('A record of final scores for each neurodiversity profile, where keys are profile IDs (e.g., ADD, HSP) and values are numeric scores (typically 1-4).'),
  answeredQuestions: z.array(AnsweredQuestionSchema).describe('An array of questions the user answered, including the question text and their chosen answer text.')
});
export type GenerateQuizAnalysisInput = z.infer<typeof GenerateQuizAnalysisInputSchema>;

const GenerateQuizAnalysisOutputSchema = z.object({
  analysis: z.string().describe('A comprehensive textual analysis of the quiz results, tailored to the user_s age and answers.'),
});
export type GenerateQuizAnalysisOutput = z.infer<typeof GenerateQuizAnalysisOutputSchema>;

export async function generateQuizAnalysis(
  input: GenerateQuizAnalysisInput
): Promise<GenerateQuizAnalysisOutput> {
  return generateQuizAnalysisFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateQuizAnalysisPrompt',
  input: {schema: GenerateQuizAnalysisInputSchema},
  output: {schema: GenerateQuizAnalysisOutputSchema},
  prompt: `You are an expert in neurodiversity and psycho-educational assessments for teenagers.
Analyze the following quiz results for a user aged {{{ageGroup}}}.
Quiz Title: {{{quizTitle}}}

Overall Profile Scores (average score for each category, scale 1-4):
{{#each finalScores}}
- {{@key}}: {{{this}}}
{{/each}}

Detailed Answers:
{{#each answeredQuestions}}
Question: {{{this.question}}}
{{#if this.profileKey}}(Relates to: {{{this.profileKey}}}){{/if}}
Answer: {{{this.answer}}}

{{/each}}

Provide a comprehensive analysis covering:
1.  Interpretation of the overall profile scores under the heading "Jouw Profiel In Vogelvlucht":
    For each neurodiversity profile (e.g., ADD, ADHD, HSP, ASS, AngstDepressie) from the 'Overall Profile Scores' section, provide its score and an interpretation.
    Start each interpretation with the profile name and its score, for example: "ADD (Score: X.XX): [Your interpretation here]".
    What do these scores suggest about the user's neurodivergent traits? Highlight prominent areas. Explain what high or low scores in each category generally mean for this age group.
2.  Patterns in answers: Are there specific themes or types of questions where the user consistently answered in a particular way (e.g., consistently high scores on questions related to sensory sensitivity, or consistently low scores on impulsivity questions)?
3.  Potential strengths indicated by the answers and scores. Connect these strengths to real-life examples relevant for a teenager.
4.  Potential challenges or areas for self-awareness indicated by the answers and scores. Offer gentle and constructive framing.
5.  Actionable insights or reflection points for the teenager, tailored to their age group. These should be practical and encouraging.
Maintain a supportive, encouraging, and easy-to-understand tone suitable for teenagers.
The analysis should be detailed (at least 250-300 words) and insightful, going beyond simple restatements of the scores.
Focus on helping the teenager understand themselves better and provide a positive, empowering perspective on their neurodiversity.
Structure the output with clear headings for each section of the analysis (e.g., "Jouw Profiel In Vogelvlucht", "Sterke Kanten", "Aandachtspunten", "Tips voor Jou").
Ensure the language used is appropriate and relatable for the specified {{{ageGroup}}}.
`,
});

const generateQuizAnalysisFlow = ai.defineFlow(
  {
    name: 'generateQuizAnalysisFlow',
    inputSchema: GenerateQuizAnalysisInputSchema,
    outputSchema: GenerateQuizAnalysisOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error('AI did not return an analysis.');
    }
    return output;
  }
);

