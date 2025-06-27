// src/app/for-parents/ouderrichtlijnen/page.tsx
"use client";

import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Brain, Users, ShieldCheck, TrendingUp, BarChart, Target, AlertTriangle, Package, CheckCircle2, Lightbulb, Handshake, Mail, Video, Download, ArrowRight, Lock, FileText, Gavel, Scale, Clock, UserCheck, MessageCircleQuestion, Users2, BookOpenCheck, ClipboardList, Zap } from 'lucide-react';
import type { ElementType } from 'react';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';

const StatIndicator = ({ value, label }: { value: string, label: string }) => (
    <div className="text-center">
        <div className="text-3xl lg:text-4xl font-bold text-accent">{value}</div>
        <div className="text-sm text-muted-foreground mt-1">{label}</div>
    </div>
);

const BenefitCard = ({ icon: Icon, title, ctaText, ctaLink, colorClasses }: { icon: ElementType, title: React.ReactNode, ctaText: string, ctaLink: string, colorClasses: { border: string, bg: string, icon: string, text: string } }) => (
    <Card className={cn(
        "shadow-lg hover:shadow-xl transition-shadow flex flex-col text-center p-6 border-t-4",
        colorClasses.border
    )}>
        <CardHeader className="items-center p-0 mb-4">
            <div className={cn("flex-shrink-0 h-16 w-16 rounded-full flex items-center justify-center", colorClasses.bg)}>
                <Icon className={cn("h-8 w-8", colorClasses.text)} />
            </div>
        </CardHeader>
        <CardContent className="p-0 flex-grow">
            <h3 className="text-xl font-bold text-foreground leading-tight">{title}</h3>
        </CardContent>
        <CardFooter className="p-0 mt-6 w-full">
            <Button variant="outline" asChild className="w-full">
                <Link href={ctaLink}>{ctaText}</Link>
            </Button>
        </CardFooter>
    </Card>
);

const GuideCard = ({
    badgeText, badgeClass, icon: Icon, title, problemIcon: ProblemIcon, problemText, description, statNumber, statLabel, statColor, benefits, ctaText, borderColor
}: {
    badgeText: string; badgeClass: string; icon: ElementType; title: string; problemIcon: ElementType; problemText: string;
    description: string; statNumber: string; statLabel: string; statColor: string; benefits: string[]; ctaText: string; borderColor: string;
}) => (
    <Card className={cn("shadow-lg hover:shadow-xl transition-shadow flex flex-col border-t-4", borderColor)}>
        <CardHeader className="relative">
            <Badge className={cn("absolute top-4 right-4 text-xs", badgeClass)}>{badgeText}</Badge>
            <div className="flex items-center gap-4">
                <div className="flex-shrink-0 h-14 w-14 rounded-full flex items-center justify-center bg-muted">
                    <Icon className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-xl font-bold leading-tight">{title}</CardTitle>
            </div>
        </CardHeader>
        <CardContent className="flex-grow flex flex-col">
            <div className="mb-4">
                <p className="font-semibold text-sm flex items-center gap-2 text-muted-foreground">
                    <ProblemIcon className="h-4 w-4" />
                    Inhoud: "{problemText}"
                </p>
                <p className="text-sm mt-2">{description}</p>
            </div>
            
            <div className={cn("text-center p-4 rounded-lg my-4", statColor.replace('text-', 'bg-').replace('600', '100'))}>
                <div className={cn("text-3xl font-bold", statColor)}>{statNumber}</div>
                <div className="text-xs font-medium text-muted-foreground mt-1">{statLabel}</div>
            </div>

            <ul className="space-y-2 text-sm text-muted-foreground list-none pl-0 flex-grow">
                {benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span>{benefit}</span>
                    </li>
                ))}
            </ul>
        </CardContent>
        <CardFooter>
            <Button asChild className="w-full">
                <Link href="#download-form">{ctaText}</Link>
            </Button>
        </CardFooter>
    </Card>
);


