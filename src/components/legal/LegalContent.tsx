// src/components/legal/LegalContent.tsx
import Link from 'next/link';
import { ExternalLink } from 'lucide-react';

export const PrivacyPolicyContent = () => (
    <div className="space-y-4">
        <h4>1. Inleiding</h4>
        <p>Welkom bij MindNavigator. Wij hechten veel waarde aan uw privacy en de bescherming van uw persoonsgegevens. In dit privacybeleid leggen wij uit hoe wij uw gegevens verzamelen, gebruiken, delen en beschermen.</p>

        <h4>2. Welke gegevens verzamelen wij?</h4>
        <ul className="list-disc pl-5 space-y-1">
            <li><strong>Contactgegevens:</strong> zoals uw naam en e-mailadres wanneer u zich aanmeldt.</li>
            <li><strong>Accountgegevens:</strong> gebruikersnaam, wachtwoord (versleuteld), en andere informatie die u verstrekt bij het aanmaken van een account.</li>
            <li><strong>Antwoorden op zelfreflectie tools:</strong> de antwoorden die u geeft op onze tools en de daaruit voortvloeiende overzichten en inzichten.</li>
            <li><strong>Gebruiksgegevens:</strong> informatie over hoe u onze website en diensten gebruikt, zoals IP-adres, browsertype, bezochte pagina's, de duur van uw bezoek en interacties met features.</li>
            <li><strong>Communicatie:</strong> inhoud van berichten die u met ons of via ons platform uitwisselt (bijvoorbeeld met coaches of tutors, indien van toepassing).</li>
            <li><strong>Betalingsgegevens (Ouders):</strong> indien u een betaald abonnement afsluit, worden uw betalingsgegevens verwerkt door een beveiligde derde partij (payment provider). MindNavigator slaat zelf geen volledige creditcardnummers op.</li>
        </ul>

        <h4>3. Hoe gebruiken wij uw gegevens?</h4>
        <p>Uw gegevens worden gebruikt om de dienst te verlenen, gepersonaliseerde inzichten te genereren, de dienst te verbeteren, met u te communiceren, betalingen te verwerken en te voldoen aan wettelijke verplichtingen.</p>
        
        <h4>4. Delen van uw gegevens</h4>
        <p>Wij delen uw persoonsgegevens niet met derden, tenzij:</p>
         <ul className="list-disc pl-5 space-y-1">
            <li>Dit noodzakelijk is voor het uitvoeren van onze diensten (bijvoorbeeld met onze hostingprovider of payment provider). Deze partijen zijn contractueel verplicht uw gegevens te beschermen.</li>
            <li>Wij hiertoe wettelijk verplicht zijn (bijvoorbeeld op last van een gerechtelijk bevel).</li>
            <li>U hiervoor expliciet toestemming heeft gegeven (bijvoorbeeld voor het delen van inzichten met een gekoppelde coach of tutor, na uw instemming).</li>
        </ul>
        <p>De inzichten die door GenAI features (zoals samenvattingen en coaching tips) worden gegenereerd, zijn gebaseerd op de input die u verstrekt. Deze input wordt verwerkt door AI-modellen om de output te creëren. Wij verkopen uw persoonlijke input niet.</p>

        <h4>5. Beveiliging van uw gegevens</h4>
        <p>Wij nemen passende technische en organisatorische maatregelen om uw persoonsgegevens te beschermen tegen verlies, misbruik, en ongeautoriseerde toegang.</p>

        <h4>6. Uw rechten (AVG/GDPR)</h4>
        <p>U heeft recht op inzage, rectificatie, verwijdering, beperking, overdraagbaarheid en bezwaar. Neem contact op om uw rechten uit te oefenen.</p>
        
        <h4>7. Bewaartermijnen</h4>
        <p>Wij bewaren uw gegevens niet langer dan noodzakelijk is voor de doeleinden waarvoor ze zijn verzameld.</p>

        <h4>8. Cookies</h4>
        <p>Wij gebruiken cookies om de functionaliteit van onze website te verbeteren. Zie ons <Link href="/cookies" className="text-primary hover:underline font-medium">Cookiebeleid</Link>.</p>
    </div>
);

export const TermsContent = () => (
    <div className="space-y-4">
        <h4>1. Toepasselijkheid</h4>
        <p>Deze voorwaarden zijn van toepassing op elk gebruik van de diensten van MindNavigator. Door gebruik te maken van de Dienst, aanvaardt u deze voorwaarden.</p>

        <h4>2. Gebruik van de Dienst</h4>
        <p>U stemt ermee in de Dienst alleen te gebruiken voor wettige doeleinden. U bent verantwoordelijk voor het geheimhouden van uw accountgegevens.</p>

        <h4>3. Intellectueel Eigendom</h4>
        <p>Alle inhoud op de Dienst is eigendom van MindNavigator en wordt beschermd door auteursrecht.</p>
        
        <h4>4. Zelfreflectie-instrumenten en Inzichten</h4>
        <p>De tools en inzichten zijn bedoeld voor informatieve en educatieve doeleinden en zijn geen vervanging voor professioneel medisch advies. Raadpleeg een gekwalificeerde zorgverlener voor diagnoses.</p>

        <h4>5. GenAI Features</h4>
        <p>Delen van de Dienst maken gebruik van generatieve AI. De output kan onnauwkeurigheden bevatten en dient als startpunt voor reflectie.</p>

        <h4>6. Abonnementen en Betalingen</h4>
        <p>Voor premium features is een abonnement nodig. Voor gebruikers onder 18 is toestemming van een ouder/voogd vereist voor betalingen.</p>

        <h4>7. Beperking van Aansprakelijkheid</h4>
        <p>MindNavigator is niet aansprakelijk voor enige schade die voortvloeit uit het gebruik van de Dienst. Het gebruik is op eigen risico.</p>
    </div>
);

export const DisclaimerContent = () => (
    <div className="space-y-4">
        <h4>Geen Medische Diagnose of Advies</h4>
        <p>MindNavigator en de daarin aangeboden zelfreflectie-instrumenten zijn uitsluitend bedoeld voor educatieve doeleinden. Ze zijn <strong>nadrukkelijk geen vervanging</strong> voor professioneel medisch, psychologisch, of orthopedagogisch advies, diagnose, of behandeling.</p>

        <h4>Raadpleeg Altijd een Professional</h4>
        <p>Als u of uw kind vragen of zorgen heeft, dient u altijd contact op te nemen met een gekwalificeerde zorgverlener (huisarts, psycholoog, etc.).</p>

        <h4>Beperking van Aansprakelijkheid</h4>
        <p>Het gebruik van de informatie en tools op dit platform is geheel op eigen risico.</p>

        <h4>Gebruik van AI-gegenereerde Content</h4>
        <p>AI-gegenereerde content kan onnauwkeurigheden bevatten. Gebruik deze inzichten als een startpunt voor reflectie.</p>
    </div>
);
