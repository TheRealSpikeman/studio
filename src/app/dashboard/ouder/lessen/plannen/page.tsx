// src/app/dashboard/ouder/lessen/plannen/page.tsx
"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, CalendarDays, Repeat } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format, parseISO, addHours, setHours, setMinutes, startOfDay, isEqual, addWeeks, isBefore } from 'date-fns';
import { nl } from 'date-fns/locale';
import { allHomeworkSubjects, type SubjectOption } from '@/lib/quiz-data/subject-data';

// Dummy data for children - in a real app, this would come from a user's profile
const dummyChildren = [
  { id: 'child1', name: 'Sofie de Tester' },
  { id: 'child2', name: 'Max de Tester' },
  { id: 'child3', name: 'Lisa Voorbeeld' },
];

interface ScheduledLesson {
  id: string;
  childId: string;
  childName: string;
  subject: string;
  subjectId: string;
  dateTime: string; // ISO string
  durationMinutes: number;
  tutorName: string;
  status: 'Gepland' | 'Voltooid' | 'Geannuleerd' | 'Bezig';
  recurringGroupId?: string;
}

export default function PlanLesPage() {
  const { toast } = useToast();
  const [selectedChild, setSelectedChild] = useState<string>('');
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState<string>('14:00');
  const [duration, setDuration] = useState<number>(60);
  const [selectedTutor, setSelectedTutor] = useState<string>('');

  const [isRecurring, setIsRecurring] = useState(false);
  const [repeatUntilDate, setRepeatUntilDate] = useState<Date | undefined>(undefined);

  // In a real app, scheduledLessons would be managed globally or fetched/updated via API
  // For this demo, planning a lesson here will only show a toast.
  // The actual list is managed in /overzicht/page.tsx

  const handleScheduleLesson = () => {
    if (!selectedChild || !selectedSubject || !selectedDate || !selectedTime) {
      toast({
        title: "Formulier onvolledig",
        description: "Selecteer een kind, vak, datum en tijd.",
        variant: "destructive",
      });
      return;
    }

    if (isRecurring && (!repeatUntilDate || isBefore(repeatUntilDate, selectedDate))) {
        toast({
            title: "Ongeldige herhaalperiode",
            description: "De 'herhaal tot' datum moet na de startdatum van de les liggen.",
            variant: "destructive",
        });
        return;
    }

    const child = dummyChildren.find(c => c.id === selectedChild);
    const subjectInfo = allHomeworkSubjects.find(s => s.id === selectedSubject);
    
    if (!child || !subjectInfo) {
        toast({ title: "Ongeldige selectie", description: "Kind of vak niet gevonden.", variant: "destructive" });
        return;
    }

    const [hours, minutes] = selectedTime.split(':').map(Number);
    const lessonsToSchedule: ScheduledLesson[] = [];
    // const recurringGroupId = isRecurring ? `recur-${Date.now()}` : undefined;

    if (isRecurring && repeatUntilDate) {
        let currentLessonStartDate = startOfDay(selectedDate);
        let count = 0;
        while ((isBefore(currentLessonStartDate, repeatUntilDate) || isEqual(currentLessonStartDate, repeatUntilDate)) && count < 52) { // Limit to 52 weeks for safety
            lessonsToSchedule.push({
                id: `sl-planned-${Date.now()}-${count}`, 
                childId: child.id,
                childName: child.name,
                subject: subjectInfo.name,
                subjectId: subjectInfo.id,
                dateTime: setMinutes(setHours(currentLessonStartDate, hours), minutes).toISOString(),
                durationMinutes: duration,
                tutorName: selectedTutor || 'Nog te bepalen',
                status: 'Gepland',
                recurringGroupId: `recur-${Date.now()}`,
            });
            currentLessonStartDate = addWeeks(currentLessonStartDate, 1);
            count++;
        }
    } else {
        lessonsToSchedule.push({
            id: `sl-planned-${Date.now()}`,
            childId: child.id,
            childName: child.name,
            subject: subjectInfo.name,
            subjectId: subjectInfo.id,
            dateTime: setMinutes(setHours(startOfDay(selectedDate), hours), minutes).toISOString(),
            durationMinutes: duration,
            tutorName: selectedTutor || 'Nog te bepalen',
            status: 'Gepland',
        });
    }
    
    if (lessonsToSchedule.length > 0) {
        // In a real app, you would send this to a backend or global state.
        // For now, we just log and toast.
        console.log("Simulating lesson scheduling:", lessonsToSchedule);
        toast({
          title: isRecurring ? "Reeks Lessen Ingepland!" : "Les Ingepland!",
          description: isRecurring 
            ? `${lessonsToSchedule.length} lessen (${subjectInfo.name}) voor ${child.name} wekelijks ingepland tot ${format(repeatUntilDate!, 'PPP', { locale: nl })}.`
            : `Les ${subjectInfo.name} voor ${child.name} op ${format(parseISO(lessonsToSchedule[0].dateTime), 'PPPp', { locale: nl })} is succesvol ingepland (simulatie).`,
          action: (
            <Button variant="outline" size="sm" asChild>
              <Link href="/dashboard/ouder/lessen/overzicht">Bekijk Overzicht</Link>
            </Button>
          )
        });
         // Reset form fields
        setSelectedChild('');
        setSelectedSubject('');
        setSelectedDate(new Date());
        setSelectedTime('14:00');
        setDuration(60);
        setSelectedTutor('');
        setIsRecurring(false);
        setRepeatUntilDate(undefined);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <CalendarDays className="h-8 w-8 text-primary" />
            Nieuwe Les Plannen
          </h1>
          <p className="text-muted-foreground">
            Plan hier de online bijlessen voor uw kinderen.
          </p>
        </div>
        <Button variant="outline" asChild>
          <Link href="/dashboard/ouder">
            <ArrowLeft className="mr-2 h-4 w-4" /> Terug naar Ouder Dashboard
          </Link>
        </Button>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Nieuwe Les Inplannen</CardTitle>
          <CardDescription>Selecteer een kind, vak, datum, tijd en eventueel een voorkeurstutor. Je kunt ook wekelijks herhalende lessen inplannen.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="select-child">Kind</Label>
              <Select value={selectedChild} onValueChange={setSelectedChild}>
                <SelectTrigger id="select-child">
                  <SelectValue placeholder="Selecteer een kind" />
                </SelectTrigger>
                <SelectContent>
                  {dummyChildren.map(child => (
                    <SelectItem key={child.id} value={child.id}>{child.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="select-subject">Vak</Label>
              <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                <SelectTrigger id="select-subject">
                  <SelectValue placeholder="Selecteer een vak" />
                </SelectTrigger>
                <SelectContent>
                  {allHomeworkSubjects.map(subject => (
                    <SelectItem key={subject.id} value={subject.id}>
                        <div className="flex items-center gap-2">
                            <subject.icon className="h-4 w-4 text-muted-foreground" />
                            {subject.name}
                        </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
             <div>
                <Label>Startdatum Les</Label>
                <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    className="rounded-md border mt-1 mx-auto sm:mx-0"
                    locale={nl}
                    disabled={{ before: new Date() }}
                />
             </div>
             <div className="space-y-6">
                <div>
                    <Label htmlFor="select-time">Starttijd (bijv. 14:00)</Label>
                    <Input 
                        id="select-time" 
                        type="time" 
                        value={selectedTime} 
                        onChange={e => setSelectedTime(e.target.value)} 
                        step="1800"
                    />
                </div>
                <div>
                    <Label htmlFor="select-duration">Duur (minuten)</Label>
                    <Select value={String(duration)} onValueChange={val => setDuration(Number(val))}>
                        <SelectTrigger id="select-duration">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="30">30 minuten</SelectItem>
                            <SelectItem value="45">45 minuten</SelectItem>
                            <SelectItem value="60">60 minuten</SelectItem>
                            <SelectItem value="90">90 minuten</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
             </div>
          </div>
          
          <div className="space-y-4 pt-4 border-t">
            <div className="flex items-center space-x-2">
                <Checkbox
                    id="recurring-lesson"
                    checked={isRecurring}
                    onCheckedChange={(checked) => setIsRecurring(checked as boolean)}
                />
                <Label htmlFor="recurring-lesson" className="text-base font-medium cursor-pointer flex items-center gap-1">
                    <Repeat className="h-4 w-4 text-primary"/> Wekelijks herhalen
                </Label>
            </div>
            {isRecurring && (
                <div className="ml-6 space-y-2">
                    <Label htmlFor="repeat-until-date">Herhaal tot en met</Label>
                     <Calendar
                        mode="single"
                        selected={repeatUntilDate}
                        onSelect={setRepeatUntilDate}
                        className="rounded-md border"
                        locale={nl}
                        disabled={{ before: selectedDate || new Date() }}
                    />
                     <p className="text-xs text-muted-foreground">
                        De les wordt wekelijks op dezelfde dag en tijd ingepland tot en met de hier geselecteerde datum.
                    </p>
                </div>
            )}
          </div>

          <div>
            <Label htmlFor="select-tutor">Voorkeurstutor (optioneel)</Label>
            <Input 
                id="select-tutor" 
                placeholder="Naam van tutor (binnenkort lijst)" 
                value={selectedTutor} 
                onChange={e => setSelectedTutor(e.target.value)} 
                disabled
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleScheduleLesson} className="w-full md:w-auto">
            {isRecurring ? 'Reeks Lessen Inplannen' : 'Les Inplannen'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
