// src/app/dashboard/ouder/lessen/aankomend/page.tsx
"use client";

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, CalendarDays, BookOpen, MoreVertical, CheckCircle, XCircle, Hourglass, Repeat, FileText, Info, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format, parseISO, isBefore, differenceInHours } from 'date-fns';
import { nl } from 'date-fns/locale';
import { FormattedDateCell } from '@/components/admin/user-management/FormattedDateCell';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

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
  recurringGroupId?: string;
  report?: string;
}

// Deze data zou idealiter uit een service of context komen, maar voor nu dupliceren we het.
const initialScheduledLessons: ScheduledLesson[] = [
  { id: 'sl1', childId: 'child1', childName: 'Sofie de Tester', subject: 'Wiskunde', subjectId: 'wiskunde', dateTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), durationMinutes: 60, tutorName: 'Mevr. Jansen', status: 'Gepland' },
  { id: 'sl1-short', childId: 'child1', childName: 'Sofie de Tester', subject: 'Wiskunde Kort', subjectId: 'wiskunde', dateTime: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(), durationMinutes: 60, tutorName: 'Mevr. Jansen', status: 'Gepland' },
  { id: 'sl1-medium', childId: 'child1', childName: 'Sofie de Tester', subject: 'Wiskunde Medium', subjectId: 'wiskunde', dateTime: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString(), durationMinutes: 60, tutorName: 'Mevr. Jansen', status: 'Bezig' },
  { id: 'sl2', childId: 'child2', childName: 'Max de Tester', subject: 'Engels', subjectId: 'engels', dateTime: new Date(Date.now() + 26 * 60 * 60 * 1000).toISOString(), durationMinutes: 45, tutorName: 'Dhr. Pietersen', status: 'Gepland' },
  { id: 'sl3', childId: 'child1', childName: 'Sofie de Tester', subject: 'Nederlands', subjectId: 'nederlands', dateTime: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(), durationMinutes: 60, tutorName: 'Mevr. de Wit', status: 'Voltooid', report: "Sofie heeft goed geoefend met werkwoordspelling. De d/t regels zijn nog een aandachtspunt. Tip: extra oefeningen maken op www.voorbeeld.nl/dt. Volgende les focussen op onregelmatige werkwoorden." },
  { id: 'sl4', childId: 'child2', childName: 'Max de Tester', subject: 'Geschiedenis', subjectId: 'geschiedenis', dateTime: new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString(), durationMinutes: 45, tutorName: 'Dhr. Bakker', status: 'Voltooid' },
  { id: 'sl5', childId: 'child1', childName: 'Sofie de Tester', subject: 'Biologie', subjectId: 'biologie', dateTime: new Date(Date.now() - 120 * 60 * 60 * 1000).toISOString(), durationMinutes: 60, tutorName: 'Mevr. Groen', status: 'Geannuleerd' },
  { id: 'sl6', childId: 'child3', childName: 'Lisa Voorbeeld', subject: 'Aardrijkskunde', subjectId: 'aardrijkskunde', dateTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), durationMinutes: 60, tutorName: 'Mevr. Sterre', status: 'Gepland', recurringGroupId: 'recur-lisa-ak' },
  { id: 'sl7', childId: 'child3', childName: 'Lisa Voorbeeld', subject: 'Aardrijkskunde', subjectId: 'aardrijkskunde', dateTime: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(), durationMinutes: 60, tutorName: 'Mevr. Sterre', status: 'Gepland', recurringGroupId: 'recur-lisa-ak' },
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

