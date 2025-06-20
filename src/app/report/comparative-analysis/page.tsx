// src/app/report/comparative-analysis/page.tsx
"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { SiteLogo } from '@/components/common/site-logo';
import {
    Target, ThumbsUp, EyeOff, MessageCircle, ClipboardList, Info, Users, CheckSquare, Calendar, User, Clock, MapPin, Download
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

// Data can be fetched or passed as props in a real scenario
const reportData = {
    title: "Vergelijkende Analyse",
    subtitle: "Inzichten voor Olivia Ouder en Sofie",
    parentName: "Olivia Ouder",
    childName: "Sofie",
    reportDate: new Date('2025-06-20T20:50:00'),
    intro: "Dit rapport is zorgvuldig samengesteld om u als ouder inzicht te geven in de overeenkomsten en verschillen tussen uw perspectief en de zelfreflectie van uw kind. Het doel is om een brug te slaan, communicatie te bevorderen en concrete, gezamenlijke actiepunten te formuleren die bijdragen aan het welzijn en de ontwikkeling van Sofie.",
    basedOn: {
        parentAnswers: "U heeft 23 vragen beantwoord, met een focus op gedrag en schoolprestaties.",
        childAnswers: "Sofie heeft 19 vragen beantwoord, met een focus op haar gevoelens en vriendschappen.",
        agreements: "We vonden 3 belangrijke overeenkomsten in jullie antwoorden.",
        differences: "We ontdekten 2 verrassende verschillen in hoe jullie de situatie zien."
    },
    sections: [
      {
        id: 'gaps',
        title: "Perceptie Gaten: Waar Zien Jullie Dingen Anders?",
        icon: Target,
        summary: "Verschillen in perceptie zijn normaal en bieden een kans voor een open gesprek.",
        items: [
          { type: "💡 Belangrijk Inzicht", text: "U geeft aan dat Sofie vaak moeite heeft met concentreren. Sofie zelf ervaart dit meer afhankelijk van de interesse in het vak. Dit biedt een kans om samen te onderzoeken welke onderwerpen haar energie geven en welke niet." },
          { type: "🤔 Reflectie", text: "U ziet Sofie als soms wat terughoudend. Sofie beschrijft zichzelf als selectief in vriendschappen, maar comfortabel met de vrienden die ze heeft. Dit kan een verschil in definitie zijn: wat u ziet als terughoudendheid, ervaart zij mogelijk als bewuste keuze." },
        ]
      },
      {
        id: 'strengths',
        title: "Gedeelde Sterktes: Wat Herkennen Jullie Beiden?",
        icon: ThumbsUp,
        summary: "Creativiteit en doorzettingsvermogen zijn krachtige, gedeelde sterktes.",
        items: [
          { type: "💪 Gedeelde Kracht", text: "Zowel u als Sofie benoemen haar creatieve talenten en het vermogen om originele verhalen te bedenken. Dit is een krachtig fundament dat kan worden ingezet om schoolwerk leuker te maken, bijvoorbeeld door visuele samenvattingen te maken." },
          { type: "💪 Gedeelde Kracht", text: "U ziet dat Sofie kan doorzetten als ze iets echt wil. Sofie is trots op het afronden van moeilijke schoolprojecten. Benoem dit doorzettingsvermogen als een compliment om haar zelfvertrouwen te versterken." },
        ]
      },
      {
        id: 'blind-spots',
        title: "Blinde Vlekken & Kansen",
        icon: EyeOff,
        summary: "De observaties over slaap en prikkelgevoeligheid bieden concrete aanknopingspunten voor actie.",
        items: [
          { type: "🤔 Reflectie", text: "U maakt zich zorgen over Sofie's slaappatroon. Sofie zelf ervaart hier geen problemen mee. Dit kan een goed startpunt zijn voor een open gesprek over dag- en nachtritme." },
          { type: "🎯 Actiekans", text: "Sofie geeft aan soms overprikkeld te raken door geluid en drukte. Dit is een mogelijke blinde vlek voor u. Bespreek strategieën voor drukke omgevingen, zoals het gebruik van een koptelefoon of het nemen van een korte pauze." },
        ]
      },
       {
        id: 'communication',
        title: "Communicatie Tips: Hoe Beter Afstemmen?",
        icon: MessageCircle,
        summary: "Focus op het stellen van open vragen en het valideren van haar perspectief.",
        items: [
          { type: "💬 Gesprekstip", text: "In plaats van te zeggen \"Je moet je beter concentreren\", probeer te vragen: \"Ik zie dat wiskunde soms lastig is. Wat maakt het voor jou moeilijk?\"" },
          { type: "💬 Gesprekstip", text: "Erken haar perspectief op vriendschap door te zeggen: \"Het is goed dat je weet welke vrienden bij je passen.\" Dit valideert haar gevoel en bouwt vertrouwen op." },
        ]
      },
      {
        id: 'action-plan',
        title: "Familie Actieplan: Concrete Stappen",
        icon: ClipboardList,
        summary: "Begin klein met haalbare, concrete acties om een positieve routine op te bouwen.",
        actionItems: [
          { title: "Creatief Uurtje", details: [{ icon: Calendar, label: 'Wanneer:', text: "Elke zaterdag 10:00-11:00" }, { icon: User, label: 'Wie:', text: "Sofie kiest activiteit" }, { icon: MapPin, label: 'Waar:', text: "Keukentafel" }, { icon: Clock, label: 'Duur:', text: "60 minuten" }] },
          { title: "Focus Sessie Plan", details: [{ icon: Calendar, label: 'Start:', text: "Direct na school (16:00)" }, { icon: Clock, label: 'Duur:', text: "25 min werk + 5 min pauze" }, { icon: MapPin, label: 'Locatie:', text: "Rustige plek zonder afleiding" }] },
          { title: "Prikkel Thermometer", details: [{ icon: Info, label: 'Wat:', text: "Maak groen-oranje-rood thermometer" }, { icon: Calendar, label: 'Wanneer:', text: "Check-in elke avond" }, { icon: MapPin, label: 'Waar:', text: "Hang op een zichtbare plek" }] },
        ]
      },
    ]
};

// Component for a single section
const ReportSection = ({ section }: { section: typeof reportData.sections[0] }) => {
    const Icon = section.icon;
    return (
        <section className="mb-8 print-avoid-break bg-slate-50/50 p-6 rounded-lg border">
            <h2 className="text-xl font-bold text-primary mb-3 flex items-center gap-2">
                <Icon className="h-6 w-6" />
                {section.title}
            </h2>
            <p className="text-sm italic text-muted-foreground mb-4 border-l-2 border-primary/50 pl-2">{section.summary}</p>
            <div className="space-y-4">
                {section.items && section.items.map((item, index) => (
                    <div key={index} className="pl-4">
                        <h3 className="font-semibold text-foreground">{item.type}</h3>
                        <p className="text-muted-foreground">{item.text}</p>
                    </div>
                ))}
                {section.actionItems && section.actionItems.map((item, index) => (
                     <div key={index} className="p-4 border rounded-md bg-background shadow-sm">
                        <h3 className="font-semibold text-primary mb-2 flex items-center gap-2"><CheckSquare className="h-5 w-5"/>{item.title}</h3>
                        <div className="space-y-1 text-sm text-muted-foreground">
                            {item.details.map((detail, detailIdx) => {
                                const DetailIcon = detail.icon;
                                return (
                                    <p key={detailIdx} className="flex items-center gap-2">
                                        <DetailIcon className="h-4 w-4"/>
                                        <strong className="text-foreground/80 w-20">{detail.label}</strong> 
                                        <span>{detail.text}</span>
                                    </p>
                                );
                            })}
                        </div>
                        <div className="mt-3 pt-3 border-t border-dashed">
                             <h4 className="text-xs font-bold text-muted-foreground mb-1">WEEK TRACKER</h4>
                             <div className="space-y-1 text-sm text-muted-foreground">
                                 <p>Week 1: ☐ Geprobeerd</p>
                                 <p>Week 2: ☐ Aangepast</p>
                                 <p>Week 3: ☐ Routine gevonden</p>
                             </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default function ComparativeAnalysisReportPage() {
    return (
        <div className="bg-white text-black font-sans">
            <header className="p-8 border-b print-hide flex justify-between items-center">
                <SiteLogo />
                <Button onClick={() => window.print()}>
                    <Download className="mr-2 h-4 w-4" />
                    Print of Sla op als PDF
                </Button>
            </header>
            <main className="p-8 md:p-12 lg:p-16 max-w-4xl mx-auto">
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-bold text-gray-800">{reportData.title}</h1>
                    <p className="text-lg text-gray-600 mt-1">{reportData.subtitle}</p>
                    <p className="text-xs text-gray-400 mt-1">Rapport gegenereerd op: {reportData.reportDate.toLocaleDateString('nl-NL', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
                </div>

                <div className="mb-10 p-6 bg-blue-50 border border-blue-200 rounded-lg">
                    <h2 className="text-lg font-semibold text-blue-800 mb-2">Introductie</h2>
                    <p className="text-blue-700 leading-relaxed">{reportData.intro}</p>
                </div>
                
                <div className="mb-10 p-6 bg-gray-50 border border-gray-200 rounded-lg">
                    <h2 className="text-lg font-semibold text-gray-800 mb-2">Gebaseerd op:</h2>
                     <ul className="list-disc list-inside text-gray-700 space-y-1">
                        <li><strong>Perspectief Ouder:</strong> {reportData.basedOn.parentAnswers}</li>
                        <li><strong>Perspectief Kind:</strong> {reportData.basedOn.childAnswers}</li>
                         <li><strong>Overeenkomsten:</strong> {reportData.basedOn.agreements}</li>
                          <li><strong>Verschillen:</strong> {reportData.basedOn.differences}</li>
                    </ul>
                </div>

                {reportData.sections.map((section) => (
                    <ReportSection key={section.id} section={section} />
                ))}

            </main>
            <footer className="text-center p-6 border-t mt-10">
                <p className="text-sm text-gray-500">Gegenereerd door MindNavigator | www.mindnavigator.app</p>
                <p className="text-xs text-gray-400 mt-1">Disclaimer: Dit rapport is een hulpmiddel en geen vervanging voor professioneel advies.</p>
            </footer>
        </div>
    );
}
