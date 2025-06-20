
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
    Bot,
    Target
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
  primary: hslToRgb(25, 78, 52), // Oranje
  foreground: [51, 65, 85],
  mutedForeground: [100, 116, 139],
  white: [255, 255, 255],
  blue: { bg: hslToRgb(210, 100, 98), title: hslToRgb(207, 90, 44) },
  green: { bg: hslToRgb(140, 60, 96), title: hslToRgb(145, 63, 32) },
  orange: { bg: hslToRgb(39, 100, 97), title: hslToRgb(35, 100, 40) },
  yellow: { bg: hslToRgb(50, 100, 97), title: hslToRgb(45, 100, 40) },
  red: { bg: hslToRgb(0, 100, 97), title: hslToRgb(0, 84, 50) },
  gray: { bg: [241, 245, 249], title: [71, 85, 105] },
  sectionDefault: { bg: [248, 250, 252], title: [51, 65, 85] },
};

const PDF_STYLES = {
  fontFamily: "Helvetica",
  pageMargins: { top: 20, bottom: 25, left: 20, right: 20 },
  sectionSpacing: 8, // Reduced spacing between sections
  padding: 8, // Increased padding
  cornerRadius: 3,
  titleSize: 22,
  subtitleSize: 11,
  h2Size: 16,
  h3Size: 12,
  normalSize: 10,
  smallSize: 8,
  lineHeightFactor: 1.4,
  bulletRadius: 1, // Correctly defined
  paragraphSpacing: 4
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
            `Ouder-quiz: "Ken je Kind" (ingevuld door ${parentName} op 18-06-2025 om 20:15)`,
            `Kind-quiz: "Hoe zie ik mezelf?" (ingevuld door ${childName} op 19-06-2025 om 16:30)`
        ],
        generatedAt: `Rapport gegenereerd via www.mindnavigator.io op: ${format(new Date('2025-06-20T20:50:00'), 'd MMMM yyyy \'om\' HH:mm', { locale: nl })}`,
        sections: [
          {
            title: "1. Perceptie Gaten: Waar Zien Jullie Dingen Anders?",
            Icon: '🎯',
            id: 'gaps',
            items: [
              { title: "Focus op School:", text: "U geeft aan dat Sofie vaak moeite heeft met concentreren op schoolwerk. Sofie zelf ervaart dit minder als een algemeen probleem, en geeft aan dat het meer afhangt van de interesse in het vak; wiskunde kost haar bijvoorbeeld meer energie dan creatieve vakken, vooral tijdens huiswerk tussen 16:00-18:00. <i>(Mogelijkheid: Verschil in definitie van 'focus' of observatiemomenten.)</i>" },
              { title: "Sociale Interacties:", text: "U ziet Sofie als soms wat terughoudend in nieuwe groepen. Sofie beschrijft zichzelf als selectief in vriendschappen, maar comfortabel met de vrienden die ze heeft. <i>(Mogelijkheid: Interpretatieverschil tussen introversie en verlegenheid.)</i>" },
            ]
          },
          {
            title: "2. Waar Jullie Het Eens Zijn (Gedeelde Sterktes)",
            Icon: '💪',
            id: 'strengths',
            items: [
              { title: "Creativiteit:", text: "Zowel u als Sofie benoemen haar creatieve talenten. U noemt haar tekenvaardigheid, Sofie haar vermogen om originele verhalen te bedenken. <i>(Waarom dit belangrijk is: Dit is een krachtig, gedeeld fundament om op voort te bouwen en haar zelfvertrouwen te versterken.)</i>" },
              { title: "Doorzettingsvermogen:", text: "U ziet dat Sofie kan doorzetten als ze iets echt wil (bijv. sport). Sofie is trots op het feit dat ze een moeilijk project voor school heeft afgemaakt. <i>(Waarom dit belangrijk is: Het erkennen van doorzettingsvermogen helpt haar om toekomstige uitdagingen met meer veerkracht aan te gaan.)</i>" },
              { title: "Behulpzaamheid:", text: "U waardeert hoe Sofie helpt in huis. Sofie geeft aan graag anderen te helpen en voelt zich goed als ze dat doet. <i>(Waarom dit belangrijk is: Dit benadrukt haar sociale waarde en kan een bron van voldoening zijn.)</i>" },
            ]
          },
          {
            title: "3. Blinde Vlekken: Wat Ziet De Een, Wat De Ander (Nog) Niet Ziet?",
            Icon: '👁️',
            id: 'blind-spots',
            items: [
              { title: "Ouder ziet, Kind (nog) niet:", text: "U maakt zich zorgen over Sofie's slaappatroon en merkt op dat ze vaak tot laat op is. Sofie zelf geeft aan hier geen problemen mee te ervaren.", callout: { title: "💡 KANS", text: "Bespreek samen de impact van slaap op stemming en energie overdag, zonder oordeel." } },
              { title: "Kind ziet, Ouder (nog) niet:", text: "Sofie geeft aan soms overprikkeld te raken door geluid en drukte. Dit is een blinde vlek voor u, omdat u dit thuis minder observeert.", callout: { title: "💡 KANS", text: "Bespreek strategieën voor drukke omgevingen, zoals een koptelefoon, of even een rustig plekje opzoeken." } },
              { title: "Positieve blinde vlek:", text: "Zowel u als Sofie onderschatten mogelijk haar leiderschapskwaliteiten. U noemt dat ze 'soms de leiding neemt' en Sofie zegt 'af en toe te helpen met organiseren'. Dit kan een verborgen talent zijn dat meer aandacht verdient." }
            ]
          },
          {
            title: "4. Communicatie Kansen: Hoe Beter Afstemmen?",
            Icon: '💬',
            id: 'communication',
            items: [
              { title: "⭐ PROBEER DEZE WEEK:", text: "Vraag door op Sofie's ervaring met 'focus': \"Ik ben benieuwd, hoe voelt 'focus' voor jou? Wat helpt je om je aandacht erbij te houden, vooral bij wiskunde?\"" },
              { title: "⭐ PROBEER DEZE WEEK:", text: "Erken haar perspectief op vriendschap: \"Ik zie dat je het fijn hebt met je vrienden. Wat vind je belangrijk in een vriendschap? Dat vind ik interessant om te horen.\"" },
              { title: "⭐ PROBEER DEZE WEEK:", text: "Geef een specifiek compliment over doorzettingsvermogen: \"Wat knap hoe je dat moeilijke project hebt doorgezet, ook toen het even niet lukte! Ik ben trots op je.\"" }
            ]
          },
          {
            title: "5. Familie Actieplan: Concreet & Haalbaar",
            Icon: '📋',
            id: 'action-plan',
            items: [
              { title: "Wekelijks Creatief Uurtje", details: {"📅 Wanneer": "Zaterdag 10:00-11:00", "👤 Verantwoordelijk": "Sofie kiest, ouder faciliteert"} },
              { title: "Focus Plan Maken", details: {"🎯 Wat": "Pomodoro blokken van 25 min", "📍 Waar": "Keukentafel of studeerkamer"} },
              { title: "Prikkel Thermometer", details: {"💡 Hoe": "Maak een groen-oranje-rood thermometer voor op de koelkast. Sofie kan aangeven hoe 'vol' haar hoofd zit als startpunt voor een gesprek."} },
            ]
          },
          {
            title: "6. Volgende Stappen: Hoe Nu Verder?",
            Icon: '➡️',
            id: 'next-steps',
            items: [
              { title: "Check-in over 2 weken:", text: "Plan een kort, informeel moment om te bespreken hoe het actieplan gaat. Wat werkt goed, wat minder?" },
              { title: "Vervolgvragen om te stellen:", text: "\"Waar ben je deze week trots op qua schoolwerk?\" of \"Was er een moment waarop je je overprikkeld voelde? Wat hielp toen?\"" },
              { title: "Rapport opnieuw doen:", text: "Overweeg om deze vragenlijsten over 3-6 maanden opnieuw te doen om groei en veranderingen te zien." },
            ]
          },
          {
            title: "Hoe Werkt de AI Analyse?",
            Icon: '🤖',
            id: 'ai-explanation',
            items: [
              { title: "", text: "Onze AI is getraind om patronen te herkennen in de antwoorden van u en uw kind. Het legt de antwoorden op vergelijkbare thema's (zoals 'sociale interactie' of 'planning') naast elkaar. De AI bewaart geen individuele antwoorden, maar identificeert thematische verschillen en overeenkomsten. Op basis van deze patronen stelt het een rapport op met inzichten en suggesties, ontworpen om een constructief gesprek te faciliteren. Het is een hulpmiddel, geen oordeel." }
            ]
          },
           {
            title: "Disclaimer",
            Icon: '⚠️',
            id: 'disclaimer',
            items: [
              { title: "", text: "Dit rapport is gebaseerd op de antwoorden die zijn gegeven en dient ter indicatie en zelfreflectie. Het is nadrukkelijk geen vervanging voor een professionele diagnose of medisch advies. Raadpleeg een gekwalificeerde zorgverlener voor een formele diagnose of behandeling." }
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

      const checkY = (neededHeight: number): void => {
        if (y + neededHeight > pageHeight - margins.bottom) {
          doc.addPage();
          y = margins.top;
        }
      };
      
      const drawText = (text: string, x: number, yPos: number, options: any = {}) => {
          if (typeof text !== 'string') return yPos;
          const { fontSize = PDF_STYLES.normalSize, color = PDF_COLORS.foreground, maxWidth = usableWidth, fontStyle = 'normal' } = options;
          const lineHeight = fontSize * PDF_STYLES.lineHeightFactor * 0.4;
          
          doc.setFont(PDF_STYLES.fontFamily, fontStyle);
          doc.setFontSize(fontSize);
          doc.setTextColor(color[0], color[1], color[2]);
          
          const lines = doc.splitTextToSize(text, maxWidth);
          checkY(lines.length * lineHeight);
          
          doc.text(lines, x, yPos);
          
          doc.setFont(PDF_STYLES.fontFamily, 'normal'); // Reset font
          doc.setTextColor(...PDF_COLORS.foreground); // Reset color
          return yPos + (lines.length * lineHeight);
      };

      const drawFormattedText = (text: string, x: number, currentY: number, options: any) => {
          const { fontSize = PDF_STYLES.normalSize, maxWidth = usableWidth, color = PDF_COLORS.mutedForeground } = options;
          const lineHeight = fontSize * PDF_STYLES.lineHeightFactor * 0.4;
          const parts = text.split(/<\/?(strong|i)>/g).filter(Boolean);
          let currentLineX = x;
          let currentFont = { style: 'normal', color: color };
          const fontStyles = { '<strong>': 'bold', '<i>': 'italic', '</strong>': 'normal', '</i>': 'normal' };

          doc.setFontSize(fontSize);

          parts.forEach(part => {
              if (fontStyles[part as keyof typeof fontStyles]) {
                  currentFont.style = fontStyles[part as keyof typeof fontStyles];
                  return;
              }
              
              doc.setFont(PDF_STYLES.fontFamily, currentFont.style);
              doc.setTextColor(currentFont.color[0], currentFont.color[1], currentFont.color[2]);

              const words = part.split(' ');
              words.forEach(word => {
                  const wordWidth = doc.getStringUnitWidth(word) * fontSize / doc.internal.scaleFactor;
                  if (currentLineX + wordWidth > x + maxWidth) {
                      currentY += lineHeight;
                      currentLineX = x;
                      checkY(lineHeight);
                  }
                  doc.text(word, currentLineX, currentY);
                  currentLineX += wordWidth + (doc.getStringUnitWidth(' ') * fontSize / doc.internal.scaleFactor);
              });
          });

          return currentY;
      };

      const calculateTextHeight = (text: string, options: any) => {
          const { fontSize = PDF_STYLES.normalSize, maxWidth = usableWidth } = options;
          const doc = new jsPDF(); 
          doc.setFontSize(fontSize);
          const lines = doc.splitTextToSize(text.replace(/<[^>]*>?/gm, ''), maxWidth); 
          return lines.length * fontSize * PDF_STYLES.lineHeightFactor * 0.4;
      };

      // --- PDF Generation START ---
      y = drawText(reportContent.title, margins.left, y, { fontSize: PDF_STYLES.titleSize, fontStyle: 'bold', color: PDF_COLORS.primary });
      y = drawText(reportContent.subtitle, margins.left, y, { fontSize: PDF_STYLES.subtitleSize, color: PDF_COLORS.mutedForeground });
      y += PDF_STYLES.paragraphSpacing;
      y = drawText(reportContent.intro, margins.left, y);
      y += PDF_STYLES.sectionSpacing;
      
      const basedOnBoxHeight = calculateTextHeight(reportContent.basedOn.join('\n'), { fontSize: PDF_STYLES.smallSize }) + 12;
      checkY(basedOnBoxHeight);

      doc.setFillColor(...PDF_COLORS.gray.bg);
      doc.roundedRect(margins.left, y, usableWidth, basedOnBoxHeight, PDF_STYLES.cornerRadius, PDF_STYLES.cornerRadius, 'F');
      
      let basedOnY = y + 6;
      reportContent.basedOn.forEach(line => {
        basedOnY = drawText(line, margins.left + 5, basedOnY, { fontSize: PDF_STYLES.smallSize, color: PDF_COLORS.mutedForeground, maxWidth: usableWidth - 10 }) + 1;
      });
      y += basedOnBoxHeight + PDF_STYLES.sectionSpacing;
      
      reportContent.sections.forEach(section => {
        const titleHeight = calculateTextHeight(section.title, { fontSize: PDF_STYLES.h2Size, fontStyle: 'bold' });
        checkY(titleHeight + 10);
        y = drawText(`${section.Icon} ${section.title}`, margins.left, y, { fontSize: PDF_STYLES.h2Size, fontStyle: 'bold', color: PDF_COLORS.primary });
        y += PDF_STYLES.paragraphSpacing;

        section.items.forEach(item => {
          let content = item.title ? `<strong>${item.title}</strong> ${item.text || ''}` : item.text || '';
          if (item.callout) {
            content += `\n\n<i><strong>${item.callout.title}:</strong> ${item.callout.text}</i>`;
          }
           if (item.details) {
            const detailsText = Object.entries(item.details).map(([key, value]) => `• <strong>${key}:</strong> ${value}`).join('\n');
            content += `\n${detailsText}`;
          }

          const itemHeight = calculateTextHeight(content, {}) + PDF_STYLES.padding * 2;
          checkY(itemHeight);
          
          doc.setFillColor(section.id === 'disclaimer' ? PDF_COLORS.red.bg[0] : 255, section.id === 'disclaimer' ? PDF_COLORS.red.bg[1] : 255, section.id === 'disclaimer' ? PDF_COLORS.red.bg[2] : 255);
          doc.roundedRect(margins.left, y, usableWidth, itemHeight, PDF_STYLES.cornerRadius, PDF_STYLES.cornerRadius, 'F');
          
          let textY = y + PDF_STYLES.padding;
          textY = drawFormattedText(content, margins.left + PDF_STYLES.padding, textY, { maxWidth: usableWidth - PDF_STYLES.padding * 2 });
          y += itemHeight + PDF_STYLES.paragraphSpacing;
        });
        
        y += PDF_STYLES.sectionSpacing / 2;
      });
      
      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFont(PDF_STYLES.fontFamily, "italic");
        doc.setFontSize(PDF_STYLES.smallSize);
        doc.setTextColor(...PDF_COLORS.mutedForeground);
        const footerText = `${reportContent.generatedAt} | Pagina ${i} van ${pageCount}`;
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
                  <ReportSection title={section.title} Icon={AlertTriangle} iconColorClass={section.id === 'disclaimer' ? "text-destructive" : "text-primary"}>
                    <ul className="list-none space-y-4 pl-0">
                      {section.items.map((item, itemIndex) => (
                         <li key={itemIndex}>
                            {item.title && <strong className="font-semibold text-foreground/90 block mb-1">{item.title}</strong>}
                            <div className="text-muted-foreground" dangerouslySetInnerHTML={{ __html: item.text?.replace(/<i>/g, '<i class="text-muted-foreground/80">').replace(/<\/i>/g, '</i>') }} />
                            {item.callout && (
                                <Alert className="mt-2 bg-orange-50 border-orange-200 text-orange-800">
                                    <Lightbulb className="h-5 w-5 !text-orange-600"/>
                                    <AlertTitleUi className="font-semibold text-orange-700">{item.callout.title}</AlertTitleUi>
                                    <AlertDescUi>{item.callout.text}</AlertDescUi>
                                </Alert>
                            )}
                            {item.details && (
                               <div className="mt-2 pl-4 border-l-2 border-primary/30">
                                 {Object.entries(item.details).map(([key, value]) => (
                                   <p key={key} className="text-sm"><strong className="font-medium text-foreground/80">{key}:</strong> {value}</p>
                                 ))}
                               </div>
                            )}
                        </li>
                      ))}
                    </ul>
                  </ReportSection>
                </React.Fragment>
              ))}
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
