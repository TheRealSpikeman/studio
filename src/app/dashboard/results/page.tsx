// src/app/dashboard/results/page.tsx
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Download, Eye, BarChart3, Info, AlertTriangle, Brain, ThumbsUp, Edit2Icon, Lightbulb, HelpCircle, Sparkles, MessageSquareHeart } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { jsPDF, TextOptionsLight } from 'jspdf';
import { neurotypeDescriptionsTeen, thresholdsTeen } from '@/lib/quiz-data/teen-neurodiversity-quiz';
import type { NeurotypeDescription, QuizOption } from '@/lib/quiz-data/teen-neurodiversity-quiz';
import { format } from 'date-fns';
import { nl } from 'date-fns/locale';

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
      ],
      // Simulating AI analysis for this generic quiz for PDF styling
      aiAnalysis: `## Jouw Profiel In Vogelvlucht
* Algemeen Overzicht: Op basis van uw antwoorden lijkt u een flexibel en aanpasbaar persoon te zijn, die situaties pragmatisch benadert.
* Creativiteit (Score: 3.2): U toont een bovengemiddelde neiging tot creatief denken en het vinden van originele oplossingen.
* Detailgerichtheid (Score: 2.8): U heeft een goed oog voor detail, maar kunt soms het grotere geheel uit het oog verliezen.

## Sterke Kanten
* Flexibiliteit in denken en handelen.
* Goed probleemoplossend vermogen.
* Openheid voor nieuwe ideeën.

## Aandachtspunten
* Kan soms moeite hebben met het starten van taken die minder direct appelleren.
* Balans vinden tussen detail en overzicht.

## Tips voor Jou
* Zet je creativiteit in bij het oplossen van problemen.
* Maak gebruik van planningstools om taken te structureren.
* Vraag feedback om je blinde vlekken te identificeren.
`
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
    title: 'Neurodiversiteit Quiz (15-18 jaar)', 
    dateCompleted: '2024-04-05', 
    score: 'Profiel: ADD & HSP',
    ageGroup: '15-18',
    reportData: { 
      summary: "Je antwoorden laten zien dat je eigenschappen herkent die passen bij ADD (aandacht en concentratie) en HSP (hoogsensitiviteit). Dit is een unieke combinatie die zowel sterke punten als uitdagingen met zich meebrengt.",
      answers: [
        {question: "Ik merk dat mijn gedachten afdwalen, zelfs als ik probeer te focussen op schoolwerk.", answer: "Vaak (3)"},
        {question: "Kleine afleidingen zoals tikkende pennen verstoren mijn concentratie volledig.", answer: "Altijd (4)"},
        {question: "Na een lange schooldag heb ik echt tijd nodig om bij te komen.", answer: "Vaak (3)"},
        {question: "Ik merk geuren, geluiden of aanrakingen sterker op dan mijn vrienden.", answer: "Altijd (4)"}
      ],
      // Tips for teen quiz will be dynamically pulled from neurotypeDescriptionsTeen
      // Placeholder for AI analysis for teen quiz (this is usually on the quiz result page itself)
      aiAnalysis: `## Jouw Profiel In Vogelvlucht
* ADD (Score: 3.5): Je herkent duidelijk kenmerken van aandachtsuitdagingen.
* HSP (Score: 3.2): Prikkelverwerking lijkt intenser bij jou.
* Overig: Geen andere profielen springen er significant uit.

## Sterke Kanten
* Creatief en out-of-the-box denker (ADD).
* Empathisch en opmerkzaam voor details (HSP).

## Aandachtspunten
* Focus vasthouden bij minder boeiende taken (ADD).
* Overprikkeling voorkomen in drukke omgevingen (HSP).

## Tips voor Jou
* Gebruik een koptelefoon met rustige muziek tijdens het leren.
* Plan vaste pauzemomenten in om overprikkeling te managen.
* Communiceer je grenzen als het te druk wordt.
`
    } 
  },
];

