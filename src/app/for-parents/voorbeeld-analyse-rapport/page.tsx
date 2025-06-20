
// src/app/for-parents/voorbeeld-analyse-rapport/page.tsx
"use client";

import React, { useState, useEffect, type ReactNode, type ElementType, Suspense } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
    ArrowLeft, Download, Bot, Target, ThumbsUp, EyeOff, MessageCircle, ClipboardList, ArrowRight
} from 'lucide-react';
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const reportContent = {
  title: "Vergelijkende Analyse",
  subtitle: "Inzichten voor Olivia Ouder en Sofie",
  intro: "Dit rapport is zorgvuldig samengesteld om u als ouder inzicht te geven in de overeenkomsten en verschillen tussen uw perspectief en de zelfreflectie van uw kind. Het doel is om een brug te slaan, communicatie te bevorderen en concrete, gezamenlijke actiepunten te formuleren die bijdragen aan het welzijn en de ontwikkeling van Sofie.",
  basedOn: [
    `Ouder-quiz: "Ken je Kind" (ingevuld op 18-06-2025)`,
    `Kind-quiz: "Hoe zie ik mezelf?" (ingevuld op 19-06-2025)`
  ],
  generatedAt: `Rapport gegenereerd op: ${new Date('2025-06-20T20:50:00').toLocaleDateString('nl-NL', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}`,
  sections: [
    {
      id: 'gaps',
      title: "Perceptie Gaten: Waar Zien Jullie Dingen Anders?",
      Icon: "🎯",
      items: [
        { title: "Focus op School", text: "U geeft aan dat Sofie vaak moeite heeft met concentreren. Sofie zelf ervaart dit meer afhankelijk van de interesse in het vak." },
        { title: "Sociale Interacties", text: "U ziet Sofie als soms wat terughoudend. Sofie beschrijft zichzelf als selectief in vriendschappen, maar comfortabel met de vrienden die ze heeft." },
      ]
    },
    {
      id: 'strengths',
      title: "Gedeelde Sterktes: Waar Jullie Het Eens Zijn",
      Icon: "💪",
      items: [
        { title: "Creativiteit", text: "Zowel u als Sofie benoemen haar creatieve talenten en het vermogen om originele verhalen te bedenken. Dit is een krachtig fundament." },
        { title: "Doorzettingsvermogen", text: "U ziet dat Sofie kan doorzetten als ze iets echt wil. Sofie is trots op het afronden van moeilijke schoolprojecten." },
      ]
    },
    {
      id: 'blind-spots',
      title: "Blinde Vlekken & Kansen",
      Icon: "👁️",
      items: [
        { type: "Reflectiepunt", text: "U maakt zich zorgen over Sofie's slaappatroon. Sofie zelf ervaart hier geen problemen mee. Dit kan een goed startpunt zijn voor een open gesprek over dag- en nachtritme." },
        { type: "Reflectiepunt", text: "Sofie geeft aan soms overprikkeld te raken door geluid en drukte. Dit is een mogelijke blinde vlek voor u. Bespreek strategieën voor drukke omgevingen." },
      ]
    },
    {
      id: 'communication',
      title: "Communicatie Tips",
      Icon: "💬",
      items: [
        { type: "Tip", text: "In plaats van te zeggen \"Je moet je beter concentreren\", probeer te vragen: \"Ik zie dat wiskunde soms lastig is. Wat maakt het voor jou moeilijk?\"" },
        { type: "Tip", text: "Erken haar perspectief op vriendschap door te zeggen: \"Het is goed dat je weet welke vrienden bij je passen.\" Dit valideert haar gevoel en bouwt vertrouwen op." },
      ]
    },
    {
      id: 'action-plan',
      title: "Familie Actieplan",
      Icon: "📋",
      items: [
        { title: "Wekelijks Creatief Uurtje", details: { "📅 Wanneer": "Zaterdag 10:00-11:00", "👤 Wie": "Sofie kiest, ouder faciliteert" } },
        { title: "Focus Plan Maken", details: { "🎯 Wat": "Pomodoro blokken van 25 minuten", "📍 Waar": "Aan de keukentafel" } },
        { title: "Prikkel Thermometer", details: { "💡 Hoe": "Maak een groen-oranje-rood thermometer voor op de koelkast. Sofie kan aangeven hoe 'vol' haar hoofd zit."} },
      ]
    },
     {
      id: 'next-steps',
      title: "Volgende Stappen",
      Icon: "➡️",
      items: [
        { type: "PROBEER DEZE WEEK", text: "Plan een kort, informeel moment om te bespreken hoe het actieplan gaat. Wat werkt goed, wat minder?" },
        { type: "Vervolgvragen", text: "\"Waar ben je deze week trots op qua schoolwerk?\" of \"Was er een moment waarop je je overprikkeld voelde? Wat hielp toen?\"" },
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
  ]
};

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 25,
    paddingVertical: 25,
    fontFamily: 'Helvetica',
    fontSize: 10,
    lineHeight: 1.5,
    color: '#334155', 
  },
  header: {
    textAlign: 'center',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    paddingBottom: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#E57125', 
  },
  subtitle: {
    fontSize: 14,
    color: '#64748B', 
    marginTop: 4,
  },
  metaInfo: {
    fontSize: 8,
    color: '#6B7280', 
    marginTop: 10,
    textAlign: 'center',
  },
  section: {
    marginBottom: 16,
    padding: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#F8FAFC',
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
    color: '#E57125',
  },
  item: {
    marginBottom: 10,
  },
  itemTitle: {
    fontWeight: 'bold',
    fontSize: 11,
    marginBottom: 2,
    color: '#1E293B',
  },
  itemText: {
    fontSize: 10,
    lineHeight: 1.5,
    paddingLeft: 4,
  },
  calloutBox: {
    backgroundColor: '#FEFCE8',
    borderLeftWidth: 3,
    borderLeftColor: '#FACC15',
    padding: 8,
    marginVertical: 4,
    borderRadius: 3,
  },
  calloutType: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#A16207', 
  },
  calloutText: {
    fontSize: 10,
    color: '#4B5563',
  },
  actionPlanItem: {
    marginBottom: 8,
  },
  actionDetails: {
    fontSize: 9,
    color: '#475569',
    paddingLeft: 12,
  },
  footer: {
    position: 'absolute',
    bottom: 15,
    left: 25,
    right: 25,
    textAlign: 'center',
    fontSize: 8,
    color: '#94A3B8',
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
       <View style={{ marginBottom: 15 }}>
        {data.basedOn.map((line, i) => (
          <Text key={i} style={styles.metaInfo}>• {line}</Text>
        ))}
        <Text style={styles.metaInfo}>{data.generatedAt}</Text>
      </View>

      {data.sections.map(section => (
        <View key={section.id} style={styles.section} wrap={false}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionIcon}>{section.Icon}</Text>
            <Text style={styles.sectionTitle}>{section.title}</Text>
          </View>
          {section.items.map((item, index) => (
            <View key={index} style={styles.item}>
              {item.type ? (
                 <View style={styles.calloutBox}>
                   <Text style={styles.calloutType}>{item.type}</Text>
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
                  <Text style={styles.itemText}>{item.text}</Text>
                </>
              )}
            </View>
          ))}
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
  return (
    <Suspense fallback={<div>Rapport laden...</div>}>
        <VoorbeeldAnalyseRapportPageContent />
    </Suspense>
  );
}