function LessonTable({ lessons, onCancelLesson, onViewReport }: { 
    lessons: ScheduledLesson[], 
    onCancelLesson: (lesson: ScheduledLesson) => void,
    onViewReport: (lesson: ScheduledLesson) => void
}) {
  return (
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
          {lessons.length === 0 && (
            <TableRow><TableCell colSpan={8} className="h-24 text-center">Nog geen aankomende lessen.</TableCell></TableRow>
          )}
          {lessons.map((lesson) => (
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
                  <Button variant="outline" size="sm" onClick={() => onViewReport(lesson)}>
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
                      <DropdownMenuItem onClick={() => onCancelLesson(lesson)} className="text-destructive focus:text-destructive">
                          <XCircle className="mr-2 h-4 w-4" />Les Annuleren
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
  );
}

export default function AankomendeLessenPage() {
  const { toast } = useToast();
  const [scheduledLessons, setScheduledLessons] = useState<ScheduledLesson[]>(initialScheduledLessons);
  
  const [isReportViewOpen, setIsReportViewOpen] = useState(false);
  const [selectedReportText, setSelectedReportText] = useState<string | null>(null);
  const [selectedLessonForReportView, setSelectedLessonForReportView] = useState<ScheduledLesson | null>(null);

  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [lessonToCancel, setLessonToCancel] = useState<ScheduledLesson | null>(null);
  const [cancelationMessage, setCancelationMessage] = useState('');

  const upcomingLessons = useMemo(() => 
    scheduledLessons
      .filter(l => l.status === 'Gepland' || l.status === 'Bezig')
      .sort((a,b) => {
        // Prioritize 'Bezig' status
        if (a.status === 'Bezig' && b.status !== 'Bezig') return -1;
        if (a.status !== 'Bezig' && b.status === 'Bezig') return 1;
        // Then sort by date
        return parseISO(a.dateTime).getTime() - parseISO(b.dateTime).getTime();
      }), 
    [scheduledLessons]
  );

  const handleCancelLessonClick = (lesson: ScheduledLesson) => {
    const now = new Date();
    const lessonDateTime = parseISO(lesson.dateTime);
    const hoursUntilLesson = differenceInHours(lessonDateTime, now);

    let msg = `Weet u zeker dat u de les ${lesson.subject} voor ${lesson.childName} op ${format(lessonDateTime, 'PPPp', {locale: nl})} wilt annuleren?\n\nAnnuleringsvoorwaarden:\n`;

    if (hoursUntilLesson >= 24) {
      msg += "• Kosteloos annuleren (meer dan 24 uur van tevoren).";
    } else if (hoursUntilLesson >= 6 && hoursUntilLesson < 24) {
      msg += "• 25% van de leskosten wordt in rekening gebracht (annulering tussen 6 en 24 uur van tevoren).";
    } else if (hoursUntilLesson >= 0 && hoursUntilLesson < 6) {
      msg += "• 50% van de leskosten wordt in rekening gebracht (annulering minder dan 6 uur van tevoren).\nLet op: dit is geen no-show. Bij een no-show (niet komen opdagen zonder annulering) kan 100% in rekening worden gebracht.";
    } else {
      msg = `De les ${lesson.subject} voor ${lesson.childName} op ${format(lessonDateTime, 'PPPp', {locale: nl})} kan niet meer via deze weg geannuleerd worden omdat deze al gestart is of in het verleden ligt. Neem contact op met support als dit niet correct is.`;
    }
    
    setCancelationMessage(msg);
    setLessonToCancel(lesson);
    setIsCancelDialogOpen(true);
  };

  const confirmCancelLesson = () => {
    if (lessonToCancel) {
      const now = new Date();
      const lessonDateTime = parseISO(lessonToCancel.dateTime);
      const lessonEndTime = new Date(lessonDateTime.getTime() + lessonToCancel.durationMinutes * 60000);

      if (isBefore(lessonEndTime, now)) {
          toast({ title: "Annulering mislukt", description: "Deze les is al afgelopen en kan niet meer geannuleerd worden.", variant: "destructive"});
      } else {
        setScheduledLessons(prev => prev.map(l => l.id === lessonToCancel!.id ? {...l, status: 'Geannuleerd'} : l));
        toast({ title: "Les geannuleerd", description: `De les ${lessonToCancel.subject} is geannuleerd. Eventuele kosten worden verrekend.`, variant: "default"});
      }
      setIsCancelDialogOpen(false);
      setLessonToCancel(null);
    }
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
            Aankomende Lessen Kinderen
          </h1>
          <p className="text-muted-foreground">
            Een overzicht van alle geplande en lopende lessen.
          </p>
        </div>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Geplande en Lopende Lessen</CardTitle>
          <CardDescription>Bekijk, wijzig of annuleer aankomende lessen. Voltooide lessen en verslagen vindt u in het 'Lessen Overzicht'.</CardDescription>
        </CardHeader>
        <CardContent>
          <LessonTable lessons={upcomingLessons} onCancelLesson={handleCancelLessonClick} onViewReport={handleViewReport} />
        </CardContent>
      </Card>

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
                disabled={lessonToCancel ? isBefore(parseISO(lessonToCancel.dateTime), new Date()) && differenceInHours(parseISO(lessonToCancel.dateTime), new Date()) < -(lessonToCancel.durationMinutes/60) : false}
            >
              Ja, bevestig annulering
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
