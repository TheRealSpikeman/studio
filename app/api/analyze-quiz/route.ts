// src/app/api/analyze-quiz/route.ts
import { NextResponse } from 'next/server';
import { generateQuizAnalysis } from '@/ai/flows/generate-quiz-analysis-flow';
import type { GenerateQuizAnalysisInput } from '@/ai/flows/generate-quiz-analysis-flow-types';

export async function POST(request: Request) {
  try {
    const input: GenerateQuizAnalysisInput = await request.json();

    if (!input || !input.quizTitle || !input.answeredQuestions) {
      return NextResponse.json({ error: 'Invalid input provided for analysis.' }, { status: 400 });
    }

    // Call the server-only Genkit flow
    const analysisResult = await generateQuizAnalysis(input);
    
    return NextResponse.json(analysisResult);
  } catch (error) {
    console.error('Error in /api/analyze-quiz:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred during quiz analysis.';
    return NextResponse.json({ error: 'Failed to generate quiz analysis.', details: errorMessage }, { status: 500 });
  }
}
