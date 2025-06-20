
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button'; 
import { ExternalLink, FileText, Cookie, Settings, Users, FileClock, Mail, SlidersHorizontal, Info } from 'lucide-react'; 

export default function CookiesPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-gradient-to-b from-background via-secondary/10 to-background py-12 md:py-20 lg:py-28">
        <div className="container mx-auto max-w-3xl">
          <div className="text-center mb-12 md:mb-16">
            <Cookie className="mx-auto h-16 w-16 text-primary mb-4" />
            <h1 className="text-4xl font-bold text-foreground">Cookiebeleid</h1>
            <p className="text-lg text-muted-foreground mt-2">Laatst bijgewerkt: {new Date().toLocaleDateString('nl-NL')}</p>
          </div>

          <div className="space-y-10 text-base leading-relaxed text-foreground/90">
            <div className="mb-8 p-4 border rounded-md bg-muted/10">
              <h3 className="text-xl font-semibold mb-3 text-primary flex items-center gap-3">
                <Info className="h-6 w-6" />
                Inhoudsopgave
              </h3>
              <ul className="list-none pl-0 space-y-1.5">
                <li><a href="#wat-zijn-cookies" className="font-medium text-foreground hover:underline hover:text-primary transition-colors">1. Wat zijn cookies?</a></li>
                <li><a href="#hoe-gebruiken-wij-cookies" className="font-medium text-foreground hover:underline hover:text-primary transition-colors">2. Hoe gebruiken wij cookies?</a></li>
                <li><a href="#uw-keuzes" className="font-medium text-foreground hover:underline hover:text-primary transition-colors">3. Uw keuzes met betrekking tot cookies</a></li>
                <li><a href="#cookies-van-derden" className="font-medium text-foreground hover:underline hover:text-primary transition-colors">4. Cookies van derden</a></li>
                <li><a href="#wijzigingen-cookiebeleid" className="font-medium text-foreground hover:underline hover:text-primary transition-colors">5. Wijzigingen in dit cookiebeleid</a></li>
                <li><a href="#contact-cookies" className="font-medium text-foreground hover:underline hover:text-primary transition-colors">6. Contact</a></li>
              </ul>
            </div>

            <hr className="my-8 border-border" />

            <section id="wat-zijn-cookies" className="space-y-4">
              <h2 className="flex items-center gap-3 text-2xl font-semibold text-primary mb-4">
                <Cookie className="h-7 w-7" /> 
                1. Wat zijn cookies?
              </h2>
              <p className="text-muted-foreground leading-relaxed">Cookies zijn kleine tekstbestanden die door een website op uw computer of mobiele apparaat worden geplaatst wanneer u de website bezoekt. Cookies worden veel gebruikt om websites efficiënter te laten werken en om informatie te verstrekken aan de eigenaren van de site.</p>
            </section>

            <hr className="my-8 border-border" />

            <section id="hoe-gebruiken-wij-cookies" className="space-y-4">
              <h2 className="flex items-center gap-3 text-2xl font-semibold text-primary mb-4">
                <Settings className="h-7 w-7" />
                2. Hoe gebruiken wij cookies?
              </h2>
              <p className="text-muted-foreground leading-relaxed">MindNavigator gebruikt cookies voor de volgende doeleinden:</p>
              <ul className="list-disc list-inside pl-5 space-y-2 text-muted-foreground leading-relaxed">
                <li>
                  <strong className="text-foreground">Functionele cookies:</strong> Deze cookies zijn essentieel om u in staat te stellen door de website te navigeren en de functies ervan te gebruiken, zoals toegang tot beveiligde gedeelten van de website (bijvoorbeeld uw dashboard na inloggen). Zonder deze cookies kunnen de diensten waar u om heeft gevraagd niet worden geleverd.
                </li>
                <li>
                  <strong className="text-foreground">Analytische cookies:</strong> Wij gebruiken analytische cookies om informatie te verzamelen over hoe bezoekers onze website gebruiken. Dit helpt ons de prestaties van onze website te verbeteren. Deze cookies verzamelen informatie in een geaggregeerde vorm. (Momenteel gebruiken we geen expliciete analytische cookies van derden, maar dit kan in de toekomst veranderen).
                </li>
                <li>
                  <strong className="text-foreground">Voorkeurscookies:</strong> Deze cookies onthouden keuzes die u maakt (zoals uw taalvoorkeur) om uw ervaring te personaliseren. (Momenteel gebruiken we geen expliciete voorkeurscookies, maar dit kan in de toekomst veranderen).
                </li>
              </ul>
            </section>

            <hr className="my-8 border-border" />

            <section id="uw-keuzes" className="space-y-4">
              <h2 className="flex items-center gap-3 text-2xl font-semibold text-primary mb-4">
                <SlidersHorizontal className="h-7 w-7" />
                3. Uw keuzes met betrekking tot cookies
              </h2>
              <p className="text-muted-foreground leading-relaxed">De meeste webbrowsers accepteren cookies automatisch, maar u kunt de instellingen van uw browser meestal wijzigen om cookies te weigeren als u dat liever doet. Als u ervoor kiest om cookies uit te schakelen, is het mogelijk dat u niet volledig kunt profiteren van de interactieve functies van onze website.</p>
              <p className="text-muted-foreground leading-relaxed">
                U kunt meer informatie vinden over het beheren van cookies in de helpsectie van uw browser of op websites zoals{' '}
                <a href="https://www.allaboutcookies.org" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline inline-flex items-center">
                  www.allaboutcookies.org <ExternalLink className="ml-1 h-4 w-4" />
                </a>.
              </p>
            </section>
            
            <hr className="my-8 border-border" />

            <section id="cookies-van-derden" className="space-y-4">
              <h2 className="flex items-center gap-3 text-2xl font-semibold text-primary mb-4">
                <Users className="h-7 w-7" />
                4. Cookies van derden
              </h2>
              <p className="text-muted-foreground leading-relaxed">Momenteel plaatsen wij geen cookies van derden voor tracking of advertentiedoeleinden. Als dit in de toekomst verandert, zullen wij dit beleid bijwerken.</p>
            </section>

            <hr className="my-8 border-border" />

            <section id="wijzigingen-cookiebeleid" className="space-y-4">
              <h2 className="flex items-center gap-3 text-2xl font-semibold text-primary mb-4">
                <FileClock className="h-7 w-7" />
                5. Wijzigingen in dit cookiebeleid
              </h2>
              <p className="text-muted-foreground leading-relaxed">Wij kunnen dit cookiebeleid van tijd tot tijd wijzigen. De meest recent bijgewerkte versie is altijd beschikbaar op onze website.</p>
            </section>

            <hr className="my-8 border-border" />

            <section id="contact-cookies" className="space-y-4">
              <h2 className="flex items-center gap-3 text-2xl font-semibold text-primary mb-4">
                <Mail className="h-7 w-7" />
                6. Contact
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Als u vragen heeft over ons gebruik van cookies, kunt u contact met ons opnemen via{' '}
                <a href="mailto:contact@mindnavigator.app" className="text-accent hover:underline">contact@mindnavigator.app</a>.
              </p>
            </section>

            <div className="mt-10 p-6 border rounded-lg bg-primary/10">
                <h3 className="text-lg font-semibold text-primary mb-2 flex items-center gap-3">
                    <Settings className="h-6 w-6" />
                    Cookievoorkeuren Beheren
                </h3>
                <p className="text-sm text-foreground/80 leading-relaxed">
                    Hier zou u normaal gesproken uw cookievoorkeuren kunnen aanpassen. Momenteel kunt u cookies beheren via de instellingen van uw webbrowser. Een specifieke tool voor cookiebeheer op onze site is in ontwikkeling.
                </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