// HSL to RGB conversion function (basic implementation)
function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  s /= 100;
  l /= 100;
  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) =>
    l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return [255 * f(0), 255 * f(8), 255 * f(4)];
}

const PDF_COLORS = {
  primary: hslToRgb(27, 86, 50), // Orange #ed7613
  accent: hslToRgb(168, 76, 42), // Teal #1abc9c
  foreground: hslToRgb(210, 40, 10), // Dark Gray
  mutedForeground: hslToRgb(210, 20, 45), // Lighter Gray
  background: hslToRgb(200, 17, 94), // Light Gray #ecf0f1
  card: hslToRgb(0,0,100), // White
  border: hslToRgb(210, 10, 80),
  green: hslToRgb(120, 60, 40), // A generic green for positive items
  yellow: hslToRgb(50, 80, 50), // A generic yellow for tips/attention
  blue: hslToRgb(210, 80, 50), // A generic blue for info
};

const PDF_STYLES = {
  fontFamily: "Helvetica", // jsPDF supports basic fonts like Helvetica, Times, Courier
  pageMargins: { top: 20, bottom: 20, left: 15, right: 15 },
  lineHeight: 7,
  sectionSpacing: 10,
  paragraphSpacing: 5,
  titleSize: 18,
  h2Size: 16,
  h3Size: 14,
  h4Size: 12,
  normalSize: 10,
  smallSize: 8,
};

const neurotypeIcons: Record<string, React.ElementType> = {
  ADD: Brain, ADHD: Zap, HSP: Sparkles, ASS: Compass, AngstDepressie: ShieldAlert,
  'Jouw Profiel In Vogelvlucht': MessageSquareHeart,
  'Sterke Kanten': ThumbsUp, 'Aandachtspunten': Edit2Icon, 'Tips voor Jou': Lightbulb,
  'Overige Informatie': Info, 'Default': HelpCircle,
};

interface ParsedProfileScore {
  profileName: string; score: string; comment: string; icon?: React.ElementType; subScores?: ParsedProfileScore[];
}
interface AiAnalysisSection {
  title: string; content: string | ParsedProfileScore[]; isList?: boolean; icon?: React.ElementType;
}


