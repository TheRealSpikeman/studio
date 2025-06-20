
// src/app/for-parents/voorbeeld-analyse-rapport/page.tsx
"use client";

import React, { type ElementType, type ReactNode } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
    ArrowLeft,
    Users,
    Lightbulb,
    MessageCircle,
    ThumbsUp,
    EyeOff,
    ClipboardList,
    AlertTriangle,
    CheckSquare,
    Info,
    HeartHandshake,
    Download
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription as AlertDescUi, AlertTitle as AlertTitleUi } from "@/components/ui/alert";
import { useToast } from '@/hooks/use-toast';
import { jsPDF, type TextOptionsLight } from 'jspdf'; 
import { format } from 'date-fns'; 
import { nl } from 'date-fns/locale'; 


interface ReportSectionProps {
  title: string;
  Icon: ElementType;
  children: React.ReactNode;
  iconColorClass?: string;
}

const ReportSection: React.FC<ReportSectionProps> = ({ title, Icon, children, iconColorClass = "text-primary" }) => (
  <div className="mb-8">
    <h2 className={`text-2xl font-semibold text-foreground mb-4 flex items-center gap-3`}>
      <Icon className={`h-7 w-7 ${iconColorClass}`} />
      {title}
    </h2>
    <Card className="bg-muted/30 border shadow-sm">
      <CardContent className="p-6 text-base leading-relaxed text-foreground/90 space-y-3">
        {children}
      </CardContent>
    </Card>
  </div>
);

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
  primary: hslToRgb(25, 78, 52), // Oranje Hoofdkleur
  accent: hslToRgb(168, 76, 42), // Teal
  foreground: hslToRgb(210, 40, 10), 
  mutedForeground: hslToRgb(210, 20, 45), 
  background: hslToRgb(0, 0, 100), // White for PDF background
  card: hslToRgb(0,0,100), 
  border: hslToRgb(210, 10, 80), 
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
  },
  sectionPurple: {
    bg: hslToRgb(262, 85, 97),
    border: hslToRgb(262, 85, 55),
    text: hslToRgb(262, 40, 10),
    title: hslToRgb(262, 85, 45),
  },
  sectionDefault: {
    bg: hslToRgb(210, 17, 98), 
    border: hslToRgb(210, 10, 80), 
    text: hslToRgb(210, 20, 45),
    title: hslToRgb(210, 40, 10), 
  },
  orange: hslToRgb(25, 78, 52),
};

const PDF_STYLES = {
  fontFamily: "Helvetica",
  pageMargins: { top: 20, bottom: 20, left: 15, right: 15 },
  lineHeightFactor: 0.5,
  paragraphSpacing: 4,
  sectionSpacing: 10,
  cardPadding: 5,
  cardRadius: 3,
  titleSize: 20,
  h2Size: 16,
  h3Size: 14,
  normalSize: 10,
  smallSize: 8,
};

