// src/app/report/comparative-analysis/page.tsx
"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { SiteLogo } from '@/components/common/site-logo';
import { Printer, Target, ThumbsUp, EyeOff, MessageCircle, ClipboardList, CheckSquare, Calendar, User as UserIcon, MapPin, Clock, Star, Brain, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

// Restructured data for better rendering control
const reportContent = {
    title: "Vergelijkende Analyse",
    subtitle: "Inzichten voor Olivia Ouder en dochter Sofie",
    intro: "Dit rapport is zorgvuldig samengesteld om u als ouder inzicht te geven in de overeenkomsten en verschillen tussen uw perspectief en de zelfreflectie van uw kind. Het doel is om een brug te slaan, communicatie te bevorderen en concrete, gezamenlijke actiepunten te formuleren die bijdragen aan het welzijn en de ontwikkeling van Sofie.",
    basedOn: `Gebaseerd op 23 antwoorden van Olivia en 19 antwoorden van Sofie, voltooid op 18-06-2025.`,
    generatedAt: `Rapport gegenereerd op: ${new Date('2025-06-20T20:50:00').toLocaleDateString('nl-NL', { year: 'numeric', month: 'long', day: 'numeric' })}`,
    sections: [
      {
        id: 'gaps',
        title: "Perceptie Gaten",
        Icon: Target,
        summary: "Belangrijkste inzicht: De grootste verschillen liggen in de beleving van sociale situaties en de impact van schoolstress.",
        items: [
          { type: "[Inzicht]", text: "U geeft aan dat Sofie vaak moeite heeft met concentreren. Sofie zelf ervaart dit meer afhankelijk van de interesse in het vak. Dit verschil biedt een kans om samen te onderzoeken welke onderwerpen haar energie geven en welke niet." },
          { type: "[Inzicht]", text: "U ziet Sofie als soms wat terughoudend. Sofie beschrijft zichzelf als selectief in vriendschappen, maar comfortabel met de vrienden die ze heeft. Dit kan een verschil in definitie zijn: wat u ziet als terughoudendheid, ervaart zij mogelijk als bewuste keuze." },
        ]
      },
      {
        id: 'strengths',
        title: "Gedeelde Sterktes",
        Icon: ThumbsUp,
        summary: "Belangrijkste inzicht: Zowel ouder als kind erkennen de creativiteit en het doorzettingsvermogen als kernkwaliteiten.",
        items: [
          { type: "[Gedeelde Kracht]", text: "Zowel u als Sofie benoemen haar creatieve talenten en het vermogen om originele verhalen te bedenken. Dit is een krachtig fundament dat kan worden ingezet om schoolwerk leuker te maken, bijvoorbeeld door visuele samenvattingen te maken." },
          { type: "[Gedeelde Kracht]", text: "U ziet dat Sofie kan doorzetten als ze iets echt wil. Sofie is trots op het afronden van moeilijke schoolprojecten. Benoem dit doorzettingsvermogen als een compliment om haar zelfvertrouwen te versterken." },
        ]
      },
      {
        id: 'blind-spots',
        title: "Blinde Vlekken & Kansen",
        Icon: EyeOff,
        summary: "Belangrijkste inzicht: De impact van zintuiglijke overprikkeling is een mogelijke blinde vlek voor de ouder.",
        items: [
          { type: "[Reflectiepunt]", text: "U maakt zich zorgen over Sofie's slaappatroon. Sofie zelf ervaart hier geen problemen mee. Dit kan een goed startpunt zijn voor een open gesprek over dag- en nachtritme." },
          { type: "[KANS]", callout: true, text: "Sofie geeft aan soms overprikkeld te raken door geluid en drukte. Dit is een mogelijke blinde vlek voor u. Bespreek strategieën voor drukke omgevingen, zoals het gebruik van een koptelefoon of het nemen van een korte pauze." },
        ]
      },
      {
        id: 'communication',
        title: "Communicatie Tips",
        Icon: MessageCircle,
        summary: "Belangrijkste inzicht: Focus op open vragen en het erkennen van haar perspectief om het gesprek te openen.",
        items: [
          { type: "[Communicatie Tip]", text: "In plaats van te zeggen \"Je moet je beter concentreren\", probeer te vragen: \"Ik zie dat wiskunde soms lastig is. Wat maakt het voor jou moeilijk?\"" },
          { type: "[Communicatie Tip]", text: "Erken haar perspectief op vriendschap door te zeggen: \"Het is goed dat je weet welke vrienden bij je passen.\" Dit valideert haar gevoel en bouwt vertrouwen op." },
        ]
      },
      {
        id: 'action-plan',
        title: "Familie Actieplan",
        Icon: ClipboardList,
        summary: "Een reeks concrete, haalbare acties om direct mee aan de slag te gaan.",
        actionItems: [
          { title: "ACTIE 1: CREATIEF UURTJE", details: [{ icon: Calendar, text: "Elke zaterdag 10-11u" }, { icon: UserIcon, text: "Sofie kiest activiteit" }, { icon: MapPin, text: "Keukentafel" }, { icon: Clock, text: "60 minuten" }] },
          { title: "ACTIE 2: FOCUS PLAN MAKEN", details: [{ icon: Target, text: "Pomodoro blokken (25 min)" }, { icon: Clock, text: "Start direct na school" }, { icon: MapPin, text: "Bureau" }] },
          { title: "ACTIE 3: PRIKKEL THERMOMETER", details: [{ icon: Brain, text: "Maak groen-oranje-rood thermometer" }, { icon: Calendar, text: "Check-in elke avond" }, { icon: MapPin, text: "Op de koelkast" }] },
        ]
      },
       {
        id: 'next-steps',
        title: "Volgende Stappen",
        Icon: ArrowRight,
        summary: "Hoe nu verder? Maak het concreet en plan een opvolgmoment.",
        items: [
          { type: "**PROBEER DEZE WEEK**", callout: true, text: "Kies één actiepunt uit het Familie Actieplan om deze week mee te starten. Begin klein!" },
          { type: "Vervolgvragen om te stellen:", text: "\"Waar ben je deze week trots op qua schoolwerk?\" of \"Was er een moment waarop je je overprikkeld voelde? Wat hielp toen?\"" },
          { type: "PLAN NU IN JE AGENDA:", callout: true, text: "Datum: [  /  /2025]\nTijd: [  :  ]\nDuur: 15 minuten\nWie: Sofie + ouder\nOnderwerp: Hoe ging het creatieve uurtje?" }
        ]
      },
    ]
};

export default function ComparativeAnalysisReportPage() {
    return (
        <div className="bg-gray-100 text-gray-800 font-sans p-4 sm:p-8 report-body">
            <header className="flex justify-between items-start mb-8 print-hide">
                <SiteLogo />
                <Button onClick={() => window.print()}>
                    <Printer className="mr-2 h-4 w-4" />
                    Print of Bewaar als PDF
                </Button>
            </header>
            
            <main className="max-w-4xl mx-auto bg-white p-10 shadow-lg rounded-lg">
                <div className="text-center mb-10 border-b pb-6 border-gray-200">
                    <div className="flex justify-center items-center gap-4 mb-4">
                        <SiteLogo iconClassName="h-10 w-10 text-primary" textClassName="text-3xl"/>
                    </div>
                    <h1 className="text-4xl font-bold text-gray-800">{reportContent.title}</h1>
                    <p className="text-lg text-gray-500 mt-2">{reportContent.subtitle}</p>
                    <div className="text-xs text-gray-400 mt-4">
                        <p>{reportContent.generatedAt}</p>
                        <p className="mt-1">{reportContent.basedOn}</p>
                    </div>
                     <div className="mt-6 flex justify-center items-center gap-4">
                        <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center text-gray-400 text-xs italic print-avoid-break">
                            Voeg hier uw<br/>gezinsfoto toe
                        </div>
                    </div>
                </div>

                <p className="text-base leading-relaxed mb-12 p-4 bg-blue-50 text-blue-800 rounded-lg border border-blue-200 print-avoid-break">
                    {reportContent.intro}
                </p>

                <div className="space-y-12">
                    {reportContent.sections.map((section) => {
                        const SectionIcon = section.Icon;
                        return (
                            <div key={section.id} className="print-avoid-break">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="flex-shrink-0 bg-primary text-white w-12 h-12 rounded-full flex items-center justify-center">
                                        <SectionIcon className="h-7 w-7" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-primary">{section.title}</h2>
                                </div>

                                <Card className="mb-4 bg-gray-50 border-gray-200 shadow-sm">
                                    <CardContent className="p-4">
                                        <p className="text-sm italic text-gray-600"><strong>Belangrijkste inzicht:</strong> {section.summary}</p>
                                    </CardContent>
                                </Card>
                                
                                {section.items && section.items.map((item, itemIndex) => (
                                    item.callout ? (
                                        <div key={itemIndex} className="my-4 p-4 bg-yellow-50 border-l-4 border-yellow-400 text-yellow-800 rounded-r-lg">
                                            <p className="font-bold">{item.type}</p>
                                            <p className="whitespace-pre-line">{item.text}</p>
                                        </div>
                                    ) : (
                                        <div key={itemIndex} className="mb-3 pl-4">
                                            <p className="font-semibold text-gray-700">{item.type}</p>
                                            <p className="text-gray-600">{item.text}</p>
                                        </div>
                                    )
                                ))}

                                {section.actionItems && section.actionItems.map((item, itemIndex) => (
                                    <div key={itemIndex} className="mb-4 p-4 border border-blue-200 bg-blue-50 rounded-lg shadow print-avoid-break">
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="w-6 h-6 border-2 border-blue-600 rounded-sm"></div>
                                            <h4 className="font-bold text-blue-800 text-lg uppercase">{item.title}</h4>
                                        </div>
                                        <div className="pl-9 space-y-1">
                                            {item.details.map((detail, detailIndex) => {
                                                const DetailIcon = detail.icon;
                                                return (
                                                <div key={detailIndex} className="flex items-center gap-2 text-sm text-blue-700">
                                                    <DetailIcon className="h-4 w-4"/>
                                                    <span>{detail.text}</span>
                                                </div>
                                            )})}
                                        </div>
                                    </div>
                                ))}

                                 {section.id === 'next-steps' && (
                                    <div className="mt-6 p-4 border-t-2 border-dashed border-gray-300">
                                         <p className="text-sm text-center text-gray-500">Dit rapport is het begin van een gesprek. Gebruik de inzichten om samen te groeien.</p>
                                    </div>
                                 )}
                            </div>
                        );
                    })}
                </div>
                 <div className="mt-12 pt-8 text-center border-t-2 border-primary">
                    <h3 className="text-xl font-semibold text-gray-700">"Door dit rapport begrijp ik mijn dochter veel beter."</h3>
                    <p className="text-sm text-gray-500 mt-1">- Marina, moeder van Lisa (14)</p>
                </div>

                 <footer className="text-center mt-12 pt-6 border-t border-gray-200">
                    <p className="text-sm text-gray-600">Gegenereerd door MindNavigator</p>
                    <p className="text-xs text-gray-400">www.mindnavigator.app</p>
                    <p className="text-xs text-gray-400 mt-4">Disclaimer: Dit rapport is een hulpmiddel en geen vervanging voor professioneel advies.</p>
                </footer>
            </main>
        </div>
    );
}
