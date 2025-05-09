// src/components/homework-assistance/PomodoroSection.tsx
"use client";

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Timer, Play, Pause, RotateCcw, Coffee } from 'lucide-react';

const WORK_DURATION = 25 * 60; // 25 minutes in seconds
const BREAK_DURATION = 5 * 60; // 5 minutes in seconds

export function PomodoroSection() {
  const [timeLeft, setTimeLeft] = useState(WORK_DURATION);
  const [isActive, setIsActive] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [sessionsCompleted, setSessionsCompleted] = useState(0);

  const resetTimer = useCallback(() => {
    setIsActive(false);
    setIsBreak(false);
    setTimeLeft(WORK_DURATION);
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prevTime => prevTime - 1);
      }, 1000);
    } else if (isActive && timeLeft === 0) {
      // Audio notification placeholder
      // try { new Audio('/sounds/timer-end.mp3').play(); } catch (e) { console.warn("Audio play failed");}
      
      if (isBreak) {
        // Break ended, start new work session
        setIsBreak(false);
        setTimeLeft(WORK_DURATION);
      } else {
        // Work session ended, start break
        setSessionsCompleted(prev => prev + 1);
        setIsBreak(true);
        setTimeLeft(BREAK_DURATION);
      }
      // Keep timer active for the new session/break
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft, isBreak]);

  const toggleTimer = () => {
    setIsActive(!isActive);
  };
  
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Timer className="h-6 w-6 text-primary" />
          Pomodoro Focus Timer
        </CardTitle>
        <CardDescription>
          Werk {WORK_DURATION / 60} min, neem {BREAK_DURATION / 60} min pauze. Verhoog je productiviteit!
        </CardDescription>
      </CardHeader>
      <CardContent className="text-center space-y-4">
        <div className={`text-6xl font-bold ${isBreak ? 'text-accent' : 'text-foreground'}`}>
          {formatTime(timeLeft)}
        </div>
        <div className="flex justify-center gap-3">
          <Button onClick={toggleTimer} size="lg" className="min-w-[100px]">
            {isActive ? <Pause className="mr-2 h-5 w-5" /> : <Play className="mr-2 h-5 w-5" />}
            {isActive ? 'Pauze' : 'Start'}
          </Button>
          <Button onClick={resetTimer} variant="outline" size="lg">
            <RotateCcw className="mr-2 h-5 w-5" />
            Reset
          </Button>
        </div>
         <div className="text-sm text-muted-foreground">
            {isBreak ? <Coffee className="inline-block mr-1 h-4 w-4 text-accent" /> : <Timer className="inline-block mr-1 h-4 w-4 text-primary" /> }
            Huidige modus: {isBreak ? 'Pauze' : 'Werk'}
        </div>
      </CardContent>
      <CardFooter className="flex-col items-center">
        <p className="text-sm text-muted-foreground">Sessies voltooid vandaag: {sessionsCompleted}</p>
        <p className="text-xs text-muted-foreground italic mt-2">
          Elke Pomodoro-sessie helpt je diep te concentreren.
        </p>
      </CardFooter>
    </Card>
  );
}
