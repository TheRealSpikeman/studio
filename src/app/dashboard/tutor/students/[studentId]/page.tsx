// src/app/dashboard/tutor/students/[studentId]/page.tsx
"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, User, CalendarDays, BookOpen, Edit3, MessageSquarePlus, Eye } from 'lucide-react';
import { FormattedDateCell } from '@/components/admin/user-management/FormattedDateCell';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';

// Duplicating Lesson interface and related types for simplicity in this example
// In a real app, these would be in a shared types file.
type LessonStatus = 'Gepland' | 'Voltooid' | 'Geannuleerd' | 'Bezig';
interface LessonForHistory {
  id: string;
  subject: string;
  dateTime: string; // ISO string
  durationMinutes: number;
  status: LessonStatus;
  report?: string; // Post-lesson report
}

interface StudentDetails {
  id: string;
  name: string;
  avatarUrl?: string;
  email?: string; // Optional: could be fetched or part of student data
  lessonHistory: LessonForHistory[];
}

// Dummy data source - replace with actual data fetching
const allStudentDetails: Record<string, StudentDetails> = {
  s1: {
    id: 's1',
    name: 'Eva de Vries',
    avatarUrl: 'https://picsum.photos/seed/evavries/80/80',
    email: 'eva.devries@example.com',
    lessonHistory: [
      { id: 'l1', subject: 'Wiskunde A', dateTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), durationMinutes: 60, status: 'Gepland' },
      { id: 'p1s1', subject: 'Wiskunde A', dateTime: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), durationMinutes: 60, status: 'Voltooid', report: "Eva begrijpt de basis van functies goed. Volgende keer focussen op afgeleiden." },
      { id: 'p4s1', subject: 'Natuurkunde', dateTime: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), durationMinutes: 45, status: 'Voltooid', report: "Mechanica doorgenomen, huiswerkopgaven besproken. Goede vooruitgang." },
    ],
  },
  s2: {
    id: 's2',
    name: 'Tom Bakker',
    email: 'tom.bakker@example.com',
    lessonHistory: [
      { id: 'l2', subject: 'Engels Spreken', dateTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), durationMinutes: 45, status: 'Gepland' },
      { id: 'p2s2', subject: 'Engels Grammatica', dateTime: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), durationMinutes: 45, status: 'Voltooid' },
    ],
  },
  // Add more student details as needed
};

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

