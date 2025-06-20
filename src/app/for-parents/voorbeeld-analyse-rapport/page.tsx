
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
    Lightbulb,
    MessageCircle,
    ThumbsUp,
    EyeOff,
    ClipboardList,
    AlertTriangle,
    Download,
    Bot,
    Target,
    ArrowRight
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { jsPDF } from 'jspdf';
import { format } from 'date-fns';
import { nl } from 'date-fns/locale';
import { PDFThemeProvider, usePDFTheme } from '@/contexts/PDFThemeContext';

interface ReportItem {
  title?: string;
  text: string;
  callout?: string;
  details?: Record<string, string>;
}

interface ReportSectionData {
  id: string;
  title: string;
  Icon: ElementType;
  items: ReportItem[];
}

// Updated data structure to be cleaner and more robust
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
      Icon: Target,
      items: [
        { title: "Focus op School:", text: "U geeft aan dat Sofie vaak moeite heeft met concentreren op schoolwerk. Sofie zelf ervaart dit minder als een algemeen probleem, en geeft aan dat het meer afhangt van de interesse in het vak; wiskunde kost haar bijvoorbeeld meer energie dan creatieve vakken, vooral tijdens huiswerk tussen 16:00-18:00.", callout: "Mogelijkheid: Verschil in definitie van 'focus' of observatiemomenten." },
        { title: "Sociale Interacties:", text: "U ziet Sofie als soms wat terughoudend in nieuwe groepen. Sofie beschrijft zichzelf als selectief in vriendschappen, maar comfortabel met de vrienden die ze heeft.", callout: "Mogelijkheid: Interpretatieverschil tussen introversie en verlegenheid." },
      ]
    },
    {
      id: 'strengths',
      title: "2. Gedeelde Sterktes: Waar Jullie Het Eens Zijn",
      Icon: ThumbsUp,
      items: [
        { title: "Creativiteit:", text: "Zowel u als Sofie benoemen haar creatieve talenten. U noemt haar tekenvaardigheid, Sofie haar vermogen om originele verhalen te bedenken.", callout: "Waarom dit belangrijk is: Dit is een krachtig, gedeeld fundament om op voort te bouwen en haar zelfvertrouwen te versterken." },
        { title: "Doorzettingsvermogen:", text: "U ziet dat Sofie kan doorzetten als ze iets echt wil (bijv. sport). Sofie is trots op het feit dat ze een moeilijk project voor school heeft afgemaakt.", callout: "Waarom dit belangrijk is: Het erkennen van doorzettingsvermogen helpt haar om toekomstige uitdagingen met meer veerkracht aan te gaan." },
        { title: "Behulpzaamheid:", text: "U waardeert hoe Sofie helpt in huis. Sofie geeft aan graag anderen te helpen en voelt zich goed als ze dat doet.", callout: "Waarom dit belangrijk is: Dit benadrukt haar sociale waarde en kan een bron van voldoening zijn." },
      ]
    },
    {
      id: 'blind-spots',
      title: "3. Blinde Vlekken: Wat Ziet De Een (Nog) Niet?",
      Icon: EyeOff,
      items: [
        { title: "Ouder ziet, Kind (nog) niet:", text: "U maakt zich zorgen over Sofie's slaappatroon en merkt op dat ze vaak tot laat op is. Sofie zelf geeft aan hier geen problemen mee te ervaren.", callout: "💡 KANS: Bespreek samen de impact van slaap op stemming en energie overdag, zonder oordeel." },
        { title: "Kind ziet, Ouder (nog) niet:", text: "Sofie geeft aan soms overprikkeld te raken door geluid en drukte. Dit is een blinde vlek voor u, omdat u dit thuis minder observeert.", callout: "💡 KANS: Bespreek strategieën voor drukke omgevingen, zoals een koptelefoon, of even een rustig plekje opzoeken." },
      ]
    },
    {
      id: 'communication',
      title: "4. Communicatie Kansen: Hoe Beter Afstemmen?",
      Icon: MessageCircle,
      items: [
        { title: "⭐ PROBEER DEZE WEEK:", text: "Vraag door op Sofie's ervaring met 'focus': \"Ik ben benieuwd, hoe voelt 'focus' voor jou? Wat helpt je om je aandacht erbij te houden, vooral bij wiskunde?\"" },
        { title: "⭐ PROBEER DEZE WEEK:", text: "Erken haar perspectief op vriendschap: \"Ik zie dat je het fijn hebt met je vrienden. Wat vind je belangrijk in een vriendschap? Dat vind ik interessant om te horen.\"" },
      ]
    },
    {
      id: 'action-plan',
      title: "5. Familie Actieplan: Concreet & Haalbaar",
      Icon: ClipboardList,
      items: [
        { title: "✅ Wekelijks Creatief Uurtje", details: { "Wanneer": "Zaterdag 10:00-11:00", "Verantwoordelijk": "Sofie kiest, ouder faciliteert" } },
        { title: "✅ Focus Plan Maken", details: { "Wat": "Pomodoro blokken van 25 min", "Waar": "Keukentafel of studeerkamer" } },
        { title: "✅ Prikkel Thermometer", details: { "Hoe": "Maak een groen-oranje-rood thermometer voor op de koelkast. Sofie kan aangeven hoe 'vol' haar hoofd zit als startpunt voor een gesprek."} },
      ]
    },
    {
      id: 'disclaimer',
      title: "Disclaimer",
      Icon: AlertTriangle,
      items: [
        { text: "Dit rapport is gebaseerd op de antwoorden die zijn gegeven en dient ter indicatie en zelfreflectie. Het is nadrukkelijk geen vervanging voor een professionele diagnose of medisch advies. Raadpleeg een gekwalificeerde zorgverlener voor een formele diagnose of behandeling." }
      ]
    },
  ] as ReportSectionData[],
};

