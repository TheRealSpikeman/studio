// components/legal/CookiePageContent.tsx
"use client";

import Link from 'next/link';
import { 
    Info, Building, ListChecks, Gavel, ShieldCheck, Rocket, Share2, Globe, Archive, Lock, FileSignature, Cookie, Bot, GitBranch, PhoneCall, Scale, UserCheck, ArrowRight, HardDrive, Cpu, Database, BarChart2, UserCog, Ban
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
    <div className="overflow-x-auto rounded-lg border my-4">
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

export function CookiePageContent() {
    return (
        <>
            {/* --- Static Header --- */}
            <div className="mb-12 text-center">
                 <div className="flex justify-center items-center gap-4 mb-4">
                    <Cookie className="h-10 w-10 text-primary" />
                    <h1 className="text-3xl font-bold text-foreground">Cookiebeleid MindNavigator</h1>
                </div>
                <p className="text-muted-foreground mt-2">Versie 2.0 - AVG Compliant</p>
                <p className="text-sm text-muted-foreground mt-1">Laatst bijgewerkt: 15 juli 2025 | Ingangsdatum: 1 augustus 2025</p>
            </div>

            {/* --- Intro Box --- */}
            <div className="bg-primary/5 border-l-4 border-primary p-6 rounded-lg my-12">
                <h2 className="text-xl font-bold mb-2 flex items-center gap-2"><Info className="h-6 w-6"/> Snel overzicht - Wat u moet weten</h2>
                <p className="mb-4">MindNavigator gebruikt minimale cookies en browseropslag om ons platform te laten werken. Wij gebruiken GEEN marketing cookies, advertentie tracking of complexe externe diensten.</p>
                <ul className="list-none space-y-2 pl-0">
                    <ListItem><strong>Essentiële opslag</strong> kan niet worden uitgeschakeld (Firebase authenticatie)</ListItem>
                    <ListItem><strong>Google Analytics cookies</strong> kunt u zelf in- of uitschakelen</ListItem>
                    <ListItem><strong>Voor minderjarigen</strong> gelden speciale beschermingsregels</ListItem>
                </ul>
                <p className="mt-4"><strong>Uw voorkeuren wijzigen?</strong> Via de cookie-instellingen in uw account of browser.</p>
            </div>
            
            <Accordion type="single" collapsible className="w-full" defaultValue="item-1">
                
                <Section title="1. Wat zijn cookies en waarom gebruiken wij ze?" icon={Info} value="item-1">
                    <SubSection title="1.1 Wat zijn cookies?">
                        <p>Cookies zijn kleine tekstbestanden die websites op uw apparaat opslaan. Ze fungeren als een 'geheugen' voor de website, zodat deze uw bezoek en voorkeuren kan onthouden om beter te werken.</p>
                    </SubSection>
                    <SubSection title="1.2 Waarom gebruikt MindNavigator cookies?">
                         <ul className="list-none space-y-2 pl-0">
                            <ListItem><strong>Platform Functionaliteit:</strong> Om u ingelogd te houden en uw voortgang op te slaan.</ListItem>
                            <ListItem><strong>Gebruikerservaring:</strong> Om uw voorkeuren te onthouden en de interface te personaliseren.</ListItem>
                            <ListItem><strong>Verbetering en Analytics:</strong> Om anoniem te begrijpen hoe ons platform wordt gebruikt.</ListItem>
                        </ul>
                    </SubSection>
                </Section>

                <Section title="2. Welke cookies gebruiken wij?" icon={ListChecks} value="item-2">
                    <SubSection title="2.1 Essentiële Opslag (Altijd Actief)">
                        <p>Noodzakelijk voor de kernfunctionaliteit van het platform. Deze kunnen niet worden uitgeschakeld.</p>
                        <Table 
                            headers={["Naam", "Type", "Doel", "Bewaartijd"]}
                            rows={[
                                ["firebase:authUser:[...]", "IndexedDB", "Inlogstatus en gebruikersgegevens bewaren", "Tot uitloggen"],
                                ["__session or g-state", "Cookie (Google)", "Firebase authenticatie ondersteuning", "Sessie"],
                                ["mindnavigator_cookie_consent", "localStorage", "Uw cookie voorkeuren onthouden", "Permanent"]
                            ]}
                        />
                        <p><strong>Belangrijk:</strong> `localStorage` en `IndexedDB` worden niet automatisch naar onze servers gestuurd, wat uw privacy ten goede komt.</p>
                    </SubSection>
                    <SubSection title="2.2 Analytische Cookies (Toestemming Vereist)">
                        <p>Deze worden alleen geplaatst na uw toestemming en helpen ons het platform te verbeteren.</p>
                         <Table 
                            headers={["Cookie Naam", "Provider", "Doel", "Bewaartijd"]}
                            rows={[
                                ["_ga", "Google Analytics", "Onderscheiden van unieke gebruikers", "2 jaar"],
                                ["_gid", "Google Analytics", "Onderscheiden van gebruikers (kort)", "24 uur"],
                                ["_gat_*", "Google Analytics", "Beperken van server aanvragen", "1 minuut"]
                            ]}
                        />
                         <p>Alle data is geanonimiseerd. IP-adressen worden niet volledig opgeslagen.</p>
                    </SubSection>
                     <SubSection title="2.3 Functionele Opslag (Administratief)">
                         <p>Dit betreft opslag voor technische en beheerdoeleinden, zoals het testen van de cookie-banner. Deze hebben geen impact op uw privacy.</p>
                    </SubSection>
                    <SubSection title="2.4 Marketing Cookies - Niet van toepassing">
                        <div className="flex items-center gap-2 p-4 bg-destructive/10 border-l-4 border-destructive text-destructive rounded-md">
                            <Ban className="h-6 w-6" />
                            <p className="font-semibold">MindNavigator gebruikt geen marketing cookies, advertentie tracking of cross-site tracking.</p>
                        </div>
                    </SubSection>
                </Section>
                
                <Section title="3. Speciale bescherming voor minderjarigen" icon={ShieldCheck} value="item-3">
                    <SubSection title="3.1 Extra privacy waarborgen voor jongeren">
                        <p>Voor gebruikers onder de 16 zijn niet-essentiële cookies standaard uitgeschakeld en hebben ouders controle over de cookie-instellingen.</p>
                    </SubSection>
                    <SubSection title="3.2 Ouderlijke controle">
                        <p>Ouders van kinderen onder de 16 kunnen via hun ouder-account de cookievoorkeuren voor hun kind beheren.</p>
                    </SubSection>
                </Section>

                <Section title="4. Derde partij cookies en internationale overdracht" icon={Globe} value="item-4">
                    <p>We gebruiken een beperkt aantal externe dienstverleners zoals Google (voor Analytics en Firebase). Waar data buiten de EU wordt verwerkt, zorgen wij voor adequate wettelijke bescherming, zoals Standard Contractual Clauses (SCC's).</p>
                </Section>
                
                <Section title="5. Uw cookie voorkeuren beheren" icon={UserCog} value="item-5">
                    <SubSection title="5.1 Via MindNavigator platform">
                        <p>U kunt uw toestemming voor Google Analytics op elk moment aanpassen via de "Privacy & Cookies" instellingen in uw account dashboard.</p>
                    </SubSection>
                     <SubSection title="5.2 Via uw Browser">
                        <p>U kunt cookies beheren en verwijderen via de instellingen van uw browser (Chrome, Firefox, Safari, etc.).</p>
                    </SubSection>
                     <SubSection title="5.3 Do Not Track">
                        <p>MindNavigator respecteert "Do Not Track" (DNT) signalen van uw browser. Als DNT is ingeschakeld, worden analytische cookies automatisch uitgeschakeld.</p>
                    </SubSection>
                </Section>
                
                <Section title="6. Gevolgen van cookies weigeren" icon={BarChart2} value="item-6">
                     <SubSection title="6.1 Per categorie">
                         <ul className="list-none space-y-2 pl-0">
                            <ListItem><strong>Essentiële opslag uitschakelen:</strong> Het platform werkt niet meer; inloggen is onmogelijk.</ListItem>
                            <ListItem><strong>Google Analytics weigeren:</strong> Het platform werkt volledig, maar u helpt ons niet anoniem te verbeteren.</ListItem>
                        </ul>
                    </SubSection>
                </Section>

                <Section title="7. Juridische informatie en Contact" icon={Gavel} value="item-7">
                     <SubSection title="7.1 Toepasselijke wetgeving">
                        <p>Wij volgen de Europese ePrivacy Richtlijn en de AVG (GDPR), alsook de Nederlandse Telecommunicatiewet.</p>
                    </SubSection>
                     <SubSection title="7.2 Contact en klachten">
                        <p>Voor vragen over cookies kunt u mailen naar <a href="mailto:cookies@mindnavigator.nl" className="text-primary hover:underline">cookies@mindnavigator.nl</a>. Voor klachten kunt u, na eerst contact met ons, terecht bij de <a href="https://autoriteitpersoonsgegevens.nl" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Autoriteit Persoonsgegevens</a>.</p>
                    </SubSection>
                </Section>

            </Accordion>
            
            <div className="text-center my-12 py-8 border-t border-dashed">
                <p className="font-semibold text-lg mb-4">Door onze website te gebruiken stemt u in met dit cookiebeleid. U kunt uw voorkeuren altijd wijzigen.</p>
                <p className="text-sm text-muted-foreground">Laatste update: 15 juli 2025</p>
                <p className="mt-4 italic text-muted-foreground">MindNavigator - Transparant over cookies, beschermend van privacy 🍪🔒</p>
            </div>
        </>
    )
}
