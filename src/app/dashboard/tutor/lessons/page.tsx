// src/app/dashboard/tutor/lessons/page.tsx
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { ArrowLeft, CalendarDays, BookOpen, Video, MoreVertical, FileText, AlertTriangle, CheckCircle, XCircle, Hourglass, MessageSquarePlus, Edit3 } from 'lucide-react';
import { FormattedDateCell } from '@/components/admin/user-management/FormattedDateCell';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from '@/hooks/use-toast';

type LessonStatus = 'Gepland' | 'Voltooid' | 'Geannuleerd' | 'Bezig';
type ReportRecipient = 'student' | 'parent' | 'both';

interface Lesson {
  id: string;
  studentId: string; 
  studentName: string;
  studentAvatar?: string;
  subject: string;
  dateTime: string; // ISO string
  durationMinutes: number;
  status: LessonStatus;
  meetingLink?: string;
  notes?: string; 
  report?: string; 
}

const dummyUpcomingLessons: Lesson[] = [
  { id: 'l1', studentId: 's1', studentName: 'Eva de Vries', studentAvatar: 'https://picsum.photos/seed/evavries/40/40', subject: 'Wiskunde A', dateTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), durationMinutes: 60, status: 'Gepland', meetingLink: '#' },
  { id: 'l2', studentId: 's2', studentName: 'Tom Bakker', subject: 'Engels Spreken', dateTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), durationMinutes: 45, status: 'Gepland' },
  { id: 'l3', studentId: 's3', studentName: 'Sara El Idrissi', studentAvatar: 'https://picsum.photos/seed/saraidrissi/40/40', subject: 'Natuurkunde H.5', dateTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), durationMinutes: 60, status: 'Gepland' },
];

const dummyPastLessons: Lesson[] = [
  { id: 'p1', studentId: 's1', studentName: 'Jan Janssen', subject: 'Wiskunde B', dateTime: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), durationMinutes: 60, status: 'Voltooid', report: "Jan heeft goed gewerkt aan de stelling van Pythagoras. Oefenen met toepassingen is nog nodig." },
  { id: 'p2', studentId: 's2', studentName: 'Pien de Wit', studentAvatar: 'https://picsum.photos/seed/piendewit/40/40', subject: 'Nederlands Grammatica', dateTime: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), durationMinutes: 45, status: 'Voltooid' },
  { id: 'p3', studentId: 's3', studentName: 'Mo El Hamdaoui', subject: 'Scheikunde', dateTime: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), durationMinutes: 60, status: 'Geannuleerd', report: "Les geannuleerd door student." },
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


