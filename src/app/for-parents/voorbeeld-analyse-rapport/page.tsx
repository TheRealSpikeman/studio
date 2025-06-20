
// src/app/for-parents/voorbeeld-analyse-rapport/page.tsx
"use client";

import React, { type ElementType } from 'react';
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
      title: "2. Waar Jullie Het Eens Zijn (Gedeelde Sterktes)",
      Icon: ThumbsUp,
      items: [
        { title: "Creativiteit:", text: "Zowel u als Sofie benoemen haar creatieve talenten. U noemt haar tekenvaardigheid, Sofie haar vermogen om originele verhalen te bedenken.", callout: "Waarom dit belangrijk is: Dit is een krachtig, gedeeld fundament om op voort te bouwen en haar zelfvertrouwen te versterken." },
        { title: "Doorzettingsvermogen:", text: "U ziet dat Sofie kan doorzetten als ze iets echt wil (bijv. sport). Sofie is trots op het feit dat ze een moeilijk project voor school heeft afgemaakt.", callout: "Waarom dit belangrijk is: Het erkennen van doorzettingsvermogen helpt haar om toekomstige uitdagingen met meer veerkracht aan te gaan." },
        { title: "Behulpzaamheid:", text: "U waardeert hoe Sofie helpt in huis. Sofie geeft aan graag anderen te helpen en voelt zich goed als ze dat doet.", callout: "Waarom dit belangrijk is: Dit benadrukt haar sociale waarde en kan een bron van voldoening zijn." },
      ]
    },
    {
      id: 'blind-spots',
      title: "3. Blinde Vlekken: Wat Ziet De Een, Wat De Ander (Nog) Niet Ziet?",
      Icon: EyeOff,
      items: [
        { title: "Ouder ziet, Kind (nog) niet:", text: "U maakt zich zorgen over Sofie's slaappatroon en merkt op dat ze vaak tot laat op is. Sofie zelf geeft aan hier geen problemen mee te ervaren.", callout: "💡 KANS: Bespreek samen de impact van slaap op stemming en energie overdag, zonder oordeel." },
        { title: "Kind ziet, Ouder (nog) niet:", text: "Sofie geeft aan soms overprikkeld te raken door geluid en drukte. Dit is een blinde vlek voor u, omdat u dit thuis minder observeert.", callout: "💡 KANS: Bespreek strategieën voor drukke omgevingen, zoals een koptelefoon, of even een rustig plekje opzoeken." },
        { title: "Positieve blinde vlek:", text: "Zowel u als Sofie onderschatten mogelijk haar leiderschapskwaliteiten. U noemt dat ze 'soms de leiding neemt' en Sofie zegt 'af en toe te helpen met organiseren'. Dit kan een verborgen talent zijn dat meer aandacht verdient." }
      ]
    },
    {
      id: 'communication',
      title: "4. Communicatie Kansen: Hoe Beter Afstemmen?",
      Icon: MessageCircle,
      items: [
        { title: "⭐ PROBEER DEZE WEEK:", text: "Vraag door op Sofie's ervaring met 'focus': \"Ik ben benieuwd, hoe voelt 'focus' voor jou? Wat helpt je om je aandacht erbij te houden, vooral bij wiskunde?\"" },
        { title: "⭐ PROBEER DEZE WEEK:", text: "Erken haar perspectief op vriendschap: \"Ik zie dat je het fijn hebt met je vrienden. Wat vind je belangrijk in een vriendschap? Dat vind ik interessant om te horen.\"" },
        { title: "⭐ PROBEER DEZE WEEK:", text: "Geef een specifiek compliment over doorzettingsvermogen: \"Wat knap hoe je dat moeilijke project hebt doorgezet, ook toen het even niet lukte! Ik ben trots op je.\"" }
      ]
    },
    {
      id: 'action-plan',
      title: "5. Familie Actieplan: Concreet & Haalbaar",
      Icon: ClipboardList,
      items: [
        { title: "Wekelijks Creatief Uurtje", text: "", details: { "📅 Wanneer": "Zaterdag 10:00-11:00", "👤 Verantwoordelijk": "Sofie kiest, ouder faciliteert" } },
        { title: "Focus Plan Maken", text: "", details: { "🎯 Wat": "Pomodoro blokken van 25 min", "📍 Waar": "Keukentafel of studeerkamer" } },
        { title: "Prikkel Thermometer", text: "", details: { "💡 Hoe": "Maak een groen-oranje-rood thermometer voor op de koelkast. Sofie kan aangeven hoe 'vol' haar hoofd zit als startpunt voor een gesprek."} },
      ]
    },
    {
      id: 'next-steps',
      title: "6. Volgende Stappen: Hoe Nu Verder?",
      Icon: ArrowRight,
      items: [
        { title: "Check-in over 2 weken:", text: "Plan een kort, informeel moment om te bespreken hoe het actieplan gaat. Wat werkt goed, wat minder?" },
        { title: "Vervolgvragen om te stellen:", text: "\"Waar ben je deze week trots op qua schoolwerk?\" of \"Was er een moment waarop je je overprikkeld voelde? Wat hielp toen?\"" },
        { title: "Rapport opnieuw doen:", text: "Overweeg om deze vragenlijsten over 3-6 maanden opnieuw te doen om groei en veranderingen te zien." },
      ]
    },
    {
      id: 'ai-explanation',
      title: "Hoe Werkt de AI Analyse?",
      Icon: Bot,
      items: [
        { text: "Onze AI is getraind om patronen te herkennen in de antwoorden van u en uw kind. Het legt de antwoorden op vergelijkbare thema's (zoals 'sociale interactie' of 'planning') naast elkaar. De AI bewaart geen individuele antwoorden, maar identificeert thematische verschillen en overeenkomsten. Op basis van deze patronen stelt het een rapport op met inzichten en suggesties, ontworpen om een constructief gesprek te faciliteren. Het is een hulpmiddel, geen oordeel." }
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

const PDF_STYLES = {
  fontFamily: "Helvetica",
  pageMargins: { top: 18, bottom: 18, left: 15, right: 15 },
  lineHeightFactor: 1.4,
  paragraphSpacing: 4,
  sectionSpacing: 10,
  titleSize: 22,
  subtitleSize: 11,
  h2Size: 16,
  h3Size: 12,
  normalSize: 10,
  smallSize: 8,
  bulletRadius: 1,
  padding: 8,
  cornerRadius: 3,
};

const PDF_COLORS = {
  primary: [229, 113, 37],
  accent: [26, 188, 156],
  foreground: [23, 23, 23],
  mutedForeground: [100, 116, 139],
  background: [248, 250, 252],
  cardBg: [255, 255, 255],
  border: [226, 232, 240],
  gray: { bg: [241, 245, 249], border: [203, 213, 225] },
  yellow: { bg: [254, 249, 195], border: [253, 224, 71] },
  sectionDefault: { bg: [248, 250, 252] },
  sectionBlue: { bg: [239, 246, 255], border: [147, 197, 253], title: [29, 78, 216] },
  sectionGreen: { bg: [240, 253, 244], border: [134, 239, 172], title: [22, 101, 52] },
  sectionOrange: { bg: [255, 247, 237], border: [253, 186, 116], title: [194, 65, 12] },
};

export default function VoorbeeldAnalyseRapportPage() {
  const { toast } = useToast();

  const handlePdfDownloadClick = () => {
    try {
      const doc = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' });
      const pageHeight = doc.internal.pageSize.height;
      const pageWidth = doc.internal.pageSize.width;
      const margins = PDF_STYLES.pageMargins;
      const usableWidth = pageWidth - margins.left - margins.right;
      let y = margins.top;

      const checkPageBreak = (neededHeight: number) => {
        if (y + neededHeight > pageHeight - margins.bottom) {
          doc.addPage();
          y = margins.top;
          return true; // Page break occurred
        }
        return false;
      };

      const drawFormattedText = (text: string, x: number, yPos: number, options: any = {}) => {
        const {
          fontSize = PDF_STYLES.normalSize,
          color = PDF_COLORS.foreground,
          maxWidth = usableWidth,
          fontStyle = 'normal'
        } = options;
        const lineHeight = fontSize * PDF_STYLES.lineHeightFactor * 0.352778;
      
        doc.setFont(PDF_STYLES.fontFamily, fontStyle);
        doc.setFontSize(fontSize);
        doc.setTextColor(color[0], color[1], color[2]);
      
        const lines = doc.splitTextToSize(text, maxWidth);
        let totalHeight = 0;
        lines.forEach((line: string) => {
          checkPageBreak(lineHeight);
          doc.text(line, x, y);
          y += lineHeight;
          totalHeight += lineHeight;
        });
      
        doc.setFont(PDF_STYLES.fontFamily, 'normal');
        return totalHeight;
      };

      // --- PDF Generation START ---
      y += drawFormattedText(reportContent.title, margins.left, y, { fontSize: PDF_STYLES.titleSize, fontStyle: 'bold', color: PDF_COLORS.primary });
      y += drawFormattedText(reportContent.subtitle, margins.left, y, { fontSize: PDF_STYLES.subtitleSize, color: PDF_COLORS.mutedForeground });
      y += PDF_STYLES.paragraphSpacing;
      
      y += drawFormattedText(reportContent.intro, margins.left, y, {});
      y += PDF_STYLES.sectionSpacing;
      
      const basedOnText = reportContent.basedOn.join('\n');
      const textLines = doc.splitTextToSize(basedOnText, usableWidth - PDF_STYLES.padding * 2);
      const basedOnHeight = (textLines.length * (PDF_STYLES.smallSize * PDF_STYLES.lineHeightFactor * 0.352778)) + PDF_STYLES.padding * 2;
      checkPageBreak(basedOnHeight);
      doc.setFillColor(PDF_COLORS.gray.bg[0], PDF_COLORS.gray.bg[1], PDF_COLORS.gray.bg[2]);
      doc.roundedRect(margins.left, y, usableWidth, basedOnHeight, PDF_STYLES.cornerRadius, PDF_STYLES.cornerRadius, 'F');
      let basedOnY = y + PDF_STYLES.padding;
      reportContent.basedOn.forEach(line => {
        const height = drawFormattedText(line, margins.left + PDF_STYLES.padding, basedOnY, { fontSize: PDF_STYLES.smallSize, color: PDF_COLORS.mutedForeground, maxWidth: usableWidth - PDF_STYLES.padding * 2 });
        basedOnY += height;
      });
      y += basedOnHeight + PDF_STYLES.sectionSpacing;

      reportContent.sections.forEach(section => {
        const headerHeight = (PDF_STYLES.h2Size * PDF_STYLES.lineHeightFactor * 0.352778) + PDF_STYLES.paragraphSpacing + 4;
        let itemsHeight = 0;
        
        section.items.forEach(item => {
          let itemHeight = PDF_STYLES.paragraphSpacing;
          if (item.title) itemHeight += (PDF_STYLES.h3Size * PDF_STYLES.lineHeightFactor * 0.352778) + 2;
          itemHeight += (doc.splitTextToSize(item.text, usableWidth - PDF_STYLES.padding * 2 - 5).length * (PDF_STYLES.normalSize * PDF_STYLES.lineHeightFactor * 0.352778));
          if (item.details) itemHeight += (Object.keys(item.details).length * (PDF_STYLES.normalSize * PDF_STYLES.lineHeightFactor * 0.352778)) + 2;
          if (item.callout) itemHeight += (doc.splitTextToSize(item.callout, usableWidth - PDF_STYLES.padding * 2 - 8).length * (PDF_STYLES.smallSize * PDF_STYLES.lineHeightFactor * 0.352778)) + 6;
          itemsHeight += itemHeight;
        });
        
        const sectionHeight = headerHeight + itemsHeight + PDF_STYLES.padding * 2;
        checkPageBreak(sectionHeight);
        
        doc.setFillColor(PDF_COLORS.sectionDefault.bg[0], PDF_COLORS.sectionDefault.bg[1], PDF_COLORS.sectionDefault.bg[2]);
        doc.roundedRect(margins.left, y, usableWidth, sectionHeight - PDF_STYLES.paragraphSpacing, PDF_STYLES.cornerRadius, PDF_STYLES.cornerRadius, 'F');
        
        let contentY = y + PDF_STYLES.padding + 2;
        contentY += drawFormattedText(section.title, margins.left + PDF_STYLES.padding, contentY, { fontSize: PDF_STYLES.h2Size, fontStyle: 'bold', color: PDF_COLORS.primary });
        contentY += PDF_STYLES.paragraphSpacing;

        section.items.forEach(item => {
            if (item.title) {
                contentY += drawFormattedText(item.title, margins.left + PDF_STYLES.padding + 5, contentY, { fontSize: PDF_STYLES.h3Size, fontStyle: 'bold' });
                contentY += 2;
            }
            if (item.text) {
                contentY += drawFormattedText(item.text, margins.left + PDF_STYLES.padding + 5, contentY, { maxWidth: usableWidth - PDF_STYLES.padding * 2 - 10 });
            }
            if (item.details) {
                const detailsText = Object.entries(item.details).map(([key, value]) => `• ${key}: ${value}`).join('\n');
                contentY += drawFormattedText(detailsText, margins.left + PDF_STYLES.padding + 8, contentY, { maxWidth: usableWidth - PDF_STYLES.padding * 2 - 13 });
            }
            if (item.callout) {
                const calloutHeight = (doc.splitTextToSize(item.callout, usableWidth - PDF_STYLES.padding*2 - 16).length * (PDF_STYLES.smallSize * PDF_STYLES.lineHeightFactor * 0.352778)) + 8;
                checkPageBreak(contentY + calloutHeight + 4);
                doc.setFillColor(PDF_COLORS.yellow.bg[0], PDF_COLORS.yellow.bg[1], PDF_COLORS.yellow.bg[2]);
                doc.roundedRect(margins.left + PDF_STYLES.padding, contentY, usableWidth - PDF_STYLES.padding*2, calloutHeight, 2, 2, 'F');
                let calloutY = contentY + 4;
                contentY += drawFormattedText(item.callout, margins.left + PDF_STYLES.padding + 4, calloutY, { fontStyle: 'italic', fontSize: PDF_STYLES.smallSize, color: PDF_COLORS.mutedForeground, maxWidth: usableWidth - PDF_STYLES.padding*2 - 16 });
            }
            contentY += PDF_STYLES.paragraphSpacing;
        });

        y += sectionHeight;
      });

      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(PDF_STYLES.smallSize);
        doc.setTextColor(PDF_COLORS.mutedForeground[0], PDF_COLORS.mutedForeground[1], PDF_COLORS.mutedForeground[2]);
        const footerText = `${reportContent.generatedAt} | Pagina ${i} van ${pageCount}`;
        doc.text(footerText, margins.left, pageHeight - 10);
      }
      
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
                    <h2 className={`text-2xl font-semibold text-foreground mb-4 flex items-center gap-3`}>
                      <section.Icon className={`h-7 w-7 ${section.id === 'disclaimer' ? 'text-destructive' : 'text-primary'}`} />
                      {section.title}
                    </h2>
                    <Card className="bg-muted/30 border shadow-sm">
                      <CardContent className="p-6 text-base leading-relaxed text-foreground/90 space-y-4">
                        {section.items.map((item, itemIndex) => (
                           <div key={itemIndex}>
                            {item.title && <strong className="font-semibold text-foreground/90 block mb-1">{item.title}</strong>}
                            <div className="text-muted-foreground" dangerouslySetInnerHTML={{ __html: item.text?.replace(/\n/g, '<br/>') }} />
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
