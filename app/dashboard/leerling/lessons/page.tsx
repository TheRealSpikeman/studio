"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, CalendarDays, BookOpen, Video, MoreVertical, FileText, AlertTriangle, CheckCircle, XCircle, Hourglass, Info, ClockIcon } from 'lucide-react';
import { FormattedDateCell } from '@/components/admin/user-management/FormattedDateCell';
import { Alert, AlertTitle as AlertTitleUi, AlertDescription as AlertDescriptionUi } from "@/components/ui/alert";
import { differenceInMinutes, formatDistanceToNowStrict, parseISO, isPast, isFuture, isToday } from 'date-fns';
import { nl } from 'date-fns/locale';

type LessonStatus = 'Gepland' | 'Voltooid' | 'Geannuleerd' | 'Bezig';

interface Lesson {
  id: string;
  studentId: string; 
  studentName: string; // Still useful for filtering if data source is shared
  tutorName?: string; // For leerling to see who the tutor is
  tutorAvatar?: string; // For leerling to see tutor avatar
  subject: string;
  dateTime: string; // ISO string
  durationMinutes: number;
  status: LessonStatus;
  meetingLink?: string;
  notes?: string; 
  report?: string; 
}

// Simulate current leerling ID
const CURRENT_LEERLING_ID = 's1'; // Eva de Vries

const dummyAllLessons: Lesson[] = [
  { id: 'l1', studentId: 's1', studentName: 'Eva de Vries', tutorName: 'Mevr. Jansen', subject: 'Wiskunde A', dateTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), durationMinutes: 60, status: 'Gepland', meetingLink: '#' },
  { id: 'l1-next', studentId: 's1', studentName: 'Eva de Vries', tutorName: 'Dhr. Pietersen', subject: 'Engels Grammatica', dateTime: new Date(Date.now() + 10 * 60 * 1000).toISOString(), durationMinutes: 45, status: 'Gepland', meetingLink: '#' },
  { id: 'l2', studentId: 's2', studentName: 'Tom Bakker', tutorName: 'Mevr. Jansen', subject: 'Engels Spreken', dateTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), durationMinutes: 45, status: 'Gepland' },
  { id: 'l3', studentId: 's3', studentName: 'Sara El Idrissi', tutorName: 'Dhr. de Wit', subject: 'Natuurkunde H.5', dateTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), durationMinutes: 60, status: 'Gepland' },
  { id: 'p1', studentId: 's1', studentName: 'Eva de Vries', tutorName: 'Mevr. Jansen', subject: 'Wiskunde B', dateTime: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), durationMinutes: 60, status: 'Voltooid', report: "Eva heeft goed gewerkt aan de stelling van Pythagoras. Oefenen met toepassingen is nog nodig." },
  { id: 'p2', studentId: 's2', studentName: 'Pien de Wit', tutorName: 'Mevr. Jansen', subject: 'Nederlands Grammatica', dateTime: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), durationMinutes: 45, status: 'Voltooid' },
  { id: 'p3', studentId: 's1', studentName: 'Eva de Vries', tutorName: 'Dhr. de Wit', subject: 'Scheikunde', dateTime: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), durationMinutes: 60, status: 'Geannuleerd', report: "Les geannuleerd door leerling." },
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

