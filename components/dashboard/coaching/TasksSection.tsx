// src/components/dashboard/coaching/TasksSection.tsx
"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { ListTodo } from '@/lib/icons';
import { COACHING_CONFIG } from '@/lib/constants/coaching';
import { format } from 'date-fns';

interface DailyTask {
  id: string;
  label: string;
  completed: boolean;
}

interface AiCoachingContent {
  dailyAffirmation: string;
  dailyCoachingTip: string;
  microTaskSuggestion: string;
}

interface TasksSectionProps {
  isLoading: boolean;
  content: AiCoachingContent | null;
  selectedDate: Date | undefined;
}

export const TasksSection = ({ isLoading, content, selectedDate }: TasksSectionProps) => {
  const [tasks, setTasks] = useState<DailyTask[]>([]);
  
  useEffect(() => {
    if (selectedDate) {
      const staticTasks = COACHING_CONFIG.generateStaticDailyTasks(selectedDate);
      if (content?.microTaskSuggestion) {
        const aiTask: DailyTask = { 
          id: `ai-task-${format(selectedDate, 'yyyy-MM-dd')}`, 
          label: content.microTaskSuggestion, 
          completed: false 
        };
        setTasks([aiTask, ...staticTasks]);
      } else {
        setTasks(staticTasks);
      }
    } else {
      setTasks([]);
    }
  }, [selectedDate, content]);

  const handleTaskToggle = (taskId: string) => {
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };
  
  return (
    <Card className="shadow-lg">
      <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ListTodo className="h-6 w-6 text-accent" />
            Jouw Microtaken {selectedDate ? `voor ${format(selectedDate, 'PPP', { locale: 'nl' })}` : ''}
          </CardTitle>
          <p className="text-sm text-muted-foreground pt-2">
            <strong>Coaching Tip: </strong> 
            {isLoading ? 
              <span className="inline-block w-full"><Skeleton className="h-4 w-5/6" /></span> : 
              <span className="italic">{content?.dailyCoachingTip || "Geen tip beschikbaar."}</span>
            }
          </p>
      </CardHeader>
      <CardContent className="space-y-3">
        {isLoading ? <Skeleton className="h-20 w-full" /> : null}
        {!isLoading && tasks.length > 0 ? (
          tasks.map(task => (
            <div key={task.id} className="flex items-center space-x-2 p-2 rounded-md hover:bg-muted/50 transition-colors">
              <Checkbox 
                id={task.id} 
                checked={task.completed}
                onCheckedChange={() => handleTaskToggle(task.id)}
                aria-label={task.label}
              />
              <Label htmlFor={task.id} className={`cursor-pointer ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
                {task.label}
              </Label>
            </div>
          ))
        ) : (
          !isLoading && <p className="text-muted-foreground">Geen taken voor deze dag.</p>
        )}
      </CardContent>
       <CardFooter>
        <p className="text-sm text-muted-foreground">Voltooi je taken om je streak te behouden!</p>
      </CardFooter>
    </Card>
  );
};
