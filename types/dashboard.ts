// src/types/dashboard.ts
import type { User, AgeGroup } from './user';
import type { SubscriptionPlan } from './subscription';
import { z } from "zod";
import type { QuizAudience } from './quiz-admin';

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

// From ouder/kinderen/[kindId]/profiel/page.tsx
export interface Child extends Pick<User, 'id' | 'name' | 'ageGroup' | 'avatarUrl' | 'hulpvraagType' > { 
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
// Alias for consistency with other parts of the codebase
export type ChildProfile = Child;


export const editableChildFormSchema = z.object({
  firstName: z.string().min(2, { message: "Voornaam moet minimaal 2 tekens bevatten." }),
  lastName: z.string().min(2, { message: "Achternaam moet minimaal 2 tekens bevatten." }),
  ageGroup: z.enum(['12-14', '15-18', 'adult']),
  childEmail: z.string().email({ message: "Voer een geldig e-mailadres in." }).optional().or(z.literal('')),
  schoolType: z.string().optional(),
  otherSchoolType: z.string().optional(),
  className: z.string().optional(),
  helpSubjects: z.array(z.string()).optional(),
  hulpvraagType: z.array(z.enum(['tutor', 'coach'])).optional(),
  selectedLeerdoelen: z.array(z.string()).optional(),
  otherLeerdoelen: z.string().max(250, "Toelichting mag maximaal 250 tekens bevatten.").optional(),
  selectedTutorPreferences: z.array(z.string()).optional(),
  otherTutorPreference: z.string().max(250, "Toelichting mag maximaal 250 tekens bevatten.").optional(),
  avatarUrl: z.string().url({ message: "Ongeldige URL." }).nullable().optional(),
}).refine(data => {
  if (data.schoolType === "Anders" && (!data.otherSchoolType || data.otherSchoolType.trim() === "")) {
    return false;
  }
  return true;
}, {
  message: "Specificatie voor 'Ander schooltype' is vereist.",
  path: ["otherSchoolType"], 
});

export type EditableChildData = z.infer<typeof editableChildFormSchema>;


// From ouder/kinderen/[kindId]/voortgang/page.tsx
export interface QuizAnswer { question: string; answer: string; }

// Comprehensive result object saved after a quiz is completed
export interface QuizResult {
  id: string;
  userId?: string; // New: who took it?
  userName?: string; // New: who took it?
  quizId: string; // ID of the quiz definition
  title: string;
  dateCompleted: string; // ISO
  score: string; // New field, e.g. "Profiel: ADD & HSP"
  audience?: QuizAudience;
  reportData: {
    summary: string;
    answers?: QuizAnswer[];
    aiAnalysis?: string;
    tips?: string[];
    scores?: Record<string, number>;
    settings?: { // Store the quiz settings at time of completion
      showChart?: boolean;
      showParentalCta?: boolean;
      showRecommendedTools?: boolean;
    };
  };
  isShared: boolean;
  ageGroup?: AgeGroup;
  reportLink?: string;
}

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
