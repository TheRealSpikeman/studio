// services/progressService.ts
import { getQuizzes } from './quizService';
import type { ChildProgressData, QuizResult } from '@/types/dashboard';

/**
 * Fetches and aggregates progress data for a specific child.
 * This is a mock implementation and will be expanded to include tutor feedback,
 * activity logs, and goals from their respective services.
 *
 * @param {string} childId - The ID of the child to fetch progress data for.
 * @returns {Promise<ChildProgressData | null>} A promise that resolves to the aggregated progress data or null if not found.
 */
export const getProgressDataForChild = async (childId: string): Promise<ChildProgressData | null> => {
  console.log(`Fetching progress data for child: ${childId}`);
  
  // In a real implementation, we would fetch data from multiple sources:
  // 1. Fetch child details from userService
  // 2. Fetch completed quizzes for this child from a quizResultService
  // 3. Fetch tutor feedback from a feedbackService
  // 4. Fetch activity data from an activityLogService
  // 5. Fetch goals from a goalService

  // For now, we'll mock this by using some of the existing dummy data structures,
  // but accessed through this service layer.

  const allQuizzes = await getQuizzes();
  const recentQuizzes: QuizResult[] = allQuizzes
    .slice(0, 2) // Take the first two quizzes as an example
    .map((quiz, index) => ({
      id: `result-${quiz.id}`,
      quizId: quiz.id,
      title: quiz.title,
      dateCompleted: new Date(Date.now() - (index + 1) * 5 * 86400000).toISOString(),
      score: 'Mock Score',
      reportData: {
          summary: `This is a mock summary for the completed quiz "${quiz.title}".`,
          answers: [],
          scores: {},
      },
      isShared: true,
      userId: childId,
    }));

  const mockProgressData: ChildProgressData = {
    id: childId,
    name: `Mock Child ${childId}`,
    avatarUrl: `https://picsum.photos/seed/${childId}/80/80`,
    ageGroup: '12-14',
    recentQuizzes: recentQuizzes,
    tutorFeedback: [
      { feedbackId: 'fb-mock-1', date: new Date().toISOString(), tutorName: 'Mevr. Jansen', lessonSubject: 'Wiskunde', comment: 'Goed gewerkt vandaag!' },
    ],
    activityData: [
      { month: 'Jan', completedLessons: 3, completedQuizzes: 1 },
      { month: 'Feb', completedLessons: 4, completedQuizzes: 2 },
    ],
    goals: [
      { goalId: 'goal-mock-1', description: 'Wiskunde huiswerk op tijd afmaken.', status: 'in_progress' }
    ]
  };

  return mockProgressData;
};
