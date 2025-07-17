// src/types/activity-log.ts
export interface ActivityLogEntry {
  id: string; // Firestore document ID
  date: string; // ISO String for the day
  startTime: string; // e.g., "09:05"
  endTime: string; // e.g., "11:30"
  durationMinutes: number;
}