// --- Page Component ---
function VoorbeeldAnalyseRapportPageContent() {
  const { toast } = useToast();
  const theme = usePDFTheme();

  const handlePdfDownloadClick = () => {
    try {
      const doc = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' });
      const { colors, styles } = theme;
      const { pageMargins, lineHeightFactor } = styles;
      const usableWidth = doc.internal.pageSize.width - pageMargins.left - pageMargins.right;
      let y = pageMargins.top;

      const checkPageBreak = (neededHeight: number) => {
        if (y + neededHeight > doc.internal.pageSize.height - pageMargins.bottom) {
          doc.addPage();
          y = pageMargins.top;
          return true;
        }
        return false;
      };

      const drawText = (text: string, x: number, yPos: number, options: any = {}) => {
        const {
          fontSize = styles.normalSize,
          color = colors.foreground,
          maxWidth = usableWidth,
          fontStyle = 'normal'
        } = options;
        const lineHeight = fontSize * lineHeightFactor * 0.352778;
        
        doc.setFont(styles.fontFamily, fontStyle);
        doc.setFontSize(fontSize);
        doc.setTextColor(color[0], color[1], color[2]);
        
        const lines = doc.splitTextToSize(text, maxWidth);
        let textBlockHeight = 0;
        lines.forEach((line: string) => {
          checkPageBreak(lineHeight);
          doc.text(line, x, y);
          y += lineHeight;
          textBlockHeight += lineHeight;
        });
        
        doc.setFont(styles.fontFamily, 'normal');
        doc.setTextColor(colors.foreground[0], colors.foreground[1], colors.foreground[2]);
        return textBlockHeight;
      };

      // --- PDF Generation START ---
      y += drawText(reportContent.title, pageMargins.left, y, { fontSize: styles.titleSize, fontStyle: 'bold', color: colors.primary });
      y += drawText(reportContent.subtitle, pageMargins.left, y, { fontSize: styles.subtitleSize, color: colors.mutedForeground });
      y += styles.paragraphSpacing;

      reportContent.sections.forEach(section => {
        // Estimate section height to check for page break before drawing card
        let estimatedHeight = styles.padding * 2 + styles.h2Size * 0.5 + styles.sectionSpacing;
        section.items.forEach(item => {
          if (item.title) estimatedHeight += styles.h3Size * 0.5 + 2;
          if (item.text) estimatedHeight += doc.splitTextToSize(item.text, usableWidth - styles.padding * 2).length * styles.normalSize * 0.5;
          if (item.details) estimatedHeight += Object.keys(item.details).length * styles.normalSize * 0.5 + 2;
          if (item.callout) estimatedHeight += doc.splitTextToSize(item.callout, usableWidth - styles.padding * 2 - 8).length * styles.smallSize * 0.5 + 8;
          estimatedHeight += styles.paragraphSpacing;
        });

        checkPageBreak(estimatedHeight);
        const sectionStartY = y;
        
        let contentY = y + styles.padding;
        
        // Draw section title
        contentY += drawText(section.title, pageMargins.left + styles.padding, contentY, { fontSize: styles.h2Size, fontStyle: 'bold', color: colors.primary });
        contentY += styles.paragraphSpacing / 2;

        // Draw section items
        section.items.forEach(item => {
          if (item.title) {
            contentY += drawText(item.title, pageMargins.left + styles.padding, contentY, { fontSize: styles.h3Size, fontStyle: 'bold' });
            contentY += 2;
          }
          if (item.text) {
            contentY += drawText(item.text, pageMargins.left + styles.padding, contentY, { color: colors.mutedForeground });
          }
          if (item.details) {
            Object.entries(item.details).forEach(([key, value]) => {
                const detailText = `• ${key}: ${value}`;
                contentY += drawText(detailText, pageMargins.left + styles.padding + 5, contentY);
            });
          }
           if (item.callout) {
                const calloutText = item.callout;
                const calloutHeight = doc.splitTextToSize(calloutText, usableWidth - (styles.padding * 2) - 8).length * (styles.smallSize * 0.5) + 8;
                doc.setFillColor(colors.yellow.bg[0], colors.yellow.bg[1], colors.yellow.bg[2]);
                doc.roundedRect(pageMargins.left + styles.padding, contentY + 2, usableWidth - styles.padding * 2, calloutHeight, 2, 2, 'F');
                contentY += drawText(calloutText, pageMargins.left + styles.padding + 4, contentY + 4, { fontStyle: 'italic', fontSize: styles.smallSize, color: colors.mutedForeground, maxWidth: usableWidth - styles.padding * 2 - 8 });
                contentY += 6; // Additional space after callout
            }
          contentY += styles.paragraphSpacing;
        });
        
        const sectionHeight = contentY - sectionStartY;

        // Draw the background card for the section
        doc.setFillColor(colors.gray.bg[0], colors.gray.bg[1], colors.gray.bg[2]);
        doc.roundedRect(pageMargins.left, sectionStartY, usableWidth, sectionHeight, styles.cornerRadius, styles.cornerRadius, 'F');
        
        // Re-draw text on top of background
        let redrawY = sectionStartY + styles.padding;
        redrawY += drawText(section.title, pageMargins.left + styles.padding, redrawY, { fontSize: styles.h2Size, fontStyle: 'bold', color: colors.primary });
        redrawY += styles.paragraphSpacing / 2;
        section.items.forEach(item => {
          if (item.title) {
             redrawY += drawText(item.title, pageMargins.left + styles.padding, redrawY, { fontSize: styles.h3Size, fontStyle: 'bold' });
             redrawY += 2;
          }
          if (item.text) redrawY += drawText(item.text, pageMargins.left + styles.padding, redrawY, { color: colors.mutedForeground });
          if (item.details) {
             Object.entries(item.details).forEach(([key, value]) => {
                const detailText = `• ${key}: ${value}`;
                redrawY += drawText(detailText, pageMargins.left + styles.padding + 5, redrawY);
            });
          }
          if (item.callout) {
                const calloutText = item.callout;
                const calloutHeight = doc.splitTextToSize(calloutText, usableWidth - (styles.padding * 2) - 8).length * (styles.smallSize * 0.5) + 8;
                doc.setFillColor(colors.yellow.bg[0], colors.yellow.bg[1], colors.yellow.bg[2]);
                doc.roundedRect(pageMargins.left + styles.padding, redrawY + 2, usableWidth - styles.padding * 2, calloutHeight, 2, 2, 'F');
                redrawY += drawText(calloutText, pageMargins.left + styles.padding + 4, redrawY + 4, { fontStyle: 'italic', fontSize: styles.smallSize, color: colors.mutedForeground, maxWidth: usableWidth - styles.padding * 2 - 8 });
                redrawY += 6;
            }
          redrawY += styles.paragraphSpacing;
        });

        y = sectionStartY + sectionHeight + styles.sectionSpacing;
      });

      // --- PDF Generation END ---
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
                      <section.Icon className={`h-7 w-7`} />
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
                            {item.callout && (
                                <div className="mt-3 bg-yellow-50/70 border-l-4 border-yellow-400 text-yellow-800 p-3 rounded-r-md">
                                    <p className="italic text-sm">{item.callout}</p>
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

// Wrap the main component with the provider
export default function VoorbeeldAnalyseRapportPage() {
  return (
    <PDFThemeProvider>
      <VoorbeeldAnalyseRapportPageContent />
    </PDFThemeProvider>
  );
}
