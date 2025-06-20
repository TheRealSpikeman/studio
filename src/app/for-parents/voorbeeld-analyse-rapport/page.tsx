// src/app/for-parents/voorbeeld-analyse-rapport/page.tsx
"use client";

import React, { useState, useEffect, type ReactNode, type ElementType } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
    ArrowLeft, Download, Bot, Target, ThumbsUp, EyeOff, MessageCircle, ClipboardList, ArrowRight
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { nl } from 'date-fns/locale';
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';

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
        { text: "[KANS] U maakt zich zorgen over Sofie's slaappatroon en merkt op dat ze vaak tot laat op is. Sofie zelf geeft aan hier geen problemen mee te ervaren. Dit kan een goed startpunt zijn voor een open gesprek over dag- en nachtritme." },
        { text: "[KANS] Sofie geeft aan soms overprikkeld te raken door geluid en drukte. Dit is een blinde vlek voor u, omdat u dit thuis minder observeert. Het bespreken van strategieën voor drukke omgevingen (school, feestjes) kan helpen." },
      ]
    },
    {
      id: 'communication',
      title: "4. Communicatie Kansen: Hoe Beter Afstemmen?",
      Icon: "💬",
      items: [
        { text: "[Communicatie Tip] In plaats van te zeggen \"Je moet je beter concentreren\", probeer te vragen: \"Ik zie dat wiskunde soms lastig is. Wat maakt het voor jou moeilijk en wat zou je helpen?\" Dit opent de dialoog." },
        { text: "[Communicatie Tip] Erken haar perspectief op vriendschap door te zeggen: \"Het is goed dat je weet welke vrienden bij je passen.\" Dit valideert haar gevoel en bouwt vertrouwen op." },
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
      id: 'next-steps',
      title: "6. Volgende Stappen: Hoe Nu Verder?",
      Icon: "➡️",
      items: [
        { title: "**PROBEER DEZE WEEK**:", text: "Plan een kort, informeel moment om te bespreken hoe het actieplan gaat. Wat werkt goed, wat minder?" },
        { title: "Vervolgvragen om te stellen:", text: "\"Waar ben je deze week trots op qua schoolwerk?\" of \"Was er een moment waarop je je overprikkeld voelde? Wat hielp toen?\"" },
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

// PDF Styling and Component
Font.register({
  family: 'Helvetica',
  fonts: [
    { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-regular-webfont.ttf', fontWeight: 'normal' },
    { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-bold-webfont.ttf', fontWeight: 'bold' },
    { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-italic-webfont.ttf', fontStyle: 'italic' },
    { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-bolditalic-webfont.ttf', fontWeight: 'bold', fontStyle: 'italic' },
  ],
});


const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 30,
    paddingTop: 30,
    paddingBottom: 20,
    fontFamily: 'Helvetica',
    fontSize: 10,
    lineHeight: 1.5,
    color: '#334155', // slate-700
  },
  header: {
    textAlign: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#E57125', // Primary color
  },
  subtitle: {
    fontSize: 14,
    color: '#64748B', // slate-500
    marginTop: 4,
  },
  introSection: {
    padding: 12,
    backgroundColor: '#FEF3F2', // Red-50 like
    borderLeftWidth: 4,
    borderLeftColor: '#F87171', // Red-400 like
    marginBottom: 15,
    borderRadius: 3,
  },
  introText: {
    fontSize: 9,
    color: '#4B5563', // gray-600
  },
  metaInfo: {
    fontSize: 8,
    color: '#6B7280', // gray-500
    marginTop: 8,
  },
  section: {
    marginBottom: 16,
  },
  sectionCard: {
    backgroundColor: '#F8FAFC', // slate-50
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0', // slate-200
    padding: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#E57125', // Primary color
  },
  item: {
    marginBottom: 10,
  },
  itemTitle: {
    fontWeight: 'bold',
    fontSize: 11,
    marginBottom: 2,
    color: '#1E293B', // slate-800
  },
  calloutBox: {
    backgroundColor: '#FEFCE8', // yellow-50
    borderLeftWidth: 3,
    borderLeftColor: '#FACC15', // yellow-400
    padding: 8,
    marginVertical: 4,
    borderRadius: 3,
  },
  calloutText: {
    fontSize: 9.5,
    fontStyle: 'italic',
    color: '#4B5563',
  },
  actionPlanItem: {
    marginBottom: 8,
  },
  actionDetails: {
    fontSize: 9,
    color: '#475569', // slate-600
    paddingLeft: 12,
  },
  footer: {
    position: 'absolute',
    bottom: 10,
    left: 30,
    right: 30,
    textAlign: 'center',
    fontSize: 8,
    color: '#94A3B8', // slate-400
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingTop: 5,
  },
});

const ReportPDF = ({ data }: { data: typeof reportContent }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.title}>{data.title}</Text>
        <Text style={styles.subtitle}>{data.subtitle}</Text>
      </View>

      <View style={styles.introSection}>
        <Text style={styles.introText}>{data.intro}</Text>
      </View>
       <View style={{ marginBottom: 15 }}>
        {data.basedOn.map((line, i) => (
          <Text key={i} style={styles.metaInfo}>• {line}</Text>
        ))}
        <Text style={styles.metaInfo}>{data.generatedAt}</Text>
      </View>

      {data.sections.map(section => (
        <View key={section.id} style={styles.section} wrap={false}>
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionIcon}>{section.Icon}</Text>
              <Text style={styles.sectionTitle}>{section.title}</Text>
            </View>
            {section.items.map((item, index) => (
              <View key={index} style={styles.item}>
                {item.isKans || item.isTip ? (
                  <View style={styles.calloutBox}>
                    <Text style={styles.calloutText}>{item.text}</Text>
                  </View>
                ) : item.details ? (
                  <View style={styles.actionPlanItem}>
                    <Text style={styles.itemTitle}>□ {item.title}</Text>
                     {Object.entries(item.details).map(([key, value]) => (
                       <Text key={key} style={styles.actionDetails}>{`${key}: ${value}`}</Text>
                     ))}
                  </View>
                ) : (
                  <>
                    {item.title && <Text style={styles.itemTitle}>• {item.title}</Text>}
                    <Text style={{ paddingLeft: item.title ? 8 : 0 }}>{item.text}</Text>
                  </>
                )}
              </View>
            ))}
          </View>
        </View>
      ))}
      
      <Text style={styles.footer} fixed>
        Gegenereerd door MindNavigator | www.mindnavigator.io | Pagina{' '}
        <Text render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} fixed />
      </Text>
    </Page>
  </Document>
);


function VoorbeeldAnalyseRapportPageContent() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

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
            {isClient ? (
              <PDFDownloadLink
                document={<ReportPDF data={reportContent} />}
                fileName={`vergelijkende_analyse_${reportContent.subtitle.split(' ')[2].toLowerCase()}.pdf`}
              >
                {({ loading }) => (
                  <Button disabled={loading}>
                    <Download className="mr-2 h-4 w-4" />
                    {loading ? 'Rapport genereren...' : 'Download als PDF'}
                  </Button>
                )}
              </PDFDownloadLink>
            ) : (
              <Button disabled>
                <Download className="mr-2 h-4 w-4" /> PDF laden...
              </Button>
            )}
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
                      <span className="text-2xl">{section.Icon}</span>
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
  return <VoorbeeldAnalyseRapportPageContent />;
}
