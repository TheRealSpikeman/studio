// src/app/dashboard/coach/students/page.tsx
// Initial content copied from tutor/students, then adjusted for coach
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ArrowLeft, Users, MoreVertical, FileText, MessageSquare, AlertTriangle, History, Handshake } from 'lucide-react';
import { FormattedDateCell } from '@/components/admin/user-management/FormattedDateCell';
import type { ClientEntry } from '@/types/dashboard';

const dummyClients: ClientEntry[] = [
  { id: 'clientA', name: 'Anna Visser', avatarUrl: 'https://picsum.photos/seed/annavisser/40/40', coachingFocusAreas: ['Zelfvertrouwen', 'Stressmanagement'], lastSessionDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), totalSessionsWithCoach: 8 },
  { id: 'clientB', name: 'Ben Kramer', coachingFocusAreas: ['Communicatievaardigheden'], lastSessionDate: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(), totalSessionsWithCoach: 4 },
  { id: 'clientC', name: 'Carla de Jong', avatarUrl: 'https://picsum.photos/seed/carladejong/40/40', coachingFocusAreas: ['Doelen stellen', 'Perfectionisme'], totalSessionsWithCoach: 12 },
];

function ClientTable({ clients }: { clients: ClientEntry[] }) { // Renamed from StudentTable
  const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').toUpperCase() || 'NN';

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Cliënt</TableHead>
            <TableHead>Focusgebieden (met deze coach)</TableHead>
            <TableHead>Totaal Sessies (met deze coach)</TableHead>
            <TableHead>Laatste Sessie (met deze coach)</TableHead>
            <TableHead className="text-right">Acties</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {clients.length === 0 && (
            <TableRow><TableCell colSpan={5} className="h-24 text-center">Geen cliënten gevonden.</TableCell></TableRow>
          )}
          {clients.map((client) => (
            <TableRow key={client.id}>
              <TableCell className="font-medium flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={client.avatarUrl} alt={client.name} data-ai-hint="client person" />
                  <AvatarFallback>{getInitials(client.name)}</AvatarFallback>
                </Avatar>
                {client.name}
              </TableCell>
              <TableCell>
                {client.coachingFocusAreas.map(area => (
                  <Badge key={area} variant="secondary" className="mr-1 mb-1 bg-teal-100 text-teal-700 border-teal-300">{area}</Badge>
                ))}
              </TableCell>
              <TableCell>{client.totalSessionsWithCoach || 'N/A'}</TableCell>
              <TableCell>
                {client.lastSessionDate ? <FormattedDateCell isoDateString={client.lastSessionDate} dateFormatPattern="P" /> : 'N/A'}
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreVertical className="h-4 w-4" /><span className="sr-only">Cliënt acties</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                     <DropdownMenuItem asChild>
                        <Link href={`/dashboard/coach/students/${client.id}`}> {/* Path can be updated later if needed */}
                           <History className="mr-2 h-4 w-4" />Bekijk Sessiehistorie
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


export default function CoachClientsPage() {
  const [clients, setClients] = useState<ClientEntry[]>(dummyClients);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
          <Handshake className="h-8 w-8 text-primary" />
          Mijn Cliënten
        </h1>
        <Button variant="outline" asChild>
          <Link href="/dashboard/coach">
            <ArrowLeft className="mr-2 h-4 w-4" /> Terug naar Coach Dashboard
          </Link>
        </Button>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">Cliëntenoverzicht</CardTitle>
          <CardDescription>Bekijk hier alle cliënten aan wie je coaching geeft of hebt gegeven.</CardDescription>
        </CardHeader>
        <CardContent>
          <ClientTable clients={clients} />
        </CardContent>
      </Card>
    </div>
  );
}
