// src/app/dashboard/admin/feedback-overview/page.tsx
"use client";

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreVertical, MessageSquareText, CheckCircle, Settings, AlertTriangle, FileText, Loader2, Trash2 } from '@/lib/icons';
import { FormattedDateCell } from '@/components/admin/user-management/FormattedDateCell';
import type { FeedbackEntry, FeedbackType, FeedbackPriority, FeedbackStatus } from '@/types/feedback';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { feedbackService } from '@/services/feedbackService';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

const getFeedbackTypeIcon = (type: FeedbackType) => {
  switch (type) {
    case 'bug': return <AlertTriangle className="h-4 w-4 mr-2 text-destructive" />;
    case 'suggestie': return <FileText className="h-4 w-4 mr-2 text-yellow-500" />;
    case 'algemeen': return <MessageSquareText className="h-4 w-4 mr-2 text-blue-500" />;
    case 'ui_ux': return <Settings className="h-4 w-4 mr-2 text-purple-500" />;
    default: return <MessageSquareText className="h-4 w-4 mr-2" />;
  }
};

const getPriorityBadgeVariant = (priority: FeedbackPriority): "default" | "secondary" | "destructive" | "outline" => {
  if (priority === 'hoog') return 'destructive';
  if (priority === 'normaal') return 'default';
  return 'secondary';
};

const getPriorityBadgeClasses = (priority: FeedbackPriority): string => {
  if (priority === 'hoog') return 'bg-red-100 text-red-700 border-red-300';
  if (priority === 'normaal') return 'bg-orange-100 text-orange-700 border-orange-300';
  return 'bg-gray-100 text-gray-700 border-gray-300';
};

const getStatusBadgeClasses = (status?: FeedbackStatus): string => {
  if (status === 'nieuw') return 'bg-blue-100 text-blue-700 border-blue-300';
  if (status === 'in behandeling') return 'bg-yellow-100 text-yellow-700 border-yellow-300';
  if (status === 'afgehandeld') return 'bg-green-100 text-green-700 border-green-300';
  if (status === 'gesloten') return 'bg-gray-200 text-gray-700 border-gray-400';
  return 'bg-gray-100 text-gray-700 border-gray-300';
};

export default function FeedbackOverviewPage() {
  const [feedbackEntries, setFeedbackEntries] = useState<FeedbackEntry[]>([]);
  const [maxDescriptionLength, setMaxDescriptionLength] = useState(100);
  const [isLoading, setIsLoading] = useState(true);
  const [feedbackToDelete, setFeedbackToDelete] = useState<FeedbackEntry | null>(null);
  const { toast } = useToast();

  const fetchFeedback = useCallback(async () => {
    setIsLoading(true);
    const entries = await feedbackService.getAllFeedback();
    setFeedbackEntries(entries);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchFeedback();
  }, [fetchFeedback]);

  const handleStatusChange = async (feedbackId: string, newStatus: FeedbackStatus) => {
    if (!feedbackId) return;
    try {
      await feedbackService.updateFeedbackStatus(feedbackId, newStatus);
      toast({ title: "Status bijgewerkt", description: "De status van de feedback is aangepast." });
      fetchFeedback();
    } catch (error) {
      toast({ title: "Fout", description: "Kon de status niet bijwerken.", variant: "destructive" });
    }
  };
  
  const handleDeleteClick = (entry: FeedbackEntry) => {
    setFeedbackToDelete(entry);
  };
  
  const confirmDelete = async () => {
    if (feedbackToDelete?.id) {
        try {
            await feedbackService.deleteFeedback(feedbackToDelete.id);
            toast({ title: "Feedback verwijderd" });
            setFeedbackToDelete(null);
            fetchFeedback();
        } catch(error) {
            toast({ title: "Fout bij verwijderen", variant: "destructive" });
        }
    }
  };

  return (
    <>
      <div className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold flex items-center gap-2">
              <MessageSquareText className="h-6 w-6 text-primary" />
              Feedback Overzicht
            </CardTitle>
            <CardDescription>
              Bekijk en beheer hier de feedback die is ingediend door gebruikers.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[150px]">Datum & Tijd</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead className="min-w-[180px]">Pagina/Feature</TableHead>
                    <TableHead>Prioriteit</TableHead>
                    <TableHead className="min-w-[300px]">Beschrijving</TableHead>
                    <TableHead>Ingediend door</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right w-[80px]">Acties</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow><TableCell colSpan={8} className="h-24 text-center"><Loader2 className="h-6 w-6 animate-spin mx-auto text-primary" /></TableCell></TableRow>
                  ) : feedbackEntries.length === 0 ? (
                    <TableRow><TableCell colSpan={8} className="h-24 text-center">Nog geen feedback ontvangen.</TableCell></TableRow>
                  ) : (
                    feedbackEntries.map((entry) => (
                      <TableRow key={entry.id}>
                        <TableCell><FormattedDateCell isoDateString={entry.timestamp} dateFormatPattern="Pp" /></TableCell>
                        <TableCell className="capitalize flex items-center">{getFeedbackTypeIcon(entry.feedbackType)}{entry.feedbackType.replace(/_/g, ' ')}</TableCell>
                        <TableCell>{entry.pageOrFeature === 'anders' ? `Anders: ${entry.otherPageOrFeature || 'N/A'}` : entry.pageOrFeature.replace(/_/g, ' ')}</TableCell>
                        <TableCell><Badge variant={getPriorityBadgeVariant(entry.priority)} className={cn("capitalize", getPriorityBadgeClasses(entry.priority))}>{entry.priority}</Badge></TableCell>
                        <TableCell className="text-xs max-w-md">{entry.description.length > maxDescriptionLength ? (<>{entry.description.substring(0, maxDescriptionLength)}...<Button variant="link" size="sm" className="p-0 h-auto ml-1 text-xs" onClick={() => alert(entry.description)}>Lees meer</Button></>) : entry.description}</TableCell>
                        <TableCell>{entry.name || '-'}<br/><span className="text-xs text-muted-foreground">{entry.email || '-'}</span></TableCell>
                        <TableCell><Badge variant="outline" className={cn("capitalize", getStatusBadgeClasses(entry.status))}>{entry.status ? entry.status.replace(/_/g, ' ') : 'Nieuw'}</Badge></TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="h-8 w-8"><MoreVertical className="h-4 w-4" /><span className="sr-only">Acties voor feedback {entry.id}</span></Button></DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleStatusChange(entry.id!, 'nieuw')}>Markeer als Nieuw</DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleStatusChange(entry.id!, 'in behandeling')}>Markeer als In Behandeling</DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleStatusChange(entry.id!, 'afgehandeld')}>Markeer als Afgehandeld</DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleStatusChange(entry.id!, 'gesloten')}>Markeer als Gesloten</DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleDeleteClick(entry)} className="text-destructive focus:text-destructive"><Trash2 className="mr-2 h-4 w-4"/>Verwijderen</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

       <AlertDialog open={!!feedbackToDelete} onOpenChange={(open) => !open && setFeedbackToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Weet u het zeker?</AlertDialogTitle>
            <AlertDialogDescription>
              Deze actie kan niet ongedaan worden gemaakt. Dit zal de feedback permanent verwijderen.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuleren</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive hover:bg-destructive/90">
              Ja, verwijder
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
