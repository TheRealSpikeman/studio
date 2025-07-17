// src/ai/flows/compare-parent-child-insights-types.ts
import {z} from 'genkit';

export const QuizAnswerSchema = z.object({
  question: z.string().describe("The text of the question that was answered."),
  answer: z.string().describe("The answer given by the user."),
});

export const CompareParentChildInputSchema = z.object({
  childName: z.string().describe("The name of the child for personalization in the advice."),
  childAgeGroup: z.string().describe("The age group of the child (e.g., '12-14 jaar', '15-18 jaar') to contextualize the advice."),
  parentObservations: z.array(QuizAnswerSchema).describe("An array of questions and answers from the parent's 'Ken je Kind' quiz, focusing on perceived strengths and challenges. Dit representeert de 'OUDER PERSPECTIEF' input."),
  childSelfReflection: z.array(QuizAnswerSchema).describe("An array of questions and answers from the child's 'Zelfreflectie Tool', highlighting recognized traits and experiences. Dit representeert de 'KIND PERSPECTIEF' input."),
});
export type CompareParentChildInput = z.infer<typeof CompareParentChildInputSchema>;

export const CompareParentChildOutputSchema = z.object({
  parentingAdvice: z.string().describe("AI-generated advice for the parent, structured according to the ANALYSE FRAMEWORK, including sections on perception gaps, shared strengths, blind spots, communication opportunities, and actionable family tips. The advice should be empathetic, constructive, and actionable."),
});
export type CompareParentChildOutput = z.infer<typeof CompareParentChildOutputSchema>;
