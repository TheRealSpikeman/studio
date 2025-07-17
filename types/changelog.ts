// src/types/changelog.ts
export interface ChangelogTag {
  text: string;
  variant: 'default' | 'secondary' | 'destructive' | 'outline';
}

export interface ChangelogEntry {
  id: string; // Firestore document ID - nu verplicht
  date: string; // ISO String voor Firestore compatibiliteit
  title: string;
  iconName: string; // Store the name of the Lucide icon
  description: string;
  details?: string[];
  tags: ChangelogTag[];
}
