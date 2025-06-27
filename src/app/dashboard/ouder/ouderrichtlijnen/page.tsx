// src/app/dashboard/ouder/ouderrichtlijnen/page.tsx
"use client";

import React, { type ReactNode, type ElementType } from 'react';
import { Button } from '@/components/ui/button';
import { SiteLogo } from '@/components/common/site-logo';
import {
    ClipboardList, Target, Users, ShieldCheck, Handshake, BarChart, Stethoscope, Home as HomeIcon, HelpCircle, AlertTriangle, Star,
    Download, List, Brain, Zap, BookOpenCheck, GraduationCap, MessageSquareText, CheckCircle2, XCircle, ArrowRight
} from '@/lib/icons';
import type { IconType } from '@/lib/icons';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Link from 'next/link';
import { ExternalLink } from 'lucide-react';

// Helper Components
const GuidelineSection = ({ id, title, icon: Icon, children }: { id: string, title: string, icon: ElementType, children: ReactNode }) => (
    <section id={id} className="pt-2">
        <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-3">
            <Icon className="h-7 w-7 text-primary" />
            {title}
        </h2>
        <div className="space-y-6">{children}</div>
    </section>
);

const SubSectionCard = ({ title, children, icon: Icon, iconBgColor }: { title: ReactNode, children: ReactNode, icon?: ElementType, iconBgColor?: string }) => (
    <Card className="bg-card shadow-md border">
        <CardHeader>
            <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-3">
                {Icon && (
                    <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${iconBgColor || 'bg-accent/10'}`}>
                        <Icon className="h-5 w-5 text-accent" />
                    </div>
                )}
                {title}
            </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
            {children}
        </CardContent>
    </Card>
);

const EmphasisBlock = ({ children }: { children: ReactNode }) => (
    <blockquote className="border-l-4 border-primary pl-4 italic text-foreground/90 my-2 text-sm">
        {children}
    </blockquote>
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

const faqItems = [
  {
    id: "faq-progress",
    question: "Hoe kan ik de voortgang van mijn kind volgen?",
    answer: "U kunt de voortgang van uw kind volgen via de 'Mijn Kinderen' link in uw Ouder Dashboard. Klik op het kind van wie u de voortgang wilt zien en ga naar het tabblad 'Voortgang'. Hier vindt u een overzicht van voltooide quizzen en lesverslagen (indien van toepassing)."
  },
  {
    id: "faq-cancel-lesson",
    question: "Wat als mijn kind een les wil annuleren of verzetten?",
    answer: "Lessen kunnen geannuleerd of (binnenkort) verzet worden via het 'Aankomende Lessen' of 'Lessen Overzicht' tabblad onder 'Lessen Kinderen'. Houd rekening met de annuleringsvoorwaarden die gelden (zie de pagina 'Les Plannen' voor details). Voor het verzetten van lessen kunt u binnenkort een verzoek indienen bij de tutor."
  },
  {
    id: "faq-payment-lessons",
    question: "Hoe werkt de betaling voor bijlessen?",
    answer: "Bijlessen worden per sessie of via een lessenbundel betaald. U kunt uw betaalmethoden en factuurhistorie beheren via de 'Facturatie' sectie in uw dashboard. Abonnementen voor de coaching-hub worden maandelijks of jaarlijks vooraf betaald via de 'Abonnementen' pagina."
  },
  {
    id: "faq-view-quiz-results",
    question: "Kan ik de quizresultaten van mijn kind inzien?",
    answer: "Ja, als uw kind zijn/haar account aan uw ouderaccount heeft gekoppeld en toestemming heeft gegeven via de 'Privacy & Delen' instellingen, kunt u een samenvatting van de quizresultaten en eventuele AI-gegenereerde analyses inzien op de voortgangspagina van het kind. De volledige rapporten zijn primair voor het kind bedoeld om zelfinzicht te bevorderen."
  },
  {
    id: "faq-add-child",
    question: "Hoe voeg ik een nieuw kind toe aan mijn account?",
    answer: "U kunt een nieuw kind toevoegen via de 'Mijn Kinderen' pagina in uw dashboard. Klik op de knop 'Nieuw Kind Toevoegen' en vul de gevraagde gegevens in. Uw kind ontvangt dan een uitnodiging per e-mail om het account te activeren en te koppelen."
  },
  {
    id: "faq-coaching-hub-benefits",
    question: "Wat zijn de voordelen van de premium coaching-hub voor mijn kind?",
    answer: "De premium coaching-hub ('Gezins Gids' of hoger) biedt dagelijkse, gepersonaliseerde tips, reflectie-oefeningen, een digitaal dagboek, en andere tools die uw kind helpen bij zelfinzicht, het ontwikkelen van routines, en het omgaan met uitdagingen gerelateerd aan hun neurodiversiteit."
  }
];


export default function OuderRichtlijnenPage() {
    return (
        <div className="space-y-12">
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
            
            <Card className="mb-12">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><List className="h-6 w-6 text-primary" />Inhoudsopgave</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-2">
                    {tocItems.map(item => (
                        <a key={item.id} href={`#${item.id}`} className="text-sm text-primary hover:underline">{item.title}</a>
                    ))}
                </CardContent>
            </Card>

            <GuidelineSection id="wat-is-mindnavigator" title="Wat is MindNavigator? - Voor Ouders Uitgelegd" icon={Target}>
                <div className="grid md:grid-cols-2 gap-6">
                    <SubSectionCard title="Wat MindNavigator WEL Is" icon={CheckCircle2}>
                        <ul className="list-none space-y-2 pl-0">
                            <li>🧠 **Zelfinzicht Platform:** Tools om patronen in gedrag en emoties te herkennen</li>
                            <li>📚 **Educatieve Ondersteuning:** Huiswerk planning, focus technieken, organisatietools</li>
                            <li>👥 **Coaching Marktplaats:** Toegang tot gekwalificeerde begeleiders en huiswerkcoaches</li>
                            <li>👨‍👩‍👧‍👦 **Gezinsondersteuning:** Inzichten en tools voor het hele gezin</li>
                            <li>💪 **Empowerment Focus:** Sterke punten ontdekken en benutten</li>
                        </ul>
                    </SubSectionCard>
                    <SubSectionCard title="Wat MindNavigator NIET Is" icon={XCircle}>
                        <ul className="list-none space-y-2 pl-0">
                            <li>❌ **Geen Medische Dienst:** We stellen geen diagnoses of behandelen geen aandoeningen</li>
                            <li>❌ **Geen Therapie Vervanging:** Coaching is ondersteuning, geen behandeling</li>
                            <li>❌ **Geen Wondermiddel:** Realistische verwachtingen over groei en ontwikkeling</li>
                            <li>❌ **Geen 24/7 Crisisondersteuning:** Voor acute problemen altijd professionele hulp zoeken</li>
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
                </SubSectionCard>
                <SubSectionCard title="18+ Jaar: Respectvolle Afstand" icon={Handshake}>
                    <p><strong>Uw Rol:</strong> Uitgenodigd Supporter</p>
                    <h4 className="font-semibold text-foreground mt-3">✅ Wat Mogelijk Is:</h4>
                    <ul className="list-disc pl-5">
                    <li><strong>Op Uitnodiging:</strong> Alleen toegang als uw volwassen kind dit expliciet wil</li>
                    <li><strong>Familie Coaching:</strong> Gezamenlijke sessies indien gewenst door beide partijen</li>
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
                        </ul>
                </SubSectionCard>
                <SubSectionCard title="Ontwikkelingsfase (Maand 3-12)">
                    <h4 className="font-semibold text-foreground mt-3">Ondersteunend Begeleiden:</h4>
                        <ul className="list-disc pl-5">
                        <li><strong>Voortgang Monitoren:</strong> Regelmatig (maar niet dagelijks) dashboard bekijken</li>
                        <li><strong>Gesprekken Aangaan:</strong> Platform inzichten gebruiken voor diepere gesprekken</li>
                        <li><strong>Successen Celebreren:</strong> Vooruitgang erkennen en waarderen</li>
                        </ul>
                </SubSectionCard>
                <SubSectionCard title="Zelfstandigheidsfase (Jaar 2+)">
                    <h4 className="font-semibold text-foreground mt-3">Loslaten met Liefde:</h4>
                        <ul className="list-disc pl-5">
                        <li><strong>Vertrouwen Tonen:</strong> Minder frequent checken, meer ruimte geven</li>
                        <li><strong>Op Afstand Ondersteunen:</strong> Beschikbaar zijn zonder op te dringen</li>
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
                        </ul>
                    </SubSectionCard>
                    <SubSectionCard title="Wat Ziet U NIET?" icon={XCircle}>
                        <h4 className="font-semibold text-foreground mt-3">Privé Reflecties:</h4>
                        <ul className="list-disc pl-5">
                            <li>Dagboek Entries</li>
                            <li>Peer Interactions</li>
                            <li>Coach Conversaties</li>
                        </ul>
                    </SubSectionCard>
                </div>
            </GuidelineSection>

             <GuidelineSection id="ouder-dashboard" title="Het Ouder-Dashboard: Wat Ziet U?" icon={BarChart}>
                    <SubSectionCard title="Hoofdoverzicht">
                        <p>Weekly Summary: "Emma heeft deze week 4 van de 7 dagen ingelogd".</p>
                    </SubSectionCard>
             </GuidelineSection>

             <GuidelineSection id="coaching-begeleiding" title="Coaching & Begeleiding: Uw Betrokkenheid" icon={Users}>
                 <SubSectionCard title="Coach Selectie Process">
                    <p>U speelt een actieve rol in het selectieproces, vooral voor jongere tieners. Voor oudere tieners is uw rol meer adviserend.</p>
                 </SubSectionCard>
             </GuidelineSection>

            <GuidelineSection id="professionele-hulp" title="Wanneer Professionele Hulp Zoeken" icon={Stethoscope}>
                <div className="p-4 border-l-4 border-destructive bg-destructive/10">
                    <h3 className="text-xl font-bold text-destructive mb-2">Onmiddellijk Hulp Zoeken Bij:</h3>
                    <ul className="list-disc pl-5 text-destructive/90 font-medium">
                        <li>Suïcidale gedachten of uitingen</li>
                        <li>Extreem agressief gedrag</li>
                    </ul>
                    <p className="mt-3 text-sm">Bel direct <strong>112</strong> (spoed), <strong>113</strong> (zelfmoordpreventie), of uw huisarts.</p>
                </div>
            </GuidelineSection>
            
            <GuidelineSection id="praktische-tips" title="Praktische Tips voor Thuis" icon={HomeIcon}>
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
                    {faqItems.map((faq) => (
                      <AccordionItem key={faq.id} value={faq.id} className="bg-card border rounded-md">
                        <AccordionTrigger className="p-4 text-left">{faq.question}</AccordionTrigger>
                        <AccordionContent className="p-4 pt-0">
                          <p dangerouslySetInnerHTML={{ __html: faq.answer }} />
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                </Accordion>
            </GuidelineSection>
            
            <GuidelineSection id="crisis-contact" title="Crisis & Noodcontact" icon={AlertTriangle}>
                <SubSectionCard title="MindNavigator Crisis Ondersteuning" icon={AlertTriangle}>
                    <p>Bij een crisis-melding via ons platform, ondernemen wij de volgende stappen:</p>
                    <ul className="list-disc pl-5">
                        <li>Onmiddellijke Respons: Reactie binnen 1 uur.</li>
                        <li>Familiecontact: Wij informeren u als ouder/verzorger direct.</li>
                    </ul>
                </SubSectionCard>
            </GuidelineSection>

            <div className="mt-16 pt-10 border-t">
                 <h2 className="text-2xl font-bold text-center mb-6">Krijg De Ondersteuning Die Uw Gezin Verdient</h2>
                 <div className="grid md:grid-cols-3 gap-6">
                    <Card className="bg-green-50/70 border-green-200">
                        <CardHeader><CardTitle className="text-green-800 flex items-center gap-2"><Star className="h-5 w-5"/>Vertrouwen & Inzicht</CardTitle></CardHeader>
                        <CardContent><p className="text-sm text-green-900/90">Leer de unieke denkstijl van uw kind te begrijpen en bouw een sterkere band op, gebaseerd op vertrouwen en open communicatie.</p></CardContent>
                    </Card>
                    <Card className="bg-blue-50/70 border-blue-200">
                        <CardHeader><CardTitle className="text-blue-800 flex items-center gap-2"><Target className="h-5 w-5"/>Praktische Strategieën</CardTitle></CardHeader>
                        <CardContent><p className="text-sm text-blue-900/90">Ontvang concrete, dagelijkse tips en tools die u direct kunt toepassen om thuis een ondersteunende en rustige omgeving te creëren.</p></CardContent>
                    </Card>
                    <Card className="bg-orange-50/70 border-orange-200">
                        <CardHeader><CardTitle className="text-orange-800 flex items-center gap-2"><Users className="h-5 w-5"/>U Staat Er Niet Alleen Voor</CardTitle></CardHeader>
                        <CardContent><p className="text-sm text-orange-900/90">Krijg toegang tot een community van andere ouders en de mogelijkheid om gekwalificeerde coaches en tutors in te schakelen.</p></CardContent>
                    </Card>
                 </div>
                 <div className="text-center mt-8">
                    <Button asChild size="lg"><Link href="/#pricing">Bekijk Abonnementen <ArrowRight className="ml-2 h-4 w-4"/></Link></Button>
                 </div>
            </div>
        </div>
    );
}
