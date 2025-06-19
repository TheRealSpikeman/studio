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
import { jsPDF, type TextOptionsLight } from 'jspdf'; // Importeren van jsPDF
import { format } from 'date-fns'; // Voor datum in PDF
import { nl } from 'date-fns/locale'; // Voor Nederlandse datum


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
  orange: hslToRgb(25, 78, 52), // Primary is oranje
  purple: hslToRgb(262, 85, 55),
  sectionDefault: {
    bg: hslToRgb(210, 20, 98), // Very light gray
    border: hslToRgb(210, 10, 80), 
    text: hslToRgb(210, 40, 10), 
    title: hslToRgb(210, 40, 25), 
  },
};

const PDF_STYLES = {
  fontFamily: "Helvetica",
  pageMargins: { top: 20, bottom: 20, left: 15, right: 15 },
  lineHeightFactor: 0.5,
  paragraphSpacing: 5,
  sectionSpacing: 8,
  titleSize: 20,
  h2Size: 16,
  h3Size: 14,
  normalSize: 10,
  smallSize: 8,
};

export default function VoorbeeldAnalyseRapportPage() {
  const childName = "Sofie"; 
  const { toast } = useToast();

  const reportContent = {
    title: "Voorbeeldrapport: Vergelijkende Analyse",
    description: `Inzichten voor u en ${childName}, gebaseerd op de "Ken je Kind" quiz en ${childName}'s Zelfreflectie.`,
    sections: [
      {
        title: "1. Perceptie Gaten: Waar Zien Jullie Dingen Anders?",
        Icon: EyeOff,
        iconColorClass: "text-orange-600",
        content: [
          "<strong>Focus op School:</strong> U geeft aan dat Sofie vaak moeite heeft met concentreren op schoolwerk. Sofie zelf ervaart dit minder als een probleem, en geeft aan dat het meer afhangt van de interesse in het vak. <span class='text-xs'>(<em>Mogelijkheid: Het verschil kan liggen in de definitie van 'focus' of de momenten waarop u Sofie observeert.</em>)</span>",
          "<strong>Sociale Interacties:</strong> U ziet Sofie als soms wat terughoudend in nieuwe groepen. Sofie beschrijft zichzelf als selectief in vriendschappen, maar comfortabel met de vrienden die ze heeft. <span class='text-xs'>(<em>Mogelijkheid: Dit kan duiden op een introverte aard die door u als verlegenheid wordt geïnterpreteerd.</em>)</span>",
          "<strong>Omgaan met Verandering:</strong> U merkt dat Sofie van slag raakt bij onverwachte veranderingen. Sofie geeft aan dat dit vooral geldt voor grote veranderingen, maar kleine aanpassingen wel prima vindt."
        ]
      },
      {
        title: "2. Gedeelde Sterktes: Wat Zien Jullie Beiden Positief?",
        Icon: ThumbsUp,
        iconColorClass: "text-green-600",
        content: [
          "<strong>Creativiteit:</strong> Zowel u als Sofie benoemen haar creatieve talenten. U noemt haar tekenvaardigheid, Sofie haar vermogen om originele verhalen te bedenken. <span class='text-xs'>(<em>Tip: Stimuleer deze gedeelde kracht door samen creatieve projecten te doen of haar ruimte te geven voor haar creatieve uitingen.</em>)</span>",
          "<strong>Doorzettingsvermogen:</strong> U ziet dat Sofie kan doorzetten als ze iets echt wil. Sofie is trots op het feit dat ze een moeilijk project voor school heeft afgemaakt.",
          "<strong>Behulpzaamheid:</strong> U waardeert hoe Sofie helpt in huis. Sofie geeft aan graag anderen te helpen."
        ]
      },
       {
        title: "3. Blinde Vlekken: Wat Mist Mogelijk Eén Partij?",
        Icon: Lightbulb,
        iconColorClass: "text-yellow-500",
        content: [
          "<strong>Impact van Prikkels (Kind Perspectief):</strong> Sofie geeft aan soms overprikkeld te raken door geluid in de klas, iets wat u mogelijk minder direct opmerkt. <span class='text-xs'>(<em>Reflectiepunt: Observeer Sofie's reactie op drukke omgevingen en bespreek of ze strategieën nodig heeft om hiermee om te gaan.</em>)</span>",
          "<strong>Behoefte aan Erkenning (Ouder Perspectief):</strong> U geeft aan dat Sofie soms onzeker kan zijn, terwijl Sofie dit zelf niet direct als een groot punt noemt in haar zelfreflectie. <span class='text-xs'>(<em>Reflectiepunt: Sofie is zich mogelijk niet bewust van hoe haar onzekerheid overkomt, of u interpreteert haar gedrag als onzekerheid terwijl zij dit anders ervaart.</em>)</span>"
        ]
      },
      {
        title: "4. Communicatie Kansen: Hoe Beter Afstemmen?",
        Icon: MessageCircle,
        iconColorClass: "text-blue-600",
        content: [
          "Praat met Sofie over het verschil in beleving rondom 'focus op school'. Vraag haar: \"Wat helpt jou om je aandacht bij een taak te houden? En wanneer vind je het lastig?\"",
          "Erken haar selectiviteit in vriendschappen. Vraag: \"Wat vind je fijn aan je huidige vrienden? En wat zoek je in een vriendschap?\"",
          "Bespreek samen hoe jullie kunnen omgaan met 'overprikkeling'. Vraag: \"Zijn er momenten dat het te druk voor je is? Wat zou je dan helpen?\"",
          "Geef specifieke complimenten over haar doorzettingsvermogen en creativiteit om haar zelfbeeld te versterken."
        ]
      },
      {
        title: "5. Familie Actieplan: Concreet & Haalbaar",
        Icon: ClipboardList,
        iconColorClass: "text-purple-600",
        content: [
          "<strong>Wekelijks Creatief Uurtje:</strong> Plan één keer per week een moment waarop Sofie (en eventueel u) tijd besteedt aan een creatieve activiteit naar keuze.",
          "<strong>\"Focus Plan\" Samen Maken:</strong> Bekijk samen met Sofie haar huiswerkplanning. Bespreek welke vakken meer focus vragen en hoe ze pauzes kan inplannen.",
          "<strong>\"Prikkel Thermometer\" Introduceren:</strong> Maak (visueel) afspraken over hoe Sofie kan aangeven dat ze overprikkeld raakt en wat ze dan nodig heeft (bijv. even rust op haar kamer)."
        ]
      },
       {
        title: "6. Belangrijke Overwegingen",
        Icon: Info,
        iconColorClass: "text-foreground",
        content: [
          "Dit rapport is een momentopname en bedoeld als startpunt voor gesprek en begrip. Het is geen diagnostisch instrument.",
          "De percepties van zowel u als Sofie zijn waardevol. Er is geen 'goed' of 'fout'.",
          "Blijf open communiceren en observeer hoe Sofie zich ontwikkelt. Pas strategieën aan waar nodig.",
          "Overweeg professionele begeleiding als u zich zorgen blijft maken of als specifieke uitdagingen aanhouden. MindNavigator kan u helpen een passende coach of tutor te vinden."
        ]
      },
    ],
    disclaimer: "De inhoud van dit rapport is fictief en dient puur ter illustratie van de structuur en het soort inzichten dat u kunt verwachten van de Vergelijkende Analyse. Echte rapporten worden gegenereerd op basis van de daadwerkelijk ingevulde quizzen."
  };

  const handlePdfDownloadClick = () => {
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

      const addTextLines = (text: string, x: number, currentY: number, options: TextOptionsLight & { lineHeightFactor?: number, color?: [number, number, number], fontSize?: number, fontStyle?: string, maxWidth?: number, isHtml?: boolean } = {}) => {
        const fontSize = options.fontSize || PDF_STYLES.normalSize;
        doc.setFontSize(fontSize);
        if (options.color) doc.setTextColor(options.color[0], options.color[1], options.color[2]);
        if (options.fontStyle) doc.setFont(PDF_STYLES.fontFamily, options.fontStyle);
        
        const lineHeight = fontSize * (options.lineHeightFactor || PDF_STYLES.lineHeightFactor); 
        let lines: string[] | Element;
        if (options.isHtml) {
            lines = doc.splitTextToSize(text.replace(/<[^>]*>?/gm, ''), options.maxWidth || usableWidth); // Basic HTML strip for length calculation
        } else {
            lines = doc.splitTextToSize(text, options.maxWidth || usableWidth);
        }
        
        (lines as string[]).forEach((line: string) => {
          if (currentY + lineHeight > pageHeight - margins.bottom) {
            doc.addPage();
            currentY = margins.top;
          }
          if (options.isHtml) {
            doc.html(line, { x, y: currentY, autoPaging: 'text', width: options.maxWidth || usableWidth }); // Experimental for basic HTML
          } else {
            doc.text(line, x, currentY, {lineHeightFactor: options.lineHeightFactor || 1.15 });
          }
          currentY += lineHeight;
        });
        
        doc.setTextColor(PDF_COLORS.foreground[0], PDF_COLORS.foreground[1], PDF_COLORS.foreground[2]); // Reset color
        doc.setFontSize(PDF_STYLES.normalSize);
        doc.setFont(PDF_STYLES.fontFamily, "normal"); // Reset font style
        return currentY;
      };
      
      // Title
      y = addTextLines(reportContent.title, margins.left, y, { fontSize: PDF_STYLES.titleSize, fontStyle: 'bold', color: PDF_COLORS.primary, lineHeightFactor: 0.6 });
      y = addTextLines(reportContent.description, margins.left, y, {fontSize: PDF_STYLES.normalSize, color: PDF_COLORS.mutedForeground, lineHeightFactor: 0.5});
      y = addTextLines(`Rapport gegenereerd op: ${format(new Date(), 'PPPp', { locale: nl })}`, margins.left, y, {fontSize: PDF_STYLES.smallSize, color: PDF_COLORS.mutedForeground, lineHeightFactor: 0.5});
      y += PDF_STYLES.sectionSpacing;

      // Sections
      reportContent.sections.forEach(section => {
        y = addTextLines(section.title, margins.left, y, { fontSize: PDF_STYLES.h2Size, fontStyle: 'bold', color: PDF_COLORS.primary, lineHeightFactor: 0.6 });
        y += PDF_STYLES.paragraphSpacing / 2;
        section.content.forEach(item => {
            // Basic HTML stripping for PDF, or render as plain text
            const plainItem = item.replace(/<strong>(.*?)<\/strong>/g, '$1').replace(/<em>(.*?)<\/em>/g, '$1').replace(/<span.*?>(.*?)<\/span>/g, '$1').replace(/<br\s*\/?>/g, '\n');
            y = addTextLines(`• ${plainItem}`, margins.left + 5, y, { color: PDF_COLORS.foreground, lineHeightFactor: 0.5 });
        });
        y += PDF_STYLES.sectionSpacing;
      });

      // Disclaimer
      y = addTextLines("Disclaimer", margins.left, y, { fontSize: PDF_STYLES.h3Size, fontStyle: 'bold', color: PDF_COLORS.foreground, lineHeightFactor: 0.6 });
      y += PDF_STYLES.paragraphSpacing / 2;
      y = addTextLines(reportContent.disclaimer, margins.left, y, { fontSize: PDF_STYLES.smallSize, color: PDF_COLORS.mutedForeground, lineHeightFactor: 0.5 });

      const fileName = `vergelijkende_analyse_rapport_${childName.toLowerCase().replace(' ', '_')}.pdf`;
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
                {reportContent.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {reportContent.sections.map((section, index) => (
                <React.Fragment key={index}>
                  <ReportSection title={section.title} Icon={section.Icon} iconColorClass={section.iconColorClass}>
                    <ul className="list-disc list-inside space-y-2 pl-2">
                      {section.content.map((item, itemIndex) => (
                        <li key={itemIndex} dangerouslySetInnerHTML={{ __html: item }}></li>
                      ))}
                    </ul>
                  </ReportSection>
                  {index < reportContent.sections.length -1 && <Separator />}
                </React.Fragment>
              ))}

              <Alert variant="default" className="mt-8 bg-primary/5 border-primary/20">
                  <AlertTriangle className="h-5 w-5 !text-primary" />
                  <AlertTitleUi className="text-primary font-semibold">Let op: Voorbeeld Data</AlertTitleUi>
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
