// app/legal/LegalContent.tsx

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface LegalContentProps {
  type: 'terms' | 'privacy' | 'disclaimer';
}

const content = {
  terms: {
    title: 'Algemene Voorwaarden',
    body: (
      <>
        <p>Dit is een placeholder voor de algemene voorwaarden. Vervang deze tekst met de daadwerkelijke voorwaarden.</p>
        <h2 className="text-2xl font-bold mt-4">Artikel 1: Toepasselijkheid</h2>
        <p>Deze voorwaarden zijn van toepassing op elk aanbod van de ondernemer en op elke tot stand gekomen overeenkomst op afstand tussen ondernemer en consument.</p>
      </>
    )
  },
  privacy: {
    title: 'Privacybeleid',
    body: (
      <>
        <p>Dit is een placeholder voor het privacybeleid. Vervang deze tekst met het daadwerkelijke beleid.</p>
        <h2 className="text-2xl font-bold mt-4">Gegevensverzameling</h2>
        <p>Wij verzamelen gegevens om onze diensten te kunnen leveren en te verbeteren. Dit omvat persoonlijke informatie die u ons verstrekt bij registratie.</p>
      </>
    )
  },
  disclaimer: {
    title: 'Disclaimer',
    body: (
      <p>De informatie op deze website is uitsluitend bedoeld als algemene informatie. Er kunnen geen rechten aan de informatie op deze website worden ontleend. MindNavigator is niet aansprakelijk voor schade die kan ontstaan als gevolg van onjuiste of incomplete informatie op deze website.</p>
    )
  }
};

export function LegalContent({ type }: LegalContentProps) {
  const { title, body } = content[type];
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="prose prose-lg dark:prose-invert max-w-none">
        {body}
      </CardContent>
    </Card>
  );
}
