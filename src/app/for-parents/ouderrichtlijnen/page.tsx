// src/app/for-parents/ouderrichtlijnen/page.tsx
"use client";

import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Brain, Users, ShieldCheck, TrendingUp, BarChart, Target, AlertTriangle, Package, CheckCircle2, Lightbulb, Handshake, Mail, Video, Download, ArrowRight, Lock, FileText, Gavel, Scale, Clock, UserCheck, MessageCircleQuestion, Users2, BookOpenCheck } from 'lucide-react';
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

const BenefitCard = ({ icon: Icon, title, children, ctaText, ctaLink, colorClasses }: { icon: ElementType, title: React.ReactNode, children: React.ReactNode, ctaText: string, ctaLink: string, colorClasses: { border: string, bg: string, icon: string } }) => (
    <Card className={cn(
        "shadow-lg hover:shadow-xl transition-shadow flex flex-col text-center p-6 border-2",
        colorClasses.border
    )}>
        <CardHeader className="items-center p-0 mb-4">
            <div className={cn("flex-shrink-0 h-16 w-16 rounded-full flex items-center justify-center", colorClasses.bg)}>
                <Icon className={cn("h-8 w-8", colorClasses.icon)} />
            </div>
        </CardHeader>
        <CardContent className="p-0 flex-grow space-y-2">
            <h3 className="text-xl font-bold text-foreground leading-tight">{title}</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
                {children}
            </p>
        </CardContent>
        <CardFooter className="p-0 mt-6 w-full">
            <Button variant="outline" asChild className="w-full">
                <Link href={ctaLink}>{ctaText}</Link>
            </Button>
        </CardFooter>
    </Card>
);

const AgeCard = ({ range, role, description }: { range: string, role: string, description:string }) => (
    <Card className="bg-card text-center flex flex-col h-full shadow-md">
        <CardHeader>
            <CardTitle className="text-2xl font-bold text-primary">{range}</CardTitle>
            <CardDescription className="font-semibold">{role}</CardDescription>
        </CardHeader>
        <CardContent className="flex-grow">
            <p className="text-sm text-muted-foreground">{description}</p>
        </CardContent>
    </Card>
);

const PreviewCard = ({ icon: Icon, title, subtitle }: { icon: ElementType, title: string, subtitle: string }) => (
    <Card className="bg-card shadow-md p-6 text-center hover:bg-muted/50 transition-colors h-full flex flex-col justify-center items-center">
        <Icon className="h-10 w-10 text-primary mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-primary">{title}</h3>
        <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
    </Card>
);

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
                    
                    <div className="w-full max-w-lg">
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
                        colorClasses={{ border: "border-red-500", bg: "bg-red-100", icon: "text-red-600" }}
                    >
                        Krijg direct toegang tot praktische technieken en ondersteuning en overbrug de gemiddelde GGZ-wachttijd van 6-12 maanden.
                    </BenefitCard>
                    <BenefitCard
                        icon={ShieldCheck}
                        title={"Eindelijk Eerlijke Ondersteuning"}
                        ctaText="Ontdek Onze Ethische Aanpak"
                        ctaLink="/about"
                        colorClasses={{ border: "border-orange-500", bg: "bg-orange-100", icon: "text-orange-600" }}
                    >
                        Geloofwaardigheid is essentieel. Wij maken geen valse beloftes over 'genezing', maar bieden een transparante, ethische aanpak die wordt gewaardeerd door 95% van de ouders.
                    </BenefitCard>
                    <BenefitCard
                        icon={TrendingUp}
                        title={"Resultaten Die U Kunt Zien"}
                        ctaText="Lees Succesverhalen & Tips"
                        ctaLink="#"
                        colorClasses={{ border: "border-orange-500", bg: "bg-orange-100", icon: "text-orange-600" }}
                    >
                        Ontdek bewezen strategieën. 89% van de gezinnen ziet een merkbare verbetering binnen de eerste 8 weken.
                    </BenefitCard>
                </div>
            </div>
        </section>

        {/* Content Preview Section */}
        <section className="py-16 md:py-24 bg-background">
            <div className="container">
                <h2 className="text-3xl font-bold text-center mb-4">Wat Zit Er In De Ouderrichtlijnen?</h2>
                <p className="text-lg text-muted-foreground text-center max-w-2xl mx-auto mb-12">
                     Een complete gids van 40+ pagina's met praktische tips, checklists en professionele inzichten. Ontdek precies wat u krijgt als u onze gratis richtlijnen downloadt.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <PreviewCard icon={Users} title="Leeftijdsspecifieke Richtlijnen" subtitle="Van actieve begeleiding tot partnerschap" />
                    <PreviewCard icon={BookOpenCheck} title="Coaching & Platform Begeleiding" subtitle="Handleidingen voor coachselectie en platformgebruik" />
                    <PreviewCard icon={MessageCircleQuestion} title="Crisis Management & Praktische Tips" subtitle="Actieplannen en antwoorden op 150+ veelgestelde vragen" />
                </div>
            </div>
        </section>

        {/* Statistics */}
        <section className="py-16 md:py-24 bg-muted/40">
            <div className="container">
                <Card className="shadow-xl bg-card border">
                    <CardHeader>
                        <CardTitle className="text-center text-3xl font-bold">Waarom Ouders MindNavigator Kiezen</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
                        <div className="p-4">
                            <div className="text-4xl font-bold text-primary mb-2">89%</div>
                            <div className="text-muted-foreground">Ouders zien verbetering binnen 2 maanden</div>
                        </div>
                        <div className="p-4">
                            <div className="text-4xl font-bold text-primary mb-2">€45</div>
                            <div className="text-muted-foreground">Gemiddelde kosten p/mnd (vs €120 particulier)</div>
                        </div>
                        <div className="p-4">
                            <div className="text-4xl font-bold text-primary mb-2">24/7</div>
                            <div className="text-muted-foreground">Crisis ondersteuning beschikbaar</div>
                        </div>
                         <div className="p-4">
                            <div className="text-4xl font-bold text-primary mb-2">95%</div>
                            <div className="text-muted-foreground">Ouders waarderen ethische transparantie</div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
