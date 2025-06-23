// src/lib/constants/coaching.ts

import { startOfDay, format } from 'date-fns';

interface DailyTask {
  id: string;
  label: string;
  completed: boolean;
}

export const COACHING_CONFIG = {
  START_DATE: startOfDay(new Date(Date.now() - 86400000 * 30)),
  
  JOURNEY_STEPS: {
    WELCOME_SEEN: 'journey_welcome_seen_v1',
    QUIZ_COMPLETED: 'journey_quiz_completed_v1',
    FIRST_COACHING_VIEWED: 'journey_first_coaching_viewed_v1',
    SEVEN_DAY_STREAK: 'journey_seven_day_streak_v1'
  },

  generateStaticDailyTasks: (date: Date): DailyTask[] => {
    const baseTasks = [
      { id: 'task1-static', label: 'Doe 5 minuten ademhalingsoefening', completed: false },
      { id: 'task2-static', label: 'Lees de dagelijkse affirmatie', completed: false },
      { id: 'task3-static', label: 'Schrijf één ding op waar je dankbaar voor bent', completed: false },
    ];
    return baseTasks.map(task => ({ ...task, id: `${task.id}-${format(date, 'yyyy-MM-dd')}` }));
  },

  getVideoSeedForDate: (date: Date): string => {
    return `videotip-${format(date, 'yyyy-MM-dd')}`;
  },
};
