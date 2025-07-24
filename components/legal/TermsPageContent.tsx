// components/legal/TermsPageContent.tsx
"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { 
    Users, BookOpen, AlertTriangle, ShieldCheck, CreditCard, XCircle, 
    User, FileText, CheckCircle, Ban, Code, Shield, Mail, Phone,
    HeartHandshake, Building, Anchor, GitCommitVertical, Star, Bot, Scale, Handshake, MessageSquareWarning, ArrowRight, BookUser, Gavel, Edit2, Info, GitBranch, Milestone, Lock, Globe, ListChecks, Users2, FileSignature, CircleSlash, Box, Rocket, Target, Lightbulb, Copyright, PhoneCall, Flag
} from 'lucide-react';
import type { ElementType, ReactNode } from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

// Helper components, now adapted for the accordion structure

const Section = ({ title, icon: Icon, children, value }: { title: string, icon: ElementType, children: ReactNode, value: string }) => (
    <AccordionItem value={value}>
        <AccordionTrigger className="text-xl hover:no-underline">
            <div className="flex items-center gap-3">
                <Icon className="h-6 w-6 text-primary/80" />
                <span className="font-semibold text-left">{title}</span>
            </div>
        </AccordionTrigger>
        <AccordionContent>
            <div className="space-y-6 text-base text-muted-foreground leading-relaxed border-l-2 border-primary/20 pl-8 ml-3 pt-4">
                {children}
            </div>
        </AccordionContent>
    </AccordionItem>
);

const SubSection = ({ title, children }: { title: string, children: React.ReactNode }) => (
    <div className="mb-6">
        <h3 className="text-lg font-semibold text-foreground mb-3">{title}</h3>
        <div className="space-y-4 text-base text-muted-foreground">{children}</div>
    </div>
)

const ListItem = ({ children, icon: Icon = ArrowRight }: { children: ReactNode, icon?: ElementType }) => (
    <li className="flex items-start gap-3">
        <Icon className="mt-1 h-5 w-5 flex-shrink-0 text-primary/80" />
        <span className="flex-1">{children}</span>
    </li>
);

interface TermsPageContentProps {
  hideTitle?: boolean;
}

