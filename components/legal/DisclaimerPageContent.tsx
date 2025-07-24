// components/legal/DisclaimerPageContent.tsx
"use client";

import { 
    Info, Gavel, CheckCircle, Ban, Bot, Handshake, ShieldCheck, PhoneCall, Scale, Database, HardDrive, Mail, GitBranch
} from 'lucide-react';
import type { ElementType, ReactNode } from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

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

const ListItem = ({ children }: { children: ReactNode }) => (
    <li className="flex items-start gap-3">
        <CheckCircle className="mt-1 h-5 w-5 flex-shrink-0 text-primary/80" />
        <span className="flex-1">{children}</span>
    </li>
);

export function DisclaimerPageContent() {
    return (
        <>
            {/* --- Static Header --- */}
            <div className="mb-12 text-center">
                 <div className="flex justify-center items-center gap-4 mb-4">
                    <Gavel className="h-10 w-10 text-primary" />
                    <h1 className="text-3xl font-bold text-foreground">Disclaimer MindNavigator</h1>
                </div>
                <p className="text-muted-foreground mt-2">Versie 2.0 - Juridisch Compleet</p>
                <p className="text-sm text-muted-foreground mt-1">Laatst bijgewerkt: 15 juli 2025 | Ingangsdatum: 1 augustus 2025</p>
            </div>

            {/* --- Intro Box --- */}
            <div className="bg-primary/5 border-l-4 border-primary p-6 rounded-lg my-12">
                <h2 className="text-xl font-bold mb-2 flex items-center gap-2"><Info className="h-6 w-6"/> Belangrijk - Lees dit zorgvuldig</h2>
                <p className="mb-4">MindNavigator ondersteunt neurodivergente jongeren bij persoonlijke ontwikkeling. Wij bieden educatieve tools en toegang tot begeleiders, maar zijn geen medische instelling. Deze disclaimer beschrijft wat wij wel en niet doen, en uw verantwoordelijkheden als gebruiker.</p>
                <p><strong>Voor ouders:</strong> Deze disclaimer geldt ook voor het gebruik door uw kinderen. Bespreek de inhoud met uw kind waar relevant.</p>
                <p><strong>Voor jongeren:</strong> Als je vragen hebt over deze disclaimer, vraag het aan je ouders of neem contact met ons op.</p>
                <p className="mt-4 font-semibold text-destructive"><strong>In noodgevallen:</strong> Bij direct gevaar of zelfmoordgedachten: bel 112 of 113 Zelfmoordpreventie (0800-0113)</p>
            </div>
            
            <Accordion type="single" collapsible className="w-full" defaultValue="item-1">
                
                <Section icon={CheckCircle} value="item-1">
                    <SubSection>
                        <p>Onze kernfuncties zijn:</p>
                        <ul className="list-none space-y-2 pl-0">
                            <ListItem>Zelfreflectie-instrumenten en dagelijkse coaching tips.</ListItem>
                            <ListItem>Een marktplaats om contact te maken met gekwalificeerde begeleiders.</ListItem>
                            <ListItem>Een community voor verbinding en een dashboard voor ouder-kind inzicht.</ListItem>
                        </ul>
                    </SubSection>
                    <SubSection>
                        <p>Wij zijn er voor neurodivergente jongeren (12-18 jaar) en hun ouders/verzorgers die ondersteuning zoeken bij dagelijkse uitdagingen en persoonlijke groei.</p>
                    </SubSection>
                </Section>

                <Section icon={Ban} value="item-2">
                    <SubSection>
                        <p>Wij bieden nadrukkelijk GEEN medische diagnoses, psychologische behandelingen, medicatie-advies of crisisinterventie. Wij vervangen nooit een huisarts, psycholoog of andere zorgprofessional.</p>
                    </SubSection>
                    <SubSection>
                        <p>Ons platform doet geen officiële uitspraken over schoolcapaciteiten, werkgeschiktheid of juridische procedures en vervangt geen officiële rapporten of verklaringen.</p>
                    </SubSection>
                </Section>
                
                <Section icon={Bot} value="item-3">
                    <SubSection>
                        <p>Onze AI analyseert tool-antwoorden om gepersonaliseerde tips en aanbevelingen te genereren. Deze AI is niet perfect en de inzichten moeten worden gezien als een startpunt voor reflectie, niet als een eindconclusie.</p>
                    </SubSection>
                    <SubSection>
                        <p>Onze tools herkennen patronen in gedrag en voorkeuren. Dit is géén medische of psychologische diagnose en vervangt nooit een professionele beoordeling.</p>
                    </SubSection>
                </Section>

                <Section icon={Handshake} value="item-4">
                    <SubSection>
                        <p>MindNavigator faciliteert het contact, de communicatie en de betalingen tussen u en een begeleider. Wij zijn echter niet verantwoordelijk voor de inhoud, kwaliteit of resultaten van de individuele sessies.</p>
                    </SubSection>
                    <SubSection>
                        <p>Alle begeleiders zijn zelfstandige professionals die verantwoordelijk zijn voor hun eigen diensten. Wij screenen hen op kwalificaties en VOG.</p>
                    </SubSection>
                </Section>
                
                <Section icon={ShieldCheck} value="item-5">
                    <SubSection>
                        <p>Bij signalen van onveilige situaties (zoals mishandeling of zelfmoordgedachten) zijn wij wettelijk verplicht te handelen volgens de meldcode en professionele hulp (zoals Veilig Thuis) in te schakelen.</p>
                    </SubSection>
                    <SubSection>
                        <p>In acute veiligheidssituaties gaat de veiligheid van een kind altijd vóór privacy. Wij zullen dan de nodige stappen zetten om hulp in te schakelen.</p>
                    </SubSection>
                </Section>

                <Section icon={PhoneCall} value="item-6">
                    <SubSection>
                        <p>Ons platform is niet voldoende bij acute situaties (zelfmoordgedachten, paniekaanvallen) of structurele problemen (depressie, eetstoornissen, trauma). Zoek in zulke gevallen direct professionele hulp.</p>
                    </SubSection>
                    <SubSection>
                         <ul className="list-none space-y-2 pl-0">
                            <ListItem><strong>Acute problemen:</strong> Bel 112 (spoed) of 113 (zelfmoordpreventie).</ListItem>
                            <ListItem><strong>Structurele ondersteuning:</strong> De huisarts is het eerste aanspreekpunt voor een verwijzing naar de (Jeugd-)GGZ.</ListItem>
                            <ListItem><strong>Veiligheid:</strong> Bel Veilig Thuis (0800-2000) bij zorgen over huiselijk geweld of kindermishandeling.</ListItem>
                        </ul>
                    </SubSection>
                </Section>
                
                <Section icon={Scale} value="item-7">
                    <SubSection>
                        <p>MindNavigator is niet aansprakelijk voor de gevolgen van AI-adviezen, de resultaten van zelfhulp, of de dienstverlening van externe begeleiders. Uw eigen interpretatie en het tijdig zoeken van professionele hulp blijven uw eigen verantwoordelijkheid.</p>
                    </SubSection>
                    <SubSection>
                         <p>Als gebruiker bent u verantwoordelijk voor het verstrekken van eerlijke informatie, het correct interpreteren van de beperkingen van ons platform en het tijdig zoeken van professionele zorg. Ouders zijn eindverantwoordelijk voor het welzijn van hun kind.</p>
                    </SubSection>
                </Section>

                <Section icon={Database} value="item-8">
                     <p>Wij gebruiken volledig geanonimiseerde gegevens om ons platform te verbeteren, content te ontwikkelen en onze AI te trainen. Deze data is nooit herleidbaar tot individuele gebruikers. Voor wetenschappelijk onderzoek vragen wij altijd apart om uw expliciete toestemming.</p>
                </Section>

                <Section icon={HardDrive} value="item-9">
                     <p>Wij streven naar maximale beschikbaarheid maar kunnen geen 100% uptime of foutloze werking garanderen. Onderhoud en storingen kunnen voorkomen. Wij nemen uitgebreide maatregelen om uw gegevens te beveiligen, maar uw eigen waakzaamheid (bv. een sterk wachtwoord) is ook cruciaal.</p>
                </Section>
                
                <Section icon={Mail} value="item-10">
                    <p>Voor vragen over deze disclaimer of onze medische grenzen, kunt u contact opnemen met <a href="mailto:legal@mindnavigator.nl" className="text-primary hover:underline">legal@mindnavigator.nl</a>. Bij acute veiligheidszorgen, gebruik de daarvoor bestemde kanalen.</p>
                </Section>

                <Section icon={GitBranch} value="item-11">
                    <p>Bij belangrijke wijzigingen in deze disclaimer informeren wij u 30 dagen van tevoren. Voortgezet gebruik van het platform na deze periode geldt als acceptatie van de nieuwe disclaimer.</p>
                </Section>
                
                <Section icon={Gavel} value="item-12">
                     <p>Deze disclaimer moet worden gelezen in samenhang met onze Algemene Voorwaarden en ons Privacybeleid. Nederlands recht is van toepassing op deze disclaimer.</p>
                </Section>
            </Accordion>
            
            <div className="text-center my-12 py-8 border-t border-dashed">
                <p className="font-semibold text-lg mb-4">Door MindNavigator te gebruiken, erkent u dat u deze disclaimer hebt gelezen, begrepen en accepteert.</p>
                <p className="text-sm text-muted-foreground">Laatste update: 15 juli 2025</p>
                <p className="mt-4 italic text-muted-foreground">MindNavigator - Verantwoorde ondersteuning voor neurodivergente jongeren 🌟</p>
            </div>
        </>
    )
}
