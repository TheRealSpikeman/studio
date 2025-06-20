// src/app/report/comparative-analysis/page.tsx
"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { SiteLogo } from '@/components/common/site-logo';
import {
    Target, ThumbsUp, EyeOff, MessageCircle, ClipboardList, CheckSquare, Calendar, User, Clock, MapPin, Download,
    Lightbulb, Sparkles, Info, ArrowRight, UserCheck, Gavel, ShieldCheck, Bot, Video, BookHeart, MessageCircleQuestion
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
    ],
    actionPlan: {
      title: "Familie Actieplan: Concrete Stappen voor Komende Weken",
      icon: ClipboardList,
      summary: "Dit actieplan biedt concrete, haalbare stappen om de inzichten uit dit rapport om te zetten in positieve verandering. Begin klein, wees consistent en vier de vooruitgang samen.",
      items: [
        {
          title: "Creatief Uurtje",
          details: [
            { icon: Calendar, label: "Wanneer:", value: "Elke zaterdag, 10:00-11:00" },
            { icon: User, label: "Wie:", value: "Sofie kiest een activiteit (tekenen, boetseren, schrijven)" },
            { icon: MapPin, label: "Waar:", value: "Keukentafel, vrij van afleidingen" },
            { icon: Clock, label: "Duur:", value: "60 minuten" }
          ],
          callout: { icon: Sparkles, type: "START VANDAAG", text: "Deze week: bespreek het idee met Sofie en laat haar de eerste activiteit kiezen. Leg de materialen vrijdag al klaar." },
          progress: ["Week 1: Uitgeprobeerd", "Week 2: Aangepast naar wat werkt", "Week 3: Routine gevonden", "Week 4: Geëvalueerd en verfijnd"]
        },
        {
          title: "Focus Sessie Plan",
          details: [
            { icon: Calendar, label: "Wanneer:", value: "Direct na school (ca. 16:00), 4 dagen per week" },
            { icon: User, label: "Wie:", value: "Sofie, zelfstandig" },
            { icon: MapPin, label: "Waar:", value: "Haar bureau, telefoon in een andere kamer" },
            { icon: Clock, label: "Duur:", value: "25 min werk + 5 min pauze (Pomodoro)" }
          ],
          callout: { icon: Lightbulb, type: "PROBEER DEZE WEEK", text: "Start met 2 sessies per dag en bouw dit langzaam op. Bespreek aan het eind van de week wat goed werkte en wat niet." },
          progress: ["Week 1: 2 sessies/dag geprobeerd", "Week 2: Opgehoogd naar 3 sessies", "Week 3: Routine gevonden", "Week 4: Geëvalueerd"]
        }
      ]
    },
    reflectionQuestions: [
        { icon: MessageCircleQuestion, question: "Wanneer zie ik het gedrag waar ik me zorgen over maak het meest?" },
        { icon: MessageCircleQuestion, question: "Wat werkte in het verleden goed om mijn kind te motiveren of te kalmeren?" },
        { icon: MessageCircleQuestion, question: "Op welke manier kan ik mijn waardering voor de unieke sterktes van mijn kind vaker uiten?" }
    ],
    extraResources: [
        { icon: Video, text: "Bekijk video: 'De Kracht van Fouten Maken'", link: "#" },
        { icon: BookHeart, text: "Lees artikel: 'Neurodiversiteit Thuis: Een Gids'", link: "#" },
        { icon: UsersIcon, text: "Community: Praat met andere ouders", link: "#" }
    ],
    testimonial: {
        quote: "Door dit rapport begrijp ik mijn dochter veel beter. De concrete actiepunten hebben echt geholpen om de sfeer thuis te verbeteren.",
        author: "Marina, moeder van Lisa (14)"
    },
    methodology: {
        title: "Methodologie & Disclaimer",
        icon: ShieldCheck,
        items: [
          { type: "Data Input", text: "De analyse in dit rapport is gebaseerd op een vergelijking van twee data-bronnen: 1) De antwoorden die u, de ouder, heeft gegeven in de 'Ken je Kind' vragenlijst. 2) De antwoorden die uw kind heeft gegeven in de 'Zelfreflectie Tool'." },
          { type: "Rol van AI", text: "Onze AI-assistent (draaiend op Google's Gemini-modellen) analyseert deze twee sets antwoorden om thematische overeenkomsten, verschillen in perceptie en mogelijke blinde vlekken te identificeren. Op basis van deze analyse genereert de AI de tekst voor de secties 'Perceptie Gaten', 'Gedeelde Sterktes', 'Blinde Vlekken' en het 'Familie Actieplan'." },
          { type: "Professionele Controle", text: "De onderliggende vragenlijsten en de structuur van het rapport zijn ontwikkeld in overleg met kinder- en jeugdpsychologen. De AI-output is ontworpen om te fungeren als een startpunt voor gesprek en reflectie, niet als een eindconclusie." },
          { type: "Belangrijke Disclaimer", text: "Dit rapport is een hulpmiddel en stelt nadrukkelijk geen medische of psychologische diagnose. Het vervangt geen professioneel advies van een gekwalificeerde zorgverlener. Bij zorgen over het welzijn of de ontwikkeling van uw kind, neem altijd contact op met uw huisarts, een psycholoog of een andere specialist." }
        ]
    }
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
            <header className="p-4 border-b print-hide flex justify-between items-center sticky top-0 bg-white/80 backdrop-blur-sm z-10">
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
                    <div className="w-24 h-24 mx-auto mb-4 relative">
                        <Image src="/logo-placeholder.png" alt="Gezinsfoto Placeholder" layout="fill" className="rounded-full object-cover border-4 border-primary/20" data-ai-hint="family photo" />
                    </div>
                    <h1 className="text-4xl font-bold text-gray-800">{reportData.title}</h1>
                    <p className="text-lg text-gray-600 mt-1">{reportData.subtitle}</p>
                    <p className="text-xs text-gray-400 mt-1">Rapport gegenereerd op: {reportData.reportDate.toLocaleDateString('nl-NL', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
                </div>
                
                <div className="mb-10 p-6 bg-blue-50/70 border border-blue-200 rounded-lg print-avoid-break shadow">
                    <h2 className="text-lg font-semibold text-blue-800 mb-2">Introductie</h2>
                    <p className="text-blue-900/80 leading-relaxed">{reportData.intro}</p>
                </div>

                <div className="mb-10 p-4 bg-yellow-50/70 border border-yellow-300 rounded-lg print-avoid-break text-center shadow-sm">
                    <h3 className="font-semibold text-yellow-800 flex items-center justify-center gap-2">
                        <Bot className="h-5 w-5" />
                        AI-Ondersteunde Analyse
                    </h3>
                    <p className="text-sm text-yellow-900/90 mt-1">
                        Dit rapport bevat analyses en aanbevelingen die deels zijn gegenereerd met behulp van kunstmatige intelligentie (AI). Lees de volledige methodologie onderaan voor meer details.
                    </p>
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

                {/* Action Plan Section */}
                <section className="mb-8 print-avoid-break bg-slate-50/50 p-6 rounded-lg border-l-4 border-accent shadow">
                    <h2 className="text-xl font-bold text-accent mb-4 flex items-center gap-3">
                        <ClipboardList className="h-7 w-7" />
                        {reportData.actionPlan.title}
                    </h2>
                    <p className="text-sm italic text-muted-foreground mb-6 pl-10">{reportData.actionPlan.summary}</p>
                    <div className="space-y-6">
                        {reportData.actionPlan.items.map((item, index) => (
                            <div key={index} className="bg-white p-4 rounded-lg border shadow-sm">
                                <h3 className="font-bold text-lg text-gray-800 mb-3">{`✅ ACTIE ${index + 1}: ${item.title}`}</h3>
                                <div className="grid grid-cols-2 gap-x-4 gap-y-2 mb-4 text-sm">
                                    {item.details.map((detail, dIndex) => {
                                        const DetailIcon = detail.icon;
                                        return (
                                            <div key={dIndex} className="flex items-start gap-2">
                                                <DetailIcon className="h-4 w-4 text-gray-500 mt-0.5" />
                                                <span className="text-gray-600"><strong className="text-gray-700">{detail.label}</strong> {detail.value}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                                <div className="bg-accent/10 p-3 rounded-md border border-accent/20">
                                    <h4 className="font-semibold text-accent flex items-center gap-2 mb-1"><item.callout.icon className="h-5 w-5"/>{item.callout.type}</h4>
                                    <p className="text-xs text-accent-foreground/80">{item.callout.text}</p>
                                </div>
                                <div className="mt-4 pt-3 border-t">
                                     <h4 className="font-semibold text-sm text-gray-600 mb-2">📊 Week Tracker</h4>
                                     <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-1 sm:space-y-0 text-sm">
                                         {item.progress.map((prog, pIndex) => (
                                             <label key={pIndex} className="flex items-center gap-2 text-gray-600">
                                                 <input type="checkbox" className="h-4 w-4 rounded border-gray-400 text-primary focus:ring-primary" />
                                                 {prog}
                                             </label>
                                         ))}
                                     </div>
                                 </div>
                            </div>
                        ))}
                    </div>
                </section>
                
                {/* Methodology Section */}
                <section className="mb-8 print-avoid-break bg-slate-50/50 p-6 rounded-lg border-l-4 border-gray-400 shadow">
                    <h2 className="text-xl font-bold text-gray-700 mb-2 flex items-center gap-3">
                        <reportData.methodology.icon className="h-7 w-7" />
                        {reportData.methodology.title}
                    </h2>
                    <div className="space-y-4 text-sm">
                        {reportData.methodology.items.map((item, index) => (
                            <div key={index} className="pl-4">
                                <h3 className="font-semibold text-foreground">{item.type}</h3>
                                <p className="text-muted-foreground pl-2">{item.text}</p>
                            </div>
                        ))}
                    </div>
                </section>


            </main>
            {/* Print-only footer */}
            <footer className="text-center p-6 mt-10 print-footer">
               <p className="text-sm text-gray-500">Gegenereerd door MindNavigator | www.mindnavigator.app</p>
               <p className="text-xs text-gray-400 mt-1">Disclaimer: Dit rapport is een hulpmiddel en geen vervanging voor professioneel advies.</p>
            </footer>
        </div>
    );
}
