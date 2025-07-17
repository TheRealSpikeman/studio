// types/content-hub.ts
import type { Timestamp } from 'firebase/firestore';

export type UserRole = 'admin' | 'content_manager' | 'ouder' | 'leerling' | 'coach' | 'tutor';
export type BadgeVariant = 'default' | 'secondary' | 'destructive' | 'outline';

// This is the new, rich, structured format for all content items.
// The old 'content' string field will be deprecated.
export interface StructuredContent {
    themeColor: 'teal' | 'amber' | 'rose' | 'blue' | 'indigo';
    sections: Array<{
        iconName: string; // A valid lucide-react icon name
        title: string;
        paragraph: string;
        points: string[];
    }>;
}

export interface ContentItem {
  id: string;
  title: string;
  // DEPRECATED: content: string;
  structuredContent: StructuredContent; // All visual content is now stored here
  category: string;
  tags: string[];
  userRoles: UserRole[];
  status: 'draft' | 'published' | 'archived';
  viewCount: number;
  helpfulVotes: { up: number; down: number };
  createdAt: Timestamp;
  updatedAt: Timestamp;
  createdBy: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string; // For now, FAQ answers remain simple text.
  category: string;
  userRoles: UserRole[];
  viewCount: number;
  helpfulVotes: { up: number; down: number };
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface SearchAnalytics {
    id?: string;
    term: string;
    timestamp: Timestamp;
    userRole: UserRole;
    foundResults: boolean;
    resultCount: number;
}
