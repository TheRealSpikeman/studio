
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
  primary: hslToRgb(25, 78, 52), // Orange Primary from globals.css
  foreground: hslToRgb(210, 40, 10), 
  mutedForeground: hslToRgb(210, 20, 45), 
  cardBg: hslToRgb(39, 100, 97), // Light yellow/beige for the card background
  sectionOrange: {
    bg: hslToRgb(39, 100, 97), // Section 1 background
    title: hslToRgb(25, 78, 52), // Section 1 title color
    bullet: hslToRgb(25, 78, 52), // Section 1 bullet color
    text: hslToRgb(39, 40, 10), // Section 1 text color
  },
  sectionGreen: {
    bg: hslToRgb(120, 60, 95), 
    title: hslToRgb(145, 63, 32),
    bullet: hslToRgb(145, 63, 42), 
    text: hslToRgb(120, 40, 10),
  },
  sectionYellow: { 
    bg: hslToRgb(50, 100, 97),
    title: hslToRgb(45, 100, 40),
    bullet: hslToRgb(45, 100, 50),
    text: hslToRgb(50, 40, 10),
  },
  sectionBlue: {
    bg: hslToRgb(210, 100, 98), 
    title: hslToRgb(207, 90, 44), 
    bullet: hslToRgb(207, 90, 54),
    text: hslToRgb(210, 40, 10), 
  },
  sectionPurple: {
    bg: hslToRgb(262, 85, 97),
    title: hslToRgb(262, 85, 45),
    bullet: hslToRgb(262, 85, 55),
    text: hslToRgb(262, 40, 10),
  },
  sectionDefault: {
    bg: hslToRgb(210, 17, 98), 
    title: hslToRgb(210, 40, 10), 
    bullet: hslToRgb(210, 20, 45),
    text: hslToRgb(210, 20, 45),
  },
};