function LeerlingLessonTable({ lessons, onOpenReportDialog }: { lessons: Lesson[], onOpenReportDialog: (lesson: Lesson) => void }) {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Datum & Tijd</TableHead>
            <TableHead>Vak</TableHead>
            <TableHead>Tutor</TableHead>
            <TableHead>Duur</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Acties</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {lessons.length === 0 && (
            <TableRow><TableCell colSpan={6} className="h-24 text-center">Geen lessen gevonden.</TableCell></TableRow>
          )}
          {lessons.map((lesson) => (
            <TableRow key={lesson.id}>
              <TableCell>
                <FormattedDateCell isoDateString={lesson.dateTime} dateFormatPattern="E d MMM, HH:mm" />
              </TableCell>
              <TableCell className="font-medium">{lesson.subject}</TableCell>
              <TableCell>{lesson.tutorName || 'N.v.t.'}</TableCell>
              <TableCell>{lesson.durationMinutes} min</TableCell>
              <TableCell>
                <Badge variant={getStatusBadgeVariant(lesson.status)} className={getStatusBadgeClasses(lesson.status)}>
                  {lesson.status}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                {lesson.status === 'Voltooid' && lesson.report && (
                  <Button variant="outline" size="sm" onClick={() => onOpenReportDialog(lesson)}>
                    <FileText className="mr-2 h-4 w-4" /> Verslag
                  </Button>
                )}
                {lesson.status === 'Gepland' && new Date(lesson.dateTime) > new Date() && differenceInMinutes(new Date(lesson.dateTime), new Date()) <= 15 && (
                  <Button variant="default" size="sm" disabled={!lesson.meetingLink}>
                    <Video className="mr-2 h-4 w-4"/> Start Les (binnenkort)
                  </Button>
                )}
                {(lesson.status !== 'Voltooid' || !lesson.report) && !(lesson.status === 'Gepland' && new Date(lesson.dateTime) > new Date() && differenceInMinutes(new Date(lesson.dateTime), new Date()) <= 15) && (
                   <Button variant="outline" size="sm" disabled>
                    <Info className="mr-2 h-4 w-4" /> Details (binnenkort)
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}


export default function LeerlingLessonsPage() {
  const [upcomingLessons, setUpcomingLessons] = useState<Lesson[]>([]);
  const [pastLessons, setPastLessons] = useState<Lesson[]>([]);
  const [nextLessonCountdown, setNextLessonCountdown] = useState<string | null>(null);

  const [isReportViewOpen, setIsReportViewOpen] = useState(false);
  const [selectedReportText, setSelectedReportText] = useState<string | null>(null);
  const [selectedLessonForReportView, setSelectedLessonForReportView] = useState<Lesson | null>(null);


  useEffect(() => {
    const leerlingLessons = dummyAllLessons.filter(lesson => lesson.studentId === CURRENT_LEERLING_ID);
    const now = new Date();
    
    const upcoming = leerlingLessons
      .filter(lesson => !isPast(parseISO(lesson.dateTime)) || lesson.status === 'Bezig')
      .sort((a, b) => parseISO(a.dateTime).getTime() - parseISO(b.dateTime).getTime());
    
    const past = leerlingLessons
      .filter(lesson => isPast(parseISO(lesson.dateTime)) && lesson.status !== 'Bezig')
      .sort((a, b) => parseISO(b.dateTime).getTime() - parseISO(a.dateTime).getTime());
    
    setUpcomingLessons(upcoming);
    setPastLessons(past);

    if (upcoming.length > 0) {
      const nextLesson = upcoming[0];
      const updateCountdown = () => {
        const lessonTime = parseISO(nextLesson.dateTime);
        const minutesToLesson = differenceInMinutes(lessonTime, new Date());
        
        if (nextLesson.status === 'Bezig' || (minutesToLesson <= 0 && minutesToLesson > -nextLesson.durationMinutes && isToday(lessonTime))) {
            setNextLessonCountdown(`Je les "${nextLesson.subject}" is nu bezig!`);
        } else if (minutesToLesson > 0 && minutesToLesson <= 60) {
          setNextLessonCountdown(`Je les "${nextLesson.subject}" met ${nextLesson.tutorName || 'je tutor'} begint over ${formatDistanceToNowStrict(lessonTime, { locale: nl, unit: 'minute' })}!`);
        } else {
          setNextLessonCountdown(null);
        }
      };
      updateCountdown();
      const intervalId = setInterval(updateCountdown, 30000); // Update every 30 seconds
      return () => clearInterval(intervalId);
    } else {
      setNextLessonCountdown(null);
    }

  }, []);

  const handleOpenReportDialog = (lesson: Lesson) => {
    setSelectedLessonForReportView(lesson);
    setSelectedReportText(lesson.report || "Geen verslag beschikbaar voor deze les.");
    setIsReportViewOpen(true);
  };


  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
          <BookOpen className="h-8 w-8 text-primary" />
          Mijn Lessen
        </h1>
        <Button variant="outline" asChild>
          <Link href="/dashboard">
            <ArrowLeft className="mr-2 h-4 w-4" /> Terug naar Dashboard
          </Link>
        </Button>
      </div>

      {nextLessonCountdown && (
        <Alert variant="default" className="bg-primary/10 border-primary/30 text-primary">
          <ClockIcon className="h-5 w-5 !text-primary" />
          <AlertTitleUi className="font-semibold text-lg text-accent">{nextLessonCountdown}</AlertTitleUi>
          {upcomingLessons[0]?.meetingLink && (upcomingLessons[0]?.status === 'Gepland' || upcomingLessons[0]?.status === 'Bezig') && differenceInMinutes(parseISO(upcomingLessons[0].dateTime), new Date()) <= 15 && (
            <Button size="sm" className="mt-2" disabled>Start Les (binnenkort)</Button>
          )}
        </Alert>
      )}

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><CalendarDays className="h-6 w-6 text-primary"/>Lesoverzicht</CardTitle>
          <CardDescription>Bekijk hier je aankomende en afgelopen online bijlessen.</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="upcoming">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="upcoming">Aankomend ({upcomingLessons.length})</TabsTrigger>
              <TabsTrigger value="past">Afgelopen ({pastLessons.length})</TabsTrigger>
            </TabsList>
            <TabsContent value="upcoming" className="mt-4">
              <LeerlingLessonTable lessons={upcomingLessons} onOpenReportDialog={handleOpenReportDialog} />
            </TabsContent>
            <TabsContent value="past" className="mt-4">
              <LeerlingLessonTable lessons={pastLessons} onOpenReportDialog={handleOpenReportDialog} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

