// src/app/report/comparative-analysis/page.tsx
"use client";

import React, { type ReactNode, type ElementType } from 'react';
import { Button } from '@/components/ui/button';
import { SiteLogo } from '@/components/common/site-logo';
import {
    Target, ThumbsUp, EyeOff, MessageCircle, ClipboardList, Calendar, User, Clock, MapPin, Download,
    Lightbulb, Sparkles, Info, ArrowRight, UserCheck, Gavel, ShieldCheck, Bot, Video, BookHeart, MessageCircleQuestion, Users as UsersIcon
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EditableImage } from '@/components/common/EditableImage';
import { useToast } from '@/hooks/use-toast';

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
            { icon: User, label: "Wie:", value: "Sofie kiest uit: tekenen, boetseren, schrijven, muziek maken, etc." },
            { icon: MapPin, label: "Waar:", value: "Keukentafel, vrij van afleidingen" },
            { icon: Clock, label: "Duur:", value: "60 minuten" }
          ],
          callout: { icon: Sparkles, type: "START VANDAAG", text: "Deze week: bespreek het idee met Sofie en laat haar de eerste activiteit kiezen. Leg de materialen vrijdag al klaar. Evalueer aan het eind van de week kort hoe het was (5 min)." },
          progress: ["Week 1: Geprobeerd", "Week 2: Aangepast naar wat werkt", "Week 3: Routine gevonden", "Week 4: Geëvalueerd"]
        },
        {
          title: "Focus Sessie Plan",
          details: [
            { icon: Calendar, label: "Wanneer:", value: "Direct na school (ca. 16:00), 4 dagen per week" },
            { icon: User, label: "Wie:", value: "Sofie, zelfstandig" },
            { icon: MapPin, label: "Waar:", value: "Bureau, telefoon in een andere kamer" },
            { icon: Clock, label: "Duur:", value: "25 min werk + 5 min pauze (Pomodoro)" }
          ],
          callout: { icon: Lightbulb, type: "PROBEER DEZE WEEK", text: "Start met 2 sessies per dag en bouw dit langzaam op. Beloon de inzet, niet alleen het resultaat. Bespreek na 3 dagen wat goed werkt." },
          progress: ["Week 1: 2 sessies/dag geprobeerd", "Week 2: Opgehoogd naar 3 sessies", "Week 3: Routine gevonden", "Week 4: Geëvalueerd"]
        }
      ]
    },
    reflectionQuestions: [
        { icon: MessageCircleQuestion, question: "Wanneer zie ik het gedrag waar ik me zorgen over maak het meest?" },
        { icon: MessageCircleQuestion, question: "Wat werkte in het verleden goed om mijn kind te motiveren of te kalmeren?" },
        { icon: MessageCircleQuestion, question: "Hoe kan ik vaker mijn waardering voor de unieke sterktes van mijn kind uiten?" }
    ],
    extraResources: [
        { icon: Video, text: "Bekijk video: 'Pomodoro voor tieners'", link: "#" },
        { icon: BookHeart, text: "Lees artikel: 'Creativiteit stimuleren thuis'", link: "#" },
        { icon: UsersIcon, text: "Community: Ouders van creatieve tieners", link: "#" }
    ],
    testimonial: {
        quote: "Door dit rapport begrijp ik mijn dochter veel beter. De concrete actiepunten hebben echt geholpen om de sfeer thuis te verbeteren.",
        author: "Marina, moeder van Lisa (14)"
    },
    methodology: {
        title: "Methodologie & Disclaimer",
        icon: ShieldCheck,
        items: [
          { title: "Data Input", text: "De analyse in dit rapport is gebaseerd op een vergelijking van twee data-bronnen: 1) De antwoorden die u, de ouder, heeft gegeven in de 'Ken je Kind' vragenlijst. 2) De antwoorden die uw kind heeft gegeven in de 'Zelfreflectie Tool'." },
          { title: "Rol van AI", text: "Onze AI-assistent (draaiend op Google's Gemini-modellen) analyseert deze twee sets antwoorden om thematische overeenkomsten, verschillen in perceptie en mogelijke blinde vlekken te identificeren. Op basis van deze analyse genereert de AI de tekst voor de secties 'Perceptie Gaten', 'Gedeelde Sterktes', 'Blinde Vlekken' en het 'Familie Actieplan'." },
          { title: "Professionele Controle", text: "De onderliggende vragenlijsten en de structuur van het rapport zijn ontwikkeld in overleg met kinder- en jeugdpsychologen. De AI-output is ontworpen om te fungeren als een startpunt voor gesprek en reflectie, niet als een eindconclusie." },
          { title: "Belangrijke Disclaimer", text: "Dit rapport is een hulpmiddel en stelt nadrukkelijk geen medische of psychologische diagnose. Het vervangt geen professioneel advies van een gekwalificeerde zorgverlener. Bij zorgen over het welzijn of de ontwikkeling van uw kind, neem altijd contact op met uw huisarts, een psycholoog of een andere specialist." }
        ]
    }
};

