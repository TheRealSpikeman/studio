'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Timer } from 'lucide-react';
import { List, Plus, Volume2, VolumeX } from 'lucide-react';

interface Sound {
  name: string;
  url: string;
}

const sounds: Sound[] = [
  { name: 'Rain', url: '/sounds/rain.mp3' },
  { name: 'Forest', url: '/sounds/forest.mp3' },
  { name: 'Waves', url: '/sounds/waves.mp3' },
];

const FocusTimerPro = () => {
  const [timerRunning, setTimerRunning] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(25 * 60); // 25 minutes
  const [breakTime, setBreakTime] = useState(5 * 60);
  const [isBreak, setIsBreak] = useState(false);
  const [soundPlaying, setSoundPlaying] = useState<string | null>(null);
  const [volume, setVolume] = useState(0.5);
  const [distractions, setDistractions] = useState<string[]>([]);
  const [newDistraction, setNewDistraction] = useState('');
  const [distractionBlockerEnabled, setDistractionBlockerEnabled] = useState(false);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (timerRunning) {
      interval = setInterval(() => {
        setTimeRemaining((prevTime) => {
          if (prevTime <= 0) {
            clearInterval(interval);
            if (!isBreak) {
              setIsBreak(true);
              setTimeRemaining(breakTime);
            } else {
              setIsBreak(false);
              setTimeRemaining(25 * 60); //reset to work timer
            }
            setTimerRunning(false);
            return 0;
          } else {
            return prevTime - 1;
          }
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [timerRunning, isBreak, breakTime]);

  useEffect(() => {
    if (soundPlaying) {
      const selectedSound = sounds.find((sound) => sound.name === soundPlaying);
      if (selectedSound) {
        const newAudio = new Audio(selectedSound.url);
        newAudio.loop = true;
        newAudio.volume = volume;
        newAudio.play();
        setAudio(newAudio);
      }
    } else if (audio) {
      audio.pause();
      setAudio(null);
    }
  }, [soundPlaying, volume]);

  const handleStartStop = () => {
    setTimerRunning(!timerRunning);
  };

  const handleAddDistraction = () => {
    if (newDistraction.trim() !== '') {
      setDistractions([...distractions, newDistraction.trim()]);
      setNewDistraction('');
    }
  };

  const formatTime = (timeInSeconds: number): string => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const toggleSound = (soundName: string) => {
    setSoundPlaying((prevSound) => (prevSound === soundName ? null : soundName));
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md space-y-4">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center justify-center">
            <Timer className="mr-2" /> Focus Timer Pro
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-center">
            <div className="text-4xl font-bold">{formatTime(timeRemaining)}</div>
          </div>
          <div className="flex justify-center">
            <Button variant="outline" onClick={handleStartStop}>
              {timerRunning ? 'Pause' : 'Start'}
            </Button>
          </div>
          <div>
            <Label htmlFor="distraction-blocker">Distraction Blocker</Label>
            <div className="flex items-center space-x-2">
              <Switch
                id="distraction-blocker"
                checked={distractionBlockerEnabled}
                onCheckedChange={setDistractionBlockerEnabled}
              />
              <span>{distractionBlockerEnabled ? 'Enabled' : 'Disabled'}</span>
            </div>
          </div>
          <div>
            <Label htmlFor="new-distraction">Add Distraction:</Label>
            <div className="flex space-x-2">
              <Input
                id="new-distraction"
                type="text"
                value={newDistraction}
                onChange={(e) => setNewDistraction(e.target.value)}
              />
              <Button type="button" onClick={handleAddDistraction}>
                <Plus className="h-4 w-4 mr-2"/>
                 Add
              </Button>
            </div>
          </div>
          <div>
            <Label>Blocked Sites:</Label>
            <ul className="list-disc list-inside">
              {distractions.map((distraction, index) => (
                <li key={index}>{distraction}</li>
              ))}
            </ul>
          </div>

          <div>
            <Label>Background Sounds:</Label>
            <div className="flex space-x-2">
              {sounds.map((sound) => (
                <Button
                  key={sound.name}
                  variant="outline"
                  onClick={() => toggleSound(sound.name)}
                  className={soundPlaying === sound.name ? 'bg-muted hover:bg-muted text-muted-foreground' : ''}
                >
                 {sound.name}
                </Button>
              ))}
            </div>
            {soundPlaying && (
              <div className="flex items-center space-x-2 mt-2">
                <Label htmlFor="volume">Volume:</Label>
                <input
                  type="range"
                  id="volume"
                  min="0"
                  max="1"
                  step="0.1"
                  value={volume}
                  onChange={(e) => setVolume(parseFloat(e.target.value))}
                />
                {volume > 0 ? <Volume2 className="w-4 h-4"/> : <VolumeX className="w-4 h-4"/>}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FocusTimerPro;
