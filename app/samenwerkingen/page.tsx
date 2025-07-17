// src/app/samenwerkingen/page.tsx
"use client";

import { useState } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Link from 'next/link';
import Image from 'next/image';
import { Users, ShieldCheck, Brain, ExternalLink, Linkedin, Handshake, Lightbulb, Telescope } from 'lucide-react';
import { EditableImage } from '@/components/common/EditableImage';
import { useToast } from '@/hooks/use-toast';

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
const initialPartnersData: PartnerProfile[] = [
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
  const [partners, setPartners] = useState(initialPartnersData);
  const { toast } = useToast();

  const handleImageSave = (id: string, newUrl: string) => {
    setPartners(currentPartners => 
      currentPartners.map(p => p.id === id ? { ...p, imageUrl: newUrl } : p)
    );
    // In een echte CMS zou je hier een API-call doen om de data op te slaan.
    // Voor deze demo loggen we het naar de console.
    console.log(`Saved new image URL for partner ${id}: ${newUrl}`);
    toast({
      title: 'Afbeelding opgeslagen!',
      description: `De afbeelding voor ${partners.find(p=>p.id === id)?.name} is bijgewerkt.`,
    });
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-gradient-to-b from-background via-secondary/10 to-background py-12 md:py-20 lg:py-28">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12 md:mb-16">
            <Handshake className="mx-auto h-16 w-16 text-primary mb-4" />
            <h1 className="text-4xl font-bold text-foreground">Onze Partners & Deskundigheid</h1>
            <p className="text-lg text-muted-foreground mt-2">
              De kwaliteit en betrouwbaarheid van MindNavigator wordt ondersteund door samenwerking met professionals.
            </p>
          </div>
          
          <div className="space-y-10 text-base leading-relaxed text-foreground/90">
            <section className="mb-12">
              <h2 className="text-2xl font-semibold text-primary mb-4 flex items-center gap-3">
                <Lightbulb className="h-7 w-7" />
                Onze Aanpak: Kwaliteit en Expertise
              </h2>
              <p className="mb-4">
                Bij MindNavigator geloven we sterk in de kracht van samenwerking en de waarde van wetenschappelijk onderbouwde inzichten. Om ervoor te zorgen dat onze content, zelfreflectie-instrumenten en coaching-elementen aansluiten bij de laatste kennis en ethische standaarden, werken wij samen met en laten wij ons adviseren door experts op het gebied van kinder- en jeugdpsychologie, orthopedagogiek en neurodiversiteit.
              </p>
              <p>
                Deze professionals helpen ons de kwaliteit te waarborgen en ervoor te zorgen dat MindNavigator een veilige, verantwoorde en effectieve tool is voor jongeren en hun ouders.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-primary mb-4 flex items-center gap-3">
                <Users className="h-7 w-7" />
                Onze Partners & Adviseurs
              </h2>
              <p className="mb-6">Hieronder stellen we enkele van onze belangrijke adviseurs en partners voor:</p>
              <div className="space-y-10">
                {partners.map((partner) => (
                  <Card key={partner.id} className="shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
                    <CardContent className="p-0 md:p-0">
                      <div className="flex flex-col md:flex-row items-start">
                        <div className="md:w-1/3 flex-shrink-0 relative">
                           <EditableImage
                                wrapperClassName="aspect-square w-full md:w-full h-auto md:h-full"
                                src={partner.imageUrl}
                                alt={`Foto van ${partner.name}`}
                                fill
                                style={{ objectFit: 'cover' }}
                                data-ai-hint={partner.imageHint}
                                onSave={(newUrl) => handleImageSave(partner.id, newUrl)}
                                uploadPath="images/partners"
                            />
                        </div>
                        <div className="md:w-2/3 p-6 space-y-3">
                          <div>
                            <h3 className="text-2xl font-semibold text-primary mb-1">{partner.name}</h3>
                            <p className="text-md text-muted-foreground font-medium">{partner.title}</p>
                            <div className="mt-2 flex space-x-3">
                                {partner.websiteUrl && (
                                    <Link href={partner.websiteUrl} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                                        <ExternalLink className="h-5 w-5" />
                                        <span className="sr-only">Website</span>
                                    </Link>
                                )}
                                {partner.linkedinUrl && (
                                    <Link href={partner.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                                        <Linkedin className="h-5 w-5" />
                                        <span className="sr-only">LinkedIn</span>
                                    </Link>
                                )}
                            </div>
                          </div>
                          <div>
                            <h4 className="text-lg font-semibold text-foreground mb-1.5">Over {partner.name.split(' ')[0]}</h4>
                            <p className="text-sm text-muted-foreground leading-relaxed">{partner.bio}</p>
                          </div>
                          <div>
                            <h4 className="text-lg font-semibold text-foreground mb-1.5">Bijdrage aan MindNavigator</h4>
                            <p className="text-sm text-muted-foreground leading-relaxed">{partner.contribution}</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
            
            <section className="mt-12 pt-8 border-t border-border text-center">
              <h2 className="text-2xl font-semibold text-primary mb-4 flex items-center gap-3 justify-center">
                  <Telescope className="h-7 w-7"/>
                  Toekomst & Samenwerking
              </h2>
              <p className="text-muted-foreground mb-4">
                  MindNavigator blijft zich ontwikkelen. We staan altijd open voor nieuwe samenwerkingen met experts en organisaties die onze missie delen. 
                  <Link href="/contact" className="text-primary hover:underline font-medium"> Neem contact op</Link> als u geïnteresseerd bent.
              </p>
              <p className="text-sm text-muted-foreground">
                Bezoek ook onze <Link href="/about" className="text-primary hover:underline font-medium">Over Ons</Link> pagina voor meer informatie.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
