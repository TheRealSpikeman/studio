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
  primary: hslToRgb(25, 78, 52), // Oranje Hoofdkleur (was 27, 86, 50 - iets aangepast voor betere leesbaarheid op wit indien nodig)
  accent: hslToRgb(168, 76, 42), // Teal
  foreground: hslToRgb(210, 40, 10), 
  mutedForeground: hslToRgb(210, 20, 45), 
  background: hslToRgb(200, 17, 94), 
  card: hslToRgb(0,0,100), 
  border: hslToRgb(210, 10, 80), 
  green: hslToRgb(145, 63, 42), 
  yellow: hslToRgb(48, 96, 59), 
  blue: hslToRgb(207, 90, 54), 
  orange: hslToRgb(25, 78, 52), 
  purple: hslToRgb(262, 85, 55),
  sectionDefault: {
    bg: hslToRgb(210, 20, 98), 
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
    title: "Voorbeeldrapport: Vergelijkende Analyse Ouder-Kind",
    description: `Inzichten voor u en ${childName}, gebaseerd op de "Ken je Kind" quiz en ${childName}'s Zelfreflectie.`,
    sections: [
      {
        title: "1. Perceptie Gaten: Waar Zien Jullie Dingen Anders?",
        Icon: EyeOff,
        iconColorClass: "text-orange-600",
        content: [
          "<strong>Focus op School:</strong> U geeft aan dat Sofie vaak moeite heeft met concentreren op schoolwerk. Sofie zelf ervaart dit minder als een probleem, en geeft aan dat het meer afhangt van de interesse in het vak. <span class='text-xs'>(<em>Mogelijkheid: Verschil in definitie van 'focus' of observatiemomenten.</em>)</span>",
          "<strong>Sociale Interacties:</strong> U ziet Sofie als soms wat terughoudend in nieuwe groepen. Sofie beschrijft zichzelf als selectief in vriendschappen, maar comfortabel met de vrienden die ze heeft. <span class='text-xs'>(<em>Mogelijkheid: Interpretatieverschil tussen introversie en verlegenheid.</em>)</span>",
          "<strong>Omgaan met Verandering:</strong> U merkt dat Sofie van slag raakt bij onverwachte veranderingen in de dagelijkse routine. Sofie geeft aan dat dit vooral geldt voor grote veranderingen (bijv. verhuizing school), maar kleine aanpassingen (bijv. ander avondeten) wel prima vindt. <span class='text-xs'>(<em>Mogelijkheid: De impact van de verandering speelt een rol.</em>)</span>",
          "<strong>Energielevel na School:</strong> U observeert dat Sofie vaak moe is na school. Sofie geeft aan zich soms 'leeg' te voelen, maar ook momenten van energie te hebben voor leuke dingen. <span class='text-xs'>(<em>Mogelijkheid: Het soort activiteit na school beïnvloedt haar energieniveau sterk.</em>)</span>"
        ]
      },
      {
        title: "2. Gedeelde Sterktes: Wat Zien Jullie Beiden Positief?",
        Icon: ThumbsUp,
        iconColorClass: "text-green-600",
        content: [
          "<strong>Creativiteit:</strong> Zowel u als Sofie benoemen haar creatieve talenten. U noemt haar tekenvaardigheid, Sofie haar vermogen om originele verhalen te bedenken. <span class='text-xs'>(<em>Tip: Stimuleer dit door samen een 'creatief project van de week' te kiezen, of een speciaal notitieboek voor haar verhalen te geven.</em>)</span>",
          "<strong>Doorzettingsvermogen:</strong> U ziet dat Sofie kan doorzetten als ze iets echt wil (bijv. sport). Sofie is trots op het feit dat ze een moeilijk project voor school heeft afgemaakt. <span class='text-xs'>(<em>Tip: Benoem en vier deze successen expliciet om dit te versterken.</em>)</span>",
          "<strong>Behulpzaamheid:</strong> U waardeert hoe Sofie helpt in huis (bijv. tafel dekken). Sofie geeft aan graag anderen te helpen en voelt zich goed als ze dat doet. <span class='text-xs'>(<em>Tip: Geef haar verantwoordelijkheden die passen bij haar leeftijd en waarin ze haar behulpzaamheid kan tonen.</em>)</span>"
        ]
      },
       {
        title: "3. Blinde Vlekken: Wat Mist Mogelijk Eén Partij?",
        Icon: Lightbulb,
        iconColorClass: "text-yellow-500",
        content: [
          "<strong>Impact van Sensorische Prikkels (Kind Ziet, Ouder Minder):</strong> Sofie geeft aan soms overprikkeld te raken door geluid en drukte in de klas, iets wat u mogelijk minder direct opmerkt thuis. <span class='text-xs'>(<em>Reflectiepunt voor ouder: Observeer Sofie's reactie in drukke omgevingen buitenshuis en bespreek of ze strategieën nodig heeft om hiermee om te gaan, zoals het gebruik van een koptelefoon.</em>)</span>",
          "<strong>Behoefte aan Externe Validatie (Ouder Ziet, Kind Minder):</strong> U geeft aan dat Sofie soms onzeker kan zijn en bevestiging zoekt. Sofie zelf noemt dit niet direct als een groot punt in haar zelfreflectie, maar focust meer op haar prestaties. <span class='text-xs'>(<em>Reflectiepunt voor ouder: Sofie is zich mogelijk niet bewust van hoe haar zoektocht naar validatie overkomt, of het is een normale ontwikkelingsfase. Blijf haar aanmoedigen en geef opbouwende feedback op haar proces, niet alleen het resultaat.</em>)</span>"
        ]
      },
      {
        title: "4. Communicatie Kansen: Hoe Beter Afstemmen?",
        Icon: MessageCircle,
        iconColorClass: "text-blue-600",
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
        iconColorClass: "text-purple-600",
        content: [
          "<strong>Actie: \"Wekelijks Creatief Uurtje\"</strong> - Blok wekelijks een 'Creatief Uurtje' in de agenda voor Sofie (en eventueel samen). Bespreek vooraf wat ze wil doen (tekenen, schrijven, knutselen). Zorg voor de benodigde materialen.",
          "<strong>Actie: \"Focus Plan Samen Maken\"</strong> - Maak samen met Sofie een visueel 'Focus Plan' voor de week (bijv. op een whiteboard). Identificeer 'focus-taken' (huiswerk, leren) en 'rust-taken' (hobby, ontspanning) en plan deze afwisselend in, inclusief korte pauzes (Pomodoro-techniek).",
          "<strong>Actie: \"Prikkel Thermometer\" Introduceren</strong> - Ontwerp samen met Sofie een 'Prikkel Thermometer' (bijv. met kleuren groen-oranje-rood). Bespreek wat elke kleur betekent (groen=ok, oranje=het wordt te veel, rood=overprikkeld) en welke actie Sofie (of u) kan ondernemen als ze zich in oranje of rood voelt (bijv. even rust, koptelefoon op, hulp vragen)."
        ]
      },
       {
        title: "6. Belangrijke Overwegingen",
        Icon: Info,
        iconColorClass: "text-foreground",
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
        if (options.fontStyle) doc.setFont(PDF_STYLES.fontFamily, options.fontStyle || "normal"); // Ensure fontStyle is applied
        
        const lineHeight = fontSize * (options.lineHeightFactor || PDF_STYLES.lineHeightFactor); 
        
        const plainTextForSplitting = text
                                        .replace(/<strong>(.*?)<\/strong>/gi, (match, p1) => `%%BOLD_START%%${p1}%%BOLD_END%%`)
                                        .replace(/<em>(.*?)<\/em>/gi, (match, p1) => `%%ITALIC_START%%${p1}%%ITALIC_END%%`)
                                        .replace(/<span class='text-xs'>(.*?)<\/span>/gi, '$1') 
                                        .replace(/<br\s*\/?>/gi, '\n')
                                        .replace(/&nbsp;/gi, ' ')
                                        .replace(/&amp;/gi, '&')
                                        .replace(/&lt;/gi, '<')
                                        .replace(/&gt;/gi, '>');


        const lines = doc.splitTextToSize(plainTextForSplitting, options.maxWidth || usableWidth);
        
        lines.forEach((line: string) => {
          if (currentY + lineHeight > pageHeight - margins.bottom) {
            doc.addPage();
            currentY = margins.top;
          }
          
          let currentX = x;
          const segments = line.split(/(%%BOLD_START%%|%%BOLD_END%%|%%ITALIC_START%%|%%ITALIC_END%%)/g);
          let isBold = false;
          let isItalic = false;

          segments.forEach(segment => {
            if (segment === '%%BOLD_START%%') {
              isBold = true;
              doc.setFont(PDF_STYLES.fontFamily, isItalic ? "bolditalic" : "bold");
            } else if (segment === '%%BOLD_END%%') {
              isBold = false;
              doc.setFont(PDF_STYLES.fontFamily, isItalic ? "italic" : "normal");
            } else if (segment === '%%ITALIC_START%%') {
              isItalic = true;
              doc.setFont(PDF_STYLES.fontFamily, isBold ? "bolditalic" : "italic");
            } else if (segment === '%%ITALIC_END%%') {
              isItalic = false;
              doc.setFont(PDF_STYLES.fontFamily, isBold ? "bold" : "normal");
            } else if (segment) {
              doc.text(segment, currentX, currentY);
              currentX += doc.getStringUnitWidth(segment) * fontSize * (doc.internal as any).scaleFactor;
            }
          });
          currentY += lineHeight;
          doc.setFont(PDF_STYLES.fontFamily, "normal"); // Reset font style for next line
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
            y = addTextLines(`• ${item}`, margins.left + 5, y, { color: PDF_COLORS.foreground, lineHeightFactor: 0.5, isHtml: true });
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
                    <ul className="list-none space-y-3 pl-0"> {/* Changed to list-none and adjusted spacing */}
                      {section.content.map((item, itemIndex) => (
                        <li key={itemIndex} dangerouslySetInnerHTML={{ __html: item }} className="leading-relaxed"></li>
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