export default function VoorbeeldAnalyseRapportPage() {
  const childName = "Sofie"; 
  const parentName = "Olivia Ouder";
  const { toast } = useToast();

  const reportContent = {
    title: `Voorbeeldrapport: Vergelijkende Analyse`,
    subtitle: `Inzichten voor ${parentName} en ${childName}`,
    parentQuiz: `Ouder-quiz: "Ken je Kind" (ingevuld door ${parentName} op 19 juni 2025)`,
    childQuiz: `Kind-quiz: "Hoe zie ik mezelf?" (ingevuld door ${childName} op 20 juni 2025)`,
    sections: [
      {
        title: "1. Perceptie Gaten: Waar Zien Jullie Dingen Anders?",
        Icon: EyeOff,
        colorTheme: PDF_COLORS.sectionOrange,
        content: [
          "<strong>Focus op School:</strong> U geeft aan dat Sofie vaak moeite heeft met concentreren op schoolwerk. Sofie zelf ervaart dit minder als een probleem, en geeft aan dat het meer afhangt van de interesse in het vak. (Mogelijkheid: Verschil in definitie van 'focus' of observatiemomenten.)",
          "<strong>Sociale Interacties:</strong> U ziet Sofie als soms wat terughoudend in nieuwe groepen. Sofie beschrijft zichzelf als selectief in vriendschappen, maar comfortabel met de vrienden die ze heeft. (Mogelijkheid: Interpretatieverschil tussen introversie en verlegenheid.)",
          "<strong>Omgaan met Verandering:</strong> U merkt dat Sofie van slag raakt bij onverwachte veranderingen in de dagelijkse routine. Sofie geeft aan dat dit vooral geldt voor grote veranderingen (bijv. verhuizing school), maar kleine aanpassingen (bijv. ander avondeten) wel prima vindt. (Mogelijkheid: De impact van de verandering speelt een rol.)",
          "<strong>Energielevel na School:</strong> U observeert dat Sofie vaak moe is na school. Sofie geeft aan zich soms 'leeg' te voelen, maar ook momenten van energie te hebben voor leuke dingen. (Mogelijkheid: Het soort activiteit na school beïnvloedt haar energieniveau sterk.)"
        ]
      },
      {
        title: "2. Gedeelde Sterktes: Wat Zien Jullie Beiden Positief?",
        Icon: ThumbsUp,
        colorTheme: PDF_COLORS.sectionGreen,
        content: [
          "<strong>Creativiteit:</strong> Zowel u als Sofie benoemen haar creatieve talenten. U noemt haar tekenvaardigheid, Sofie haar vermogen om originele verhalen te bedenken. (Tip: Stimuleer dit door samen een 'creatief project van de week' te kiezen, of een speciaal notitieboek voor haar verhalen te geven.)",
          "<strong>Doorzettingsvermogen:</strong> U ziet dat Sofie kan doorzetten als ze iets echt wil (bijv. sport). Sofie is trots op het feit dat ze een moeilijk project voor school heeft afgemaakt. (Tip: Benoem en vier deze successen expliciet om dit te versterken.)",
          "<strong>Behulpzaamheid:</strong> U waardeert hoe Sofie helpt in huis (bijv. tafel dekken). Sofie geeft aan graag anderen te helpen en voelt zich goed als ze dat doet. (Tip: Geef haar verantwoordelijkheden die passen bij haar leeftijd en waarin ze haar behulpzaamheid kan tonen.)"
        ]
      },
       {
        title: "3. Blinde Vlekken: Wat Mist Mogelijk Eén Partij?",
        Icon: Lightbulb,
        colorTheme: PDF_COLORS.sectionYellow,
        content: [
          "<strong>Impact van Sensorische Prikkels (Kind Ziet, Ouder Minder):</strong> Sofie geeft aan soms overprikkeld te raken door geluid en drukte in de klas, iets wat u mogelijk minder direct opmerkt thuis. (Reflectiepunt voor ouder: Observeer Sofie's reactie in drukke omgevingen buitenshuis en bespreek of ze strategieën nodig heeft om hiermee om te gaan, zoals het gebruik van een koptelefoon.)",
          "<strong>Behoefte aan Externe Validatie (Ouder Ziet, Kind Minder):</strong> U geeft aan dat Sofie soms onzeker kan zijn en bevestiging zoekt. Sofie zelf noemt dit niet direct als een groot punt in haar zelfreflectie, maar focust meer op haar prestaties. (Reflectiepunt voor ouder: Sofie is zich mogelijk niet bewust van hoe haar zoektocht naar validatie overkomt, of het is een normale ontwikkelingsfase. Blijf haar aanmoedigen en geef opbouwende feedback op haar proces, niet alleen het resultaat.)"
        ]
      },
      {
        title: "4. Communicatie Kansen: Hoe Beter Afstemmen?",
        Icon: MessageCircle,
        colorTheme: PDF_COLORS.sectionBlue,
        content: [
          "Praat met Sofie over het verschil in beleving rondom 'focus op school'. Vraag: \"Sofie, ik merk soms dat je het lastig vindt met schoolwerk. Hoe ervaar jij dat? Wat helpt jou om je aandacht erbij te houden? En wanneer vind je het écht moeilijk?\"",
          "Erken haar selectiviteit in vriendschappen. Een goede gespreksopener kan zijn: \"Ik zie dat je het fijn hebt met [naam vriend/vriendin]. Wat vind je zo leuk aan hem/haar? En wat voor soort dingen vind je belangrijk in een vriendschap?\"",
          "Bespreek samen hoe jullie kunnen omgaan met 'overprikkeling'. Vraag: \"Zijn er momenten (bijvoorbeeld op school of een feestje) dat het allemaal even te veel voor je is? Wat voel je dan? En wat zou jou op zo'n moment helpen?\"",
          "Geef specifieke complimenten over haar doorzettingsvermogen en creativiteit. In plaats van \"Goed gedaan\", zeg: \"Ik heb gezien hoe hard je aan dat project hebt gewerkt, ook toen het even moeilijk was. Knap dat je hebt doorgezet!\" of \"Wat een origineel idee voor dat verhaal, hoe ben je daarop gekomen?\""
        ]
      },
      {
        title: "5. Familie Actieplan: Concreet & Haalbaar",
        Icon: ClipboardList,
        colorTheme: PDF_COLORS.sectionPurple,
        content: [
          "<strong>Actie: \"Wekelijks Creatief Uurtje\"</strong> - Blok wekelijks een 'Creatief Uurtje' in de agenda voor Sofie (en eventueel samen). Bespreek vooraf wat ze wil doen (tekenen, schrijven, knutselen). Zorg voor de benodigde materialen.",
          "<strong>Actie: \"Focus Plan Samen Maken\"</strong> - Maak samen met Sofie een visueel 'Focus Plan' voor de week (bijv. op een whiteboard). Identificeer 'focus-taken' (huiswerk, leren) en 'rust-taken' (hobby, ontspanning) en plan deze afwisselend in, inclusief korte pauzes (Pomodoro-techniek).",
          "<strong>Actie: \"Prikkel Thermometer\" Introduceren</strong> - Ontwerp samen met Sofie een 'Prikkel Thermometer' (bijv. met kleuren groen-oranje-rood). Bespreek wat elke kleur betekent (groen=ok, oranje=het wordt te veel, rood=overprikkeld) en welke actie Sofie (of u) kan ondernemen als ze zich in oranje of rood voelt (bijv. even rust, koptelefoon op, hulp vragen)."
        ]
      },
       {
        title: "6. Belangrijke Overwegingen",
        Icon: Info,
        colorTheme: PDF_COLORS.sectionDefault,
        content: [
          "Dit rapport is een momentopname en bedoeld als startpunt voor gesprek en begrip. Het is geen diagnostisch instrument.",
          "De perspectieven van zowel u als Sofie zijn waardevol. Er is geen 'goed' of 'fout' in hoe jullie dingen ervaren.",
          "Blijf open communiceren en observeer hoe Sofie zich ontwikkelt. Pas strategieën en het actieplan aan waar nodig, in overleg met haar.",
          "Overweeg professionele begeleiding als u zich zorgen blijft maken of als specifieke uitdagingen aanhouden. MindNavigator kan u helpen een passende coach of tutor te vinden die ervaring heeft met de thema's die voor Sofie spelen."
        ]
      },
    ],
    disclaimer: "De inhoud van dit rapport is fictief en dient puur ter illustratie van de structuur en het soort inzichten dat u kunt verwachten van de Vergelijkende Analyse. Echte rapporten worden gegenereerd op basis van de daadwerkelijk ingevulde quizzen."
  };

 const handlePdfDownloadClick = () => {
    try {
      const doc = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' });
      const pageHeight = doc.internal.pageSize.height;
      const pageWidth = doc.internal.pageSize.width;
      const margins = PDF_STYLES.pageMargins;
      const usableWidth = pageWidth - margins.left - margins.right;
      let y = margins.top;

      const addTextWithFormatting = (text: string, x: number, currentY: number, options: TextOptionsLight & { color?: [number, number, number], fontSize?: number, fontStyle?: string, maxWidth?: number } = {}) => {
        const fontSize = options.fontSize || PDF_STYLES.normalSize;
        const lineHeight = fontSize * PDF_STYLES.lineHeightFactor;
        doc.setFont(PDF_STYLES.fontFamily, options.fontStyle || "normal");
        doc.setFontSize(fontSize);
        if (options.color) doc.setTextColor(options.color[0], options.color[1], options.color[2]);
        
        const plainTextForSplitting = text.replace(/<strong>(.*?)<\/strong>/gi, '%%BOLD_START%%$1%%BOLD_END%%').replace(/<em>(.*?)<\/em>/gi, '%%ITALIC_START%%$1%%ITALIC_END%%').replace(/<span.*?>.*?<\/span>/gi, '').replace(/<br\s*\/?>/gi, '\n');
        const lines = doc.splitTextToSize(plainTextForSplitting, options.maxWidth || usableWidth);

        lines.forEach((line: string) => {
          if (currentY + lineHeight > pageHeight - margins.bottom) { doc.addPage(); currentY = margins.top; }
          let currentX = x;
          const segments = line.split(/(%%BOLD_START%%|%%BOLD_END%%|%%ITALIC_START%%|%%ITALIC_END%%)/g);
          
          segments.forEach(segment => {
            if (segment === '%%BOLD_START%%') doc.setFont(undefined, 'bold');
            else if (segment === '%%BOLD_END%%') doc.setFont(undefined, 'normal');
            else if (segment === '%%ITALIC_START%%') doc.setFont(undefined, 'italic');
            else if (segment === '%%ITALIC_END%%') doc.setFont(undefined, 'normal');
            else if (segment) { doc.text(segment, currentX, currentY); currentX += doc.getStringUnitWidth(segment) * fontSize / doc.internal.scaleFactor; }
          });
          currentY += lineHeight;
        });
        doc.setFont(PDF_STYLES.fontFamily, "normal");
        doc.setTextColor(PDF_COLORS.foreground[0], PDF_COLORS.foreground[1], PDF_COLORS.foreground[2]);
        return currentY;
      };

      const drawSectionCard = (currentY: number, sectionData: typeof reportContent.sections[0]) => {
          let cardContentY = currentY + PDF_STYLES.cardPadding;
          let cardContentHeight = 0;
          
          const titleHeight = (doc.setFont(undefined, "bold").setFontSize(PDF_STYLES.h2Size).getTextDimensions(sectionData.title, { maxWidth: usableWidth - (PDF_STYLES.cardPadding * 2) }).h) + PDF_STYLES.paragraphSpacing;
          
          let listHeight = 0;
          sectionData.content.forEach(item => {
              const textDimensions = doc.setFont(undefined, "normal").setFontSize(PDF_STYLES.normalSize).getTextDimensions(item.replace(/<[^>]*>/g, ''), { maxWidth: usableWidth - (PDF_STYLES.cardPadding * 2) - 5});
              listHeight += textDimensions.h + PDF_STYLES.paragraphSpacing;
          });
          
          cardContentHeight = titleHeight + listHeight;
          const cardTotalHeight = cardContentHeight + (PDF_STYLES.cardPadding * 2);

          if (currentY + cardTotalHeight > pageHeight - margins.bottom) {
              doc.addPage();
              currentY = margins.top;
              cardContentY = currentY + PDF_STYLES.cardPadding;
          }
          
          doc.setFillColor(sectionData.colorTheme.bg[0], sectionData.colorTheme.bg[1], sectionData.colorTheme.bg[2]);
          doc.roundedRect(margins.left, currentY, usableWidth, cardTotalHeight, PDF_STYLES.cardRadius, PDF_STYLES.cardRadius, 'F');
          
          let textY = cardContentY;
          textY = addTextWithFormatting(sectionData.title, margins.left + PDF_STYLES.cardPadding, textY, { fontSize: PDF_STYLES.h2Size, fontStyle: 'bold', color: sectionData.colorTheme.title, maxWidth: usableWidth - (PDF_STYLES.cardPadding * 2) });
          textY += PDF_STYLES.paragraphSpacing / 2;

          sectionData.content.forEach(item => {
              doc.setFillColor(sectionData.colorTheme.border[0], sectionData.colorTheme.border[1], sectionData.colorTheme.border[2]);
              doc.circle(margins.left + PDF_STYLES.cardPadding + 2, textY, 1, 'F');
              textY = addTextWithFormatting(item, margins.left + PDF_STYLES.cardPadding + 5, textY, { color: sectionData.colorTheme.text, lineHeightFactor: 0.5, maxWidth: usableWidth - (PDF_STYLES.cardPadding * 2) - 5 });
              textY += PDF_STYLES.paragraphSpacing / 2;
          });
          
          return currentY + cardTotalHeight + PDF_STYLES.sectionSpacing;
      };

      // Start building PDF
      y = addTextWithFormatting(reportContent.title, margins.left, y, { fontSize: PDF_STYLES.titleSize, fontStyle: 'bold', color: PDF_COLORS.primary, lineHeightFactor: 0.6 });
      y = addTextWithFormatting(reportContent.subtitle, margins.left, y, { fontSize: PDF_STYLES.h3Size, color: PDF_COLORS.mutedForeground, lineHeightFactor: 0.5 });
      y += PDF_STYLES.paragraphSpacing;
      
      doc.setFont(undefined, 'normal');
      y = addTextWithFormatting(`Gebaseerd op:`, margins.left, y, { fontSize: PDF_STYLES.normalSize, fontStyle: 'italic', color: PDF_COLORS.mutedForeground, lineHeightFactor: 0.5 });
      y = addTextWithFormatting(`- ${reportContent.parentQuiz}`, margins.left + 2, y, { fontSize: PDF_STYLES.smallSize, color: PDF_COLORS.mutedForeground, lineHeightFactor: 0.5 });
      y = addTextWithFormatting(`- ${reportContent.childQuiz}`, margins.left + 2, y, { fontSize: PDF_STYLES.smallSize, color: PDF_COLORS.mutedForeground, lineHeightFactor: 0.5 });
      y = addTextWithFormatting(`Rapport gegenereerd op: ${format(new Date(), 'PPPp', { locale: nl })}`, margins.left, y, { fontSize: PDF_STYLES.smallSize, color: PDF_COLORS.mutedForeground, lineHeightFactor: 0.5 });
      y += PDF_STYLES.sectionSpacing;
      
      reportContent.sections.forEach(section => {
          y = drawSectionCard(y, section);
      });
      
      const fileName = `vergelijkende_analyse_${childName.toLowerCase().replace(' ', '_')}.pdf`;
      doc.save(fileName);

      toast({
        title: "Rapport Gedownload (als PDF)",
        description: `Het voorbeeldrapport is gedownload als ${fileName}.`,
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
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-gradient-to-b from-background via-secondary/5 to-background py-12 md:py-16 lg:py-20">
        <div className="container mx-auto max-w-3xl">
          <div className="flex justify-between items-center mb-6">
            <Button variant="outline" asChild>
              <Link href="/for-parents/vergelijkende-analyse">
                <ArrowLeft className="mr-2 h-4 w-4" /> Terug naar uitleg
              </Link>
            </Button>
            <Button onClick={handlePdfDownloadClick}>
              <Download className="mr-2 h-4 w-4" /> Download als PDF
            </Button>
          </div>

          <Card className="shadow-xl">
            <CardHeader className="text-center pb-8">
              <HeartHandshake className="mx-auto h-16 w-16 text-primary mb-4" />
              <CardTitle className="text-3xl font-bold text-foreground">
                {reportContent.title}
              </CardTitle>
              <CardDescription className="text-lg text-muted-foreground mt-2">
                {reportContent.subtitle}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-muted/50 p-4 rounded-md border text-sm text-center">
                 <p><strong>Gebaseerd op:</strong></p>
                 <p>{reportContent.parentQuiz}</p>
                 <p>{reportContent.childQuiz}</p>
              </div>
              {reportContent.sections.map((section, index) => (
                <React.Fragment key={index}>
                  <ReportSection title={section.title} Icon={section.Icon} iconColorClass={section.iconColorClass}>
                    <ul className="list-none space-y-3 pl-0">
                      {section.content.map((item, itemIndex) => (
                        <li key={itemIndex} dangerouslySetInnerHTML={{ __html: `• ${item}` }} className="leading-relaxed"></li>
                      ))}
                    </ul>
                  </ReportSection>
                  {index < reportContent.sections.length -1 && <Separator />}
                </React.Fragment>
              ))}

              <Alert variant="default" className="mt-8 bg-primary/5 border-primary/20">
                  <AlertTriangle className="h-5 w-5 !text-primary" />
                  <AlertTitleUi className="font-semibold text-accent">Let op: Voorbeeld Data</AlertTitleUi>
                  <AlertDescUi className="text-foreground/80">
                    {reportContent.disclaimer}
                  </AlertDescUi>
              </Alert>

            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
