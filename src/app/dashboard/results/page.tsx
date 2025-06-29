// src/app/dashboard/results/page.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Download, Eye, BarChart3, AlertTriangle, ExternalLink } from '@/lib/icons';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { jsPDF } from 'jspdf';
import { format, parseISO } from 'date-fns';
import { nl } from 'date-fns/locale';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { StorageService } from '@/services/storage';
import type { QuizResult } from '@/types/dashboard';

export default function ResultsHistoryPage() {
  const { toast } = useToast();
  const [completedQuizzes, setCompletedQuizzes] = useState<QuizResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // This now runs only on the client
    const quizzes = StorageService.getCompletedQuizzes();
    setCompletedQuizzes(quizzes);
    setIsLoading(false);
  }, []);

  const handlePdfDownloadClick = (quizId: string) => {
    const quiz = completedQuizzes.find(q => q.id === quizId);
    if (!quiz) {
      toast({
        title: "Rapport niet beschikbaar",
        description: `Kon de gegevens voor de geselecteerde quiz niet vinden.`,
        variant: "destructive",
      });
      return;
    }
    
    // Simplified PDF generation for now, can be expanded
    try {
      const doc = new jsPDF();
      doc.setFontSize(18);
      doc.text(quiz.title, 20, 20);
      doc.setFontSize(12);
      doc.text(`Voltooid op: ${format(parseISO(quiz.dateCompleted), 'PPP', { locale: nl })}`, 20, 30);
      doc.text(`Indicatief Profiel: ${quiz.score}`, 20, 40);
      doc.setFontSize(10);
      doc.text(quiz.reportData.aiAnalysis || quiz.reportData.summary, 20, 50, { maxWidth: 170 });
      const fileName = `${quiz.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_rapport.pdf`;
      doc.save(fileName);
      toast({
        title: "Rapport Gedownload",
        description: `Het rapport voor "${quiz.title}" is gedownload als PDF.`,
      });
    } catch(e) {
      console.error(e);
      toast({ title: "Fout", description: "Kon PDF niet genereren.", variant: "destructive" });
    }
  };

  if (isLoading) {
    return <div className="p-8">Resultaten laden...</div>;
  }

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
                       <Button variant="outline" size="sm" asChild>
                        <Link href={`/dashboard/results`}> 
                          <Eye className="mr-2 h-4 w-4" />
                          Bekijk
                        </Link>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePdfDownloadClick(quiz.id)}
                      >
                        <Download className="mr-2 h-4 w-4" />
                        PDF Rapport
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
       <Alert variant="destructive" className="mt-10 text-base rounded-lg shadow-sm">
          <AlertTriangle className="h-5 w-5" /><AlertTitle className="font-semibold text-[1.125rem]">Belangrijk: Dit is Geen Diagnose</AlertTitle>
          <AlertDescription className="leading-relaxed text-base">Dit overzicht is bedoeld voor zelfreflectie en is nadrukkelijk <strong>geen</strong> formele (medische) diagnose. Heb je vragen of zorgen over je welzijn? Bespreek dit dan met je ouders, een vertrouwenspersoon of je huisarts. MindNavigator is niet aansprakelijk voor beslissingen die op basis van dit overzicht worden genomen. Voor meer info, bezoek onze <Link href="/neurodiversiteit" className="text-primary hover:underline font-semibold">informatiepagina <ExternalLink className="inline h-4 w-4"/> </Link>.</AlertDescription>
      </Alert>
    </div>
  );
}
