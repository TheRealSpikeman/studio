
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function PrivacyPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex flex-1 flex-col items-center justify-center py-12 md:py-16 lg:py-20">
        <div className="container">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-3xl font-bold">Privacybeleid</CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none dark:prose-invert">
              <p>Laatst bijgewerkt: {new Date().toLocaleDateString('nl-NL')}</p>
              
              <h2>1. Inleiding</h2>
              <p>Welkom bij NeuroDiversity Navigator. Wij hechten veel waarde aan uw privacy en de bescherming van uw persoonsgegevens. In dit privacybeleid leggen wij uit hoe wij uw gegevens verzamelen, gebruiken, delen en beschermen.</p>

              <h2>2. Welke gegevens verzamelen wij?</h2>
              <p>Wij kunnen de volgende soorten persoonsgegevens verzamelen:</p>
              <ul>
                <li><strong>Contactgegevens:</strong> zoals uw naam en e-mailadres wanneer u zich aanmeldt.</li>
                <li><strong>Quizresultaten:</strong> de antwoorden die u geeft op onze quizzen en de daaruit voortvloeiende profielen.</li>
                <li><strong>Gebruiksgegevens:</strong> informatie over hoe u onze website en diensten gebruikt, zoals IP-adres, browsertype, bezochte pagina's en de duur van uw bezoek.</li>
              </ul>

              <h2>3. Hoe gebruiken wij uw gegevens?</h2>
              <p>Uw gegevens worden gebruikt voor de volgende doeleinden:</p>
              <ul>
                <li>Om u toegang te geven tot onze diensten en de quizzen.</li>
                <li>Om gepersonaliseerde resultaten en coaching-inzichten te genereren.</li>
                <li>Om onze website en diensten te verbeteren.</li>
                <li>Om met u te communiceren, bijvoorbeeld over updates of ondersteuning.</li>
                <li>Om te voldoen aan wettelijke verplichtingen.</li>
              </ul>

              <h2>4. Delen van uw gegevens</h2>
              <p>Wij delen uw persoonsgegevens niet met derden, tenzij:</p>
              <ul>
                <li>Dit noodzakelijk is voor het uitvoeren van onze diensten (bijvoorbeeld met onze hostingprovider).</li>
                <li>Wij hiertoe wettelijk verplicht zijn.</li>
                <li>U hiervoor expliciet toestemming heeft gegeven.</li>
              </ul>
               <p>De resultaten van de GenAI features (zoals quizsamenvattingen en coaching inzichten) worden gegenereerd door AI-modellen. De input voor deze modellen (uw quizantwoorden en profielinformatie) wordt verwerkt om deze inzichten te creëren. Wij zorgen ervoor dat deze verwerking plaatsvindt met respect voor uw privacy.</p>

              <h2>5. Beveiliging van uw gegevens</h2>
              <p>Wij nemen passende technische en organisatorische maatregelen om uw persoonsgegevens te beschermen tegen verlies, misbruik en ongeautoriseerde toegang.</p>

              <h2>6. Uw rechten</h2>
              <p>U heeft het recht om uw persoonsgegevens in te zien, te corrigeren of te verwijderen. U kunt ook bezwaar maken tegen de verwerking van uw gegevens of vragen om beperking van de verwerking. Neem hiervoor contact met ons op via de contactgegevens onderaan deze pagina.</p>

              <h2>7. Wijzigingen in dit privacybeleid</h2>
              <p>Wij kunnen dit privacybeleid van tijd tot tijd wijzigen. De meest recente versie is altijd beschikbaar op onze website.</p>

              <h2>8. Contact</h2>
              <p>Als u vragen heeft over dit privacybeleid, kunt u contact met ons opnemen via [contact@emailadres.placeholder].</p>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}

