// src/app/report/comparative-analysis/page.tsx
"use client";

import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { SiteLogo } from '@/components/common/site-logo';
import { Printer, Target, ThumbsUp, EyeOff, MessageCircle, ClipboardList, ArrowRight, Bot } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const reportContent = {
    title: "Vergelijkende Analyse",
    subtitle: "Inzichten voor Olivia Ouder en dochter Sofie",
    intro: "Dit rapport is zorgvuldig samengesteld om u als ouder inzicht te geven in de overeenkomsten en verschillen tussen uw perspectief en de zelfreflectie van uw kind. Het doel is om een brug te slaan, communicatie te bevorderen en concrete, gezamenlijke actiepunten te formuleren die bijdragen aan het welzijn en de ontwikkeling van Sofie.",
    basedOn: [
      `Ouder-quiz: "Ken je Kind" (ingevuld op 18-06-2025)`,
      `Kind-quiz: "Hoe zie ik mezelf?" (ingevuld op 19-06-2025)`
    ],
    generatedAt: `Rapport gegenereerd op: ${new Date('2025-06-20T20:50:00').toLocaleDateString('nl-NL', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}`,
    sections: [
      {
        id: 'gaps',
        title: "1. Perceptie Gaten: Waar Zien Jullie Dingen Anders?",
        Icon: Target,
        items: [
          { title: "Focus op School", text: "U geeft aan dat Sofie vaak moeite heeft met concentreren. Sofie zelf ervaart dit meer afhankelijk van de interesse in het vak." },
          { title: "Sociale Interacties", text: "U ziet Sofie als soms wat terughoudend. Sofie beschrijft zichzelf als selectief in vriendschappen, maar comfortabel met de vrienden die ze heeft." },
        ]
      },
      {
        id: 'strengths',
        title: "2. Gedeelde Sterktes: Waar Jullie Het Eens Zijn",
        Icon: ThumbsUp,
        items: [
          { title: "Creativiteit", text: "Zowel u als Sofie benoemen haar creatieve talenten en het vermogen om originele verhalen te bedenken. Dit is een krachtig fundament." },
          { title: "Doorzettingsvermogen", text: "U ziet dat Sofie kan doorzetten als ze iets echt wil. Sofie is trots op het afronden van moeilijke schoolprojecten." },
        ]
      },
      {
        id: 'blind-spots',
        title: "3. Blinde Vlekken & Kansen",
        Icon: EyeOff,
        items: [
          { type: "[Reflectiepunt]", text: "U maakt zich zorgen over Sofie's slaappatroon. Sofie zelf ervaart hier geen problemen mee. Dit kan een goed startpunt zijn voor een open gesprek over dag- en nachtritme." },
          { type: "[KANS]", text: "Sofie geeft aan soms overprikkeld te raken door geluid en drukte. Dit is een mogelijke blinde vlek voor u. Bespreek strategieën voor drukke omgevingen." },
        ]
      },
      {
        id: 'communication',
        title: "4. Communicatie Tips",
        Icon: MessageCircle,
        items: [
          { type: "[Communicatie Tip]", text: "In plaats van te zeggen \"Je moet je beter concentreren\", probeer te vragen: \"Ik zie dat wiskunde soms lastig is. Wat maakt het voor jou moeilijk?\"" },
          { type: "[Communicatie Tip]", text: "Erken haar perspectief op vriendschap door te zeggen: \"Het is goed dat je weet welke vrienden bij je passen.\" Dit valideert haar gevoel en bouwt vertrouwen op." },
        ]
      },
      {
        id: 'action-plan',
        title: "5. Familie Actieplan",
        Icon: ClipboardList,
        items: [
          { title: "Wekelijks Creatief Uurtje", details: { "📅 Wanneer": "Zaterdag 10:00-11:00", "👤 Wie": "Sofie kiest, ouder faciliteert" } },
          { title: "Focus Plan Maken", details: { "🎯 Wat": "Pomodoro blokken van 25 minuten", "📍 Waar": "Aan de keukentafel" } },
          { title: "Prikkel Thermometer", details: { "💡 Hoe": "Maak een groen-oranje-rood thermometer voor op de koelkast. Sofie kan aangeven hoe 'vol' haar hoofd zit."} },
        ]
      },
       {
        id: 'next-steps',
        title: "6. Volgende Stappen: Hoe Nu Verder?",
        Icon: ArrowRight,
        items: [
          { type: "**PROBEER DEZE WEEK**", text: "Plan een kort, informeel moment om te bespreken hoe het actieplan gaat. Wat werkt goed, wat minder?" },
          { type: "Vervolgvragen om te stellen:", text: "\"Waar ben je deze week trots op qua schoolwerk?\" of \"Was er een moment waarop je je overprikkeld voelde? Wat hielp toen?\"" },
        ]
      },
    ]
};

export default function ComparativeAnalysisReportPage() {
    
    useEffect(() => {
        // Automatically trigger print dialog on page load
        // window.print(); // Temporarily disabled for easier viewing/debugging
    }, []);

    return (
        <div className="bg-white text-gray-800 font-sans p-4 sm:p-8">
            <header className="flex justify-between items-center mb-8 print-hide">
                <SiteLogo />
                <Button onClick={() => window.print()}>
                    <Printer className="mr-2 h-4 w-4" />
                    Print of Bewaar als PDF
                </Button>
            </header>

            <main className="max-w-4xl mx-auto">
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-bold text-gray-900">{reportContent.title}</h1>
                    <p className="text-lg text-gray-600 mt-2">{reportContent.subtitle}</p>
                    <div className="text-xs text-gray-500 mt-4">
                        <p>{reportContent.generatedAt}</p>
                        <p className="mt-1">Gebaseerd op: {reportContent.basedOn.join('; ')}</p>
                    </div>
                </div>

                <p className="text-base leading-relaxed mb-10 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    {reportContent.intro}
                </p>

                <div className="space-y-8">
                    {reportContent.sections.map((section) => {
                        const SectionIcon = section.Icon;
                        return (
                            <Card key={section.id} className="shadow-md border-gray-200">
                                <CardHeader>
                                    <CardTitle className="text-2xl font-semibold text-primary flex items-center gap-3">
                                        <SectionIcon className="h-7 w-7" />
                                        {section.title}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {section.items.map((item, itemIndex) => (
                                        <div key={itemIndex} className="p-3 bg-white rounded-md border border-gray-100 shadow-sm">
                                            {item.title && <h4 className="font-semibold text-gray-800 mb-1">{item.title}</h4>}
                                            {item.text && <p className="text-gray-600">{item.text}</p>}
                                            {item.details && (
                                                <div className="mt-2 space-y-1">
                                                    {Object.entries(item.details).map(([key, value]) => (
                                                        <p key={key} className="text-sm"><strong className="text-gray-700">{key}:</strong> {value}</p>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                        );
                    })}
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