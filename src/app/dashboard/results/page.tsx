
// src/app/dashboard/results/page.tsx
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Download, Eye, BarChart3, Info, AlertTriangle, Brain, ThumbsUp, Edit2Icon, Lightbulb, HelpCircle, Sparkles, MessageSquareHeart, Zap, Compass, ShieldAlert, Users as UsersIcon, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { jsPDF, TextOptionsLight } from 'jspdf';
import { neurotypeDescriptionsTeen, thresholdsTeen } from '@/lib/quiz-data/teen-neurodiversity-quiz';
import type { NeurotypeDescription, QuizOption } from '@/lib/quiz-data/teen-neurodiversity-quiz';
import { format } from 'date-fns';
import { nl } from 'date-fns/locale';
import { Alert, AlertDescription as AlertDescUi, AlertTitle as AlertTitleUi } from "@/components/ui/alert";


// Dummy data for demonstration
const completedQuizzes = [
  { 
    id: 'neuroprofile-101', 
    title: 'Basis Zelfreflectie Quiz', 
    dateCompleted: '2024-03-10', 
    score: 'Uitgebalanceerd Profiel', 
    reportData: { 
      summary: "Dit is een voorlopige samenvatting voor de Basis Zelfreflectie Quiz. U vertoont een evenwichtige mix van eigenschappen, wat wijst op een flexibele aanpassing aan verschillende situaties. Uw sterke punten liggen mogelijk in het combineren van analytisch denken met creatieve oplossingen.",
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
    title: 'Neurodiversiteit Zelfreflectie Quiz (15-18 jaar)', 
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
  primary: hslToRgb(27, 86, 50), 
  accent: hslToRgb(168, 76, 42), 
  foreground: hslToRgb(210, 40, 10), 
  mutedForeground: hslToRgb(210, 20, 45), 
  background: hslToRgb(200, 17, 94), 
  card: hslToRgb(0,0,100), 
  border: hslToRgb(210, 10, 80), 
  green: hslToRgb(145, 63, 42), 
  yellow: hslToRgb(48, 96, 59), 
  blue: hslToRgb(207, 90, 54), 
  sectionBlue: {
    bg: hslToRgb(210, 100, 98), 
    border: hslToRgb(207, 90, 54), 
    text: hslToRgb(210, 40, 10), 
    title: hslToRgb(207, 90, 44), 
  },
  sectionGreen: {
    bg: hslToRgb(120, 60, 95), 
    border: hslToRgb(145, 63, 42), 
    text: hslToRgb(120, 40, 10),
    title: hslToRgb(145, 63, 32),
  },
  sectionOrange: {
    bg: hslToRgb(39, 100, 97), 
    border: hslToRgb(35, 100, 50), 
    text: hslToRgb(39, 40, 10),
    title: hslToRgb(35, 100, 40),
  },
   sectionYellow: { 
    bg: hslToRgb(50, 100, 97), 
    border: hslToRgb(45, 100, 50), 
    text: hslToRgb(50, 40, 10),
    title: hslToRgb(45, 100, 40),
  }
};

const PDF_STYLES = {
  fontFamily: "Helvetica",
  pageMargins: { top: 20, bottom: 20, left: 15, right: 15 },
  lineHeight: 7, 
  paragraphSpacing: 5,
  sectionSpacing: 10,
  titleSize: 20,
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
  'Algemeen Overzicht': MessageSquareHeart,
};

interface ParsedProfileScore {
  profileName: string; score: string; comment: string; icon?: React.ElementType; subScores?: ParsedProfileScore[];
}
interface AiAnalysisSection {
  title: string; content: string | ParsedProfileScore[]; isList?: boolean; icon?: React.ElementType;
}


export default function ResultsHistoryPage() {
  const { toast } = useToast();

    const sanitizeAiTextForPdf = (text: string): string => {
      if (typeof text !== 'string') return '';
      return text.replace(/(\*\*|__)(.*?)\1/g, '$2').replace(/(\*|_)(.*?)\1/g, '$2').trim();
    };

    const parseAiAnalysisText = (analysisText: string | undefined): AiAnalysisSection[] => {
      if (!analysisText || typeof analysisText !== 'string') return [];
      
      let cleanedText = sanitizeAiTextForPdf(analysisText);
      cleanedText = cleanedText.replace(/^##\s+/gm, ''); 
      cleanedText = cleanedText.replace(/^#\s+/gm, ''); 

      const sections: AiAnalysisSection[] = [];
      const knownHeaders = ["Jouw Profiel In Vogelvlucht", "Sterke Kanten", "Aandachtspunten", "Tips voor Jou"];
      
      let textToProcess = cleanedText;
      let lastKnownHeaderEndIndex = 0;

      for (const header of knownHeaders) {
        const headerRegex = new RegExp(`^${header.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(\\s*\\n)?`, 'im');
        const match = headerRegex.exec(textToProcess);

        if (match) {
          const contentBeforeThisHeader = sanitizeAiTextForPdf(textToProcess.substring(0, match.index).trim());
          if (contentBeforeThisHeader && lastKnownHeaderEndIndex === 0 && !sections.find(s => s.title === "Overige Informatie")) {
            const cleanedContentBefore = contentBeforeThisHeader.split('\n').map(line => line.replace(/^- |^\* /,'').trim()).filter(Boolean).join('\n');
            if (cleanedContentBefore) {
                sections.push({
                  title: "Overige Informatie",
                  content: cleanedContentBefore,
                  isList: false,
                  icon: neurotypeIcons["Overige Informatie"] || Info
                });
            }
          }

          const currentSectionTitle = header;
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
          
          let currentContent = sanitizeAiTextForPdf(textToProcess.substring(contentStartIndex, contentEndIndex).trim());
          textToProcess = textToProcess.substring(contentEndIndex);
          lastKnownHeaderEndIndex = contentEndIndex;
          
          currentContent = currentContent.split('\n').filter(line => line.trim() !== '*' && line.trim() !== '-' && line.trim() !== '##').join('\n');
          currentContent = currentContent.replace(/^##\s*/gm, '').trim();

          const isListSection = ["Sterke Kanten", "Aandachtspunten", "Tips voor Jou"].includes(currentSectionTitle);
          let IconComponentForSection = neurotypeIcons[currentSectionTitle] || HelpCircle;

          if (currentSectionTitle === "Jouw Profiel In Vogelvlucht") {
            const profileScores: ParsedProfileScore[] = [];
            let generalOverviewContent = "";
            currentContent.split('\n').forEach(line => {
              line = sanitizeAiTextForPdf(line.replace(/^- |^\* /,'').trim());
              if (!line) return;
              const scoreMatch = line.match(/([^:(]+)(?:\s*\(Score:\s*([\d.]+)\))?:\s*(.+)/i) || line.match(/([^:]+):\s*([\d.]+)\s*(?:\((.+)\))?/i);

              if (scoreMatch) {
                const profileName = sanitizeAiTextForPdf(scoreMatch[1].trim());
                const scoreValue = scoreMatch[2] ? sanitizeAiTextForPdf(scoreMatch[2].trim()) : ""; 
                let commentText = scoreMatch[3] ? sanitizeAiTextForPdf(scoreMatch[3].trim()) : "";

                if (!commentText && !scoreValue && scoreMatch[0].includes(':')) { 
                    commentText = sanitizeAiTextForPdf(scoreMatch[0].substring(scoreMatch[0].indexOf(':') + 1).trim());
                }
                
                const profileKey = Object.keys(neurotypeIcons).find(key =>
                  profileName.toLowerCase().includes(key.toLowerCase()) ||
                  (neurotypeDescriptionsTeen[key] && neurotypeDescriptionsTeen[key].title.toLowerCase().includes(profileName.toLowerCase()))
                ) || 'Default';
                profileScores.push({
                  profileName: profileName,
                  score: scoreValue,
                  comment: commentText,
                  icon: neurotypeIcons[profileKey] || Brain
                });
              } else {
                generalOverviewContent += (generalOverviewContent ? '\n' : '') + line;
              }
            });
            
            const sectionContent: ParsedProfileScore[] = [];
            if (generalOverviewContent.trim()) {
              sectionContent.push({ profileName: "Algemeen Overzicht", score: "", comment: generalOverviewContent.trim(), icon: neurotypeIcons["Algemeen Overzicht"] || MessageSquareHeart });
            }
            
            const groupedScores: ParsedProfileScore[] = [];
            profileScores.forEach(ps => {
                const commentScoreMatch = ps.comment.match(/^\(([\d.]+)\)\s*(.*)/);
                if (!ps.score && commentScoreMatch) {
                    ps.score = sanitizeAiTextForPdf(commentScoreMatch[1]);
                    ps.comment = sanitizeAiTextForPdf(commentScoreMatch[2].trim());
                }
                 const themeKey = Object.keys(neurotypeIcons).find(key =>
                    ps.profileName.toLowerCase().includes(key.toLowerCase()) ||
                    (neurotypeDescriptionsTeen[key] && neurotypeDescriptionsTeen[key].title.toLowerCase().includes(ps.profileName.toLowerCase()))
                  ) || 'Default';

                groupedScores.push({
                  ...ps,
                  profileName: sanitizeAiTextForPdf(ps.profileName),
                  score: sanitizeAiTextForPdf(ps.score),
                  comment: sanitizeAiTextForPdf(ps.comment),
                  icon: neurotypeIcons[themeKey] || Brain
                });
            });

            if (groupedScores.length > 0) {
                sectionContent.push({
                    profileName: "Score Inzichten per Thema",
                    score: "",
                    comment: "",
                    icon: UsersIcon,
                    subScores: groupedScores
                });
            }

            if (sectionContent.length > 0) {
                sections.push({ title: currentSectionTitle, content: sectionContent, icon: IconComponentForSection });
            } else if (currentContent.trim() && !generalOverviewContent.trim()) { 
                sections.push({ title: currentSectionTitle, content: currentContent.trim(), isList: isListSection, icon: IconComponentForSection });
            }

          } else if (currentContent.trim()) {
            sections.push({ title: currentSectionTitle, content: currentContent.trim(), isList: isListSection, icon: IconComponentForSection });
          }
        }
      }

      if (textToProcess.trim()) {
        const cleanedRemainingText = sanitizeAiTextForPdf(textToProcess.replace(/^##\s*/gm, '').trim());
        if (cleanedRemainingText) {
            const existingOtherInfo = sections.find(s => s.title === "Overige Informatie");
            if (existingOtherInfo && typeof existingOtherInfo.content === 'string') {
                existingOtherInfo.content += '\n' + cleanedRemainingText.split('\n').map(line => line.replace(/^- |^\* /,'').trim()).filter(Boolean).join('\n');
            } else if (!existingOtherInfo) {
              sections.push({
                  title: "Overige Informatie",
                  content: cleanedRemainingText.split('\n').map(line => line.replace(/^- |^\* /,'').trim()).filter(Boolean).join('\n'),
                  isList: false,
                  icon: neurotypeIcons["Overige Informatie"] || Info
                });
            }
        }
      }
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
      const doc = new jsPDF({
        orientation: 'p',
        unit: 'mm',
        format: 'a4'
      });
      const pageHeight = doc.internal.pageSize.height;
      const pageWidth = doc.internal.pageSize.width;
      const margins = PDF_STYLES.pageMargins;
      const usableWidth = pageWidth - margins.left - margins.right;
      let y = margins.top;

      const addTextLines = (text: string, x: number, currentY: number, options: TextOptionsLight & { lineHeightFactor?: number, color?: [number, number, number], fontSize?: number, fontStyle?: string, maxWidth?: number } = {}) => {
        const fontSize = options.fontSize || PDF_STYLES.normalSize;
        doc.setFontSize(fontSize);
        if (options.color) doc.setTextColor(options.color[0], options.color[1], options.color[2]);
        if (options.fontStyle) doc.setFont(PDF_STYLES.fontFamily, options.fontStyle);
        
        const lineHeight = fontSize * (options.lineHeightFactor || 0.45); 
        const lines = doc.splitTextToSize(text, options.maxWidth || usableWidth);

        lines.forEach((line: string) => {
          if (currentY + lineHeight > pageHeight - margins.bottom) {
            doc.addPage();
            currentY = margins.top;
          }
          doc.text(line, x, currentY);
          currentY += lineHeight;
        });
        
        doc.setTextColor(PDF_COLORS.foreground[0], PDF_COLORS.foreground[1], PDF_COLORS.foreground[2]);
        doc.setFontSize(PDF_STYLES.normalSize);
        doc.setFont(PDF_STYLES.fontFamily, "normal");
        return currentY;
      };
      
      const addSectionContainer = (currentY: number, contentFunction: (yPos: number) => number, bgColor?: [number,number,number], borderColor?: [number,number,number], title?:string, titleColor?:[number,number,number], titleSize?:number, icon?: React.ElementType ) => {
        let startY = currentY;
        let tempY = currentY;
        const titleHeightEstimate = title ? (titleSize || PDF_STYLES.h2Size) * 0.6 + PDF_STYLES.paragraphSpacing / 2 : 0;

        // Estimate if content fits with title
        let contentEndY = contentFunction(tempY + titleHeightEstimate);
        let rectHeight = contentEndY - startY + (PDF_STYLES.paragraphSpacing); 

        if (startY + rectHeight > pageHeight - margins.bottom) {
          doc.addPage();
          startY = margins.top;
          currentY = startY; 
          tempY = currentY; 
          contentEndY = contentFunction(tempY + titleHeightEstimate);
          rectHeight = contentEndY - startY + PDF_STYLES.paragraphSpacing;
        }
        
        if (bgColor) {
          doc.setFillColor(bgColor[0], bgColor[1], bgColor[2]);
          doc.rect(margins.left - 3, startY - 3, usableWidth + 6, rectHeight + 3, 'F'); 
        }
        if (borderColor) {
          doc.setDrawColor(borderColor[0], borderColor[1], borderColor[2]);
          doc.setLineWidth(0.5);
          doc.rect(margins.left - 3, startY - 3, usableWidth + 6, rectHeight + 3, 'S');
        }
        
        if(title){
             addTextLines(title, margins.left + (icon ? 7 : 0), startY, { fontSize: titleSize || PDF_STYLES.h2Size, fontStyle: 'bold', color: titleColor || PDF_COLORS.primary, lineHeightFactor: 0.6 });
        }

        contentFunction(startY + titleHeightEstimate); // Redraw content on top of bg/border

        return startY + rectHeight + PDF_STYLES.sectionSpacing;
      };


      y = addTextLines(quiz.title, margins.left, y, { fontSize: PDF_STYLES.titleSize, fontStyle: 'bold', color: PDF_COLORS.accent, lineHeightFactor: 0.6 });
      y = addTextLines(`Rapport gegenereerd op: ${format(new Date(), 'PPPp', { locale: nl })}`, margins.left, y, {fontSize: PDF_STYLES.smallSize, color: PDF_COLORS.mutedForeground, lineHeightFactor: 0.6});
      y = addTextLines(`Resultaten voor quiz voltooid op: ${quiz.dateCompleted}`, margins.left, y, {fontSize: PDF_STYLES.smallSize, color: PDF_COLORS.mutedForeground, lineHeightFactor: 0.6});
      y = addTextLines(`Indicatief Profiel: ${quiz.score}`, margins.left, y, {fontSize: PDF_STYLES.smallSize, color: PDF_COLORS.mutedForeground, lineHeightFactor: 0.6});
      y += PDF_STYLES.sectionSpacing;

      if (quiz.id !== 'teen-neurodiversity-quiz' && quiz.reportData.summary) {
         y = addSectionContainer(y, (currentY) => {
            currentY = addTextLines(quiz.reportData.summary, margins.left, currentY, { color: PDF_COLORS.foreground, lineHeightFactor: 0.5 });
            return currentY;
        }, PDF_COLORS.sectionBlue.bg, PDF_COLORS.sectionBlue.border, "Samenvatting", PDF_COLORS.sectionBlue.title, PDF_STYLES.h2Size);
      }
      
      const aiAnalysisText = quiz.reportData.aiAnalysis;
      const parsedAnalysis = parseAiAnalysisText(aiAnalysisText);

      if (parsedAnalysis.length > 0) {
          y = addTextLines("Persoonlijke Inzichten (AI-gegenereerd)", margins.left, y, { fontSize: PDF_STYLES.h2Size, fontStyle: 'bold', color: PDF_COLORS.primary, lineHeightFactor: 0.6 });
          y += PDF_STYLES.paragraphSpacing;

          parsedAnalysis.forEach(section => {
            let sectionThemeColors = PDF_COLORS.sectionBlue; 
            if (section.title === "Jouw Profiel In Vogelvlucht") sectionThemeColors = PDF_COLORS.sectionBlue;
            else if (section.title === "Sterke Kanten") sectionThemeColors = PDF_COLORS.sectionGreen;
            else if (section.title === "Aandachtspunten") sectionThemeColors = PDF_COLORS.sectionOrange;
            else if (section.title === "Tips voor Jou") sectionThemeColors = PDF_COLORS.sectionYellow;
              
            y = addSectionContainer(y, (currentY) => {
              let contentY = currentY + (PDF_STYLES.h3Size * 0.5) + PDF_STYLES.paragraphSpacing; 
              if (typeof section.content === 'string') {
                  const listItems = section.isList ? section.content.split('\n').map(item => item.replace(/^- |^\* /,'').trim()).filter(Boolean) : [];
                  if (section.isList && listItems.length > 0) {
                      listItems.forEach(item => {
                          contentY = addTextLines(`• ${item}`, margins.left + 2, contentY, { color: sectionThemeColors.text, lineHeightFactor: 0.5 });
                      });
                  } else {
                      contentY = addTextLines(section.content, margins.left, contentY, { color: sectionThemeColors.text, lineHeightFactor: 0.5 });
                  }
              } else if (Array.isArray(section.content)) { 
                  section.content.forEach(profileScore => {
                    if (profileScore.profileName === "Score Inzichten per Thema" && profileScore.subScores) {
                        contentY = addTextLines(profileScore.profileName, margins.left, contentY, { fontSize: PDF_STYLES.h4Size, fontStyle: 'bold', color: sectionThemeColors.title, lineHeightFactor: 0.5 });
                        profileScore.subScores.forEach(sub => {
                            contentY = addTextLines(`${sub.profileName}${sub.score ? ` (Score: ${sub.score})` : ''}: ${sub.comment}`, margins.left + 2, contentY, { color: sectionThemeColors.text, lineHeightFactor: 0.5 });
                        });
                    } else {
                         contentY = addTextLines(`${profileScore.profileName}${profileScore.score ? ` (Score: ${profileScore.score})` : ''}: ${profileScore.comment}`, margins.left, contentY, { color: sectionThemeColors.text, fontStyle: (profileScore.profileName === "Algemeen Overzicht" ? 'normal':'bold'), fontSize: (profileScore.profileName === "Algemeen Overzicht" ? PDF_STYLES.normalSize : PDF_STYLES.h4Size), lineHeightFactor: 0.5 });
                    }
                     contentY += PDF_STYLES.paragraphSpacing / 2;
                  });
              }
              return contentY;
            }, sectionThemeColors.bg, sectionThemeColors.border, section.title, sectionThemeColors.title, PDF_STYLES.h3Size, section.icon);
          });
      }

      if (quiz.id === 'teen-neurodiversity-quiz' && !aiAnalysisText) { 
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
          y = addSectionContainer(y, (currentY) => {
            identifiedProfiles.forEach(profileKey => {
              const profileData = neurotypeDescriptionsTeen[profileKey];
              if (profileData) {
                currentY = addTextLines(profileData.title, margins.left, currentY, { fontSize: PDF_STYLES.h3Size, fontStyle: 'bold', color: PDF_COLORS.foreground, lineHeightFactor:0.5 });
                currentY = addTextLines(`School/Studie: ${profileData.tips.school}`, margins.left + 2, currentY, { lineHeightFactor: 0.5 });
                currentY = addTextLines(`Thuis: ${profileData.tips.thuis}`, margins.left + 2, currentY, { lineHeightFactor: 0.5 });
                currentY = addTextLines(`Sociaal: ${profileData.tips.sociaal}`, margins.left + 2, currentY, { lineHeightFactor: 0.5 });
                currentY = addTextLines(`Werk/Stage: ${profileData.tips.werk}`, margins.left + 2, currentY, { lineHeightFactor: 0.5 });
                currentY += PDF_STYLES.paragraphSpacing;
              }
            });
            return currentY;
          }, PDF_COLORS.sectionYellow.bg, PDF_COLORS.sectionYellow.border, "Tips en Strategieën", PDF_COLORS.sectionYellow.title, PDF_STYLES.h2Size);
        }
      } else if (quiz.id !== 'teen-neurodiversity-quiz' && quiz.reportData.tips && quiz.reportData.tips.length > 0  && !aiAnalysisText) {
        y = addSectionContainer(y, (currentY) => {
            quiz.reportData.tips.forEach(tip => {
              currentY = addTextLines(`• ${tip}`, margins.left + 2, currentY, { lineHeightFactor: 0.5 });
            });
            return currentY;
        }, PDF_COLORS.sectionYellow.bg, PDF_COLORS.sectionYellow.border, "Tips en Strategieën", PDF_COLORS.sectionYellow.title, PDF_STYLES.h2Size);
      }
      
      if (quiz.reportData.answers && quiz.reportData.answers.length > 0) {
        y = addSectionContainer(y, (currentY) => {
            quiz.reportData.answers.forEach((ans, index) => {
              currentY = addTextLines(`Vraag ${index + 1}: ${ans.question}`, margins.left, currentY, { fontStyle: 'bold', lineHeightFactor: 0.5 });
              currentY = addTextLines(`Antwoord: ${ans.answer}`, margins.left + 2, currentY, {color: PDF_COLORS.mutedForeground, lineHeightFactor: 0.5 });
              currentY += PDF_STYLES.paragraphSpacing / 2;
            });
            return currentY;
        }, PDF_COLORS.card, PDF_COLORS.border, "Jouw Antwoorden", PDF_COLORS.foreground, PDF_STYLES.h2Size);
      }

      const disclaimerText = "Dit rapport is gebaseerd op de antwoorden die zijn gegeven en dient ter indicatie en zelfreflectie. Het is nadrukkelijk geen vervanging voor een professionele diagnose of medisch advies. Raadpleeg een gekwalificeerde zorgverlener of psycholoog voor een formele diagnose, persoonlijk advies of behandeling. Voor meer informatie, bezoek onze informatieve pagina: www.mindnavigator.app/neurodiversiteit (of een relevante link). MindNavigator is niet aansprakelijk voor beslissingen genomen op basis van dit rapport.";
      y = addSectionContainer(y, (currentY) => {
        return addTextLines(disclaimerText, margins.left, currentY , { fontSize: PDF_STYLES.smallSize, color: PDF_COLORS.foreground, lineHeightFactor: 0.6 });
      }, PDF_COLORS.mutedForeground, undefined, "Disclaimer", PDF_COLORS.foreground, PDF_STYLES.h3Size);


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
                    <TableCell>{quiz.dateCompleted}</TableCell>
                    <TableCell>{quiz.score}</TableCell>
                    <TableCell className="text-right space-x-2">
                       <Button variant="outline" size="sm" asChild>
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
              Je hebt nog geen quizzen voltooid. Ga naar het <Link href="/quizzes" className="text-primary hover:underline">overzicht</Link> om te starten.
            </p>
          )}
        </CardContent>
      </Card>
       <Alert variant="destructive">
          <AlertTriangle className="h-5 w-5" />
          <AlertTitleUi className="font-semibold">Belangrijk: Geen Diagnose</AlertTitleUi>
          <AlertDescUi>
              De inzichten uit deze instrumenten zijn bedoeld voor zelfreflectie en educatie. Ze vervangen <strong className="font-bold">geen</strong> professioneel medisch of psychologisch advies, diagnose of behandeling.
              Raadpleeg altijd een gekwalificeerde zorgverlener voor persoonlijke begeleiding. Bezoek onze <Link href="/neurodiversiteit" className="text-primary hover:underline font-semibold">Neurodiversiteit pagina <ExternalLink className="inline h-4 w-4"/> </Link> voor meer informatie en bronnen.
          </AlertDescUi>
      </Alert>
    </div>
  );
}
