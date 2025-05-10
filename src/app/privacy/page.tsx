
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function PrivacyPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex flex-1 flex-col items-center justify-center py-12 md:py-16 lg:py-20">
        <div className="container">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-3xl font-bold">Privacybeleid</CardTitle>
              <CardDescription className="text-sm text-muted-foreground pt-1">Laatst bijgewerkt: {new Date().toLocaleDateString('nl-NL')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6"> {/* Removed prose for more control, added space-y-6 */}
              
              <section id="inleiding" className="space-y-3">
                <h2 className="text-2xl font-semibold text-foreground">1. Inleiding</h2>
                <p className="text-muted-foreground leading-relaxed">Welkom bij MindNavigator. Wij hechten veel waarde aan uw privacy en de bescherming van uw persoonsgegevens. In dit privacybeleid leggen wij uit hoe wij uw gegevens verzamelen, gebruiken, delen en beschermen.</p>
              </section>

              <hr className="my-6 border-border" />

              <section id="welke-gegevens" className="space-y-3">
                <h2 className="text-2xl font-semibold text-foreground">2. Welke gegevens verzamelen wij?</h2>
                <p className="text-muted-foreground leading-relaxed">Wij kunnen de volgende soorten persoonsgegevens verzamelen:</p>
                <ul className="list-disc list-inside pl-5 space-y-2 text-muted-foreground leading-relaxed">
                  <li><strong>Contactgegevens:</strong> zoals uw naam en e-mailadres wanneer u zich aanmeldt.</li>
                  <li><strong>Quizresultaten:</strong> de antwoorden die u geeft op onze quizzen en de daaruit voortvloeiende profielen.</li>
                  <li><strong>Gebruiksgegevens:</strong> informatie over hoe u onze website en diensten gebruikt, zoals IP-adres, browsertype, bezochte pagina's en de duur van uw bezoek.</li>
                </ul>
              </section>

              <hr className="my-6 border-border" />

              <section id="hoe-gebruiken-wij" className="space-y-3">
                <h2 className="text-2xl font-semibold text-foreground">3. Hoe gebruiken wij uw gegevens?</h2>
                <p className="text-muted-foreground leading-relaxed">Uw gegevens worden gebruikt voor de volgende doeleinden:</p>
                <ul className="list-disc list-inside pl-5 space-y-2 text-muted-foreground leading-relaxed">
                  <li>Om u toegang te geven tot onze diensten en de quizzen.</li>
                  <li>Om gepersonaliseerde resultaten en coaching-inzichten te genereren.</li>
                  <li>Om onze website en diensten te verbeteren.</li>
                  <li>Om met u te communiceren, bijvoorbeeld over updates of ondersteuning.</li>
                  <li>Om te voldoen aan wettelijke verplichtingen.</li>
                </ul>
              </section>

              <hr className="my-6 border-border" />

              <section id="delen-van-gegevens" className="space-y-3">
                <h2 className="text-2xl font-semibold text-foreground">4. Delen van uw gegevens</h2>
                <p className="text-muted-foreground leading-relaxed">Wij delen uw persoonsgegevens niet met derden, tenzij:</p>
                <ul className="list-disc list-inside pl-5 space-y-2 text-muted-foreground leading-relaxed">
                  <li>Dit noodzakelijk is voor het uitvoeren van onze diensten (bijvoorbeeld met onze hostingprovider).</li>
                  <li>Wij hiertoe wettelijk verplicht zijn.</li>
                  <li>U hiervoor expliciet toestemming heeft gegeven.</li>
                </ul>
               <p className="text-muted-foreground leading-relaxed">De resultaten van de GenAI features (zoals quizsamenvattingen en coaching inzichten) worden gegenereerd door AI-modellen. De input voor deze modellen (uw quizantwoorden en profielinformatie) wordt verwerkt om deze inzichten te creëren. Wij zorgen ervoor dat deze verwerking plaatsvindt met respect voor uw privacy.</p>
              </section>

              <hr className="my-6 border-border" />

              <section id="beveiliging-gegevens" className="space-y-3">
                <h2 className="text-2xl font-semibold text-foreground">5. Beveiliging van uw gegevens</h2>
                <p className="text-muted-foreground leading-relaxed">Wij nemen passende technische en organisatorische maatregelen om uw persoonsgegevens te beschermen tegen verlies, misbruik en ongeautoriseerde toegang.</p>
              </section>

              <hr className="my-6 border-border" />

              <section id="uw-rechten" className="space-y-3">
                <h2 className="text-2xl font-semibold text-foreground">6. Uw rechten</h2>
                <p className="text-muted-foreground leading-relaxed">U heeft het recht om uw persoonsgegevens in te zien, te corrigeren of te verwijderen. U kunt ook bezwaar maken tegen de verwerking van uw gegevens of vragen om beperking van de verwerking. Neem hiervoor contact met ons op via de contactgegevens onderaan deze pagina.</p>
              </section>

              <hr className="my-6 border-border" />

              <section id="wijzigingen-privacybeleid" className="space-y-3">
                <h2 className="text-2xl font-semibold text-foreground">7. Wijzigingen in dit privacybeleid</h2>
                <p className="text-muted-foreground leading-relaxed">Wij kunnen dit privacybeleid van tijd tot tijd wijzigen. De meest recente versie is altijd beschikbaar op onze website.</p>
              </section>

              <hr className="my-6 border-border" />

              <section id="contact-privacy" className="space-y-3">
                <h2 className="text-2xl font-semibold text-foreground">8. Contact</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Als u vragen heeft over ons gebruik van persoonsgegevens, kunt u contact met ons opnemen via{' '}
                  <a href="mailto:privacy@mindnavigator.app" className="text-primary hover:underline">privacy@mindnavigator.app</a>.
                </p>
              </section>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
