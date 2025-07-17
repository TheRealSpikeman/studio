
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ArrowLeft, CalendarDays, Repeat, User, BookOpen, ClockIcon, HelpCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format, parseISO, addWeeks, setHours, setMinutes, startOfDay, isEqual, isBefore } from 'date-fns';
import { nl } from 'date-fns/locale';
import { allHomeworkSubjects } from '@/lib/quiz-data/subject-data';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription as AlertDescUi, AlertTitle as AlertTitleUi } from "@/components/ui/alert";


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

type RepeatOption = 'once' | 'weekly' | 'biweekly';

const generateTimeOptions = (): string[] => {
  const options: string[] = [];
  for (let hour = 7; hour <= 22; hour++) {
    options.push(`${String(hour).padStart(2, '0')}:00`);
    if (hour < 22) {
      options.push(`${String(hour).padStart(2, '0')}:30`);
    }
  }
  return options;
};
const timeOptions = generateTimeOptions();


export default function PlanLesPage() {
  const { toast } = useToast();
  const [selectedChild, setSelectedChild] = useState<string>('');
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState<string>('14:00');
  const [duration, setDuration] = useState<number>(60);
  const [selectedTutor, setSelectedTutor] = useState<string>('');

  const [repeatOption, setRepeatOption] = useState<RepeatOption>('once');
  const [specifyEndDate, setSpecifyEndDate] = useState<boolean>(false);
  const [repeatUntilDate, setRepeatUntilDate] = useState<Date | undefined>(undefined);

  const handleScheduleLesson = () => {
    if (!selectedChild || !selectedSubject || !selectedDate || !selectedTime) {
      toast({
        title: "Formulier onvolledig",
        description: "Selecteer een kind, vak, startdatum en starttijd.",
        variant: "destructive",
      });
      return;
    }

    if (repeatOption !== 'once' && specifyEndDate && (!repeatUntilDate || isBefore(repeatUntilDate, selectedDate))) {
        toast({
            title: "Ongeldige herhaalperiode",
            description: "De 'herhaal tot' datum moet op of na de startdatum van de eerste les liggen.",
            variant: "destructive",
        });
        return;
    }
    
    if (repeatOption !== 'once' && !specifyEndDate) {
      toast({
        title: "Herhaling niet compleet",
        description: "Kies 'Specificeer einddatum voor herhaling' en selecteer een einddatum, of kies 'Eenmalige les'. Voor nu worden herhalende lessen zonder einddatum tot maximaal 12 weken ingepland.",
        variant: "destructive",
      });
    }


    const child = dummyChildren.find(c => c.id === selectedChild);
    const subjectInfo = allHomeworkSubjects.find(s => s.id === selectedSubject);
    
    if (!child || !subjectInfo) {
        toast({ title: "Ongeldige selectie", description: "Kind of vak niet gevonden.", variant: "destructive" });
        return;
    }

    const [hours, minutes] = selectedTime.split(':').map(Number);
    const lessonsToSchedule: ScheduledLesson[] = [];
    const recurringGroupId = repeatOption !== 'once' ? `recur-${Date.now()}` : undefined;
    let currentLessonStartDate = startOfDay(selectedDate);
    let lessonsPlannedCount = 0;
    const maxLessons = specifyEndDate && repeatUntilDate ? 52 : 12; 

    while (lessonsPlannedCount < maxLessons) {
        if (specifyEndDate && repeatUntilDate && isBefore(repeatUntilDate, currentLessonStartDate)) {
            break; 
        }

        lessonsToSchedule.push({
            id: `sl-planned-${Date.now()}-${lessonsPlannedCount}`, 
            childId: child.id,
            childName: child.name,
            subject: subjectInfo.name,
            subjectId: subjectInfo.id,
            dateTime: setMinutes(setHours(currentLessonStartDate, hours), minutes).toISOString(),
            durationMinutes: duration,
            tutorName: selectedTutor || 'Nog te bepalen',
            status: 'Gepland',
            recurringGroupId: recurringGroupId,
        });
        lessonsPlannedCount++;

        if (repeatOption === 'once') break;
        if (repeatOption === 'weekly') {
            currentLessonStartDate = addWeeks(currentLessonStartDate, 1);
        } else if (repeatOption === 'biweekly') {
            currentLessonStartDate = addWeeks(currentLessonStartDate, 2);
        }
    }
    
    if (lessonsToSchedule.length > 0) {
        console.log("Simulating lesson scheduling:", lessonsToSchedule);
        const firstLessonDateTime = parseISO(lessonsToSchedule[0].dateTime);
        let toastDescription = `Les ${subjectInfo.name} voor ${child.name} op ${format(firstLessonDateTime, 'PPPp', { locale: nl })} is succesvol ingepland.`;
        
        if (repeatOption !== 'once' && lessonsToSchedule.length > 1) {
            const lastLessonDateTime = parseISO(lessonsToSchedule[lessonsToSchedule.length - 1].dateTime);
            const repeatText = repeatOption === 'weekly' ? 'wekelijks' : 'tweewekelijks';
            toastDescription = `${lessonsToSchedule.length} lessen (${subjectInfo.name}) voor ${child.name} ${repeatText} ingepland, startend op ${format(firstLessonDateTime, 'PPP', { locale: nl })} tot ${format(lastLessonDateTime, 'PPP', { locale: nl })}.`;
             if (!specifyEndDate || !repeatUntilDate) {
                toastDescription += ` (Max. ${maxLessons} weken).`;
            }
        }
        
        toast({
          title: lessonsToSchedule.length > 1 ? "Reeks Lessen Ingepland!" : "Les Ingepland!",
          description: toastDescription + " (Dit is een simulatie)",
          action: (
            <Button variant="outline" size="sm" asChild>
              <Link href="/dashboard/ouder/lessen/overzicht">Bekijk Overzicht</Link>
            </Button>
          )
        });
        
        setSelectedChild('');
        setSelectedSubject('');
        setSelectedDate(new Date());
        setSelectedTime('14:00');
        setDuration(60);
        setSelectedTutor('');
        setRepeatOption('once');
        setSpecifyEndDate(false);
        setRepeatUntilDate(undefined);
    } else {
         toast({
            title: "Geen lessen ingepland",
            description: "Controleer de data en herhaalopties.",
            variant: "destructive",
        });
    }
  };

  const estimatedLessons = () => {
    if (!selectedDate || repeatOption === 'once') return 1;
    if (!specifyEndDate || !repeatUntilDate || isBefore(repeatUntilDate, selectedDate)) return 'Max. 12 weken';
    
    let count = 0;
    let currentDate = startOfDay(selectedDate);
    const endDate = startOfDay(repeatUntilDate);
    
    while(isBefore(currentDate, endDate) || isEqual(currentDate, endDate)) {
      count++;
      if (repeatOption === 'weekly') {
        currentDate = addWeeks(currentDate, 1);
      } else if (repeatOption === 'biweekly') {
        currentDate = addWeeks(currentDate, 2);
      } else {
        break; 
      }
      if (count > 52) return '>52 (max. 1 jaar)'; 
    }
    return count;
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

      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="text-xl">Lesdetails</CardTitle>
          <CardDescription>Vul de gegevens in om een nieuwe les of lessenreeks te plannen.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          <section className="space-y-6">
            <h3 className="text-lg font-semibold text-primary flex items-center gap-2">
              <User className="h-5 w-5" /> Wie & Wat?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="select-child" className="font-medium">Kind</Label>
                <Select value={selectedChild} onValueChange={setSelectedChild}>
                  <SelectTrigger id="select-child" className="mt-1 w-full">
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
                <Label htmlFor="select-subject" className="font-medium">Vak</Label>
                <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                  <SelectTrigger id="select-subject" className="mt-1 w-full">
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
          </section>

          <Separator />

          <section className="space-y-6">
            <h3 className="text-lg font-semibold text-primary flex items-center gap-2">
                <ClockIcon className="h-5 w-5"/> Wanneer? (Eerste Les)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 items-start">
              <div className="md:col-span-1"> {/* Kalender kolom */}
                  <Label className="font-medium block mb-1">Startdatum</Label>
                  <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      className="rounded-md border shadow-sm mx-auto sm:mx-0 bg-card"
                      locale={nl}
                      disabled={{ before: startOfDay(new Date()) }}
                  />
              </div>
              <div className="md:col-span-1 space-y-6"> {/* Tijd en Duur kolom */}
                  <div>
                      <Label htmlFor="select-time" className="font-medium">Starttijd</Label>
                       <Select value={selectedTime} onValueChange={setSelectedTime}>
                          <SelectTrigger id="select-time" className="mt-1 w-full">
                              <SelectValue placeholder="Kies starttijd" />
                          </SelectTrigger>
                          <SelectContent>
                              {timeOptions.map(time => (
                                  <SelectItem key={time} value={time}>{time}</SelectItem>
                              ))}
                          </SelectContent>
                      </Select>
                  </div>
                  <div>
                      <Label htmlFor="select-duration" className="font-medium">Duur</Label>
                      <Select value={String(duration)} onValueChange={val => setDuration(Number(val))}>
                          <SelectTrigger id="select-duration" className="mt-1 w-full">
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
          </section>
          
          <Separator />

          <section className="space-y-6">
            <h3 className="text-lg font-semibold text-primary flex items-center gap-2">
                <Repeat className="h-5 w-5"/> Herhaling (Optioneel)
            </h3>
            <RadioGroup value={repeatOption} onValueChange={(value) => setRepeatOption(value as RepeatOption)} className="space-y-2">
                <div className="flex items-center space-x-2">
                    <RadioGroupItem value="once" id="r-once" />
                    <Label htmlFor="r-once" className="font-normal cursor-pointer">Eenmalige les</Label>
                </div>
                <div className="flex items-center space-x-2">
                    <RadioGroupItem value="weekly" id="r-weekly" />
                    <Label htmlFor="r-weekly" className="font-normal cursor-pointer">Wekelijks herhalen</Label>
                </div>
                <div className="flex items-center space-x-2">
                    <RadioGroupItem value="biweekly" id="r-biweekly" />
                    <Label htmlFor="r-biweekly" className="font-normal cursor-pointer">Elke 2 weken herhalen</Label>
                </div>
            </RadioGroup>

            {repeatOption !== 'once' && (
                <div className="ml-6 mt-4 space-y-4 p-4 border rounded-md bg-muted/50">
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="specify-end-date"
                            checked={specifyEndDate}
                            onCheckedChange={(checked) => setSpecifyEndDate(checked as boolean)}
                        />
                        <Label htmlFor="specify-end-date" className="font-normal cursor-pointer">Specificeer einddatum voor herhaling</Label>
                    </div>
                    {specifyEndDate && (
                        <div>
                            <Label className="font-medium block mb-1">Herhaal tot en met</Label>
                            <Calendar
                                mode="single"
                                selected={repeatUntilDate}
                                onSelect={setRepeatUntilDate}
                                className="rounded-md border bg-card shadow-sm"
                                locale={nl}
                                disabled={{ before: selectedDate || startOfDay(new Date()) }}
                            />
                        </div>
                    )}
                    <Alert variant="default" className="bg-blue-50 border-blue-200 text-blue-700">
                        <HelpCircle className="h-4 w-4 !text-blue-600" />
                        <AlertTitleUi className="text-blue-700 font-medium">Geschatte lessen</AlertTitleUi>
                        <AlertDescUi className="text-blue-600">
                            Aantal geplande lessen: {estimatedLessons()}.
                            {!specifyEndDate && " Zonder einddatum worden max. 12 weken ingepland."}
                        </AlertDescUi>
                    </Alert>
                </div>
            )}
          </section>

          <Separator />

           <section className="space-y-4">
            <h3 className="text-lg font-semibold text-primary flex items-center gap-2">
                <User className="h-5 w-5"/> Voorkeurstutor (Optioneel)
            </h3>
            <div>
                <Label htmlFor="select-tutor" className="font-medium">Naam van tutor</Label>
                <Input 
                    id="select-tutor" 
                    placeholder="Bijv. Mevr. Jansen (Binnenkort selectielijst)" 
                    value={selectedTutor} 
                    onChange={e => setSelectedTutor(e.target.value)} 
                    className="mt-1"
                    disabled 
                />
                <p className="text-xs text-muted-foreground mt-1">Als u geen voorkeur opgeeft, zoeken wij de best passende beschikbare tutor.</p>
            </div>
          </section>

        </CardContent>
        <CardFooter className="border-t pt-6">
          <Button onClick={handleScheduleLesson} size="lg" className="w-full md:w-auto">
            <CalendarDays className="mr-2 h-5 w-5" />
            {repeatOption !== 'once' ? 'Reeks Lessen Inplannen' : 'Les Inplannen'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
