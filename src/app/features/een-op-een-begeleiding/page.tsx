/src/app/features/een-op-een-begeleiding/page.tsx
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, GraduationCap } from 'lucide-react';

export default function EenOpEenBegeleidingPage() {
  const featureTitle = "1-op-1 Begeleiding (Optioneel)";
  const FeatureIcon = GraduationCap;

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-gradient-to-b from-background via-secondary/10 to-background py-12 md:py-20 lg:py-28">
        <div className="container mx-auto">
          <Button variant="outline" asChild className="mb-8">
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" /> Terug naar Home
            </Link>
          </Button>
          <Card className="shadow-xl max-w-3xl mx-auto">
            <CardHeader className="text-center pb-8">
              <FeatureIcon className="mx-auto h-16 w-16 text-primary mb-4" />
              <CardTitle className="text-4xl font-bold text-foreground">{featureTitle}</CardTitle>
              <CardDescription className="text-lg text-muted-foreground mt-2">
                Persoonlijke hulp van gekwalificeerde tutors en coaches.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 text-lg leading-relaxed text-foreground/90">
              <p>
                Soms is er behoefte aan meer gepersonaliseerde ondersteuning. MindNavigator biedt de mogelijkheid om uw kind te koppelen aan zorgvuldig geselecteerde, gekwalificeerde tutors (voor vakinhoudelijke huiswerkbegeleiding) en coaches (voor persoonlijke ontwikkeling en welzijn).
              </p>
              <p>
                Via ons platform kunt u:
              </p>
              <ul className="list-disc list-inside space-y-2 pl-5">
                <li>Profielen van beschikbare tutors en coaches bekijken.</li>
                <li>Filteren op specialisatie, ervaring en tarieven.</li>
                <li>Direct contact leggen en een kennismakingsgesprek plannen.</li>
                <li>Sessies boeken en beheren via een beveiligde omgeving.</li>
              </ul>
              <p>
                De begeleiding wordt afgestemd op het assessmentprofiel en de specifieke behoeften van uw kind, om zo de meest effectieve ondersteuning te bieden. Deze 1-op-1 begeleiding is een optionele, aanvullende dienst binnen MindNavigator.
              </p>
              <div className="h-40 bg-muted rounded-md flex items-center justify-center">
                <p className="text-muted-foreground italic">Meer informatie over het vinden en boeken van begeleiders komt hier...</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
