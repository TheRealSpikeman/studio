// src/components/homework-assistance/PlannerSection.tsx
"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
import { CalendarDays, PlusCircle } from 'lucide-react';
import { nl } from 'date-fns/locale';
import { format, startOfDay, isEqual } from 'date-fns';

interface CalendarEvent {
  date: Date;
  title: string;
  subject: string;
}

const generateInitialEvents = (): CalendarEvent[] => {
  const today = startOfDay(new Date());
  const twoDaysLater = new Date(today);
  twoDaysLater.setDate(today.getDate() + 2);

  return [
    { date: today, title: "Wiskunde H.3 maken", subject: "Wiskunde" },
    { date: twoDaysLater, title: "Engels essay inleveren", subject: "Engels" }
  ];
};


export function PlannerSection() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [newTask, setNewTask] = useState('');
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    setSelectedDate(startOfDay(new Date()));
    setEvents(generateInitialEvents());
  }, []);

  const handleAddTask = () => {
    if (newTask && selectedDate) {
      setEvents(prev => [...prev, { date: selectedDate, title: newTask, subject: "Algemeen" }]);
      setNewTask('');
      // In a real app, show toast or confirmation
    }
  };

  const eventsForSelectedDate = selectedDate && isClient
    ? events.filter(event => isEqual(startOfDay(event.date), selectedDate))
    : [];
    
  if (!isClient) {
    // Render a placeholder or loader on the server and during initial client render
    return (
        <Card className="shadow-md">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                <CalendarDays className="h-6 w-6 text-primary" />
                Week- & Dagplanner
                </CardTitle>
                <CardDescription>Plan je huiswerk, deadlines en studiesessies.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="h-[300px] bg-muted rounded-md animate-pulse"></div>
                 <div className="flex gap-2 mt-4 pt-4 border-t">
                    <Input placeholder="Nieuwe taak of deadline..." disabled />
                    <Button disabled>
                        <PlusCircle className="h-4 w-4 mr-2 sm:mr-0 md:mr-2" />
                        <span className="hidden sm:inline md:hidden lg:inline">Toevoegen</span>
                    </Button>
                </div>
            </CardContent>
            <CardFooter>
                <p className="text-xs text-muted-foreground italic">Synchroniseer met Google/Outlook Calendar (binnenkort).</p>
            </CardFooter>
        </Card>
    );
  }

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarDays className="h-6 w-6 text-primary" />
          Week- & Dagplanner
        </CardTitle>
        <CardDescription>Plan je huiswerk, deadlines en studiesessies.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={(date) => date && setSelectedDate(startOfDay(date))}
          className="rounded-md border shadow-sm mx-auto"
          locale={nl}
          modifiers={{ 
            events: events.map(e => e.date) 
          }}
          modifiersStyles={{ 
            events: { fontWeight: 'bold', color: 'hsl(var(--primary))' } 
          }}
          initialFocus
        />
        {selectedDate && (
          <div className="mt-4 pt-4 border-t">
            <h4 className="font-semibold mb-2">Gepland voor {format(selectedDate, 'PPP', { locale: nl })}:</h4>
            {eventsForSelectedDate.length > 0 ? (
              <ul className="list-disc list-inside text-sm space-y-1">
                {eventsForSelectedDate.map((event, idx) => (
                  <li key={idx}>
                    <strong>{event.subject}:</strong> {event.title}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">Geen taken gepland voor deze dag.</p>
            )}
          </div>
        )}
        <div className="flex gap-2 mt-4 pt-4 border-t">
          <Input 
            placeholder="Nieuwe taak of deadline..." 
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
          />
          <Button onClick={handleAddTask} disabled={!newTask || !selectedDate}>
            <PlusCircle className="h-4 w-4 mr-2 sm:mr-0 md:mr-2" />
            <span className="hidden sm:inline md:hidden lg:inline">Toevoegen</span>
          </Button>
        </div>
      </CardContent>
       <CardFooter>
        <p className="text-xs text-muted-foreground italic">Synchroniseer met Google/Outlook Calendar (binnenkort).</p>
      </CardFooter>
    </Card>
  );
}
