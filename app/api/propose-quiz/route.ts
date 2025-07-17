// src/app/api/propose-quiz/route.ts
import { NextResponse } from 'next/server';
import { proposeQuizFromBlog } from '@/ai/flows/propose-quiz-from-blog-flow';
import type { ProposeQuizFromBlogInput } from '@/ai/flows/propose-quiz-from-blog-flow-types';
import type { QuizCreationState } from '@/contexts/QuizCreatorContext';

// Define the shape of the request body, which differs slightly from the flow input
interface ProposeQuizApiInput extends ProposeQuizFromBlogInput {
  authorAudienceType: 'teen' | 'parent' | 'adult';
  authorTargetAgeGroup: '12-14' | '15-18' | '18+' | 'all';
}

export async function POST(request: Request) {
  try {
    const input: ProposeQuizApiInput = await request.json();
    
    // Call the first AI flow
    const proposal = await proposeQuizFromBlog({
      blogTitle: input.blogTitle,
      blogContent: input.blogContent,
      targetAudience: input.targetAudience,
    });

    // Construct the QuizCreationState object, same logic as in the old action
    const quizDraft: QuizCreationState = {
        creationType: 'ai',
        audienceType: input.authorAudienceType,
        targetAgeGroup: input.authorTargetAgeGroup,
        title: proposal.title,
        description: proposal.description,
        mainCategory: proposal.mainCategory,
        estimatedDuration: proposal.estimatedDuration,
        difficulty: proposal.difficulty,
        resultType: 'ai-summary', 
        settings: {
          resultPresentation: { showToParent: true, format: 'visual_report', showChart: true, showParentalCta: false },
          saveResultsToProfile: true,
          coachIntegration: { enabled: true, specializations: [] },
          accessibility: { isPublic: true, allowedPlans: [] },
          schoolPartnerships: { enabled: false, targetGroups: [] },
          contentModeration: { required: true },
          showRecommendedTools: true,
        },
        questions: [],
    };
    
    return NextResponse.json({ success: true, data: quizDraft });
  } catch (error) {
    console.error('Error in /api/propose-quiz:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return NextResponse.json({ success: false, error: 'Failed to propose quiz.', details: errorMessage }, { status: 500 });
  }
}
