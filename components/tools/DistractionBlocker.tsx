'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { ShieldBan, PlusCircle, Trash2, Timer } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

interface BlockedSite {
  id: number;
  url: string;
}

function DistractionBlocker() {
  const { toast } = useToast();
  const [isBlocking, setIsBlocking] = useState(false);
  const [blockedSites, setBlockedSites] = useState<BlockedSite[]>([
    { id: 1, url: 'facebook.com' },
    { id: 2, url: 'youtube.com' },
    { id: 3, url: 'twitter.com' },
  ]);
  const [newSite, setNewSite] = useState('');
  const [timerMinutes, setTimerMinutes] = useState(25);
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isBlocking && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (isBlocking && timeLeft === 0) {
      setIsBlocking(false);
      toast({
        title: 'Focus Tijd Voorbij!',
        description: 'De distraction blocker is nu gedeactiveerd.',
      });
    }
    return () => clearInterval(interval);
  }, [isBlocking, timeLeft, toast]);

  const handleToggleBlocking = (checked: boolean) => {
    setIsBlocking(checked);
    if (checked) {
      setTimeLeft(timerMinutes * 60);
      toast({
        title: 'Blocker Geactiveerd!',
        description: `Afleidingen worden geblokkeerd voor ${timerMinutes} minuten.`,
      });
    } else {
      setTimeLeft(0);
    }
  };

  const addSite = () => {
    if (newSite.trim() && !blockedSites.some(s => s.url === newSite.trim())) {
      setBlockedSites([...blockedSites, { id: Date.now(), url: newSite.trim() }]);
      setNewSite('');
    }
  };

  const removeSite = (id: number) => {
    setBlockedSites(blockedSites.filter((site) => site.id !== id));
  };
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShieldBan className="h-6 w-6 text-primary" />
          Distraction Blocker
        </CardTitle>
        <CardDescription>
          Blokkeer afleidende websites en apps om je focus te verbeteren.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between rounded-lg border p-4 shadow-sm">
          <div>
            <Label htmlFor="blocker-switch" className="text-base font-semibold">
              {isBlocking ? 'Blokkering Actief' : 'Blokkering Inactief'}
            </Label>
            <p className="text-sm text-muted-foreground">
              {isBlocking ? `Tijd over: ${formatTime(timeLeft)}` : 'Schakel in om te starten.'}
            </p>
          </div>
          <Switch
            id="blocker-switch"
            checked={isBlocking}
            onCheckedChange={handleToggleBlocking}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="timer-duration">Focus duur (minuten)</Label>
          <Input
            id="timer-duration"
            type="number"
            value={timerMinutes}
            onChange={(e) => setTimerMinutes(parseInt(e.target.value, 10))}
            disabled={isBlocking}
          />
        </div>

        <div className="space-y-2">
          <Label>Geblokkeerde Websites</Label>
          <div className="space-y-2">
            {blockedSites.map((site) => (
              <div key={site.id} className="flex items-center justify-between bg-muted/50 p-2 rounded-md">
                <span className="text-sm font-mono">{site.url}</span>
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => removeSite(site.id)}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            ))}
          </div>
        </div>
        
        <div>
            <Label htmlFor="new-site">Website toevoegen</Label>
            <div className="flex gap-2 mt-1">
                <Input
                    id="new-site"
                    placeholder="bijv. netflix.com"
                    value={newSite}
                    onChange={(e) => setNewSite(e.target.value)}
                />
                <Button variant="outline" onClick={addSite}>
                    <PlusCircle className="h-4 w-4" />
                </Button>
            </div>
        </div>

      </CardContent>
    </Card>
  );
}

export default DistractionBlocker;
