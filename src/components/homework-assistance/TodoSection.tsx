// src/components/homework-assistance/TodoSection.tsx
"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { PlusCircle, Trash2, ListChecks } from 'lucide-react';

interface Task {
  id: string;
  text: string;
  completed: boolean;
  subject?: string; // Optional: to associate with a subject
}

export function TodoSection() {
  const [tasks, setTasks] = useState<Task[]>([
    { id: '1', text: 'Nederlands samenvatting H1 maken', completed: false, subject: 'Nederlands' },
    { id: '2', text: 'Wiskunde oefeningen §2.3', completed: true, subject: 'Wiskunde' },
    { id: '3', text: 'Voorbereiden presentatie Engels', completed: false, subject: 'Engels' },
  ]);
  const [newTaskText, setNewTaskText] = useState('');

  const handleAddTask = () => {
    if (newTaskText.trim() === '') return;
    const newTask: Task = {
      id: Date.now().toString(),
      text: newTaskText,
      completed: false,
    };
    setTasks(prevTasks => [newTask, ...prevTasks]);
    setNewTaskText('');
  };

  const toggleTaskCompletion = (taskId: string) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const deleteTask = (taskId: string) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
  };

  const completedTasksCount = tasks.filter(task => task.completed).length;
  const totalTasksCount = tasks.length;

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ListChecks className="h-6 w-6 text-primary" />
          Algemene To-Do Lijst
        </CardTitle>
        <CardDescription>
          Houd hier je algemene huiswerktaken bij. 
          {totalTasksCount > 0 && ` (${completedTasksCount}/${totalTasksCount} voltooid)`}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder="Voeg een nieuwe taak toe..."
            value={newTaskText}
            onChange={(e) => setNewTaskText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddTask()}
          />
          <Button onClick={handleAddTask} disabled={!newTaskText.trim()}>
            <PlusCircle className="h-4 w-4 mr-2 sm:mr-0 md:mr-2" />
             <span className="hidden sm:inline md:hidden lg:inline">Taak</span>
          </Button>
        </div>
        <div className="max-h-60 overflow-y-auto pr-1 space-y-3">
          {tasks.length === 0 && <p className="text-sm text-muted-foreground text-center py-4">Nog geen taken. Voeg er een toe!</p>}
          {tasks.map(task => (
            <div key={task.id} className="flex items-center justify-between p-2 rounded-md border hover:bg-muted/30 transition-colors">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={`task-${task.id}`}
                  checked={task.completed}
                  onCheckedChange={() => toggleTaskCompletion(task.id)}
                  aria-label={task.text}
                />
                <Label
                  htmlFor={`task-${task.id}`}
                  className={`cursor-pointer ${task.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}
                >
                  {task.text}
                  {task.subject && <span className="ml-2 text-xs text-primary/80">({task.subject})</span>}
                </Label>
              </div>
              <Button variant="ghost" size="icon" onClick={() => deleteTask(task.id)} className="h-7 w-7 text-muted-foreground hover:text-destructive">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
