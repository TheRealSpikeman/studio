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
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, CalendarDays, BookOpen, User, Book, Clock, Users, MoreVertical, CheckCircle, XCircle, Hourglass, Repeat, FileText, Info, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format, parseISO, addHours, setHours, setMinutes, startOfDay, isEqual, addWeeks, isBefore, differenceInHours } from 'date-fns';
import { nl } from 'date-fns/locale';
import { allHomeworkSubjects, type SubjectOption } from '@/lib/quiz-data/subject-data';
import { FormattedDateCell } from '@/components/admin/user-management/FormattedDateCell';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';


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
  recurringGroupId?: string; // Optional: to group recurring lessons
  report?: string; 
}

const initialScheduledLessons: ScheduledLesson[] = [
  { id: 'sl1', childId: 'child1', childName: 'Sofie de Tester', subject: 'Wiskunde', subjectId: 'wiskunde', dateTime: addHours(new Date(), 2).toISOString(), durationMinutes: 60, tutorName: 'Mevr. Jansen', status: 'Gepland' },
  { id: 'sl1-short', childId: 'child1', childName: 'Sofie de Tester', subject: 'Wiskunde Kort', subjectId: 'wiskunde', dateTime: addHours(new Date(), 4).toISOString(), durationMinutes: 60, tutorName: 'Mevr. Jansen', status: 'Gepland' },
  { id: 'sl1-medium', childId: 'child1', childName: 'Sofie de Tester', subject: 'Wiskunde Medium', subjectId: 'wiskunde', dateTime: addHours(new Date(), 12).toISOString(), durationMinutes: 60, tutorName: 'Mevr. Jansen', status: 'Gepland' },
  { id: 'sl2', childId: 'child2', childName: 'Max de Tester', subject: 'Engels', subjectId: 'engels', dateTime: addHours(new Date(), 26).toISOString(), durationMinutes: 45, tutorName: 'Dhr. Pietersen', status: 'Gepland' },
  { id: 'sl3', childId: 'child1', childName: 'Sofie de Tester', subject: 'Nederlands', subjectId: 'nederlands', dateTime: addHours(new Date(), -48).toISOString(), durationMinutes: 60, tutorName: 'Mevr. de Wit', status: 'Voltooid', report: "Sofie heeft goed geoefend met werkwoordspelling. De d/t regels zijn nog een aandachtspunt. Tip: extra oefeningen maken op www.voorbeeld.nl/dt. Volgende les focussen op onregelmatige werkwoorden." },
  { id: 'sl4', childId: 'child2', childName: 'Max de Tester', subject: 'Geschiedenis', subjectId: 'geschiedenis', dateTime: addHours(new Date(), -72).toISOString(), durationMinutes: 45, tutorName: 'Dhr. Bakker', status: 'Voltooid' },
  { id: 'sl5', childId: 'child1', childName: 'Sofie de Tester', subject: 'Biologie', subjectId: 'biologie', dateTime: addHours(new Date(), -120).toISOString(), durationMinutes: 60, tutorName: 'Mevr. Groen', status: 'Voltooid', report: "De celbiologie is goed doorgenomen. Sofie stelde gerichte vragen en toonde begrip. Het practicum volgende week zal helpen de theorie verder te verankeren." },
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
  const [selectedTutor, setSelectedTutor] = useState<string>('');

  const [isRecurring, setIsRecurring] = useState(false);
  const [repeatUntilDate, setRepeatUntilDate] = useState<Date | undefined>(undefined);

  const [scheduledLessons, setScheduledLessons] = useState<ScheduledLesson[]>(initialScheduledLessons);
  
  const [isReportViewOpen, setIsReportViewOpen] = useState(false);
  const [selectedReportText, setSelectedReportText] = useState<string | null>(null);
  const [selectedLessonForReportView, setSelectedLessonForReportView] = useState<ScheduledLesson | null>(null);

  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [lessonToCancel, setLessonToCancel] = useState<ScheduledLesson | null>(null);
  const [cancelationMessage, setCancelationMessage] = useState('');


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
    const recurringGroupId = isRecurring ? `recur-${Date.now()}` : undefined;

    if (isRecurring && repeatUntilDate) {
        let currentLessonStartDate = startOfDay(selectedDate);
        while (isBefore(currentLessonStartDate, repeatUntilDate) || isEqual(currentLessonStartDate, repeatUntilDate)) {
            const lessonDateTime = setMinutes(setHours(currentLessonStartDate, hours), minutes);
            lessonsToSchedule.push({
                id: `sl-${Date.now()}-${lessonsToSchedule.length}`, 
                childId: child.id,
                childName: child.name,
                subject: subjectInfo.name,
                subjectId: subjectInfo.id,
                dateTime: lessonDateTime.toISOString(),
                durationMinutes: duration,
                tutorName: selectedTutor || 'Nog te bepalen',
                status: 'Gepland',
                recurringGroupId: recurringGroupId,
            });
            currentLessonStartDate = addWeeks(currentLessonStartDate, 1);
        }
    } else {
        const lessonDateTime = setMinutes(setHours(startOfDay(selectedDate), hours), minutes);
        lessonsToSchedule.push({
            id: `sl-${Date.now()}`,
            childId: child.id,
            childName: child.name,
            subject: subjectInfo.name,
            subjectId: subjectInfo.id,
            dateTime: lessonDateTime.toISOString(),
            durationMinutes: duration,
            tutorName: selectedTutor || 'Nog te bepalen',
            status: 'Gepland',
        });
    }
    
    if (lessonsToSchedule.length > 0) {
        setScheduledLessons(prev => [...lessonsToSchedule, ...prev].sort((a,b) => parseISO(b.dateTime).getTime() - parseISO(a.dateTime).getTime() ));
        toast({
          title: isRecurring ? "Reeks Lessen Ingepland!" : "Les Ingepland!",
          description: isRecurring 
            ? `${lessonsToSchedule.length} lessen (${subjectInfo.name}) voor ${child.name} wekelijks ingepland tot ${format(repeatUntilDate!, 'PPP', { locale: nl })}.`
            : `Les ${subjectInfo.name} voor ${child.name} op ${format(parseISO(lessonsToSchedule[0].dateTime), 'PPPp', { locale: nl })} is succesvol ingepland.`,
        });
    }
  };
  
  const handleCancelLessonClick = (lesson: ScheduledLesson) => {
    const now = new Date();
    const lessonDateTime = parseISO(lesson.dateTime);
    const hoursUntilLesson = differenceInHours(lessonDateTime, now);

    let msg = `Weet u zeker dat u de les ${lesson.subject} voor ${lesson.childName} op ${format(lessonDateTime, 'PPPp', {locale: nl})} wilt annuleren?\n\nAnnuleringsvoorwaarden:\n`;

    if (hoursUntilLesson >= 24) {
      msg += "• Kosteloos annuleren (meer dan 24 uur van tevoren).";
    } else if (hoursUntilLesson >= 6 && hoursUntilLesson < 24) {
      msg += "• 25% van de leskosten wordt in rekening gebracht (annulering tussen 6 en 24 uur van tevoren).";
    } else if (hoursUntilLesson >= 0 && hoursUntilLesson < 6) { // Consider >= 0 for very short notice
      msg += "• 50% van de leskosten wordt in rekening gebracht (annulering minder dan 6 uur van tevoren).\nLet op: dit is geen no-show. Bij een no-show (niet komen opdagen zonder annulering) kan 100% in rekening worden gebracht.";
    } else {
      // Lesson is in the past or too close to call it a standard cancellation for cost calculation through this dialog
      msg = `De les ${lesson.subject} voor ${lesson.childName} op ${format(lessonDateTime, 'PPPp', {locale: nl})} kan niet meer via deze weg geannuleerd worden omdat deze al gestart is of in het verleden ligt. Neem contact op met support als dit niet correct is.`;
      // Optionally disable confirmation button if lesson is in the past
    }
    
    setCancelationMessage(msg);
    setLessonToCancel(lesson);
    setIsCancelDialogOpen(true);
  };

  const confirmCancelLesson = () => {
    if (lessonToCancel) {
      // Check if lesson is in the past again before actually cancelling, if needed
      const now = new Date();
      const lessonDateTime = parseISO(lessonToCancel.dateTime);
      if (isBefore(lessonDateTime, now) && differenceInHours(lessonDateTime, now) < -lessonToCancel.durationMinutes/60) { // Check if lesson end time is past
          toast({ title: "Annulering mislukt", description: "Deze les is al afgelopen en kan niet meer geannuleerd worden.", variant: "destructive"});
      } else {
        setScheduledLessons(prev => prev.map(l => l.id === lessonToCancel!.id ? {...l, status: 'Geannuleerd'} : l));
        toast({ title: "Les geannuleerd", description: `De les ${lessonToCancel.subject} is geannuleerd. Eventuele kosten worden verrekend.`, variant: "default"});
      }
      setIsCancelDialogOpen(false);
      setLessonToCancel(null);
    }
  };
  
  const markAsCompleted = (lessonId: string) => {
     setScheduledLessons(prev => prev.map(l => l.id === lessonId ? {...l, status: 'Voltooid'} : l));
     toast({ title: "Les gemarkeerd als voltooid", variant: "default"});
  };

  const handleViewReport = (lesson: ScheduledLesson) => {
    if (lesson.report) {
      setSelectedLessonForReportView(lesson);
      setSelectedReportText(lesson.report);
      setIsReportViewOpen(true);
    } else {
      toast({ title: "Geen verslag", description: "Er is geen verslag beschikbaar voor deze les.", variant: "default"});
    }
  };

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
          <TabsTrigger value="overview">Overzicht Lessen ({scheduledLessons.filter(l => l.status !== 'Geannuleerd').length})</TabsTrigger>
        </TabsList>

        <TabsContent value="plan" className="mt-6">
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
        </TabsContent>

        <TabsContent value="overview" className="mt-6">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Overzicht van alle lessen</CardTitle>
              <CardDescription>Bekijk, wijzig of annuleer lessen. Hier kunt u ook de verslagen van voltooide lessen inzien.</CardDescription>
            </CardHeader>
            <CardContent>
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
                      <TableHead>Verslag</TableHead>
                      <TableHead className="text-right">Acties</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {scheduledLessons.length === 0 && (
                      <TableRow><TableCell colSpan={8} className="h-24 text-center">Nog geen lessen gepland.</TableCell></TableRow>
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
                            {lesson.recurringGroupId && <Repeat className="ml-1.5 h-3 w-3 inline-block" title="Herhalende les"/>}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {lesson.status === 'Voltooid' && lesson.report ? (
                            <Button variant="outline" size="sm" onClick={() => handleViewReport(lesson)}>
                              <FileText className="mr-2 h-4 w-4"/> Bekijk
                            </Button>
                          ) : (
                            <span className="text-xs text-muted-foreground">N.v.t.</span>
                          )}
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
                                <DropdownMenuItem onClick={() => handleCancelLessonClick(lesson)} className="text-destructive focus:text-destructive">
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

      <Dialog open={isReportViewOpen} onOpenChange={setIsReportViewOpen}>
        <DialogContent className="sm:max-w-lg">
            <DialogHeader>
                <DialogTitle>Lesverslag: {selectedLessonForReportView?.subject} - {selectedLessonForReportView?.childName}</DialogTitle>
                <DialogDescription>
                    Les gegeven door {selectedLessonForReportView?.tutorName} op <FormattedDateCell isoDateString={selectedLessonForReportView?.dateTime || ''} dateFormatPattern="PPPp" />.
                </DialogDescription>
            </DialogHeader>
            <div className="py-4 max-h-[60vh] overflow-y-auto">
                <p className="text-sm text-foreground whitespace-pre-wrap">{selectedReportText || "Geen verslag beschikbaar."}</p>
            </div>
            <DialogFooter>
                <DialogClose asChild>
                    <Button type="button" variant="outline">Sluiten</Button>
                </DialogClose>
            </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
                <AlertTriangle className="h-6 w-6 text-destructive" /> Les Annuleren
            </AlertDialogTitle>
            <AlertDialogDescription className="whitespace-pre-wrap">
              {cancelationMessage}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setLessonToCancel(null)}>Nee, niet annuleren</AlertDialogCancel>
            <AlertDialogAction 
                onClick={confirmCancelLesson} 
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                disabled={lessonToCancel ? isBefore(parseISO(lessonToCancel.dateTime), new Date()) && differenceInHours(parseISO(lessonToCancel.dateTime), new Date()) < -lessonToCancel.durationMinutes/60 : false}
            >
              Ja, bevestig annulering
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </div>
  );
}