function LessonTable({ lessons, onOpenReportDialog }: { lessons: Lesson[], onOpenReportDialog: (lesson: Lesson) => void }) {
  const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').toUpperCase() || 'NN';

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Datum & Tijd</TableHead>
            <TableHead>Leerling</TableHead>
            <TableHead>Vak</TableHead>
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
              <TableCell className="font-medium flex items-center gap-2">
                <Avatar className="h-7 w-7">
                  <AvatarImage src={lesson.studentAvatar} alt={lesson.studentName} data-ai-hint="student person" />
                  <AvatarFallback>{getInitials(lesson.studentName)}</AvatarFallback>
                </Avatar>
                {lesson.studentName}
              </TableCell>
              <TableCell>{lesson.subject}</TableCell>
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
                      <MoreVertical className="h-4 w-4" /><span className="sr-only">Les acties</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {lesson.status === 'Gepland' && (
                      <DropdownMenuItem disabled={!lesson.meetingLink}>
                        <Video className="mr-2 h-4 w-4" />Start Les (Binnenkort)
                      </DropdownMenuItem>
                    )}
                     <DropdownMenuItem disabled>
                        <FileText className="mr-2 h-4 w-4" />Bekijk Details (Binnenkort)
                     </DropdownMenuItem>
                    {lesson.status === 'Gepland' && (
                        <DropdownMenuItem className="text-orange-600 focus:text-orange-700">
                            <Hourglass className="mr-2 h-4 w-4" />Markeer als Bezig (Demo)
                        </DropdownMenuItem>
                    )}
                    {(lesson.status === 'Gepland' || lesson.status === 'Bezig') && (
                        <DropdownMenuItem className="text-green-600 focus:text-green-700">
                            <CheckCircle className="mr-2 h-4 w-4" />Markeer als Voltooid
                        </DropdownMenuItem>
                    )}
                    {(lesson.status === 'Voltooid' || lesson.status === 'Bezig') && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => onOpenReportDialog(lesson)}>
                          {lesson.report ? <Edit3 className="mr-2 h-4 w-4" /> : <MessageSquarePlus className="mr-2 h-4 w-4" />}
                          {lesson.report ? 'Verslag Bekijken/Bewerken' : 'Verslag Schrijven'}
                        </DropdownMenuItem>
                      </>
                    )}
                    {lesson.status === 'Gepland' && (
                      <DropdownMenuItem className="text-destructive focus:text-destructive">
                        <XCircle className="mr-2 h-4 w-4" />Annuleer Les
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem disabled>
                      <AlertTriangle className="mr-2 h-4 w-4" />Rapporteer Probleem
                    </DropdownMenuItem>
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


export default function TutorLessonsPage() {
  const { toast } = useToast();
  const [lessons, setLessons] = useState<{upcoming: Lesson[], past: Lesson[]}>({upcoming: dummyUpcomingLessons, past: dummyPastLessons});
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);
  const [selectedLessonForReport, setSelectedLessonForReport] = useState<Lesson | null>(null);
  const [reportText, setReportText] = useState('');
  const [reportRecipient, setReportRecipient] = useState<ReportRecipient>('student');

  const handleOpenReportDialog = (lesson: Lesson) => {
    setSelectedLessonForReport(lesson);
    setReportText(lesson.report || '');
    setReportRecipient('student'); // Reset to default when opening
    setIsReportDialogOpen(true);
  };

  const handleSaveReport = () => {
    if (selectedLessonForReport) {
      const lessonType = lessons.upcoming.find(l => l.id === selectedLessonForReport.id) ? 'upcoming' : 'past';
      
      setLessons(prev => ({
        ...prev,
        [lessonType]: prev[lessonType].map(l => 
          l.id === selectedLessonForReport.id ? { ...l, report: reportText } : l
        )
      }));

      let recipientText = "onbekend";
      if (reportRecipient === 'student') recipientText = "de leerling";
      if (reportRecipient === 'parent') recipientText = "de ouder(s)";
      if (reportRecipient === 'both') recipientText = "de leerling en ouder(s)";

      toast({
        title: "Lesverslag Opgeslagen",
        description: `Verslag voor les "${selectedLessonForReport.subject}" met ${selectedLessonForReport.studentName} is opgeslagen. Een kopie wordt (gesimuleerd) gestuurd naar ${recipientText}.`,
      });
      console.log("Report to save:", reportText, "For lesson:", selectedLessonForReport.id, "Send to:", reportRecipient);
      setIsReportDialogOpen(false);
      setSelectedLessonForReport(null);
      setReportText('');
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
          <BookOpen className="h-8 w-8 text-primary" />
          Mijn Geplande Lessen
        </h1>
        <Button variant="outline" asChild>
          <Link href="/dashboard/tutor">
            <ArrowLeft className="mr-2 h-4 w-4" /> Terug naar Tutor Dashboard
          </Link>
        </Button>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><CalendarDays className="h-6 w-6 text-primary"/>Lesoverzicht</CardTitle>
          <CardDescription>Beheer hier je aankomende en afgelopen online bijlessen.</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="upcoming">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="upcoming">Aankomend</TabsTrigger>
              <TabsTrigger value="past">Afgelopen</TabsTrigger>
            </TabsList>
            <TabsContent value="upcoming" className="mt-4">
              <LessonTable lessons={lessons.upcoming} onOpenReportDialog={handleOpenReportDialog} />
            </TabsContent>
            <TabsContent value="past" className="mt-4">
              <LessonTable lessons={lessons.past} onOpenReportDialog={handleOpenReportDialog} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Dialog open={isReportDialogOpen} onOpenChange={setIsReportDialogOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>
              Lesverslag voor {selectedLessonForReport?.subject} met {selectedLessonForReport?.studentName}
            </DialogTitle>
            <DialogDescription>
              Schrijf hier een kort verslag van de les. Wat is er behandeld? Hoe ging het? Wat zijn aandachtspunten?
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <Textarea 
              placeholder="Typ hier je verslag..." 
              value={reportText}
              onChange={(e) => setReportText(e.target.value)}
              rows={8}
            />
            <div>
              <Label className="text-sm font-medium mb-2 block">Verstuur verslag naar (gesimuleerd):</Label>
              <RadioGroup value={reportRecipient} onValueChange={(value) => setReportRecipient(value as ReportRecipient)} className="space-y-2">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="student" id="r-student" />
                  <Label htmlFor="r-student" className="font-normal cursor-pointer">Alleen naar leerling</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="parent" id="r-parent" />
                  <Label htmlFor="r-parent" className="font-normal cursor-pointer">Alleen naar ouder(s)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="both" id="r-both" />
                  <Label htmlFor="r-both" className="font-normal cursor-pointer">Naar leerling én ouder(s)</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">Annuleren</Button>
            </DialogClose>
            <Button type="button" onClick={handleSaveReport}>Verslag Opslaan & Versturen</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
