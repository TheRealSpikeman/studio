
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
    Download,
    Bot
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

// HSL to RGB conversion function
function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  s /= 100;
  l /= 100;
  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) =>
    l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return [Math.round(255 * f(0)), Math.round(255 * f(8)), Math.round(255 * f(4))];
}

const PDF_COLORS = {
  primary: hslToRgb(25, 78, 52), // Orange Primary
  foreground: [51, 65, 85], // slate-700
  mutedForeground: [100, 116, 139], // slate-500
  background: [255, 255, 255],
  white: [255, 255, 255],
  blue: {
    bg: hslToRgb(210, 100, 98),
    border: hslToRgb(207, 90, 54),
    title: hslToRgb(207, 90, 44),
    bullet: hslToRgb(207, 80, 50),
  },
  green: {
    bg: hslToRgb(120, 60, 95),
    border: hslToRgb(145, 63, 42),
    title: hslToRgb(145, 63, 32),
    bullet: hslToRgb(145, 60, 38),
  },
  orange: {
    bg: hslToRgb(39, 100, 97),
    border: hslToRgb(35, 100, 50),
    title: hslToRgb(35, 100, 40),
    bullet: hslToRgb(30, 90, 45),
  },
  yellow: {
    bg: hslToRgb(50, 100, 97),
    border: hslToRgb(45, 100, 50),
    title: hslToRgb(45, 100, 40),
    bullet: hslToRgb(45, 90, 45),
  },
  red: {
    bg: hslToRgb(0, 100, 97),
    border: hslToRgb(0, 84, 60),
    title: hslToRgb(0, 84, 50),
    bullet: hslToRgb(0, 80, 45),
  },
  gray: {
    bg: [241, 245, 249], // slate-100
    border: [203, 213, 225], // slate-300
    title: [71, 85, 105], // slate-600
    bullet: [100, 116, 139], // slate-500
  },
  sectionDefault: {
      bg: [248, 250, 252], // slate-50
      border: [226, 232, 240], // slate-200
      title: [51, 65, 85], // slate-700
      bullet: [100, 116, 139], //slate-500
  },
};

const PDF_STYLES = {
  fontFamily: "Helvetica",
  pageMargins: { top: 20, bottom: 25, left: 20, right: 20 },
  paragraphSpacing: 4,
  sectionSpacing: 10,
  bulletRadius: 1.2,
  bulletIndent: 8,
  titleSize: 22,
  subtitleSize: 11,
  h2Size: 16,
  normalSize: 10,
  smallSize: 8,
  lineHeightFactor: 1.5,
};


