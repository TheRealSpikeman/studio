// src/app/dashboard/results/page.tsx
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Download, Eye, BarChart3 } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { jsPDF } from 'jspdf';
import { neurotypeDescriptionsTeen, thresholdsTeen } from '@/lib/quiz-data/teen-neurodiversity-quiz';
import type { NeurotypeDescription } from '@/lib/quiz-data/teen-neurodiversity-quiz';

// Dummy data for demonstration
const completedQuizzes = [
  { 
    id: 'neuroprofile-101', 
    title: 'Basis Neuroprofiel Quiz', 
    dateCompleted: '2024-03-10', 
    score: 'Uitgebalanceerd Profiel', 
    reportData: { 
      summary: "Dit is een voorlopige samenvatting voor het Basis Neuroprofiel. U vertoont een evenwichtige mix van eigenschappen, wat wijst op een flexibele aanpassing aan verschillende situaties. Uw sterke punten liggen mogelijk in het combineren van analytisch denken met creatieve oplossingen.",
      answers: [
        {question: "Hoe voel je je meestal in sociale situaties?", answer: "Afhankelijk van de situatie"}, 
        {question: "Als je een nieuwe taak krijgt, hoe pak je die meestal aan?", answer: "Ik zoek een balans tussen plannen en doen"},
        {question: "Hoe ga je om met onverwachte veranderingen in je routine?", answer: "Het hangt af van de soort verandering"}
      ],
      tips: [
        "Blijf uw flexibiliteit benutten door open te staan voor nieuwe ervaringen.",
        "Reflecteer regelmatig op welke aanpak het beste werkt in verschillende contexten.",
        "Zoek naar mogelijkheden om zowel uw analytische als creatieve kanten te ontwikkelen."
      ]
    } 
  },
  { 
    id: 'autism-spectrum-202', 
    title: 'Autisme Spectrum Verkenning', 
    dateCompleted: '2024-03-25', 
    score: 'Sterke Kenmerken',
    reportData: { 
      summary: "Uw antwoorden wijzen op sterke kenmerken die vaak geassocieerd worden met het autismespectrum. Dit kan een voorkeur voor routine, een diepgaande focus op interesses en een unieke manier van sociale interactie inhouden.",
      answers: [
        {question: "Hoe belangrijk is een vaste routine voor u?", answer: "Zeer belangrijk"}, 
        {question: "Hoe ervaart u onverwachte sociale interacties?", answer: "Soms uitdagend"},
        {question: "Kunt u zich langdurig concentreren op een specifiek onderwerp?", answer: "Ja, zeer goed"}
      ],
      tips: [
        "Creëer duidelijke structuren en routines in uw dagelijks leven.",
        "Communiceer uw behoeften en grenzen helder aan anderen.",
        "Zoek omgevingen en activiteiten die aansluiten bij uw interesses en sterke punten."
      ]
    } 
  },
  { 
    id: 'teen-neurodiversity-quiz', 
    title: 'Neurodiversiteit Quiz (12-18 jaar)', 
    dateCompleted: '2024-04-05', 
    score: 'Profiel: ADD & HSP', // Example: this score indicates ADD and HSP profiles were identified
    reportData: { 
      summary: "Je antwoorden laten zien dat je eigenschappen herkent die passen bij ADD (aandacht en concentratie) en HSP (hoogsensitiviteit). Dit is een unieke combinatie die zowel sterke punten als uitdagingen met zich meebrengt.",
      answers: [
        {question: "Ik merk dat mijn gedachten afdwalen, zelfs als ik probeer te focussen op schoolwerk.", answer: "Vaak (3)"},
        {question: "Kleine afleidingen zoals tikkende pennen verstoren mijn concentratie.", answer: "Altijd (4)"},
        {question: "Na een lange schooldag heb ik echt tijd nodig om bij te komen.", answer: "Vaak (3)"},
        {question: "Ik merk geuren, geluiden of aanrakingen sterker op dan mijn vrienden.", answer: "Altijd (4)"}
      ]
      // Tips for teen quiz will be dynamically pulled from neurotypeDescriptionsTeen
    } 
  },
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

    try {
      const doc = new jsPDF();
      const pageHeight = doc.internal.pageSize.height;
      const margins = { top: 20, bottom: 20, left: 15, right: 15 };
      const usableWidth = doc.internal.pageSize.width - margins.left - margins.right;
      let y = margins.top;

      const addText = (text: string, x: number, currentY: number, options: any = {}) => {
        const lines = doc.splitTextToSize(text, options.maxWidth || usableWidth);
        lines.forEach((line: string) => {
          if (currentY + (options.lineHeight || 7) > pageHeight - margins.bottom) {
            doc.addPage();
            currentY = margins.top;
          }
          doc.text(line, x, currentY);
          currentY += (options.lineHeight || 7);
        });
        return currentY;
      };
      
      const addSectionTitle = (title: string, currentY: number) => {
        if (currentY + 15 > pageHeight - margins.bottom) { // Check for space before adding title
            doc.addPage();
            currentY = margins.top;
        }
        doc.setFontSize(14);
        doc.setFont(undefined, 'bold');
        currentY = addText(title, margins.left, currentY, { lineHeight: 8 });
        doc.setFont(undefined, 'normal');
        doc.setFontSize(10);
        return currentY + 2; // Add a bit of space after section title
      };


      // --- Document Header ---
      doc.setFontSize(18);
      doc.setFont(undefined, 'bold');
      y = addText(`Rapport: ${quiz.title}`, margins.left, y, { lineHeight: 10 });
      doc.setFont(undefined, 'normal');
      doc.setFontSize(10);
      y = addText(`Datum voltooid: ${quiz.dateCompleted}`, margins.left, y);
      y = addText(`Score/Profiel: ${quiz.score}`, margins.left, y);
      y += 7; // Extra space

      // --- Samenvatting ---
      y = addSectionTitle("Samenvatting", y);
      y = addText(quiz.reportData.summary, margins.left, y, { lineHeight: 6 });
      y += 7;

      // --- Vragen en Antwoorden ---
      if (quiz.reportData.answers && quiz.reportData.answers.length > 0) {
        y = addSectionTitle("Vragen en Antwoorden", y);
        quiz.reportData.answers.forEach((ans, index) => {
          doc.setFont(undefined, 'bold');
          y = addText(`Vraag ${index + 1}: ${ans.question}`, margins.left, y, { lineHeight: 6 });
          doc.setFont(undefined, 'normal');
          y = addText(`Antwoord: ${ans.answer}`, margins.left + 5, y, { lineHeight: 6 });
          y += 3; // Space between Q&A pairs
        });
      }
      y += 7;

      // --- Tips ---
      y = addSectionTitle("Tips en Strategieën", y);
      if (quiz.id === 'teen-neurodiversity-quiz') {
        const identifiedProfiles: string[] = [];
        // Extract profiles from score string e.g. "Profiel: ADD & HSP"
        const profileMatch = quiz.score.match(/Profiel: (.*)/);
        if (profileMatch && profileMatch[1]) {
          profileMatch[1].split(' & ').forEach(p => {
            const profileKey = Object.keys(neurotypeDescriptionsTeen).find(
              key => neurotypeDescriptionsTeen[key].title.toLowerCase().includes(p.trim().toLowerCase()) || key.toLowerCase() === p.trim().toLowerCase()
            );
            if (profileKey) identifiedProfiles.push(profileKey);
          });
        }
        
        if (identifiedProfiles.length > 0) {
          identifiedProfiles.forEach(profileKey => {
            const profileData = neurotypeDescriptionsTeen[profileKey];
            if (profileData) {
              doc.setFontSize(12);
              doc.setFont(undefined, 'bold');
              y = addText(profileData.title, margins.left, y, { lineHeight: 7 });
              doc.setFontSize(10);
              doc.setFont(undefined, 'normal');
              
              const tipCategories = profileData.tips;
              y = addText(`School/Studie: ${tipCategories.school}`, margins.left + 5, y, { lineHeight: 6 });
              y = addText(`Thuis: ${tipCategories.thuis}`, margins.left + 5, y, { lineHeight: 6 });
              y = addText(`Sociaal: ${tipCategories.sociaal}`, margins.left + 5, y, { lineHeight: 6 });
              y = addText(`Werk/Stage: ${tipCategories.werk}`, margins.left + 5, y, { lineHeight: 6 });
              y += 5;
            }
          });
        } else {
          y = addText("Geen specifieke tips gevonden voor dit profiel. Overweeg algemene strategieën voor zelfreflectie en welzijn.", margins.left, y);
        }
      } else if (quiz.reportData.tips && quiz.reportData.tips.length > 0) {
        quiz.reportData.tips.forEach(tip => {
          y = addText(`- ${tip}`, margins.left, y, { lineHeight: 6 });
        });
      } else {
        y = addText("Neem contact op met een professional voor gepersonaliseerde tips en strategieën.", margins.left, y, { lineHeight: 6 });
      }
      y += 7;
      

      // --- Disclaimer ---
      y = addSectionTitle("Disclaimer", y);
      doc.setFontSize(8);
      const disclaimerText = "Dit rapport is gebaseerd op de antwoorden die zijn gegeven in de quiz en dient ter indicatie en zelfreflectie. Het is geen vervanging voor een professionele diagnose of medisch advies. Raadpleeg een gekwalificeerde zorgverlener of psycholoog voor een formele diagnose, persoonlijk advies of behandeling. NeuroDiversity Navigator is niet aansprakelijk voor beslissingen genomen op basis van dit rapport.";
      y = addText(disclaimerText, margins.left, y, { lineHeight: 5 });


      const fileName = `${quiz.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_rapport.pdf`;
      doc.save(fileName);

      toast({
        title: "Rapport Gedownload (als PDF)",
        description: `Het rapport voor "${quizTitle}" is gedownload als PDF.`,
      });

    } catch (error) {
      console.error("PDF Downloadfout:", error);
      toast({
        title: "PDF Download Mislukt",
        description: "Er is een fout opgetreden bij het genereren van het PDF rapport.",
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
