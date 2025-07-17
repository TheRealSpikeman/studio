// src/types/user.ts
import { UserStatus } from './status';
export type UserRole = 'admin' | 'coach' | 'leerling' | 'tutor' | 'ouder';
export type AgeGroup = "12-15" | "16-18" | "18+";

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  status: UserStatus;
  role: UserRole;
  lastLogin: string; 
  createdAt: string; 
  
  // New personal and contact info
  phone?: string;
  birthDate?: string; // ISO date string

  // New address object
  address?: {
    street?: string;
    city?: string;
    zip?: string;
    country?: string;
  };
  
  billingAddress?: {
    street?: string;
    city?: string;
    zip?: string;
    country?: string;
  };

  // New communication preferences object
  communicationPreferences?: {
    email: boolean;
    sms: boolean;
  };

  // Role-specific properties
  ageGroup?: AgeGroup; 
  geboortedatum?: string;
  requires_parent_approval?: boolean; 
  parentId?: string;
  coaching?: {
    startDate?: string;
    interval?: number;
    currentDayInFlow?: number;
  };
  tutorDetails?: {
    subjects?: string[];
    hourlyRate?: number;
    bio?: string;
    availability?: string;
    cvUrl?: string;
    vogUrl?: string;
    totalRevenue?: number; 
    averageRating?: number;
  };
  coachDetails?: {
    specializations?: string[];
    hourlyRate?: number;
    bio?: string;
    availability?: string;
  };
  children?: string[];
  schoolName?: string;
  className?: string;
  schoolType?: string;
  helpSubjects?: string[]; 
  hulpvraagType?: ('tutor' | 'coach')[]; 
}
