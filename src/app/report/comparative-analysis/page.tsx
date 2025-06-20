// src/app/report/comparative-analysis/page.tsx
"use client";

import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

// --- DATA DEFINITION ---
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
        items: [
          { type: "Belangrijk Inzicht", text: "U geeft aan dat Sofie vaak moeite heeft met concentreren. Sofie zelf ervaart dit meer afhankelijk van de interesse in het vak. Dit biedt een kans om samen te onderzoeken welke onderwerpen haar energie geven en welke niet." },
          { type: "Reflectie", text: "U ziet Sofie als soms wat terughoudend. Sofie beschrijft zichzelf als selectief in vriendschappen, maar comfortabel met de vrienden die ze heeft. Dit kan een verschil in definitie zijn: wat u ziet als terughoudendheid, ervaart zij mogelijk als bewuste keuze." },
        ]
      },
      {
        id: 'strengths',
        title: "2. Gedeelde Sterktes: Wat Herkennen Jullie Beiden?",
        items: [
          { type: "Gedeelde Kracht", text: "Zowel u als Sofie benoemen haar creatieve talenten en het vermogen om originele verhalen te bedenken. Dit is een krachtig fundament dat kan worden ingezet om schoolwerk leuker te maken, bijvoorbeeld door visuele samenvattingen te maken." },
          { type: "Gedeelde Kracht", text: "U ziet dat Sofie kan doorzetten als ze iets echt wil. Sofie is trots op het afronden van moeilijke schoolprojecten. Benoem dit doorzettingsvermogen als een compliment om haar zelfvertrouwen te versterken." },
        ]
      },
      {
        id: 'blind-spots',
        title: "3. Blinde Vlekken & Kansen",
        items: [
          { type: "Reflectie", text: "U maakt zich zorgen over Sofie's slaappatroon. Sofie zelf ervaart hier geen problemen mee. Dit kan een goed startpunt zijn voor een open gesprek over dag- en nachtritme." },
          { type: "Actiekans", text: "Sofie geeft aan soms overprikkeld te raken door geluid en drukte. Dit is een mogelijke blinde vlek voor u. Bespreek strategieën voor drukke omgevingen, zoals het gebruik van een koptelefoon of het nemen van een korte pauze.", callout: true },
        ]
      },
      {
        id: 'communication',
        title: "4. Communicatie Tips: Hoe Beter Afstemmen?",
        items: [
          { type: "Gesprekstip", text: "In plaats van te zeggen \"Je moet je beter concentreren\", probeer te vragen: \"Ik zie dat wiskunde soms lastig is. Wat maakt het voor jou moeilijk?\"" },
          { type: "Gesprekstip", text: "Erken haar perspectief op vriendschap door te zeggen: \"Het is goed dat je weet welke vrienden bij je passen.\" Dit valideert haar gevoel en bouwt vertrouwen op." },
        ]
      },
      {
        id: 'action-plan',
        title: "5. Familie Actieplan: Concrete Stappen",
        actionItems: [
          { title: "Creatief Uurtje", details: [{ label: 'Wanneer:', text: "Elke zaterdag 10:00-11:00" }, { label: 'Wie:', text: "Sofie kiest activiteit, ouder faciliteert" }, { label: 'Waar:', text: "Keukentafel" }, { label: 'Duur:', text: "60 minuten" }] },
          { title: "Focus Sessie Plan", details: [{ label: 'Start:', text: "Direct na school (16:00)" }, { label: 'Duur:', text: "25 min werk + 5 min pauze" }, { label: 'Locatie:', text: "Rustige plek zonder afleiding" }, { label: 'Beloning:', text: "10 min vrije tijd na elke sessie" }] },
          { title: "Prikkel Thermometer", details: [{ label: 'Wat:', text: "Maak groen-oranje-rood thermometer" }, { label: 'Wanneer:', text: "Check-in elke avond voor het slapen" }, { label: 'Waar:', text: "Hang op een zichtbare plek, bv. koelkast" }] },
        ]
      },
      {
        id: 'next-steps',
        title: "6. Volgende Stappen: Hoe Nu Verder?",
        items: [
          { type: "Check-in over 2 weken:", text: "Plan een kort, informeel moment om te bespreken hoe het actieplan gaat. Wat werkt goed, wat minder?" },
          { type: "Vervolgvragen om te stellen:", text: "\"Waar ben je deze week trots op qua schoolwerk?\" of \"Was er een moment waarop je je overprikkeld voelde? Wat hielp toen?\"" },
        ]
      },
      {
        id: 'resources',
        title: "7. Extra Hulpbronnen",
        items: [
            { type: "Video", text: "Bekijk 'Pomodoro voor tieners' (2 min) op YouTube." },
            { type: "Artikel", text: "Lees 'Creativiteit stimuleren thuis' op onze blog." },
            { type: "Community", text: "Maak contact met Ouders van creatieve tieners." },
            { type: "Coach", text: "Boek een 15-min gratis consult met een gespecialiseerde coach." },
        ]
      }
    ]
};