export default function StudentDetailPage() {
  const params = useParams();
  const studentId = params.studentId as string;
  const [student, setStudent] = useState<StudentDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);
  const [selectedLessonForReport, setSelectedLessonForReport] = useState<LessonForHistory | null>(null);
  const [reportText, setReportText] = useState('');
  const [sendCopyToParent, setSendCopyToParent] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Simulate data fetching
    setIsLoading(true);
    const fetchedStudent = allStudentDetails[studentId];
    if (fetchedStudent) {
      setStudent(fetchedStudent);
    } else {
      // Handle student not found, e.g., redirect or show error
      console.error("Student not found with ID:", studentId);
    }
    setIsLoading(false);
  }, [studentId]);
  
  const getInitials = (name?: string) => name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'NN';

  const handleOpenReportDialog = (lesson: LessonForHistory) => {
    setSelectedLessonForReport(lesson);
    setReportText(lesson.report || '');
    setSendCopyToParent(false);
    setIsReportDialogOpen(true);
  };

  const handleSaveReport = () => {
    if (selectedLessonForReport && student) {
      // Simulate saving the report for this student's lesson
      const updatedLessonHistory = student.lessonHistory.map(l =>
        l.id === selectedLessonForReport.id ? { ...l, report: reportText } : l
      );
      setStudent(prev => prev ? { ...prev, lessonHistory: updatedLessonHistory } : null);
      
      // Also update the global dummy data (if this page were to affect it directly)
      // This is a hack for demo; in real app, data comes from backend.
      if(allStudentDetails[student.id]) {
          allStudentDetails[student.id].lessonHistory = updatedLessonHistory;
      }

      toast({
        title: "Lesverslag Opgeslagen",
        description: `Verslag voor les ${selectedLessonForReport.subject} is opgeslagen. ${sendCopyToParent ? "Kopie (gesimuleerd) naar ouders." : ""}`,
      });
      setIsReportDialogOpen(false);
    }
  };


  if (isLoading) {
    return <div className="p-8 text-center">Leerlinggegevens laden...</div>;
  }

  if (!student) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-2xl font-bold text-destructive">Leerling niet gevonden</h1>
        <p className="text-muted-foreground">De opgevraagde leerling kon niet worden gevonden.</p>
        <Button asChild variant="link" className="mt-4">
          <Link href="/dashboard/tutor/students">Terug naar leerlingenoverzicht</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
                <AvatarImage src={student.avatarUrl} alt={student.name} data-ai-hint="student person" />
                <AvatarFallback className="text-2xl">{getInitials(student.name)}</AvatarFallback>
            </Avatar>
            <div>
                <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
                    <User className="h-8 w-8 text-primary" />
                    {student.name}
                </h1>
                {student.email && <p className="text-muted-foreground">{student.email}</p>}
            </div>
        </div>
        <Button variant="outline" asChild>
          <Link href="/dashboard/tutor/students">
            <ArrowLeft className="mr-2 h-4 w-4" /> Terug naar Leerlingen
          </Link>
        </Button>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarDays className="h-6 w-6 text-primary" />
            Les Historie
          </CardTitle>
          <CardDescription>Overzicht van alle gevolgde lessen en bijbehorende verslagen.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Vak</TableHead>
                <TableHead>Datum & Tijd</TableHead>
                <TableHead>Duur</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Acties</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {student.lessonHistory.length === 0 && (
                <TableRow><TableCell colSpan={5} className="h-24 text-center">Nog geen lessen gevolgd.</TableCell></TableRow>
              )}
              {student.lessonHistory.map((lesson) => (
                <TableRow key={lesson.id}>
                  <TableCell className="font-medium">{lesson.subject}</TableCell>
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
                    <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleOpenReportDialog(lesson)}
                        disabled={lesson.status === 'Gepland' || lesson.status === 'Geannuleerd'}
                    >
                      {lesson.report ? <Eye className="mr-2 h-4 w-4" /> : <MessageSquarePlus className="mr-2 h-4 w-4" />}
                      {lesson.report ? 'Verslag Bekijken' : 'Verslag Toevoegen'}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      {/* Placeholder for future sections like communication log, goals, etc. */}
      <Card className="shadow-md">
        <CardHeader><CardTitle>Communicatie & Notities (Binnenkort)</CardTitle></CardHeader>
        <CardContent><p className="text-muted-foreground">Hier komt ruimte voor communicatielogboeken en algemene notities over de leerling.</p></CardContent>
      </Card>

      <Dialog open={isReportDialogOpen} onOpenChange={setIsReportDialogOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>
              Lesverslag voor {selectedLessonForReport?.subject}
            </DialogTitle>
            <DialogDescription>
              Les van <FormattedDateCell isoDateString={selectedLessonForReport?.dateTime || new Date().toISOString()} dateFormatPattern="PPPp" />.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <Textarea 
              placeholder="Typ hier je verslag..." 
              value={reportText}
              onChange={(e) => setReportText(e.target.value)}
              rows={8}
            />
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="sendCopyToParentDialog" 
                checked={sendCopyToParent}
                onCheckedChange={(checked) => setSendCopyToParent(Boolean(checked))}
              />
              <Label htmlFor="sendCopyToParentDialog" className="text-sm font-normal cursor-pointer">
                Stuur een kopie van dit verslag naar de ouder(s) (gesimuleerd).
              </Label>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">Annuleren</Button>
            </DialogClose>
            <Button type="button" onClick={handleSaveReport}>Verslag Opslaan</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
}
