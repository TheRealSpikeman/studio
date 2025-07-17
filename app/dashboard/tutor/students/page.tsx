// src/app/dashboard/tutor/students/page.tsx
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ArrowLeft, Users, MoreVertical, FileText, MessageSquare, AlertTriangle, History } from 'lucide-react';
import { FormattedDateCell } from '@/components/admin/user-management/FormattedDateCell';
import type { StudentEntry } from '@/types/dashboard';
import { dummyStudents } from '@/lib/data/dummy-data';

function StudentTable({ students }: { students: StudentEntry[] }) {
  const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').toUpperCase() || 'NN';

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Leerling</TableHead>
            <TableHead>Vak(ken) (met deze tutor)</TableHead>
            <TableHead>Totaal Lessen (met deze tutor)</TableHead>
            <TableHead>Laatste Les (met deze tutor)</TableHead>
            <TableHead className="text-right">Acties</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {students.length === 0 && (
            <TableRow><TableCell colSpan={5} className="h-24 text-center">Geen leerlingen gevonden.</TableCell></TableRow>
          )}
          {students.map((student) => (
            <TableRow key={student.id}>
              <TableCell className="font-medium flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={student.avatarUrl} alt={student.name} data-ai-hint="student person" />
                  <AvatarFallback>{getInitials(student.name)}</AvatarFallback>
                </Avatar>
                {student.name}
              </TableCell>
              <TableCell>
                {student.subjectsTaughtByTutor.map(subject => (
                  <Badge key={subject} variant="secondary" className="mr-1 mb-1">{subject}</Badge>
                ))}
              </TableCell>
              <TableCell>{student.totalLessonsWithTutor || 'N/A'}</TableCell>
              <TableCell>
                {student.lastLessonDate ? <FormattedDateCell isoDateString={student.lastLessonDate} dateFormatPattern="P" /> : 'N/A'}
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreVertical className="h-4 w-4" /><span className="sr-only">Leerling acties</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                     <DropdownMenuItem asChild>
                        <Link href={`/dashboard/tutor/students/${student.id}`}>
                           <History className="mr-2 h-4 w-4" />Bekijk Leshistorie
                        </Link>
                     </DropdownMenuItem>
                     <DropdownMenuItem disabled>
                        <FileText className="mr-2 h-4 w-4" />Voortgangsrapport (binnenkort)
                     </DropdownMenuItem>
                     <DropdownMenuItem disabled>
                        <MessageSquare className="mr-2 h-4 w-4" />Stuur Bericht (binnenkort)
                     </DropdownMenuItem>
                     <DropdownMenuItem disabled className="text-destructive focus:text-destructive">
                        <AlertTriangle className="mr-2 h-4 w-4" />Probleem Melden
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


export default function TutorStudentsPage() {
  const [students, setStudents] = useState<StudentEntry[]>(dummyStudents);
  // Future: Add filters for subject, etc.

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
          <Users className="h-8 w-8 text-primary" />
          Mijn Leerlingen
        </h1>
        <Button variant="outline" asChild>
          <Link href="/dashboard/tutor">
            <ArrowLeft className="mr-2 h-4 w-4" /> Terug naar Tutor Dashboard
          </Link>
        </Button>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">Leerlingenoverzicht</CardTitle>
          <CardDescription>Bekijk hier alle leerlingen aan wie je (online) bijles geeft of hebt gegeven.</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Future: Add search and filter inputs here */}
          <StudentTable students={students} />
        </CardContent>
      </Card>
    </div>
  );
}
