'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { List, Timer, Volume2 } from '@/lib/icons';
import { Slider } from '@/components/ui/slider';

interface Sound {
  name: string;
  url: string;
}

const sounds: Sound[] = [
  { name: 'Rain', url: '/sounds/rain.mp3' },
  { name: 'Forest', url: '/sounds/forest.mp3' },
  { name: 'Waves', url: '/sounds/waves.mp3' },
];

const FocusTimer = () => {
  const [timerRunning, setTimerRunning] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(25 * 60); // 25 minutes
  const [breakTime, setBreakTime] = useState(5 * 60); // 5 minutes
  const [onBreak, setOnBreak] = useState(false);
  const [distractionSites, setDistractionSites] = useState<string[]>([]);
  const [newSite, setNewSite] = useState('');
  const [distractionBlockEnabled, setDistractionBlockEnabled] = useState(false);
  const [selectedSound, setSelectedSound] = useState<Sound | null>(null);
  const [volume, setVolume] = useState(0.5);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (timerRunning && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timerRunning && timeRemaining === 0) {
      clearInterval(interval);
      // Timer has ended. Switch to break or stop timer
      if (!onBreak) {
        setOnBreak(true);
        setTimeRemaining(breakTime);
      } else {
        setTimerRunning(false);
        setOnBreak(false);
        setTimeRemaining(25 * 60);
      }
    }

    return () => clearInterval(interval);
  }, [timerRunning, timeRemaining, onBreak, breakTime]);

  const formatTime = (timeInSeconds: number): string => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleAddSite = () => {
    if (newSite.trim() !== '') {
      setDistractionSites([...distractionSites, newSite.trim()]);
      setNewSite('');
    }
  };

  const handleRemoveSite = (siteToRemove: string) => {
    setDistractionSites(distractionSites.filter((site) => site !== siteToRemove));
  };

  const audioRef = React.useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (selectedSound) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      audioRef.current = new Audio(selectedSound.url);
      audioRef.current.loop = true;
      audioRef.current.volume = volume;
      audioRef.current.play();
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };
  }, [selectedSound, volume]);


  return (
    <div className="container mx-auto p-4">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center"><Timer className="mr-2"/> Focus Timer Pro</CardTitle>
          <CardDescription>Een Pomodoro timer met optionele achtergrondgeluiden om je te helpen in de zone te komen.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="flex justify-center text-5xl font-bold">
            {formatTime(timeRemaining)}
          </div>
          <div className="flex justify-center gap-4">
            <Button variant="outline" onClick={() => setTimerRunning(!timerRunning)}>{timerRunning ? 'Pause' : 'Start'}</Button>
            <Button variant="destructive" onClick={() => { setTimerRunning(false); setOnBreak(false); setTimeRemaining(25 * 60); }}>Reset</Button>
          </div>

          <div>
            <Label htmlFor="break-length">Break Length (minutes)</Label>
            <Input
              type="number"
              id="break-length"
              value={breakTime / 60}
              onChange={(e) => setBreakTime(parseInt(e.target.value) * 60)}
            />
          </div>

          <div>
            <Label htmlFor="distraction-block">Distraction Blocker <List className="inline-block"/></Label>
            <div className="flex items-center space-x-2">
              <Switch id="distraction-block" checked={distractionBlockEnabled} onCheckedChange={setDistractionBlockEnabled} />
            </div>
          </div>

          {distractionBlockEnabled && (
            <div>
              <div className="flex space-x-2">
                <Input
                  type="text"
                  placeholder="Add website to block"
                  value={newSite}
                  onChange={(e) => setNewSite(e.target.value)}
                />
                <Button onClick={handleAddSite}>Add</Button>
              </div>
              <ul>
                {distractionSites.map((site) => (
                  <li key={site} className="flex justify-between items-center py-1">
                    {site}
                    <Button variant="ghost" size="sm" onClick={() => handleRemoveSite(site)}>Remove</Button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div>
            <Label>Background Sound <Volume2 className="inline-block"/></Label>
            <div className="flex space-x-2">
              {sounds.map((sound) => (
                <Button
                  key={sound.name}
                  variant={selectedSound?.name === sound.name ? 'default' : 'outline'}
                  onClick={() => setSelectedSound(sound)}
                >
                  {sound.name}
                </Button>
              ))}
              <Button variant={selectedSound === null ? 'default' : 'outline'} onClick={() => setSelectedSound(null)}>None</Button>
            </div>
            <div>
              <Label>Volume</Label>
              <Slider
                defaultValue={[50]}
                max={100}
                step={1}
                onChange={(values) => {
                  setVolume(values[0] ? values[0] / 100 : 0)
                }}
              />
            </div>


          </div>
        </CardContent>
        <CardFooter>
          {/* Footer content here */}
        </CardFooter>
      </Card>
      <audio ref={audioRef} />
    </div>
  );
};

export default FocusTimer;
