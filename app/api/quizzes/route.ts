// src/app/api/quizzes/route.ts
import { NextResponse } from 'next/server';
import { storageService } from '@/services/storageService';
import type { QuizAdmin } from '@/types/quiz-admin';

export const dynamic = 'force-dynamic'; // Ensures the route is not cached

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const audience = searchParams.get('audience');

  try {
    const allQuizzes = await storageService.getAllQuizzes();
    
    let filteredQuizzes: QuizAdmin[] = allQuizzes;

    if (audience === 'public') {
      filteredQuizzes = allQuizzes.filter(q =>
        q.status === 'published' &&
        q.settings?.accessibility?.isPublic === true
      );
    }

    return NextResponse.json(filteredQuizzes);
  } catch (error) {
    console.error('Error in /api/quizzes:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return NextResponse.json({ error: 'Failed to fetch quizzes.', details: errorMessage }, { status: 500 });
  }
}
