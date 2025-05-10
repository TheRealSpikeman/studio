// src/types/user.ts
export type UserStatus = 'actief' | 'niet geverifieerd' | 'geblokkeerd' | 'pending_onboarding' | 'pending_approval' | 'rejected';
export type UserRole = 'admin' | 'coach' | 'deelnemer' | 'tutor'; // Added 'tutor' role

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  status: UserStatus;
  role: UserRole;
  lastLogin: string; // ISO date string
  createdAt: string; // ISO date string
  coaching?: {
    startDate?: string; // ISO date string
    interval?: number; // days
    currentDayInFlow?: number;
  };
  // Tutor specific fields, can be expanded
  tutorDetails?: {
    subjects?: string[];
    hourlyRate?: number;
    bio?: string;
    availability?: string;
    cvUrl?: string; // URL to CV
    vogUrl?: string; // URL to VOG
  };
}

