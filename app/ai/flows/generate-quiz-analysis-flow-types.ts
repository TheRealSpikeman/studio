// src/ai/flows/generate-quiz-analysis-flow-types.ts
import {z} from 'genkit';

export const AnsweredQuestionSchema = z.object({
  question: z.string().describe('The text of the quiz question.'),
  answer: z.string().describe('The textual representation of the user_s chosen answer, possibly including the numeric value like "Vaak (3)".'),
  profileKey: z.string().optional().describe('The neurodiversity profile key this question primarily relates to (e.g., ADD, HSP), if applicable.'),
});

// Enums for better type safety and autocomplete, as you suggested.
export const MainCategoryEnum = z.enum([
  'emoties_gevoelens',
  'vriendschappen_sociaal', 
  'leren_school',
  'prikkels_omgeving',
  'wie_ben_ik',
  'dromen_toekomst',
]);
export const SpecificFocusEnum = z.enum(['adhd-friendly', 'autism-friendly', 'hsp-friendly']);
export const QuizFocusEnum = z.enum([
  'algemeen', 'adhd-vriendelijk', 'autisme-vriendelijk', 
  'hsp-vriendelijk', 'dyslexie-vriendelijk', 'hoogbegaafdheid',
  'executieve-functies', 'sensorische-verwerking', 'emotieregulatie'
]);
export const QuizTypeEnum = z.enum(['template', 'adaptive', 'ai-generated', 'scratch']);


// The main input schema now captures all wizard settings.
export const GenerateQuizAnalysisInputSchema = z.object({
  quizTitle: z.string().describe('The title of the quiz.'),
  quizAudience: z.string().describe(
    'The target audience for the quiz (e.g., "Tiener (12-14 jr, voor zichzelf)", "Ouder (over kind 6-11 jr)").'
  ),
  childName: z.string().optional().describe("The name of the child, if provided by the parent, for personalizing the report."),
  ageGroup: z.string().describe('The target age group of the user (e.g., "12-14 jaar", "15-18 jaar").'),
  finalScores: z.record(z.number()).optional().describe('A record of final scores for each neurodiversity profile (e.g., ADD, HSP).'),
  personalityTypeResult: z.string().optional().describe('The resulting personality type if the quiz was not score-based.'),
  answeredQuestions: z.array(AnsweredQuestionSchema).describe('An array of questions the user answered.'),
  
  // UPDATED & NEW FIELDS FROM WIZARD
  primaryCategories: z.array(MainCategoryEnum).optional().describe("Array of primary categories for the quiz."),
  quizFocus: z.array(QuizFocusEnum).optional().describe("Array of specific focus flags to tailor the AI's tone and content."),
  quizType: QuizTypeEnum.optional().describe("The type of quiz, used to adjust the report's framing."),

  resultType: z.enum(['score_based', 'personality-4-types', 'ai-summary']).optional().describe("The type of result the quiz produces."),
  difficulty: z.enum(['laag', 'gemiddeld', 'hoog']).optional().describe("The difficulty of the quiz."),
  analysisDetailLevel: z.enum(['beknopt', 'standaard', 'uitgebreid']).optional().describe("The desired detail level for the analysis."),
  
  // FLATTENED SETTINGS for UI presentation
  showChart: z.boolean().optional(),
  showParentalCta: z.boolean().optional(),
});
export type GenerateQuizAnalysisInput = z.infer<typeof GenerateQuizAnalysisInputSchema>;

export const GenerateQuizAnalysisOutputSchema = z.object({
  analysis: z.string().describe('A comprehensive textual analysis of the quiz results, in HTML format, tailored to the user_s age, answers, and all wizard settings.'),
  scores: z.record(z.number()).optional().describe("A record of final scores for each neurodiversity profile, matching the input scores, to be used for generating charts."),
});
export type GenerateQuizAnalysisOutput = z.infer<typeof GenerateQuizAnalysisOutputSchema>;
