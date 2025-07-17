// src/types/feedback.ts

export type FeedbackType = 'bug' | 'suggestie' | 'algemeen' | 'ui_ux';
export type FeedbackPriority = 'laag' | 'normaal' | 'hoog';
export type FeedbackStatus = 'nieuw' | 'in behandeling' | 'afgehandeld' | 'gesloten';

export interface FeedbackEntry {
  id?: string; // Made optional for new entries
  timestamp: string; // ISO date string
  name?: string;
  email?: string;
  feedbackType: FeedbackType;
  pageOrFeature: string; // Can be one of the predefined options or 'anders'
  otherPageOrFeature?: string; // Only if pageOrFeature is 'anders'
  description: string;
  priority: FeedbackPriority;
  status?: FeedbackStatus; // For admin to manage
}
