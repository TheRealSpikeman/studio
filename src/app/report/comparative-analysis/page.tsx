// src/app/report/comparative-analysis/page.tsx
"use client";

import React, { useEffect, useState } from 'react';
import { Page, Text, View, Document, StyleSheet, Font, Link as PdfLink } from '@react-pdf/renderer';

// --- DATA DEFINITION ---
// A clean, serializable object with no functions, components, or complex objects.
const reportData = {
    title: "Vergelijkende Analyse",
    subtitle: "Inzichten voor Olivia Ouder en Sofie",
    parentName: "Olivia Ouder",
    childName: "Sofie",
    reportDate: new Date('2025-06-20T20:50:00'),
    intro: "Dit rapport is zorgvuldig samengesteld om u als ouder inzicht te geven in de overeenkomsten en verschillen tussen uw perspectief en de zelfreflectie van uw kind. Het doel is om een brug te slaan, communicatie te bevorderen en concrete, gezamenlijke actiepunten te formuleren die bijdragen aan het welzijn en de ontwikkeling van Sofie.",
    basedOn: {
        parentAnswers: { count: 23, focus: "gedrag en school" },
        childAnswers: { count: 19, focus: "gevoelens en vrienden" },
        agreements: 3,
        differences: 2
    },
    sections: [
      {
        id: 'gaps',
        title: "1. Perceptie Gaten: Waar Zien Jullie Dingen Anders?",
        summary: "Belangrijkste inzicht: Verschillen in perceptie zijn normaal en bieden een kans voor een open gesprek.",
        items: [
          { type: "Belangrijk Inzicht", text: "U geeft aan dat Sofie vaak moeite heeft met concentreren. Sofie zelf ervaart dit meer afhankelijk van de interesse in het vak. Dit biedt een kans om samen te onderzoeken welke onderwerpen haar energie geven en welke niet." },
          { type: "Reflectie", text: "U ziet Sofie als soms wat terughoudend. Sofie beschrijft zichzelf als selectief in vriendschappen, maar comfortabel met de vrienden die ze heeft. Dit kan een verschil in definitie zijn: wat u ziet als terughoudendheid, ervaart zij mogelijk als bewuste keuze." },
        ]
      },
      {
        id: 'strengths',
        title: "2. Gedeelde Sterktes: Wat Herkennen Jullie Beiden?",
        summary: "Belangrijkste inzicht: Creativiteit en doorzettingsvermogen zijn krachtige, gedeelde sterktes.",
        items: [
          { type: "Gedeelde Kracht", text: "Zowel u als Sofie benoemen haar creatieve talenten en het vermogen om originele verhalen te bedenken. Dit is een krachtig fundament dat kan worden ingezet om schoolwerk leuker te maken, bijvoorbeeld door visuele samenvattingen te maken." },
          { type: "Gedeelde Kracht", text: "U ziet dat Sofie kan doorzetten als ze iets echt wil. Sofie is trots op het afronden van moeilijke schoolprojecten. Benoem dit doorzettingsvermogen als een compliment om haar zelfvertrouwen te versterken." },
        ]
      },
      {
        id: 'blind-spots',
        title: "3. Blinde Vlekken & Kansen",
        summary: "Belangrijkste inzicht: De observaties over slaap en prikkelgevoeligheid bieden concrete aanknopingspunten voor actie.",
        items: [
          { type: "Reflectiepunt", text: "U maakt zich zorgen over Sofie's slaappatroon. Sofie zelf ervaart hier geen problemen mee. Dit kan een goed startpunt zijn voor een open gesprek over dag- en nachtritme." },
          { type: "Actiekans", text: "Sofie geeft aan soms overprikkeld te raken door geluid en drukte. Dit is een mogelijke blinde vlek voor u. Bespreek strategieën voor drukke omgevingen, zoals het gebruik van een koptelefoon of het nemen van een korte pauze." },
        ]
      },
      {
        id: 'communication',
        title: "4. Communicatie Tips: Hoe Beter Afstemmen?",
        summary: "Belangrijkste inzicht: Focus op het stellen van open vragen en het valideren van haar perspectief.",
        items: [
          { type: "Gesprekstip", text: "In plaats van te zeggen \"Je moet je beter concentreren\", probeer te vragen: \"Ik zie dat wiskunde soms lastig is. Wat maakt het voor jou moeilijk?\"" },
          { type: "Gesprekstip", text: "Erken haar perspectief op vriendschap door te zeggen: \"Het is goed dat je weet welke vrienden bij je passen.\" Dit valideert haar gevoel en bouwt vertrouwen op." },
        ]
      },
      {
        id: 'action-plan',
        title: "5. Familie Actieplan: Concrete Stappen",
        summary: "Belangrijkste inzicht: Begin klein met haalbare, concrete acties om een positieve routine op te bouwen.",
        actionItems: [
          { title: "Creatief Uurtje", details: [{ label: 'Wanneer:', text: "Elke zaterdag 10:00-11:00" }, { label: 'Wie:', text: "Sofie kiest activiteit" }, { label: 'Waar:', text: "Keukentafel" }, { label: 'Duur:', text: "60 minuten" }] },
          { title: "Focus Sessie Plan", details: [{ label: 'Start:', text: "Direct na school (16:00)" }, { label: 'Duur:', text: "25 min werk + 5 min pauze" }, { label: 'Locatie:', text: "Rustige plek zonder afleiding" }] },
          { title: "Prikkel Thermometer", details: [{ label: 'Wat:', text: "Maak groen-oranje-rood thermometer" }, { label: 'Wanneer:', text: "Check-in elke avond" }, { label: 'Waar:', text: "Hang op een zichtbare plek" }] },
        ]
      },
    ]
};