export function TermsPageContent({ hideTitle = false }: TermsPageContentProps) {
    return (
        <>
            {/* --- Static Header --- */}
            {!hideTitle && (
                <div className="mb-12 text-center">
                    <div className="flex justify-center items-center gap-4 mb-4">
                        <FileSignature className="h-10 w-10 text-primary" />
                        <h1 className="text-3xl font-bold text-foreground">Algemene Voorwaarden MindNavigator</h1>
                    </div>
                    <p className="text-muted-foreground mt-2">Versie 2.1 - Juridisch Compleet</p>
                    <p className="text-sm text-muted-foreground mt-1">Laatst bijgewerkt: 15 juli 2025 | Ingangsdatum: 1 augustus 2025</p>
                </div>
            )}

            {/* --- Intro Box --- */}
            <div className="bg-primary/5 border-l-4 border-primary p-6 rounded-lg my-12">
                <h2 className="text-xl font-bold mb-2 flex items-center gap-2"><Info className="h-6 w-6"/> Wat u moet weten voordat u begint</h2>
                <p className="mb-4">MindNavigator helpt neurodivergente jongeren met persoonlijke ontwikkeling. We zijn geen medische instelling en stellen geen diagnoses. Deze voorwaarden leggen uit hoe ons platform werkt en wat uw rechten en plichten zijn.</p>
                <p><strong>Voor ouders:</strong> Als uw kind jonger is dan 18 jaar, lees dan vooral de secties over leeftijd en veiligheid.</p>
                <p><strong>Voor jongeren:</strong> We respecteren jouw privacy, maar je ouders hebben bepaalde rechten als je jonger bent dan 16 jaar.</p>
            </div>
            
            {/* --- Accordion Structure --- */}
            <Accordion type="single" collapsible className="w-full">
                
                {/* --- Part 1 Content --- */}
                <Section icon={Building} value="item-1">
                    <SubSection>
                        <ul className="list-none space-y-2 pl-0">
                            <ListItem icon={Anchor}><strong>Bedrijf:</strong> MindNavigator B.V., gevestigd in Nederland (KvK: [nummer])</ListItem>
                            <ListItem icon={Star}><strong>Wat we doen:</strong> Een online platform voor persoonlijke ontwikkeling van neurodivergente jongeren.</ListItem>
                            <ListItem icon={CircleSlash}><strong>Wat we NIET doen:</strong> Medische diagnoses, therapie of behandelingen.</ListItem>
                        </ul>
                    </SubSection>
                    <SubSection>
                        <ul className="list-none space-y-2 pl-0">
                            <ListItem>Door ons platform te gebruiken, gaat u akkoord met deze regels.</ListItem>
                            <ListItem>Bent u het er niet mee eens? Dan kunt u ons platform niet gebruiken.</ListItem>
                            <ListItem>We gebruiken soms juridische termen, maar proberen alles zo duidelijk mogelijk uit te leggen.</ListItem>
                        </ul>
                    </SubSection>
                    <SubSection>
                        <ul className="list-none space-y-2 pl-0">
                            <ListItem><strong>Platform:</strong> Onze website, app en alle diensten.</ListItem>
                            <ListItem><strong>Deelnemer:</strong> Jongere (12-18 jaar) die onze tools gebruikt.</ListItem>
                            <ListItem><strong>Begeleider:</strong> Coach of tutor die diensten aanbiedt via ons platform.</ListItem>
                            <ListItem><strong>U/jij:</strong> De persoon die ons platform gebruikt.</ListItem>
                        </ul>
                    </SubSection>
                </Section>

                <Section icon={Users2} value="item-2">
                    <SubSection>
                        <h4 className="font-semibold text-lg mb-2">👨‍👩‍👧‍👦 Je ouders moeten meedoen</h4>
                        <ul className="list-none space-y-2 pl-0">
                            <ListItem>Je ouders moeten toestemming geven voor je account.</ListItem>
                            <ListItem>Je ouders betalen voor premium diensten.</ListItem>
                            <ListItem>Je ouders kunnen meekijken naar je voortgang (maar alleen wat nodig is).</ListItem>
                            <ListItem>Voor coaching sessies moet een ouder toestemming geven.</ListItem>
                        </ul>
                    </SubSection>
                    <SubSection>
                        <h4 className="font-semibold text-lg mb-2">🔓 Meer vrijheid, maar ouders zijn nog betrokken</h4>
                        <ul className="list-none space-y-2 pl-0">
                            <ListItem>Je kunt zelf een account aanmaken.</ListItem>
                            <ListItem>Je bepaalt zelf wat je deelt met je ouders.</ListItem>
                            <ListItem>Voor betaalde diensten hebben we nog wel toestemming van je ouders nodig.</ListItem>
                            <ListItem>Je kunt zelf coaching sessies boeken (als je ouders betalen).</ListItem>
                        </ul>
                    </SubSection>
                    <SubSection>
                        <h4 className="font-semibold text-lg mb-2">✅ Volledige zelfstandigheid</h4>
                        <ul className="list-none space-y-2 pl-0">
                            <ListItem>Je bent volledig verantwoordelijk voor je eigen account.</ListItem>
                            <ListItem>Je kunt zelf betalen en alle beslissingen nemen.</ListItem>
                            <ListItem>Geen ouderlijke betrokkenheid vereist.</ListItem>
                        </ul>
                    </SubSection>
                </Section>

                <Section icon={BookUser} value="item-3">
                     <SubSection>
                         <h4 className="font-semibold text-lg mb-2">📝 Geef juiste informatie</h4>
                        <ul className="list-none space-y-2 pl-0">
                           <ListItem>Vul altijd echte, correcte informatie in.</ListItem>
                           <ListItem>Eén account per persoon (geen extra accounts maken).</ListItem>
                           <ListItem>Houd je wachtwoord geheim en veilig.</ListItem>
                        </ul>
                    </SubSection>
                    <SubSection>
                         <h4 className="font-semibold text-lg mb-2">🚫 Verboden acties</h4>
                        <ul className="list-none space-y-2 pl-0">
                            <ListItem><strong>Misbruik maken:</strong> Het platform gebruiken voor dingen waar het niet voor is.</ListItem>
                            <ListItem><strong>Anderen kwetsen:</strong> Pesten, bedreigen of discrimineren.</ListItem>
                            <ListItem><strong>Illegaal:</strong> Alles wat tegen de wet is.</ListItem>
                        </ul>
                    </SubSection>
                </Section>

                <Section icon={Handshake} value="item-4">
                     <SubSection>
                        <h4 className="font-semibold text-lg mb-2">🤝 Wij brengen jou in contact met begeleiders</h4>
                        <ul className="list-none space-y-2 pl-0">
                            <ListItem>Wij zijn de verbinding tussen jou en coaches/tutors.</ListItem>
                            <ListItem>Begeleiders werken zelfstandig (niet voor MindNavigator).</ListItem>
                            <ListItem>Wij zorgen voor veilige betalingen en communicatie.</ListItem>
                        </ul>
                    </SubSection>
                     <SubSection>
                        <h4 className="font-semibold text-lg mb-2">✅ Zorgvuldig geselecteerd</h4>
                        <ul className="list-none space-y-2 pl-0">
                            <ListItem><strong>Screening:</strong> Alle begeleiders hebben relevante diploma's.</ListItem>
                            <ListItem><strong>Veiligheidscheck:</strong> VOG (Verklaring Omtrent Gedrag) verplicht.</ListItem>
                            <ListItem><strong>Kwaliteitscontrole:</strong> Regelmatige evaluaties en feedback.</ListItem>
                        </ul>
                    </SubSection>
                </Section>

                <Section icon={CreditCard} value="item-5">
                    <SubSection>
                        <h4 className="font-semibold text-lg mb-2">💰 Duidelijke prijzen, geen verrassingen</h4>
                        <p>De actuele prijzen en plannen staan op onze <Link href="/pricing" className="text-primary hover:underline">prijzenpagina</Link>.</p>
                         <ul className="list-none space-y-2 pl-0 mt-2">
                            <ListItem><strong>Automatische verlenging:</strong> Tenzij je opzegt.</ListItem>
                            <ListItem><strong>Prijswijzigingen:</strong> 30 dagen vooraf aangekondigd.</ListItem>
                        </ul>
                    </SubSection>
                    <SubSection>
                        <h4 className="font-semibold text-lg mb-2">🚪 Vrijheid om te stoppen</h4>
                        <ul className="list-none space-y-2 pl-0">
                            <ListItem><strong>Tot 24 uur voor verlenging</strong> kun je opzeggen via je account.</ListItem>
                            <ListItem><strong>Geen restitutie</strong> van al betaalde bedragen (tenzij wettelijk verplicht).</ListItem>
                        </ul>
                    </SubSection>
                    <SubSection>
                        <h4 className="font-semibold text-lg mb-2">🔄 14 dagen bedenktijd</h4>
                        <ul className="list-none space-y-2 pl-0">
                            <ListItem><strong>Nieuwe abonnementen:</strong> 14 dagen om je te bedenken en je geld terug te krijgen.</ListItem>
                            <ListItem><strong>Uitzondering:</strong> Dit recht vervalt als je de dienst binnen die 14 dagen al actief gebruikt.</ListItem>
                        </ul>
                    </SubSection>
                </Section>

                <Section icon={AlertTriangle} value="item-6">
                    <SubSection>
                        <h4 className="font-semibold text-lg mb-2">⚠️ Wij zijn GEEN medische instelling</h4>
                         <ul className="list-none space-y-2 pl-0">
                            <ListItem><strong>Geen diagnoses:</strong> Wij stellen geen ADHD, autisme of andere diagnoses.</ListItem>
                            <ListItem><strong>Geen therapie:</strong> Wij bieden geen psychologische behandeling.</ListItem>
                            <ListItem><strong>Geen vervanging:</strong> Wij vervangen geen professionele hulp.</ListItem>
                        </ul>
                    </SubSection>
                    <SubSection>
                        <h4 className="font-semibold text-lg mb-2">🏥 Ga naar een professional bij:</h4>
                        <ul className="list-none space-y-2 pl-0">
                            <ListItem>Ernstige problemen, angsten, depressie, of als je je grote zorgen maakt.</ListItem>
                            <ListItem><strong>Huisarts</strong> is altijd het eerste aanspreekpunt.</ListItem>
                        </ul>
                    </SubSection>
                </Section>

                {/* --- Part 2 Content --- */}
                <Section icon={ShieldCheck} value="item-7">
                    <SubSection>
                        <h4 className="font-semibold text-lg mb-2">🔒 Wij beschermen je gegevens goed</h4>
                         <ul className="list-none space-y-2 pl-0">
                            <ListItem>We voldoen aan de AVG-wetgeving.</ListItem>
                            <ListItem>Alle gevoelige informatie wordt versleuteld opgeslagen.</ListItem>
                            <ListItem>Wij verkopen NOOIT je gegevens aan anderen.</ListItem>
                            <ListItem>Lees ons volledige <Link href="/privacy" className="text-primary hover:underline">Privacybeleid</Link> voor alle details.</ListItem>
                        </ul>
                    </SubSection>
                    <SubSection>
                        <h4 className="font-semibold text-lg mb-2">🔧 Jij hebt controle over je gegevens</h4>
                        <ul className="list-none space-y-2 pl-0">
                            <ListItem><strong>Inzien, Corrigeren, Verwijderen:</strong> Je kunt via je account of via <a href="mailto:privacy@mindnavigator.nl" className="text-primary hover:underline">privacy@mindnavigator.nl</a> je gegevens beheren.</ListItem>
                        </ul>
                    </SubSection>
                </Section>

                <Section icon={Shield} value="item-8">
                     <SubSection>
                        <h4 className="font-semibold text-lg mb-2">🛡️ Wij zorgen voor een veilige omgeving</h4>
                        <p>Bij signalen van onveilige situaties (zoals huiselijk geweld, kindermishandeling, of zelfmoordgedachten) zijn wij wettelijk verplicht de meldcode te volgen en professionele hulp zoals Veilig Thuis (0800-2000) in te schakelen.</p>
                        <p className="mt-2"><strong>Veiligheid gaat boven privacy in acute situaties.</strong></p>
                    </SubSection>
                </Section>

                <Section icon={Copyright} value="item-9">
                     <SubSection>
                        <h4 className="font-semibold text-lg mb-2">© Ons platform en content</h4>
                        <ul className="list-none space-y-2 pl-0">
                            <ListItem>Alle tools, tests, en educatieve content zijn van ons en mag je niet kopiëren of commercieel gebruiken.</ListItem>
                        </ul>
                    </SubSection>
                    <SubSection>
                        <h4 className="font-semibold text-lg mb-2">✍️ Wat jij deelt is van jou</h4>
                         <ul className="list-none space-y-2 pl-0">
                            <ListItem>Jij blijft eigenaar van wat je schrijft en deelt. Jij bent hier ook verantwoordelijk voor.</ListItem>
                        </ul>
                    </SubSection>
                </Section>

                <Section icon={XCircle} value="item-10">
                     <SubSection>
                        <h4 className="font-semibold text-lg mb-2">🚪 Altijd jouw keuze om te stoppen</h4>
                        <ul className="list-none space-y-2 pl-0">
                            <ListItem>Dit kan via je accountinstellingen.</ListItem>
                            <ListItem>Je toegang stopt en je gegevens worden verwijderd volgens ons privacybeleid.</ListItem>
                        </ul>
                    </SubSection>
                    <SubSection>
                        <h4 className="font-semibold text-lg mb-2">⚠️ Alleen in ernstige gevallen</h4>
                        <p>Wij kunnen je account sluiten bij herhaalde of ernstige schending van de voorwaarden, illegale activiteiten of veiligheidsrisico's.</p>
                    </SubSection>
                </Section>
                
                {/* --- Part 3 Content --- */}
                <Section icon={Scale} value="item-11">
                     <SubSection>
                        <h4 className="font-semibold text-lg mb-2">⚠️ Waarvoor wij NIET aansprakelijk zijn</h4>
                         <ul className="list-none space-y-2 pl-0">
                            <ListItem>We garanderen geen specifieke resultaten.</ListItem>
                            <ListItem>De diensten van externe begeleiders vallen onder hun eigen verantwoordelijkheid.</ListItem>
                            <ListItem>Onze aansprakelijkheid is beperkt tot directe schade door grove nalatigheid, met een maximum dat is vastgelegd in de volledige voorwaarden.</ListItem>
                        </ul>
                     </SubSection>
                </Section>
                
                <Section icon={GitBranch} value="item-12">
                     <SubSection>
                        <h4 className="font-semibold text-lg mb-2">📬 Je krijgt altijd bericht</h4>
                        <ul className="list-none space-y-2 pl-0">
                            <ListItem><strong>30 dagen vooraf</strong> krijg je een e-mail bij belangrijke wijzigingen.</ListItem>
                            <ListItem>Als je het platform blijft gebruiken, ga je akkoord met de nieuwe voorwaarden.</ListItem>
                            <ListItem>Ben je het niet eens? Dan kun je je account opzeggen voordat de nieuwe voorwaarden ingaan.</ListItem>
                        </ul>
                    </SubSection>
                </Section>

                <Section icon={Gavel} value="item-13">
                     <SubSection>
                        <h4 className="font-semibold text-lg mb-2">🤝 We lossen het liefst samen op</h4>
                         <ol className="list-decimal list-inside space-y-2">
                            <li><strong>Stap 1: Contact onze klantenservice</strong> via <a href="mailto:support@mindnavigator.nl" className="text-primary hover:underline">support@mindnavigator.nl</a>.</li>
                            <li><strong>Stap 2: Mediatie of een geschillencommissie</strong> als we er samen niet uitkomen.</li>
                            <li><strong>Stap 3: Rechtbank (laatste redmiddel)</strong>. Nederlands recht is van toepassing.</li>
                        </ol>
                    </SubSection>
                </Section>

                <Section icon={PhoneCall} value="item-14">
                    <SubSection>
                        <h4 className="font-semibold text-lg mb-2">📞 Bereikbaar voor al je vragen</h4>
                         <ul className="list-none space-y-2 pl-0 mt-2">
                             <ListItem><strong>Algemene vragen:</strong> <a href="mailto:support@mindnavigator.nl" className="text-primary hover:underline">support@mindnavigator.nl</a></ListItem>
                             <ListItem><strong>Privacy vragen:</strong> <a href="mailto:privacy@mindnavigator.nl" className="text-primary hover:underline">privacy@mindnavigator.nl</a></ListItem>
                             <ListItem><strong>Veiligheid melden:</strong> <a href="mailto:safety@mindnavigator.nl" className="text-primary hover:underline">safety@mindnavigator.nl</a></ListItem>
                        </ul>
                     </SubSection>
                </Section>
            </Accordion>
            
            {!hideTitle && (
                <div className="text-center my-12 py-8 border-t border-dashed">
                    <p className="font-semibold text-lg mb-4">Door ons platform te gebruiken ga je akkoord met deze voorwaarden. Heb je vragen? Neem dan contact met ons op.</p>
                    <p className="text-sm text-muted-foreground">Laatste update: 15 juli 2025</p>
                    <p className="mt-4 italic text-muted-foreground">MindNavigator - Samen groeien, veilig en respectvol 🌱</p>
                </div>
            )}
        </>
    )
}
