
// src/app/samenwerkingen/page.tsx
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Link from 'next/link';
import Image from 'next/image';
import { Users, ShieldCheck, Brain, ExternalLink, Linkedin } from 'lucide-react';

interface PartnerProfile {
  id: string;
  name: string;
  title: string;
  imageUrl: string;
  imageHint: string;
  bio: string;
  contribution: string;
  websiteUrl?: string;
  linkedinUrl?: string;
}

// Placeholder data - vervang dit met echte informatie
const partnersData: PartnerProfile[] = [
  {
    id: 'dr_eva_janssen',
    name: 'Dr. Eva Janssen',
    title: 'Kinder- & Jeugdpsycholoog NIP',
    imageUrl: 'https://placehold.co/200x200.png',
    imageHint: 'professional woman portrait',
    bio: 'Dr. Janssen heeft meer dan 15 jaar ervaring in het werken met kinderen en adolescenten met diverse neurodivergente profielen. Haar expertise ligt in diagnostiek, begeleiding en het ontwikkelen van psycho-educatief materiaal.',
    contribution: 'Dr. Janssen adviseert MindNavigator over de inhoudelijke juistheid van de zelfreflectie-instrumenten en de educatieve content, en helpt bij het waarborgen van een ethische en verantwoorde benadering.',
    linkedinUrl: '#', // Placeholder
  },
  {
    id: 'prof_de_vries',
    name: 'Prof. Dr. Mark de Vries',
    title: 'Hoogleraar Orthopedagogiek',
    imageUrl: 'https://placehold.co/200x200.png',
    imageHint: 'professional man portrait',
    bio: 'Prof. de Vries is een vooraanstaand onderzoeker op het gebied van leerstoornissen en inclusief onderwijs. Hij is verbonden aan [Universiteitsnaam] en heeft diverse publicaties op zijn naam staan.',
    contribution: 'Prof. de Vries draagt bij aan de wetenschappelijke onderbouwing van de MindNavigator methodologie en adviseert over de nieuwste inzichten in neurodiversiteit en educatie.',
    websiteUrl: '#', // Placeholder
  },
  {
    id: 'stichting_focus',
    name: 'Stichting Focus & Welzijn',
    title: 'Expertisecentrum Neurodiversiteit',
    imageUrl: 'https://placehold.co/200x150.png', // Kan een logo zijn
    imageHint: 'organization logo building',
    bio: 'Stichting Focus & Welzijn is een landelijk erkend expertisecentrum dat zich inzet voor de acceptatie en ondersteuning van neurodivergente individuen en hun families.',
    contribution: 'MindNavigator werkt samen met Stichting Focus & Welzijn om de content te valideren en ervoor te zorgen dat deze aansluit bij de behoeften van de doelgroep. Daarnaast helpen zij bij het verspreiden van kennis en het bieden van doorverwijsmogelijkheden.',
    websiteUrl: '#', // Placeholder
  },
];

export default function SamenwerkingenPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-gradient-to-b from-background via-secondary/10 to-background py-12 md:py-20 lg:py-28">
        <div className="container mx-auto">
          <Card className="shadow-xl max-w-4xl mx-auto mb-12">
            <CardHeader className="text-center pb-8">
              <ShieldCheck className="mx-auto h-16 w-16 text-primary mb-4" />
              <CardTitle className="text-4xl font-bold text-foreground">Onze Partners & Deskundigheid</CardTitle>
              <CardDescription className="text-lg text-muted-foreground mt-2">
                De kwaliteit en betrouwbaarheid van MindNavigator wordt ondersteund door samenwerking met professionals.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 text-lg leading-relaxed text-foreground/90">
              <p>
                Bij MindNavigator geloven we sterk in de kracht van samenwerking en de waarde van wetenschappelijk onderbouwde inzichten. Om ervoor te zorgen dat onze content, zelfreflectie-instrumenten en coaching-elementen aansluiten bij de laatste kennis en ethische standaarden, werken wij samen met en laten wij ons adviseren door experts op het gebied van kinder- en jeugdpsychologie, orthopedagogiek en neurodiversiteit.
              </p>
              <p>
                Deze professionals helpen ons de kwaliteit te waarborgen en ervoor te zorgen dat MindNavigator een veilige, verantwoorde en effectieve tool is voor jongeren en hun ouders. Hieronder stellen we enkele van onze belangrijke adviseurs en partners voor.
              </p>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-1 lg:grid-cols-1 gap-8">
            {partnersData.map((partner) => (
              <Card key={partner.id} className="shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-6 flex flex-col md:flex-row items-start gap-6">
                  <div className="md:w-1/3 flex-shrink-0 text-center md:text-left">
                    <div className="relative mx-auto md:mx-0 aspect-square w-40 h-40 md:w-48 md:h-48 rounded-lg overflow-hidden shadow-md mb-3">
                      <Image
                        src={partner.imageUrl}
                        alt={`Foto van ${partner.name}`}
                        fill
                        style={{ objectFit: 'cover' }}
                        data-ai-hint={partner.imageHint}
                      />
                    </div>
                    <h3 className="text-xl font-semibold text-primary">{partner.name}</h3>
                    <p className="text-sm text-muted-foreground">{partner.title}</p>
                    <div className="mt-2 flex justify-center md:justify-start space-x-3">
                        {partner.websiteUrl && (
                            <Link href={partner.websiteUrl} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary">
                                <ExternalLink className="h-5 w-5" />
                                <span className="sr-only">Website</span>
                            </Link>
                        )}
                        {partner.linkedinUrl && (
                             <Link href={partner.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary">
                                <Linkedin className="h-5 w-5" />
                                <span className="sr-only">LinkedIn</span>
                            </Link>
                        )}
                    </div>
                  </div>
                  <div className="md:w-2/3 space-y-3">
                    <div>
                      <h4 className="text-md font-semibold text-foreground mb-1">Over {partner.name.split(' ')[0]}</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">{partner.bio}</p>
                    </div>
                    <div>
                      <h4 className="text-md font-semibold text-foreground mb-1">Bijdrage aan MindNavigator</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">{partner.contribution}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
           <Card className="shadow-xl max-w-4xl mx-auto mt-12">
             <CardContent className="p-6 text-center">
                <p className="text-muted-foreground">
                    MindNavigator blijft zich ontwikkelen. We staan altijd open voor nieuwe samenwerkingen met experts en organisaties die onze missie delen. 
                    <Link href="/contact" className="text-primary hover:underline font-medium"> Neem contact op</Link> als u geïnteresseerd bent.
                </p>
                <p className="mt-4 text-sm text-muted-foreground">
                  Bezoek ook onze <Link href="/about" className="text-primary hover:underline font-medium">Over Ons</Link> pagina voor meer informatie.
                </p>
             </CardContent>
           </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
