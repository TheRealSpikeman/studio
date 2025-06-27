// src/app/for-parents/ouderrichtlijnen/page.tsx
"use client";

import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Brain, Users, ShieldCheck, TrendingUp, BarChart, Target, AlertTriangle, Package, CheckCircle2, Lightbulb, Handshake, Mail, Video, Download } from 'lucide-react';
import type { ElementType } from 'react';
import { Badge } from '@/components/ui/badge';

const StatIndicator = ({ value, label }: { value: string, label: string }) => (
    <div className="text-center">
        <div className="text-3xl lg:text-4xl font-bold text-teal-300">{value}</div>
        <div className="text-sm opacity-80 mt-1">{label}</div>
    </div>
);

const ValuePropCard = ({ icon: Icon, title, children }: { icon: ElementType, title: string, children: React.ReactNode }) => (
    <div className="bg-white/5 border border-white/20 p-6 rounded-lg shadow-lg backdrop-blur-sm hover:bg-white/10 transition-all duration-300">
        <div className="flex items-center gap-4 mb-3">
            <div className="bg-primary/20 text-primary p-3 rounded-full">
                <Icon className="h-7 w-7" />
            </div>
            <h3 className="text-xl font-semibold text-foreground">{title}</h3>
        </div>
        <p className="text-muted-foreground text-sm leading-relaxed">{children}</p>
    </div>
);

const AgeCard = ({ range, role, description }: { range: string, role: string, description:string }) => (
    <Card className="bg-card text-center flex flex-col h-full">
        <CardHeader>
            <CardTitle className="text-2xl font-bold text-primary">{range}</CardTitle>
            <CardDescription className="font-semibold">{role}</CardDescription>
        </CardHeader>
        <CardContent className="flex-grow">
            <p className="text-sm text-muted-foreground">{description}</p>
        </CardContent>
    </Card>
);

const PreviewCard = ({ title, subtitle, items }: { title: string, subtitle:string, items: string[] }) => (
    <Card className="bg-card shadow-md flex flex-col h-full">
        <CardHeader className="bg-primary/10">
            <CardTitle className="text-lg font-semibold text-primary">{title}</CardTitle>
            <CardDescription>{subtitle}</CardDescription>
        </CardHeader>
        <CardContent className="pt-4 flex-grow">
            <ul className="space-y-2">
                {items.map((item, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-muted-foreground">{item}</span>
                    </li>
                ))}
            </ul>
        </CardContent>
    </Card>
);