export default function VoorbeeldAnalyseRapportPage() {
  const childName = "Sofie";
  const parentName = "Olivia Ouder";
  const { toast } = useToast();

  const reportContent = {
    title: `Vergelijkende Analyse`,
    subtitle: `Inzichten voor ${parentName} en ${childName}`,
    intro: `Dit rapport is zorgvuldig samengesteld om u als ouder inzicht te geven in de overeenkomsten en verschillen tussen uw perspectief en de zelfreflectie van uw kind. Onze AI heeft de antwoorden op circa 15-20 vragen per persoon geanalyseerd om patronen te herkennen, zonder individuele responses te beoordelen als 'goed' of 'fout'. Het doel is om een brug te slaan, communicatie te bevorderen en concrete, gezamenlijke actiepunten te formuleren die bijdragen aan het welzijn en de ontwikkeling van ${childName}.`,
    basedOn: [
        `Ouder-quiz: "Ken je Kind" (ingevuld door ${parentName})`,
        `Kind-quiz: "Hoe zie ik mezelf?" (ingevuld door ${childName})`
    ],
    generatedAt: `Rapport gegenereerd via www.mindnavigator.io op: ${format(new Date('2025-06-20T20:50:00'), 'd MMMM yyyy \'om\' HH:mm', { locale: nl })}`,
    sections: [
      {
        title: "1. Perceptie Gaten: Waar Zien Jullie Dingen Anders?",
        Icon: EyeOff,
        theme: 'blue',
        content: [
          "<strong>Focus op School:</strong> U geeft aan dat Sofie vaak moeite heeft met concentreren op schoolwerk. Sofie zelf ervaart dit minder als een algemeen probleem, en geeft aan dat het meer afhangt van de interesse in het vak; wiskunde kost haar bijvoorbeeld meer energie dan creatieve vakken, vooral tijdens huiswerk tussen 16:00-18:00. (Mogelijkheid: Verschil in definitie van 'focus' of observatiemomenten.)",
          "<strong>Sociale Interacties:</strong> U ziet Sofie als soms wat terughoudend in nieuwe groepen. Sofie beschrijft zichzelf als selectief in vriendschappen, maar comfortabel met de vrienden die ze heeft. (Mogelijkheid: Interpretatieverschil tussen introversie en verlegenheid.)",
          "<strong>Omgaan met Verandering:</strong> U merkt op dat Sofie van slag raakt bij onverwachte veranderingen in de dagelijkse routine. Sofie geeft aan dat dit vooral geldt voor grote veranderingen (bijv. verhuizing school), maar kleine aanpassingen (bijv. ander avondeten) wel prima vindt. (Mogelijkheid: De impact van de verandering speelt een rol.)",
        ]
      },
      {
        title: "2. Waar Jullie Het Eens Zijn (Gedeelde Sterktes)",
        Icon: ThumbsUp,
        theme: 'green',
        content: [
          "<strong>Creativiteit:</strong> Zowel u als Sofie benoemen haar creatieve talenten. U noemt haar tekenvaardigheid, Sofie haar vermogen om originele verhalen te bedenken. <i>(Waarom dit belangrijk is: Dit is een krachtig, gedeeld fundament om op voort te bouwen en haar zelfvertrouwen te versterken.)</i>",
          "<strong>Doorzettingsvermogen:</strong> U ziet dat Sofie kan doorzetten als ze iets echt wil (bijv. sport). Sofie is trots op het feit dat ze een moeilijk project voor school heeft afgemaakt. <i>(Waarom dit belangrijk is: Het erkennen van doorzettingsvermogen helpt haar om toekomstige uitdagingen met meer veerkracht aan te gaan.)</i>",
          "<strong>Behulpzaamheid:</strong> U waardeert hoe Sofie helpt in huis. Sofie geeft aan graag anderen te helpen en voelt zich goed als ze dat doet. <i>(Waarom dit belangrijk is: Dit benadrukt haar sociale waarde en kan een bron van voldoening zijn.)</i>"
        ]
      },
      {
        title: "3. Blinde Vlekken: Wat Ziet De Een, Wat De Ander (Nog) Niet Ziet?",
        Icon: Lightbulb,
        theme: 'orange',
        content: [
          "<strong>Ouder ziet, Kind (nog) niet:</strong> U maakt zich zorgen over Sofie's slaappatroon en merkt op dat ze vaak tot laat op is. Sofie zelf geeft aan hier geen problemen mee te ervaren. (Kans: Bespreek samen de impact van slaap op stemming en energie overdag, zonder oordeel.)",
          "<strong>Kind ziet, Ouder (nog) niet:</strong> Sofie geeft aan soms overprikkeld te raken door geluid en drukte. Dit is een blinde vlek voor u, omdat u dit thuis minder observeert. (Kans: Bespreek strategieën voor drukke omgevingen, zoals een koptelefoon, of even een rustig plekje opzoeken.)",
          "<strong>Positieve blinde vlek:</strong> Zowel u als Sofie onderschatten mogelijk haar leiderschapskwaliteiten. U noemt dat ze 'soms de leiding neemt' en Sofie zegt 'af en toe te helpen met organiseren'. Dit kan een verborgen talent zijn dat meer aandacht verdient.",
        ]
      },
      {
        title: "4. Communicatie Kansen: Hoe Beter Afstemmen?",
        Icon: MessageCircle,
        theme: 'yellow',
        content: [
          "<strong>Probeer deze week:</strong> Vraag door op Sofie's ervaring met 'focus': \"Ik ben benieuwd, hoe voelt 'focus' voor jou? Wat helpt je om je aandacht erbij te houden, vooral bij wiskunde?\"",
          "<strong>Probeer deze week:</strong> Erken haar perspectief op vriendschap: \"Ik zie dat je het fijn hebt met je vrienden. Wat vind je belangrijk in een vriendschap? Dat vind ik interessant om te horen.\"",
          "<strong>Probeer deze week:</strong> Geef een specifiek compliment over doorzettingsvermogen: \"Wat knap hoe je dat moeilijke project hebt doorgezet, ook toen het even niet lukte! Ik ben trots op je.\""
        ]
      },
      {
        title: "5. Familie Actieplan: Concreet & Haalbaar",
        Icon: ClipboardList,
        theme: 'green',
        content: [
          "<strong>Wekelijks Creatief Uurtje:</strong> Plan elke week een vast moment voor een creatieve activiteit die Sofie kiest. Geen schermen, alleen papier, verf, klei, etc.",
          "<strong>Focus Plan Maken:</strong> Maak samen een visueel plan voor huiswerk, met duidelijke blokken van 25 minuten focus en 5 minuten pauze (Pomodoro-techniek).",
          "<strong>Prikkel Thermometer:</strong> Introduceer een 'prikkel-thermometer' (groen-oranje-rood) voor op de koelkast. Sofie kan aangeven hoe 'vol' haar hoofd zit, als startpunt voor een gesprek over wat ze nodig heeft."
        ]
      },
      {
        title: "6. Volgende Stappen: Hoe Nu Verder?",
        Icon: CheckSquare,
        theme: 'blue',
        content: [
            "<strong>Check-in over 2 weken:</strong> Plan een kort, informeel moment om te bespreken hoe het actieplan gaat. Wat werkt goed, wat minder?",
            "<strong>Vervolgvragen om te stellen:</strong> \"Waar ben je deze week trots op qua schoolwerk?\" of \"Was er een moment waarop je je overprikkeld voelde? Wat hielp toen?\"",
            "<strong>Rapport opnieuw doen:</strong> Overweeg om deze vragenlijsten over 3-6 maanden opnieuw te doen om groei en veranderingen te zien.",
            "<strong>Professionele hulp:</strong> Als zorgen aanhouden of de communicatie moeizaam blijft, overweeg dan een gesprek met een van onze gekoppelde coaches of een externe professional."
        ]
      },
      {
        title: "7. Hoe Werkt de AI Analyse?",
        Icon: Bot,
        theme: 'gray',
        content: [
            "Onze AI is getraind om patronen te herkennen in de antwoorden van u en uw kind. Het legt de antwoorden op vergelijkbare thema's (zoals 'sociale interactie' of 'planning') naast elkaar. De AI bewaart geen individuele antwoorden, maar identificeert thematische verschillen en overeenkomsten. Op basis van deze patronen stelt het een rapport op met inzichten en suggesties, ontworpen om een constructief gesprek te faciliteren. Het is een hulpmiddel, geen oordeel."
        ]
      },
       {
        title: "Disclaimer",
        Icon: AlertTriangle,
        theme: 'red',
        content: [
          "Dit rapport is gebaseerd op de antwoorden die zijn gegeven en dient ter indicatie en zelfreflectie. Het is nadrukkelijk geen vervanging voor een professionele diagnose of medisch advies. Raadpleeg een gekwalificeerde zorgverlener voor een formele diagnose of behandeling."
        ]
      },
    ]
  };

  const handlePdfDownloadClick = () => {
    try {
        const doc = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' });
        doc.setFont('Helvetica', 'normal');

        const pageHeight = doc.internal.pageSize.height;
        const pageWidth = doc.internal.pageSize.width;
        const margins = PDF_STYLES.pageMargins;
        const usableWidth = pageWidth - margins.left - margins.right;
        let y = margins.top;

        const checkY = (neededHeight: number) => {
            if (y + neededHeight > pageHeight - margins.bottom) {
                doc.addPage();
                y = margins.top;
            }
        };
        
        const drawFormattedText = (text: string, x: number, yPos: number, options: any = {}) => {
            const { fontSize = PDF_STYLES.normalSize, fontStyle = 'normal', color = PDF_COLORS.foreground, maxWidth = usableWidth, lineHeightFactor = PDF_STYLES.lineHeightFactor } = options;
            const lineHeight = fontSize * lineHeightFactor * 0.4;
            doc.setFontSize(fontSize);
            doc.setTextColor(color[0], color[1], color[2]);
            doc.setFont(PDF_STYLES.fontFamily, fontStyle);

            const parts = text.split(/(<strong>.*?<\/strong>|<i>.*?<\/i>)/g).filter(Boolean);
            let currentX = x;
            let lineParts: { text: string; fontStyle: string }[] = [];

            parts.forEach(part => {
                if (part.startsWith('<strong>')) {
                    lineParts.push({ text: part.replace(/<\/?strong>/g, ''), fontStyle: 'bold' });
                } else if (part.startsWith('<i>')) {
                    lineParts.push({ text: part.replace(/<\/?i>/g, ''), fontStyle: 'italic' });
                } else {
                    lineParts.push({ text: part, fontStyle: fontStyle });
                }
            });

            const fullTextForSplitting = lineParts.map(p => p.text).join('');
            const textLines = doc.splitTextToSize(fullTextForSplitting, maxWidth);
            let lineY = yPos;
            let partIndex = 0;

            textLines.forEach((line: string) => {
                let remainingLine = line;
                let currentLineX = x;
                while (remainingLine.length > 0 && partIndex < lineParts.length) {
                    const currentPart = lineParts[partIndex];
                    doc.setFont(PDF_STYLES.fontFamily, currentPart.fontStyle);
                    
                    if (currentPart.text.length >= remainingLine.length) {
                        doc.text(remainingLine, currentLineX, lineY);
                        currentPart.text = currentPart.text.substring(remainingLine.length);
                        currentLineX += doc.getStringUnitWidth(remainingLine) * fontSize / doc.internal.scaleFactor;
                        remainingLine = '';
                        if (currentPart.text.length === 0) partIndex++;
                    } else {
                        doc.text(currentPart.text, currentLineX, lineY);
                        remainingLine = remainingLine.substring(currentPart.text.length);
                        currentLineX += doc.getStringUnitWidth(currentPart.text) * fontSize / doc.internal.scaleFactor;
                        partIndex++;
                    }
                }
                lineY += lineHeight;
            });
            
            return lineY - yPos; // returns height of text block
        };

        const calculateSectionHeight = (section: typeof reportContent.sections[0]) => {
            let height = 0;
            // Title height
            height += drawFormattedText(section.title, 0, 0, { fontSize: PDF_STYLES.h2Size, fontStyle: 'bold' });
            height += PDF_STYLES.paragraphSpacing;

            // Content height
            section.content.forEach(item => {
                const itemHeight = drawFormattedText(item, 0, 0, { maxWidth: usableWidth - PDF_STYLES.bulletIndent - 10 });
                height += itemHeight + PDF_STYLES.paragraphSpacing;
            });
            return height + 20; // Add vertical padding
        };

        // --- PDF Generation START ---
        y = drawFormattedText(reportContent.title, margins.left, y, { fontSize: PDF_STYLES.titleSize, fontStyle: 'bold', color: PDF_COLORS.primary });
        y += drawFormattedText(reportContent.subtitle, margins.left, y, { fontSize: PDF_STYLES.subtitleSize, color: PDF_COLORS.mutedForeground });
        y += PDF_STYLES.paragraphSpacing;
        
        y += drawFormattedText(reportContent.generatedAt, margins.left, y, { fontSize: PDF_STYLES.smallSize, color: PDF_COLORS.mutedForeground });
        y += PDF_STYLES.sectionSpacing;
        
        // --- Based On Card ---
        let basedOnCardY = y;
        let cardContentY = basedOnCardY + 6;
        cardContentY += drawFormattedText(`Gebaseerd op:`, margins.left + 5, cardContentY, { fontSize: PDF_STYLES.smallSize, fontStyle: 'bold', color: PDF_COLORS.mutedForeground });
        reportContent.basedOn.forEach(line => {
            cardContentY += drawFormattedText(`- ${line}`, margins.left + 7, cardContentY, { fontSize: PDF_STYLES.smallSize, color: PDF_COLORS.mutedForeground });
        });
        const basedOnCardHeight = (cardContentY - basedOnCardY) + 6;
        checkY(basedOnCardHeight + PDF_STYLES.sectionSpacing);
        doc.setFillColor(PDF_COLORS.sectionDefault.bg[0], PDF_COLORS.sectionDefault.bg[1], PDF_COLORS.sectionDefault.bg[2]);
        doc.roundedRect(margins.left, basedOnCardY, usableWidth, basedOnCardHeight, 2, 2, 'F');
        // Redraw text on top
        cardContentY = basedOnCardY + 6;
        cardContentY += drawFormattedText(`Gebaseerd op:`, margins.left + 5, cardContentY, { fontSize: PDF_STYLES.smallSize, fontStyle: 'bold', color: PDF_COLORS.mutedForeground });
        reportContent.basedOn.forEach(line => {
            cardContentY += drawFormattedText(`- ${line}`, margins.left + 7, cardContentY, { fontSize: PDF_STYLES.smallSize, color: PDF_COLORS.mutedForeground });
        });
        y += basedOnCardHeight + PDF_STYLES.sectionSpacing;

        
        reportContent.sections.forEach((sectionData, index) => {
            const sectionHeight = calculateSectionHeight(sectionData);
            checkY(sectionHeight + PDF_STYLES.sectionSpacing);

            const theme = PDF_COLORS[sectionData.theme as keyof typeof PDF_COLORS] || PDF_COLORS.sectionDefault;
            const cardY = y;
            let contentY = cardY + 10; // Top padding

            doc.setFillColor(theme.bg[0], theme.bg[1], theme.bg[2]);
            doc.roundedRect(margins.left, cardY, usableWidth, sectionHeight, 3, 3, 'F');
            
            contentY += drawFormattedText(sectionData.title, margins.left + 8, contentY, { fontSize: PDF_STYLES.h2Size, fontStyle: 'bold', color: theme.title, maxWidth: usableWidth - 16 });
            contentY += PDF_STYLES.paragraphSpacing;

            sectionData.content.forEach(item => {
                doc.setFillColor(theme.bullet[0], theme.bullet[1], theme.bullet[2]);
                const bulletY = contentY + 2; 
                doc.circle(margins.left + PDF_STYLES.bulletIndent, bulletY, PDF_STYLES.bulletRadius, 'F');
                contentY += drawFormattedText(item, margins.left + PDF_STYLES.bulletIndent + 5, contentY, { maxWidth: usableWidth - PDF_STYLES.bulletIndent - 15, color: PDF_COLORS.foreground });
                contentY += PDF_STYLES.paragraphSpacing;
            });
            y = cardY + sectionHeight + PDF_STYLES.sectionSpacing;
        });

        // Add page footers
        const pageCount = doc.internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.setFont(PDF_STYLES.fontFamily, "italic");
            doc.setFontSize(PDF_STYLES.smallSize);
            doc.setTextColor(PDF_COLORS.mutedForeground[0], PDF_COLORS.mutedForeground[1], PDF_COLORS.mutedForeground[2]);
            const footerText = `Rapport gegenereerd via www.mindnavigator.io - Pagina ${i} van ${pageCount}`;
            doc.text(footerText, margins.left, pageHeight - 10);
        }
      
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
                         <li key={itemIndex} className="flex items-start">
                           <span className="mr-3 mt-1.5 text-primary">&#8226;</span>
                           <span dangerouslySetInnerHTML={{ __html: item }} className="flex-1" />
                        </li>
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
                    Dit is een voorbeeldrapport met fictieve data om de structuur en het type inzichten te tonen. De inhoud is niet gebaseerd op echte antwoorden.
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