// --- PDF STYLING ---
const styles = StyleSheet.create({
  page: { padding: 30, fontFamily: 'Helvetica', fontSize: 10, lineHeight: 1.5, color: '#333' },
  header: { textAlign: 'center', marginBottom: 20, borderBottomWidth: 1, borderBottomColor: '#e5e5e5', paddingBottom: 10 },
  logoText: { fontSize: 24, fontWeight: 'bold', color: '#E57125' },
  pageTitle: { fontSize: 28, fontWeight: 'bold', color: '#333' },
  pageSubtitle: { fontSize: 14, color: '#666', marginTop: 4 },
  reportInfo: { fontSize: 8, color: '#999', marginTop: 10, textAlign: 'center' },
  familyPhotoPlaceholder: { width: 100, height: 100, backgroundColor: '#f0f0f0', borderRadius: 50, alignSelf: 'center', marginTop: 15, justifyContent: 'center', alignItems: 'center' },
  familyPhotoText: { fontSize: 8, color: '#aaa', textAlign: 'center' },
  introText: { marginVertical: 20, padding: 12, backgroundColor: '#F0F9FF', borderLeftWidth: 4, borderLeftColor: '#3B82F6', borderRadius: 4, color: '#1E40AF' },
  section: { marginBottom: 24, breakInside: 'avoid' },
  sectionHeader: { display: 'flex', flexDirection: 'row', alignItems: 'center', marginBottom: 8, gap: 8 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#E57125' },
  sectionSummary: { fontStyle: 'italic', color: '#555', backgroundColor: '#f9fafb', borderWidth: 1, borderColor: '#e5e7eb', padding: 8, borderRadius: 4, marginBottom: 8 },
  itemContainer: { marginBottom: 8, paddingLeft: 12 },
  itemTitle: { fontWeight: 'bold', color: '#444' },
  itemText: { color: '#555' },
  calloutBox: { backgroundColor: '#FEF9C3', borderLeftWidth: 4, borderLeftColor: '#FBBF24', padding: 10, borderRadius: 4, marginVertical: 4 },
  actionPlanCard: { marginBottom: 10, padding: 12, borderWidth: 1, borderColor: '#93C5FD', backgroundColor: '#EFF6FF', borderRadius: 6, breakInside: 'avoid' },
  actionPlanTitle: { fontSize: 14, fontWeight: 'bold', color: '#1E40AF', textTransform: 'uppercase', marginBottom: 6 },
  actionDetailRow: { display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 6, fontSize: 9, color: '#374151', marginBottom: 2 },
  progressTrackerContainer: { marginTop: 8, paddingTop: 6, borderTopWidth: 1, borderTopColor: '#DBEAFE' },
  progressTrackerTitle: { fontSize: 9, fontWeight: 'bold', color: '#6B7280', marginBottom: 4 },
  progressTrackerItem: { fontSize: 9, color: '#6B7280', marginBottom: 2 },
  testimonialBox: { marginTop: 24, padding: 12, borderTopWidth: 2, borderTopStyle: 'dashed', borderTopColor: '#E57125', textAlign: 'center' },
  testimonialText: { fontStyle: 'italic', fontSize: 12, color: '#4B5563' },
  testimonialAuthor: { marginTop: 4, fontSize: 10, color: '#6B7280' },
  footer: { position: 'absolute', bottom: 15, left: 30, right: 30, textAlign: 'center', fontSize: 8, color: '#aaa', borderTopWidth: 1, borderTopColor: '#eee', paddingTop: 5 },
  pageNumber: { position: 'absolute', fontSize: 8, bottom: 5, left: 0, right: 30, textAlign: 'right', color: 'grey' }
});


// --- PDF DOCUMENT COMPONENT ---
const PDFReport = () => (
  <Document title={`Vergelijkende Analyse - ${reportData.childName}`}>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.logoText}>MindNavigator</Text>
        <Text style={styles.pageTitle}>{reportData.title}</Text>
        <Text style={styles.pageSubtitle}>{reportData.subtitle}</Text>
        <Text style={styles.reportInfo}>
          Rapport gegenereerd op: {reportData.reportDate.toLocaleDateString('nl-NL', { day: '2-digit', month: 'long', year: 'numeric' })}
        </Text>
        <View style={styles.familyPhotoPlaceholder}>
          <Text style={styles.familyPhotoText}>Voeg hier uw</Text>
          <Text style={styles.familyPhotoText}>gezinsfoto toe</Text>
        </View>
      </View>

      <Text style={styles.introText}>{reportData.intro}</Text>
      
      <View style={{...styles.itemContainer, backgroundColor: '#f9fafb', padding: 8, borderRadius: 4, marginBottom: 20}}>
        <Text style={{...styles.itemTitle, fontSize: 10}}>Gebaseerd op:</Text>
        <Text style={{fontSize: 9, color: '#4B5563'}}>• {reportData.basedOn.parentAnswers.count} antwoorden van {reportData.parentName} (focus op {reportData.basedOn.parentAnswers.focus})</Text>
        <Text style={{fontSize: 9, color: '#4B5563'}}>• {reportData.basedOn.childAnswers.count} antwoorden van {reportData.childName} (focus op {reportData.basedOn.childAnswers.focus})</Text>
        <Text style={{fontSize: 9, color: '#4B5563'}}>• {reportData.basedOn.agreements} belangrijke overeenkomsten gevonden</Text>
        <Text style={{fontSize: 9, color: '#4B5563'}}>• {reportData.basedOn.differences} verrassende verschillen ontdekt</Text>
      </View>

      {reportData.sections.map((section) => (
        <View key={section.id} style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
          </View>
          
          {section.items && section.items.map((item, itemIndex) => (
             <View key={itemIndex} style={item.callout ? styles.calloutBox : styles.itemContainer}>
                <Text style={styles.itemTitle}>{item.type}:</Text>
                <Text style={styles.itemText}>{item.text}</Text>
            </View>
          ))}
          
          {section.actionItems && section.actionItems.map((item, itemIndex) => (
            <View key={itemIndex} style={styles.actionPlanCard}>
                <Text style={styles.actionPlanTitle}>{item.title}</Text>
                <View style={{paddingLeft: 10}}>
                    {item.details.map((detail, detailIndex) => (
                        <Text key={detailIndex} style={styles.actionDetailRow}>{detail.label} {detail.text}</Text>
                    ))}
                    <View style={styles.progressTrackerContainer}>
                        <Text style={styles.progressTrackerTitle}>WEEK TRACKER</Text>
                        <Text style={styles.progressTrackerItem}>Week 1: Uitgeprobeerd</Text>
                        <Text style={styles.progressTrackerItem}>Week 2: Aangepast</Text>
                        <Text style={styles.progressTrackerItem}>Week 3: Routine gevonden</Text>
                        <Text style={styles.progressTrackerItem}>Week 4: Geëvalueerd</Text>
                    </View>
                </View>
            </View>
          ))}
        </View>
      ))}

      <View style={styles.testimonialBox}>
        <Text style={styles.testimonialText}>"Door dit rapport begrijp ik mijn dochter veel beter."</Text>
        <Text style={styles.testimonialAuthor}>- Marina, moeder van Lisa (14)</Text>
      </View>

      <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => (
        `Pagina ${pageNumber} / ${totalPages}`
      )} fixed />
      <View style={styles.footer} fixed>
        <Text>Gegenereerd door MindNavigator | www.mindnavigator.app</Text>
        <Text>Disclaimer: Dit rapport is een hulpmiddel en geen vervanging voor professioneel advies.</Text>
      </View>
    </Page>
  </Document>
);

function PDFViewerComponent() {
  const [isClient, setIsClient] = React.useState(false);
  
  React.useEffect(() => {
    setIsClient(true);
  }, []);
  
  if (!isClient) {
    return <div style={{width: '100%', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>Rapport laden...</div>;
  }

  // Dynamically import to avoid SSR issues
  const { PDFViewer } = require('@react-pdf/renderer');
  
  return (
    <PDFViewer style={{ width: '100%', height: '100vh', border: 'none' }}>
      <PDFReport />
    </PDFViewer>
  );
}

export default function VoorbeeldAnalyseRapportPageWrapper() {
  return <PDFViewerComponent />;
}