// Component for a single section
const ReportSection = ({ section }: { section: typeof reportData.sections[0] }) => {
    const Icon = section.icon;
    return (
        <section className="mb-10 print-avoid-break bg-slate-50/50 p-6 rounded-lg border-l-4 border-primary shadow">
            <h2 className="text-2xl font-bold text-primary mb-2 flex items-center gap-3">
                <Icon className="h-7 w-7" />
                {section.title}
            </h2>
            <p className="text-base italic text-muted-foreground mb-4 pl-10">{section.summary}</p>
            <div className="space-y-4">
                {section.items && section.items.map((item, index) => (
                    <div key={index} className="pl-5">
                        <h3 className="font-semibold text-foreground/90 flex items-center gap-2 text-lg">{item.type}</h3>
                        <p className="text-muted-foreground pl-7 leading-relaxed text-base">{item.text}</p>
                    </div>
                ))}
            </div>
        </section>
    );
};

// Component for the page number
const PageNumber = ({ pageNumber, totalPages }: { pageNumber: number, totalPages: number }) => (
    <div className="text-xs text-gray-500">
        Pagina {pageNumber} van {totalPages}
    </div>
);

export default function ComparativeAnalysisReportPage() {
    const [familyPhotoUrl, setFamilyPhotoUrl] = React.useState('https://placehold.co/100x100.png');
    const { toast } = useToast();

    const handlePhotoSave = (newUrl: string) => {
        setFamilyPhotoUrl(newUrl);
        // In een echte app zou dit de URL voor dit specifieke rapport opslaan
        toast({ title: "Foto opgeslagen (simulatie)" });
    };

    return (
        <div className="bg-white text-black font-sans">
            <header className="p-4 border-b print-hide flex justify-between items-center sticky top-0 bg-white/80 backdrop-blur-sm z-10">
                <SiteLogo />
                <Button onClick={() => window.print()}>
                    <Download className="mr-2 h-4 w-4" />
                    Print of Sla op als PDF
                </Button>
            </header>

            <div className="hidden print-header">
                <SiteLogo className="logo-header" />
                <div className="text-right">
                  <p className="text-xs">Vertrouwelijk Rapport</p>
                  <p className="text-xs">MindNavigator</p>
                </div>
            </div>

            <main className="p-8 md:p-12 lg:p-16 max-w-4xl mx-auto print-main">
                <div className="text-center mb-10 print-avoid-break">
                     <EditableImage
                        wrapperClassName="w-24 h-24 mx-auto mb-4 relative bg-gray-200 rounded-full border-4 border-primary/20"
                        src={familyPhotoUrl}
                        alt="Gezinsfoto"
                        width={100}
                        height={100}
                        className="rounded-full object-cover"
                        data-ai-hint="family photo"
                        onSave={handlePhotoSave}
                        uploadPath="images/reports"
                    />
                    <h1 className="text-4xl font-bold text-gray-800">{reportData.title}</h1>
                    <p className="text-lg text-gray-600 mt-1">{reportData.subtitle}</p>
                    <p className="text-xs text-gray-400 mt-1">Rapport gegenereerd op: {reportData.reportDate.toLocaleDateString('nl-NL', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
                </div>
                
                <div className="mb-10 p-6 bg-blue-50/70 border border-blue-200 rounded-lg print-avoid-break shadow">
                    <h2 className="text-xl font-semibold text-blue-800 mb-2">Introductie</h2>
                    <p className="text-blue-900/80 leading-relaxed text-base">{reportData.intro}</p>
                </div>

                <div className="mb-10 p-4 bg-yellow-50/70 border border-yellow-300 rounded-lg print-avoid-break text-center shadow-sm">
                    <h3 className="font-semibold text-yellow-800 flex items-center justify-center gap-2">
                        <Bot className="h-5 w-5" />
                        AI-Ondersteunde Analyse
                    </h3>
                    <p className="text-sm text-yellow-900/90 mt-1">
                        Dit rapport bevat analyses en aanbevelingen die deels zijn gegenereerd met behulp van kunstmatige intelligentie. Lees de volledige methodologie onderaan voor meer details.
                    </p>
                </div>
                
                <div className="mb-10 p-6 bg-gray-50/80 border border-gray-200 rounded-lg print-avoid-break shadow">
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">Gebaseerd op:</h2>
                     <ul className="list-none text-gray-700 space-y-1 text-base">
                        <li><strong>Perspectief {reportData.parentName}:</strong> {reportData.basedOn.parentAnswers} (focus op {reportData.basedOn.parentFocus})</li>
                        <li><strong>Perspectief {reportData.childName}:</strong> {reportData.basedOn.childAnswers} (focus op {reportData.basedOn.childFocus})</li>
                         <li><strong>Overeenkomsten:</strong> {reportData.basedOn.agreements} gevonden</li>
                          <li><strong>Verschillen:</strong> {reportData.basedOn.differences} ontdekt</li>
                    </ul>
                </div>

                {reportData.sections.map((section, index) => (
                    <ReportSection key={section.id} section={section} />
                ))}

                <section className="mb-8 print-avoid-break bg-slate-50/50 p-6 rounded-lg border-l-4 border-accent shadow">
                    <h2 className="text-2xl font-bold text-accent mb-4 flex items-center gap-3">
                        <ClipboardList className="h-7 w-7" />
                        {reportData.actionPlan.title}
                    </h2>
                    <p className="text-base italic text-muted-foreground mb-6 pl-10">{reportData.actionPlan.summary}</p>
                    <div className="space-y-6">
                        {reportData.actionPlan.items.map((item, index) => (
                            <div key={index} className="bg-white p-4 rounded-lg border shadow-sm">
                                <h3 className="font-bold text-xl text-gray-800 mb-3">{`✅ ACTIE ${index + 1}: ${item.title}`}</h3>
                                <div className="grid grid-cols-2 gap-x-4 gap-y-2 mb-4 text-base">
                                    {item.details.map((detail, dIndex) => {
                                        const DetailIcon = detail.icon;
                                        return (
                                            <div key={dIndex} className="flex items-start gap-2">
                                                <DetailIcon className="h-4 w-4 text-gray-500 mt-1" />
                                                <span className="text-gray-600"><strong className="text-gray-700">{detail.label}</strong> {detail.value}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                                <div className="bg-green-50 p-3 rounded-md border border-green-200">
                                    <h4 className="font-semibold text-green-700 flex items-center gap-2 mb-1"><item.callout.icon className="h-5 w-5"/>{item.callout.type}</h4>
                                    <p className="text-sm text-green-900/90 leading-relaxed">{item.callout.text}</p>
                                </div>
                                <div className="mt-4 pt-3 border-t">
                                     <h4 className="font-semibold text-base text-gray-600 mb-2">📊 Week Tracker</h4>
                                     <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-1 sm:space-y-0 text-base">
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
                
                <section className="mb-8 print-avoid-break bg-slate-50/50 p-6 rounded-lg shadow">
                    <h2 className="text-2xl font-bold text-primary mb-3">Reflectievragen voor Ouders</h2>
                    <ul className="space-y-3">
                    {reportData.reflectionQuestions.map((item, index) => {
                        const Icon = item.icon;
                        return (<li key={index} className="flex items-start gap-3 text-base text-muted-foreground"><Icon className="h-5 w-5 text-primary mt-1 flex-shrink-0" />{item.question}</li>)
                    })}
                    </ul>
                </section>
                
                 <section className="mb-8 print-avoid-break bg-slate-50/50 p-6 rounded-lg shadow">
                    <h2 className="text-2xl font-bold text-primary mb-3">Extra Hulpbronnen</h2>
                    <ul className="space-y-2">
                        {reportData.extraResources.map((item, index) => {
                             const Icon = item.icon;
                             return (<li key={index}><Button variant="link" asChild className="p-0 h-auto text-base text-accent hover:text-accent/80"><Link href={item.link}><Icon className="h-4 w-4 mr-2"/>{item.text}</Link></Button></li>)
                        })}
                    </ul>
                </section>

                 <section className="print-avoid-break text-center my-10">
                    <div className="italic bg-gray-100 p-4 rounded-lg border-l-4 border-gray-400">
                        <p className="text-gray-700 text-lg">"{reportData.testimonial.quote}"</p>
                        <p className="text-right text-gray-600 font-medium mt-2">- {reportData.testimonial.author}</p>
                    </div>
                 </section>

                <section className="mb-8 print-avoid-break bg-slate-50/50 p-6 rounded-lg border-l-4 border-gray-400 shadow">
                    <h2 className="text-2xl font-bold text-gray-700 mb-2 flex items-center gap-3">
                        <reportData.methodology.icon className="h-7 w-7" />
                        {reportData.methodology.title}
                    </h2>
                    <div className="space-y-4 text-base">
                        {reportData.methodology.items.map((item, index) => (
                            <div key={index} className="pl-4">
                                <h3 className="font-semibold text-foreground text-lg">{item.title}</h3>
                                <p className="text-muted-foreground pl-2 leading-relaxed">{item.text}</p>
                            </div>
                        ))}
                    </div>
                </section>
            </main>
            <div className="hidden print-footer">
               <p>Gegenereerd door MindNavigator | www.mindnavigator.app</p>
               <div className="page-number"></div>
            </div>
        </div>
    );
}
