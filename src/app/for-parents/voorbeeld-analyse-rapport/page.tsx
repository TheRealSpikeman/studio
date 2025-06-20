// src/app/for-parents/voorbeeld-analyse-rapport/page.tsx
"use client";

import React, { type ElementType } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
    ArrowLeft, Download, Bot, Target, ThumbsUp, EyeOff, MessageCircle, ClipboardList
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { jsPDF, TextOptionsLight } from 'jspdf';
import { format } from 'date-fns';
import { nl } from 'date-fns/locale';
import { PDFThemeProvider, usePDFTheme, type PDFTheme } from '@/contexts/PDFThemeContext';

interface ReportItem {
  title?: string;
  text: string;
  isKans?: boolean;
  isTip?: boolean;
  details?: Record<string, string>;
}

interface ReportSectionData {
  id: string;
  title: string;
  Icon: string; // Emoji
  items: ReportItem[];
}

// New, structured data as requested
const reportContent = {
  title: "Vergelijkende Analyse",
  subtitle: "Inzichten voor Olivia Ouder en Sofie",
  intro: "Dit rapport is zorgvuldig samengesteld om u als ouder inzicht te geven in de overeenkomsten en verschillen tussen uw perspectief en de zelfreflectie van uw kind. Onze AI heeft de antwoorden op circa 15-20 vragen per persoon geanalyseerd om patronen te herkennen, zonder individuele responses te beoordelen als 'goed' of 'fout'. Het doel is om een brug te slaan, communicatie te bevorderen en concrete, gezamenlijke actiepunten te formuleren die bijdragen aan het welzijn en de ontwikkeling van Sofie.",
  basedOn: [
    `Ouder-quiz: "Ken je Kind" (ingevuld door Olivia Ouder op 18-06-2025 om 20:15)`,
    `Kind-quiz: "Hoe zie ik mezelf?" (ingevuld door Sofie op 19-06-2025 om 16:30)`
  ],
  generatedAt: `Rapport gegenereerd via www.mindnavigator.io op: ${format(new Date('2025-06-20T20:50:00'), 'd MMMM yyyy \'om\' HH:mm', { locale: nl })}`,
  sections: [
    {
      id: 'gaps',
      title: "1. Perceptie Gaten: Waar Zien Jullie Dingen Anders?",
      Icon: "🎯",
      items: [
        { title: "Focus op School", text: "U geeft aan dat Sofie vaak moeite heeft met concentreren op schoolwerk. Sofie zelf ervaart dit minder als een algemeen probleem, en geeft aan dat het meer afhangt van de interesse in het vak; wiskunde kost haar bijvoorbeeld meer energie dan creatieve vakken, vooral tijdens huiswerk tussen 16:00-18:00." },
        { title: "Sociale Interacties", text: "U ziet Sofie als soms wat terughoudend in nieuwe groepen. Sofie beschrijft zichzelf als selectief in vriendschappen, maar comfortabel met de vrienden die ze heeft." },
      ]
    },
    {
      id: 'strengths',
      title: "2. Gedeelde Sterktes: Waar Jullie Het Eens Zijn",
      Icon: "💪",
      items: [
        { title: "Creativiteit", text: "Zowel u als Sofie benoemen haar creatieve talenten. U noemt haar tekenvaardigheid, Sofie haar vermogen om originele verhalen te bedenken. Dit is een krachtig, gedeeld fundament om op voort te bouwen en haar zelfvertrouwen te versterken." },
        { title: "Doorzettingsvermogen", text: "U ziet dat Sofie kan doorzetten als ze iets echt wil (bijv. sport). Sofie is trots op het feit dat ze een moeilijk project voor school heeft afgemaakt. Het erkennen van doorzettingsvermogen helpt haar om toekomstige uitdagingen met meer veerkracht aan te gaan." },
      ]
    },
    {
      id: 'blind-spots',
      title: "3. Blinde Vlekken: Wat Ziet De Een (Nog) Niet?",
      Icon: "👁️",
      items: [
        { title: "Ouder ziet, Kind (nog) niet", text: "U maakt zich zorgen over Sofie's slaappatroon en merkt op dat ze vaak tot laat op is. Sofie zelf geeft aan hier geen problemen mee te ervaren.", isKans: true },
        { title: "Kind ziet, Ouder (nog) niet", text: "Sofie geeft aan soms overprikkeld te raken door geluid en drukte. Dit is een blinde vlek voor u, omdat u dit thuis minder observeert.", isKans: true },
      ]
    },
    {
      id: 'communication',
      title: "4. Communicatie Kansen: Hoe Beter Afstemmen?",
      Icon: "💬",
      items: [
        { text: "Vraag door op Sofie's ervaring met 'focus'.", isTip: true },
        { text: "Erken haar perspectief op vriendschap.", isTip: true },
      ]
    },
    {
      id: 'action-plan',
      title: "5. Familie Actieplan: Concreet & Haalbaar",
      Icon: "📋",
      items: [
        { title: "Wekelijks Creatief Uurtje", details: { "📅 Wanneer": "Zaterdag 10:00-11:00", "👤 Verantwoordelijk": "Sofie kiest, ouder faciliteert" } },
        { title: "Focus Plan Maken", details: { "🎯 Wat": "Pomodoro blokken van 25 minuten", "📍 Waar": "Keukentafel of studeerkamer" } },
        { title: "Prikkel Thermometer", details: { "💡 Hoe": "Maak een groen-oranje-rood thermometer voor op de koelkast. Sofie kan aangeven hoe 'vol' haar hoofd zit als startpunt voor een gesprek."} },
      ]
    },
    {
      id: 'disclaimer',
      title: "Disclaimer",
      Icon: "⚠️",
      items: [
        { text: "Dit rapport is gebaseerd op de antwoorden die zijn gegeven en dient ter indicatie en zelfreflectie. Het is nadrukkelijk geen vervanging voor een professionele diagnose of medisch advies. Raadpleeg een gekwalificeerde zorgverlener voor een formele diagnose of behandeling." }
      ]
    },
  ] as ReportSectionData[],
};


