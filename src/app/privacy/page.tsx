
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import Link from 'next/link';
import { ExternalLink, ShieldCheck, Info, Database, Cog, Share2, Lock, Gavel, Archive, Cookie, FileClock, Mail } from 'lucide-react';


export default function PrivacyPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-gradient-to-b from-background via-secondary/10 to-background py-12 md:py-20 lg:py-28">
        <div className="container mx-auto max-w-3xl">
          <div className="text-center mb-12 md:mb-16">
            <ShieldCheck className="mx-auto h-16 w-16 text-primary mb-4" />
            <h1 className="text-4xl font-bold text-foreground">Privacybeleid</h1>
            <p className="text-lg text-muted-foreground mt-2">Laatst bijgewerkt: {new Date().toLocaleDateString('nl-NL')}</p>
          </div>
          
          <div className="space-y-10 text-base leading-relaxed text-foreground/90">
            <section id="inleiding" className="space-y-3">
              <h2 className="text-2xl font-semibold text-primary mb-4 flex items-center gap-3">
                <Info className="h-7 w-7" />
                1. Inleiding
              </h2>
              <p className="text-muted-foreground leading-relaxed">Welkom bij MindNavigator. Wij hechten veel waarde aan uw privacy en de bescherming van uw persoonsgegevens. In dit privacybeleid leggen wij uit hoe wij uw gegevens verzamelen, gebruiken, delen en beschermen. Door gebruik te maken van onze diensten, gaat u akkoord met de voorwaarden van dit beleid.</p>
            </section>

            <hr className="my-6 border-border" />

            <section id="welke-gegevens" className="space-y-3">
              <h2 className="text-2xl font-semibold text-primary mb-4 flex items-center gap-3">
                <Database className="h-7 w-7" />
                2. Welke gegevens verzamelen wij?
              </h2>
              <p className="text-muted-foreground leading-relaxed">Wij kunnen de volgende soorten persoonsgegevens verzamelen:</p>
              <ul className="list-disc list-inside pl-5 space-y-2 text-muted-foreground leading-relaxed">
                <li><strong>Contactgegevens:</strong> zoals uw naam en e-mailadres wanneer u zich aanmeldt.</li>
                <li><strong>Accountgegevens:</strong> gebruikersnaam, wachtwoord (versleuteld), en andere informatie die u verstrekt bij het aanmaken van een account.</li>
                <li><strong>Antwoorden op zelfreflectie tools:</strong> de antwoorden die u geeft op onze tools en de daaruit voortvloeiende overzichten en inzichten.</li>
                <li><strong>Gebruiksgegevens:</strong> informatie over hoe u onze website en diensten gebruikt, zoals IP-adres, browsertype, bezochte pagina's, de duur van uw bezoek en interacties met features.</li>
                <li><strong>Communicatie:</strong> inhoud van berichten die u met ons of via ons platform uitwisselt (bijvoorbeeld met coaches of tutors, indien van toepassing).</li>
                <li><strong>Betalingsgegevens (Ouders):</strong> indien u een betaald abonnement afsluit, worden uw betalingsgegevens verwerkt door een beveiligde derde partij (payment provider). MindNavigator slaat zelf geen volledige creditcardnummers op.</li>
              </ul>
            </section>

            <hr className="my-6 border-border" />

            <section id="hoe-gebruiken-wij" className="space-y-3">
              <h2 className="text-2xl font-semibold text-primary mb-4 flex items-center gap-3">
                <Cog className="h-7 w-7" />
                3. Hoe gebruiken wij uw gegevens?
              </h2>
              <p className="text-muted-foreground leading-relaxed">Uw gegevens worden gebruikt voor de volgende doeleinden:</p>
              <ul className="list-disc list-inside pl-5 space-y-2 text-muted-foreground leading-relaxed">
                <li>Om u toegang te geven tot onze diensten en de zelfreflectie-instrumenten.</li>
                <li>Om gepersonaliseerde overzichten en coaching-inzichten te genereren.</li>
                <li>Om de functionaliteit en gebruikerservaring van onze website en diensten te verbeteren.</li>
                <li>Om met u te communiceren, bijvoorbeeld over updates, ondersteuning of accountgerelateerde zaken.</li>
                <li>Om betalingen voor abonnementen te verwerken (indien van toepassing).</li>
                <li>Om te voldoen aan wettelijke verplichtingen.</li>
              </ul>
            </section>

            <hr className="my-6 border-border" />

            <section id="delen-van-gegevens" className="space-y-3">
              <h2 className="text-2xl font-semibold text-primary mb-4 flex items-center gap-3">
                <Share2 className="h-7 w-7" />
                4. Delen van uw gegevens
              </h2>
              <p className="text-muted-foreground leading-relaxed">Wij delen uw persoonsgegevens niet met derden, tenzij:</p>
              <ul className="list-disc list-inside pl-5 space-y-2 text-muted-foreground leading-relaxed">
                <li>Dit noodzakelijk is voor het uitvoeren van onze diensten (bijvoorbeeld met onze hostingprovider of payment provider). Deze partijen zijn contractueel verplicht uw gegevens te beschermen.</li>
                <li>Wij hiertoe wettelijk verplicht zijn (bijvoorbeeld op last van een gerechtelijk bevel).</li>
                <li>U hiervoor expliciet toestemming heeft gegeven (bijvoorbeeld voor het delen van inzichten met een gekoppelde coach of tutor, na uw instemming).</li>
              </ul>
             <p className="text-muted-foreground leading-relaxed">De inzichten die door GenAI features (zoals samenvattingen en coaching tips) worden gegenereerd, zijn gebaseerd op de input die u verstrekt (uw antwoorden en profielinformatie). Deze input wordt verwerkt door AI-modellen om de output te creëren. Wij streven ernaar dit proces zo privacyvriendelijk mogelijk in te richten, in lijn met de voorwaarden van onze AI-dienstverleners. Wij verkopen uw persoonlijke input niet.</p>
            </section>

            <hr className="my-6 border-border" />

            <section id="beveiliging-gegevens" className="space-y-3">
              <h2 className="text-2xl font-semibold text-primary mb-4 flex items-center gap-3">
                <Lock className="h-7 w-7" />
                5. Beveiliging van uw gegevens
              </h2>
              <p className="text-muted-foreground leading-relaxed">Wij nemen passende technische en organisatorische maatregelen om uw persoonsgegevens te beschermen tegen verlies, misbruik, ongeautoriseerde toegang, openbaarmaking, wijziging en vernietiging. Dit omvat versleuteling van gegevens waar passend, toegangscontroles en regelmatige veiligheidsaudits.</p>
            </section>

            <hr className="my-6 border-border" />

            <section id="uw-rechten" className="space-y-3">
              <h2 className="text-2xl font-semibold text-primary mb-4 flex items-center gap-3">
                <Gavel className="h-7 w-7" />
                6. Uw rechten (AVG/GDPR)
              </h2>
              <p className="text-muted-foreground leading-relaxed">U heeft onder de Algemene Verordening Gegevensbescherming (AVG) diverse rechten met betrekking tot uw persoonsgegevens:</p>
               <ul className="list-disc list-inside pl-5 space-y-2 text-muted-foreground leading-relaxed">
                <li><strong>Recht op inzage:</strong> U kunt opvragen welke persoonsgegevens wij van u verwerken.</li>
                <li><strong>Recht op rectificatie:</strong> Als uw gegevens onjuist of onvolledig zijn, kunt u verzoeken deze aan te passen.</li>
                <li><strong>Recht op verwijdering ('recht om vergeten te worden'):</strong> Onder bepaalde voorwaarden kunt u verzoeken uw gegevens te laten verwijderen.</li>
                <li><strong>Recht op beperking van de verwerking:</strong> U kunt verzoeken de verwerking van uw gegevens tijdelijk te stoppen.</li>
                <li><strong>Recht op overdraagbaarheid van gegevens:</strong> U kunt uw gegevens in een gestructureerd, gangbaar en machineleesbaar formaat ontvangen en overdragen aan een andere partij.</li>
                <li><strong>Recht van bezwaar:</strong> U kunt bezwaar maken tegen de verwerking van uw gegevens voor direct marketing of op basis van onze gerechtvaardigde belangen.</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed">
                  Neem contact met ons op via de contactgegevens onderaan deze pagina om gebruik te maken van uw rechten. Wij streven ernaar binnen 30 dagen op uw verzoek te reageren.
              </p>
            </section>

            <hr className="my-6 border-border" />

            <section id="bewaartermijnen" className="space-y-3">
              <h2 className="text-2xl font-semibold text-primary mb-4 flex items-center gap-3">
                <Archive className="h-7 w-7" />
                7. Bewaartermijnen
              </h2>
              <p className="text-muted-foreground leading-relaxed">Wij bewaren uw persoonsgegevens niet langer dan noodzakelijk is voor de doeleinden waarvoor ze zijn verzameld, tenzij een langere bewaartermijn wettelijk vereist of toegestaan is. Inactieve accounts en bijbehorende gegevens kunnen na een bepaalde periode worden verwijderd conform ons intern databeleid.</p>
            </section>
            
            <hr className="my-6 border-border" />

            <section id="cookies" className="space-y-3">
              <h2 className="text-2xl font-semibold text-primary mb-4 flex items-center gap-3">
                <Cookie className="h-7 w-7" />
                8. Cookies
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                  Wij gebruiken cookies om de functionaliteit van onze website te verbeteren. Voor meer informatie over welke cookies we gebruiken en hoe u uw voorkeuren kunt beheren, verwijzen wij u naar ons <Link href="/cookies" className="text-primary hover:underline font-medium">Cookiebeleid <ExternalLink className="inline-block h-4 w-4 align-text-bottom"/></Link>.
              </p>
            </section>

            <hr className="my-6 border-border" />

            <section id="wijzigingen-privacybeleid" className="space-y-3">
              <h2 className="text-2xl font-semibold text-primary mb-4 flex items-center gap-3">
                <FileClock className="h-7 w-7" />
                9. Wijzigingen in dit privacybeleid
              </h2>
              <p className="text-muted-foreground leading-relaxed">Wij kunnen dit privacybeleid van tijd tot tijd wijzigen om te voldoen aan nieuwe wetgeving of veranderingen in onze bedrijfsvoering. De meest recente versie is altijd beschikbaar op onze website. Wij raden u aan dit beleid regelmatig te controleren.</p>
            </section>

            <hr className="my-6 border-border" />

            <section id="contact-privacy" className="space-y-3">
              <h2 className="text-2xl font-semibold text-primary mb-4 flex items-center gap-3">
                <Mail className="h-7 w-7" />
                10. Contact
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Als u vragen heeft over ons gebruik van persoonsgegevens, of als u gebruik wilt maken van uw rechten, kunt u contact met ons opnemen via{' '}
                <a href="mailto:privacy@mindnavigator.app" className="text-accent hover:underline">privacy@mindnavigator.app</a>.
              </p>
               <p className="text-muted-foreground leading-relaxed">
                U heeft ook het recht om een klacht in te dienen bij de Autoriteit Persoonsgegevens als u van mening bent dat onze verwerking van uw persoonsgegevens in strijd is met de privacywetgeving.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
