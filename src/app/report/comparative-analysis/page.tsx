// src/app/report/comparative-analysis/page.tsx
"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { SiteLogo } from '@/components/common/site-logo';
import {
    Target, ThumbsUp, EyeOff, MessageCircle, ClipboardList, CheckSquare, Calendar, User, Clock, MapPin, Download,
    Lightbulb, Sparkles, Info, ArrowRight, UserCheck
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
        parentFocus: "gedrag en school",
        childFocus: "gevoelens en vriendschappen",
        parentAnswers: "23 antwoorden",
        childAnswers: "19 antwoorden",
        agreements: "3 belangrijke overeenkomsten",
        differences: "2 verrassende verschillen"
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
    ]
};

// Component for a single section
const ReportSection = ({ section, isLast }: { section: typeof reportData.sections[0], isLast: boolean }) => {
    const Icon = section.icon;
    return (
        <section className={cn("mb-8 print-avoid-break bg-slate-50/50 p-6 rounded-lg border-l-4 border-primary shadow", !isLast && "pb-8")}>
            <h2 className="text-xl font-bold text-primary mb-2 flex items-center gap-3">
                <Icon className="h-7 w-7" />
                {section.title}
            </h2>
            <p className="text-sm italic text-muted-foreground mb-4 pl-10">{section.summary}</p>
            <div className="space-y-4">
                {section.items && section.items.map((item, index) => (
                    <div key={index} className="pl-4">
                        <h3 className="font-semibold text-foreground flex items-center gap-2">{item.type}</h3>
                        <p className="text-muted-foreground pl-6">{item.text}</p>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default function ComparativeAnalysisReportPage() {
    return (
        <div className="bg-white text-black font-sans">
            {/* Screen-only header with print button */}
            <header className="p-8 border-b print-hide flex justify-between items-center">
                <SiteLogo />
                <Button onClick={() => window.print()}>
                    <Download className="mr-2 h-4 w-4" />
                    Print of Sla op als PDF
                </Button>
            </header>

             {/* Print-only header with logo */}
            <div className="hidden print-header">
                <SiteLogo className="logo-header" />
                <div className="text-right">
                  <p className="text-xs">Vertrouwelijk Rapport</p>
                  <p className="text-xs">MindNavigator</p>
                </div>
            </div>

            <main className="p-8 md:p-12 lg:p-16 max-w-4xl mx-auto print-main">
                <div className="text-center mb-10 print-avoid-break">
                    <h1 className="text-4xl font-bold text-gray-800">{reportData.title}</h1>
                    <p className="text-lg text-gray-600 mt-1">{reportData.subtitle}</p>
                    <p className="text-xs text-gray-400 mt-1">Rapport gegenereerd op: {reportData.reportDate.toLocaleDateString('nl-NL', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
                </div>
                
                <div className="mb-10 p-6 bg-blue-50/70 border border-blue-200 rounded-lg print-avoid-break shadow">
                    <h2 className="text-lg font-semibold text-blue-800 mb-2">Introductie</h2>
                    <p className="text-blue-900/80 leading-relaxed">{reportData.intro}</p>
                </div>
                
                <div className="mb-10 p-6 bg-gray-50/80 border border-gray-200 rounded-lg print-avoid-break shadow">
                    <h2 className="text-lg font-semibold text-gray-800 mb-2">Gebaseerd op:</h2>
                     <ul className="list-none text-gray-700 space-y-1">
                        <li><strong>Perspectief {reportData.parentName}:</strong> {reportData.basedOn.parentAnswers} (focus op {reportData.basedOn.parentFocus})</li>
                        <li><strong>Perspectief {reportData.childName}:</strong> {reportData.basedOn.childAnswers} (focus op {reportData.basedOn.childFocus})</li>
                         <li><strong>Overeenkomsten:</strong> {reportData.basedOn.agreements}</li>
                          <li><strong>Verschillen:</strong> {reportData.basedOn.differences}</li>
                    </ul>
                </div>

                {reportData.sections.map((section, index) => (
                    <ReportSection key={section.id} section={section} isLast={index === reportData.sections.length - 1}/>
                ))}

            </main>
            {/* Print-only footer */}
            <footer className="text-center p-6 mt-10 print-footer">
               <p className="text-sm text-gray-500">Gegenereerd door MindNavigator | www.mindnavigator.app</p>
               <p className="text-xs text-gray-400 mt-1">Disclaimer: Dit rapport is een hulpmiddel en geen vervanging voor professioneel advies.</p>
            </footer>
        </div>
    );
}
