
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { FileText, MessageSquareText, BookOpenCheck, Users, BarChart3, ShieldCheck, Zap, Brain } from 'lucide-react';

const benefits = [
  {
    icon: <Brain className="h-10 w-10 text-primary" />,
    title: 'Gespecialiseerde Inzichten (12-18 jr)',
    description: 'Help uw kind zelfinzicht te krijgen met quizzen gericht op neurodiversiteit (o.a. ADD, HSP, ASS-kenmerken). Ontvang heldere rapporten die u en uw kind helpen unieke krachten en uitdagingen te begrijpen.',
    link: '/quizzes',
    linkText: 'Ontdek de quizzen',
  },
  {
    icon: <Zap className="h-10 w-10 text-primary" />,
    title: 'Praktische Coaching & Tools voor Groei',
    description: 'Dagelijkse, laagdrempelige coaching en tools (dagboek, planning) die uw kind ondersteunen bij het ontwikkelen van routines, het vergroten van zelfvertrouwen en het effectief omgaan met school en sociale situaties.',
    link: '/dashboard/coaching',
    linkText: 'Verken coaching',
  },
  {
    icon: <BookOpenCheck className="h-10 w-10 text-primary" />,
    title: 'Huiswerkondersteuning',
    description: 'Effectieve tools en strategieën om uw kind te helpen bij planning, focus en het overwinnen van studie-uitdagingen, direct geïntegreerd in hun dashboard.',
    link: '/dashboard/homework-assistance',
    linkText: 'Bekijk tools',
  },
  {
    icon: <ShieldCheck className="h-10 w-10 text-primary" />,
    title: 'Veilig, Vertrouwd & Deskundig',
    description: 'Een privacygerichte omgeving, speciaal ontworpen voor tieners, onderbouwd door inzichten van experts in neurodiversiteit en pedagogiek.',
    link: '/privacy',
    linkText: 'Lees ons privacybeleid',
  },
];

export function ParentBenefitsSection() {
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Rust en Inzicht voor Uw Gezin: <span className="text-primary">Dit Maakt MindNavigator Uniek</span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
            Ontdek hoe MindNavigator een complete ondersteuningsstructuur biedt, niet alleen voor uw kind, maar ook voor u als ouder.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {benefits.map((benefit, index) => (
            <Card key={index} className="shadow-lg hover:shadow-xl transition-shadow flex flex-col">
              <CardHeader className="flex flex-row items-start gap-4 pb-3">
                <div className="flex-shrink-0 mt-1">{benefit.icon}</div>
                <div>
                  <CardTitle className="text-xl font-semibold text-foreground">{benefit.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-muted-foreground">{benefit.description}</p>
              </CardContent>
              <CardFooter>
                <Button variant="link" asChild className="p-0 h-auto text-primary">
                  <Link href={benefit.link}>{benefit.linkText} &rarr;</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <Card className="shadow-xl bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 items-center">
            <div className="p-8 md:p-10 lg:p-12">
              <div className="flex items-center gap-3 mb-3">
                <BarChart3 className="h-10 w-10 text-primary" />
                <h3 className="text-2xl font-bold text-foreground">Uw Eigen Ouderportaal: Inzicht & Begeleiding</h3>
              </div>
              <p className="text-muted-foreground mb-4 text-base leading-relaxed">
                Met het "Gezins Gids" pakket krijgt u toegang tot een uitgebreid ouder-dashboard. Hiermee kunt u:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-6 pl-2">
                <li>De voortgang en quizresultaten van uw kind (met toestemming) inzien.</li>
                <li>Abonnementen voor uw gezin eenvoudig beheren.</li>
                <li>Effectief communiceren met eventueel gekoppelde coaches en huiswerktutors.</li>
                <li>Toegang krijgen tot specifieke bronnen en tips voor ouders.</li>
              </ul>
              <p className="text-foreground font-medium mb-6">
                U staat er niet alleen voor; wij bieden u de handvatten om uw kind optimaal te ondersteunen.
              </p>
              <Button asChild size="lg">
                <Link href="/#pricing">Ontdek de "Gezins Gids"</Link>
              </Button>
            </div>
            <div className="relative h-64 lg:h-full min-h-[300px] order-first lg:order-last">
              <Image
                src="https://placehold.co/600x450.png"
                alt="Voorbeeld van het MindNavigator Ouder Dashboard interface"
                layout="fill"
                objectFit="cover"
                data-ai-hint="dashboard interface analytics"
                className="opacity-90"
              />
               <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-transparent lg:from-transparent lg:via-transparent lg:to-primary/5"></div>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}
