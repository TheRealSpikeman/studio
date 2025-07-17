// src/app/api/generate-ai-quiz/route.ts
import { NextResponse } from 'next/server';
import { generateAiQuiz } from '@/ai/flows/generate-ai-quiz-flow';
import type { GenerateAiQuizInput } from '@/app/ai/flows/generate-ai-quiz-flow-types';

export async function POST(request: Request) {
  try {
    const input: GenerateAiQuizInput = await request.json();

    if (!input || !input.topic || !input.audience) {
      return NextResponse.json({ error: 'Invalid input provided for quiz generation.' }, { status: 400 });
    }

    // Call the server-only Genkit flow
    const quizResult = await generateAiQuiz(input);
    
    return NextResponse.json(quizResult);
  } catch (error) {
    console.error('Error in /api/generate-ai-quiz:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred during quiz generation.';
    return NextResponse.json({ error: 'Failed to generate quiz questions.', details: errorMessage }, { status: 500 });
  }
}