const guideCardData = [
  {
    badgeText: "40+ PAGINA'S", badgeClass: "bg-blue-100 text-blue-800", icon: Users2,
    title: "Leeftijdsspecifieke Ouder Richtlijnen", problemIcon: ClipboardList, problemText: "Uw rol per ontwikkelingsfase",
    description: "Uitgebreide gids die precies uitlegt wat u wel en niet kunt zien van uw tiener, hoe privacy instellingen werken, en welke rol u heeft per leeftijdsgroep.",
    statNumber: "3 Fasen", statLabel: "12-15, 16-17, 18+ jaar richtlijnen", statColor: "text-blue-600",
    benefits: ["Dashboard toegang per leeftijd", "Privacy & autonomie balans uitgelegd", "Communicatie tips per ontwikkelingsfase", "Ouderrol evolutie stap-voor-stap"],
    ctaText: "📖 Bekijk Leeftijd Richtlijnen", borderColor: "border-blue-500",
  },
  {
    badgeText: "PRAKTISCH", badgeClass: "bg-green-100 text-green-800", icon: Target,
    title: "Coaching & Platform Begeleiding", problemIcon: Lightbulb, problemText: "Hoe het platform optimaal gebruiken",
    description: "Complete handleiding voor coach selectie, kwaliteitscontrole, wat coaches wel/niet vertellen, en hoe u platform inzichten thuis kunt implementeren.",
    statNumber: "25+ Tips", statLabel: "Voor coach matching & begeleiding", statColor: "text-green-600",
    benefits: ["Coach selectie proces stap-voor-stap", "Kwaliteitsborging en rode vlaggen", "Platform inzichten naar thuis vertalen", "Huiswerk strategieën die écht werken"],
    ctaText: "🔧 Leer Platform Gebruiken", borderColor: "border-green-500",
  },
  {
    badgeText: "ESSENTIEEL", badgeClass: "bg-red-100 text-red-800", icon: AlertTriangle,
    title: "Crisis Management & Praktische Tips", problemIcon: Zap, problemText: "Wanneer professionele hulp + 150+ FAQ",
    description: "Uitgebreide crisis herkenning checklist, actieplannen, noodcontacten, plus praktische tips voor dagelijkse uitdagingen en veelgestelde vragen.",
    statNumber: "150+ FAQ", statLabel: "Veelgestelde vragen beantwoord", statColor: "text-red-600",
    benefits: ["Crisis signalen herkenning checklist", "24/7 noodcontacten en actieplan", "Dagelijkse routine optimalisatie tips", "School samenwerking strategieën"],
    ctaText: "📋 Krijg Crisis & FAQ Gids", borderColor: "border-red-500",
  },
];


