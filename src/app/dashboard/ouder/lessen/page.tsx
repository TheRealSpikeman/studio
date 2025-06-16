// src/app/dashboard/ouder/lessen/page.tsx
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, CalendarDays, BookOpen, User, Book, Clock, Users, MoreVertical, CheckCircle, XCircle, Hourglass } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format, parseISO, addHours, setHours, setMinutes, startOfDay, isEqual } from 'date-fns';
import { nl } from 'date-fns/locale';
import { allHomeworkSubjects, type SubjectOption } from '@/lib/quiz-data/subject-data';
import { FormattedDateCell } from '@/components/admin/user-management/FormattedDateCell';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Dummy data for children - in a real app, this would come from a user's profile
const dummyChildren = [
  { id: 'child1', name: 'Sofie de Tester' },
  { id: 'child2', name: 'Max de Tester' },
  { id: 'child3', name: 'Lisa Voorbeeld' },
];

type LessonStatus = 'Gepland' | 'Voltooid' | 'Geannuleerd' | 'Bezig';

interface ScheduledLesson {
  id: string;
  childId: string;
  childName: string;
  subject: string;
  subjectId: string;
  dateTime: string; // ISO string
  durationMinutes: number;
  tutorName: string;
  status: LessonStatus;
}

const initialScheduledLessons: ScheduledLesson[] = [
  { id: 'sl1', childId: 'child1', childName: 'Sofie de Tester', subject: 'Wiskunde', subjectId: 'wiskunde', dateTime: addHours(new Date(), 2).toISOString(), durationMinutes: 60, tutorName: 'Mevr. Jansen', status: 'Gepland' },
  { id: 'sl2', childId: 'child2', childName: 'Max de Tester', subject: 'Engels', subjectId: 'engels', dateTime: addHours(new Date(), 26).toISOString(), durationMinutes: 45, tutorName: 'Dhr. Pietersen', status: 'Gepland' },
  { id: 'sl3', childId: 'child1', childName: 'Sofie de Tester', subject: 'Nederlands', subjectId: 'nederlands', dateTime: addHours(new Date(), -48).toISOString(), durationMinutes: 60, tutorName: 'Mevr. de Wit', status: 'Voltooid' },
];

const getStatusBadgeVariant = (status: LessonStatus): "default" | "secondary" | "destructive" | "outline" => {
  switch (status) {
    case 'Gepland': return 'default';
    case 'Bezig': return 'default';
    case 'Voltooid': return 'secondary';
    case 'Geannuleerd': return 'destructive';
    default: return 'outline';
  }
};
const getStatusBadgeClasses = (status: LessonStatus): string => {
 switch (status) {
    case 'Gepland': return 'bg-blue-100 text-blue-700 border-blue-300';
    case 'Bezig': return 'bg-green-100 text-green-700 border-green-300 animate-pulse';
    case 'Voltooid': return 'bg-gray-100 text-gray-700 border-gray-300';
    case 'Geannuleerd': return 'bg-red-100 text-red-700 border-red-300';
    default: return '';
  }
};


