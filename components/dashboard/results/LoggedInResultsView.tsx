// src/components/dashboard/results/LoggedInResultsView.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Download, Eye, BarChart3, AlertTriangle, ExternalLink, Brain } from '@/lib/icons';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { format, parseISO } from 'date-fns';
import { nl } from 'date-fns/locale';
import { Alert, AlertDescription, AlertTitle as AlertTitleUi } from "@/components/ui/alert";
import type { QuizResult, User } from '@/types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import DOMPurify from 'isomorphic-dompurify';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ResultsChart } from '@/components/quiz/results-chart';
import { SingleScoreChart } from '@/components/dashboard/results/SingleScoreChart';
import { getDisplayCategory } from '@/lib/quiz-data/teen-neurodiversity-quiz';
import { RecommendedToolsSection } from '@/components/dashboard/results/RecommendedToolsSection';

export function LoggedInResultsView({ completedQuizzes, user }: { completedQuizzes: QuizResult[], user: User | null }) {
  const { toast } = useToast();
  const [selectedResult, setSelectedResult] = useState<QuizResult | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const newResult = searchParams?.get('newResult');
    if (newResult === 'true') {
      toast({
        title: "Resultaat Opgeslagen!",
        description: "Je quizresultaat is opgeslagen in je dashboard en is hier altijd terug te vinden.",
        duration: 7000,
      });
      // Clean up the URL
      router.replace('/dashboard/results', { scroll: false });
    }
  }, [searchParams, router, toast]);

  const handlePdfDownloadClick = () => {
    window.print();
    toast({
        title: "Rapport Printen",
        description: `Gebruik de print-functie van uw browser om het rapport op te slaan als PDF.`,
      });
  };

  const handleViewReport = (quiz: QuizResult) => {
    setSelectedResult(quiz);
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
  
  // The core logic fix: determine if the full report should be shown.
  // Admins always see everything. Other users must be verified.
  const showFullReport = user?.role === 'admin' || user?.status === 'actief';

  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-3xl font-bold text-foreground">Resultatenoverzicht</h1>
        <p className="text-muted-foreground">
          Bekijk hier de resultaten van al je voltooide zelfreflectie-quizzen en download je rapporten.
        </p>
      </section>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
             <BarChart3 className="h-6 w-6 text-primary" />
            Voltooide Zelfreflectie-Quizzen
          </CardTitle>
          <CardDescription>
            Een overzicht van al je afgeronde quizzen en bijbehorende rapporten.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {completedQuizzes.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Titel Quiz</TableHead>
                  <TableHead>Datum Voltooid</TableHead>
                  <TableHead>Indicatief Profiel</TableHead>
                  <TableHead className="text-right">Acties</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {completedQuizzes.map((quiz) => (
                  <TableRow key={quiz.id}>
                    <TableCell className="font-medium">{quiz.title}</TableCell>
                    <TableCell>{format(parseISO(quiz.dateCompleted), 'dd-MM-yyyy')}</TableCell>
                    <TableCell>{quiz.score}</TableCell>
                    <TableCell className="text-right space-x-2">
                       <Button variant="outline" size="sm" onClick={() => handleViewReport(quiz)}>
                          <Eye className="mr-2 h-4 w-4" />
                          Bekijk Rapport
                       </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-muted-foreground text-center py-10">
              Je hebt nog geen quizzen voltooid. Ga naar het <Link href="/dashboard/leerling/quizzes" className="text-primary hover:underline">overzicht</Link> om te starten.
            </p>
          )}
        </CardContent>
      </Card>
      
      <Dialog open={!!selectedResult} onOpenChange={(isOpen) => !isOpen && setSelectedResult(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] flex flex-col p-0">
          <DialogHeader className="p-6 pb-2 print-hide">
            <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                    <Brain className="h-8 w-8 text-primary shrink-0" />
                    <div>
                        <DialogTitle className="text-2xl">{selectedResult?.title}</DialogTitle>
                        <DialogDescription>
                          Rapport voltooid op {selectedResult ? format(parseISO(selectedResult.dateCompleted), 'PPP', { locale: nl }) : ''}
                        </DialogDescription>
                    </div>
                </div>
                <Button variant="ghost" size="icon" onClick={handlePdfDownloadClick}>
                    <Download className="h-5 w-5" />
                    <span className="sr-only">Print of download</span>
                </Button>
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
              
              {showFullReport ? (
                <>
                  <div className="p-4 sm:p-6 rounded-lg border bg-muted/40 print-report-content">
                      <div
                          className="prose prose-sm dark:prose-invert max-w-none"
                          dangerouslySetInnerHTML={{ __html: sanitizedAnalysis }}
                      />
                  </div>
                  {selectedResult?.reportData.settings?.showRecommendedTools && scoresForChart && (
                      <RecommendedToolsSection scores={scoresForChart} />
                  )}
                </>
              ) : (
                <Card className="mt-6 text-center bg-amber-50 border-amber-300">
                  <CardHeader>
                    <CardTitle className="text-amber-800">Volledig Rapport Ontgrendelen</CardTitle>
                    <CardDescription className="text-amber-700">Om de volledige analyse en aanbevolen tools te zien, dient u uw e-mailadres te verifiëren.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">We hebben een verificatielink gestuurd naar <strong>{user?.email}</strong>. Klik op de link in de e-mail om uw account te activeren.</p>
                    <Button className="mt-4" variant="outline" disabled>Verificatie-e-mail opnieuw verzenden (binnenkort)</Button>
                  </CardContent>
                </Card>
              )}

              <Alert variant="destructive" className="mt-8 text-base rounded-lg shadow-sm print-hide">
                  <AlertTriangle className="h-5 w-5" /><AlertTitleUi className="font-semibold text-[1.125rem]">Belangrijk: Dit is Geen Diagnose</AlertTitleUi>
                  <AlertDescription className="leading-relaxed text-base">Dit overzicht is bedoeld voor zelfreflectie en is nadrukkelijk <strong>geen</strong> formele (medische) diagnose. Heb je vragen of zorgen over je welzijn? Bespreek dit dan met je ouders, een vertrouwenspersoon of je huisarts.</AlertDescription>
              </Alert>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
}
