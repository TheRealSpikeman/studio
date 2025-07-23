
'use server';
import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import {
  QuizAnalysisInputSchema,
  QuizAnalysisOutputSchema,
  type QuizAnalysisInput,
  type QuizAnalysisOutput
} from './generate-quiz-analysis-flow-types';
import { mostRelevantToolPrompt, defaultAnalysisPrompt, parentAnalysisPrompt, personalityAnalysisPrompt } from './prompts';

export async function generateQuizAnalysis(input: QuizAnalysisInput): Promise<QuizAnalysisOutput> {
  return generateQuizAnalysisFlow(input);
}


const generateQuizAnalysisFlow = ai.defineFlow(
  {
    name: 'generateQuizAnalysisFlow',
    inputSchema: QuizAnalysisInputSchema,
    outputSchema: QuizAnalysisOutputSchema,
  },
  async (input) => {
    
    const finalScoresArray = Object.entries(input.finalScores || {}).map(([category, score]) => ({
        category,
        score
    }));

    const analysisInput = {
        ...input,
        finalScoresArray: finalScoresArray,
        isParentPerspective: input.quizAudience.toLowerCase().includes('ouder'),
        isScoreBased: input.resultType === 'score_based' || (!!input.finalScores && Object.keys(input.finalScores).length > 0),
        isPersonalityType: input.resultType === 'personality-4-types' && !!input.personalityTypeResult,
        numAnsweredQuestions: input.answeredQuestions.length,
        validation: undefined,
    };
    
    let prompt;
    if (input.quizAudience.toLowerCase().includes('ouder')) {
        prompt = parentAnalysisPrompt;
    } else if (input.resultType === 'personality-4-types') {
        prompt = personalityAnalysisPrompt;
    } else {
        prompt = defaultAnalysisPrompt;
    }
    
    const { output } = await prompt(analysisInput);
    if (!output) {
      throw new Error('AI did not return a valid analysis.');
    }
    
    return output;
  }
);
