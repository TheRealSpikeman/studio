// src/types/dashboard.ts
import type { User, AgeGroup } from './user';
import type { SubscriptionPlan } from './subscription';

// From ouder/berichten/page.tsx
export interface Message {
  id: string;
  sender: 'ouder' | 'tutor';
  text: string;
  timestamp: string;
  isRead?: boolean;
}
export interface Conversation {
  id: string;
  tutorId: string;
  tutorName: string;
  tutorAvatar?: string;
  childName: string;
  lastMessage: string;
  lastMessageTimestamp: string;
  unreadCount: number;
  messages: Message[];
}

// From ouder/facturatie/page.tsx
export interface OuderSubscription {
  id: string;
  childName: string;
  planName: string;
  price: string;
  status: 'actief' | 'opgezegd' | 'verlopen';
  nextBillingDate?: string;
}
export interface PayableLesson {
  id: string;
  childName: string;
  subject: string;
  tutorName: string;
  lessonDate: string;
  amount: number;
}

// From ouder/gekoppelde-tutors/page.tsx
export interface ChildBase {
  id: string;
  name: string;
  avatarUrl?: string;
}
export interface ProfessionalBase {
  id: string;
  name: string;
  type: 'tutor' | 'coach';
  avatarUrl?: string;
  specializations: string[];
}

// From ouder/kinderen/page.tsx and profiel page
export interface ChildProfile extends Pick<User, 'id' | 'name' | 'ageGroup' | 'avatarUrl' | 'hulpvraagType' > { 
  firstName: string;
  lastName: string;
  age?: number;
  childEmail?: string;
  schoolType?: string;
  otherSchoolType?: string;
  className?: string;
  helpSubjects?: string[];
  subscriptionStatus: 'actief' | 'geen' | 'verlopen' | 'uitgenodigd';
  planId?: SubscriptionPlan['id'];
  planName?: string; 
  lastActivity?: string;
  leerdoelen?: string; 
  voorkeurTutor?: string; 
  deelResultatenMetTutor?: boolean; 
  linkedTutorIds?: string[]; 
}

// From ouder/kinderen/[kindId]/voortgang/page.tsx
export interface QuizAnswer { question: string; answer: string; }
export interface QuizResult { quizId: string; title: string; dateCompleted: string; summary: string; answers?: QuizAnswer[]; isShared: boolean; reportLink?: string; }
export interface TutorFeedback { feedbackId: string; date: string; tutorName: string; lessonSubject: string; comment: string; }
export interface ActivityPoint { month: string; completedLessons: number; completedQuizzes: number; }
export interface Goal { goalId: string; description: string; status: 'in_progress' | 'achieved' | 'pending'; }
export interface ChildProgressData { id: string; name: string; avatarUrl?: string; ageGroup?: AgeGroup; recentQuizzes: QuizResult[]; tutorFeedback: TutorFeedback[]; activityData: ActivityPoint[]; goals?: Goal[]; }

// From tutor/lessons/page.tsx and coach/lessons/page.tsx
export type SessionStatus = 'Gepland' | 'Voltooid' | 'Geannuleerd' | 'Bezig';
export type ReportRecipient = 'student' | 'parent' | 'both' | 'client';

export interface Lesson { id: string; studentId: string; studentName: string; studentAvatar?: string; subject: string; dateTime: string; durationMinutes: number; status: SessionStatus; meetingLink?: string; notes?: string; report?: string; }
export interface CoachingSession { id: string; clientId: string; clientName: string; clientAvatar?: string; sessionTopic: string; dateTime: string; durationMinutes: number; status: SessionStatus; meetingLink?: string; notes?: string; report?: string; }

// From tutor/students/page.tsx and coach/students/page.tsx
export interface StudentEntry { id: string; name: string; avatarUrl?: string; subjectsTaughtByTutor: string[]; lastLessonDate?: string; totalLessonsWithTutor?: number; }
export interface ClientEntry { id: string; name: string; avatarUrl?: string; coachingFocusAreas: string[]; lastSessionDate?: string; totalSessionsWithCoach?: number; }

// From tutor/students/[studentId]/page.tsx
export interface LessonForHistory { id: string; subject: string; dateTime: string; durationMinutes: number; status: SessionStatus; report?: string; }
export interface StudentDetails { id: string; name: string; avatarUrl?: string; email?: string; lessonHistory: LessonForHistory[]; }

// From ouder/lessen pages
export interface ScheduledLesson {
  id: string; childId: string; childName: string; subject: string; subjectId: string; dateTime: string;
  durationMinutes: number; tutorName: string; status: SessionStatus; recurringGroupId?: string; report?: string;
}