export default function OuderRichtlijnenPage() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-slate-900">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-amber-400 to-orange-500 text-white py-20 text-center">
            <div className="container">
                <Badge variant="secondary" className="bg-white/20 border-white/30 text-white backdrop-blur-sm mb-6">
                 ✨ Gratis Ouder Ondersteuning
                </Badge>
                <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">Ouderrichtlijnen voor Neurodivergente Jongeren</h1>
                <p className="text-xl md:text-2xl opacity-90 mb-6">Ethische, praktische ondersteuning voor uw gezin</p>
                <p className="max-w-2xl mx-auto text-lg opacity-80 mb-10">
                    Als ouder van een neurodivergente tiener navigeert u dagelijks door unieke uitdagingen. 
                    Onze uitgebreide richtlijnen bieden concrete tools, zonder medische claims of valse beloftes.
                </p>
                <div className="flex justify-center gap-8 sm:gap-16 flex-wrap">
                    <StatIndicator value="200K+" label="Neurodivergente jongeren in NL" />
                    <StatIndicator value="6-12" label="Maanden GGZ wachttijd" />
                    <StatIndicator value="150K" label="Gezinnen zoeken ondersteuning" />
                </div>
            </div>
        </section>

        {/* Why Different Section */}
        <section className="py-16 md:py-24">
            <div className="container">
                <h2 className="text-3xl font-bold text-center mb-4">Waarom MindNavigator Anders Is</h2>
                <p className="text-lg text-muted-foreground text-center max-w-2xl mx-auto mb-12">
                    We respecteren de grenzen tussen coaching en medische zorg, 
                    en focussen op wat echt werkt voor neurodivergente gezinnen.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <ValuePropCard icon={Target} title="Ethische Benadering">
                        Geen medische claims of diagnoses. We focussen op empowerment, 
                        zelfinzicht en praktische ondersteuning - precies zoals het hoort.
                    </ValuePropCard>
                    <ValuePropCard icon={Brain} title="Wetenschappelijk Fundament">
                         Tools en content gebaseerd op erkende psychologische modellen 
                        en neurodiversiteit-onderzoek. Evidence-based, geen quick fixes.
                    </ValuePropCard>
                    <ValuePropCard icon={Users} title="Gezinsgerichte Aanpak">
                        We betrekken zowel jongeren als ouders, met respect voor 
                        tiener autonomie en begrip voor ouderlijke zorgen.
                    </ValuePropCard>
                    <ValuePropCard icon={Handshake} title="Professionele Integriteit">
                        Duidelijke disclaimers, transparante doorverwijzingen naar 
                        professionals, en eerlijkheid over wat we wel en niet doen.
                    </ValuePropCard>
                </div>

                <Alert variant="destructive" className="mt-12 max-w-3xl mx-auto">
                    <AlertTriangle className="h-5 w-5" />
                    <AlertTitle className="font-bold">Belangrijke Medische Disclaimer</AlertTitle>
                    <AlertDescription>
                        <strong>MindNavigator is GEEN medische dienst</strong> en vervangt nooit professionele zorg. Voor diagnoses (ADHD, autisme, etc.), raadpleeg altijd uw huisarts.
                        Bij acute problemen, bel 112 (spoed) of 113 (suïcidepreventie).
                    </AlertDescription>
                </Alert>
            </div>
        </section>

        {/* Age-Specific Guide */}
        <section className="py-16 md:py-24 bg-muted/40">
            <div className="container">
                 <h2 className="text-3xl font-bold text-center mb-4">Leeftijdsspecifieke Begeleiding</h2>
                <p className="text-lg text-muted-foreground text-center max-w-2xl mx-auto mb-12">
                    Elke ontwikkelingsfase vraagt om een andere aanpak. Onze richtlijnen respecteren de groeiende autonomie van uw tiener.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <AgeCard range="12-15 Jaar" role="Actieve Ouderlijke Begeleiding" description="U heeft volledig inzicht in voortgang, helpt bij coach selectie, en beheert alle betalingen. Focus op vertrouwen opbouwen." />
                    <AgeCard range="16-17 Jaar" role="Ondersteunend Partnerschap" description="Meer autonomie voor uw tiener, u wordt adviseur. Toegang tot voortgang alleen met toestemming van uw kind." />
                    <AgeCard range="18+ Jaar" role="Respectvolle Afstand" description="Volledige controle bij uw volwassen kind. U heeft alleen toegang op uitnodiging." />
                </div>
            </div>
        </section>

         {/* Content Preview */}
        <section className="py-16 md:py-24">
            <div className="container">
                <h2 className="text-3xl font-bold text-center mb-4">Wat Zit Er In De Volledige Richtlijnen?</h2>
                <p className="text-lg text-muted-foreground text-center max-w-2xl mx-auto mb-12">
                     Een complete gids van 40+ pagina's met praktische tips, checklists en professionele inzichten voor uw gezin.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <PreviewCard title="🔒 Privacy & Autonomie" subtitle="Wat u ziet per leeftijdsfase" items={["Dashboard inzichten", "Privacy instellingen configureren", "Communicatie grenzen", "Vertrouwen opbouwen"]} />
                    <PreviewCard title="👥 Coaching & Begeleiding" subtitle="Uw rol bij coach selectie" items={["Coach matching proces", "Kwaliteitsborging", "Wat coaches wel/niet delen", "Effectiviteit meten"]} />
                    <PreviewCard title="🏥 Professionele Hulp" subtitle="Wanneer doorverwijzen" items={["Crisis signalen herkennen", "Noodcontacten & actieplannen", "Samenwerking met GGZ", "Platform grenzen"]} />
                </div>
            </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-24 bg-primary/90 text-primary-foreground">
             <div className="container text-center">
                <h2 className="text-3xl font-bold mb-4">Start Uw Reis Naar Beter Begrip</h2>
                <p className="text-lg opacity-90 max-w-2xl mx-auto mb-8">
                     Download de volledige ouderrichtlijnen gratis en krijg toegang tot 40+ pagina's 
                    met praktische tips, checklists en professionele inzichten.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button size="lg" variant="secondary" asChild className="text-base"><Link href="#">📧 Download Gratis Richtlijnen</Link></Button>
                    <Button size="lg" variant="outline" asChild className="bg-transparent border-white text-white hover:bg-white hover:text-primary text-base"><Link href="#">🎥 Bekijk Demo (3 min)</Link></Button>
                </div>
                <p className="mt-6 text-sm opacity-80">✓ Geen verplichtingen  ✓ Direct downloadbaar  ✓ Email ondersteuning inbegrepen</p>
            </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