const PDF_STYLES = {
  fontFamily: "Helvetica",
  pageMargins: { top: 20, bottom: 20, left: 20, right: 20 },
  lineHeightFactor: 0.5,
  paragraphSpacing: 4,
  sectionSpacing: 10,
  cardPaddingX: 8,
  cardPaddingY: 10, // Increased for more vertical space
  cardRadius: 3,
  titleSize: 22,
  subtitleSize: 14,
  h2Size: 16,
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
    intro: `Dit rapport is zorgvuldig samengesteld om u als ouder inzicht te geven in de overeenkomsten en verschillen tussen uw perspectief en de zelfreflectie van uw kind. Het is gebaseerd op twee afzonderlijk ingevulde vragenlijsten (elk ca. 15-20 vragen). Onze AI heeft deze antwoorden geanalyseerd om patronen te herkennen, zonder de individuele antwoorden te beoordelen als 'goed' of 'fout'. Het doel is om een brug te slaan, communicatie te bevorderen en concrete, gezamenlijke actiepunten te formuleren die bijdragen aan het welzijn en de ontwikkeling van ${childName}.`,
    basedOn: [
        `Ouder-quiz: "Ken je Kind" (ingevuld door ${parentName} op 19 juni 2025)`,
        `Kind-quiz: "Hoe zie ik mezelf?" (ingevuld door ${childName} op 20 juni 2025)`
    ],
    generatedAt: `Rapport gegenereerd op: ${format(new Date('2025-06-20T20:50:00'), 'd MMMM yyyy \'om\' HH:mm', { locale: nl })}`,
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
          "<strong>Creativiteit:</strong> Zowel u als Sofie benoemen haar creatieve talenten. U noemt haar tekenvaardigheid, Sofie haar vermogen om originele verhalen te bedenken. (Tip: Stimuleer dit door samen een 'creatief project van de week' te kiezen.)",
          "<strong>Doorzettingsvermogen:</strong> U ziet dat Sofie kan doorzetten als ze iets echt wil (bijv. sport). Sofie is trots op het feit dat ze een moeilijk project voor school heeft afgemaakt. (Tip: Benoem en vier deze successen expliciet.)",
          "<strong>Behulpzaamheid:</strong> U waardeert hoe Sofie helpt in huis. Sofie geeft aan graag anderen te helpen en voelt zich goed als ze dat doet. (Tip: Geef haar verantwoordelijkheden die passen bij haar leeftijd.)"
        ]
      },
       {
        title: "3. Blinde Vlekken: Wat Mist Mogelijk Eén Partij?",
        Icon: Lightbulb,
        colorTheme: PDF_COLORS.sectionYellow,
        content: [
          "<strong>Impact van Prikkels:</strong> Sofie geeft aan soms overprikkeld te raken door geluid en drukte, iets wat u mogelijk minder direct opmerkt thuis. (Reflectiepunt: Observeer Sofie's reactie in drukke omgevingen en bespreek of ze strategieën nodig heeft, zoals een koptelefoon.)",
          "<strong>Behoefte aan Validatie:</strong> U geeft aan dat Sofie soms onzeker kan zijn. Sofie zelf noemt dit niet direct. (Reflectiepunt: Geef complimenten gericht op het proces, niet alleen het resultaat, om haar zelfvertrouwen te versterken.)"
        ]
      },
      {
        title: "4. Communicatie Kansen: Hoe Beter Afstemmen?",
        Icon: MessageCircle,
        colorTheme: PDF_COLORS.sectionBlue,
        content: [
          "Vraag door op Sofie's ervaring met 'focus': \"Hoe voelt 'focus' voor jou? Wat helpt je om je aandacht erbij te houden?\"",
          "Erken haar perspectief op vriendschap: \"Ik zie dat je het fijn hebt met je vrienden. Wat vind je belangrijk in een vriendschap?\"",
          "Geef specifieke complimenten: \"Wat knap hoe je dat moeilijke project hebt doorgezet, ook toen het even niet lukte!\""
        ]
      },
      {
        title: "5. Familie Actieplan: Concreet & Haalbaar",
        Icon: ClipboardList,
        colorTheme: PDF_COLORS.sectionPurple,
        content: [
          "<strong>Wekelijks Creatief Uurtje:</strong> Plan elke week een vast moment voor een creatieve activiteit die Sofie kiest.",
          "<strong>Focus Plan Maken:</strong> Maak samen een visueel plan voor huiswerk, met duidelijke blokken voor focus en pauze (Pomodoro-techniek).",
          "<strong>Prikkel Thermometer:</strong> Introduceer een 'prikkel-thermometer' (groen-oranje-rood) om te bespreken wanneer het te druk wordt en wat dan helpt."
        ]
      },
       {
        title: "Disclaimer",
        Icon: AlertTriangle,
        colorTheme: PDF_COLORS.sectionDefault,
        content: [
          "Dit rapport is gebaseerd op de antwoorden die zijn gegeven en dient ter indicatie en zelfreflectie. Het is nadrukkelijk geen vervanging voor een professionele diagnose of medisch advies. Raadpleeg een gekwalificeerde zorgverlener voor een formele diagnose of behandeling."
        ]
      },
    ]
  };

  const handlePdfDownloadClick = () => {
    try {
      const doc = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' });
      const pageHeight = doc.internal.pageSize.height;
      const pageWidth = doc.internal.pageSize.width;
      const margins = PDF_STYLES.pageMargins;
      const usableWidth = pageWidth - margins.left - margins.right;
      let y = margins.top;

      const addPageFooter = () => {
          const pageCount = doc.internal.getNumberOfPages();
          for (let i = 1; i <= pageCount; i++) {
              doc.setPage(i);
              doc.setFont(PDF_STYLES.fontFamily, "italic");
              doc.setFontSize(PDF_STYLES.smallSize);
              doc.setTextColor(PDF_COLORS.mutedForeground[0], PDF_COLORS.mutedForeground[1], PDF_COLORS.mutedForeground[2]);
              const footerText = `Rapport gegenereerd via www.mindnavigator.io - Pagina ${i} van ${pageCount}`;
              doc.text(footerText, margins.left, pageHeight - 10);
          }
      };

      const addTextWithFormatting = (text: string, x: number, currentY: number, options: TextOptionsLight & { color?: [number, number, number], fontSize?: number, fontStyle?: string, maxWidth?: number } = {}) => {
        const fontSize = options.fontSize || PDF_STYLES.normalSize;
        const lineHeight = fontSize * PDF_STYLES.lineHeightFactor;
        doc.setFont(PDF_STYLES.fontFamily, options.fontStyle || "normal");
        doc.setFontSize(fontSize);
        if (options.color) doc.setTextColor(options.color[0], options.color[1], options.color[2]);
        
        const plainTextForSplitting = text.replace(/<strong>(.*?)<\/strong>/gi, '%%BOLD_START%%$1%%BOLD_END%%');
        const lines = doc.splitTextToSize(plainTextForSplitting, options.maxWidth || usableWidth);

        lines.forEach((line: string) => {
          if (currentY + lineHeight > pageHeight - (margins.bottom + 5)) { doc.addPage(); currentY = margins.top; }
          let currentX = x;
          const segments = line.split(/(%%BOLD_START%%|%%BOLD_END%%)/g);
          
          segments.forEach(segment => {
            if (segment === '%%BOLD_START%%') doc.setFont(undefined, 'bold');
            else if (segment === '%%BOLD_END%%') doc.setFont(undefined, 'normal');
            else if (segment) { doc.text(segment, currentX, currentY); currentX += doc.getStringUnitWidth(segment) * fontSize / doc.internal.scaleFactor; }
          });
          currentY += lineHeight;
        });
        doc.setFont(PDF_STYLES.fontFamily, "normal");
        doc.setTextColor(PDF_COLORS.foreground[0], PDF_COLORS.foreground[1], PDF_COLORS.foreground[2]);
        return currentY;
      };

      const drawSectionCard = (currentY: number, sectionData: typeof reportContent.sections[0]) => {
          let cardContentY = currentY + PDF_STYLES.cardPaddingY;
          let cardContentHeight = 0;
          
          const titleHeight = (doc.setFont(undefined, "bold").setFontSize(PDF_STYLES.h2Size).getTextDimensions(sectionData.title, { maxWidth: usableWidth - (PDF_STYLES.cardPaddingX * 2) }).h) + PDF_STYLES.paragraphSpacing;
          
          let listHeight = 0;
          sectionData.content.forEach(item => {
              const textDimensions = doc.setFont(undefined, "normal").setFontSize(PDF_STYLES.normalSize).getTextDimensions(item.replace(/<[^>]*>/g, ''), { maxWidth: usableWidth - (PDF_STYLES.cardPaddingX * 2) - 10});
              listHeight += textDimensions.h + PDF_STYLES.paragraphSpacing;
          });
          
          cardContentHeight = titleHeight + listHeight;
          const cardTotalHeight = cardContentHeight + (PDF_STYLES.cardPaddingY * 2);

          if (currentY + cardTotalHeight > pageHeight - margins.bottom) {
              doc.addPage();
              currentY = margins.top;
              cardContentY = currentY + PDF_STYLES.cardPaddingY;
          }
          
          doc.setFillColor(sectionData.colorTheme.bg[0], sectionData.colorTheme.bg[1], sectionData.colorTheme.bg[2]);
          doc.roundedRect(margins.left, currentY, usableWidth, cardTotalHeight, PDF_STYLES.cardRadius, PDF_STYLES.cardRadius, 'F');
          
          let textY = cardContentY;
          textY = addTextWithFormatting(sectionData.title, margins.left + PDF_STYLES.cardPaddingX, textY, { fontSize: PDF_STYLES.h2Size, fontStyle: 'bold', color: sectionData.colorTheme.title, maxWidth: usableWidth - (PDF_STYLES.cardPaddingX * 2) });
          textY += PDF_STYLES.paragraphSpacing;

          sectionData.content.forEach(item => {
              doc.setFillColor(sectionData.colorTheme.bullet[0], sectionData.colorTheme.bullet[1], sectionData.colorTheme.bullet[2]);
              doc.circle(margins.left + PDF_STYLES.cardPaddingX + 2.5, textY - 1, 1.5, 'F');
              textY = addTextWithFormatting(item, margins.left + PDF_STYLES.cardPaddingX + 8, textY, { color: sectionData.colorTheme.text, lineHeightFactor: 0.6, maxWidth: usableWidth - (PDF_STYLES.cardPaddingX * 2) - 10 });
              textY += PDF_STYLES.paragraphSpacing;
          });
          
          return currentY + cardTotalHeight + PDF_STYLES.sectionSpacing;
      };

      // Start building PDF
      y = addTextWithFormatting(reportContent.title, margins.left, y, { fontSize: PDF_STYLES.titleSize, fontStyle: 'bold', color: PDF_COLORS.primary });
      y = addTextWithFormatting(reportContent.subtitle, margins.left, y, { fontSize: PDF_STYLES.subtitleSize, color: PDF_COLORS.mutedForeground });
      y += PDF_STYLES.paragraphSpacing;
      
      y = addTextWithFormatting(reportContent.intro, margins.left, y, { fontSize: PDF_STYLES.normalSize, color: PDF_COLORS.foreground });
      y += PDF_STYLES.paragraphSpacing;

      y = addTextWithFormatting(`Gebaseerd op:`, margins.left, y, { fontSize: PDF_STYLES.normalSize, fontStyle: 'italic', color: PDF_COLORS.mutedForeground });
      reportContent.basedOn.forEach(line => {
        y = addTextWithFormatting(`- ${line}`, margins.left + 2, y, { fontSize: PDF_STYLES.smallSize, color: PDF_COLORS.mutedForeground });
      });
      y = addTextWithFormatting(reportContent.generatedAt, margins.left, y, { fontSize: PDF_STYLES.smallSize, color: PDF_COLORS.mutedForeground });
      y += PDF_STYLES.sectionSpacing;
      
      reportContent.sections.forEach(section => {
          y = drawSectionCard(y, section);
      });
      
      addPageFooter();
      
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
                <p className="font-semibold text-foreground mb-2">Dit rapport is gebaseerd op:</p>
                 <ul className="list-none">
                    {reportContent.basedOn.map((line, i) => <li key={i}>{line}</li>)}
                </ul>
                 <p className="mt-2 text-xs">{reportContent.generatedAt}</p>
              </div>
              {reportContent.sections.map((section, index) => (
                <React.Fragment key={index}>
                  <ReportSection title={section.title} Icon={section.Icon} iconColorClass={section.title === 'Disclaimer' ? "text-destructive" : "text-primary"}>
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
                  <Info className="h-5 w-5 !text-primary" />
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
