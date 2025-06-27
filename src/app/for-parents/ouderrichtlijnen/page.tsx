
// src/app/for-parents/ouderrichtlijnen/page.tsx
"use client";

import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Brain, Users, ShieldCheck, TrendingUp, BarChart, Target, AlertTriangle, Package, CheckCircle2, Lightbulb, Handshake, Mail, Video, Download, ArrowRight, Lock, FileText, Gavel, Scale, Clock } from 'lucide-react';
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
    <Card className={cn("shadow-lg hover:shadow-xl transition-shadow border-l-4", colorClasses.border)}>
        <CardContent className="p-6 flex flex-col h-full">
            <div className="flex items-start gap-4 mb-4">
                <div className={cn("flex-shrink-0 h-12 w-12 rounded-full flex items-center justify-center", colorClasses.bg)}>
                    <Icon className={cn("h-6 w-6", colorClasses.icon)} />
                </div>
                <h3 className="text-lg font-bold text-foreground leading-tight">{title}</h3>
            </div>
            <p className="text-muted-foreground text-sm flex-grow mb-6">
                {children}
            </p>
            <div className="mt-auto">
                <Button variant="ghost" asChild className="p-2 h-auto text-sm text-foreground hover:bg-gray-100 border border-gray-200 w-full justify-center rounded-lg">
                    <Link href={ctaLink}>{ctaText}</Link>
                </Button>
            </div>
        </CardContent>
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
    <Card className="bg-card shadow-md p-6 text-center hover:bg-primary/10 transition-colors h-full flex flex-col justify-center items-center">
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
        <section className="bg-background text-foreground py-16 md:py-20 lg:py-24">
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

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                     <BenefitCard
                        icon={AlertTriangle}
                        title={<>Geen 6<br />Maanden Wachten</>}
                        ctaText="Direct Starten - Gratis Download"
                        ctaLink="#"
                        colorClasses={{ border: "border-red-500", bg: "bg-red-100", icon: "text-red-600" }}
                    >
                        Krijg direct toegang tot praktische technieken en ondersteuning zonder de lange GGZ-wachttijden.
                    </BenefitCard>
                    <BenefitCard
                        icon={ShieldCheck}
                        title={<>Eindelijk<br />Eerlijke Ondersteuning</>}
                        ctaText="Ontdek Onze Ethische Aanpak"
                        ctaLink="/about"
                        colorClasses={{ border: "border-green-500", bg: "bg-green-100", icon: "text-green-600" }}
                    >
                        Wij maken geen valse beloftes over 'genezing'. Onze ethische, transparante aanpak is gericht op empowerment.
                    </BenefitCard>
                    <BenefitCard
                        icon={TrendingUp}
                        title={<>Begeleiding<br />Die Mee Groeit</>}
                        ctaText="Ontdek Uw Rol Per Leeftijd"
                        ctaLink="#age-guide-section"
                        colorClasses={{ border: "border-blue-500", bg: "bg-blue-100", icon: "text-blue-600" }}
                    >
                        Onze richtlijnen zijn afgestemd op de verschillende ontwikkelingsfases van uw tiener, van 12 tot 18+ jaar.
                    </BenefitCard>
                    <BenefitCard
                        icon={BarChart}
                        title={<>Resultaten<br />Die U Kunt Zien</>}
                        ctaText="Lees Succesverhalen & Tips"
                        ctaLink="#"
                        colorClasses={{ border: "border-orange-500", bg: "bg-orange-100", icon: "text-orange-600" }}
                    >
                        Gebaseerd op de ervaringen van meer dan 1000+ gezinnen. Ontdek strategieën die bewezen hebben te werken.
                    </BenefitCard>
                </div>
            </div>
        </section>

        {/* Age-Specific Guide Preview */}
        <section id="age-guide-section" className="py-16 md:py-24 bg-background">
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
        <section className="py-16 md:py-24 bg-muted/40">
            <div className="container">
                <h2 className="text-3xl font-bold text-center mb-4">Wat Zit Er In De Volledige Richtlijnen?</h2>
                <p className="text-lg text-muted-foreground text-center max-w-2xl mx-auto mb-12">
                     Een complete gids van 40+ pagina's met praktische tips, checklists en professionele inzichten voor uw gezin.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <PreviewCard icon={Lock} title="Privacy & Autonomie" subtitle="Wat u ziet per leeftijdsfase" />
                    <PreviewCard icon={Users} title="Coaching & Begeleiding" subtitle="Uw rol bij coach selectie" />
                    <PreviewCard icon={Gavel} title="Professionele Hulp" subtitle="Wanneer doorverwijzen" />
                </div>
            </div>
        </section>

        {/* Statistics */}
        <section className="py-16 md:py-24 bg-background">
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
