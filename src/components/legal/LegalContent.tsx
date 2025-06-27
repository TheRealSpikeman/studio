// src/components/legal/LegalContent.tsx
import Link from 'next/link';
import { ExternalLink, ShieldCheck, AlertTriangle, Gavel, Stethoscope, Bot, Scale, Edit2 } from '@/lib/icons';
import type { ElementType } from 'react';

// Helper component for consistent section styling
const Section = ({ title, children, icon: Icon }: { title: string, children: React.ReactNode, icon?: ElementType }) => (
    <div className="mb-6">
        <h4 className="flex items-center gap-2 text-lg font-semibold text-foreground mb-3">
            {Icon && <Icon className="h-5 w-5 text-primary" />}
            {title}
        </h4>
        <div className="space-y-3 text-base text-muted-foreground pl-7">
            {children}
        </div>
    </div>
);

// Helper for consistent list item styling
const ListItem = ({ children }: { children: React.ReactNode }) => (
    <li className="flex items-start gap-3">
        <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
        <span className="flex-1">{children}</span>
    </li>
);

export const PrivacyPolicyContent = () => (
    <div className="text-sm">
        <Section title="1. Inleiding" icon={ShieldCheck}>
            <p>Welkom bij MindNavigator. Wij hechten veel waarde aan uw privacy en de bescherming van uw persoonsgegevens. In dit privacybeleid leggen wij uit hoe wij uw gegevens verzamelen, gebruiken, delen en beschermen. Dit beleid is van toepassing op al onze diensten en websites.</p>
        </Section>

        <Section title="2. Welke gegevens verzamelen wij?" icon={ShieldCheck}>
            <ul className="list-none space-y-3 pl-0">
                <ListItem><strong>Contactgegevens:</strong> zoals uw naam en e-mailadres wanneer u zich aanmeldt of contact met ons opneemt.</ListItem>
                <ListItem><strong>Accountgegevens:</strong> gebruikersnaam, wachtwoord (versleuteld), en andere informatie die u verstrekt bij het aanmaken van een account.</ListItem>
                <ListItem><strong>Antwoorden op zelfreflectie tools:</strong> de antwoorden die u geeft op onze tools en de daaruit voortvloeiende overzichten en inzichten. Deze data wordt geanonimiseerd verwerkt voor AI-analyse.</ListItem>
                <ListItem><strong>Gebruiksgegevens:</strong> informatie over hoe u onze website en diensten gebruikt, zoals IP-adres, browsertype, bezochte pagina's en interacties met features.</ListItem>
                <ListItem><strong>Communicatie:</strong> inhoud van berichten die u met ons of via ons platform uitwisselt (bijvoorbeeld met coaches of tutors, indien van toepassing).</ListItem>
                <ListItem><strong>Betalingsgegevens (Ouders):</strong> indien u een betaald abonnement afsluit, worden uw betalingsgegevens verwerkt door een beveiligde derde partij. MindNavigator slaat zelf geen volledige creditcardnummers op.</ListItem>
            </ul>
        </Section>

        <Section title="3. Hoe gebruiken wij uw gegevens?" icon={ShieldCheck}>
            <p>Uw gegevens worden gebruikt om de dienst te verlenen, gepersonaliseerde inzichten te genereren, de dienst te verbeteren, met u te communiceren, betalingen te verwerken en te voldoen aan wettelijke verplichtingen. We gebruiken geanonimiseerde data om onze AI modellen te trainen en te verbeteren.</p>
        </Section>
        
        <Section title="4. Delen van uw gegevens" icon={ShieldCheck}>
            <p>Wij delen uw persoonsgegevens niet met derden, tenzij:</p>
            <ul className="list-none space-y-3 pl-0">
                <ListItem>Dit noodzakelijk is voor het uitvoeren van onze diensten (bijvoorbeeld met onze hostingprovider of payment provider).</ListItem>
                <ListItem>Wij hiertoe wettelijk verplicht zijn.</ListItem>
                <ListItem>U hiervoor expliciet toestemming heeft gegeven (bijvoorbeeld voor het delen van inzichten met een gekoppelde coach).</ListItem>
            </ul>
            <p className="mt-3">De inzichten die door GenAI features worden gegenereerd, zijn gebaseerd op de input die u verstrekt. Deze input wordt verwerkt door AI-modellen om de output te creëren. Wij verkopen uw persoonlijke input niet.</p>
        </Section>

        <Section title="5. Beveiliging van uw gegevens" icon={ShieldCheck}>
            <p>Wij nemen passende technische en organisatorische maatregelen om uw persoonsgegevens te beschermen tegen verlies, misbruik, en ongeautoriseerde toegang, zoals encryptie en toegangscontroles.</p>
        </Section>

        <Section title="6. Uw rechten (AVG/GDPR)" icon={ShieldCheck}>
            <p>U heeft recht op inzage, rectificatie, verwijdering, beperking, overdraagbaarheid en bezwaar. Neem contact op om uw rechten uit te oefenen via uw profielpagina of onze support.</p>
        </Section>
        
        <Section title="7. Bewaartermijnen" icon={ShieldCheck}>
            <p>Wij bewaren uw gegevens niet langer dan noodzakelijk is voor de doeleinden waarvoor ze zijn verzameld of zolang als wettelijk vereist is.</p>
        </Section>

        <Section title="8. Cookies" icon={ShieldCheck}>
            <p>Wij gebruiken cookies om de functionaliteit van onze website te verbeteren. Zie ons <Link href="/cookies" className="text-primary hover:underline font-medium">Cookiebeleid</Link>.</p>
        </Section>
    </div>
);

