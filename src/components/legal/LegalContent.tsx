// src/components/legal/LegalContent.tsx
import Link from 'next/link';
import { ExternalLink } from 'lucide-react';

export const PrivacyPolicyContent = () => (
    <>
        <h4>1. Inleiding</h4>
        <p>Welkom bij MindNavigator. Wij hechten veel waarde aan uw privacy en de bescherming van uw persoonsgegevens. In dit privacybeleid leggen wij uit hoe wij uw gegevens verzamelen, gebruiken, delen en beschermen.</p>

        <h4>2. Welke gegevens verzamelen wij?</h4>
        <ul className="list-disc pl-5">
            <li><strong>Contactgegevens:</strong> naam en e-mailadres.</li>
            <li><strong>Accountgegevens:</strong> gebruikersnaam, versleuteld wachtwoord.</li>
            <li><strong>Antwoorden op zelfreflectie tools:</strong> uw antwoorden en de daaruit voortvloeiende inzichten.</li>
            <li><strong>Gebruiksgegevens:</strong> IP-adres, browsertype, bezochte pagina's.</li>
            <li><strong>Communicatie:</strong> inhoud van berichten die u met ons uitwisselt.</li>
            <li><strong>Betalingsgegevens (Ouders):</strong> verwerkt door een beveiligde derde partij.</li>
        </ul>

        <h4>3. Hoe gebruiken wij uw gegevens?</h4>
        <p>Uw gegevens worden gebruikt om de dienst te verlenen, gepersonaliseerde inzichten te genereren, de dienst te verbeteren, met u te communiceren, betalingen te verwerken en te voldoen aan wettelijke verplichtingen.</p>

        <h4>4. Delen van uw gegevens</h4>
        <p>Wij delen uw gegevens niet met derden, tenzij dit noodzakelijk is voor de dienst (bv. hosting), wij wettelijk verplicht zijn, of u expliciet toestemming geeft (bv. voor het delen van inzichten met een coach).</p>

        <h4>5. Beveiliging van uw gegevens</h4>
        <p>Wij nemen passende technische en organisatorische maatregelen om uw gegevens te beschermen.</p>

        <h4>6. Uw rechten (AVG/GDPR)</h4>
        <p>U heeft recht op inzage, rectificatie, verwijdering, beperking, overdraagbaarheid en bezwaar. Neem contact met ons op om uw rechten uit te oefenen.</p>

        <h4>7. Bewaartermijnen</h4>
        <p>Wij bewaren uw gegevens niet langer dan noodzakelijk.</p>

        <h4>8. Cookies</h4>
        <p>Wij gebruiken cookies om de functionaliteit te verbeteren. Zie ons <Link href="/cookies" className="text-primary hover:underline font-medium">Cookiebeleid</Link>.</p>
    </>
);

export const TermsContent = () => (
    <>
        <h4>1. Toepasselijkheid</h4>
        <p>Deze voorwaarden zijn van toepassing op elk gebruik van de diensten van MindNavigator. Door gebruik te maken van de Dienst, aanvaardt u deze voorwaarden.</p>

        <h4>2. Gebruik van de Dienst</h4>
        <p>U stemt ermee in de Dienst alleen te gebruiken voor wettige doeleinden. U bent verantwoordelijk voor het geheimhouden van uw accountgegevens.</p>

        <h4>3. Intellectueel Eigendom</h4>
        <p>Alle inhoud op de Dienst is eigendom van MindNavigator en wordt beschermd door auteursrecht. U mag de inhoud niet gebruiken zonder onze toestemming.</p>
        
        <h4>4. Zelfreflectie-instrumenten en Inzichten</h4>
        <p>De tools en inzichten zijn bedoeld voor informatieve en educatieve doeleinden en zijn geen vervanging voor professioneel medisch advies. Raadpleeg een gekwalificeerde zorgverlener voor diagnoses.</p>

        <h4>5. GenAI Features</h4>
        <p>Delen van de Dienst maken gebruik van generatieve AI. De output kan onnauwkeurigheden bevatten en dient als startpunt voor reflectie.</p>

        <h4>6. Abonnementen en Betalingen</h4>
        <p>Voor premium features is een abonnement nodig. Voor gebruikers onder 18 is toestemming van een ouder/voogd vereist voor betalingen.</p>

        <h4>7. Beperking van Aansprakelijkheid</h4>
        <p>MindNavigator is niet aansprakelijk voor enige schade die voortvloeit uit het gebruik van de Dienst. Het gebruik is op eigen risico.</p>
    </>
);

export const DisclaimerContent = () => (
     <>
        <h4>Geen Medische Diagnose of Advies</h4>
        <p>MindNavigator en de daarin aangeboden zelfreflectie-instrumenten zijn uitsluitend bedoeld voor educatieve doeleinden, zelfinzicht en persoonlijke ontwikkeling. De content op dit platform is <strong>nadrukkelijk geen vervanging</strong> voor professioneel medisch, psychologisch, of orthopedagogisch advies, diagnose, of behandeling.</p>

        <h4>Raadpleeg Altijd een Professional</h4>
        <p>Als u of uw kind vragen of zorgen heeft over mentale gezondheid, gedrag, of ontwikkeling, dient u altijd contact op te nemen met een gekwalificeerde zorgverlener (huisarts, psycholoog, etc.).</p>

        <h4>Beperking van Aansprakelijkheid</h4>
        <p>Het gebruik van de informatie en tools op dit platform is geheel op eigen risico. MindNavigator is niet aansprakelijk voor enige directe of indirecte schade die voortvloeit uit het gebruik van dit platform.</p>

        <h4>Gebruik van AI-gegenereerde Content</h4>
        <p>AI-gegenereerde content kan onnauwkeurigheden bevatten. Gebruik deze inzichten als een startpunt voor reflectie en niet als definitieve waarheden.</p>
    </>
);