function VoorbeeldAnalyseRapportPageContent() {
  const { toast } = useToast();
  const theme = usePDFTheme();

  const handlePdfDownloadClick = () => {
    try {
      const doc = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' });
      const { colors, styles } = theme;
      const pageHeight = doc.internal.pageSize.height;
      const pageWidth = doc.internal.pageSize.width;
      const margins = styles.pageMargins;
      const usableWidth = pageWidth - margins.left - margins.right;
      let y = margins.top;
      let pageNumber = 1;

      // --- PDF HELPER FUNCTIONS (STABLE IMPLEMENTATION) ---

      const checkPageBreak = (neededHeight: number) => {
        if (y + neededHeight > pageHeight - margins.bottom) {
          drawFooter();
          doc.addPage();
          pageNumber++;
          y = margins.top;
          drawFooter();
          return true;
        }
        return false;
      };

      const drawFooter = () => {
        doc.setFontSize(styles.smallSize);
        doc.setTextColor(...colors.mutedForeground);
        const footerText = `Gegenereerd door MindNavigator | www.mindnavigator.io | Pagina ${pageNumber}`;
        doc.text(footerText, pageWidth / 2, pageHeight - (margins.bottom / 2), { align: 'center' });
      };

      const drawFormattedText = (text: string, x: number, currentY: number, options: any = {}) => {
        const { fontSize = styles.normalSize, color = colors.foreground, maxWidth = usableWidth, fontStyle = 'normal' } = options;
        const lineHeight = fontSize * styles.lineHeightFactor * 0.352778; // pt to mm
        doc.setFont(styles.fontFamily, fontStyle);
        doc.setFontSize(fontSize);
        doc.setTextColor(...color);

        const lines = doc.splitTextToSize(text, maxWidth);
        lines.forEach((line: string, index: number) => {
          if (checkPageBreak(lineHeight) && index > 0) {
            currentY = y; // Update y to new page's top margin
          }
          doc.text(line, x, currentY);
          currentY += lineHeight;
        });
        
        doc.setFont(styles.fontFamily, 'normal'); // Reset font
        return currentY;
      };
      
      // Function to calculate text height without drawing it
      const calculateTextHeight = (text: string, options: any = {}) => {
          const { fontSize = styles.normalSize, maxWidth = usableWidth, fontStyle = 'normal' } = options;
          const lineHeight = fontSize * styles.lineHeightFactor * 0.352778;
          doc.setFont(styles.fontFamily, fontStyle);
          doc.setFontSize(fontSize);
          const lines = doc.splitTextToSize(text, maxWidth);
          return lines.length * lineHeight;
      };


      // --- PDF GENERATION START ---
      drawFooter();

      // Title
      y = drawFormattedText(reportContent.title, pageWidth / 2, y, { fontSize: styles.titleSize, fontStyle: 'bold', color: colors.primary, align: 'center' });
      y = drawFormattedText(reportContent.subtitle, pageWidth / 2, y, { fontSize: styles.subtitleSize, color: colors.mutedForeground, align: 'center' });
      y += styles.sectionSpacing;

      // Intro
      y = drawFormattedText(reportContent.intro, margins.left, y, { color: colors.mutedForeground });
      y += styles.paragraphSpacing;

      // Based on...
      reportContent.basedOn.forEach(line => {
          y = drawFormattedText(`• ${line}`, margins.left, y, { fontSize: styles.smallSize, color: colors.mutedForeground });
      });
      y = drawFormattedText(reportContent.generatedAt, margins.left, y, { fontSize: styles.smallSize, color: colors.mutedForeground, fontStyle: 'italic' });
      y += styles.sectionSpacing;


      // Dynamic sections
      reportContent.sections.forEach(section => {
        let sectionHeight = calculateTextHeight(section.title, { fontSize: styles.h2Size, fontStyle: 'bold', maxWidth: usableWidth - 15 }) + styles.padding * 2;
        
        section.items.forEach(item => {
          if (item.title) {
            sectionHeight += calculateTextHeight(item.title, { fontSize: styles.h3Size, fontStyle: 'bold' });
          }
          sectionHeight += calculateTextHeight(item.text, { fontSize: styles.normalSize });
          if(item.details) {
             Object.entries(item.details).forEach(([key, value]) => {
                sectionHeight += calculateTextHeight(`${key}: ${value}`, {fontSize: styles.normalSize - 1, fontStyle: 'italic'});
            });
          }
          sectionHeight += styles.paragraphSpacing;
        });

        checkPageBreak(sectionHeight);

        // Draw section card
        let cardBg = colors.cardBg;
        let cardBorder = colors.border;
        if(section.id === 'disclaimer') cardBg = colors.gray.bg;
        if(section.id === 'action-plan') cardBg = colors.sectionBlue.bg;

        doc.setFillColor(...cardBg);
        doc.setDrawColor(...cardBorder);
        doc.roundedRect(margins.left, y, usableWidth, sectionHeight, styles.cornerRadius, styles.cornerRadius, 'FD');
        let contentY = y + styles.padding;

        // Draw header with icon
        const headerText = `${section.Icon} ${section.title}`;
        contentY = drawFormattedText(headerText, margins.left + styles.padding, contentY, { fontSize: styles.h2Size, fontStyle: 'bold', color: colors.primary });
        contentY += styles.paragraphSpacing / 2;

        // Draw items
        section.items.forEach(item => {
          if (item.isKans) {
              const boxText = `[KANS] ${item.title}: ${item.text}`;
              const boxHeight = calculateTextHeight(boxText, {fontSize: styles.normalSize -1, maxWidth: usableWidth - styles.padding * 3}) + styles.padding / 1.5;
              doc.setFillColor(...colors.yellow.bg);
              doc.roundedRect(margins.left + styles.padding, contentY, usableWidth - styles.padding*2, boxHeight, styles.cornerRadius, styles.cornerRadius, 'F');
              contentY = drawFormattedText(boxText, margins.left + styles.padding * 1.5, contentY + styles.padding / 2, {fontSize: styles.normalSize-1, color: colors.yellow.title, fontStyle: 'italic', maxWidth: usableWidth - styles.padding * 3});
          } else if (item.isTip) {
              const boxText = `[Communicatie Tip] ${item.text}`;
              const boxHeight = calculateTextHeight(boxText, {fontSize: styles.normalSize -1, maxWidth: usableWidth - styles.padding * 3}) + styles.padding / 1.5;
              doc.setFillColor(...colors.sectionGreen.bg);
              doc.roundedRect(margins.left + styles.padding, contentY, usableWidth - styles.padding*2, boxHeight, styles.cornerRadius, styles.cornerRadius, 'F');
              contentY = drawFormattedText(boxText, margins.left + styles.padding * 1.5, contentY + styles.padding / 2, {fontSize: styles.normalSize-1, color: colors.sectionGreen.title, fontStyle: 'italic', maxWidth: usableWidth - styles.padding * 3});
          } else if (item.details) { // Action plan item
             const checkY = contentY + 1;
             doc.setDrawColor(0,0,0);
             doc.rect(margins.left + styles.padding, checkY - 2, 3, 3, 'S'); // Checkbox
             let itemContentX = margins.left + styles.padding + 5;
             contentY = drawFormattedText(item.title || "", itemContentX, contentY, {fontSize: styles.h3Size, fontStyle: 'bold'});
             Object.entries(item.details).forEach(([key, value]) => {
                contentY = drawFormattedText(`${key}: ${value}`, itemContentX + 2, contentY, {fontSize: styles.normalSize - 1, color: colors.mutedForeground, fontStyle:'italic'});
            });
          } else { // Standard item
            if (item.title) {
              contentY = drawFormattedText(`• ${item.title}`, margins.left + styles.padding, contentY, { fontStyle: 'bold' });
            }
            contentY = drawFormattedText(item.text, margins.left + styles.padding + (item.title ? 2 : 5), contentY, { color: colors.mutedForeground });
          }
          contentY += styles.paragraphSpacing;
        });

        y += sectionHeight + styles.sectionSpacing;
      });

      const fileName = `vergelijkende_analyse_${reportContent.subtitle.split(' ')[2].toLowerCase()}.pdf`;
      doc.save(fileName);
      toast({ title: "Rapport Gedownload", description: `Het rapport is gedownload als ${fileName}.` });
    } catch (error) {
      console.error("PDF Downloadfout:", error);
      toast({ title: "PDF Download Mislukt", description: `Er is een fout opgetreden: ${error instanceof Error ? error.message : String(error)}`, variant: "destructive" });
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
              <Bot className="mx-auto h-16 w-16 text-primary mb-4" />
              <CardTitle className="text-3xl font-bold text-foreground">
                {reportContent.title}
              </CardTitle>
              <CardDescription className="text-lg text-muted-foreground mt-2">
                {reportContent.subtitle}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-muted/50 p-4 rounded-md border text-sm text-center">
                <p className="font-semibold text-foreground mb-2">Dit rapport is gebaseerd op:</p>
                 <ul className="list-none">
                    {reportContent.basedOn.map((line, i) => <li key={i}>{line}</li>)}
                </ul>
                 <p className="mt-2 text-xs">{reportContent.generatedAt}</p>
              </div>
              {reportContent.sections.map((section) => (
                 <div key={section.id} className="mb-8">
                    <h2 className={`text-2xl font-semibold mb-4 flex items-center gap-3 ${section.id === 'disclaimer' ? 'text-destructive' : 'text-primary'}`}>
                      {section.Icon}
                      {section.title}
                    </h2>
                    <Card className="bg-muted/30 border shadow-sm">
                      <CardContent className="p-6 text-base leading-relaxed text-foreground/90 space-y-4">
                        {section.items.map((item, itemIndex) => (
                           <div key={itemIndex}>
                            {item.title && <strong className="font-semibold text-foreground/90 block mb-1">{item.title}</strong>}
                            <div className="text-muted-foreground" dangerouslySetInnerHTML={{ __html: (item.text || "")?.replace(/\n/g, '<br/>') }} />
                            {item.details && (
                               <div className="mt-2 pl-4 border-l-2 border-primary/30 space-y-1">
                                 {Object.entries(item.details).map(([key, value]) => (
                                   <p key={key} className="text-sm"><strong className="font-medium text-foreground/80">{key}:</strong> {value}</p>
                                 ))}
                               </div>
                            )}
                        </div>
                        ))}
                      </CardContent>
                    </Card>
                  </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default function VoorbeeldAnalyseRapportPageWrapper() {
  return (
    <PDFThemeProvider>
      <VoorbeeldAnalyseRapportPageContent />
    </PDFThemeProvider>
  );
}
