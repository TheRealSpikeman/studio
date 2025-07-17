// src/components/tools/FocusTimer.tsx
"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Timer, Play, Pause, RotateCcw, Settings, Coffee, Brain } from 'lucide-react';
import { CircularProgress } from '@/components/ui/circular-progress';
import { useToast } from '@/hooks/use-toast';

type TimerMode = 'work' | 'shortBreak' | 'longBreak';

function FocusTimer() {
  const { toast } = useToast();

  const [durations, setDurations] = useState({
    work: 25,
    shortBreak: 5,
    longBreak: 15,
  });
  const [mode, setMode] = useState<TimerMode>('work');
  const [timeLeft, setTimeLeft] = useState(durations.work * 60);
  const [isActive, setIsActive] = useState(false);
  const [cycles, setCycles] = useState(0);
  const longBreakInterval = 4;

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const resetTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    setIsActive(false);
    setTimeLeft(durations[mode] * 60);
  }, [durations, mode]);

  const switchMode = useCallback((newMode: TimerMode) => {
    setMode(newMode);
    setTimeLeft(durations[newMode] * 60);
    setIsActive(false);
  }, [durations]);

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      if (timerRef.current) clearInterval(timerRef.current);
      setIsActive(false);

      toast({
        title: `Tijd voor je ${mode === 'work' ? 'pauze' : 'volgende focus sessie'}!`,
        description: `De ${durations[mode]} minuten zijn om.`,
      });

      if (mode === 'work') {
        const newCycles = cycles + 1;
        setCycles(newCycles);
        if (newCycles % longBreakInterval === 0) {
          switchMode('longBreak');
        } else {
          switchMode('shortBreak');
        }
      } else {
        switchMode('work');
      }
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, timeLeft, mode, cycles, durations, switchMode, toast]);

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const handleDurationChange = (e: React.ChangeEvent<HTMLInputElement>, mode: TimerMode) => {
    const newDuration = parseInt(e.target.value, 10);
    if (!isNaN(newDuration) && newDuration > 0) {
      setDurations((prev) => ({ ...prev, [mode]: newDuration }));
      if (mode === 'work' && !isActive) {
        setTimeLeft(newDuration * 60);
      }
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const progress = (timeLeft / (durations[mode] * 60)) * 100;
  const currentModeText = mode === 'work' ? 'Focus Sessie' : mode === 'shortBreak' ? 'Korte Pauze' : 'Lange Pauze';

  return (
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-foreground flex items-center gap-3">
            <Timer className="h-8 w-8 text-primary" />
            Focus Timer
          </CardTitle>
          <CardDescription>Gebruik de Pomodoro techniek om je productiviteit te verhogen.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="flex flex-col items-center justify-center relative">
            <CircularProgress progress={progress} size={220} strokeWidth={10} />
            <div className="absolute flex flex-col items-center">
              <span className="text-5xl sm:text-6xl font-bold font-mono tabular-nums">{formatTime(timeLeft)}</span>
              <span className="text-md sm:text-lg text-muted-foreground">{currentModeText}</span>
            </div>
          </div>
          <div className="space-y-6">
            <Card className="p-4 bg-muted/50">
              <h4 className="font-semibold mb-3">Acties</h4>
              <div className="flex flex-col sm:flex-row gap-2">
                <Button onClick={toggleTimer} className="flex-1">
                  {isActive ? <Pause className="mr-2 h-4 w-4" /> : <Play className="mr-2 h-4 w-4" />}
                  {isActive ? 'Pauzeer' : 'Start'}
                </Button>
                <Button onClick={resetTimer} variant="outline">
                  <RotateCcw className="mr-2 h-4 w-4" /> Reset
                </Button>
              </div>
            </Card>
            <Card className="p-4 bg-muted/50">
                <h4 className="font-semibold mb-3">Modus</h4>
                 <div className="flex flex-col sm:flex-row gap-2">
                    <Button onClick={() => switchMode('work')} variant={mode === 'work' ? 'default' : 'outline'} className="flex-1">
                        <Brain className="mr-2 h-4 w-4" /> Focus
                    </Button>
                    <Button onClick={() => switchMode('shortBreak')} variant={mode === 'shortBreak' ? 'default' : 'outline'} className="flex-1">
                        <Coffee className="mr-2 h-4 w-4" /> Korte Pauze
                    </Button>
                 </div>
            </Card>
            <Card className="p-4 bg-muted/50">
              <h4 className="font-semibold mb-3">Instellingen (minuten)</h4>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div>
                  <Label htmlFor="work-duration">Focus</Label>
                  <Input id="work-duration" type="number" value={durations.work} onChange={(e) => handleDurationChange(e, 'work')} className="text-center mt-1" />
                </div>
                 <div>
                  <Label htmlFor="short-break-duration">Korte Pauze</Label>
                  <Input id="short-break-duration" type="number" value={durations.shortBreak} onChange={(e) => handleDurationChange(e, 'shortBreak')} className="text-center mt-1" />
                </div>
                 <div>
                  <Label htmlFor="long-break-duration">Lange Pauze</Label>
                  <Input id="long-break-duration" type="number" value={durations.longBreak} onChange={(e) => handleDurationChange(e, 'longBreak')} className="text-center mt-1" />
                </div>
              </div>
            </Card>
          </div>
        </CardContent>
      </Card>
  );
}

export default FocusTimer;
