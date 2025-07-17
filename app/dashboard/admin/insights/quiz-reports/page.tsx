// src/app/dashboard/admin/insights/quiz-reports/page.tsx
"use client";

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Eye, Trash2, MoreVertical, FileBarChart, Loader2, Download, Brain, AlertTriangle } from '@/lib/icons';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useToast } from '@/hooks/use-toast';
import { storageService } from '@/services/storageService';
import type { QuizResult } from '@/types/dashboard';
import { format, parseISO } from 'date-fns';
import { nl } from 'date-fns/locale';

// NEW IMPORTS
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import DOMPurify from 'isomorphic-dompurify';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ResultsChart } from '@/components/quiz/results-chart';
import { SingleScoreChart } from '@/components/dashboard/results/SingleScoreChart';
import { RecommendedToolsSection } from '@/components/dashboard/results/RecommendedToolsSection';
import { getDisplayCategory } from '@/lib/quiz-data/teen-neurodiversity-quiz';

export default function AdminQuizReportsPage() {
  const { toast } = useToast();
  const [allResults, setAllResults] = useState<QuizResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [resultToDelete, setResultToDelete] = useState<QuizResult | null>(null);
  const [selectedResult, setSelectedResult] = useState<QuizResult | null>(null);

  const fetchResults = useCallback(async () => {
    setIsLoading(true);
    const results = await storageService.getAllCompletedQuizzes();
    setAllResults(results);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchResults();
  }, [fetchResults]);

  const handleDeleteClick = (result: QuizResult) => {
    setResultToDelete(result);
  };

  const handleViewReport = (result: QuizResult) => {
    setSelectedResult(result);
  };

  const confirmDelete = async () => {
    if (resultToDelete && resultToDelete.id) {
      await storageService.deleteCompletedQuiz(resultToDelete.id);
      toast({
        title: "Rapport Verwijderd",
        description: `Het rapport voor "${resultToDelete.title}" is verwijderd.`
      });
      setResultToDelete(null);
      fetchResults(); // Refresh the list
    }
  };

  const sanitizedAnalysis = DOMPurify.sanitize(selectedResult?.reportData.aiAnalysis || 'Geen gedetailleerde analyse beschikbaar.');
  const scoresForChart = selectedResult?.reportData?.scores;
  const scoreKeys = scoresForChart ? Object.keys(scoresForChart) : [];
  
  const shouldShowRadarChart = 
    selectedResult?.reportData?.settings?.showChart !== false &&
    scoresForChart && 
    scoreKeys.length >= 3;

  const shouldShowSingleScoreChart = 
    selectedResult?.reportData?.settings?.showChart !== false &&
    scoresForChart && 
    scoreKeys.length > 0 && scoreKeys.length < 3;
    
  const displayScoreLabel = scoreKeys.length > 0 && selectedResult ? getDisplayCategory(scoreKeys[0], selectedResult.title) : '';

  return (
    <>
      <div className="space-y-8">
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <CardTitle className="text-2xl font-bold flex items-center gap-2">
                  <FileBarChart className="h-6 w-6 text-primary" />
                  Quiz Rapporten Overzicht
                </CardTitle>
                <CardDescription>
                  Bekijk en beheer alle voltooide quizrapporten van alle gebruikers.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Quiz Titel</TableHead>
                    <TableHead>Gebruiker</TableHead>
                    <TableHead>Datum</TableHead>
                    <TableHead>Score/Profiel</TableHead>
                    <TableHead className="text-right">Acties</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {allResults.length === 0 ? (
                    <TableRow><TableCell colSpan={5} className="h-24 text-center">Geen resultaten gevonden.</TableCell></TableRow>
                  ) : (
                    allResults.map(result => (
                      <TableRow key={result.id}>
                        <TableCell className="font-medium">{result.title}</TableCell>
                        <TableCell>{result.userName || 'Anoniem'}</TableCell>
                        <TableCell>{result.dateCompleted ? format(parseISO(result.dateCompleted), 'dd-MM-yyyy', { locale: nl }) : '-'}</TableCell>
                        <TableCell>{result.score}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreVertical className="h-4 w-4" /><span className="sr-only">Acties</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onSelect={() => handleViewReport(result)}>
                                <Eye className="mr-2 h-4 w-4" /> Bekijk Rapport
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleDeleteClick(result)} className="text-destructive focus:text-destructive">
                                <Trash2 className="mr-2 h-4 w-4" /> Verwijderen
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      <AlertDialog open={!!resultToDelete} onOpenChange={(open) => !open && setResultToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Weet je het zeker?</AlertDialogTitle>
            <AlertDialogDescription>
              Deze actie kan niet ongedaan worden gemaakt. Dit zal het quizrapport permanent verwijderen.
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

      <Dialog open={!!selectedResult} onOpenChange={(isOpen) => !isOpen && setSelectedResult(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] flex flex-col p-0">
          <DialogHeader className="p-6 pb-2 print-hide">
            <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                    <Brain className="h-8 w-8 text-primary shrink-0" />
                    <div>
                        <DialogTitle className="text-2xl">{selectedResult?.title}</DialogTitle>
                        <DialogDescription>
                          Rapport voor {selectedResult?.userName || 'anonieme gebruiker'}, voltooid op {selectedResult ? format(parseISO(selectedResult.dateCompleted), 'PPP', { locale: nl }) : ''}
                        </DialogDescription>
                    </div>
                </div>
            </div>
          </DialogHeader>
          <ScrollArea className="flex-1 min-h-0">
            <div className="px-6 py-4 space-y-8">
              {shouldShowRadarChart && (
                  <ResultsChart scores={scoresForChart!} />
              )}
               {shouldShowSingleScoreChart && (
                  <SingleScoreChart
                      score={scoresForChart![scoreKeys[0]]}
                      maxScore={4}
                      scoreLabel={displayScoreLabel}
                      audience={selectedResult?.audience}
                  />
              )}
              <div className="p-4 sm:p-6 rounded-lg border bg-muted/40 print-report-content">
                  <div
                      className="prose prose-sm dark:prose-invert max-w-none"
                      dangerouslySetInnerHTML={{ __html: sanitizedAnalysis }}
                  />
              </div>
              {selectedResult?.reportData.settings?.showRecommendedTools && scoresForChart && (
                  <RecommendedToolsSection scores={scoresForChart} />
              )}
            </div>
          </ScrollArea>
           <DialogFooter className="p-4 border-t">
              <DialogClose asChild>
                <Button variant="outline">Sluiten</Button>
              </DialogClose>
            </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
