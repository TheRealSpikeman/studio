
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import Link from 'next/link';
import { ExternalLink, FileText, MousePointerClick, Copyright, Brain, Bot, CreditCard, ShieldAlert, FileClock, Gavel, Mail, Info } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-gradient-to-b from-background via-secondary/10 to-background py-12 md:py-20 lg:py-28">
        <div className="container mx-auto max-w-3xl">
          <div className="text-center mb-12 md:mb-16">
            <FileText className="mx-auto h-16 w-16 text-primary mb-4" />
            <h1 className="text-4xl font-bold text-foreground">Algemene Voorwaarden</h1>
            <p className="text-lg text-muted-foreground mt-2">Laatst bijgewerkt: {new Date().toLocaleDateString('nl-NL')}</p>
          </div>
          
          <div className="space-y-10 text-base leading-relaxed text-foreground/90">
            <section id="toepasselijkheid" className="space-y-3">
              <h2 className="text-2xl font-semibold text-primary mb-4 flex items-center gap-3">
                <Info className="h-7 w-7" />
                1. Toepasselijkheid
              </h2>
              <p className="text-muted-foreground leading-relaxed">Deze algemene voorwaarden zijn van toepassing op elk gebruik van de website en diensten van MindNavigator (hierna "de Dienst"). Door gebruik te maken van de Dienst, aanvaardt u deze voorwaarden.</p>
            </section>

            <hr className="my-6 border-border" />

            <section id="gebruik-dienst" className="space-y-3">
              <h2 className="text-2xl font-semibold text-primary mb-4 flex items-center gap-3">
                <MousePointerClick className="h-7 w-7" />
                2. Gebruik van de Dienst
              </h2>
              <p className="text-muted-foreground leading-relaxed">U stemt ermee in de Dienst alleen te gebruiken voor wettige doeleinden en op een manier die geen inbreuk maakt op de rechten van, of het gebruik en genot van de Dienst door anderen beperkt of verhindert.</p>
              <p className="text-muted-foreground leading-relaxed">U bent verantwoordelijk voor het geheimhouden van uw accountgegevens, inclusief uw wachtwoord. MindNavigator is niet aansprakelijk voor schade voortvloeiend uit ongeautoriseerd gebruik van uw account.</p>
            </section>
            
            <hr className="my-6 border-border" />

            <section id="intellectueel-eigendom" className="space-y-3">
              <h2 className="text-2xl font-semibold text-primary mb-4 flex items-center gap-3">
                <Copyright className="h-7 w-7" />
                3. Intellectueel Eigendom
              </h2>
              <p className="text-muted-foreground leading-relaxed">Alle inhoud op de Dienst, inclusief teksten, afbeeldingen, logo's, zelfreflectie-instrumenten en software, is eigendom van MindNavigator of haar licentiegevers en wordt beschermd door auteursrecht en andere intellectuele eigendomsrechten. U mag de inhoud niet kopiëren, reproduceren, distribueren of wijzigen zonder onze uitdrukkelijke schriftelijke toestemming.</p>
            </section>

            <hr className="my-6 border-border" />

            <section id="zelfreflectie-instrumenten-resultaten" className="space-y-3">
              <h2 className="text-2xl font-semibold text-primary mb-4 flex items-center gap-3">
                <Brain className="h-7 w-7" />
                4. Zelfreflectie-instrumenten en Inzichten
              </h2>
              <p className="text-muted-foreground leading-relaxed">De zelfreflectie-instrumenten (hierna "Tools") en de daaruit voortvloeiende overzichten en coaching-inzichten zijn bedoeld voor informatieve, educatieve en zelfreflectie doeleinden. Ze zijn <strong className="font-medium text-destructive">nadrukkelijk geen vervanging</strong> voor professioneel medisch, psychologisch of orthopedagogisch advies, diagnose of behandeling.</p>
              <p className="text-muted-foreground leading-relaxed">MindNavigator stelt geen diagnoses. Raadpleeg altijd een gekwalificeerde zorgverlener als u vragen heeft over een medische of psychische conditie, of als u overweegt een diagnose te laten stellen. Meer informatie en verwijzingen vindt u op onze <Link href="/neurodiversiteit" className="text-primary hover:underline font-medium">Neurodiversiteit pagina <ExternalLink className="inline-block h-4 w-4 align-text-bottom"/></Link>.</p>
              <p className="text-muted-foreground leading-relaxed">Wij garanderen niet de nauwkeurigheid of volledigheid van de inzichten, hoewel we ernaar streven zo accuraat mogelijke informatie te verstrekken. De interpretatie en toepassing van de inzichten is uw eigen verantwoordelijkheid.</p>
            </section>
            
            <hr className="my-6 border-border" />

            <section id="genai-features" className="space-y-3">
              <h2 className="text-2xl font-semibold text-primary mb-4 flex items-center gap-3">
                <Bot className="h-7 w-7" />
                5. GenAI Features
              </h2>
              <p className="text-muted-foreground leading-relaxed">Delen van de Dienst maken gebruik van generatieve AI om samenvattingen en coaching-inzichten te produceren. Hoewel we streven naar nuttige en relevante output, kunnen AI-gegenereerde teksten onnauwkeurigheden bevatten of niet altijd volledig aansluiten bij uw specifieke situatie. Gebruik deze inzichten als een startpunt voor reflectie en niet als definitieve waarheden of professioneel advies.</p>
            </section>

            <hr className="my-6 border-border" />
            
            <section id="abonnementen-betalingen" className="space-y-3">
              <h2 className="text-2xl font-semibold text-primary mb-4 flex items-center gap-3">
                <CreditCard className="h-7 w-7" />
                6. Abonnementen en Betalingen
              </h2>
              <p className="text-muted-foreground leading-relaxed">Voor bepaalde premium features van de Dienst kan een abonnement vereist zijn. Prijzen en betalingsvoorwaarden worden duidelijk gecommuniceerd op de website. Voor gebruikers jonger dan 18 jaar is toestemming en betalingsafhandeling door een ouder of wettelijke voogd vereist. Abonnementen kunnen maandelijks of jaarlijks worden gefactureerd en zijn opzegbaar conform de specificaties bij het afsluiten van het abonnement.</p>
            </section>

            <hr className="my-6 border-border" />

            <section id="beperking-aansprakelijkheid" className="space-y-3">
              <h2 className="text-2xl font-semibold text-primary mb-4 flex items-center gap-3">
                <ShieldAlert className="h-7 w-7" />
                7. Beperking van Aansprakelijkheid
              </h2>
              <p className="text-muted-foreground leading-relaxed">MindNavigator is niet aansprakelijk voor enige directe, indirecte, incidentele, gevolg- of speciale schade die voortvloeit uit of verband houdt met uw gebruik van de Dienst of de onmogelijkheid om de Dienst te gebruiken, inclusief beslissingen genomen op basis van de verstrekte informatie of inzichten, zelfs als wij op de hoogte zijn gesteld van de mogelijkheid van dergelijke schade. Het gebruik van de Dienst is geheel op eigen risico.</p>
            </section>

            <hr className="my-6 border-border" />

            <section id="wijzigingen-voorwaarden" className="space-y-3">
              <h2 className="text-2xl font-semibold text-primary mb-4 flex items-center gap-3">
                <FileClock className="h-7 w-7" />
                8. Wijzigingen in de Voorwaarden
              </h2>
              <p className="text-muted-foreground leading-relaxed">Wij behouden ons het recht voor om deze algemene voorwaarden op elk moment te wijzigen. Wijzigingen worden van kracht zodra ze op de website zijn gepubliceerd. Het is uw verantwoordelijkheid om de voorwaarden regelmatig te controleren. Voortgezet gebruik van de Dienst na wijzigingen houdt acceptatie van de gewijzigde voorwaarden in.</p>
            </section>
            
            <hr className="my-6 border-border" />

            <section id="toepasselijk-recht" className="space-y-3">
              <h2 className="text-2xl font-semibold text-primary mb-4 flex items-center gap-3">
                <Gavel className="h-7 w-7" />
                9. Toepasselijk recht en Geschillen
              </h2>
              <p className="text-muted-foreground leading-relaxed">Op deze algemene voorwaarden is Nederlands recht van toepassing. Eventuele geschillen zullen worden voorgelegd aan de bevoegde rechter in Nederland.</p>
            </section>

            <hr className="my-6 border-border" />

            <section id="contact-voorwaarden" className="space-y-3">
              <h2 className="text-2xl font-semibold text-primary mb-4 flex items-center gap-3">
                <Mail className="h-7 w-7" />
                10. Contact
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Als u vragen heeft over deze algemene voorwaarden, kunt u contact met ons opnemen via{' '}
                <a href="mailto:voorwaarden@mindnavigator.app" className="text-accent hover:underline">voorwaarden@mindnavigator.app</a>.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
