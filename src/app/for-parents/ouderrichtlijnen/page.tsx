
// src/app/for-parents/ouderrichtlijnen/page.tsx
"use client";

import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    ClipboardList, Target, Users, ShieldCheck, Handshake, BarChart, Stethoscope, Home as HomeIcon, HelpCircle, AlertTriangle, Star,
    Download, List, Brain, Zap, BookOpenCheck, GraduationCap, MessageSquareText, CheckCircle2, XCircle
} from '@/lib/icons';
import type { ElementType, ReactNode } from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

// Helper Components
const GuidelineSection = ({ id, title, icon: Icon, children }: { id: string, title: string, icon: ElementType, children: ReactNode }) => (
    <section id={id} className="pt-10 print-avoid-break">
        <h2 className="text-3xl font-bold text-primary mb-6 flex items-center gap-3">
            <Icon className="h-8 w-8" />
            {title}
        </h2>
        <div className="space-y-6">{children}</div>
    </section>
);

const SubSectionCard = ({ title, children, icon: Icon, iconBgColor }: { title: ReactNode, children: ReactNode, icon?: ElementType, iconBgColor?: string }) => (
    <Card className="bg-card shadow-md border print-avoid-break">
        <CardHeader>
            <CardTitle className="text-xl font-semibold text-foreground flex items-center gap-3">
                {Icon && (
                    <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${iconBgColor || 'bg-accent/10'}`}>
                        <Icon className="h-5 w-5 text-accent" />
                    </div>
                )}
                {title}
            </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-muted-foreground">
            {children}
        </CardContent>
    </Card>
);

const EmphasisBlock = ({ children }: { children: ReactNode }) => (
    <blockquote className="border-l-4 border-primary pl-4 italic text-foreground/90 my-4 text-base">
        {children}
    </blockquote>
);

const PrivacyBar = ({ label, percentage }: { label: string, percentage: number }) => (
    <div className="w-full">
        <div className="flex justify-between items-center mb-1 text-xs font-mono">
            <span className="text-foreground">{label}</span>
            <span className="font-semibold">{percentage}%</span>
        </div>
        <div className="w-full bg-muted rounded-full h-2.5">
            <div className="bg-primary h-2.5 rounded-full" style={{ width: `${percentage}%` }}></div>
        </div>
    </div>
);

const tocItems = [
    { id: 'wat-is-mindnavigator', title: 'Wat is MindNavigator?' },
    { id: 'leeftijdsspecifieke-richtlijnen', title: 'Leeftijdsspecifieke Richtlijnen' },
    { id: 'uw-rol-per-ontwikkelingsfase', title: 'Uw Rol per Ontwikkelingsfase' },
    { id: 'privacy-autonomie-balans', title: 'Privacy & Autonomie' },
    { id: 'ouder-dashboard', title: 'Het Ouder-Dashboard' },
    { id: 'coaching-begeleiding', title: 'Coaching & Begeleiding' },
    { id: 'professionele-hulp', title: 'Wanneer Professionele Hulp?' },
    { id: 'praktische-tips', title: 'Praktische Tips voor Thuis' },
    { id: 'veelgestelde-vragen', title: 'Veelgestelde Vragen' },
    { id: 'crisis-contact', title: 'Crisis & Noodcontact' },
];

export default function OuderRichtlijnenPage() {
    return (
        <div className="flex min-h-screen flex-col bg-slate-50">
            <Header />
            <main className="flex-1 bg-gradient-to-b from-background via-secondary/5 to-background py-12 md:py-16">
                <div className="container mx-auto max-w-4xl">
                    <div className="print-hide flex justify-end mb-6">
                        <Button onClick={() => window.print()}>
                            <Download className="mr-2 h-4 w-4" /> Print of Sla op als PDF
                        </Button>
                    </div>

                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-bold text-foreground">MindNavigator Ouderrichtlijnen</h1>
                        <p className="text-lg text-primary font-semibold mt-2">
                            "Samen ondersteunen we uw neurodivergente tiener"
                        </p>
                    </div>

                    <Card className="mb-12 p-6 bg-card shadow-lg border">
                        <p className="text-muted-foreground leading-relaxed">
                            Als ouder van een neurodivergente tiener navigeert u dagelijks door unieke uitdagingen en kansen. MindNavigator is ontworpen om uw gezin te ondersteunen met ethische, toegankelijke tools en begeleiding - zonder medische claims of valse beloftes.
                            Deze richtlijnen helpen u optimaal gebruik te maken van het platform terwijl u de groeiende autonomie van uw tiener respecteert.
                        </p>
                    </Card>
                    
                    <Card className="mb-12 print-avoid-break">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><List className="h-6 w-6 text-primary" />Inhoudsopgave</CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-2 gap-x-4 gap-y-2">
                           {tocItems.map(item => (
                               <a key={item.id} href={`#${item.id}`} className="text-sm text-primary hover:underline">{item.title}</a>
                           ))}
                        </CardContent>
                    </Card>

                    <GuidelineSection id="wat-is-mindnavigator" title="Wat is MindNavigator? - Voor Ouders Uitgelegd" icon={Target}>
                        <div className="grid md:grid-cols-2 gap-6">
                            <SubSectionCard title="Wat MindNavigator WEL Is" icon={CheckCircle2}>
                                <ul className="list-none space-y-2 pl-0">
                                    <li><strong>🧠 Zelfinzicht Platform:</strong> Tools om patronen in gedrag en emoties te herkennen</li>
                                    <li><strong>📚 Educatieve Ondersteuning:</strong> Huiswerk planning, focus technieken, organisatietools</li>
                                    <li><strong>👥 Coaching Marktplaats:</strong> Toegang tot gekwalificeerde begeleiders en huiswerkcoaches</li>
                                    <li><strong>👨‍👩‍👧‍👦 Gezinsondersteuning:</strong> Inzichten en tools voor het hele gezin</li>
                                    <li><strong>💪 Empowerment Focus:</strong> Sterke punten ontdekken en benutten</li>
                                </ul>
                            </SubSectionCard>
                            <SubSectionCard title="Wat MindNavigator NIET Is" icon={XCircle}>
                                 <ul className="list-none space-y-2 pl-0">
                                    <li><strong>❌ Geen Medische Dienst:</strong> We stellen geen diagnoses of behandelen geen aandoeningen</li>
                                    <li><strong>❌ Geen Therapie Vervanging:</strong> Coaching is ondersteuning, geen behandeling</li>
                                    <li><strong>❌ Geen Wondermiddel:</strong> Realistische verwachtingen over groei en ontwikkeling</li>
                                    <li><strong>❌ Geen 24/7 Crisisondersteuning:</strong> Voor acute problemen altijd professionele hulp zoeken</li>
                                </ul>
                            </SubSectionCard>
                        </div>
                        <EmphasisBlock>
                            "Wij respecteren uw rol als ouder, de autonomie van uw tiener, en de grenzen van digitale ondersteuning. Transparantie en veiligheid staan altijd voorop."
                        </EmphasisBlock>
                    </GuidelineSection>

                    <GuidelineSection id="leeftijdsspecifieke-richtlijnen" title="Leeftijdsspecifieke Richtlijnen" icon={Users}>
                        <SubSectionCard title="12-15 Jaar: Actieve Ouderlijke Begeleiding" icon={Handshake}>
                             <p><strong>Uw Rol:</strong> Primaire Beslisser & Begeleider</p>
                             <h4 className="font-semibold text-foreground mt-3">✅ Wat U Doet:</h4>
                             <ul className="list-disc pl-5">
                                <li><strong>Account Goedkeuring:</strong> U moet expliciet toestemming geven voor deelname</li>
                                <li><strong>Dashboard Toegang:</strong> Volledige inzage in voortgang en activiteiten</li>
                                <li><strong>Coach Selectie:</strong> U helpt bij het kiezen van geschikte begeleiders</li>
                                <li><strong>Sessie Bijwonen:</strong> U kunt coaching sessies bijwonen (met toestemming tiener)</li>
                                <li><strong>Betalingen Beheren:</strong> Alle financiële beslissingen via uw account</li>
                             </ul>
                             <h4 className="font-semibold text-foreground mt-3">🎯 Focus Punten:</h4>
                             <ul className="list-disc pl-5">
                                <li><strong>Vertrouwen Opbouwen:</strong> Toon interesse zonder te controleren</li>
                                <li><strong>Samen Ontdekken:</strong> Bekijk assessment resultaten samen</li>
                                <li><strong>Grenzen Respecteren:</strong> Geef ruimte voor persoonlijke reflectie</li>
                             </ul>
                             <h4 className="font-semibold text-foreground mt-3">⚠️ Let Op:</h4>
                             <ul className="list-disc pl-5">
                                <li><strong>Niet Overnemen:</strong> Laat uw tiener zelf de tools gebruiken</li>
                                <li><strong>Privacy Respecteren:</strong> Niet alles hoeft gedeeld te worden</li>
                                <li><strong>Geduld Hebben:</strong> Zelfinzicht ontwikkelt zich geleidelijk</li>
                             </ul>
                        </SubSectionCard>
                        <SubSectionCard title="16-17 Jaar: Ondersteunende Partnerschap" icon={Handshake}>
                             <p><strong>Uw Rol:</strong> Advisor & Safety Net</p>
                             <h4 className="font-semibold text-foreground mt-3">✅ Wat U Kunt Doen:</h4>
                             <ul className="list-disc pl-5">
                                <li><strong>Gezinslink Accepteren:</strong> Toegang tot voortgangsoverzicht (met tiener toestemming)</li>
                                <li><strong>Financiële Ondersteuning:</strong> Betalen voor premium features indien gewenst</li>
                                <li><strong>Coach Gesprekken:</strong> Betrokken zijn bij selectie maar tiener beslist</li>
                                 <li><strong>Noodcontact:</strong> Beschikbaar zijn voor escalatie situaties</li>
                             </ul>
                             <h4 className="font-semibold text-foreground mt-3">🎯 Focus Punten:</h4>
                             <ul className="list-disc pl-5">
                                <li><strong>Vertrouwen Geven:</strong> Uw tiener heeft meer autonomie verdiend</li>
                                <li><strong>Beschikbaar Blijven:</strong> Open deur beleid voor vragen en ondersteuning</li>
                                <li><strong>Professionele Hulp:</strong> Alert zijn op signalen dat extra hulp nodig is</li>
                                <li><strong>Overgang Voorbereiden:</strong> Richting volledige zelfstandigheid op 18e verjaardag</li>
                             </ul>
                             <h4 className="font-semibold text-foreground mt-3">⚠️ Let Op:</h4>
                             <ul className="list-disc pl-5">
                                <li><strong>Niet Pushen:</strong> Respecteer als uw tiener privacy wil</li>
                                <li><strong>Balans Zoeken:</strong> Tussen betrokkenheid en ruimte geven</li>
                                <li><strong>Eigen Grenzen:</strong> U bent niet verantwoordelijk voor alle keuzes</li>
                             </ul>
                        </SubSectionCard>
                         <SubSectionCard title="18+ Jaar: Respectvolle Afstand" icon={Handshake}>
                             <p><strong>Uw Rol:</strong> Uitgenodigd Supporter</p>
                             <h4 className="font-semibold text-foreground mt-3">✅ Wat Mogelijk Is:</h4>
                             <ul className="list-disc pl-5">
                                <li><strong>Op Uitnodiging:</strong> Alleen toegang als uw volwassen kind dit expliciet wil</li>
                                <li><strong>Familie Coaching:</strong> Gezamenlijke sessies indien gewenst door beide partijen</li>
                                <li><strong>Financiële Afspraken:</strong> Duidelijke overeenkomsten over wie wat betaalt</li>
                                <li><strong>Crisis Ondersteuning:</strong> Beschikbaar zijn als backup plan</li>
                             </ul>
                              <h4 className="font-semibold text-foreground mt-3">🎯 Focus Punten:</h4>
                             <ul className="list-disc pl-5">
                                <li><strong>Respect Autonomie:</strong> Volledige eigenaarschap bij uw volwassen kind</li>
                                <li><strong>Beschikbaarheid:</strong> Tonen dat u er bent zonder op te dringen</li>
                                <li><strong>Eigen Ontwikkeling:</strong> Misschien ook eigen ondersteuning zoeken als ouder</li>
                             </ul>
                        </SubSectionCard>
                    </GuidelineSection>

                    <GuidelineSection id="uw-rol-per-ontwikkelingsfase" title="Uw Rol per Ontwikkelingsfase" icon={Handshake}>
                        <SubSectionCard title="Startfase (Eerste 2 Maanden)">
                            <h4 className="font-semibold text-foreground mt-3">Samen Exploreren:</h4>
                             <ul className="list-disc pl-5">
                                <li><strong>Onboarding Samen Doen:</strong> Eerste assessment en profiel setup ondersteunen</li>
                                <li><strong>Platform Verkenning:</strong> Samen kijken naar beschikbare tools en functies</li>
                                <li><strong>Verwachtingen Afstemmen:</strong> Bespreken wat iedereen hoopt te bereiken</li>
                                <li><strong>Coach Matching:</strong> Helpen bij het vinden van een geschikte begeleider</li>
                             </ul>
                             <h4 className="font-semibold text-foreground mt-3">Uw Taken:</h4>
                             <ul className="list-disc pl-5">
                                <li>Account verificatie en betalingsgegevens instellen</li>
                                <li>Privacy instellingen bespreken en configureren</li>
                                <li>Eerste coaching sessie mogelijk bijwonen (met toestemming)</li>
                                <li>Familieregels opstellen over platform gebruik</li>
                             </ul>
                        </SubSectionCard>
                        <SubSectionCard title="Ontwikkelingsfase (Maand 3-12)">
                             <h4 className="font-semibold text-foreground mt-3">Ondersteunend Begeleiden:</h4>
                             <ul className="list-disc pl-5">
                                <li><strong>Voortgang Monitoren:</strong> Regelmatig (maar niet dagelijks) dashboard bekijken</li>
                                <li><strong>Gesprekken Aangaan:</strong> Platform inzichten gebruiken voor diepere gesprekken</li>
                                <li><strong>Obstakels Helpen:</strong> Ondersteuning bieden bij technische of motivationele uitdagingen</li>
                                <li><strong>Successen Celebreren:</strong> Vooruitgang erkennen en waarderen</li>
                             </ul>
                             <h4 className="font-semibold text-foreground mt-3">Praktische Ondersteuning:</h4>
                             <ul className="list-disc pl-5">
                                <li>Herinneren aan coaching afspraken (zonder te controleren)</li>
                                <li>Huiswerktips implementeren die via platform geleerd worden</li>
                                <li>Communicatie met school over inzichten (met toestemming tiener)</li>
                                <li>Eigen leerproces als ouder: hoe om te gaan met neurodiversiteit</li>
                             </ul>
                        </SubSectionCard>
                        <SubSectionCard title="Zelfstandigheidsfase (Jaar 2+)">
                            <h4 className="font-semibold text-foreground mt-3">Loslaten met Liefde:</h4>
                             <ul className="list-disc pl-5">
                                <li><strong>Vertrouwen Tonen:</strong> Minder frequent checken, meer ruimte geven</li>
                                <li><strong>Op Afstand Ondersteunen:</strong> Beschikbaar zijn zonder op te dringen</li>
                                <li><strong>Crisismanagement:</strong> Weten wanneer wel in te grijpen</li>
                                <li><strong>Toekomst Voorbereiden:</strong> Overgang naar volwassenheid faciliteren</li>
                             </ul>
                        </SubSectionCard>
                    </GuidelineSection>

                    <GuidelineSection id="privacy-autonomie-balans" title="Privacy & Autonomie Balans" icon={ShieldCheck}>
                        <div className="grid md:grid-cols-2 gap-6">
                            <SubSectionCard title="Wat Ziet U Wel?" icon={CheckCircle2}>
                                <h4 className="font-semibold text-foreground mt-3">Dashboard Overzicht:</h4>
                                <ul className="list-disc pl-5">
                                    <li>Algemene Voortgang & Platform Activiteit</li>
                                    <li>Coaching Statistieken (aantal, aanwezigheid)</li>
                                    <li>Gedeelde Doelen & Assessment Samenvattingen</li>
                                </ul>
                                <h4 className="font-semibold text-foreground mt-3">Communicatie Logs:</h4>
                                <ul className="list-disc pl-5">
                                    <li>Professionele coach feedback (met toestemming)</li>
                                    <li>Systeem Notificaties</li>
                                    <li>Crisis Alerts</li>
                                </ul>
                            </SubSectionCard>
                            <SubSectionCard title="Wat Ziet U NIET?" icon={XCircle}>
                                <h4 className="font-semibold text-foreground mt-3">Privé Reflecties:</h4>
                                <ul className="list-disc pl-5">
                                    <li>Dagboek Entries</li>
                                    <li>Peer Interactions</li>
                                    <li>Specifieke Assessment Antwoorden</li>
                                    <li>Coach Conversaties</li>
                                </ul>
                            </SubSectionCard>
                        </div>
                        <SubSectionCard title="Privacy Instellingen per Leeftijd" icon={BarChart}>
                            <div className="space-y-4">
                                <PrivacyBar label="12-15 Jaar (Beschermde Transparantie)" percentage={80} />
                                <PrivacyBar label="16-17 Jaar (Gebalanceerde Autonomie)" percentage={40} />
                                <PrivacyBar label="18+ Jaar (Volledige Controle)" percentage={20} />
                            </div>
                        </SubSectionCard>
                    </GuidelineSection>
                    
                    <GuidelineSection id="ouder-dashboard" title="Het Ouder-Dashboard: Wat Ziet U?" icon={BarChart}>
                       <SubSectionCard title="Hoofdoverzicht">
                            <h4 className="font-semibold text-foreground mt-3">Weekly Summary:</h4>
                             <ul className="list-disc pl-5">
                                <li>Platform Activiteit: "Emma heeft deze week 4 van de 7 dagen ingelogd"</li>
                                <li>Goal Progress: "2 van 3 doelen deze week behaald"</li>
                                <li>Coaching Update: "Volgende sessie: Donderdag 14:00 met Sarah"</li>
                             </ul>
                             <h4 className="font-semibold text-foreground mt-3">Maandelijkse Trends:</h4>
                             <ul className="list-disc pl-5">
                                <li>Engagement Grafiek: Hoe actief was uw tiener deze maand?</li>
                                <li>Achievement Tracker: Welke mijlpalen zijn bereikt?</li>
                             </ul>
                        </SubSectionCard>
                    </GuidelineSection>

                    <GuidelineSection id="coaching-begeleiding" title="Coaching & Begeleiding: Uw Betrokkenheid" icon={Users}>
                        <SubSectionCard title="Coach Selectie Process">
                            <h4 className="font-semibold text-foreground mt-3">12-15 Jaar - Actieve Betrokkenheid:</h4>
                            <ul className="list-disc pl-5">
                                <li>Profiel Review: Samen bekijken van coach achtergronden</li>
                                <li>Kennismaking: Bijwonen van eerste kennismakingsgesprek</li>
                            </ul>
                            <h4 className="font-semibold text-foreground mt-3">16-17 Jaar - Adviserende Rol:</h4>
                            <ul className="list-disc pl-5">
                                <li>Gezamenlijk Bekijken: Coach profielen samen doorlopen</li>
                                <li>Mening Geven: Uw perspectief delen zonder te beslissen</li>
                            </ul>
                        </SubSectionCard>
                        <SubSectionCard title="Kwaliteitsborging: Uw Rol">
                             <h4 className="font-semibold text-foreground mt-3">Waarschuwingssignalen:</h4>
                             <ul className="list-disc pl-5">
                                <li>Ongeschikt Gedrag: Ongepaste opmerkingen of grenzen overschrijden</li>
                                <li>Geen Vooruitgang: Na 2 maanden geen merkbare verbetering</li>
                             </ul>
                        </SubSectionCard>
                    </GuidelineSection>
                    
                    <GuidelineSection id="professionele-hulp" title="Wanneer Professionele Hulp Zoeken" icon={Stethoscope}>
                        <div className="p-4 border-l-4 border-destructive bg-destructive/10">
                            <h3 className="text-xl font-bold text-destructive mb-2">Onmiddellijk Hulp Zoeken Bij:</h3>
                            <ul className="list-disc pl-5 text-destructive/90 font-medium">
                                <li>Suïcidale gedachten of uitingen</li>
                                <li>Extreme stemmingswisselingen of agressief gedrag</li>
                                <li>Psychotische symptomen (hallucinaties, wanen)</li>
                                <li>Ernstige eetproblemen of middelenmisbruik</li>
                            </ul>
                            <p className="mt-3 text-sm">Bel direct <strong>112</strong> (spoed), <strong>113</strong> (zelfmoordpreventie), of uw huisarts.</p>
                        </div>
                         <p className="text-muted-foreground">MindNavigator is een hulpmiddel, geen vervanging voor professionele zorg. Overweeg een doorverwijzing via uw huisarts als uw kind langdurig school weigert, zich sociaal isoleert, of als de tools van MindNavigator niet meer voldoende lijken te helpen.</p>
                    </GuidelineSection>

                    <GuidelineSection id="praktische-tips" title="Praktische Tips voor Thuis" icon={HomeIcon}>
                        <SubSectionCard title="Platform Inzichten Implementeren">
                            <h4 className="font-semibold text-foreground mt-3">Ochtend Routine:</h4>
                            <ul className="list-disc pl-5">
                                <li>Assessment Inzichten: "Emma is een ochtendmens" → Huiswerk voor school</li>
                                <li>Energy Management: "Sociale activiteiten putten uit" → Rust na school</li>
                            </ul>
                        </SubSectionCard>
                        <SubSectionCard title="Communicatie Verbeteren">
                            <h4 className="font-semibold text-foreground mt-3">Effectieve Vragen:</h4>
                            <ul className="list-disc pl-5">
                               <li>"Wat heb je vandaag ontdekt over jezelf?"</li>
                               <li>"Welke strategie van je coach ga je proberen?"</li>
                            </ul>
                        </SubSectionCard>
                    </GuidelineSection>

                     <GuidelineSection id="veelgestelde-vragen" title="Veelgestelde Vragen" icon={HelpCircle}>
                        <Accordion type="single" collapsible className="w-full space-y-2">
                           <AccordionItem value="item-1">
                               <AccordionTrigger>Kan ik altijd zien wat mijn tiener doet op het platform?</AccordionTrigger>
                               <AccordionContent>Dit hangt af van de leeftijd. Voor 12-15 jarigen heeft u meer inzage, voor 16-17 jarigen beperktere toegang op basis van hun toestemming, en voor 18+ alleen op uitnodiging.</AccordionContent>
                           </AccordionItem>
                           <AccordionItem value="item-2">
                               <AccordionTrigger>Hoe weet ik of de coach geschikt is?</AccordionTrigger>
                               <AccordionContent>Let op: communicatie verbetert, uw tiener kijkt uit naar sessies, praktische tips werken thuis, en u ziet meetbare vooruitgang na 1-2 maanden.</AccordionContent>
                           </AccordionItem>
                            <AccordionItem value="item-3">
                               <AccordionTrigger>Zijn de gegevens van mijn kind veilig?</AccordionTrigger>
                               <AccordionContent>Ja, alle data wordt veilig opgeslagen conform AVG/GDPR richtlijnen op Nederlandse servers. Geen informatie wordt gedeeld zonder expliciete toestemming.</AccordionContent>
                           </AccordionItem>
                        </Accordion>
                     </GuidelineSection>

                    <GuidelineSection id="crisis-contact" title="Crisis & Noodcontact" icon={AlertTriangle}>
                        <SubSectionCard title="MindNavigator Crisis Ondersteuning" icon={AlertTriangle}>
                            <p>Bij een crisis-melding via ons platform, ondernemen wij de volgende stappen:</p>
                             <ul className="list-disc pl-5">
                                <li><strong>Onmiddellijke Respons:</strong> Reactie binnen 1 uur.</li>
                                <li><strong>Familiecontact:</strong> Wij informeren u als ouder/verzorger direct.</li>
                                <li><strong>Doorverwijzing:</strong> We helpen bij de overdracht naar professionele acute GGZ-zorg.</li>
                            </ul>
                            <p className="font-semibold mt-3">Onze 24/7 Crisis Lijn: +31 (0)20 123 4567 (fictief)</p>
                        </SubSectionCard>
                    </GuidelineSection>
                </div>
            </main>
            <Footer />
        </div>
    );
}
