// src/types/user.ts
export type UserStatus = 'actief' | 'niet geverifieerd' | 'geblokkeerd' | 'pending_onboarding' | 'pending_approval' | 'rejected';
export type UserRole = 'admin' | 'coach' | 'deelnemer' | 'tutor'; // Added 'tutor' role
export type AgeGroup = "12-14" | "15-18" | "adult";

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  status: UserStatus;
  role: UserRole;
  ageGroup?: AgeGroup; // Added age group
  lastLogin: string; // ISO date string
  createdAt: string; // ISO date string
  coaching?: {
    startDate?: string; // ISO date string
    interval?: number; // days
    currentDayInFlow?: number;
  };
  tutorDetails?: {
    subjects?: string[];
    hourlyRate?: number;
    bio?: string;
    availability?: string;
    cvUrl?: string; // URL to CV
    vogUrl?: string; // URL to VOG
    // For display in admin tutor management, might be derived elsewhere in a real app
    totalRevenue?: number; 
    averageRating?: number;
  };
}

```