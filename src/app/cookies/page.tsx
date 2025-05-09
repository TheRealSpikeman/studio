import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function CookiesPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 py-12 md:py-16 lg:py-20">
        <div className="container">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-3xl font-bold">Cookiebeleid</CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none dark:prose-invert">
              <p>Laatst bijgewerkt: {new Date().toLocaleDateString('nl-NL')}</p>

              <h2>1. Wat zijn cookies?</h2>
              <p>Cookies zijn kleine tekstbestanden die door een website op uw computer of mobiele apparaat worden geplaatst wanneer u de website bezoekt. Cookies worden veel gebruikt om websites efficiënter te laten werken en om informatie te verstrekken aan de eigenaren van de site.</p>

              <h2>2. Hoe gebruiken wij cookies?</h2>
              <p>NeuroDiversity Navigator gebruikt cookies voor de volgende doeleinden:</p>
              <ul>
                <li><strong>Functionele cookies:</strong> Deze cookies zijn essentieel om u in staat te stellen door de website te navigeren en de functies ervan te gebruiken, zoals toegang tot beveiligde gedeelten van de website (bijvoorbeeld uw dashboard na inloggen). Zonder deze cookies kunnen de diensten waar u om heeft gevraagd niet worden geleverd.</li>
                <li><strong>Analytische cookies:</strong> Wij gebruiken analytische cookies om informatie te verzamelen over hoe bezoekers onze website gebruiken. Dit helpt ons de prestaties van onze website te verbeteren. Deze cookies verzamelen informatie in een geaggregeerde vorm. (Momenteel gebruiken we geen expliciete analytische cookies van derden, maar dit kan in de toekomst veranderen).</li>
                <li><strong>Voorkeurscookies:</strong> Deze cookies onthouden keuzes die u maakt (zoals uw taalvoorkeur) om uw ervaring te personaliseren. (Momenteel gebruiken we geen expliciete voorkeurscookies, maar dit kan in de toekomst veranderen).</li>
              </ul>

              <h2>3. Uw keuzes met betrekking tot cookies</h2>
              <p>De meeste webbrowsers accepteren cookies automatisch, maar u kunt de instellingen van uw browser meestal wijzigen om cookies te weigeren als u dat liever doet. Als u ervoor kiest om cookies uit te schakelen, is het mogelijk dat u niet volledig kunt profiteren van de interactieve functies van onze website.</p>
              <p>U kunt meer informatie vinden over het beheren van cookies in de helpsectie van uw browser of op websites zoals <a href="https://www.allaboutcookies.org" target="_blank" rel="noopener noreferrer">www.allaboutcookies.org</a>.</p>
              
              <h2>4. Cookies van derden</h2>
              <p>Momenteel plaatsen wij geen cookies van derden voor tracking of advertentiedoeleinden. Als dit in de toekomst verandert, zullen wij dit beleid bijwerken.</p>

              <h2>5. Wijzigingen in dit cookiebeleid</h2>
              <p>Wij kunnen dit cookiebeleid van tijd tot tijd wijzigen. De meest recente versie is altijd beschikbaar op onze website.</p>

              <h2>6. Contact</h2>
              <p>Als u vragen heeft over ons gebruik van cookies, kunt u contact met ons opnemen via [contact@emailadres.placeholder].</p>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
