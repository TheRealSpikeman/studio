// src/app/dashboard/coach/lessons/page.tsx
// Initial content copied from tutor/lessons, then adjusted for coach
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
import { ArrowLeft, CalendarDays, BookOpen, Video, MoreVertical, FileText, AlertTriangle, CheckCircle, XCircle, Hourglass, MessageSquarePlus, Edit3, HeartHandshake } from 'lucide-react';
import { FormattedDateCell } from '@/components/admin/user-management/FormattedDateCell';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from '@/hooks/use-toast';
import type { CoachingSession } from '@/types/dashboard';
import { dummyUpcomingCoachSessions, dummyPastCoachSessions } from '@/lib/data/dummy-data';


type SessionStatus = 'Gepland' | 'Voltooid' | 'Geannuleerd' | 'Bezig'; // Renamed from LessonStatus
type ReportRecipient = 'client' | 'parent' | 'both'; // Adjusted for coach context

const getStatusBadgeVariant = (status: SessionStatus): "default" | "secondary" | "destructive" | "outline" => {
  switch (status) {
    case 'Gepland': return 'default';
    case 'Bezig': return 'default';
    case 'Voltooid': return 'secondary';
    case 'Geannuleerd': return 'destructive';
    default: return 'outline';
  }
};
const getStatusBadgeClasses = (status: SessionStatus): string => {
 switch (status) {
    case 'Gepland': return 'bg-blue-100 text-blue-700 border-blue-300';
    case 'Bezig': return 'bg-green-100 text-green-700 border-green-300 animate-pulse';
    case 'Voltooid': return 'bg-gray-100 text-gray-700 border-gray-300';
    case 'Geannuleerd': return 'bg-red-100 text-red-700 border-red-300';
    default: return '';
  }
};


