// src/lib/data/initial-activity-log.ts
import type { ActivityLogEntry } from '@/types/activity-log';

// This file contains dummy data to demonstrate the activity log feature.
// In a real implementation, this data would be generated automatically by a backend process.
export const initialActivityLog: Omit<ActivityLogEntry, 'id'>[] = [
  { date: new Date(Date.now() - 86400000 * 5).toISOString(), startTime: '13:00', endTime: '16:00', durationMinutes: 180 },
  { date: new Date(Date.now() - 86400000 * 4).toISOString(), startTime: '09:30', endTime: '12:30', durationMinutes: 180 },
  { date: new Date(Date.now() - 86400000 * 4).toISOString(), startTime: '13:30', endTime: '15:00', durationMinutes: 90 },
  { date: new Date(Date.now() - 86400000 * 3).toISOString(), startTime: '10:15', endTime: '12:00', durationMinutes: 105 },
  { date: new Date(Date.now() - 86400000 * 2).toISOString(), startTime: '14:30', endTime: '16:45', durationMinutes: 135 },
  { date: new Date(Date.now() - 86400000 * 1).toISOString(), startTime: '11:00', endTime: '13:30', durationMinutes: 150 },
  { date: new Date().toISOString(), startTime: '09:05', endTime: '11:30', durationMinutes: 145 },
];
