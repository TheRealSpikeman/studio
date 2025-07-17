// src/app/dashboard/admin/documentation/activity-log/page.tsx
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, BarChartHorizontal } from '@/lib/icons';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useState, useEffect } from 'react';
import type { ActivityLogEntry } from '@/types/activity-log';
import { FormattedDateCell } from '@/components/admin/user-management/FormattedDateCell';

const initialActivityLog: Omit<ActivityLogEntry, 'id'>[] = [
  { date: new Date(Date.now() - 86400000 * 5).toISOString(), startTime: '13:00', endTime: '16:00', durationMinutes: 180 },
  { date: new Date(Date.now() - 86400000 * 4).toISOString(), startTime: '09:30', endTime: '12:30', durationMinutes: 180 },
  { date: new Date(Date.now() - 86400000 * 4).toISOString(), startTime: '13:30', endTime: '15:00', durationMinutes: 90 },
  { date: new Date(Date.now() - 86400000 * 3).toISOString(), startTime: '10:15', endTime: '12:00', durationMinutes: 105 },
  { date: new Date(Date.now() - 86400000 * 2).toISOString(), startTime: '14:30', endTime: '16:45', durationMinutes: 135 },
  { date: new Date(Date.now() - 86400000 * 1).toISOString(), startTime: '11:00', endTime: '13:30', durationMinutes: 150 },
  { date: new Date().toISOString(), startTime: '09:05', endTime: '11:30', durationMinutes: 145 },
];


export default function ActivityLogPage() {
  const [activityLog, setActivityLog] = useState<Omit<ActivityLogEntry, 'id'>[]>([]);

  useEffect(() => {
    // In a real app, this would be an async fetch from a service
    setActivityLog(initialActivityLog);
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
          <BarChartHorizontal className="h-8 w-8 text-primary" />
          Activiteitenlogboek
        </h1>
        <Button variant="outline" asChild>
          <Link href="/dashboard/admin/documentation">
            <ArrowLeft className="mr-2 h-4 w-4" /> Terug naar Documentatie
          </Link>
        </Button>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Dummy Development Activiteit</CardTitle>
          <CardDescription>
            Dit logboek toont een gesimuleerd overzicht van ontwikkelingsactiviteiten om de functionaliteit te demonstreren. In een echte implementatie zou dit automatisch gegenereerd worden.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Datum</TableHead>
                <TableHead>Starttijd</TableHead>
                <TableHead>Eindtijd</TableHead>
                <TableHead className="text-right">Duur (minuten)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {activityLog.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    Geen activiteit gevonden.
                  </TableCell>
                </TableRow>
              ) : (
                activityLog.map((entry, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">
                        <FormattedDateCell isoDateString={entry.date} dateFormatPattern="PPP"/>
                    </TableCell>
                    <TableCell>{entry.startTime}</TableCell>
                    <TableCell>{entry.endTime}</TableCell>
                    <TableCell className="text-right">{entry.durationMinutes}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