function SessionTable({ sessions, onOpenReportDialog }: { sessions: CoachingSession[], onOpenReportDialog: (session: CoachingSession) => void }) {
  const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').toUpperCase() || 'NN';

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Datum & Tijd</TableHead>
            <TableHead>Cliënt</TableHead>
            <TableHead>Sessie Onderwerp</TableHead>
            <TableHead>Duur</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Acties</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sessions.length === 0 && (
            <TableRow><TableCell colSpan={6} className="h-24 text-center">Geen sessies gevonden.</TableCell></TableRow>
          )}
          {sessions.map((session) => (
            <TableRow key={session.id}>
              <TableCell>
                <FormattedDateCell isoDateString={session.dateTime} dateFormatPattern="E d MMM, HH:mm" />
              </TableCell>
              <TableCell className="font-medium flex items-center gap-2">
                <Avatar className="h-7 w-7">
                  <AvatarImage src={session.clientAvatar} alt={session.clientName} data-ai-hint="client person" />
                  <AvatarFallback>{getInitials(session.clientName)}</AvatarFallback>
                </Avatar>
                {session.clientName}
              </TableCell>
              <TableCell>{session.sessionTopic}</TableCell>
              <TableCell>{session.durationMinutes} min</TableCell>
              <TableCell>
                <Badge variant={getStatusBadgeVariant(session.status)} className={getStatusBadgeClasses(session.status)}>
                  {session.status}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreVertical className="h-4 w-4" /><span className="sr-only">Sessie acties</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {session.status === 'Gepland' && (
                      <DropdownMenuItem disabled={!session.meetingLink}>
                        <Video className="mr-2 h-4 w-4" />Start Sessie (Binnenkort)
                      </DropdownMenuItem>
                    )}
                     <DropdownMenuItem disabled>
                        <FileText className="mr-2 h-4 w-4" />Bekijk Details (Binnenkort)
                     </DropdownMenuItem>
                    {session.status === 'Gepland' && (
                        <DropdownMenuItem className="text-orange-600 focus:text-orange-700 focus:bg-orange-100">
                            <Hourglass className="mr-2 h-4 w-4" />Markeer als Bezig (Demo)
                        </DropdownMenuItem>
                    )}
                    {(session.status === 'Gepland' || session.status === 'Bezig') && (
                        <DropdownMenuItem className="text-green-600 focus:text-green-700 focus:bg-green-100">
                            <CheckCircle className="mr-2 h-4 w-4" />Markeer als Voltooid
                        </DropdownMenuItem>
                    )}
                    {(session.status === 'Voltooid' || session.status === 'Bezig') && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => onOpenReportDialog(session)}>
                          {session.report ? <Edit3 className="mr-2 h-4 w-4" /> : <MessageSquarePlus className="mr-2 h-4 w-4" />}
                          {session.report ? 'Verslag Bekijken/Bewerken' : 'Verslag Schrijven'}
                        </DropdownMenuItem>
                      </>
                    )}
                    {session.status === 'Gepland' && (
                      <DropdownMenuItem className="text-destructive focus:text-destructive">
                        <XCircle className="mr-2 h-4 w-4" />Annuleer Sessie
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


export default function CoachSessionsPage() {
  const { toast } = useToast();
  const [sessions, setSessions] = useState<{upcoming: CoachingSession[], past: CoachingSession[]}>({upcoming: dummyUpcomingCoachSessions, past: dummyPastCoachSessions});
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);
  const [selectedSessionForReport, setSelectedSessionForReport] = useState<CoachingSession | null>(null);
  const [reportText, setReportText] = useState('');
  const [reportRecipient, setReportRecipient] = useState<ReportRecipient>('client');

  const handleOpenReportDialog = (session: CoachingSession) => {
    setSelectedSessionForReport(session);
    setReportText(session.report || '');
    setReportRecipient('client');
    setIsReportDialogOpen(true);
  };

  const handleSaveReport = () => {
    if (selectedSessionForReport) {
      const sessionType = sessions.upcoming.find(s => s.id === selectedSessionForReport.id) ? 'upcoming' : 'past';
      
      setSessions(prev => ({
        ...prev,
        [sessionType]: prev[sessionType].map(s => 
          s.id === selectedSessionForReport.id ? { ...s, report: reportText } : s
        )
      }));

      let recipientText = "onbekend";
      if (reportRecipient === 'client') recipientText = "de cliënt";
      if (reportRecipient === 'parent') recipientText = "de ouder(s)";
      if (reportRecipient === 'both') recipientText = "de cliënt en ouder(s)";

      toast({
        title: "Sessieverslag Opgeslagen",
        description: `Verslag voor sessie "${selectedSessionForReport.sessionTopic}" met ${selectedSessionForReport.clientName} is opgeslagen. Kopie (gesimuleerd) naar ${recipientText}.`,
      });
      console.log("Report to save:", reportText, "For session:", selectedSessionForReport.id, "Send to:", reportRecipient);
      setIsReportDialogOpen(false);
      setSelectedSessionForReport(null);
      setReportText('');
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
          <BookOpen className="h-8 w-8 text-primary" />
          Mijn Geplande Coachingsessies
        </h1>
        <Button variant="outline" asChild>
          <Link href="/dashboard/coach">
            <ArrowLeft className="mr-2 h-4 w-4" /> Terug naar Coach Dashboard
          </Link>
        </Button>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><CalendarDays className="h-6 w-6 text-primary"/>Sessieoverzicht</CardTitle>
          <CardDescription>Beheer hier je aankomende en afgelopen coachingsessies.</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="upcoming">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="upcoming">Aankomend</TabsTrigger>
              <TabsTrigger value="past">Afgelopen</TabsTrigger>
            </TabsList>
            <TabsContent value="upcoming" className="mt-4">
              <SessionTable sessions={sessions.upcoming} onOpenReportDialog={handleOpenReportDialog} />
            </TabsContent>
            <TabsContent value="past" className="mt-4">
              <SessionTable sessions={sessions.past} onOpenReportDialog={handleOpenReportDialog} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Dialog open={isReportDialogOpen} onOpenChange={setIsReportDialogOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>
              Sessieverslag voor {selectedSessionForReport?.sessionTopic} met {selectedSessionForReport?.clientName}
            </DialogTitle>
            <DialogDescription>
              Sessie van <FormattedDateCell isoDateString={selectedSessionForReport?.dateTime || new Date().toISOString()} dateFormatPattern="PPPp" />.
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
                  <RadioGroupItem value="client" id="r-client" />
                  <Label htmlFor="r-client" className="font-normal cursor-pointer">Alleen naar cliënt</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="parent" id="r-parent" />
                  <Label htmlFor="r-parent" className="font-normal cursor-pointer">Alleen naar ouder(s) (indien van toepassing)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="both" id="r-both" />
                  <Label htmlFor="r-both" className="font-normal cursor-pointer">Naar cliënt én ouder(s)</Label>
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
