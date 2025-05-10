
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function TermsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex flex-1 flex-col items-center justify-center py-12 md:py-16 lg:py-20">
        <div className="container">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-3xl font-bold">Algemene Voorwaarden</CardTitle>
              <CardDescription className="text-sm text-muted-foreground pt-1">Laatst bijgewerkt: {new Date().toLocaleDateString('nl-NL')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6"> {/* Removed prose, added space-y-6 */}
              
              <section id="toepasselijkheid" className="space-y-3">
                <h2 className="text-2xl font-semibold text-foreground">1. Toepasselijkheid</h2>
                <p className="text-muted-foreground leading-relaxed">Deze algemene voorwaarden zijn van toepassing op elk gebruik van de website en diensten van MindNavigator (hierna "de Dienst"). Door gebruik te maken van de Dienst, aanvaardt u deze voorwaarden.</p>
              </section>

              <hr className="my-6 border-border" />

              <section id="gebruik-dienst" className="space-y-3">
                <h2 className="text-2xl font-semibold text-foreground">2. Gebruik van de Dienst</h2>
                <p className="text-muted-foreground leading-relaxed">U stemt ermee in de Dienst alleen te gebruiken voor wettige doeleinden en op een manier die geen inbreuk maakt op de rechten van, of het gebruik en genot van de Dienst door anderen beperkt of verhindert.</p>
                <p className="text-muted-foreground leading-relaxed">U bent verantwoordelijk voor het geheimhouden van uw accountgegevens, inclusief uw wachtwoord.</p>
              </section>
              
              <hr className="my-6 border-border" />

              <section id="intellectueel-eigendom" className="space-y-3">
                <h2 className="text-2xl font-semibold text-foreground">3. Intellectueel Eigendom</h2>
                <p className="text-muted-foreground leading-relaxed">Alle inhoud op de Dienst, inclusief teksten, afbeeldingen, logo's, quizzen en software, is eigendom van MindNavigator of haar licentiegevers en wordt beschermd door auteursrecht en andere intellectuele eigendomsrechten. U mag de inhoud niet kopiëren, reproduceren, distribueren of wijzigen zonder onze uitdrukkelijke schriftelijke toestemming.</p>
              </section>

              <hr className="my-6 border-border" />

              <section id="quizzen-resultaten" className="space-y-3">
                <h2 className="text-2xl font-semibold text-foreground">4. Quizzen en Resultaten</h2>
                <p className="text-muted-foreground leading-relaxed">De quizzen en de daaruit voortvloeiende resultaten en coaching-inzichten zijn bedoeld voor informatieve en educatieve doeleinden. Ze zijn geen vervanging voor professioneel medisch of psychologisch advies, diagnose of behandeling. Raadpleeg altijd een gekwalificeerde zorgverlener als u vragen heeft over een medische of psychische aandoening.</p>
                <p className="text-muted-foreground leading-relaxed">Wij garanderen niet de nauwkeurigheid of volledigheid van de resultaten, hoewel we ernaar streven zo accuraat mogelijke informatie te verstrekken.</p>
              </section>
              
              <hr className="my-6 border-border" />

              <section id="genai-features" className="space-y-3">
                <h2 className="text-2xl font-semibold text-foreground">5. GenAI Features</h2>
                <p className="text-muted-foreground leading-relaxed">Delen van de Dienst maken gebruik van generatieve AI om samenvattingen en coaching-inzichten te produceren. Hoewel we streven naar nuttige en relevante output, kunnen AI-gegenereerde teksten onnauwkeurigheden bevatten of niet altijd volledig aansluiten bij uw specifieke situatie. Gebruik deze inzichten als een startpunt voor reflectie en niet als definitieve waarheden.</p>
              </section>

              <hr className="my-6 border-border" />

              <section id="beperking-aansprakelijkheid" className="space-y-3">
                <h2 className="text-2xl font-semibold text-foreground">6. Beperking van Aansprakelijkheid</h2>
                <p className="text-muted-foreground leading-relaxed">MindNavigator is niet aansprakelijk voor enige directe, indirecte, incidentele, gevolg- of speciale schade die voortvloeit uit of verband houdt met uw gebruik van de Dienst of de onmogelijkheid om de Dienst te gebruiken, zelfs als wij op de hoogte zijn gesteld van de mogelijkheid van dergelijke schade.</p>
              </section>

              <hr className="my-6 border-border" />

              <section id="wijzigingen-voorwaarden" className="space-y-3">
                <h2 className="text-2xl font-semibold text-foreground">7. Wijzigingen in de Voorwaarden</h2>
                <p className="text-muted-foreground leading-relaxed">Wij behouden ons het recht voor om deze algemene voorwaarden op elk moment te wijzigen. Wijzigingen worden van kracht zodra ze op de website zijn gepubliceerd. Het is uw verantwoordelijkheid om de voorwaarden regelmatig te controleren.</p>
              </section>
              
              <hr className="my-6 border-border" />

              <section id="toepasselijk-recht" className="space-y-3">
                <h2 className="text-2xl font-semibold text-foreground">8. Toepasselijk recht</h2>
                <p className="text-muted-foreground leading-relaxed">Op deze algemene voorwaarden is Nederlands recht van toepassing.</p>
              </section>

              <hr className="my-6 border-border" />

              <section id="contact-voorwaarden" className="space-y-3">
                <h2 className="text-2xl font-semibold text-foreground">9. Contact</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Als u vragen heeft over deze algemene voorwaarden, kunt u contact met ons opnemen via{' '}
                  <a href="mailto:voorwaarden@mindnavigator.app" className="text-primary hover:underline">voorwaarden@mindnavigator.app</a>.
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