export default function OuderLessenPage() {
  const { toast } = useToast();
  const [selectedChild, setSelectedChild] = useState<string>('');
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState<string>('14:00');
  const [duration, setDuration] = useState<number>(60);
  const [selectedTutor, setSelectedTutor] = useState<string>(''); // Placeholder

  const [scheduledLessons, setScheduledLessons] = useState<ScheduledLesson[]>(initialScheduledLessons);

  const handleScheduleLesson = () => {
    if (!selectedChild || !selectedSubject || !selectedDate || !selectedTime) {
      toast({
        title: "Formulier onvolledig",
        description: "Selecteer een kind, vak, datum en tijd.",
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
    const lessonDateTime = setMinutes(setHours(startOfDay(selectedDate), hours), minutes);

    const newLesson: ScheduledLesson = {
      id: `sl${Date.now()}`,
      childId: child.id,
      childName: child.name,
      subject: subjectInfo.name,
      subjectId: subjectInfo.id,
      dateTime: lessonDateTime.toISOString(),
      durationMinutes: duration,
      tutorName: selectedTutor || 'Nog te bepalen',
      status: 'Gepland',
    };

    setScheduledLessons(prev => [newLesson, ...prev].sort((a,b) => parseISO(b.dateTime).getTime() - parseISO(a.dateTime).getTime() ));
    toast({
      title: "Les Ingepland!",
      description: `Les ${subjectInfo.name} voor ${child.name} op ${format(lessonDateTime, 'PPPp', { locale: nl })} is succesvol ingepland.`,
    });
    
    // Reset form fields (optional)
    // setSelectedChild(''); setSelectedSubject(''); setSelectedDate(new Date()); setSelectedTime('14:00'); setDuration(60); setSelectedTutor('');
  };
  
  const cancelLesson = (lessonId: string) => {
    setScheduledLessons(prev => prev.map(l => l.id === lessonId ? {...l, status: 'Geannuleerd'} : l));
    toast({ title: "Les geannuleerd", description: "De geselecteerde les is geannuleerd.", variant: "default"});
  };
  
  const markAsCompleted = (lessonId: string) => {
     setScheduledLessons(prev => prev.map(l => l.id === lessonId ? {...l, status: 'Voltooid'} : l));
     toast({ title: "Les gemarkeerd als voltooid", variant: "default"});
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <CalendarDays className="h-8 w-8 text-primary" />
            Lessen Kinderen
          </h1>
          <p className="text-muted-foreground">
            Plan en beheer hier de online bijlessen voor uw kinderen.
          </p>
        </div>
        <Button variant="outline" asChild>
          <Link href="/dashboard/ouder">
            <ArrowLeft className="mr-2 h-4 w-4" /> Terug naar Ouder Dashboard
          </Link>
        </Button>
      </div>

      <Tabs defaultValue="plan">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="plan">Les Plannen</TabsTrigger>
          <TabsTrigger value="overview">Overzicht Geplande Lessen</TabsTrigger>
        </TabsList>

        <TabsContent value="plan" className="mt-6">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Nieuwe Les Inplannen</CardTitle>
              <CardDescription>Selecteer een kind, vak, datum, tijd en eventueel een voorkeurstutor.</CardDescription>
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
                    <Label>Datum</Label>
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
                        <Label htmlFor="select-time">Tijd (bijv. 14:00)</Label>
                        <Input 
                            id="select-time" 
                            type="time" 
                            value={selectedTime} 
                            onChange={e => setSelectedTime(e.target.value)} 
                            step="1800" // 30 min intervals
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
                    <div>
                        <Label htmlFor="select-tutor">Voorkeurstutor (optioneel)</Label>
                        <Input 
                            id="select-tutor" 
                            placeholder="Naam van tutor (binnenkort lijst)" 
                            value={selectedTutor} 
                            onChange={e => setSelectedTutor(e.target.value)} 
                            disabled // Placeholder
                        />
                    </div>
                 </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleScheduleLesson} className="w-full md:w-auto">Les Inplannen</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="overview" className="mt-6">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Overzicht van alle geplande lessen</CardTitle>
              <CardDescription>Bekijk, wijzig of annuleer lessen. Filter op kind of status.</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Add filters here later */}
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Kind</TableHead>
                      <TableHead>Vak</TableHead>
                      <TableHead>Tutor</TableHead>
                      <TableHead>Datum & Tijd</TableHead>
                      <TableHead>Duur</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Acties</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {scheduledLessons.length === 0 && (
                      <TableRow><TableCell colSpan={7} className="h-24 text-center">Nog geen lessen gepland.</TableCell></TableRow>
                    )}
                    {scheduledLessons.map((lesson) => (
                      <TableRow key={lesson.id}>
                        <TableCell className="font-medium">{lesson.childName}</TableCell>
                        <TableCell>{lesson.subject}</TableCell>
                        <TableCell>{lesson.tutorName}</TableCell>
                        <TableCell>
                           <FormattedDateCell isoDateString={lesson.dateTime} dateFormatPattern="E d MMM, HH:mm" />
                        </TableCell>
                        <TableCell>{lesson.durationMinutes} min</TableCell>
                        <TableCell>
                          <Badge variant={getStatusBadgeVariant(lesson.status)} className={getStatusBadgeClasses(lesson.status)}>
                            {lesson.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                           <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreVertical className="h-4 w-4" />
                                <span className="sr-only">Les acties</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              {lesson.status === 'Gepland' && (
                                <>
                                <DropdownMenuItem onClick={() => cancelLesson(lesson.id)} className="text-destructive focus:text-destructive">
                                    <XCircle className="mr-2 h-4 w-4" />Les Annuleren
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => markAsCompleted(lesson.id)} className="text-green-600 focus:text-green-700">
                                    <CheckCircle className="mr-2 h-4 w-4" />Markeer als Voltooid
                                </DropdownMenuItem>
                                </>
                              )}
                              {lesson.status === 'Bezig' && (
                                 <DropdownMenuItem onClick={() => markAsCompleted(lesson.id)} className="text-green-600 focus:text-green-700">
                                    <CheckCircle className="mr-2 h-4 w-4" />Markeer als Voltooid
                                </DropdownMenuItem>
                              )}
                               <DropdownMenuItem disabled><Hourglass className="mr-2 h-4 w-4" />Les Verzetten (binnenkort)</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