export default function ResultsHistoryPage() {
  const { toast } = useToast();

    const parseAiAnalysisText = (analysisText: string | undefined): AiAnalysisSection[] => {
      if (!analysisText || typeof analysisText !== 'string') return [];
      
      const sanitize = (text: string): string => text.replace(/(\*\*|__)(.*?)\1/g, '$2').replace(/(\*|_)(.*?)\1/g, '$2').trim();

      const sections: AiAnalysisSection[] = [];
      const knownHeaders = ["Jouw Profiel In Vogelvlucht", "Sterke Kanten", "Aandachtspunten", "Tips voor Jou"];
      let textToProcess = analysisText.replace(/^##\s+/gm, '').replace(/^#\s+/gm, '');

      for (const header of knownHeaders) {
        const headerRegex = new RegExp(`^${header.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(\\s*\\n)?`, 'im');
        const match = headerRegex.exec(textToProcess);

        if (match) {
          const contentStartIndex = match.index + match[0].length;
          let contentEndIndex = textToProcess.length;

          for (const nextKnownHeader of knownHeaders) {
            if (nextKnownHeader === header) continue;
            const nextKnownHeaderRegex = new RegExp(`^${nextKnownHeader.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(\\s*\\n)?`, 'im');
            const nextMatch = nextKnownHeaderRegex.exec(textToProcess.substring(contentStartIndex));
            if (nextMatch) {
              contentEndIndex = contentStartIndex + nextMatch.index;
              break;
            }
          }
          
          let currentContent = sanitize(textToProcess.substring(contentStartIndex, contentEndIndex));
          textToProcess = textToProcess.substring(contentEndIndex);
          
          currentContent = currentContent.split('\n').filter(line => line.trim() !== '*' && line.trim() !== '-').join('\n').trim();
          const isListSection = ["Sterke Kanten", "Aandachtspunten", "Tips voor Jou"].includes(header);
          
          if (header === "Jouw Profiel In Vogelvlucht") {
            const profileScores: ParsedProfileScore[] = [];
            let generalOverviewContent = "";
            currentContent.split('\n').forEach(line => {
              line = sanitize(line.replace(/^- |^\* /,''));
              if (!line) return;
              const scoreMatch = line.match(/([^:(]+)(?:\s*\(Score:\s*([\d.]+)\))?:\s*(.+)/i) || line.match(/([^:]+):\s*([\d.]+)\s*(?:\((.+)\))?/i);
              if (scoreMatch) {
                profileScores.push({ profileName: sanitize(scoreMatch[1]), score: scoreMatch[2] ? sanitize(scoreMatch[2]) : "", comment: sanitize(scoreMatch[3] || scoreMatch[0].substring(scoreMatch[0].indexOf(':') + 1)) });
              } else { generalOverviewContent += (generalOverviewContent ? '\n' : '') + line; }
            });
            const sectionContent: ParsedProfileScore[] = [];
            if (generalOverviewContent) sectionContent.push({ profileName: "Algemeen Overzicht", score: "", comment: generalOverviewContent, icon: neurotypeIcons["Algemeen Overzicht"] });
            if (profileScores.length > 0) sectionContent.push({ profileName: "Score Inzichten per Thema", score: "", comment: "", icon: UsersIcon, subScores: profileScores });
            if (sectionContent.length > 0) sections.push({ title: header, content: sectionContent, icon: neurotypeIcons[header] });
          } else if (currentContent) {
            sections.push({ title: header, content: currentContent, isList: isListSection, icon: neurotypeIcons[header] });
          }
        }
      }
      if (textToProcess.trim()) sections.push({ title: "Overige Informatie", content: sanitize(textToProcess), isList: false, icon: neurotypeIcons["Overige Informatie"] });
      return sections.filter(s => s.content && (typeof s.content === 'string' ? s.content.trim() !== "" : s.content.length > 0));
    };


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
      const pageWidth = doc.internal.pageSize.width;
      const margins = PDF_STYLES.pageMargins;
      const usableWidth = pageWidth - margins.left - margins.right;
      let y = margins.top;

      const addText = (text: string, x: number, currentY: number, options: TextOptionsLight & { lineHeight?: number, color?: [number, number, number], fontSize?: number, fontStyle?: string, maxWidth?: number } = {}) => {
        if (options.color) doc.setTextColor(options.color[0], options.color[1], options.color[2]);
        if (options.fontSize) doc.setFontSize(options.fontSize);
        if (options.fontStyle) doc.setFont(PDF_STYLES.fontFamily, options.fontStyle);
        
        const lines = doc.splitTextToSize(text, options.maxWidth || usableWidth);
        lines.forEach((line: string) => {
          if (currentY + (options.lineHeight || PDF_STYLES.lineHeight) > pageHeight - margins.bottom) {
            doc.addPage();
            currentY = margins.top;
          }
          doc.text(line, x, currentY, options);
          currentY += (options.lineHeight || PDF_STYLES.lineHeight);
        });

        // Reset to default styles
        doc.setTextColor(PDF_COLORS.foreground[0], PDF_COLORS.foreground[1], PDF_COLORS.foreground[2]);
        doc.setFontSize(PDF_STYLES.normalSize);
        doc.setFont(PDF_STYLES.fontFamily, "normal");
        return currentY;
      };
      
      const addSectionTitle = (title: string, currentY: number, color: [number, number, number] = PDF_COLORS.primary) => {
        if (currentY + PDF_STYLES.h2Size + PDF_STYLES.sectionSpacing > pageHeight - margins.bottom) {
            doc.addPage(); currentY = margins.top;
        }
        currentY = addText(title, margins.left, currentY, { fontSize: PDF_STYLES.h2Size, fontStyle: 'bold', color: color, lineHeight: PDF_STYLES.h2Size * 0.6 });
        doc.setDrawColor(color[0], color[1], color[2]);
        doc.line(margins.left, currentY -1, margins.left + 50, currentY -1); // Accent line
        return currentY + PDF_STYLES.paragraphSpacing;
      };

      const addCard = (currentY: number, cardContent: () => number, cardBgColor: [number, number, number] = PDF_COLORS.card, borderColor?: [number, number, number]) => {
        const startY = currentY;
        let contentEndY = cardContent();
        
        // Check if card needs to wrap to new page
        if (contentEndY > pageHeight - margins.bottom && startY + (contentEndY - currentY) > pageHeight - margins.bottom - margins.top) {
            doc.addPage();
            currentY = margins.top;
            // Redraw background for new page if content started there
            doc.setFillColor(cardBgColor[0], cardBgColor[1], cardBgColor[2]);
            doc.rect(margins.left - 5, currentY - 5, usableWidth + 10, pageHeight - margins.top - margins.bottom + 10, 'F');
            contentEndY = cardContent(); // Recalculate content end Y on new page
        } else {
             doc.setFillColor(cardBgColor[0], cardBgColor[1], cardBgColor[2]);
             doc.rect(margins.left - 5, startY - 5, usableWidth + 10, contentEndY - startY + 10, 'F');
        }

        if (borderColor) {
            doc.setDrawColor(borderColor[0], borderColor[1], borderColor[2]);
            doc.rect(margins.left - 5, startY - 5, usableWidth + 10, contentEndY - startY + 10, 'S');
        }
        return contentEndY + PDF_STYLES.sectionSpacing;
      };

      // --- Document Header ---
      doc.setFont(PDF_STYLES.fontFamily, "bold");
      y = addText(quiz.title, margins.left, y, { fontSize: PDF_STYLES.titleSize, color: PDF_COLORS.primary, lineHeight: PDF_STYLES.titleSize * 0.7});
      doc.setFont(PDF_STYLES.fontFamily, "normal");
      y = addText(`Rapport gegenereerd op: ${format(new Date(), 'PPPp', { locale: nl })}`, margins.left, y, {fontSize: PDF_STYLES.smallSize, color: PDF_COLORS.mutedForeground});
      y = addText(`Resultaten voor quiz voltooid op: ${quiz.dateCompleted}`, margins.left, y, {fontSize: PDF_STYLES.smallSize, color: PDF_COLORS.mutedForeground});
      y = addText(`Score/Profiel: ${quiz.score}`, margins.left, y, {fontSize: PDF_STYLES.smallSize, color: PDF_COLORS.mutedForeground});
      y += PDF_STYLES.sectionSpacing;

      // --- Summary (if not teen AI quiz) ---
      if (quiz.id !== 'teen-neurodiversity-quiz' && quiz.reportData.summary) {
        y = addSectionTitle("Samenvatting", y);
        y = addText(quiz.reportData.summary, margins.left, y, { color: PDF_COLORS.foreground, lineHeight: PDF_STYLES.lineHeight * 0.9 });
        y += PDF_STYLES.sectionSpacing;
      }
      
      // --- AI Analysis or Specific Teen Quiz Report ---
      const aiAnalysisText = quiz.reportData.aiAnalysis;
      const parsedAnalysis = parseAiAnalysisText(aiAnalysisText);

      if (parsedAnalysis.length > 0) {
          y = addText("Diepgaande Analyse (AI Gegenereerd)", margins.left, y, { fontSize: PDF_STYLES.h2Size, fontStyle: 'bold', color: PDF_COLORS.accent, lineHeight: PDF_STYLES.h2Size * 0.6 });
          y += PDF_STYLES.paragraphSpacing;

          parsedAnalysis.forEach(section => {
              const sectionColor = section.title === "Jouw Profiel In Vogelvlucht" ? PDF_COLORS.blue : 
                                   section.title === "Sterke Kanten" ? PDF_COLORS.green :
                                   section.title === "Aandachtspunten" ? PDF_COLORS.yellow :
                                   section.title === "Tips voor Jou" ? PDF_COLORS.accent : PDF_COLORS.primary;
              
              y = addText(section.title, margins.left, y, { fontSize: PDF_STYLES.h3Size, fontStyle: 'bold', color: sectionColor, lineHeight: PDF_STYLES.h3Size * 0.7 });
              y += PDF_STYLES.paragraphSpacing / 2;

              if (typeof section.content === 'string') {
                  const listItems = section.isList ? section.content.split('\n').map(item => item.replace(/^- |^\* /,'').trim()).filter(Boolean) : [];
                  if (section.isList && listItems.length > 0) {
                      listItems.forEach(item => {
                          y = addText(`• ${item}`, margins.left + 5, y, { color: PDF_COLORS.foreground, lineHeight: PDF_STYLES.lineHeight * 0.9 });
                      });
                  } else {
                      y = addText(section.content, margins.left, y, { color: PDF_COLORS.foreground, lineHeight: PDF_STYLES.lineHeight * 0.9 });
                  }
              } else if (Array.isArray(section.content)) { // ParsedProfileScore[]
                  section.content.forEach(profileScore => {
                    if (profileScore.profileName === "Score Inzichten per Thema" && profileScore.subScores) {
                        y = addText(profileScore.profileName, margins.left + 5, y, { fontSize: PDF_STYLES.h4Size, fontStyle: 'bold', color: PDF_COLORS.foreground, lineHeight: PDF_STYLES.h4Size * 0.7 });
                        profileScore.subScores.forEach(sub => {
                            y = addText(`${sub.profileName}${sub.score ? ` (Score: ${sub.score})` : ''}: ${sub.comment}`, margins.left + 10, y, { color: PDF_COLORS.foreground, lineHeight: PDF_STYLES.lineHeight * 0.9 });
                        });
                    } else {
                         y = addText(`${profileScore.profileName}${profileScore.score ? ` (Score: ${profileScore.score})` : ''}: ${profileScore.comment}`, margins.left + 5, y, { color: PDF_COLORS.foreground, lineHeight: PDF_STYLES.lineHeight * 0.9 });
                    }
                     y += PDF_STYLES.paragraphSpacing / 2;
                  });
              }
              y += PDF_STYLES.paragraphSpacing;
          });
          y += PDF_STYLES.sectionSpacing;
      }


      // --- Specific Teen Quiz Tips (if applicable and not already covered by AI) ---
      if (quiz.id === 'teen-neurodiversity-quiz' && !aiAnalysisText) { // Only if AI didn't provide tips
        const identifiedProfiles: string[] = [];
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
          y = addSectionTitle("Tips en Strategieën", y, PDF_COLORS.accent);
          identifiedProfiles.forEach(profileKey => {
            const profileData = neurotypeDescriptionsTeen[profileKey];
            if (profileData) {
              y = addText(profileData.title, margins.left, y, { fontSize: PDF_STYLES.h3Size, fontStyle: 'bold', color: PDF_COLORS.foreground });
              y = addText(`School/Studie: ${profileData.tips.school}`, margins.left + 5, y, { lineHeight: PDF_STYLES.lineHeight * 0.9 });
              y = addText(`Thuis: ${profileData.tips.thuis}`, margins.left + 5, y, { lineHeight: PDF_STYLES.lineHeight * 0.9 });
              y = addText(`Sociaal: ${profileData.tips.sociaal}`, margins.left + 5, y, { lineHeight: PDF_STYLES.lineHeight * 0.9 });
              y = addText(`Werk/Stage: ${profileData.tips.werk}`, margins.left + 5, y, { lineHeight: PDF_STYLES.lineHeight * 0.9 });
              y += PDF_STYLES.paragraphSpacing;
            }
          });
        }
        y += PDF_STYLES.sectionSpacing;
      } else if (quiz.id !== 'teen-neurodiversity-quiz' && quiz.reportData.tips && quiz.reportData.tips.length > 0  && !aiAnalysisText) {
        // Generic quiz tips if no AI analysis provided them
        y = addSectionTitle("Tips en Strategieën", y, PDF_COLORS.accent);
        quiz.reportData.tips.forEach(tip => {
          y = addText(`• ${tip}`, margins.left + 5, y, { lineHeight: PDF_STYLES.lineHeight * 0.9 });
        });
        y += PDF_STYLES.sectionSpacing;
      }
      
      // --- Vragen en Antwoorden ---
      if (quiz.reportData.answers && quiz.reportData.answers.length > 0) {
        y = addSectionTitle("Jouw Antwoorden", y);
        quiz.reportData.answers.forEach((ans, index) => {
          y = addText(`Vraag ${index + 1}: ${ans.question}`, margins.left, y, { fontStyle: 'bold', lineHeight: PDF_STYLES.lineHeight * 0.9 });
          y = addText(`Antwoord: ${ans.answer}`, margins.left + 5, y, {color: PDF_COLORS.mutedForeground, lineHeight: PDF_STYLES.lineHeight * 0.9 });
          y += PDF_STYLES.paragraphSpacing / 2;
        });
      }
      y += PDF_STYLES.sectionSpacing;


      // --- Disclaimer ---
      const disclaimerRectY = y > pageHeight - margins.bottom - 30 ? margins.top : y;
      if (y > pageHeight - margins.bottom - 30) doc.addPage();
      y = disclaimerRectY;

      doc.setFillColor(PDF_COLORS.background[0], PDF_COLORS.background[1], PDF_COLORS.background[2]);
      const disclaimerText = "Dit rapport is gebaseerd op de antwoorden die zijn gegeven in de quiz en dient ter indicatie en zelfreflectie. Het is geen vervanging voor een professionele diagnose of medisch advies. Raadpleeg een gekwalificeerde zorgverlener of psycholoog voor een formele diagnose, persoonlijk advies of behandeling. MindNavigator is niet aansprakelijk voor beslissingen genomen op basis van dit rapport.";
      const disclaimerLines = doc.splitTextToSize(disclaimerText, usableWidth - 10);
      const disclaimerHeight = disclaimerLines.length * (PDF_STYLES.smallSize * 0.5) + 10;
      
      // Ensure disclaimer fits or move to next page
      if (y + disclaimerHeight > pageHeight - margins.bottom) {
          doc.addPage();
          y = margins.top;
      }

      doc.setFillColor(PDF_COLORS.mutedForeground[0], PDF_COLORS.mutedForeground[1], PDF_COLORS.mutedForeground[2]); // Light gray BG for disclaimer
      doc.rect(margins.left, y, usableWidth, disclaimerHeight + 5, 'F');
      
      y = addText("Disclaimer", margins.left + 5, y + 5, { fontSize: PDF_STYLES.h4Size, fontStyle: 'bold', color: PDF_COLORS.foreground, lineHeight: PDF_STYLES.h4Size * 0.6 });
      y = addText(disclaimerText, margins.left + 5, y , { fontSize: PDF_STYLES.smallSize, color: PDF_COLORS.foreground, lineHeight: PDF_STYLES.smallSize * 0.6, maxWidth: usableWidth -10 });


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
                        {/* Ensure link directs to the correct results page, considering teen quiz has its own dynamic one */}
                        <Link href={quiz.id === 'teen-neurodiversity-quiz' ? `/quiz/teen-neurodiversity-quiz?ageGroup=${quiz.ageGroup || '15-18'}` : `/quiz/${quiz.id}/results`}> 
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

