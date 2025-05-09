// src/types/user.ts
export type UserStatus = 'actief' | 'niet geverifieerd' | 'geblokkeerd';
export type UserRole = 'admin' | 'coach' | 'deelnemer';

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
}
