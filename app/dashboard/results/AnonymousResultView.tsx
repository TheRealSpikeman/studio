// src/components/dashboard/results/AnonymousResultView.tsx
"use client";

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Brain, ArrowLeft, Lock } from '@/lib/icons';
import { useToast } from '@/hooks/use-toast';
import type { QuizResult } from '@/types/dashboard';
import DOMPurify from 'isomorphic-dompurify';
import { format, parseISO } from 'date-fns';
import { nl } from 'date-fns/locale';
import { ResultsChart } from '@/components/quiz/results-chart';
import { SingleScoreChart } from '@/components/dashboard/results/SingleScoreChart';
import { getDisplayCategory } from '@/lib/quiz-data/teen-neurodiversity-quiz';
import { RecommendedToolsSection } from '@/components/dashboard/results/RecommendedToolsSection';
import { ClaimReportForm } from '@/components/dashboard/results/ClaimReportForm';

export function AnonymousResultView({ 
  result, 
  onClose,
  isAnonymous = false 
}: { 
  result: QuizResult; 
  onClose?: () => void;
  isAnonymous?: boolean;
}) {
  const { toast } = useToast();

  const handlePdfDownloadClick = () => {
    if (isAnonymous) {
      toast({
        title: "Printen is Geblokkeerd",
        description: "Maak een gratis account aan om dit rapport op te slaan en te printen.",
        variant: "destructive",
      });
    } else {
      window.print();
    }
  };

  const sanitizedAnalysis = DOMPurify.sanitize(result.reportData.aiAnalysis || 'Geen gedetailleerde analyse beschikbaar.');
  const scoresForChart = result?.reportData?.scores;
  const scoreKeys = scoresForChart ? Object.keys(scoresForChart) : [];
  
  const shouldShowRadarChart = 
    result?.reportData?.settings?.showChart !== false &&
    scoresForChart && 
    scoreKeys.length >= 3;

  const shouldShowSingleScoreChart = 
    result?.reportData?.settings?.showChart !== false &&
    scoresForChart && 
    scoreKeys.length > 0 && scoreKeys.length < 3;
    
  const displayScoreLabel = scoreKeys.length > 0 ? getDisplayCategory(scoreKeys[0], result.title) : '';
  
  const reportContent = (
    <>
      {shouldShowRadarChart && (
        <ResultsChart scores={scoresForChart!} />
      )}
      {shouldShowSingleScoreChart && (
          <SingleScoreChart
              score={scoresForChart![scoreKeys[0]]}
              maxScore={4}
              scoreLabel={displayScoreLabel}
              audience={result.audience}
          />
      )}
      <div className="p-4 sm:p-6 rounded-lg border bg-muted/40">
          <div
              className="prose prose-sm dark:prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: sanitizedAnalysis }}
          />
      </div>
       {result.reportData.settings?.showRecommendedTools && scoresForChart && (
          <RecommendedToolsSection scores={scoresForChart} />
      )}
    </>
  );

  return (
    <div className="min-h-screen bg-muted/30 flex items-center justify-center p-4 py-12">
      <div className="relative w-full max-w-3xl">
        <Card className="shadow-xl">
          <CardHeader className="print-hide">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <Brain className="h-8 w-8 text-primary shrink-0" />
                <div>
                  <CardTitle className="text-2xl">{result.title}</CardTitle>
                  <CardDescription>
                    Rapport voltooid op {format(parseISO(result.dateCompleted), 'PPP', { locale: nl })}
                  </CardDescription>
                </div>
              </div>
              <Button variant="outline" size="icon" onClick={handlePdfDownloadClick}>
                {isAnonymous ? <Lock className="h-5 w-5" /> : <Download className="h-5 w-5" />}
                <span className="sr-only">Print of download</span>
              </Button>
            </div>
          </CardHeader>
          
          <CardContent className="px-6 py-4 space-y-8">
            {isAnonymous ? (
              <div className="print-protected">{reportContent}</div>
            ) : (
              <div className="print-report-content">{reportContent}</div>
            )}
            
            {isAnonymous && (
              <div className="print-hide">
                <ClaimReportForm result={result} />
              </div>
            )}
          </CardContent>
          
          {onClose && (
            <CardFooter className="print-hide flex justify-center pt-6">
              <Button variant="outline" onClick={onClose}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Sluit Rapport en Ga Terug
              </Button>
            </CardFooter>
          )}
        </Card>
      </div>
    </div>
  );
}
