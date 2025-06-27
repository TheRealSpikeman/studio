// src/app/terms/page.tsx
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { FileText } from 'lucide-react';
import { TermsContent } from '@/components/legal/LegalContent';

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
          
          <div className="space-y-10 text-base leading-relaxed text-foreground/90 prose prose-lg max-w-none dark:prose-invert">
            <TermsContent />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
