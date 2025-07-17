// components/legal/PrivacyPageContent.tsx
"use client";

import Link from 'next/link';
import { 
    Info, Building, ListChecks, Gavel, ShieldCheck, Rocket, Share2, Globe, Archive, Lock, FileSignature, Cookie, Bot, GitBranch, PhoneCall, Scale, UserCheck, ArrowRight
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

const ListItem = ({ children, icon: Icon = ArrowRight }: { children: ReactNode, icon?: ElementType }) => (
    <li className="flex items-start gap-3">
        <Icon className="mt-1 h-5 w-5 flex-shrink-0 text-primary/80" />
        <span className="flex-1">{children}</span>
    </li>
);

const Table = ({ headers, rows }: { headers: string[], rows: (string|ReactNode)[][] }) => (
    <div className="overflow-x-auto rounded-lg border">
        <table className="w-full text-left text-sm">
            <thead className="bg-muted/50">
                <tr>
                    {headers.map((header, i) => <th key={i} className="p-3 font-semibold">{header}</th>)}
                </tr>
            </thead>
            <tbody>
                {rows.map((row, i) => (
                    <tr key={i} className="border-t">
                        {row.map((cell, j) => <td key={j} className="p-3">{cell}</td>)}
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);


export function PrivacyPageContent() {
    return (
        <>
            {/* --- Static Header --- */}
            <div className="mb-12 text-center">
                 <div className="flex justify-center items-center gap-4 mb-4">
                    <ShieldCheck className="h-10 w-10 text-primary" />
                    <h1 className="text-3xl font-bold text-foreground">Privacybeleid MindNavigator</h1>
                </div>
                <p className="text-muted-foreground mt-2">Versie 2.0 - AVG Compliant</p>
                <p className="text-sm text-muted-foreground mt-1">Laatst bijgewerkt: 15 juli 2025 | Ingangsdatum: 1 augustus 2025</p>
            </div>

            {/* --- Intro Box --- */}
            <div className="bg-primary/5 border-l-4 border-primary p-6 rounded-lg my-12">
                <h2 className="text-xl font-bold mb-2 flex items-center gap-2"><Info className="h-6 w-6"/> Snel overzicht - Wat u moet weten</h2>
                <p className="mb-4">MindNavigator respecteert uw privacy en beschermt uw gegevens conform de AVG (GDPR). Wij verzamelen alleen gegevens die nodig zijn voor ons platform en delen deze nooit voor commerciële doeleinden.</p>
                <p><strong>Voor ouders:</strong> Uw kind heeft privacyrechten, maar u heeft bepaalde inzagerechten als uw kind jonger is dan 16 jaar.</p>
                <p><strong>Voor jongeren:</strong> Jouw gegevens zijn veilig bij ons. Je bepaalt zelf veel over je privacy, afhankelijk van je leeftijd.</p>
                <p className="mt-4"><strong>Vragen?</strong> E-mail naar <a href="mailto:privacy@mindnavigator.nl" className="text-primary hover:underline">privacy@mindnavigator.nl</a></p>
            </div>
            
            {/* --- Accordion Structure --- */}
            <Accordion type="single" collapsible className="w-full" defaultValue="item-1">
                
                <Section title="1. Wie zijn wij en waarom dit beleid?" icon={Building} value="item-1">
                    <SubSection title="1.1 Verantwoordelijke voor gegevensverwerking">
                        <p><strong>MindNavigator B.V.</strong><br/>Adres: [Bedrijfsadres]<br/>KvK: [Nummer]<br/>E-mail: <a href="mailto:privacy@mindnavigator.nl" className="text-primary hover:underline">privacy@mindnavigator.nl</a><br/>Website: www.mindnavigator.nl</p>
                    </SubSection>
                    <SubSection title="1.2 Functionaris Gegevensbescherming">
                         <p><strong>Data Protection Officer (DPO):</strong><br/>E-mail: <a href="mailto:dpo@mindnavigator.nl" className="text-primary hover:underline">dpo@mindnavigator.nl</a><br/>Voor alle privacy-gerelateerde vragen en klachten.</p>
                    </SubSection>
                    <SubSection title="1.3 Waarom dit beleid?">
                        <ul className="list-none space-y-2 pl-0">
                            <ListItem><strong>Transparantie</strong>: U heeft recht om te weten wat er met uw gegevens gebeurt.</ListItem>
                            <ListItem><strong>Controle</strong>: U moet controle hebben over uw persoonlijke informatie.</ListItem>
                            <ListItem><strong>Wettelijke verplichting</strong>: De AVG (GDPR) vereist dit van ons.</ListItem>
                            <ListItem><strong>Vertrouwen</strong>: Uw vertrouwen is de basis van onze samenwerking.</ListItem>
                        </ul>
                    </SubSection>
                </Section>

                <Section title="2. Welke gegevens verzamelen wij?" icon={ListChecks} value="item-2">
                    <SubSection title="2.1 Accountgegevens (Verplicht)">
                        <p>Naam, e-mailadres, geboortedatum, versleuteld wachtwoord, en IP-adres.</p>
                    </SubSection>
                     <SubSection title="2.2 Profielgegevens (Optioneel)">
                        <p>Schoolinformatie, interesses, doelen, en voorkeuren.</p>
                    </SubSection>
                    <SubSection title="2.3 Platform Gebruik (Automatisch)">
                        <p>Antwoorden op tools, voortgangsdata, login activiteit, en platform gedrag.</p>
                    </SubSection>
                    <SubSection title="2.4 Communicatie Gegevens">
                        <p>Berichten met klantenservice en begeleiders, feedback, en meldingen.</p>
                    </SubSection>
                    <SubSection title="2.5 Betalingsgegevens (Alleen bij betaalde abonnementen)">
                        <p>Factuurgegevens, type betalingsmethode (geen kaartgegevens), en transactiehistorie.</p>
                    </SubSection>
                    <SubSection title="2.6 AI-Gegenereerde Content">
                        <p>Persoonlijke rapporten, coaching suggesties en voortgangsanalyses.</p>
                    </SubSection>
                </Section>
                
                <Section title="3. Waarom verzamelen wij deze gegevens? (Rechtsgronden AVG)" icon={Gavel} value="item-3">
                    <SubSection title="3.1 Contractuitvoering (Art. 6.1.b AVG)">
                        <p>Om onze diensten te leveren, zoals accountbeheer, platformfunctionaliteit en klantenservice.</p>
                    </SubSection>
                    <SubSection title="3.2 Gerechtvaardigd belang (Art. 6.1.f AVG)">
                        <p>Voor platformverbetering, beveiliging en onderzoek (anoniem).</p>
                    </SubSection>
                    <SubSection title="3.3 Toestemming (Art. 6.1.a AVG)">
                        <p>Voor optionele zaken zoals marketing e-mails, analytics cookies en geavanceerde personalisatie. U kunt toestemming altijd intrekken.</p>
                    </SubSection>
                    <SubSection title="3.4 Wettelijke verplichting (Art. 6.1.c AVG)">
                        <p>Waar de wet het vereist, zoals het 7 jaar bewaren van belastinggegevens.</p>
                    </SubSection>
                </Section>

                <Section title="4. Speciale bescherming voor minderjarigen (Art. 8 AVG)" icon={ShieldCheck} value="item-4">
                    <SubSection title="4.1 Kinderen van 12-15 jaar">
                         <ul className="list-none space-y-2 pl-0">
                            <ListItem><strong>Ouderlijke toestemming vereist</strong> voor alle gegevensverwerking.</ListItem>
                            <ListItem>Ouders hebben recht op inzage, correctie en verwijdering van de gegevens van hun kind.</ListItem>
                        </ul>
                    </SubSection>
                     <SubSection title="4.2 Jongeren van 16-17 jaar">
                         <ul className="list-none space-y-2 pl-0">
                            <ListItem>Jongeren kunnen <strong>zelf toestemming geven</strong> en hun privacy beheren.</ListItem>
                            <ListItem>Ouderlijke betrokkenheid is nog nodig voor betalingen en bij veiligheidszorgen.</ListItem>
                        </ul>
                    </SubSection>
                     <SubSection title="4.3 Privacy tussen ouder en kind">
                        <p>Voor 12-15 jarigen kunnen ouders de voortgang zien, maar geen privéberichten. 16-17 jarigen bepalen zelf wat ouders zien, behalve voor betalingsgerelateerde info.</p>
                    </SubSection>
                </Section>
                
                <Section title="5. Hoe gebruiken wij uw gegevens?" icon={Rocket} value="item-5">
                    <SubSection title="5.1 Platform Functionaliteit & AI">
                        <p>We gebruiken uw data om het platform te laten werken, content te personaliseren en met behulp van AI (zoals OpenAI en Google Cloud AI) rapporten en coaching tips te genereren. Uw data wordt nooit gebruikt om AI-modellen te trainen.</p>
                    </SubSection>
                    <SubSection title="5.2 Marktplaats, Communicatie & Verbetering">
                        <p>We gebruiken gegevens om u te verbinden met begeleiders, met u te communiceren over onze diensten, en om ons platform te analyseren en te verbeteren.</p>
                    </SubSection>
                </Section>

                <Section title="6. Met wie delen wij uw gegevens?" icon={Share2} value="item-6">
                    <SubSection title="6.1 Binnen MindNavigator & Externe Dienstverleners">
                        <p>Gegevens worden alleen op 'need-to-know' basis gedeeld met ons personeel. We gebruiken vertrouwde externe partners (processors) voor hosting (AWS/Google Cloud in EU), betalingen (Stripe/Mollie) en support (Zendesk). Al deze partijen zijn AVG-compliant.</p>
                    </SubSection>
                    <SubSection title="6.2 Begeleiders op ons Platform & Wettelijke Verplichtingen">
                         <p>Met uw toestemming delen we relevante gegevens met de door u gekozen begeleider. In uitzonderlijke gevallen delen we gegevens als de wet dit vereist (bv. met de Belastingdienst of Veilig Thuis).</p>
                    </SubSection>
                     <SubSection title="6.3 Wat wij NOOIT doen">
                        <p><strong>Wij verkopen uw data nooit.</strong> We delen het niet met adverteerders of databrokers.</p>
                    </SubSection>
                </Section>

                <Section title="7. Internationale gegevensoverdracht" icon={Globe} value="item-7">
                    <p>Onze data wordt primair binnen de EU verwerkt en opgeslagen. Voor de enkele diensten buiten de EU (zoals OpenAI) zorgen we voor de juiste wettelijke bescherming via Standard Contractual Clauses (SCC's) en aanvullende waarborgen.</p>
                </Section>
                
                <Section title="8. Hoe lang bewaren wij uw gegevens?" icon={Archive} value="item-8">
                    <Table 
                        headers={["Type Gegevens", "Bewaartermijn", "Reden"]}
                        rows={[
                            ["Account gegevens", "Tot 2 jaar na verwijdering", "Wettelijke verplichtingen, geschillen"],
                            ["Platform gebruik", "1 jaar na laatste activiteit", "Klantenservice, technische support"],
                            ["Communicatie", "3 jaar na laatste bericht", "Geschillenresolutie"],
                            ["Betalingsgegevens", "7 jaar", "Belastingwet verplichting"],
                        ]}
                    />
                </Section>

                <Section title="9. Beveiliging van uw gegevens" icon={Lock} value="item-9">
                    <SubSection title="9.1 Technische & Organisatorische Beveiliging">
                         <p>Wij beschermen uw gegevens met state-of-the-art beveiliging, waaronder:</p>
                        <ul className="list-none space-y-2 pl-0">
                            <ListItem><strong>Versleuteling</strong> (in transit en at rest).</ListItem>
                            <ListItem>Strikte <strong>toegangscontroles</strong> met multi-factor authenticatie.</ListItem>
                            <ListItem>Verplichte <strong>privacy training</strong> voor medewerkers.</ListItem>
                            <ListItem>Een helder <strong>Data Breach Protocol</strong>.</ListItem>
                        </ul>
                    </SubSection>
                    <SubSection title="9.2 Wat u kunt doen">
                        <p>Gebruik een sterk, uniek wachtwoord en wees voorzichtig op openbare WiFi-netwerken.</p>
                    </SubSection>
                </Section>

                <Section title="10. Uw privacy rechten (AVG)" icon={UserCheck} value="item-10">
                    <p>U heeft diverse rechten onder de AVG. U kunt deze uitoefenen via uw account of door een e-mail te sturen naar <a href="mailto:privacy@mindnavigator.nl" className="text-primary hover:underline">privacy@mindnavigator.nl</a>.</p>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <li className="font-semibold">✓ Recht op Inzage</li>
                        <li className="font-semibold">✓ Recht op Rectificatie</li>
                        <li className="font-semibold">✓ Recht op Verwijdering</li>
                        <li className="font-semibold">✓ Recht op Beperking</li>
                        <li className="font-semibold">✓ Recht op Overdraagbaarheid</li>
                        <li className="font-semibold">✓ Recht op Bezwaar</li>
                    </ul>
                     <p className="mt-4">Wij nemen geen belangrijke beslissingen volledig geautomatiseerd; er is altijd menselijke controle mogelijk.</p>
                </Section>
                
                <Section title="11. Cookies en tracking" icon={Cookie} value="item-11">
                    <SubSection title="11.1 Cookie Beheer">
                        <p>We gebruiken essentiële, analytische, functionele en marketing cookies. U kunt uw voorkeuren beheren via de cookie banner bij uw eerste bezoek en later via uw accountinstellingen. Wij respecteren "Do Not Track" signalen van uw browser.</p>
                    </SubSection>
                </Section>

                <Section title="12. Profilering en geautomatiseerde besluitvorming" icon={Bot} value="item-12">
                    <p>We gebruiken profilering voor het personaliseren van content en aanbevelingen. Echter, we nemen geen belangrijke beslissingen (zoals het blokkeren van een account) volledig geautomatiseerd. U heeft altijd recht op menselijke tussenkomst en uitleg.</p>
                </Section>

                <Section title="13. Wijzigingen in dit privacybeleid" icon={GitBranch} value="item-13">
                    <p>Bij grote wijzigingen in ons beleid informeren wij u 30 dagen van tevoren per e-mail. Door het platform te blijven gebruiken, gaat u akkoord met de wijzigingen.</p>
                </Section>

                <Section title="14. Contact en klachten" icon={PhoneCall} value="item-14">
                    <SubSection title="14.1 Vragen of klachten?">
                        <p>Neem eerst contact met ons op via <a href="mailto:privacy@mindnavigator.nl" className="text-primary hover:underline">privacy@mindnavigator.nl</a>. Komen we er samen niet uit, dan kunt u een klacht indienen bij de <a href="https://autoriteitpersoonsgegevens.nl" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Autoriteit Persoonsgegevens</a>.</p>
                    </SubSection>
                </Section>
                
            </Accordion>
            
             {/* --- Footer --- */}
            <div className="text-center my-12 py-8 border-t border-dashed">
                <p className="font-semibold text-lg mb-4">Dit privacybeleid is opgesteld conform de AVG en beschermt uw rechten maximaal. Bij vragen staan wij altijd voor u klaar.</p>
                <p className="text-sm text-muted-foreground">Laatste update: 15 juli 2025</p>
                <p className="mt-4 italic text-muted-foreground">MindNavigator - Uw privacy, onze prioriteit 🔒</p>
            </div>
        </>
    )
}