export default function OuderRichtlijnenPage() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState('');
  const { toast } = useToast();

  const handleDownloadRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast({ title: "Fout", description: "Voer alstublieft een geldig e-mailadres in.", variant: "destructive" });
      return;
    }
    console.log(`Email captured for guidelines: ${email}. Simulating sending a link.`);
    setSubmittedEmail(email);
    setIsSubmitted(true);
    toast({
      title: "Verzoek ontvangen!",
      description: `We hebben een e-mail met een persoonlijke, 1 uur geldige downloadlink naar ${email} gestuurd.`
    });
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-white text-foreground py-16 md:py-20 lg:py-24">
            <div className="container mx-auto grid grid-cols-1 items-center gap-y-12 md:grid-cols-2 md:gap-x-16">
                {/* Left Column: Text */}
                <div className="flex flex-col items-center text-center md:items-start md:text-left">
                    <Badge variant="secondary" className="bg-accent/10 border-accent/20 text-accent backdrop-blur-sm mb-6">
                     ✨ Gratis Ouder Ondersteuning
                    </Badge>
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">Ouderrichtlijnen voor Neurodivergente <span className="text-primary">Jongeren</span></h1>
                    <p className="text-lg text-muted-foreground max-w-xl mb-8">
                        Als ouder van een neurodivergente tiener navigeert u dagelijks door unieke uitdagingen. 
                        Download onze uitgebreide gids met concrete tools, zonder medische claims of valse beloftes.
                    </p>
                    
                     <div id="download-form" className="w-full max-w-lg">
                      {isSubmitted ? (
                        <div className="p-4 bg-green-100 border border-green-300 text-green-800 rounded-lg text-left">
                          <h3 className="font-semibold text-lg flex items-center gap-2"><CheckCircle2/> Controleer uw inbox!</h3>
                          <p className="mt-2 text-sm">We hebben een e-mail met een persoonlijke, 1 uur geldige downloadlink gestuurd naar <strong>{submittedEmail}</strong>.</p>
                        </div>
                      ) : (
                        <form onSubmit={handleDownloadRequest} className="flex flex-col sm:flex-row gap-4 w-full">
                          <Input
                            type="email"
                            placeholder="Voer uw e-mailadres in"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="h-12 text-base flex-grow"
                          />
                          <Button type="submit" size="lg" className="text-base sm:text-lg flex-shrink-0 h-12">
                              <Mail className="mr-2 h-5 w-5" />
                              Stuur mij de gids
                          </Button>
                        </form>
                      )}
                      <p className="mt-3 text-xs text-muted-foreground">✓ Geen verplichtingen  ✓ Direct downloadbaar  ✓ Uitschrijven kan altijd</p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-baseline justify-center gap-8 sm:gap-12 mt-8">
                        <StatIndicator value="200K+" label="Neurodivergente jongeren in NL" />
                        <StatIndicator value="6-12" label="Maanden GGZ wachttijd" />
                        <StatIndicator value="150K" label="Gezinnen zoeken ondersteuning" />
                    </div>
                </div>
                {/* Right Column: Image */}
                <div className="relative aspect-video rounded-lg overflow-hidden shadow-2xl w-full max-w-md mx-auto md:max-w-lg">
                    <Image
                        src="https://placehold.co/800x600.png"
                        alt="Ouder die een kind ondersteunt en begeleidt"
                        fill
                        style={{ objectFit: 'cover' }}
                        data-ai-hint="parent child support guidance"
                    />
                </div>
            </div>
        </section>

        {/* Why Different Section */}
        <section className="py-16 md:py-24 bg-muted/40">
            <div className="container">
                <h2 className="text-3xl font-bold text-center mb-4">Krijg De Ondersteuning Die Uw Gezin Verdient</h2>
                <p className="text-lg text-muted-foreground text-center max-w-3xl mx-auto mb-12">
                    Duizenden ouders gingen u voor. Download onze gratis richtlijnen en start vandaag nog met effectieve begeleiding voor uw neurodivergente tiener.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <BenefitCard
                        icon={AlertTriangle}
                        title={"Geen 6 Maanden Meer Wachten"}
                        ctaText="Direct Starten - Gratis Download"
                        ctaLink="#download-form"
                        colorClasses={{ border: "border-red-500", bg: "bg-red-100", icon: "text-red-600", text: 'text-red-700' }}
                    />
                    <BenefitCard
                        icon={ShieldCheck}
                        title={"Eindelijk Eerlijke Ondersteuning"}
                        ctaText="Ontdek Onze Ethische Aanpak"
                        ctaLink="/about"
                        colorClasses={{ border: "border-orange-500", bg: "bg-orange-100", icon: "text-orange-600", text: 'text-orange-700' }}
                    />
                    <BenefitCard
                        icon={TrendingUp}
                        title={"Resultaten Die U Kunt Zien"}
                        ctaText="Lees Succesverhalen & Tips"
                        ctaLink="#"
                        colorClasses={{ border: "border-orange-500", bg: "bg-orange-100", icon: "text-orange-600", text: 'text-orange-700' }}
                    />
                </div>
            </div>
        </section>

        {/* Content Preview Section */}
        <section className="py-16 md:py-24 bg-background">
            <div className="container">
                <h2 className="text-3xl font-bold text-center mb-4">Wat Zit Er In De Ouderrichtlijnen?</h2>
                <p className="text-lg text-muted-foreground text-center max-w-3xl mx-auto mb-12">
                     Een complete gids van 40+ pagina's met praktische tips, checklists en professionele inzichten. 
                     Ontdek precies wat u krijgt als u onze gratis richtlijnen downloadt.
                </p>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                   {guideCardData.map(card => (
                        <GuideCard key={card.title} {...card} />
                   ))}
                </div>
            </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
