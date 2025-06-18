// src/types/user.ts
export type UserStatus = 'actief' | 'niet geverifieerd' | 'geblokkeerd' | 'pending_onboarding' | 'pending_approval' | 'rejected' | 'wacht_op_ouder_goedkeuring';
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
  geboortedatum?: string; // ISO date string, new for age calculation
  requires_parent_approval?: boolean; 
  parent_user_id?: string; // ID of the approving parent
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
  children?: string[]; // Array of child User IDs, if this user is a parent
  schoolName?: string;
  className?: string;
  schoolType?: string;
  helpSubjects?: string[]; 
  hulpvraagType?: ('tutor' | 'coach')[]; 
}