export const TermsContent = () => (
    <div className="text-sm">
        <Section title="1. Toepasselijkheid" icon={Edit2}>
            <p>Deze Algemene Voorwaarden zijn van toepassing op elk gebruik van de diensten en website van MindNavigator. Door gebruik te maken van de Dienst, aanvaardt u deze voorwaarden volledig.</p>
        </Section>
        <Section title="2. Gebruik van de Dienst" icon={Edit2}>
            <p>U stemt ermee in de Dienst alleen te gebruiken voor wettige doeleinden en op een manier die geen inbreuk maakt op de rechten van, of het gebruik en genot van de Dienst door, een derde beperkt of belemmert. U bent verantwoordelijk voor het geheimhouden van uw accountgegevens en alle activiteiten die onder uw account plaatsvinden.</p>
        </Section>
        <Section title="3. Intellectueel Eigendom" icon={Edit2}>
            <p>Alle inhoud op de Dienst, inclusief teksten, afbeeldingen, logo's, tools en software, is eigendom van MindNavigator of haar licentiegevers en wordt beschermd door auteursrecht en andere intellectuele eigendomsrechten. U mag de inhoud niet kopiëren, reproduceren of distribueren zonder onze voorafgaande schriftelijke toestemming.</p>
        </Section>
        <Section title="4. Abonnementen en Betalingen" icon={Edit2}>
            <p>Voor toegang tot premium features is een betaald abonnement vereist. Betalingen worden verwerkt via een beveiligde externe payment provider. Abonnementen worden automatisch verlengd, tenzij opgezegd voor de verlengingsdatum. Voor gebruikers onder de 18 jaar is toestemming van een ouder of wettelijke voogd vereist voor het aangaan van een betaald abonnement.</p>
        </Section>
         <Section title="5. Beëindiging" icon={Edit2}>
            <p>MindNavigator behoudt zich het recht voor om uw toegang tot de Dienst op elk moment op te schorten of te beëindigen, zonder voorafgaande kennisgeving, indien u deze voorwaarden schendt.</p>
        </Section>
        <Section title="6. Disclaimer & Aansprakelijkheid" icon={AlertTriangle}>
            <p>MindNavigator is een educatief hulpmiddel en geen medische dienst. Wij bieden geen diagnoses of medische behandelingen. Raadpleeg altijd een gekwalificeerde zorgverlener. Wij zijn niet aansprakelijk voor enige directe of indirecte schade die voortvloeit uit het gebruik van onze Dienst. Lees de volledige <Link href="/disclaimer" className="text-primary hover:underline font-medium">Disclaimer</Link> voor meer informatie.</p>
        </Section>
    </div>
);

export const DisclaimerContent = () => (
    <div className="text-sm">
        <Section title="Geen Medische Diagnose of Advies" icon={AlertTriangle}>
            <p>MindNavigator en de daarin aangeboden zelfreflectie-instrumenten, coaching tips, en andere content zijn uitsluitend bedoeld voor educatieve en informatieve doeleinden. Ze zijn <strong>nadrukkelijk geen vervanging</strong> voor professioneel medisch, psychologisch, of orthopedagogisch advies, diagnose, of behandeling.</p>
        </Section>

        <Section title="Raadpleeg Altijd een Professional" icon={Stethoscope}>
            <p>De informatie op dit platform mag niet worden gebruikt voor het diagnosticeren of behandelen van een gezondheidsprobleem of ziekte. Als u of uw kind vragen of zorgen heeft over mentale of fysieke gezondheid, dient u altijd contact op te nemen met een gekwalificeerde zorgverlener (huisarts, psycholoog, kinderarts, etc.).</p>
        </Section>
        
        <Section title="Gebruik van AI-gegenereerde Content" icon={Bot}>
            <p>Delen van de inzichten en aanbevelingen op dit platform worden gegenereerd met behulp van kunstmatige intelligentie (AI). Hoewel we streven naar hoge kwaliteit, kan AI-gegenereerde content onnauwkeurigheden bevatten of niet van toepassing zijn op uw specifieke situatie. Gebruik deze inzichten als een startpunt voor reflectie en gesprek, niet als een absolute waarheid.</p>
        </Section>
        
        <Section title="Beperking van Aansprakelijkheid" icon={Scale}>
            <p>Het gebruik van de informatie en tools op dit platform is geheel op eigen risico. MindNavigator, haar medewerkers en partners zijn niet aansprakelijk voor enige directe of indirecte schade die voortvloeit uit het gebruik van de Dienst of het vertrouwen op de verstrekte informatie.</p>
        </Section>
    </div>
);
