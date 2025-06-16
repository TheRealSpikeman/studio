// src/types/user.ts
export type UserStatus = 'actief' | 'niet geverifieerd' | 'geblokkeerd' | 'pending_onboarding' | 'pending_approval' | 'rejected';
export type UserRole = 'admin' | 'coach' | 'leerling' | 'tutor' | 'ouder';
export type AgeGroup = "12-14" | "15-18" | "adult";

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  status: UserStatus;
  role: UserRole;
  ageGroup?: AgeGroup; 
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
    totalRevenue?: number; 
    averageRating?: number;
  };
  // Placeholder for future parent-child relationship
  children?: string[]; // Array of child User IDs

  // School and study related information, primarily for leerling role
  schoolName?: string;
  className?: string;
  schoolType?: string;
  helpSubjects?: string[]; // Array of subject IDs the student needs help with
}