// --- STYLING ---
const styles = StyleSheet.create({
    page: { padding: 30, fontFamily: 'Helvetica', fontSize: 10, lineHeight: 1.4, color: '#333' },
    header: { textAlign: 'center', marginBottom: 20 },
    logo: { fontSize: 14, color: '#E57125', fontWeight: 'bold' },
    pageTitle: { fontSize: 24, fontWeight: 'bold', color: '#111827', marginTop: 8 },
    pageSubtitle: { fontSize: 12, color: '#4B5563', marginTop: 4 },
    reportInfo: { fontSize: 8, color: '#9CA3AF', marginTop: 4 },
    photoPlaceholder: { width: 80, height: 80, backgroundColor: '#F3F4F6', borderRadius: 40, alignSelf: 'center', marginTop: 12, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#E5E7EB' },
    photoText: { fontSize: 8, color: '#9CA3AF' },
    section: { marginBottom: 20, breakInside: 'avoid' },
    sectionHeader: { display: 'flex', flexDirection: 'row', alignItems: 'center', marginBottom: 8, paddingBottom: 4, borderBottomWidth: 1, borderBottomColor: '#E5E7EB' },
    sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#E57125' },
    itemContainer: { marginBottom: 8, paddingLeft: 10 },
    itemTitle: { fontWeight: 'bold', color: '#374151', fontSize: 11, marginBottom: 2 },
    itemText: { color: '#4B5563' },
    calloutBox: { backgroundColor: '#FFFBEB', borderLeftWidth: 3, borderLeftColor: '#F59E0B', padding: 10, borderRadius: 4, marginVertical: 4 },
    actionPlanCard: { marginBottom: 10, padding: 12, borderWidth: 1, borderColor: '#BFDBFE', backgroundColor: '#EFF6FF', borderRadius: 6 },
    actionPlanTitle: { fontSize: 12, fontWeight: 'bold', color: '#1D4ED8', textTransform: 'uppercase', marginBottom: 6 },
    actionDetailRow: { display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 4, fontSize: 9, color: '#374151', marginBottom: 2 },
    actionDetailLabel: { fontWeight: 'bold' },
    weekTrackerContainer: { marginTop: 8, paddingTop: 6, borderTopWidth: 1, borderTopColor: '#DBEAFE' },
    weekTrackerTitle: { fontSize: 9, fontWeight: 'bold', color: '#6B7280', marginBottom: 4 },
    weekTrackerItem: { fontSize: 9, color: '#6B7280' },
    footer: { position: 'absolute', bottom: 15, left: 30, right: 30, textAlign: 'center', fontSize: 8, color: '#9CA3AF', borderTopWidth: 1, borderTopColor: '#F3F4F6', paddingTop: 5 },
    pageNumber: { position: 'absolute', fontSize: 8, bottom: 5, left: 0, right: 30, textAlign: 'right', color: '#9CA3AF' }
});


// --- PDF DOCUMENT COMPONENT ---
// A pure component that only renders the PDF structure based on data.
const PDFReport = () => (
    <Document title={`Vergelijkende Analyse - ${reportData.childName}`}>
        <Page size="A4" style={styles.page}>
            <View style={styles.header} fixed>
                <Text style={styles.logo}>MindNavigator</Text>
            </View>

            <View>
                <Text style={styles.pageTitle}>{reportData.title}</Text>
                <Text style={styles.pageSubtitle}>{reportData.subtitle}</Text>
                <Text style={styles.reportInfo}>Rapport gegenereerd op: {reportData.reportDate.toLocaleDateString('nl-NL', { day: '2-digit', month: 'long', year: 'numeric' })}</Text>
            </View>

            <View style={styles.photoPlaceholder}>
                <Text style={styles.photoText}>Gezinsfoto</Text>
            </View>

            <View style={styles.itemContainer}><Text style={styles.itemText}>{reportData.intro}</Text></View>

            {reportData.sections.map((section) => (
                <View key={section.id} style={styles.section} wrap={false}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>{section.title}</Text>
                    </View>
                    
                    {section.summary && <Text style={{...styles.itemText, fontStyle: 'italic', marginBottom: 8}}>{section.summary}</Text>}
                    
                    {section.items && section.items.map((item, itemIndex) => (
                        <View key={itemIndex} style={item.type === "Actiekans" ? styles.calloutBox : styles.itemContainer}>
                            <Text style={styles.itemTitle}>{item.type}:</Text>
                            <Text style={styles.itemText}>{item.text}</Text>
                        </View>
                    ))}
                    
                    {section.actionItems && section.actionItems.map((item, itemIndex) => (
                        <View key={itemIndex} style={styles.actionPlanCard}>
                            <Text style={styles.actionPlanTitle}>{item.title}</Text>
                            <View style={{paddingLeft: 10}}>
                                {item.details.map((detail, detailIndex) => (
                                    <View key={detailIndex} style={styles.actionDetailRow}>
                                        <Text style={styles.actionDetailLabel}>{detail.label}</Text>
                                        <Text>{detail.text}</Text>
                                    </View>
                                ))}
                                <View style={styles.weekTrackerContainer}>
                                    <Text style={styles.weekTrackerTitle}>WEEK TRACKER</Text>
                                    <Text style={styles.weekTrackerItem}>Week 1: ☐ Geprobeerd</Text>
                                    <Text style={styles.weekTrackerItem}>Week 2: ☐ Aangepast</Text>
                                    <Text style={styles.weekTrackerItem}>Week 3: ☐ Routine gevonden</Text>
                                </View>
                            </View>
                        </View>
                    ))}
                </View>
            ))}

            <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => `Pagina ${pageNumber} / ${totalPages}`} fixed />
            <View style={styles.footer} fixed>
                <Text>Gegenereerd door MindNavigator | www.mindnavigator.app</Text>
                <Text>Disclaimer: Dit rapport is een hulpmiddel en geen vervanging voor professioneel advies.</Text>
            </View>
        </Page>
    </Document>
);

// --- VIEWER COMPONENT ---
// This component ensures PDFViewer is only rendered on the client.
function PDFViewerComponent() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <div style={{width: '100%', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>Rapport laden...</div>;
  }

  // Dynamically import to avoid SSR issues.
  const { PDFViewer } = require('@react-pdf/renderer');
  
  return (
    <PDFViewer style={{ width: '100%', height: '100vh', border: 'none' }}>
      <PDFReport />
    </PDFViewer>
  );
}

// --- MAIN PAGE EXPORT ---
export default function VoorbeeldAnalyseRapportPageWrapper() {
  return <PDFViewerComponent />;
}
