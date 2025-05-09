// src/app/dashboard/results/page.tsx
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Download, Eye, BarChart3 } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { jsPDF } from 'jspdf';

// Dummy data for demonstration
const completedQuizzes = [
  { 
    id: 'neuroprofile-101', 
    title: 'Basis Neuroprofiel Quiz', 
    dateCompleted: '2024-03-10', 
    score: 'Uitgebalanceerd Profiel', 
    // Actual quiz data/answers would be needed here for a real report
    reportData: { 
      summary: "Dit is een voorlopige samenvatting voor het Basis Neuroprofiel.",
      answers: [{question: "Vraag 1", answer: "Antwoord A"}, {question: "Vraag 2", answer: "Antwoord B"}] 
    } 
  },
  { 
    id: 'autism-spectrum-202', 
    title: 'Autisme Spectrum Verkenning', 
    dateCompleted: '2024-03-25', 
    score: 'Sterke Kenmerken',
    reportData: { 
      summary: "Rapport voor Autisme Spectrum Verkenning.",
      answers: [{question: "Sociale interactie", answer: "Soms uitdagend"}, {question: "Routine", answer: "Zeer belangrijk"}] 
    } 
  },
  { 
    id: 'teen-neurodiversity-quiz', 
    title: 'Neurodiversiteit Quiz (12-18 jaar)', 
    dateCompleted: '2024-04-05', 
    score: 'Profiel: ADD & HSP',
    reportData: { 
      summary: "Resultaten voor de Tiener Neurodiversiteit Quiz.",
      answers: [
        {question: "Focus op schoolwerk", answer: "Soms"},
        {question: "Overweldigd door drukte", answer: "Vaak"}
      ] 
    } 
  },
  // Add more completed quizzes
];

export default function ResultsHistoryPage() {
  const { toast } = useToast();

  const handlePdfDownloadClick = (quizId: string, quizTitle: string) => {
    const quiz = completedQuizzes.find(q => q.id === quizId);
    if (!quiz || !quiz.reportData) {
      toast({
        title: "Rapport niet beschikbaar",
        description: `Kon de gegevens voor "${quizTitle}" niet vinden.`,
        variant: "destructive",
      });
      return;
    }

    // Simulate PDF content generation
    let reportContent = `Rapport voor: ${quiz.title}\n`;
    reportContent += `Datum voltooid: ${quiz.dateCompleted}\n`;
    reportContent += `Score/Profiel: ${quiz.score}\n\n`;
    reportContent += `Samenvatting:\n${quiz.reportData.summary}\n\n`;
    reportContent += `Antwoorden (voorbeeld):\n`;
    quiz.reportData.answers.forEach(ans => {
      reportContent += `- ${ans.question}: ${ans.answer}\n`;
    });
    reportContent += `\n\n--- Einde van het rapport ---`;
    reportContent += `\n\nDisclaimer: Dit is een gesimuleerd rapport. Voor een formele diagnose of professioneel advies, raadpleeg een zorgverlener of psycholoog.`;


    try {
      const doc = new jsPDF();
      const pageHeight = doc.internal.pageSize.height;
      const margins = { top: 20, bottom: 20, left: 15, right: 15 };
      const usableWidth = doc.internal.pageSize.width - margins.left - margins.right;
      
      let y = margins.top;
      const lineHeight = 7; // approximate line height in mm

      doc.setFontSize(16);
      doc.text(`Rapport voor: ${quiz.title}`, margins.left, y);
      y += lineHeight * 1.5;
      
      doc.setFontSize(12);
      doc.text(`Datum voltooid: ${quiz.dateCompleted}`, margins.left, y);
      y += lineHeight;
      doc.text(`Score/Profiel: ${quiz.score}`, margins.left, y);
      y += lineHeight * 2;

      doc.setFontSize(14);
      doc.text(`Samenvatting:`, margins.left, y);
      y += lineHeight;
      doc.setFontSize(10);
      const summaryLines = doc.splitTextToSize(quiz.reportData.summary, usableWidth);
      summaryLines.forEach((line: string) => {
        if (y + lineHeight > pageHeight - margins.bottom) {
          doc.addPage();
          y = margins.top;
        }
        doc.text(line, margins.left, y);
        y += lineHeight;
      });
      y += lineHeight;


      doc.setFontSize(14);
      doc.text(`Antwoorden (voorbeeld):`, margins.left, y);
      y += lineHeight;
      doc.setFontSize(10);
      quiz.reportData.answers.forEach(ans => {
         const answerLine = `- ${ans.question}: ${ans.answer}`;
         const wrappedLines = doc.splitTextToSize(answerLine, usableWidth);
         wrappedLines.forEach((line: string) => {
            if (y + lineHeight > pageHeight - margins.bottom) {
                doc.addPage();
                y = margins.top;
            }
            doc.text(line, margins.left, y);
            y += lineHeight;
        });
      });
      y += lineHeight * 2;

      doc.setFontSize(10);
      doc.text(`--- Einde van het rapport ---`, margins.left, y);
      y += lineHeight * 2;
      
      doc.setFontSize(8);
      const disclaimerLines = doc.splitTextToSize(
        `Disclaimer: Dit is een gesimuleerd rapport. Voor een formele diagnose of professioneel advies, raadpleeg een zorgverlener of psycholoog.`, 
        usableWidth
      );
       disclaimerLines.forEach((line: string) => {
        if (y + lineHeight > pageHeight - margins.bottom) {
            doc.addPage();
            y = margins.top;
        }
        doc.text(line, margins.left, y);
        y += lineHeight * 0.8; // Smaller line height for disclaimer
      });


      // Sanitize title for filename
      const fileName = `${quiz.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_rapport.pdf`;
      doc.save(fileName);

      toast({
        title: "Rapport Gedownload (als PDF)",
        description: `Het rapport voor "${quizTitle}" is gedownload als een PDF-bestand.`,
        variant: "default",
      });

    } catch (error) {
      console.error("PDF Downloadfout:", error);
      toast({
        title: "PDF Download Mislukt",
        description: "Er is een fout opgetreden bij het downloaden van het PDF rapport.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-3xl font-bold text-foreground">Resultatenoverzicht</h1>
        <p className="text-muted-foreground">
          Bekijk hier de resultaten van al je voltooide quizzen en download je rapporten.
        </p>
      </section>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
             <BarChart3 className="h-6 w-6 text-primary" />
            Voltooide Quizzen
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
                  <TableHead>Quiz Titel</TableHead>
                  <TableHead>Datum Voltooid</TableHead>
                  <TableHead>Score/Profiel</TableHead>
                  <TableHead className="text-right">Acties</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {completedQuizzes.map((quiz) => (
                  <TableRow key={quiz.id}>
                    <TableCell className="font-medium">{quiz.title}</TableCell>
                    <TableCell>{quiz.dateCompleted}</TableCell>
                    <TableCell>{quiz.score}</TableCell>
                    <TableCell className="text-right space-x-2">
                       <Button variant="outline" size="sm" asChild>
                        {/* Link to in-app results page, ensuring teen quiz links correctly */}
                        <Link href={quiz.id === 'teen-neurodiversity-quiz' ? `/quiz/teen-neurodiversity-quiz` : `/quiz/${quiz.id}/results`}> 
                          <Eye className="mr-2 h-4 w-4" />
                          Bekijk
                        </Link>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePdfDownloadClick(quiz.id, quiz.title)}
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
              Je hebt nog geen quizzen voltooid. Ga naar het <Link href="/quizzes" className="text-primary hover:underline">quizoverzicht</Link> om te starten.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
