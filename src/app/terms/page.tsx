import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function TermsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 py-12 md:py-16 lg:py-20">
        <div className="container">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-3xl font-bold">Algemene Voorwaarden</CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none dark:prose-invert">
              <p>Laatst bijgewerkt: {new Date().toLocaleDateString('nl-NL')}</p>

              <h2>1. Toepasselijkheid</h2>
              <p>Deze algemene voorwaarden zijn van toepassing op elk gebruik van de website en diensten van NeuroDiversity Navigator (hierna "de Dienst"). Door gebruik te maken van de Dienst, aanvaardt u deze voorwaarden.</p>

              <h2>2. Gebruik van de Dienst</h2>
              <p>U stemt ermee in de Dienst alleen te gebruiken voor wettige doeleinden en op een manier die geen inbreuk maakt op de rechten van, of het gebruik en genot van de Dienst door anderen beperkt of verhindert.</p>
              <p>U bent verantwoordelijk voor het geheimhouden van uw accountgegevens, inclusief uw wachtwoord.</p>
              
              <h2>3. Intellectueel Eigendom</h2>
              <p>Alle inhoud op de Dienst, inclusief teksten, afbeeldingen, logo's, quizzen en software, is eigendom van NeuroDiversity Navigator of haar licentiegevers en wordt beschermd door auteursrecht en andere intellectuele eigendomsrechten. U mag de inhoud niet kopiëren, reproduceren, distribueren of wijzigen zonder onze uitdrukkelijke schriftelijke toestemming.</p>

              <h2>4. Quizzen en Resultaten</h2>
              <p>De quizzen en de daaruit voortvloeiende resultaten en coaching-inzichten zijn bedoeld voor informatieve en educatieve doeleinden. Ze zijn geen vervanging voor professioneel medisch of psychologisch advies, diagnose of behandeling. Raadpleeg altijd een gekwalificeerde zorgverlener als u vragen heeft over een medische of psychische aandoening.</p>
              <p>Wij garanderen niet de nauwkeurigheid of volledigheid van de resultaten, hoewel we ernaar streven zo accuraat mogelijke informatie te verstrekken.</p>
              
              <h2>5. GenAI Features</h2>
              <p>Delen van de Dienst maken gebruik van generatieve AI om samenvattingen en coaching-inzichten te produceren. Hoewel we streven naar nuttige en relevante output, kunnen AI-gegenereerde teksten onnauwkeurigheden bevatten of niet altijd volledig aansluiten bij uw specifieke situatie. Gebruik deze inzichten als een startpunt voor reflectie en niet als definitieve waarheden.</p>

              <h2>6. Beperking van Aansprakelijkheid</h2>
              <p>NeuroDiversity Navigator is niet aansprakelijk voor enige directe, indirecte, incidentele, gevolg- of speciale schade die voortvloeit uit of verband houdt met uw gebruik van de Dienst of de onmogelijkheid om de Dienst te gebruiken, zelfs als wij op de hoogte zijn gesteld van de mogelijkheid van dergelijke schade.</p>

              <h2>7. Wijzigingen in de Voorwaarden</h2>
              <p>Wij behouden ons het recht voor om deze algemene voorwaarden op elk moment te wijzigen. Wijzigingen worden van kracht zodra ze op de website zijn gepubliceerd. Het is uw verantwoordelijkheid om de voorwaarden regelmatig te controleren.</p>
              
              <h2>8. Toepasselijk recht</h2>
              <p>Op deze algemene voorwaarden is Nederlands recht van toepassing.</p>

              <h2>9. Contact</h2>
              <p>Als u vragen heeft over deze algemene voorwaarden, kunt u contact met ons opnemen via [contact@emailadres.placeholder].</p>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
